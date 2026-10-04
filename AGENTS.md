# FleetTech Web - Directivas de Arquitectura y Rendimiento para Agentes

## 1. 🛡️ Protocolo de Seguridad Git (ESTRICTO)
- **PROHIBIDO EJECUTAR `git push` SIN AUTORIZACIÓN EXPRESA DEL USUARIO EN EL CHAT.**
- Todos los commits, ramas de prueba y modificaciones se mantienen estrictamente en el entorno local.
- Solo se ejecuta `git push origin <branch>` cuando el usuario lo solicite explícitamente con confirmación textual.

---

## 2. ⚡ Guardarraíles de Rendimiento Obligatorios (Anti-Lag & Core Web Vitals)
1. **Virtualización Obligatoria en Tablas:**
   - Queda terminantemente prohibido renderizar tablas o listas masivas sin virtualización. Emplear `@tanstack/react-virtual` para colecciones con más de 30 elementos.
2. **Control de Layout Thrashing:**
   - Prohibido leer propiedades geométricas del DOM (`offsetHeight`, `clientWidth`, `getBoundingClientRect`) en bucles o antes de mutaciones del DOM.
   - Aplicar `contain: content` o `contain: layout paint` en componentes visuales aislados.
3. **Gestión de Búsquedas y Filtros:**
   - Toda entrada de búsqueda interactiva sobre listas debe incluir *debounce* (mínimo 300ms) y delegar el filtrado a `useTransition` para evitar bloqueo del hilo principal (INP < 50ms).
4. **Optimización de Imágenes:**
   - Toda imagen de evidencia debe incluir `loading="lazy"` y dimensiones o clases de relación de aspecto (`aspect-video`, `aspect-square`) para evitar `CLS > 0.05`.
5. **Caché y Actualizaciones Optimistas:**
   - Usar TanStack Query para todas las peticiones a `fleet-tech-api`. Implementar actualizaciones optimistas en acciones críticas como resolución de defectos o cambio de estado.

---

## 3. 🏛️ Estándares de Código y TypeScript
- **TypeScript Estricto:** Prohibido el uso de `any`. Definir interfaces precisas para todas las respuestas y payloads del API.
- **División de Responsabilidades:** Mantener los componentes de UI delgados; delegar lógica a custom hooks y servicios de API dentro de cada feature (`src/features/<feature>/`).
- **Verificación Automática:** Asegurar que `npm run lint` y `npm run type-check` pasen sin errores antes de finalizar cualquier intervención.
