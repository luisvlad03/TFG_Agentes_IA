import type { SqliteDatabase } from './db.js'

export type MovementType = 'entry' | 'exit'

export interface ProductInput {
  name: string
  sku: string
  category: string
  price: number
  minimumStock: number
}

export interface Product extends ProductInput {
  id: number
  active: boolean
  stock: number
  lowStock: boolean
}

export interface Movement {
  id: number
  productId: number
  type: MovementType
  quantity: number
  movementDate: string
  note: string | null
}

export interface Summary { activeProducts: number; unitsAvailable: number; lowStockProducts: number }

const productSelect = `
  SELECT p.id, p.name, p.sku, p.category, p.price, p.minimum_stock AS minimumStock, p.active,
    COALESCE(SUM(CASE WHEN m.type = 'entry' THEN m.quantity ELSE -m.quantity END), 0) AS stock
  FROM products p LEFT JOIN movements m ON m.product_id = p.id`

function normalize(input: ProductInput): ProductInput {
  const result = { ...input, name: input.name.trim(), sku: input.sku.trim(), category: input.category.trim() }
  if (!result.name || !result.sku || !result.category) throw new Error('Nombre, SKU y categoría son obligatorios.')
  if (!Number.isFinite(result.price) || result.price < 0) throw new Error('El precio debe ser un número igual o mayor que cero.')
  if (!Number.isInteger(result.minimumStock) || result.minimumStock < 0) throw new Error('El stock mínimo debe ser un entero igual o mayor que cero.')
  return result
}

function rowToProduct(row: Omit<Product, 'lowStock'>): Product {
  return { ...row, active: Boolean(row.active), lowStock: Boolean(row.active) && row.stock <= row.minimumStock }
}

export class InventoryService {
  constructor(private readonly db: SqliteDatabase) {}

  listProducts(options: { query?: string; category?: string; lowStock?: boolean; includeInactive?: boolean } = {}): Product[] {
    const clauses: string[] = []
    const params: Record<string, unknown> = {}
    if (!options.includeInactive) clauses.push('p.active = 1')
    if (options.query) { clauses.push('(p.name LIKE @query OR p.sku LIKE @query)'); params.query = `%${options.query.trim()}%` }
    if (options.category) { clauses.push('p.category = @category'); params.category = options.category }
    const having = options.lowStock ? ' HAVING stock <= minimumStock' : ''
    const where = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''
    const rows = this.db.prepare(`${productSelect}${where} GROUP BY p.id${having} ORDER BY p.name`).all(params) as Omit<Product, 'lowStock'>[]
    return rows.map(rowToProduct)
  }

  getProduct(id: number): Product | undefined {
    const row = this.db.prepare(`${productSelect} WHERE p.id = ? GROUP BY p.id`).get(id) as Omit<Product, 'lowStock'> | undefined
    return row && rowToProduct(row)
  }

  createProduct(input: ProductInput): Product {
    const product = normalize(input)
    try {
      const result = this.db.prepare(`INSERT INTO products (name, sku, category, price, minimum_stock) VALUES (@name, @sku, @category, @price, @minimumStock)`).run(product)
      return this.getProduct(Number(result.lastInsertRowid))!
    } catch (error) {
      if (String(error).includes('UNIQUE constraint failed: products.sku')) throw new Error('El SKU ya está en uso.')
      throw error
    }
  }

  updateProduct(id: number, input: ProductInput): Product {
    const product = normalize(input)
    try {
      const result = this.db.prepare(`UPDATE products SET name=@name, sku=@sku, category=@category, price=@price, minimum_stock=@minimumStock WHERE id=@id`).run({ ...product, id })
      if (!result.changes) throw new Error('Producto no encontrado.')
      return this.getProduct(id)!
    } catch (error) {
      if (String(error).includes('UNIQUE constraint failed: products.sku')) throw new Error('El SKU ya está en uso.')
      throw error
    }
  }

  deactivateProduct(id: number): Product {
    const result = this.db.prepare('UPDATE products SET active = 0 WHERE id = ?').run(id)
    if (!result.changes) throw new Error('Producto no encontrado.')
    return this.getProduct(id)!
  }

  createMovement(input: { productId: number; type: MovementType; quantity: number; movementDate: string; note?: string }): Movement {
    if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw new Error('La cantidad debe ser un entero positivo.')
    if (input.type !== 'entry' && input.type !== 'exit') throw new Error('El tipo de movimiento no es válido.')
    const product = this.getProduct(input.productId)
    if (!product) throw new Error('Producto no encontrado.')
    if (!product.active) throw new Error('No se pueden registrar movimientos para un producto inactivo.')
    if (input.type === 'exit' && input.quantity > product.stock) throw new Error('No hay existencias suficientes para registrar la salida.')
    const result = this.db.prepare(`INSERT INTO movements (product_id, type, quantity, movement_date, note) VALUES (?, ?, ?, ?, ?)`).run(input.productId, input.type, input.quantity, input.movementDate, input.note?.trim() || null)
    return this.db.prepare(`SELECT id, product_id AS productId, type, quantity, movement_date AS movementDate, note FROM movements WHERE id = ?`).get(result.lastInsertRowid) as Movement
  }

  listMovements(productId: number): Movement[] {
    return this.db.prepare(`SELECT id, product_id AS productId, type, quantity, movement_date AS movementDate, note FROM movements WHERE product_id = ? ORDER BY movement_date DESC, id DESC`).all(productId) as Movement[]
  }

  categories(): string[] { return (this.db.prepare('SELECT DISTINCT category FROM products WHERE active = 1 ORDER BY category').all() as { category: string }[]).map(({ category }) => category) }

  summary(): Summary {
    const products = this.listProducts()
    return { activeProducts: products.length, unitsAvailable: products.reduce((total, product) => total + product.stock, 0), lowStockProducts: products.filter((product) => product.lowStock).length }
  }
}
