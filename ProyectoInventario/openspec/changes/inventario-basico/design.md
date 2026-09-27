## Context

El repositorio no contiene todavía una aplicación ni una base de datos. La propuesta define un inventario local de una sola persona usuaria; las especificaciones concretan sus comportamientos observables.

## Goals / Non-Goals

**Goals:**

- Ofrecer una aplicación web de uso local con una experiencia rápida para catálogo, movimientos y consulta de existencias.
- Persistir los datos entre sesiones y mantener una trazabilidad verificable del stock.
- Separar la gestión de productos, los movimientos y las consultas para permitir ampliaciones posteriores.

**Non-Goals:**

- Sincronización entre dispositivos, cuentas de usuario ni control de permisos.
- Integraciones con proveedores, lectores de códigos de barras o sistemas contables.
- Gestión de múltiples almacenes, reservas, lotes o caducidades.

## Decisions

### Aplicación web local con React, TypeScript y Vite

La interfaz se construirá como una aplicación web de una sola página con React, TypeScript y Vite. Esta combinación permite separar vistas y componentes de los casos de uso, ofrece validación estática y deja una base común para futuras integraciones.

Se descarta HTML y JavaScript sin estructura porque el catálogo, formularios y filtros comparten estado y reglas que crecerían rápidamente. También se descarta un backend remoto: no aporta valor al alcance monousuario local inicial.

### Persistencia local con SQLite mediante una capa de repositorios

Los productos y movimientos se guardarán en una base SQLite local. Una capa de repositorios aislará el acceso a datos de los casos de uso de producto y movimiento.

SQLite evita operar un servidor y proporciona consultas, restricciones e integridad para el prototipo. Se descarta almacenar todo en `localStorage`, porque limita las validaciones, las consultas y la evolución del modelo. La elección concreta del adaptador SQLite dependerá del entorno de ejecución elegido al implementar.

### Stock derivado de movimientos inmutables

El stock se calculará sumando entradas y restando salidas; no habrá edición directa del saldo. Antes de confirmar una salida, el caso de uso consultará el saldo actual y rechazará cualquier resultado negativo.

Este enfoque prioriza trazabilidad sobre la simplicidad de guardar un contador mutable. Una corrección posterior se representará con un movimiento compensatorio, no borrando historial.

### Modelo inicial

`Producto` incluirá un identificador interno, nombre, SKU único, categoría, precio, stock mínimo y estado. `Movimiento` incluirá un identificador, producto, tipo, cantidad, fecha y nota opcional. La desactivación conservará producto y movimientos para las consultas históricas.

## Risks / Trade-offs

- [El cálculo de stock a partir del historial puede ser más costoso con muchos movimientos] → Usar agregaciones de base de datos e introducir resúmenes únicamente si el volumen lo exige.
- [Una aplicación exclusivamente local no permite colaboración ni copia de seguridad automática] → Mantener los repositorios desacoplados para facilitar una futura sincronización o exportación.
- [La selección del adaptador SQLite depende del empaquetado final] → Mantener la lógica de dominio independiente de la librería y decidir el adaptador en la fase de implementación.

## Migration Plan

Al no existir usuarios ni datos previos, el despliegue inicial crea el esquema vacío de productos y movimientos. Si la versión se revierte antes de introducir migraciones posteriores, basta con conservar la base de datos; no hay conversión de datos heredados.
