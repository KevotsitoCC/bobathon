# Módulo 4 — Datos & Integración
## Plataforma de Inversión y Viabilidad para PyMEs · RAVENCODE

---

## 🎯 Responsabilidad del Módulo

Este módulo es el **arquitecto de producto** del equipo. Sus responsabilidades son:
1. Crear y mantener los **datos semilla** (15 PyMEs simuladas en Tijuana)
2. Definir y custodiar el **contrato de API** que todos los módulos deben respetar
3. Verificar que M1, M2 y M3 estén correctamente conectados entre sí
4. Gestionar el **deploy final** en Vercel (Frontend) y Render (Backend + IA)
5. Ejecutar pruebas de flujo completo antes de la presentación

**Stack:** JSON · Postman · GitHub · Vercel · Render

---

## 📁 Estructura de Archivos de este Módulo

```
data/
├── pymes_seed.json            # 15 PyMEs simuladas en Tijuana con todos sus campos
├── api_contract.md            # Definición oficial de todos los endpoints y schemas
├── test_cases.md              # Casos de prueba del flujo completo
└── deploy/
    ├── vercel.json            # Configuración de deploy del Frontend en Vercel
    └── render.yaml            # Configuración de deploy del Backend en Render
```

---

## 📄 Contrato de API (Fuente de Verdad)

El archivo `data/api_contract.md` es la **única fuente de verdad** para la comunicación entre módulos. Todos los módulos deben respetarlo. Solo el encargado de M4 puede actualizarlo, y debe notificar a los otros módulos cuando haya cambios.

> Ver [`data/api_contract.md`](./data/api_contract.md) para el detalle completo de cada endpoint.

---

## 🗃️ Estructura del Seed de PyMEs

Cada entrada en `data/pymes_seed.json` debe tener la siguiente estructura:

```json
{
  "id": "pyme_001",
  "nombre": "Tacos El Güero",
  "descripcion": "Taquería tradicional de carne asada y mariscos",
  "giro": "restaurante",
  "giro_especifico": "Taquería de carne asada, precio popular",
  "zona": "Centro Histórico",
  "colonia": "Zona Centro",
  "lat": 32.5320,
  "lng": -117.0190,
  "inversion_inicial": 80000,
  "meta_fondeo": 50000,
  "fondeo_actual": 32000,
  "ventas_mensuales_simuladas": 45000,
  "meses_operando": 18,
  "estado": "activa",
  "score_viabilidad": 81,
  "riesgos": ["Zona con alta rotación de negocios similares"],
  "oportunidades": ["Flujo peatonal alto en horario de comida", "Poca competencia de precio popular en la zona"],
  "competidores_cercanos": 2
}
```

### Distribución Geográfica de las 15 PyMEs

| Zona | Cantidad | Giros incluidos |
|------|----------|-----------------|
| Zona Río | 3 | Restaurante, Café, Tecnología |
| Centro Histórico | 3 | Taquería, Farmacia, Ropa |
| Otay / Aeropuerto | 3 | Logística, Abarrotes, Taller |
| Playas de Tijuana | 3 | Mariscos, Renta de tablas, Café |
| Garita / San Ysidro | 3 | Cambio de divisas, Comida rápida, Artesanías |

---

## ✅ Lo que SÍ puede hacer el agente en este módulo

- Crear, modificar y eliminar archivos dentro de `data/`
- Modificar `data/pymes_seed.json`, `data/api_contract.md`, `data/test_cases.md`
- Editar configuraciones de deploy en `data/deploy/`
- Ejecutar comandos de lectura e inspección de todos los módulos
- Verificar que los endpoints responden correctamente (pruebas con curl o Postman)
- Coordinar cambios de contrato de API entre módulos (comunicar, no modificar)
- Hacer el deploy a Vercel y Render cuando los módulos estén listos
- Leer y revisar cualquier archivo del repositorio para QA

---

## ❌ Lo que NO puede hacer el agente en este módulo

- **PROHIBIDO** modificar archivos fuera de `data/` y `MODULE_4.md`
- **PROHIBIDO** modificar `frontend/`, `backend/` o `ai_service/` directamente
- Si detecta un bug en otro módulo → reportar al encargado correspondiente, no corregirlo
- **PROHIBIDO** cambiar el contrato de API sin comunicarlo explícitamente a M1, M2 y M3
- **PROHIBIDO** modificar `README.md`, `MODULE_1.md`, `MODULE_2.md`, `MODULE_3.md`
- **PROHIBIDO** hacer deploy sin que los módulos hayan pasado las pruebas de flujo

---

## 🤖 Instrucciones del Agente Bob — M4

### Modo de Trabajo

Este agente trabaja **en segundo plano** por tareas asignadas. El encargado de M4 puede asignar múltiples tareas y el agente las ejecuta de forma autónoma dentro de `data/`.

### Reglas de Operación

**EDICIÓN DIRECTA PERMITIDA (solo en `data/`):**
El agente tiene permisos completos de lectura y escritura dentro del directorio `data/`. Puede crear y modificar archivos de datos, contratos y configuración de deploy sin confirmación previa.

**LECTURA LIBRE (TODO el repositorio):**
M4 tiene permisos de lectura amplia sobre todos los módulos — es su responsabilidad verificar que todo esté conectado. Pero lectura solo, nunca escritura fuera de `data/`.

**REPORTE DE CAMBIOS:**
Al completar una tarea, el agente debe reportar:
1. Qué cambió en el contrato de API o en el seed (y notificar qué módulos se ven afectados)
2. Resultado de las pruebas de integración
3. Estado del deploy (URL de Vercel y Render cuando estén activos)

**BLOQUEO DE MÓDULOS AJENOS:**
Si detecta un problema en `frontend/`, `backend/` o `ai_service/`:
1. Documentar el problema en `data/test_cases.md`
2. Notificar al encargado del módulo afectado
3. No modificar el código ajeno

### Flujo de Tarea en Segundo Plano

```
Usuario asigna tarea → Agente analiza → Agente ejecuta en data/ → Reporta resultado
```

**Ejemplo de asignación de tarea:**
> "Verifica que el endpoint GET /api/pymes del backend devuelve la misma estructura que el Frontend espera según el contrato"

El agente debe:
1. Leer `data/api_contract.md`
2. Hacer un `curl` o prueba al endpoint
3. Comparar el response con lo que M1 espera en su `services/api.js`
4. Reportar si hay discrepancias y qué módulo debe corregirlas

---

## 📋 Tareas del Hackathon (2 días)

### Día 1 — Hora 1 (CRÍTICO: Debe completarse primero)
- [ ] Crear `data/api_contract.md` con todos los endpoints, schemas de request/response y ejemplos
- [ ] Crear `data/pymes_seed.json` con las 15 PyMEs distribuidas en las 5 zonas de Tijuana
- [ ] Compartir ambos archivos con M1, M2 y M3 para que puedan empezar a trabajar en paralelo
- [ ] Confirmar que todos los módulos entienden el contrato antes de que empiecen a codear

### Día 1 — Resto del día
- [ ] Verificar que M2 puede cargar el seed correctamente
- [ ] Verificar que M3 recibe datos en el formato esperado
- [ ] Documentar problemas de integración encontrados en `data/test_cases.md`

### Día 2
- [ ] Resolver problemas de CORS entre M1 y M2
- [ ] Ejecutar prueba de flujo completo: Landing → Onboarding → Score → Mapa
- [ ] Configurar `data/deploy/vercel.json` con las variables de entorno del Frontend
- [ ] Configurar `data/deploy/render.yaml` con el comando de arranque del Backend
- [ ] Hacer deploy de Frontend en Vercel
- [ ] Hacer deploy de Backend en Render
- [ ] Hacer deploy de IA Service en Render (segundo servicio)
- [ ] Verificar que la URL pública funciona de principio a fin
- [ ] Preparar la demo: ruta de navegación clara para presentar a los jueces

---

## 🚀 Configuración de Deploy

### Frontend → Vercel

```json
// data/deploy/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_BASE_URL": "@api_base_url"
  }
}
```

**Pasos:**
1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Seleccionar carpeta `frontend/` como root del proyecto
3. Agregar variable de entorno `VITE_API_BASE_URL` con la URL de Render

### Backend + IA → Render

```yaml
# data/deploy/render.yaml
services:
  - type: web
    name: ravencode-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    rootDir: backend

  - type: web
    name: ravencode-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    rootDir: ai_service
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

---

## 🧪 Prueba de Flujo Completo

Antes del deploy final, ejecutar esta prueba manual de principio a fin:

```
1. Abrir la URL del Frontend (Vercel)
2. Ver Landing page → clic en "Comenzar"
3. Completar el formulario de onboarding con datos de prueba:
   - Negocio: "Taquería de mariscos"
   - Zona: "Zona Río, Colonia Aviación, Tijuana"
   - Inversión: 150,000 MXN
   - Clientes: No (negocio nuevo)
   - Giro: "Mariscos y ceviche, precio medio"
4. Verificar que el agente valida las respuestas (no debe pedir clarificación con estos datos)
5. Ver Score de Viabilidad generado (debe estar entre 1 y 100)
6. Ver mapa de calor sobre Tijuana (debe pintarse dinámicamente)
7. Ver tarjeta con 3 riesgos y 3 oportunidades
8. (Vista inversionista) Ver lista de PyMEs del seed en el mapa
9. Simular inversión de $5,000 MXN en una PyME
10. Verificar que el saldo del usuario se descuenta correctamente
```

---

## 🔗 Coordinación con Otros Módulos

| Módulo | Qué necesitas de ellos | Qué les das tú |
|--------|----------------------|----------------|
| **M1 (Frontend)** | Reportar si algo no coincide con el contrato | `api_contract.md`, `pymes_seed.json`, URL de Vercel |
| **M2 (Backend)** | Reportar bugs de integración encontrados en QA | `pymes_seed.json`, URL de Render para el backend |
| **M3 (IA)** | Scores pre-calculados de las 15 PyMEs para el seed | `pymes_seed.json`, URL de Render para el servicio de IA |

> M4 es el árbitro de integración — si dos módulos tienen un desacuerdo sobre un schema o endpoint, M4 actualiza el contrato y notifica a todos.
