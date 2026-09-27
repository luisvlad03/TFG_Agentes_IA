import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'
import { createDatabase } from './db.js'
import { InventoryService } from './inventory.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const databasePath = process.env.INVENTORY_DB ?? join(root, 'data', 'inventario.db')
const port = Number(process.env.PORT ?? 3001)
const app = createApp(new InventoryService(createDatabase(databasePath)))
app.listen(port, () => console.log(`API de inventario disponible en http://localhost:${port}`))
