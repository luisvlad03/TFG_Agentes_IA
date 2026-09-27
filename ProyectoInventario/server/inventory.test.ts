import { afterEach, describe, expect, it } from 'vitest'
import { createDatabase, type SqliteDatabase } from './db.js'
import { InventoryService } from './inventory.js'

let db: SqliteDatabase | undefined
function service() { db = createDatabase(':memory:'); return new InventoryService(db) }
afterEach(() => db?.close())

describe('InventoryService', () => {
  it('guarda productos y rechaza SKU duplicados', () => {
    const inventory = service()
    inventory.createProduct({ name: 'Café', sku: 'CAF-01', category: 'Alimentación', price: 3.5, minimumStock: 2 })
    expect(() => inventory.createProduct({ name: 'Otro', sku: 'CAF-01', category: 'Alimentación', price: 2, minimumStock: 1 })).toThrow('SKU')
  })

  it('calcula stock, alerta en el mínimo y conserva el historial', () => {
    const inventory = service()
    const product = inventory.createProduct({ name: 'Tornillos', sku: 'TOR-01', category: 'Ferretería', price: 1, minimumStock: 3 })
    inventory.createMovement({ productId: product.id, type: 'entry', quantity: 5, movementDate: '2026-01-01' })
    inventory.createMovement({ productId: product.id, type: 'exit', quantity: 2, movementDate: '2026-01-02', note: 'Venta' })
    expect(inventory.getProduct(product.id)).toMatchObject({ stock: 3, lowStock: true })
    expect(inventory.listMovements(product.id)).toHaveLength(2)
    expect(() => inventory.createMovement({ productId: product.id, type: 'exit', quantity: 4, movementDate: '2026-01-03' })).toThrow('existencias')
  })

  it('no permite movimientos en productos desactivados', () => {
    const inventory = service()
    const product = inventory.createProduct({ name: 'Papel', sku: 'PAP-01', category: 'Oficina', price: 2, minimumStock: 0 })
    inventory.deactivateProduct(product.id)
    expect(() => inventory.createMovement({ productId: product.id, type: 'entry', quantity: 1, movementDate: '2026-01-01' })).toThrow('inactivo')
  })
})
