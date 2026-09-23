# Módulo 3 — IA & Viabilidad
## Plataforma de Inversión y Viabilidad para PyMEs · RAVENCODE

---

## 🎯 Responsabilidad del Módulo

Este módulo es el cerebro del producto. Es un microservicio independiente que contiene:
1. El **agente validador** de inputs del usuario (detecta respuestas vagas o ambiguas)
2. El **motor de scoring heurístico** que calcula la viabilidad (1–100)
3. El **generador de mapa de calor** dinámico basado en el análisis
4. La integración con **Gemini API** para generar texto explicativo del análisis

Este servicio puede ejecutarse y probarse de forma completamente independiente.

**Stack:** Python 3.11+ · FastAPI · Google Gemini API · Uvicorn

---

## 📁 Estructura de Archivos de este Módulo

```
ai_service/
├── main.py                    # Punto de entrada FastAPI del microservicio
├── routes/
│   └── evaluate.py            # POST /evaluate — endpoint principal
├── core/
│   ├── validator.py           # Agente validador: detecta respuestas vagas
│   ├── scorer.py              # Motor heurístico: calcula score 1-100
│   ├── heatmap_generator.py   # Genera puntos de calor según el análisis
│   └── gemini_client.py       # Cliente Gemini API: genera texto explicativo
├── prompts/
│   ├── validation_prompt.txt  # Prompt para validar calidad de respuestas
│   └── analysis_prompt.txt    # Prompt para generar resumen de viabilidad
├── .env                       # GEMINI_API_KEY (no commitear)
└── requirements.txt
```

---

## 🔌 Endpoints que Expone

Este módulo **solo es llamado por el Backend (M2)**. No es accesible directamente desde el Frontend.

| Método | Endpoint | Descripción | Llamado por |
|--------|----------|-------------|-------------|
| `POST` | `/evaluate` | Valida inputs, calcula score, genera heatmap y texto | M2 |
| `GET` | `/health` | Verifica que el servicio está activo | M2 / M4 |

### Schema del Endpoint Principal

**POST /evaluate**
```json
// Request (enviado por M2)
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

// Response
{
  "status": "valid" | "needs_clarification",
  "clarification_needed": {
    "campo": "zona",
    "mensaje": "La Zona Río tiene varias colonias. ¿Es Aviación, Cacho o Río Tijuana?",
    "sugerencias": ["Colonia Aviación", "Colonia Cacho", "Río Tijuana"]
  },
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

---

## 🧮 Lógica del Motor de Scoring

El score se calcula con un algoritmo heurístico ponderado. **No requiere entrenamiento de ML** — es determinístico y rápido:

| Factor | Peso | Cómo se calcula |
|--------|------|-----------------|
| Densidad de competencia | 30% | Número de negocios del mismo giro en 500m (datos del seed) |
| Inversión vs. zona | 20% | Ratio inversión estimada / costo promedio del giro en esa zona |
| Potencial de demanda | 25% | Tipo de zona (comercial, residencial, mixta, corporativa) |
| Historial de la zona | 15% | % de negocios abiertos vs. cerrados en el seed de esa zona |
| Especificidad del giro | 10% | ¿El giro es suficientemente específico? (penaliza respuestas vagas) |

```python
# Ejemplo de cálculo
score = (
    (1 - competencia_normalizada) * 30 +
    inversion_score * 20 +
    demanda_score * 25 +
    historial_score * 15 +
    especificidad_score * 10
)
```

---

## 🗣️ Lógica del Agente Validador

El validador analiza cada campo del input y detecta problemas antes de calcular el score:

### Criterios de Validación

| Campo | Válido | Necesita clarificación |
|-------|--------|----------------------|
| `zona` | "Colonia Aviación, Tijuana" | "Tijuana" (muy genérico), nombre de calle privada ambiguo |
| `tipo_negocio` | "Restaurante de mariscos" | "Negocio de comida" (muy vago) |
| `giro_especifico` | "Tacos de birria, precio popular" | "Comida" (sin detalle) |
| `inversion_estimada` | Número > 0 | 0 o no proporcionado |

### Detección de Ubicación Ambigua

Si el nombre de la zona puede corresponder a múltiples lugares en Tijuana:
1. El validador marca `status: "needs_clarification"`
2. Devuelve el campo problemático, un mensaje explicativo y sugerencias
3. M2 reenvía esto al usuario vía M1 para que reformule

---

## 🔥 Generación del Mapa de Calor

El mapa de calor **no es estático** — se genera dinámicamente basado en el análisis:

1. Se toma la zona del usuario como centro (`lat/lng`)
2. Se calculan puntos de calor en un radio de 2km alrededor
3. La intensidad de cada punto refleja la viabilidad relativa:
   - `intensity: 0.9–1.0` → Zona muy favorable
   - `intensity: 0.5–0.8` → Zona moderada
   - `intensity: 0.1–0.4` → Zona de riesgo alto

```python
# Los puntos se generan desplazando lat/lng con variaciones
# y asignando intensidad según los factores del scoring
heatmap_points = generate_radial_heatmap(
    center_lat=lat,
    center_lng=lng,
    radius_km=2,
    score=score,
    competencia_map=pymes_cercanas
)
```

---

## ✅ Lo que SÍ puede hacer el agente en este módulo

- Crear, modificar y eliminar archivos dentro de `ai_service/`
- Instalar dependencias en `ai_service/requirements.txt`
- Modificar prompts en `ai_service/prompts/`
- Ejecutar el microservicio localmente (`uvicorn main:app --reload --port 8001`)
- Leer `data/pymes_seed.json` para entender los datos disponibles
- Leer `data/api_contract.md` para respetar los schemas
- Ejecutar comandos de lectura e inspección de archivos

---

## ❌ Lo que NO puede hacer el agente en este módulo

- **PROHIBIDO** modificar archivos fuera de `ai_service/` y `MODULE_3.md`
- **PROHIBIDO** modificar `frontend/`, `backend/`, `data/` o archivos de otro módulo
- **PROHIBIDO** exponer `GEMINI_API_KEY` en el código — siempre usar `.env`
- **PROHIBIDO** cambiar el schema de `/evaluate` sin coordinar con M2 y M4
- **PROHIBIDO** modificar `README.md`, `MODULE_1.md`, `MODULE_2.md`, `MODULE_4.md`
- **PROHIBIDO** aceptar llamadas directas desde el Frontend — solo desde M2

---

## 🤖 Instrucciones del Agente Bob — M3

### Modo de Trabajo

Este agente trabaja **en segundo plano** por tareas asignadas. El encargado de M3 puede asignar múltiples tareas y el agente las ejecuta de forma autónoma dentro de `ai_service/`.

### Reglas de Operación

**EDICIÓN DIRECTA PERMITIDA (solo en `ai_service/`):**
El agente tiene permisos completos de lectura y escritura dentro del directorio `ai_service/`. Puede crear, modificar y eliminar archivos sin confirmación previa.

**LECTURA LIBRE:**
Puede leer cualquier archivo del repositorio para contexto, pero no puede modificar nada fuera de `ai_service/`.

**REPORTE DE CAMBIOS:**
Al completar una tarea, el agente debe reportar:
1. Qué cambió en la lógica de scoring o validación
2. Si el schema del response se modificó (requiere notificar a M2)
3. Resultados de prueba con datos de ejemplo

**BLOQUEO DE MÓDULOS AJENOS:**
Si una tarea requiere modificar un archivo fuera de `ai_service/`, el agente debe:
1. Detenerse
2. Indicar exactamente qué necesita y por qué
3. Esperar instrucciones del usuario

### Flujo de Tarea en Segundo Plano

```
Usuario asigna tarea → Agente analiza → Agente ejecuta en ai_service/ → Reporta resultado
```

**Ejemplo de asignación de tarea:**
> "Ajusta el validador para que detecte cuando el usuario pone solo el nombre de una calle sin colonia en Tijuana y le pida que sea más específico"

El agente debe:
1. Modificar `ai_service/core/validator.py`
2. Actualizar el prompt en `ai_service/prompts/validation_prompt.txt` si aplica
3. Probar con ejemplos de inputs vagos
4. Reportar los cambios y casos de prueba

---

## 📋 Tareas del Hackathon (2 días)

### Día 1
- [ ] Inicializar microservicio FastAPI en puerto 8001
- [ ] Crear `GET /health` para verificar que el servicio está vivo
- [ ] Implementar validador básico (`validator.py`) — detecta zona vaga y giro genérico
- [ ] Implementar motor de scoring heurístico (`scorer.py`) con los 5 factores ponderados
- [ ] Probar `/evaluate` con datos de ejemplo y verificar que devuelve score correcto

### Día 2
- [ ] Integrar Gemini API para generar `resumen_ia` en lenguaje natural
- [ ] Implementar generador de mapa de calor dinámico (`heatmap_generator.py`)
- [ ] Afinar prompts de validación y análisis
- [ ] Ejecutar evaluación sobre las 15 PyMEs del seed y pre-calcular sus scores
- [ ] Entregar scores pre-calculados a M4 para el JSON final del demo

---

## 🔧 Variables de Entorno

```env
# ai_service/.env
GEMINI_API_KEY=tu_clave_de_gemini_pro
GEMINI_MODEL=gemini-1.5-pro
```

---

## 📦 Dependencias Principales

```
fastapi>=0.110.0
uvicorn>=0.29.0
google-generativeai>=0.5.0    # SDK oficial de Gemini
python-dotenv>=1.0.0
pydantic>=2.0.0
```

---

## 🔗 Coordinación con Otros Módulos

| Módulo | Qué necesitas de ellos | Qué les das tú |
|--------|----------------------|----------------|
| **M2 (Backend)** | Envía los datos del usuario en el formato correcto | Response con score, heatmap, riesgos y oportunidades |
| **M4 (Datos)** | `pymes_seed.json` con PyMEs y sus coordenadas | Scores pre-calculados de las 15 PyMEs para el demo |

> Si Gemini API no está disponible durante el desarrollo, implementa primero el scoring heurístico puro. El texto generado por Gemini es un enriquecimiento, no un bloqueante.
