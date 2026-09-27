## Purpose

Permite revisar rápidamente la situación del inventario mediante indicadores, alertas, búsqueda y filtros operativos.

## ADDED Requirements

### Requirement: Panel de resumen del inventario
El sistema SHALL mostrar un panel con el total de productos activos, las unidades disponibles y el número de productos con stock bajo.

#### Scenario: Mostrar el resumen con inventario existente
- **WHEN** la persona usuaria abre el panel y existen productos activos con movimientos
- **THEN** el sistema muestra los tres indicadores calculados con los datos actuales

### Requirement: Alertas de stock bajo
El sistema SHALL identificar como stock bajo todo producto activo cuyo stock disponible sea menor o igual que su stock mínimo configurado.

#### Scenario: Producto alcanza el mínimo
- **WHEN** una salida deja el stock disponible de un producto igual a su stock mínimo
- **THEN** el producto aparece identificado como producto con stock bajo

### Requirement: Búsqueda y filtrado del inventario
El sistema SHALL permitir filtrar el catálogo por categoría y por condición de stock bajo, y buscar productos por nombre o SKU.

#### Scenario: Buscar por SKU
- **WHEN** la persona usuaria introduce un SKU en la búsqueda
- **THEN** el sistema muestra los productos cuyo SKU coincide con el texto buscado

#### Scenario: Filtrar productos con stock bajo
- **WHEN** la persona usuaria activa el filtro de stock bajo
- **THEN** el sistema muestra solamente los productos activos cuyo stock disponible es menor o igual a su mínimo
