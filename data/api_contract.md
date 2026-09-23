# Contrato de API — RAVENCODE
## Plataforma de Inversión y Viabilidad para PyMEs

> **⚠️ FUENTE DE VERDAD ÚNICA**
> Este archivo es el contrato oficial de todos los endpoints del sistema. Ningún módulo puede cambiar la estructura de sus requests o responses sin que M4 actualice este archivo primero y notifique a los módulos afectados.
>
> **Custodio:** M4 (Datos & Integración)
> **Última actualización:** Día 1 — Hora 1

---

## 📡 Base URLs

| Entorno | Frontend (M1) | Backend (M2) | IA Service (M3) |
|---------|---------------|--------------|-----------------|
| **Local** | `http://localhost:5173` | `http://localhost:8000` | `http://localhost:8001` |
| **Producción** | `https://ravencode.vercel.app` *(pendiente)* | `https://ravencode-api.onrender.com` *(pendiente)* | `https://ravencode-ai.onrender.com` *(pendiente)* |

> Las variables de entorno correctas para cada módulo están en `data/deploy/`.

---

## 🔒 CORS

El backend (M2) debe permitir peticiones desde:
- `http://localhost:5173` (desarrollo)
- La URL final de Vercel (producción)

Header requerido en todos los responses:
```
Access-Control-Allow-Origin: *   (desarrollo)
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 📋 Índice de Endpoints

| # | Método | Ruta | Expuesto por | Consumido por |
|---|--------|------|--------------|---------------|
| 1 | `GET` | `/api/pymes` | M2 | M1 |
| 2 | `POST` | `/api/onboarding` | M2 | M1 |
| 3 | `GET` | `/api/results/{session_id}` | M2 | M1 |
| 4 | `GET` | `/api/user/balance` | M2 | M1 |
| 5 | `POST` | `/api/invest` | M2 | M1 |
| 6 | `POST` | `/evaluate` | M3 | M2 |
| 7 | `GET` | `/health` | M3 | M2, M4 |

---

## 1. GET /api/pymes

**Descripción:** Devuelve la lista completa de PyMEs del seed para pintar pines en el mapa.

**Request:** Sin body ni parámetros.

**Response `200 OK`:**
```json
{
  "pymes": [
    {
      "id": "pyme_001",
      "nombre": "Tacos El Güero",
      "descripcion": "Taquería tradicional de carne asada y mariscos, precio popular",
      "giro": "restaurante",
      "zona": "Centro Histórico",
      "colonia": "Zona Centro",
      "lat": 32.5320,
      "lng": -117.0190,
      "meta_fondeo": 50000,
      "fondeo_actual": 32000,
      "score_viabilidad": 81,
      "estado": "activa"
    }
  ],
  "total": 15
}
```

**Notas:**
- El backend carga estos datos desde `data/pymes_seed.json` al arranque (vía `database/seed.py`)
- Solo se exponen los campos necesarios para el mapa — no se incluyen `inversion_inicial`, `ventas_mensuales_simuladas` ni `meses_operando` en este endpoint para reducir payload
- `estado` puede ser `"activa"` o `"cerrada"` (todas las del seed son `"activa"`)

---

## 2. POST /api/onboarding

**Descripción:** Recibe las respuestas del formulario guiado. El backend llama a M3 internamente para validar y — si los datos son válidos — inicia el análisis y devuelve un `session_id`.

**Request Body:**
```json
{
  "tipo_negocio": "Taquería de mariscos",
  "zona": "Zona Río, Tijuana",
  "inversion_estimada": 150000,
  "tiene_clientes": false,
  "giro_especifico": "Mariscos y ceviche, precio medio"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `tipo_negocio` | `string` | ✅ | Tipo general de negocio que el usuario quiere abrir |
| `zona` | `string` | ✅ | Zona o colonia de Tijuana donde abrirá |
| `inversion_estimada` | `number` | ✅ | Monto en MXN que planea invertir |
| `tiene_clientes` | `boolean` | ✅ | `true` si ya tiene clientes, `false` si es nuevo |
| `giro_especifico` | `string` | ✅ | Descripción más detallada del giro y posicionamiento |

**Response `200 OK` — datos válidos, análisis iniciado:**
```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "processing",
  "mensaje_agente": "Tus datos se ven bien. Estoy analizando la viabilidad de tu negocio...",
  "sugerencias": []
}
```

**Response `200 OK` — datos necesitan clarificación:**
```json
{
  "session_id": null,
  "status": "needs_clarification",
  "mensaje_agente": "Tu ubicación podría ser ambigua. ¿Puedes confirmar la colonia exacta?",
  "sugerencias": ["Colonia Aviación", "Colonia Cacho", "Río Tijuana"]
}
```

**Response `422 Unprocessable Entity` — campos faltantes o inválidos:**
```json
{
  "detail": "El campo 'inversion_estimada' debe ser un número mayor a 0"
}
```

**Notas:**
- Si `status` es `"needs_clarification"`, el Frontend debe mostrar el mensaje y las sugerencias, y permitir al usuario reenviar con datos corregidos
- Si `status` es `"processing"`, el Frontend debe hacer polling a `GET /api/results/{session_id}` hasta que el status sea `"ready"`
- El `session_id` es un UUID v4 generado por el backend

---

## 3. GET /api/results/{session_id}

**Descripción:** Devuelve el resultado completo del análisis de viabilidad para una sesión.

**Path Parameter:** `session_id` — UUID de la sesión

**Response `200 OK` — análisis listo:**
```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "ready",
  "score": 73,
  "nivel": "Viable con riesgos moderados",
  "riesgos": [
    "Alta competencia en 500m (3 negocios del mismo giro)",
    "Zona con tráfico peatonal bajo en horario nocturno",
    "Saturación del sector mariscos en la zona"
  ],
  "oportunidades": [
    "Poca oferta de precio medio — mayoría son opciones económicas o premium",
    "Cercanía a zona corporativa con alto poder adquisitivo",
    "Zona en crecimiento demográfico sostenido"
  ],
  "resumen_ia": "Tu taquería de mariscos tiene buenas probabilidades en la Zona Río. El mayor riesgo es la competencia existente, pero tu posicionamiento de precio medio cubre un nicho no explotado en la zona.",
  "heatmap": [
    { "lat": 32.5149, "lng": -117.0382, "intensity": 0.8 },
    { "lat": 32.5130, "lng": -117.0400, "intensity": 0.3 },
    { "lat": 32.5170, "lng": -117.0360, "intensity": 0.6 }
  ],
  "pymes_cercanas": [
    {
      "id": "pyme_004",
      "nombre": "La Brasa Grill",
      "giro": "restaurante",
      "distancia_m": 280,
      "score_viabilidad": 88
    }
  ]
}
```

**Response `200 OK` — análisis en proceso:**
```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "processing",
  "score": null,
  "nivel": null,
  "riesgos": [],
  "oportunidades": [],
  "resumen_ia": null,
  "heatmap": [],
  "pymes_cercanas": []
}
```

**Response `404 Not Found`:**
```json
{
  "detail": "Session not found"
}
```

**Tabla de niveles de score:**

| Score | Nivel |
|-------|-------|
| 85–100 | "Alta viabilidad" |
| 70–84 | "Viable con riesgos moderados" |
| 50–69 | "Viabilidad media, requiere ajustes" |
| 1–49 | "Alta dificultad, se recomienda replantear" |

**Notas:**
- `heatmap` es un array de puntos con `lat`, `lng` e `intensity` (0.0–1.0)
- `pymes_cercanas` solo incluye las PyMEs del seed que están en un radio de 1km del punto analizado
- El Frontend debe hacer polling cada 2 segundos mientras `status === "processing"`

---

## 4. GET /api/user/balance

**Descripción:** Devuelve el saldo simulado del usuario de prueba para la vista de inversionista.

**Request:** Sin body ni parámetros.

**Response `200 OK`:**
```json
{
  "user_id": "user_demo",
  "nombre": "Inversionista Demo",
  "saldo": 10000,
  "inversiones": [
    {
      "pyme_id": "pyme_007",
      "pyme_nombre": "Logística Otay Express",
      "monto_invertido": 0,
      "fecha": null
    }
  ],
  "total_invertido": 0
}
```

**Notas:**
- El usuario de prueba tiene un saldo inicial de $10,000 MXN hardcoded en la base de datos
- `inversiones` empieza como array vacío y se actualiza con cada llamada a `POST /api/invest`
- Este endpoint no requiere autenticación — el hackathon usa un único usuario demo

---

## 5. POST /api/invest

**Descripción:** Registra una inversión simulada del usuario demo en una PyME.

**Request Body:**
```json
{
  "pyme_id": "pyme_007",
  "monto": 5000
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `pyme_id` | `string` | ✅ | ID de la PyME en la que se invierte |
| `monto` | `number` | ✅ | Monto en MXN a invertir (mínimo: 100, máximo: saldo disponible) |

**Response `200 OK` — inversión exitosa:**
```json
{
  "success": true,
  "pyme_id": "pyme_007",
  "monto_invertido": 5000,
  "nuevo_saldo": 5000,
  "avance_pyme": 65,
  "mensaje": "¡Inversión registrada! Tu apoyo lleva a Logística Otay Express al 65% de su meta."
}
```

**Response `400 Bad Request` — saldo insuficiente:**
```json
{
  "success": false,
  "error": "insufficient_balance",
  "mensaje": "Tu saldo ($2,000 MXN) es menor al monto a invertir ($5,000 MXN)"
}
```

**Response `400 Bad Request` — meta de fondeo alcanzada:**
```json
{
  "success": false,
  "error": "funding_goal_reached",
  "mensaje": "Esta PyME ya alcanzó su meta de fondeo"
}
```

**Response `404 Not Found`:**
```json
{
  "detail": "PyME not found"
}
```

**Notas:**
- `avance_pyme` es el porcentaje de `fondeo_actual / meta_fondeo * 100` después de aplicar la inversión
- El backend debe validar que `monto <= saldo del usuario` y que `fondeo_actual + monto <= meta_fondeo`
- El saldo del usuario se actualiza en la base de datos SQLite

---

## 6. POST /evaluate  *(Interno — M3, solo M2 puede llamar)*

**Descripción:** Endpoint del servicio de IA. Valida los inputs, calcula el score de viabilidad, genera el mapa de calor y el análisis textual.

**Llamado por:** M2 (backend) desde `services/ai_client.py`

**Request Body:**
```json
{
  "tipo_negocio": "Taquería de mariscos",
  "zona": "Zona Río, Tijuana",
  "lat": 32.5149,
  "lng": -117.0382,
  "inversion_estimada": 150000,
  "tiene_clientes": false,
  "giro_especifico": "Mariscos y ceviche, precio medio",
  "pymes_cercanas": [
    { "nombre": "El Mazatleco", "giro": "mariscos", "distancia_m": 320 }
  ]
}
```

> M2 agrega `lat`, `lng` y `pymes_cercanas` antes de llamar a M3 — el frontend no los envía directamente.

**Response `200 OK` — input válido:**
```json
{
  "status": "valid",
  "clarification_needed": null,
  "score": 73,
  "nivel": "Viable con riesgos moderados",
  "riesgos": [
    "Alta competencia en 500m (3 negocios del mismo giro)",
    "Zona con tráfico peatonal bajo en horario nocturno",
    "Saturación del sector mariscos en la zona"
  ],
  "oportunidades": [
    "Poca oferta de precio medio — mayoría son opciones económicas o premium",
    "Cercanía a zona corporativa con alto poder adquisitivo",
    "Zona en crecimiento demográfico sostenido"
  ],
  "resumen_ia": "Texto generado por Gemini explicando el análisis en lenguaje natural",
  "heatmap": [
    { "lat": 32.5149, "lng": -117.0382, "intensity": 0.8 },
    { "lat": 32.5130, "lng": -117.0400, "intensity": 0.3 }
  ]
}
```

**Response `200 OK` — input necesita clarificación:**
```json
{
  "status": "needs_clarification",
  "clarification_needed": {
    "campo": "zona",
    "mensaje": "La Zona Río tiene varias colonias. ¿Es Aviación, Cacho o Río Tijuana?",
    "sugerencias": ["Colonia Aviación", "Colonia Cacho", "Río Tijuana"]
  },
  "score": null,
  "nivel": null,
  "riesgos": [],
  "oportunidades": [],
  "resumen_ia": null,
  "heatmap": []
}
```

---

## 7. GET /health  *(M3 — servicio de IA)*

**Descripción:** Verifica que el microservicio de IA está activo y puede responder.

**Response `200 OK`:**
```json
{
  "status": "ok",
  "service": "ravencode-ai",
  "version": "1.0.0",
  "gemini_configured": true
}
```

---

## 🔄 Flujo de Datos Completo

```
M1 (Frontend)
    │
    │  POST /api/onboarding  { tipo_negocio, zona, inversion_estimada, ... }
    ▼
M2 (Backend)
    │  Geocodifica zona → lat/lng
    │  Busca pymes_cercanas en SQLite
    │  POST /evaluate  { tipo_negocio, zona, lat, lng, ... pymes_cercanas }
    ▼
M3 (IA Service)
    │  Valida inputs
    │  Calcula score
    │  Genera heatmap
    │  Llama a Gemini API → resumen_ia
    │  Devuelve response a M2
    ▼
M2 (Backend)
    │  Guarda resultado en SQLite con session_id
    │  Devuelve { session_id, status: "processing" } a M1
    ▼
M1 (Frontend)
    │  Polling GET /api/results/{session_id} cada 2s
    │  Cuando status === "ready" → renderiza ScoreCard + HeatmapLayer
    ▼
Usuario ve resultados
```

---

## 📌 Notas Generales

- Todos los endpoints devuelven `Content-Type: application/json`
- Errores no manejados devuelven `500 Internal Server Error` con `{ "detail": "Internal server error" }`
- Los campos de coordenadas usan **WGS84** (estándar de GPS y Leaflet)
- Las monedas están siempre en **pesos mexicanos (MXN)**
- Si M3 no está disponible, M2 debe devolver un mock de análisis para no bloquear M1 (ver `services/ai_client.py`)
