## Why

Los pequeños negocios necesitan conocer sus existencias y registrar cada entrada o salida sin depender de hojas de cálculo dispersas ni de ajustes manuales que impidan auditar el stock. Este primer incremento establece una base local, sencilla y trazable para operar un inventario.

## What Changes

- Incorporar un catálogo de productos con SKU único, categoría, precio, stock mínimo y estado activo.
- Registrar movimientos de entrada y salida con cantidad, fecha y nota opcional.
- Calcular las existencias exclusivamente a partir del historial de movimientos e impedir salidas que produzcan stock negativo.
- Ofrecer un panel de inventario con indicadores, búsqueda, filtros y alertas de bajo stock.
- Limitar la primera versión a una única persona usuaria, sin autenticación ni gestión de proveedores o almacenes múltiples.

## Capabilities

### New Capabilities

- `gestion-productos`: Mantiene el catálogo de productos y sus datos operativos.
- `movimientos-inventario`: Registra movimientos y calcula el stock disponible de forma trazable.
- `consulta-inventario`: Presenta indicadores, búsqueda, filtros y alertas sobre las existencias.

### Modified Capabilities

- Ninguna.

## Impact

- Se añadirá una aplicación web y una persistencia local para productos y movimientos.
- No se exponen APIs públicas ni se requieren integraciones externas en esta versión.
- Las futuras capacidades, como usuarios, proveedores, códigos de barras, exportaciones y múltiples almacenes, quedan fuera de alcance.
