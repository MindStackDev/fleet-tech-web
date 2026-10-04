# 💻 Fleet Tech Web (Dashboard & Backoffice)

Plataforma web empresarial para la administración centralizada de flotas vehiculares, monitoreo de operaciones de patio en tiempo real, triage y resolución de defectos mecánicos/eléctricos, auditoría de relevos de turno y gestión de plantillas dinámicas de checklist. Conectada directamente a [`fleet-tech-api`](../fleet-tech-api).

---

## 📑 Tabla de Contenidos

- [💻 Fleet Tech Web (Dashboard \& Backoffice)](#-fleet-tech-web-dashboard--backoffice)
  - [📑 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🌟 Alcance y Módulos del Sistema](#-alcance-y-módulos-del-sistema)
  - [🛠️ Stack Tecnológico](#️-stack-tecnológico)
  - [🏛️ Arquitectura Modular (Feature-Driven / Clean Web)](#️-arquitectura-modular-feature-driven--clean-web)
    - [📂 Estructura de Directorios (`src/`)](#-estructura-de-directorios-src)
  - [⚡ Pautas de Rendimiento Web \& Renderizado Anti-Lag](#-pautas-de-rendimiento-web--renderizado-anti-lag)
    - [1. Metas Estrictas de Core Web Vitals](#1-metas-estrictas-de-core-web-vitals)
    - [2. Virtualización de Grandes Volúmenes de Datos (Tablas y Grillas)](#2-virtualización-de-grandes-volúmenes-de-datos-tablas-y-grillas)
    - [3. Prevención de Layout Thrashing y Aislamiento CSS](#3-prevención-de-layout-thrashing-y-aislamiento-css)
    - [4. Renderizado Concurrente, Transiciones y Debounce](#4-renderizado-concurrente-transiciones-y-debounce)
    - [5. Gestión Eficiente del Estado del Servidor con TanStack Query](#5-gestión-eficiente-del-estado-del-servidor-con-tanstack-query)
    - [6. Estrategia de Code-Splitting y Optimización de Bundles](#6-estrategia-de-code-splitting-y-optimización-de-bundles)
    - [7. Galería de Evidencias Fotográficas de Alto Rendimiento](#7-galería-de-evidencias-fotográficas-de-alto-rendimiento)
  - [🎯 Matriz de Skills \& Competencias del Ingeniero Frontend](#-matriz-de-skills--competencias-del-ingeniero-frontend)
  - [🔌 Integración y Contratos con `fleet-tech-api`](#-integración-y-contratos-con-fleet-tech-api)
    - [Gestión de Tokens y Sesión Sanctum](#gestión-de-tokens-y-sesión-sanctum)
    - [Consumo y Triage de Defectos](#consumo-y-triage-de-defectos)
  - [🚀 Puesta en Marcha y Despliegue](#-puesta-en-marcha-y-despliegue)
  - [🧪 Monitoreo y Auditoría con Lighthouse y Web Vitals](#-monitoreo-y-auditoría-con-lighthouse-y-web-vitals)

---

## 🌟 Alcance y Módulos del Sistema

`fleet-tech-web` es el centro de comando para supervisores de taller y administradores de flota, cubriendo los siguientes requerimientos operativos:

1. **Matriz de Estado de Patio en Tiempo Real:** Visualización gráfica y tabular de la flota completa (unidades en servicio, bahías ocupadas, unidades bloqueadas por mantenimiento preventivo).
2. **Consola de Triage y Resolución de Defectos:** Panel de control de fallas reportadas desde `fleet-tech-mobile`. Permite a los técnicos de taller examinar las fotos de evidencia, registrar la acción correctiva, adjuntar la fotografía de la reparación y desbloquear el vehículo a estado `active`.
3. **Auditoría de Relevos de Turno e Inspecciones:** Inspección detallada de bitácoras de turno con visor de doble firma digital del operador saliente y entrante, odómetro, combustible y coordenadas GPS.
4. **Diseñador de Plantillas de Checklist Dinámicas:** Constructor drag-and-drop de formularios con secciones (`Cabina`, `Motor`, `Herramientas`, etc.) y tipos de pregunta (`boolean`, `select`, `text`, `photo`, `signature`).
5. **Control de Inventario y Hardware Telemático:** Gestión y auditoría de dispositivos GPS, MDVR, sensores y su historial de instalación en los vehículos.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Justificación Técnica |
| :--- | :--- | :--- |
| **Lenguaje** | TypeScript 5.5+ | Tipado estricto en contratos API, interfaces y modelos de dominio |
| **Framework UI** | React 19 / Vite 5.x | Renderizado concurrente, Server Actions y bundling ultra-rápido con Rollup |
| **Estilos & UI System** | Tailwind CSS v4 + Radix UI / Shadcn UI | Componentes accesibles (WAI-ARIA), cero sobrecarga en tiempo de ejecución (Atomic CSS) |
| **Gestión de Estado Servidor** | TanStack Query v5 | Caché reactiva en memoria, deduplicación de requests y actualizaciones optimistas |
| **Gestión de Estado Cliente** | Zustand 5.x | Estado local ligero, sin boilerplate ni problemas de context re-renders |
| **Virtualización** | `@tanstack/react-virtual` | Renderizado eficiente de miles de registros DOM de vehículos e inspecciones |
| **Iconografía** | Lucide React | Paquete optimizado con importación atómica para tree-shaking |
| **Tablas Complejas** | TanStack Table v8 | Paginación, ordenamiento multinivel y filtros en memoria sin ataduras a la UI |

---

## 🏛️ Arquitectura Modular (Feature-Driven / Clean Web)

La aplicación sigue el enfoque de **Feature-Driven Architecture**, desacoplando la lógica de negocio y las llamadas a la API de la capa de componentes visuales.

```mermaid
graph TD
    subgraph UI_Layer ["Capa de Presentación"]
        Views[Páginas y Vistas] --> Comp[Componentes Atómicos UI]
        Views --> Hooks[Custom Hooks & Selectores]
    end

    subgraph Business_State_Layer ["Capa de Estado y Casos de Uso"]
        Hooks --> ZustandStore[Zustand (Estado UI Local)]
        Hooks --> TanStackQuery[TanStack Query (Estado Remoto)]
    end

    subgraph Service_Data_Layer ["Capa de Infraestructura y Red"]
        TanStackQuery --> ApiClients[API Services & Endpoints]
        ApiClients --> AxiosInstance[Axios Interceptor / Fetch]
        AxiosInstance --> Backend[fleet-tech-api]
    end
```

### 📂 Estructura de Directorios (`src/`)

```text
src/
├── app/                                        # Proveedores de contexto globales, router y estilos
│   ├── providers/                              # QueryClientProvider, AuthProvider, ThemeProvider
│   ├── routes/                                 # Definición de rutas protegidas y públicas
│   └── main.tsx                                # Punto de entrada principal de React
│
├── core/                                       # Componentes transversales y configuración
│   ├── api/                                    # Cliente HTTP Axios configurado con interceptores
│   ├── config/                                 # Variables de entorno validadas con Zod
│   ├── constants/                              # Enums de negocio, rutas y claves de almacenamiento
│   ├── types/                                  # Definiciones de tipos globales y ApiResponse<T>
│   └── utils/                                  # Formateadores, helpers de fecha, conversores de unidades
│
├── features/                                   # Módulos de negocio autocontenidos
│   ├── auth/                                   # Login, recuperación de contraseña, guardia de roles
│   │   ├── api/                                # Hooks useLogin, useLogout, useProfile
│   │   ├── components/                         # LoginForm, UserMenu
│   │   └── types/                              # AuthUser, LoginCredentials
│   │
│   ├── fleet/                                  # Gestión vehicular y vista de patio
│   │   ├── api/                                # useVehicles, useVehicleTypes, useCreateVehicle
│   │   ├── components/                         # VehicleVirtualTable, YardBayGrid, VehicleDetailModal
│   │   └── types/
│   │
│   ├── defects/                                # Consola de triage y resolución de averías
│   │   ├── api/                                # useDefects, useResolveDefect
│   │   ├── components/                         # DefectCard, EvidenceGallery, DefectResolutionDialog
│   │   └── types/
│   │
│   ├── inspections/                            # Auditoría de inspecciones y relevos de turno
│   │   ├── api/                                # useInspections, useInspectionDetail
│   │   ├── components/                         # InspectionTimeline, DualSignatureViewer, OdometersDelta
│   │   └── types/
│   │
│   └── checklist-templates/                    # Editor visual de plantillas dinámicas
│       ├── api/                                # useChecklistTemplates, useSaveTemplate
│       ├── components/                         # TemplateBuilderCanvas, SectionEditor, ItemEditor
│       └── types/
│
└── shared/                                     # Biblioteca de componentes UI reutilizables
    ├── components/                             # Botones, Modales, Badges, Inputs (Shadcn/Radix)
    └── hooks/                                  # useDebounce, useVirtualScroll, useLocalStorage
```

---

## ⚡ Pautas de Rendimiento Web & Renderizado Anti-Lag

Para evitar el temido lag en pantallas con cientos de vehículos o bitácoras densas, es mandatario aplicar las siguientes optimizaciones de ingeniería web:

### 1. Metas Estrictas de Core Web Vitals

| Métrica | Objetivo Óptimo | Límite Máximo Aceptable | Estrategia de Cumplimiento |
| :--- | :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | `< 1.2s` | `2.0s` | Compresión de assets, precarga de fuentes y SSR/SSG en páginas estáticas |
| **INP** (Interaction to Next Paint) | `< 50ms` | `100ms` | Evitar bloqueo del hilo principal con `useTransition`, tareas divididas |
| **CLS** (Cumulative Layout Shift) | `0.00` | `< 0.05` | Reserva explícita de dimensiones (`aspect-ratio`, skeletons fijos) |
| **TBT** (Total Blocking Time) | `< 100ms` | `150ms` | Cero tareas largas (>50ms) en el hilo principal durante el procesamiento de datos |

---

### 2. Virtualización de Grandes Volúmenes de Datos (Tablas y Grillas)

En operaciones de gran escala, una flota puede contar con miles de vehículos y decenas de miles de inspecciones.
- ❌ **Prohibido:** Renderizar cientos de elementos `<tr>` o `<div>` directamente en el DOM. Esto eleva el uso de memoria a cientos de megabytes y causa congelamiento total (*freeze*) al filtrar o desplazarse.
- ✅ **Mandatorio:** Utilizar `@tanstack/react-virtual` para renderizar únicamente los elementos visibles en la ventana de desplazamiento (**viewport**), reutilizando los nodos del DOM.

```tsx
// src/features/fleet/components/VehicleVirtualTable.tsx
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Vehicle } from '../types';

interface VehicleVirtualTableProps {
  vehicles: Vehicle[];
}

export const VehicleVirtualTable: React.FC<VehicleVirtualTableProps> = ({ vehicles }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: vehicles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52, // Altura estimada de fila en píxeles
    overscan: 10,           // Margen de precarga fuera de pantalla para scroll fluido
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto border rounded-lg shadow-sm"
      style={{ contain: 'strict' }} // Aísla layout y repintado del resto del DOM
    >
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const vehicle = vehicles[virtualRow.index];
          return (
            <div
              key={vehicle.id}
              className="absolute top-0 left-0 w-full h-[52px] flex items-center px-4 border-b hover:bg-slate-50 transition-colors"
              style={{
                transform: `translateY(${virtualRow.start}px)`, // GPU accelerated transform
              }}
            >
              <span className="font-semibold w-32">{vehicle.plate_number}</span>
              <span className="w-48 text-slate-600">{vehicle.brand} {vehicle.model}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                vehicle.status === 'in_maintenance' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {vehicle.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

---

### 3. Prevención de Layout Thrashing y Aislamiento CSS

El recálculo forzado de layout (*Forced Synchronous Layout*) ocurre cuando el código lee propiedades geométricas (`offsetWidth`, `clientHeight`, `getBoundingClientRect`) inmediatamente después de escribir en el DOM.

#### Buenas Prácticas Mandatorias:
1. **Aislamiento con CSS Containment:** Añadir `contain: content` o `contain: layout paint` a widgets independientes del panel (ej. tarjetas de métricas, galerías de fotos).
2. **Uso de `content-visibility: auto`:** Para secciones de la página que no están en el viewport inicial, aplicar `content-visibility: auto; contain-intrinsic-size: 500px;` para omitir el costo de renderizado inicial por parte del navegador.

```css
/* src/app/styles/performance.css */
.dashboard-card-isolated {
  contain: layout paint;
  content-visibility: auto;
  contain-intrinsic-size: 0 350px;
}
```

---

### 4. Renderizado Concurrente, Transiciones y Debounce

Al buscar vehículos por placa o filtrar defectos en tiempo real:
- Utilizar **Debounce (300ms)** en los inputs de búsqueda para evitar ráfagas de consultas a la API.
- Emplear `useTransition` de React 19 para marcar el filtrado de listas grandes como una actualización de baja prioridad, garantizando que el cursor del teclado no sufra retraso alguno (INP < 50ms).

```tsx
// src/features/fleet/components/VehicleSearchInput.tsx
import { useState, useTransition } from 'react';

export const VehicleSearchInput = ({ onFilterChange }: { onFilterChange: (query: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Actualización urgente e instantánea de la UI

    // La operación pesada de filtrado se procesa en segundo plano sin congelar el input
    startTransition(() => {
      onFilterChange(value);
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Buscar por placa, modelo o VIN..."
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      />
      {isPending && (
        <span className="absolute right-3 top-2.5 text-xs text-slate-400">Filtrando...</span>
      )}
    </div>
  );
};
```

---

### 5. Gestión Eficiente del Estado del Servidor con TanStack Query

Para evitar peticiones redundantes y asegurar datos actualizados:
1. **Configuración de Stale-Time:** Definir un `staleTime` razonable (`60_000` ms para listados vehiculares y plantillas de checklist).
2. **Actualizaciones Optimistas (Optimistic Updates):** Al resolver un defecto (`PATCH /api/v1/defects/{id}/resolve`), actualizar inmediatamente el estado visual en la tabla antes de que regrese la respuesta del servidor, revirtiendo únicamente en caso de error HTTP.

---

### 6. Estrategia de Code-Splitting y Optimización de Bundles

1. **Carga Perezosa de Rutas:** Ningún componente de página administrativa pesada debe cargarse en el bundle inicial. Se utiliza `React.lazy()` con `Suspense`.
2. **División de Chunks en Vite:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-tanstack': ['@tanstack/react-query', '@tanstack/react-virtual', '@tanstack/react-table'],
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});
```

---

### 7. Galería de Evidencias Fotográficas de Alto Rendimiento

El visor de inspecciones requiere mostrar decenas de imágenes de evidencia (daños, neumáticos, precintos).
- **Carga Perezosa:** Utilizar el atributo nativo `loading="lazy"` y `decoding="async"`.
- **Estructura Fija:** Especificar siempre `width` y `height` o una clase CSS con `aspect-ratio` (`aspect-video` o `aspect-square`) para evitar saltos de diseño (**Cumulative Layout Shift = 0**).

---

## 🎯 Matriz de Skills & Competencias del Ingeniero Frontend

| Dimensión | Competencia Requerida | Aplicación en `fleet-tech-web` |
| :--- | :--- | :--- |
| **Arquitectura Frontend** | Feature-Driven Development, Modularización limpia | Separación estricta entre APIs, componentes visuales, modelos tipados y hooks de estado |
| **Optimización de Rendimiento** | Dominio de Core Web Vitals, Chrome Performance Profiler | Identificación de cuellos de botella de INP, CPU Long Tasks y layouts forzados |
| **Virtualización de Datos** | `@tanstack/react-virtual` & TanStack Table | Implementación de scroll virtual y ordenamiento optimizado para miles de filas |
| **Gestión de Estado Servidor** | TanStack Query v5 avanzado | Caché normalizada, mutaciones optimistas, invalidación selectiva de queries |
| **TypeScript Avanzado** | Interfaces genéricas, discriminación de uniones, Zod | Validación estricta del contrato API envelope `{ success, data, meta }` |
| **Accesibilidad & UI** | Radix UI Primitives, WAI-ARIA, Tailwind CSS | Modales y diálogos accesibles con trampa de foco y navegación por teclado |

---

## 🔌 Integración y Contratos con `fleet-tech-api`

### Gestión de Tokens y Sesión Sanctum

- **Encabezados Globales:** Todas las solicitudes hacia `/api/v1/*` incluyen automáticamente:
  ```http
  Authorization: Bearer <sanctum_token>
  Accept: application/json
  ```
- **Manejo de Errores 401:** Si la API devuelve `401 Unauthorized`, un interceptor en Axios elimina la sesión en almacenamiento local y redirige a `/login` preservando la ruta previa en el parámetro de consulta `?redirect=...`.

### Consumo y Triage de Defectos

1. **Listar Defectos Pendientes:**
   - `GET /api/v1/defects?status=pending&severity=critical`
2. **Resolver y Desbloquear Vehículo:**
   - `PATCH /api/v1/defects/{id}/resolve`
   - **Payload Multipart / JSON:**
     ```json
     {
       "resolution_notes": "Se reemplazó la manguera hidráulica rota y se purgó el sistema de frenos.",
       "resolution_photos": [
         "https://s3.amazonaws.com/fleet-tech/resolutions/res_photo_01.jpg"
       ]
     }
     ```
   - **Efecto de Negocio:** La API actualiza el defecto a `resolved` y automáticamente cambia el estado del vehículo asociado a `active`, reflejándose de forma instantánea en el panel web.

---

## 🚀 Puesta en Marcha y Despliegue

### Prerrequisitos
- Node.js `>= 20.x`
- npm `>= 10.x` o pnpm `>= 9.x`
- Instancia activa de [`fleet-tech-api`](../fleet-tech-api)

### Instalación
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo con Vite HMR
npm run dev

# 4. Construir versión de producción optimizada
npm run build

# 5. Previsualizar compilación final localmente
npm run preview
```

---

## 🧪 Monitoreo y Auditoría con Lighthouse y Web Vitals

Para auditar el rendimiento en entornos locales antes del paso a producción:

```bash
# Ejecutar linter y comprobación de tipos TypeScript
npm run lint
npm run type-check

# Auditar con Google Lighthouse en Chrome DevTools:
# - Performance Score: >= 95
# - Accessibility Score: >= 95
# - Best Practices: 100
```
