# Plan de Implementación para Reproducir el Layout del Perfil

> **Para trabajadores agenticos:** SUB-HABILIDAD REQUERIDA: Usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos utilizan la sintaxis de casilla de verificación (`- [ ]`) para el seguimiento.

**Objetivo:** Reproducir el diseño visual de `Perfil.png` en `src/perfil.html` manteniendo el sistema de plantillas dinámicas impulsado por `src/profile-section.js`.

**Arquitectura:**
- **Cambio Estructural**: Reorganizar el HTML a un flujo de Header (Portada/Quote) $\rightarrow$ Nickname (Banner) $\rightarrow$ Body (Grid).
- **Identidad Dinámica**: Extraer el nombre del usuario desde el array de datos para poblar el banner central del nickname.
- **Posicionamiento con CSS Grid**: Utilizar las clases `.profile-field-[etiqueta]` generadas automáticamente para ubicar los elementos en una rejilla de 12 columnas, omitiendo el orden de inserción secuencial por defecto.
- **Fidelidad Visual**: Aplicar clases de `surface` y `border` de Tailwind para coincidir con la profundidad y los bordes de la imagen de referencia.

**Stack Tecnológico:** HTML, Tailwind CSS, JavaScript (Vanilla).

---

### Tarea 1: Actualización de la Estructura de Datos e Identidad

**Archivos:**
- Modificar: `src/profile-section.js`

- [ ] **Paso 1: Reestructurar `profileData` para seguir el esquema de `topic-section.js`**

Cambiar `profileData` de un array plano de campos a un array de objetos de usuario que contengan `author`, `avatarSrc` y un array de `fields`.

```javascript
const profileData = [
  {
    author: "TEN LEECHAIYAPORNKUL",
    avatarSrc: "https://images2.imgbox.com/0c/77/494XeWpw_o.png", // Actualizar con el avatar correcto de la imagen
    fields: [
      { label: "Reputacion:", content: "22540" },
      { label: "Portada:", content: '<img src="https://2img.net/i.imgur.com/CRbh4w6.png" />' },
      // ... todos los demás campos se mueven aquí
    ],
  },
];
```

- [ ] **Paso 2: Actualizar la lógica de inicialización en `src/profile-section.js`**

Modificar el manejador de `DOMContentLoaded` para:
1. Extraer el primer objeto de usuario de `profileData`.
2. Establecer el texto de `#profile-nickname` con `user.author`.
3. Establecer el src de `#profile-avatar img` con `user.avatarSrc`.
4. Iterar sobre `user.fields` para añadir las plantillas de campos a `#profile-info`.

- [ ] **Paso 3: Commit**

```bash
git add src/profile-section.js
git commit -m "feat(profile): reestructurar datos para seguir el esquema de topic-section"
```

### Tarea 2: Reorganización Estructural del HTML

**Archivos:**
- Modificar: `src/perfil.html`

- [ ] **Paso 1: Reposicionar `#profile-nickname`**

Mover el div `#profile-nickname` para que quede *después* del `#profile-header` y *antes* del `#profile-body` dentro del contenedor `#profile-main`.

- [ ] **Paso 2: Ajustar `#profile-header` para Quote y Portada**

Asegurarse de que `#profile-header` esté estilizado para contener los campos de `quote` y `portada`. 

```html
<!-- src/perfil.html -->
<div id="profile-header" class="grid grid-cols-12 xl:gap-5 gap-2 col-span-12 col-start-1">
  <!-- Quote y Portada serán añadidos aquí por script.js -->
</div>
```

- [ ] **Paso 3: Preparar `#profile-info` para CSS Grid**

Añadir las clases de Tailwind necesarias a `#profile-info` para convertirlo en una rejilla de 12 columnas.

```html
<!-- src/perfil.html -->
<div id="profile-info" class="contents grid grid-cols-12 xl:gap-5 gap-3"></div>
```
*(Nota: eliminar la clase `contents` si interfiere con el layout de grid)*

- [ ] **Paso 4: Commit**

```bash
git add src/perfil.html
git commit -m "style(profile): reorganizar estructura HTML para layout de grid"
```

### Tarea 3: Implementación del Layout con CSS Grid

**Archivos:**
- Modificar: `src/perfil.html`

- [ ] **Paso 1: Actualizar la Plantilla de Campos con Clases de Tailwind**

En lugar de usar CSS externo, actualizaremos el template `#profile-field-template` en `src/perfil.html` para seguir el patrón de utilidades del proyecto.

Modificar el div `.profile-field-container` para incluir:
`surface-2 border border-color-3 rounded-sm p-2 xl:p-3 text-center flex flex-col justify-center items-center`

Y el div `.profile-field-content` para incluir:
`w-full`

- [ ] **Paso 2: Definir el Posicionamiento de la Rejilla (Grid Positioning)**

Añadiremos un bloque `<style>` en `src/perfil.html` para manejar la posición específica de cada campo, ya que esto no puede hacerse con clases genéricas en la plantilla.

```css
/* Mapeo de posicionamiento */
.profile-field-reputacion { grid-column: span 4; grid-row: 1; }
.profile-field-post { grid-column: span 4; grid-row: 1; }
.profile-field-wons { grid-column: span 4; grid-row: 1; }

.profile-field-edad { grid-column: span 4; grid-row: 2; }
.profile-field-grupo { grid-column: span 4; grid-row: 2; }
.profile-field-empresa { grid-column: span 4; grid-row: 2; }

.profile-field-apodos { grid-column: span 8; grid-row: 3; }
.profile-field-personaje { grid-column: 11 / span 2; grid-row: 1 / span 3; }

.profile-field-awards { grid-column: span 12; grid-row: 4; }
.profile-field-medallas { grid-column: span 12; grid-row: 5; }
.profile-field-pases { grid-column: span 12; grid-row: 6; }
.profile-field-inventario { grid-column: span 12; grid-row: 7; }
```

- [ ] **Paso 3: Commit**

```bash
git add src/perfil.html
git commit -m "style(profile): implementar posicionamiento CSS Grid y estilos de plantilla"
```

### Tarea 4: Verificación y Pulido Final

**Archivos:**
- Modificar: `src/perfil.html` / `src/script.js`

- [ ] **Paso 1: Verificar el Layout en el Navegador**

Revisar `http://127.0.0.1:3000/src/perfil.html` y comparar con `Perfil.png`.

- [ ] **Paso 2: Ajustar espacios y rellenos (gaps y paddings)**

Ajustar las clases `gap-x`, `gap-y` y `p-x` para coincidir con el espaciado exacto de la referencia.

- [ ] **Paso 3: Commit Final**

```bash
git add .
git commit -m "style(profile): pulido final del layout y espaciado"
```
