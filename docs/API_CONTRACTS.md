# 🔌 Contratos de API para Fleet Tech Web

Especificación técnica de endpoints y payloads de datos entre **`fleet-tech-web`** y **`fleet-tech-api`**.

---

## 1. Listado Paginado de Flota (`GET /api/v1/vehicles`)

```json
// Query Params: ?status=all&search=ABC&page=1&per_page=100

// Response (200 OK)
{
  "success": true,
  "data": [
    {
      "id": 105,
      "plate_number": "ABC-123",
      "brand": "Volvo",
      "model": "FH 540",
      "status": "in_maintenance",
      "active_defects_count": 1
    }
  ],
  "meta": {
    "total": 350,
    "current_page": 1,
    "last_page": 4
  }
}
```

---

## 2. Consola de Triage y Resolución de Defectos (`PATCH /api/v1/defects/{id}/resolve`)

```json
// Request Body
{
  "resolution_notes": "Se cambió manguera hidráulica y se purgó circuito de frenos.",
  "resolution_photo": "https://s3.amazonaws.com/fleet-tech/resolutions/repair_105.jpg"
}

// Response (200 OK)
{
  "success": true,
  "message": "Defecto resuelto exitosamente. El vehículo vuelve a estado activo.",
  "data": {
    "defect_id": 88,
    "status": "resolved",
    "vehicle_id": 105,
    "vehicle_new_status": "active"
  }
}
```

---

## 3. Manejo de Sesión Sanctum y Errores 401

- Todas las peticiones llevan el encabezado `Authorization: Bearer <token>`.
- Si el backend retorna `401 Unauthorized`, el interceptor de Axios purga el token de memoria y redirige inmediatamente al usuario a `/login`.
