# 🧪 Guía de Pruebas y Auditoría Core Web Vitals - Fleet Tech Web

Estrategia de pruebas con Vitest, validación de virtualización y auditoría de Core Web Vitals en Google Chrome.

---

## 1. Pruebas de Virtualización con Vitest

Se comprueba que al renderizar 2,500 vehículos en la tabla con `@tanstack/react-virtual`, la cantidad de nodos DOM generados nunca sobrepase el límite del viewport:

```typescript
// src/features/fleet/__tests__/VehicleVirtualTable.test.tsx
import { render, screen } from '@testing-library/react';
import { VehicleVirtualTable } from '../components/VehicleVirtualTable';

test('Solo renderiza ~30 nodos DOM a pesar de tener 2500 vehículos en memoria', () => {
  const massiveData = Array.from({ length: 2500 }, (_, i) => ({
    id: i + 1,
    plate_number: `PLK-${1000 + i}`,
    brand: 'Volvo',
    model: 'FH',
    status: 'active'
  }));

  render(<VehicleVirtualTable vehicles={massiveData} />);
  const rows = screen.getAllByRole('row');
  expect(rows.length).toBeLessThan(40);
});
```

---

## 2. Metas de Auditoría con Lighthouse CI

Al auditar la versión de producción (`npm run build && npm run preview`):

| Métrica | Meta Requerida | Impacto Técnico |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 1.2s` | Carga inicial del panel sin esperas |
| **INP (Interaction to Next Paint)** | `< 50ms` | Búsqueda y filtrado sin congelar el cursor |
| **CLS (Cumulative Layout Shift)** | `0.00` | Skeletons fijos sin saltos visuales |
| **Total Blocking Time (TBT)** | `< 100ms` | Hilo principal libre de tareas largas |
