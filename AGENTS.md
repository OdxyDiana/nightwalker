# Proyecto Nightwalker - AGENTS.md

## Stack Tecnológico
- Tailwind CSS 4 (configuración basada en CSS)
- JavaScript Vanilla
- Node.js

## Estructura y Construcción
- `src/`: Todos los archivos fuente (HTML, CSS, JS).
- `src/input.css` $\rightarrow$ `src/output.css`: Gestionado mediante Tailwind CLI.
- **Comandos**:
  - `npm run build:css`: Minifica y construye el CSS.
  - `npm run watch:css`: Observa y construye el CSS automáticamente.

## Detalles de Implementación
- **Cambio de Tema**: Utiliza el atributo `data-theme` en el elemento `<html>` (valores: `light`, `dark`).
- **Persistencia**: La preferencia de tema se guarda en `localStorage` como `data-theme`.
- **Lógica del DOM**: `src/script.js` gestiona el tema global y la distribución dinámica de campos para posts y perfiles.
- **Lógica de Componentes**: Comportamientos especializados en `topic-section.js`, `profile-section.js` y `forum-section.js`.

## Guías de Flujo de Trabajo
- Nunca trabajar ni hacer push a la rama `develop`.
- No realizar merges ni pull requests de forma independiente.
- No refactorizar código existente sin permiso explícito.
- **Modo de Edición**: Si el agente se encuentra en "Plan Mode", debe notificar al usuario y solicitar el cambio a "Build Mode" antes de intentar cualquier escritura o modificación de archivos.
