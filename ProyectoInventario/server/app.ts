import express from 'express'
import type { InventoryService } from './inventory.js'

export function createApp(inventory: InventoryService) {
  const app = express()
  app.use(express.json())
  const respond = (handler: (req: express.Request, res: express.Response) => unknown) => (req: express.Request, res: express.Response) => {
    try { return handler(req, res) } catch (error) { return res.status(400).json({ error: error instanceof Error ? error.message : 'Error inesperado.' }) }
  }
  app.get('/api/products', respond((req, res) => res.json(inventory.listProducts({ query: String(req.query.query || ''), category: String(req.query.category || ''), lowStock: req.query.lowStock === 'true', includeInactive: req.query.includeInactive === 'true' }))))
  app.post('/api/products', respond((req, res) => res.status(201).json(inventory.createProduct(req.body))))
  app.put('/api/products/:id', respond((req, res) => res.json(inventory.updateProduct(Number(req.params.id), req.body))))
  app.post('/api/products/:id/deactivate', respond((req, res) => res.json(inventory.deactivateProduct(Number(req.params.id)))))
  app.get('/api/products/:id/movements', respond((req, res) => res.json(inventory.listMovements(Number(req.params.id)))))
  app.post('/api/movements', respond((req, res) => res.status(201).json(inventory.createMovement(req.body))))
  app.get('/api/categories', (_req, res) => res.json(inventory.categories()))
  app.get('/api/summary', (_req, res) => res.json(inventory.summary()))
  return app
}
