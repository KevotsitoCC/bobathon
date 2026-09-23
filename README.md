# 🗺️ Plataforma de Inversión y Viabilidad para PyMEs

> **Equipo:** RAVENCODE · **Hackathon:** IBM · **Ciudad piloto:** Tijuana, Baja California, México

Una herramienta de geomarketing inteligente que ayuda a emprendedores mexicanos a evaluar la viabilidad comercial de su negocio antes de abrir, reubicar o expandirse — impulsada por IA y visualización geoespacial en tiempo real.

---

## 📌 Tabla de Contenidos

- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Problema que Resuelve](#problema-que-resuelve)
- [Usuarios del Producto](#usuarios-del-producto)
- [Flujo de la Aplicación](#flujo-de-la-aplicación)
- [Arquitectura de Módulos](#arquitectura-de-módulos)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Cómo Correr el Proyecto](#cómo-correr-el-proyecto)
- [Integraciones Externas](#integraciones-externas)
- [Alcance del Hackathon](#alcance-del-hackathon)
- [Equipo RAVENCODE](#equipo-ravencode)

---

## 🧠 Resumen Ejecutivo

La **Plataforma de Inversión y Viabilidad para PyMEs** es un sistema cerrado que combina análisis de inteligencia artificial, datos geoespaciales y lógica financiera para responder la pregunta más crítica de cualquier emprendedor:

> *"¿Es rentable abrir mi negocio aquí, en esta zona, con esta competencia?"*

El núcleo del producto es un **agente conversacional validador** que guía al usuario mediante preguntas estructuradas, valida la calidad y precisión de sus respuestas, y genera un **mapa de calor dinámico** sobre Tijuana B.C. con un **Score de Viabilidad (1–100)** calculado por IA.

---

## 🎯 Problema que Resuelve

El 60% de las PyMEs en México cierran antes de cumplir 2 años. Una de las principales causas es la **mala elección de ubicación y giro**, decisión que se toma sin datos, por intuición o por disponibilidad de local.

Esta plataforma convierte datos de densidad comercial, competencia local y tendencias de zona en **información accionable** antes de que el emprendedor invierta un solo peso.

---

## 👤 Usuarios del Producto

### Usuario Principal — Emprendedor / Dueño de PyME
Persona que quiere abrir, reubicar o expandir un negocio en Tijuana. Necesita saber si su idea es viable en una zona específica antes de comprometer capital.

### Usuario Secundario — Inversionista
Persona que busca oportunidades de inversión en negocios locales con métricas verificadas. Accede al catálogo de PyMEs analizadas por la plataforma una vez que el emprendedor registra su proyecto.

> **Estrategia:** El emprendedor es el generador de actividad. Su análisis produce los datos que el inversionista consume. Se resuelve primero el problema del emprendedor.

---

## 🔄 Flujo de la Aplicación

```
1. BIENVENIDA
   └── Landing page con presentación del producto y saludo contextual del agente

2. ONBOARDING GUIADO (Agente conversacional)
   └── El agente hace preguntas estructuradas:
       · ¿Qué tipo de negocio quieres evaluar?
       · ¿En qué zona/colonia de Tijuana?
       · ¿Cuál es tu inversión estimada?
       · ¿Tienes clientes actuales o es negocio nuevo?
       · ¿Cuál es tu giro específico?

3. VALIDACIÓN DE RESPUESTAS (IA)
   └── El agente evalúa si las respuestas son suficientemente precisas
       · Si son vagas → sugiere cómo mejorarlas y pide reformulación
       · Si la ubicación es ambigua → señala el conflicto y pide confirmar en mapa
       · Si son válidas → continúa al análisis

4. ANÁLISIS DE VIABILIDAD (Motor de IA)
   └── Calcula Score de Viabilidad (1–100) basado en:
       · Densidad de competencia en la zona
       · Giro del negocio vs. demanda estimada
       · Historial de apertura/cierre de comercios similares
       · Inversión vs. proyección de retorno

5. VISUALIZACIÓN EN MAPA
   └── Mapa de calor dinámico generado por la IA sobre Tijuana
       · Zonas verdes: alta viabilidad
       · Zonas amarillas: viabilidad media / riesgo moderado
       · Zonas rojas: baja viabilidad / alta saturación

6. RESULTADOS
   └── Tarjeta con Score, 3 puntos de riesgo y 3 puntos de oportunidad
       · Emprendedor: ¿conviene abrir aquí?
       · Inversionista: catálogo de proyectos con métricas
```

---

## 🏗️ Arquitectura de Módulos

El proyecto está dividido en **4 módulos independientes**, cada uno con su propio agente Bob y su archivo de reglas. Cada módulo puede desarrollarse sin bloquear a los demás.

| Módulo | Nombre | Responsabilidad | Documentación |
|--------|--------|-----------------|---------------|
| M1 | Frontend & UX | Interfaz, saludo del agente, formulario guiado, mapa Leaflet, visualización | [MODULE_1.md](./MODULE_1.md) |
| M2 | Backend & API | Endpoints REST, lógica de inversión, wallet simulada, validación financiera | [MODULE_2.md](./MODULE_2.md) |
| M3 | IA & Viabilidad | Agente validador de inputs, scoring heurístico, generación de mapa de calor, Gemini API | [MODULE_3.md](./MODULE_3.md) |
| M4 | Datos & Integración | Mock data, contratos de API, QA de integración, deploy en Vercel y Render | [MODULE_4.md](./MODULE_4.md) |

### Contrato de Independencia entre Módulos

```
M1 (Frontend)   ←── consume ──→   M2 (Backend API)
                                        ↑
                               M3 (IA Service)
                                        ↑
                               M4 (Mock Data / Seed)
```

- **M1** solo habla con **M2** a través de endpoints HTTP definidos en el contrato de API
- **M2** solo habla con **M3** a través de un endpoint interno `POST /evaluate`
- **M3** es un microservicio independiente — puede correrse y probarse solo
- **M4** provee los datos semilla y valida que M1 ↔ M2 ↔ M3 estén conectados

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | React.js + Vite | Rápido de iniciar, componentes reutilizables, amplio ecosistema |
| **Mapas** | Leaflet.js + OpenStreetMap | Open source, sin API key requerida, soporte nativo de capas de calor |
| **Backend** | Python + FastAPI | Integración natural con la capa de IA, alto rendimiento, auto-documentación |
| **Base de Datos** | SQLite (hackathon) | Sin configuración de servidor, portable, suficiente para el demo |
| **Inteligencia Artificial** | Python + Gemini API (Google) | Tier gratuito generoso, validación de texto y scoring de viabilidad |
| **Deploy Frontend** | Vercel | Deploy automático desde Git, CDN global, gratis |
| **Deploy Backend** | Render | Soporte nativo para Python/FastAPI, gratis, siempre activo |
| **Agente de Desarrollo** | IBM Bob | Copiloto de desarrollo por módulo, con reglas definidas por archivo |

---

## 📁 Estructura del Repositorio

```
ravencode/
├── README.md                  # Este archivo
├── MODULE_1.md                # Reglas del agente Bob para M1
├── MODULE_2.md                # Reglas del agente Bob para M2
├── MODULE_3.md                # Reglas del agente Bob para M3
├── MODULE_4.md                # Reglas del agente Bob para M4
│
├── frontend/                  # Módulo 1 — React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/           # Componente Leaflet + capa de calor
│   │   │   ├── Chat/          # Agente conversacional (onboarding)
│   │   │   └── ScoreCard/     # Tarjeta de resultados
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   └── Results.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                   # Módulo 2 — Python + FastAPI
│   ├── main.py
│   ├── routes/
│   │   ├── pymes.py           # GET /pymes
│   │   ├── invest.py          # POST /invest
│   │   └── user.py            # GET /user/balance
│   ├── models/
│   └── requirements.txt
│
├── ai_service/                # Módulo 3 — Python + Gemini
│   ├── main.py
│   ├── validator.py           # Agente validador de inputs del usuario
│   ├── scorer.py              # Motor de scoring heurístico
│   ├── heatmap.py             # Generación de datos de mapa de calor
│   └── requirements.txt
│
└── data/                      # Módulo 4 — Mock data + contratos
    ├── pymes_seed.json        # 15 PyMEs simuladas en Tijuana
    ├── api_contract.md        # Definición de todos los endpoints y schemas
    └── deploy/
        ├── vercel.json
        └── render.yaml
```

---

## 🚀 Cómo Correr el Proyecto

> ⚠️ La guía detallada de instalación, variables de entorno y comandos de ejecución se completará al finalizar el desarrollo. Ver sección [Alcance del Hackathon](#alcance-del-hackathon).

### Prerequisitos
- Node.js v18+
- Python 3.11+
- Git

### Variables de Entorno Requeridas
```env
# backend/.env
GEMINI_API_KEY=tu_clave_de_gemini

# frontend/.env
VITE_API_BASE_URL=http://localhost:8000
```

### Ejecución Local (Desarrollo)
```bash
# 1. Frontend (M1)
cd frontend
npm install
npm run dev
# Disponible en http://localhost:5173

# 2. Backend (M2)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Disponible en http://localhost:8000

# 3. Servicio de IA (M3)
cd ai_service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
# Disponible en http://localhost:8001
```

---

## 🔗 Integraciones Externas

| Servicio | Uso | Requiere Key |
|----------|-----|-------------|
| **Gemini API (Google)** | Validación de inputs del usuario y generación de análisis de viabilidad | ✅ Sí (`GEMINI_API_KEY`) |
| **OpenStreetMap** | Mapa base de Tijuana para Leaflet.js | ❌ No |
| **Leaflet.js** | Renderizado del mapa y capa de calor dinámica | ❌ No |
| **Vercel** | Deploy del frontend | ❌ No (cuenta gratuita) |
| **Render** | Deploy del backend y servicio de IA | ❌ No (cuenta gratuita) |

---

## 📐 Alcance del Hackathon (2 días)

### ✅ Lo que SÍ se entrega en el demo

- [ ] Landing page con saludo del agente
- [ ] Flujo de onboarding conversacional (5 preguntas guiadas)
- [ ] Validación inteligente de respuestas (IA detecta respuestas vagas)
- [ ] Score de Viabilidad generado dinámicamente (1–100)
- [ ] Mapa de calor sobre Tijuana generado por la IA
- [ ] Tarjeta de resultados con 3 riesgos y 3 oportunidades
- [ ] Wallet simulada con saldo ficticio para demo de inversión
- [ ] Deploy accesible en URL pública (Vercel + Render)

### ❌ Lo que NO está en el alcance del hackathon

- Autenticación real de usuarios (KYC/AML)
- Integración con SAT o ERP real de PyMEs
- Pasarela de pagos real (Stripe/Openpay)
- Datos reales de densidad comercial de Tijuana
- App móvil nativa
- Cumplimiento regulatorio (Ley Fintech)

### 🧪 Datos del Demo
Se utilizarán **15 PyMEs sintéticas** ubicadas en zonas reales de Tijuana (Zona Río, Centro, Otay, Playas, Garita) definidas en `data/pymes_seed.json`.

---

## 👥 Equipo RAVENCODE

| Módulo | Rol |
|--------|-----|
| M1 — Frontend & UX | Por asignar |
| M2 — Backend & API | Por asignar |
| M3 — IA & Viabilidad | Por asignar |
| M4 — Datos & Integración | Por asignar |

> Cada integrante trabaja en su módulo de forma independiente. Las reglas de su agente Bob están definidas en el archivo `.md` correspondiente.

---

