import { afterEach, describe, expect, it } from 'vitest'
import type { Server } from 'node:http'
import { createApp } from './app.js'
import { createDatabase, type SqliteDatabase } from './db.js'
import { InventoryService } from './inventory.js'

let db: SqliteDatabase | undefined
let server: Server | undefined
afterEach(() => { server?.close(); db?.close(); server = undefined; db = undefined })

describe('API de inventario', () => {
  it('cubre producto, entrada, salida, alerta e historial', async () => {
    db = createDatabase(':memory:')
    server = createApp(new InventoryService(db)).listen(0)
    await new Promise<void>((resolve) => server!.once('listening', resolve))
    const address = server.address()
    const base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`
    const send = (path: string, method = 'GET', body?: object) => fetch(`${base}${path}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })

    const created = await send('/api/products', 'POST', { name: 'Lápiz', sku: 'LAP-01', category: 'Oficina', price: 1, minimumStock: 3 })
    const product = await created.json() as { id: number }
    await send('/api/movements', 'POST', { productId: product.id, type: 'entry', quantity: 5, movementDate: '2026-01-01' })
    await send('/api/movements', 'POST', { productId: product.id, type: 'exit', quantity: 2, movementDate: '2026-01-02', note: 'Venta' })

    const summary = await (await send('/api/summary')).json() as { activeProducts: number; unitsAvailable: number; lowStockProducts: number }
    const history = await (await send(`/api/products/${product.id}/movements`)).json() as unknown[]
    expect(summary).toEqual({ activeProducts: 1, unitsAvailable: 3, lowStockProducts: 1 })
    expect(history).toHaveLength(2)
  })
})
