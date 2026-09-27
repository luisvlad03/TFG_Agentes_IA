## 1. Base de la aplicación y persistencia

- [x] 1.1 Inicializar la aplicación React con TypeScript y Vite, y verificar que la compilación de producción finaliza sin errores.
- [x] 1.2 Incorporar el adaptador SQLite compatible con el entorno de ejecución y definir la capa de repositorios; verificar que la aplicación puede abrir una base de datos local.
- [x] 1.3 Crear el esquema y las migraciones para productos y movimientos, incluidas la unicidad del SKU y las relaciones; verificar la creación de una base vacía mediante una prueba de integración.

## 2. Dominio de productos

- [x] 2.1 Implementar el modelo, repositorio y validaciones de producto (campos obligatorios y SKU único); verificar con pruebas unitarias los casos válido y duplicado.
- [x] 2.2 Implementar los casos de uso para crear, editar, listar y desactivar productos sin borrar su historial; verificar con pruebas de repositorio y casos de uso.
- [x] 2.3 Crear las vistas de catálogo y formulario de producto, con mensajes de validación y estado; verificar manualmente que un producto creado se muestra y uno desactivado no admite movimientos.

## 3. Movimientos y cálculo de stock

- [x] 3.1 Implementar el modelo y repositorio de movimientos con tipos de entrada y salida, cantidad positiva, fecha y nota opcional; verificar persistencia y recuperación mediante pruebas.
- [x] 3.2 Implementar el cálculo de stock a partir de movimientos y la validación que impide saldos negativos; verificar con pruebas de entradas, salidas válidas y salida rechazada.
- [x] 3.3 Implementar el caso de uso y formulario para registrar movimientos solo sobre productos activos; verificar manualmente que el stock y el historial se actualizan tras una entrada y una salida.
- [x] 3.4 Crear la vista de historial por producto con tipo, cantidad, fecha y nota; verificar que sus registros explican el stock mostrado.

## 4. Consulta y alertas

- [x] 4.1 Implementar consultas de resumen para total de productos activos, unidades disponibles y productos con stock bajo; verificar sus resultados con datos de prueba conocidos.
- [x] 4.2 Implementar la detección de stock bajo cuando el saldo sea menor o igual al mínimo; verificar el caso límite de saldo igual al mínimo.
- [x] 4.3 Añadir al catálogo búsqueda por nombre o SKU, filtros por categoría y stock bajo, e indicadores del panel; verificar manualmente cada filtro y sus combinaciones.

## 5. Calidad y entrega

- [x] 5.1 Añadir pruebas de integración que cubran el flujo producto -> entrada -> salida -> alerta -> historial y verificar que la suite completa pasa.
- [x] 5.2 Documentar cómo iniciar, compilar y probar la aplicación, incluidas las limitaciones de la versión local; verificar siguiendo las instrucciones desde un entorno limpio.
