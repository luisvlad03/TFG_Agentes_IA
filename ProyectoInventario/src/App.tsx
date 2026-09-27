import { FormEvent, useEffect, useState } from 'react'
import { api, type Movement, type Product, type Summary } from './api'

const blankProduct = { name: '', sku: '', category: '', price: 0, minimumStock: 0 }
const today = new Date().toISOString().slice(0, 10)

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [summary, setSummary] = useState<Summary>({ activeProducts: 0, unitsAvailable: 0, lowStockProducts: 0 })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [lowStock, setLowStock] = useState(false)
  const [productForm, setProductForm] = useState(blankProduct)
  const [editing, setEditing] = useState<Product | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [movements, setMovements] = useState<Movement[]>([])
  const [movementForm, setMovementForm] = useState<{ type: 'entry' | 'exit'; quantity: number; movementDate: string; note: string }>({ type: 'entry', quantity: 1, movementDate: today, note: '' })
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const params = new URLSearchParams()
      if (query) params.set('query', query)
      if (category) params.set('category', category)
      if (lowStock) params.set('lowStock', 'true')
      const [nextProducts, nextCategories, nextSummary] = await Promise.all([api.products(params.toString()), api.categories(), api.summary()])
      setProducts(nextProducts); setCategories(nextCategories); setSummary(nextSummary)
      if (selected) setSelected(nextProducts.find((product) => product.id === selected.id) ?? null)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo cargar el inventario.') }
  }
  useEffect(() => { void refresh() }, [query, category, lowStock])

  async function loadHistory(product: Product) {
    try { setSelected(product); setMovements(await api.movements(product.id)); setMovementForm({ type: 'entry', quantity: 1, movementDate: today, note: '' }); setError('') }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo cargar el historial.') }
  }
  async function saveProduct(event: FormEvent) {
    event.preventDefault()
    try {
      if (editing) await api.updateProduct(editing.id, productForm); else await api.createProduct(productForm)
      setProductForm(blankProduct); setEditing(null); setError(''); await refresh()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo guardar el producto.') }
  }
  function startEdit(product: Product) { setEditing(product); setProductForm({ name: product.name, sku: product.sku, category: product.category, price: product.price, minimumStock: product.minimumStock }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  async function deactivate(product: Product) { if (confirm(`¿Desactivar ${product.name}?`)) { try { await api.deactivate(product.id); if (selected?.id === product.id) setSelected(null); await refresh() } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo desactivar.') } } }
  async function saveMovement(event: FormEvent) {
    event.preventDefault(); if (!selected) return
    try { await api.createMovement({ productId: selected.id, ...movementForm }); await loadHistory(selected); await refresh(); setError('') }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo registrar el movimiento.') }
  }

  return <main>
    <header><div><p className="eyebrow">INVENTARIO LOCAL</p><h1>Control de existencias</h1></div><p>Productos, movimientos y alertas en un solo lugar.</p></header>
    {error && <div className="error" role="alert">{error}<button onClick={() => setError('')}>Cerrar</button></div>}
    <section className="summary">{[['Productos activos', summary.activeProducts], ['Unidades disponibles', summary.unitsAvailable], ['Stock bajo', summary.lowStockProducts]].map(([label, value]) => <article key={String(label)} className={label === 'Stock bajo' && Number(value) > 0 ? 'warning' : ''}><span>{label}</span><strong>{value}</strong></article>)}</section>
    <section className="grid">
      <form className="card form" onSubmit={saveProduct}><h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
        <label>Nombre<input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} /></label>
        <label>SKU<input required value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} /></label>
        <label>Categoría<input required value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} /></label>
        <div className="two"><label>Precio<input type="number" min="0" step="0.01" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} /></label><label>Stock mínimo<input type="number" min="0" step="1" required value={productForm.minimumStock} onChange={(e) => setProductForm({ ...productForm, minimumStock: Number(e.target.value) })} /></label></div>
        <div className="actions"><button type="submit">{editing ? 'Guardar cambios' : 'Crear producto'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setProductForm(blankProduct) }}>Cancelar</button>}</div>
      </form>
      {selected && <section className="card form"><h2>Movimiento: {selected.name}</h2><p className="stock">Stock actual: <strong>{selected.stock}</strong></p><form onSubmit={saveMovement}>
        <div className="two"><label>Tipo<select value={movementForm.type} onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value as 'entry' | 'exit' })}><option value="entry">Entrada</option><option value="exit">Salida</option></select></label><label>Cantidad<input type="number" min="1" step="1" required value={movementForm.quantity} onChange={(e) => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })} /></label></div>
        <label>Fecha<input type="date" required value={movementForm.movementDate} onChange={(e) => setMovementForm({ ...movementForm, movementDate: e.target.value })} /></label><label>Nota<input value={movementForm.note} onChange={(e) => setMovementForm({ ...movementForm, note: e.target.value })} /></label><button type="submit">Registrar movimiento</button>
      </form></section>}
    </section>
    <section className="card"><div className="toolbar"><h2>Catálogo</h2><input aria-label="Buscar" placeholder="Buscar por nombre o SKU" value={query} onChange={(e) => setQuery(e.target.value)} /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Todas las categorías</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><label className="check"><input type="checkbox" checked={lowStock} onChange={(e) => setLowStock(e.target.checked)} /> Solo stock bajo</label></div>
      <div className="table-wrap"><table><thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Stock</th><th>Precio</th><th></th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className={product.lowStock ? 'low' : ''}><td><strong>{product.name}</strong>{product.lowStock && <small>Stock bajo</small>}</td><td>{product.sku}</td><td>{product.category}</td><td>{product.stock} / mín. {product.minimumStock}</td><td>{product.price.toFixed(2)} €</td><td className="row-actions"><button onClick={() => void loadHistory(product)}>Historial</button><button className="secondary" onClick={() => startEdit(product)}>Editar</button><button className="danger" onClick={() => void deactivate(product)}>Desactivar</button></td></tr>)}{products.length === 0 && <tr><td colSpan={6}>No hay productos que coincidan con los filtros.</td></tr>}</tbody></table></div>
    </section>
    {selected && <section className="card"><div className="toolbar"><h2>Historial de {selected.name}</h2><button className="secondary" onClick={() => setSelected(null)}>Cerrar</button></div><ul className="history">{movements.map((movement) => <li key={movement.id}><strong className={movement.type}>{movement.type === 'entry' ? '+' : '-'}{movement.quantity}</strong><span>{movement.movementDate}</span><span>{movement.note || 'Sin nota'}</span></li>)}{movements.length === 0 && <li>Aún no hay movimientos.</li>}</ul></section>}
  </main>
}
