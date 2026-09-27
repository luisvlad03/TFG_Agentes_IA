## Purpose

Permite registrar entradas y salidas de existencias y obtener un stock trazable a partir de su historial de movimientos.

## ADDED Requirements

### Requirement: Registro de movimientos de inventario
El sistema SHALL permitir registrar una entrada o salida para un producto activo. Cada movimiento MUST incluir producto, tipo, cantidad positiva y fecha; la nota será opcional.

#### Scenario: Registrar una entrada
- **WHEN** la persona usuaria registra una entrada válida de un producto activo
- **THEN** el sistema añade el movimiento al historial e incrementa el stock disponible en la cantidad indicada

#### Scenario: Registrar una salida con existencias suficientes
- **WHEN** la persona usuaria registra una salida válida cuya cantidad no excede el stock disponible
- **THEN** el sistema añade el movimiento al historial y reduce el stock disponible en la cantidad indicada

#### Scenario: Rechazar una salida que deja stock negativo
- **WHEN** la persona usuaria intenta registrar una salida mayor que el stock disponible
- **THEN** el sistema rechaza el movimiento e informa que no hay existencias suficientes

### Requirement: Stock calculado y trazable
El sistema SHALL calcular el stock disponible de cada producto como la suma de las entradas menos la suma de las salidas registradas. El sistema MUST conservar los movimientos registrados como historial de consulta.

#### Scenario: Consultar el historial de un producto
- **WHEN** la persona usuaria consulta un producto con movimientos registrados
- **THEN** el sistema muestra sus movimientos con tipo, cantidad, fecha y nota, y el stock resulta coherente con dicho historial
