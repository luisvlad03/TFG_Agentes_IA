# Herramientas del Proyecto

## OpenSpec

OpenSpec no está instalado directamente en este sistema. Se ejecuta mediante un contenedor Docker reutilizable instalado en `openspec-tool/`.

### Ejecución desde Windows PowerShell

Para ejecutar comandos de OpenSpec, utiliza:

```powershell
& "$HOME\openspec-tool\openspec.cmd" <comando> <argumentos>
```

**Ejemplos:**

```powershell
& "$HOME\openspec-tool\openspec.cmd" --version
& "$HOME\openspec-tool\openspec.cmd" --help
& "$HOME\openspec-tool\openspec.cmd" list
& "$HOME\openspec-tool\openspec.cmd" list --specs
& "$HOME\openspec-tool\openspec.cmd" validate --all
& "$HOME\openspec-tool\openspec.cmd" status
```

### Comandos principales para el flujo de trabajo

1. **Explorar sin modificar:**
   ```powershell
   & "$HOME\openspec-tool\openspec.cmd" explore --help
   ```
   Utiliza la skill `$openspec-explore` en el chat del agente (Codex).

2. **Crear una propuesta:**
   ```powershell
   & "$HOME\openspec-tool\openspec.cmd" propose "nombre-del-cambio"
   ```
   O invoca `$openspec-propose` en el chat del agente.

3. **Aplicar un cambio:**
   ```powershell
   & "$HOME\openspec-tool\openspec.cmd" apply "nombre-del-cambio"
   ```
   O utiliza `$openspec-apply-change` en el chat del agente.

4. **Sincronizar especificaciones:**
   ```powershell
   & "$HOME\openspec-tool\openspec.cmd" sync "nombre-del-cambio"
   ```
   O invoca `$openspec-sync-specs`.

5. **Archivar un cambio completado:**
   ```powershell
   & "$HOME\openspec-tool\openspec.cmd" archive "nombre-del-cambio"
   ```

### Integración con Codex

Las skills están disponibles en `.agents/skills/`:

- `$openspec-explore` — Analiza requisitos, código y decisiones sin modificar.
- `$openspec-propose` — Crea una propuesta para un cambio.
- `$openspec-apply-change` — Implementa el cambio y ejecuta tareas.
- `$openspec-sync-specs` — Sincroniza especificaciones al main.
- `$openspec-archive-change` — Archiva un cambio completado.
- `$openspec-update-change` — Actualiza un cambio existente.

Después de ejecutar `openspec init` en VS Code, recarga la ventana si las skills no aparecen en el panel de Codex.

### Notas

- No es necesario una clave de OpenAI. La autenticación pertenece al agente (Codex).
- Los contenedores temporales se eliminan tras cada comando.
- Los archivos generados (`openspec/`, `.agents/`, `spec/`) permanecen en el proyecto y deben versionarse con Git.
- No confundas el CLI de OpenSpec (contenedor Docker) con la herramienta de IA (Codex en VS Code).
