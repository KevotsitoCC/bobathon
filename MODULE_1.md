# Módulo 1 — Frontend & UX
## Plataforma de Inversión y Viabilidad para PyMEs · RAVENCODE

---

## 🎯 Responsabilidad del Módulo

Este módulo es la cara visible del producto. Su responsabilidad es construir toda la interfaz de usuario: desde la landing page y el saludo del agente conversacional, hasta el formulario guiado de onboarding, el mapa de calor interactivo y la tarjeta de resultados.

**Stack:** React.js + Vite · Leaflet.js · OpenStreetMap · CSS/TailwindCSS

---

## 📁 Estructura de Archivos de este Módulo

```
frontend/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.jsx        # Componente principal del mapa Leaflet
│   │   │   └── HeatmapLayer.jsx   # Capa de calor dinámica
│   │   ├── Chat/
│   │   │   ├── AgentChat.jsx      # Interfaz del agente conversacional
│   │   │   └── ChatBubble.jsx     # Burbuja de mensaje individual
│   │   └── ScoreCard/
│   │       └── ScoreCard.jsx      # Tarjeta de resultados de viabilidad
│   ├── pages/
│   │   ├── Landing.jsx            # Página de bienvenida
│   │   ├── Onboarding.jsx         # Flujo de preguntas guiadas
│   │   └── Results.jsx            # Página de resultados con mapa
│   ├── services/
│   │   └── api.js                 # Llamadas HTTP al Backend (M2)
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔌 Contratos de API que Consume

Este módulo **solo se comunica con el Backend (M2)**. Nunca llama directamente al servicio de IA (M3).

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pymes` | Obtiene la lista de PyMEs para pintar pines en el mapa |
| `POST` | `/api/onboarding` | Envía las respuestas del usuario para validación y análisis |
| `GET` | `/api/results/:session_id` | Obtiene el score, mapa de calor y análisis de una sesión |
| `GET` | `/api/user/balance` | Obtiene el saldo simulado del usuario (vista inversionista) |
| `POST` | `/api/invest` | Registra una inversión simulada en una PyME |

> 📄 Ver estructura completa de request/response en [`data/api_contract.md`](./data/api_contract.md)

---

## ✅ Lo que SÍ puede hacer el agente en este módulo

- Crear, modificar y eliminar archivos dentro de `frontend/`
- Instalar dependencias en `frontend/package.json`
- Crear y editar componentes React (`.jsx`, `.tsx`)
- Modificar estilos CSS o configuración de Tailwind dentro de `frontend/`
- Ejecutar comandos de lectura e inspección de archivos (`cat`, `ls`, `Get-Content`)
- Ejecutar `npm install` y `npm run dev` dentro de `frontend/`
- Leer el archivo `data/api_contract.md` para entender los endpoints
- Proponer cambios al contrato de API notificando al equipo de M4

---

## ❌ Lo que NO puede hacer el agente en este módulo

- **PROHIBIDO** modificar archivos fuera de `frontend/` y `MODULE_1.md`
- **PROHIBIDO** modificar `backend/`, `ai_service/`, `data/` o cualquier archivo de otro módulo
- **PROHIBIDO** cambiar el contrato de API sin coordinación con M4
- **PROHIBIDO** hacer llamadas directas al servicio de IA (M3) — toda comunicación va por M2
- **PROHIBIDO** modificar `README.md`, `MODULE_2.md`, `MODULE_3.md`, `MODULE_4.md`
- **PROHIBIDO** cambiar variables de entorno de otros módulos

---

## 🤖 Instrucciones del Agente Bob — M1

### Modo de Trabajo

Este agente trabaja **en segundo plano** por tareas asignadas. El encargado de M1 puede asignar múltiples tareas y el agente las ejecuta de forma autónoma mientras el usuario continúa con otras actividades.

### Reglas de Operación

**EDICIÓN DIRECTA PERMITIDA (solo en `frontend/`):**
El agente tiene permisos completos de lectura y escritura dentro del directorio `frontend/`. Puede crear, modificar y eliminar archivos sin necesidad de confirmación previa, siempre que la operación sea dentro de su módulo.

**LECTURA LIBRE:**
Puede leer cualquier archivo del repositorio para entender el contexto del proyecto, pero no puede modificar nada fuera de `frontend/`.

**REPORTE DE CAMBIOS:**
Al completar una tarea, el agente debe reportar en el chat:
1. Qué archivos creó o modificó
2. Qué hace cada cambio
3. Si hay algo pendiente de conectar con otro módulo

**BLOQUEO DE MÓDULOS AJENOS:**
Si una tarea requiere modificar un archivo fuera de `frontend/`, el agente debe:
1. Detenerse
2. Indicar exactamente qué archivo necesita cambiar y por qué
3. Esperar instrucciones del usuario antes de proceder

### Flujo de Tarea en Segundo Plano

```
Usuario asigna tarea → Agente analiza → Agente ejecuta en frontend/ → Reporta resultado
```

**Ejemplo de asignación de tarea:**
> "Crea el componente del mapa de calor que reciba un array de coordenadas y pesos, y lo pinte sobre el mapa de Tijuana"

El agente debe:
1. Leer `data/api_contract.md` para entender la estructura de datos
2. Crear `frontend/src/components/Map/HeatmapLayer.jsx`
3. Integrar Leaflet.heat o similar
4. Reportar qué instaló y cómo usarlo

---

## 📋 Tareas del Hackathon (2 días)

### Día 1
- [ ] Inicializar proyecto React + Vite
- [ ] Instalar y configurar Leaflet.js
- [ ] Crear página Landing con saludo del agente
- [ ] Integrar mapa de Tijuana centrado en coordenadas `[32.5149, -117.0382]`
- [ ] Leer `data/pymes_seed.json` (vía M2) y pintar pines en el mapa

### Día 2
- [ ] Construir flujo de Onboarding (5 preguntas, componente tipo chat)
- [ ] Conectar botón "Analizar" con `POST /api/onboarding`
- [ ] Recibir datos del mapa de calor y renderizarlo dinámicamente
- [ ] Crear tarjeta de resultados (Score + riesgos + oportunidades)
- [ ] Responsive básico para presentación en pantalla

---

## 🗺️ Datos del Mapa

- **Centro del mapa:** Tijuana, B.C. — `lat: 32.5149, lng: -117.0382`
- **Zoom inicial:** 13
- **Tile server:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` (sin API key)
- **Capa de calor:** Se recibe del backend como array de `{ lat, lng, intensity }` y se pinta con `leaflet-heat`

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "leaflet": "^1.9.x",
    "leaflet.heat": "^0.2.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

---

## 🔗 Coordinación con Otros Módulos

| Módulo | Qué necesitas de ellos | Qué les das tú |
|--------|----------------------|----------------|
| **M2 (Backend)** | Endpoints REST activos y respondiendo | Nada (solo consume) |
| **M4 (Datos)** | `api_contract.md` actualizado, `pymes_seed.json` | Reportar si la estructura del JSON no coincide con lo que muestra la UI |

> Si detectas un problema en la estructura de datos o un endpoint que no responde como esperas, repórtalo al encargado de M4 antes de hacer workarounds en el frontend.
