export interface Product { id: number; name: string; sku: string; category: string; price: number; minimumStock: number; active: boolean; stock: number; lowStock: boolean }
export interface Movement { id: number; productId: number; type: 'entry' | 'exit'; quantity: number; movementDate: string; note: string | null }
export interface Summary { activeProducts: number; unitsAvailable: number; lowStockProducts: number }

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || 'No se pudo completar la operación.')
  return payload as T
}

export const api = {
  products: (query = '') => request<Product[]>(`/api/products?${query}`),
  categories: () => request<string[]>('/api/categories'),
  summary: () => request<Summary>('/api/summary'),
  createProduct: (body: Omit<Product, 'id' | 'active' | 'stock' | 'lowStock'>) => request<Product>('/api/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: number, body: Omit<Product, 'id' | 'active' | 'stock' | 'lowStock'>) => request<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deactivate: (id: number) => request<Product>(`/api/products/${id}/deactivate`, { method: 'POST' }),
  movements: (id: number) => request<Movement[]>(`/api/products/${id}/movements`),
  createMovement: (body: { productId: number; type: 'entry' | 'exit'; quantity: number; movementDate: string; note?: string }) => request<Movement>('/api/movements', { method: 'POST', body: JSON.stringify(body) }),
}
