# Módulo 2 — Backend & API
## Plataforma de Inversión y Viabilidad para PyMEs · RAVENCODE

---

## 🎯 Responsabilidad del Módulo

Este módulo es el motor central de la aplicación. Expone todos los endpoints REST que consume el Frontend (M1), orquesta las llamadas al servicio de IA (M3), gestiona la base de datos SQLite y maneja la lógica financiera simulada (wallet, inversiones, fondeo).

**Stack:** Python 3.11+ · FastAPI · SQLite · Uvicorn

---

## 📁 Estructura de Archivos de este Módulo

```
backend/
├── main.py                    # Punto de entrada FastAPI, registro de routers
├── routes/
│   ├── pymes.py               # GET /api/pymes
│   ├── onboarding.py          # POST /api/onboarding
│   ├── results.py             # GET /api/results/{session_id}
│   ├── invest.py              # POST /api/invest
│   └── user.py                # GET /api/user/balance
├── services/
│   ├── ai_client.py           # Cliente HTTP para llamar a M3 (POST /evaluate)
│   └── session_manager.py     # Gestión de sesiones de análisis
├── models/
│   ├── pyme.py                # Modelo de datos PyME
│   ├── user.py                # Modelo de usuario simulado
│   └── investment.py          # Modelo de inversión
├── database/
│   ├── db.py                  # Conexión y setup de SQLite
│   └── seed.py                # Carga inicial de pymes_seed.json
├── .env                       # Variables de entorno (no commitear)
└── requirements.txt
```

---

## 🔌 Endpoints que Expone

| Método | Endpoint | Descripción | Módulo que lo consume |
|--------|----------|-------------|----------------------|
| `GET` | `/api/pymes` | Lista todas las PyMEs del seed | M1 |
| `POST` | `/api/onboarding` | Recibe respuestas del usuario, llama a M3, devuelve session_id | M1 |
| `GET` | `/api/results/{session_id}` | Devuelve score, heatmap y análisis de una sesión | M1 |
| `GET` | `/api/user/balance` | Devuelve saldo simulado del usuario | M1 |
| `POST` | `/api/invest` | Registra inversión, descuenta saldo, actualiza PyME | M1 |

### Schemas de Request/Response

**POST /api/onboarding**
```json
// Request
{
  "tipo_negocio": "Taquería de mariscos",
  "zona": "Zona Río, Tijuana",
  "inversion_estimada": 150000,
  "tiene_clientes": false,
  "giro_especifico": "Mariscos y ceviche, precio medio"
}

// Response
{
  "session_id": "uuid-v4",
  "status": "processing" | "ready" | "needs_clarification",
  "mensaje_agente": "Tu ubicación podría ser ambigua, ¿confirmas la colonia exacta?",
  "sugerencias": ["Especifica la colonia", "¿Cuántos m² tiene el local?"]
}
```

**GET /api/results/{session_id}**
```json
{
  "session_id": "uuid-v4",
  "score": 73,
  "nivel": "Viable con riesgos moderados",
  "riesgos": ["Alta competencia en 500m", "Zona con tráfico peatonal bajo en noches", "Saturación de giro similar"],
  "oportunidades": ["Poca oferta de precio medio en la zona", "Cercanía a oficinas corporativas", "Zona en crecimiento demográfico"],
  "heatmap": [
    { "lat": 32.5149, "lng": -117.0382, "intensity": 0.8 }
  ],
  "pymes_cercanas": [...]
}
```

**POST /api/invest**
```json
// Request
{ "pyme_id": "pyme_007", "monto": 5000 }

// Response
{ "success": true, "nuevo_saldo": 5000, "avance_pyme": 65 }
```

---

## ✅ Lo que SÍ puede hacer el agente en este módulo

- Crear, modificar y eliminar archivos dentro de `backend/`
- Instalar dependencias en `backend/requirements.txt`
- Modificar el esquema SQLite y los modelos de datos
- Ejecutar comandos de lectura e inspección (`cat`, `ls`, `Get-Content`, `SELECT` en SQLite)
- Ejecutar `uvicorn main:app --reload` para probar localmente
- Leer `data/api_contract.md` y `data/pymes_seed.json` (solo lectura)
- Proponer cambios al contrato de API notificando al equipo de M4

---

## ❌ Lo que NO puede hacer el agente en este módulo

- **PROHIBIDO** modificar archivos fuera de `backend/` y `MODULE_2.md`
- **PROHIBIDO** modificar `frontend/`, `ai_service/`, `data/` o archivos de otro módulo
- **PROHIBIDO** cambiar el contrato de API sin coordinación con M4
- **PROHIBIDO** modificar `README.md`, `MODULE_1.md`, `MODULE_3.md`, `MODULE_4.md`
- **PROHIBIDO** exponer la `GEMINI_API_KEY` en el código — siempre usar variables de entorno
- **PROHIBIDO** conectar directamente con Gemini API — eso es responsabilidad de M3

---

## 🤖 Instrucciones del Agente Bob — M2

### Modo de Trabajo

Este agente trabaja **en segundo plano** por tareas asignadas. El encargado de M2 puede asignar múltiples tareas y el agente las ejecuta de forma autónoma dentro de `backend/`.

### Reglas de Operación

**EDICIÓN DIRECTA PERMITIDA (solo en `backend/`):**
El agente tiene permisos completos de lectura y escritura dentro del directorio `backend/`. Puede crear, modificar y eliminar archivos sin confirmación previa.

**LECTURA LIBRE:**
Puede leer cualquier archivo del repositorio para entender el contexto, pero no puede modificar nada fuera de `backend/`.

**REPORTE DE CAMBIOS:**
Al completar una tarea, el agente debe reportar:
1. Qué endpoints creó o modificó
2. Qué cambios hizo en la base de datos o modelos
3. Si algún cambio requiere coordinación con M1, M3 o M4

**BLOQUEO DE MÓDULOS AJENOS:**
Si una tarea requiere modificar un archivo fuera de `backend/`, el agente debe:
1. Detenerse
2. Indicar exactamente qué necesita cambiar y por qué
3. Esperar instrucciones del usuario antes de proceder

### Flujo de Tarea en Segundo Plano

```
Usuario asigna tarea → Agente analiza → Agente ejecuta en backend/ → Reporta resultado
```

**Ejemplo de asignación de tarea:**
> "Crea el endpoint POST /api/onboarding que reciba las respuestas del formulario, llame al servicio de IA y devuelva un session_id"

El agente debe:
1. Leer `data/api_contract.md` para respetar los schemas
2. Crear `backend/routes/onboarding.py` con la lógica
3. Registrar el router en `backend/main.py`
4. Reportar el endpoint creado y cómo probarlo con curl o Swagger

---

## 📋 Tareas del Hackathon (2 días)

### Día 1
- [ ] Inicializar proyecto FastAPI con estructura de carpetas
- [ ] Configurar SQLite y cargar `pymes_seed.json` como datos iniciales
- [ ] Crear `GET /api/pymes` — devuelve lista con coordenadas
- [ ] Crear usuario de prueba hardcoded con saldo de $10,000 MXN
- [ ] Crear `GET /api/user/balance` — devuelve saldo del usuario de prueba
- [ ] Configurar CORS para permitir peticiones desde `localhost:5173`

### Día 2
- [ ] Crear `POST /api/onboarding` — recibe respuestas, llama a M3, devuelve session_id
- [ ] Crear `GET /api/results/{session_id}` — devuelve análisis completo de M3
- [ ] Crear `POST /api/invest` — lógica de inversión simulada
- [ ] Validaciones básicas (monto no supere meta de PyME, saldo suficiente)
- [ ] Verificar que Swagger (`/docs`) documenta todos los endpoints correctamente

---

## 🔧 Variables de Entorno

```env
# backend/.env
AI_SERVICE_URL=http://localhost:8001   # URL del servicio M3
DATABASE_URL=./database/ravencode.db   # Path a SQLite
```

> La `GEMINI_API_KEY` vive en `ai_service/.env` — este módulo no la necesita.

---

## 📦 Dependencias Principales

```
fastapi>=0.110.0
uvicorn>=0.29.0
sqlalchemy>=2.0.0
python-dotenv>=1.0.0
httpx>=0.27.0          # Para llamar al servicio de IA (M3)
pydantic>=2.0.0
```

---

## 🔗 Coordinación con Otros Módulos

| Módulo | Qué necesitas de ellos | Qué les das tú |
|--------|----------------------|----------------|
| **M1 (Frontend)** | Nada técnico (solo consume tus endpoints) | Endpoints REST funcionando + CORS configurado |
| **M3 (IA)** | `POST /evaluate` activo en puerto 8001 | Datos del usuario limpios y estructurados |
| **M4 (Datos)** | `pymes_seed.json` con estructura correcta | Reportar si el seed tiene datos inconsistentes |

> Si M3 no está disponible durante desarrollo, usa datos de respuesta mock para no bloquear el desarrollo de M1.
