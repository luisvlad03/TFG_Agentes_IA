# ProyectoInventario — Piloto de IA

Proyecto piloto para validar la integración de OpenSpec + Codex en un equipo multiagente de IA.

## Estructura

```
ProyectoInventario/
├── prototype/        # Prototipo HTML de referencia (opcional)
├── src/              # Código fuente de la aplicación
├── openspec/         # Especificaciones, cambios y diseños gestionados por OpenSpec
│   ├── specs/
│   ├── changes/
│   └── config.yaml
├── .agents/          # Skills generadas por OpenSpec para Codex
├── docs/             # Documentación del proyecto
├── AGENTS.md         # Instrucciones para ejecutar OpenSpec
└── README.md         # Este archivo
```

## Requisitos previos

- Docker Desktop iniciado.
- Visual Studio Code con la extensión de Codex instalada y autenticada.
- Carpeta `openspec-tool` en `$HOME\openspec-tool\` con el wrapper Docker.

## Inicio rápido

### 1. Abrir el proyecto en VS Code

```powershell
cd "$HOME\ProjectFolder\ProyectoInventario"
code .
```

Abre la raíz del proyecto en Visual Studio Code.

### 2. Recargar la ventana

Después de abrir, recarga la ventana (Ctrl+Shift+P → "Developer: Reload Window") para que Codex detecte las skills en `.agents/`.

### 3. Usar OpenSpec con Codex

En el chat de Codex, escribe `$` para ver las skills disponibles:

```
$openspec-explore
Analiza la estructura del proyecto. ¿Qué componentes, funcionalidades y decisiones observas?
```

### 4. Ciclo de trabajo típico

1. **Explore:** `$openspec-explore` — Investiga requisitos y decisiones sin modificar.
2. **Propose:** `$openspec-propose` — Crea una propuesta para el siguiente incremento.
3. **Apply:** `$openspec-apply-change` — Implementa el cambio en el código.
4. **Validate:** Ejecuta pruebas y comprobaciones manuales.
5. **Sync:** `$openspec-sync-specs` — Sincroniza las especificaciones del cambio al nivel principal.
6. **Archive:** `$openspec-archive-change` — Cierra el cambio cuando esté completado y validado.

Ver `AGENTS.md` para más detalles.

## Próximos pasos

1. Crear un prototipo HTML en `prototype/` o código inicial en `src/`.
2. Ejecutar `$openspec-explore` para analizar la situación actual.
3. Proponer el primer cambio con `$openspec-propose "nombre"`.
4. Revisar `openspec/changes/nombre/` — `proposal.md`, `design.md`, `specs/` y `tasks.md`.
5. Ejecutar `$openspec-apply-change` para implementar.
6. Comprobar el resultado con pruebas locales.
7. Sincronizar y archivar cuando esté listo.

## Comandos útiles

Ver `AGENTS.md` para instrucciones completas.

```powershell
# Ver versión de OpenSpec
& "$HOME\openspec-tool\openspec.cmd" --version

# Listar cambios activos
& "$HOME\openspec-tool\openspec.cmd" list

# Validar configuración
& "$HOME\openspec-tool\openspec.cmd" validate --all

# Ver todas las skills
Get-ChildItem .agents\skills
```

## Notas importantes

- OpenSpec se ejecuta **dentro de Docker**. No instales OpenSpec localmente.
- El agente Codex se ejecuta **en VS Code**. Proporciona el contexto, lee las specifications y modifica el código.
- Los archivos generados (`openspec/`, `.agents/`) deben versionarse con Git.
- Las decisiones y especificaciones quedan registradas en `openspec/changes/`.
- No uses la ruta `C:\Users\gayox\...` del README original. Utiliza siempre `$HOME\openspec-tool\openspec.cmd`.

## Recursos

- [OpenSpec docs](https://github.com/Fission-AI/OpenSpec)
- [AGENTS.md](./AGENTS.md)
