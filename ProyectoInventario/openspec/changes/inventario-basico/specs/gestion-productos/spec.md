## Purpose

Permite mantener un catálogo consistente de productos con los datos necesarios para operar y vigilar el inventario.

## ADDED Requirements

### Requirement: Gestión del catálogo de productos
El sistema SHALL permitir crear, consultar, editar y desactivar productos. Cada producto MUST incluir nombre, SKU, categoría, precio, stock mínimo y estado activo o inactivo.

#### Scenario: Crear un producto activo
- **WHEN** la persona usuaria guarda un producto con todos los campos obligatorios válidos y un SKU no utilizado
- **THEN** el sistema registra el producto como activo y lo muestra en el catálogo

#### Scenario: Rechazar un SKU duplicado
- **WHEN** la persona usuaria intenta guardar un producto con un SKU que ya corresponde a otro producto
- **THEN** el sistema rechaza el guardado e informa que el SKU debe ser único

#### Scenario: Desactivar un producto
- **WHEN** la persona usuaria desactiva un producto existente
- **THEN** el producto conserva su historial y deja de estar disponible para registrar nuevos movimientos

### Requirement: Consulta del catálogo de productos
El sistema SHALL mostrar los productos con su categoría, estado, stock disponible y si su stock está por debajo o igual a su mínimo configurado.

#### Scenario: Consultar productos activos
- **WHEN** la persona usuaria abre el catálogo sin filtros
- **THEN** el sistema muestra los productos activos con sus datos operativos y stock actual
