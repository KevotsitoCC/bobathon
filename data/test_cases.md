# Casos de Prueba — Flujo Completo
## RAVENCODE · Plataforma de Inversión y Viabilidad para PyMEs

> **Estado:** Plantilla lista — pendiente de ejecutar cuando M1, M2 y M3 estén activos  
> **Custodio:** M4 (Datos & Integración)  
> **Cómo reportar un bug:** Si encuentras un fallo, agrégalo en la sección "Bugs Encontrados" con módulo responsable y descripción.

---

## ✅ Estado General de Módulos

| Módulo | Estado | Responsable | Notas |
|--------|--------|-------------|-------|
| M1 — Frontend | ⬜ No iniciado | — | — |
| M2 — Backend | ⬜ No iniciado | — | — |
| M3 — IA Service | ⬜ No iniciado | — | — |
| M4 — Datos | ✅ Seed y contrato listos | M4 | `pymes_seed.json` + `api_contract.md` |

> Actualizar esta tabla conforme avancen los módulos. Estados: ⬜ No iniciado · 🟡 En progreso · ✅ Listo · 🔴 Bloqueado

---

## 🧪 Bloque 1 — Backend (M2) en aislamiento

> Ejecutar cuando M2 tenga los endpoints básicos. M3 puede estar con mock.

### TC-01: Seed cargado correctamente

**Prerequisito:** M2 levantado con `uvicorn main:app --reload`  
**Comando:**
```bash
curl http://localhost:8000/api/pymes
```
**Resultado esperado:**
```json
{ "pymes": [ ... ], "total": 15 }
```
**Validaciones:**
- [ ] `total` es exactamente `15`
- [ ] Cada PyME tiene `id`, `nombre`, `lat`, `lng`, `score_viabilidad`
- [ ] Las coordenadas están en el rango de Tijuana (`lat` ≈ 32.5, `lng` ≈ -117.0`)

**Estado:** ⬜ Pendiente | **Resultado:** —

---

### TC-02: Balance del usuario demo

**Prerequisito:** M2 levantado  
**Comando:**
```bash
curl http://localhost:8000/api/user/balance
```
**Resultado esperado:**
```json
{ "user_id": "user_demo", "saldo": 10000, "total_invertido": 0 }
```
**Validaciones:**
- [ ] `saldo` inicial es `10000`
- [ ] `inversiones` es array vacío al inicio

**Estado:** ⬜ Pendiente | **Resultado:** —

---

### TC-03: Onboarding con datos válidos

**Prerequisito:** M2 levantado (M3 puede estar con mock)  
**Comando:**
```bash
curl -X POST http://localhost:8000/api/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_negocio": "Taquería de mariscos",
    "zona": "Colonia Aviación, Zona Río, Tijuana",
    "inversion_estimada": 150000,
    "tiene_clientes": false,
    "giro_especifico": "Mariscos y ceviche, precio medio"
  }'
```
**Resultado esperado:**
```json
{ "session_id": "<uuid>", "status": "processing", "sugerencias": [] }
```
**Validaciones:**
- [ ] `session_id` es un UUID válido (no nulo)
- [ ] `status` es `"processing"` (datos claros, no pide clarificación)

**Estado:** ⬜ Pendiente | **Resultado:** —

---

### TC-04: Onboarding con zona ambigua (debe pedir clarificación)

**Comando:**
```bash
curl -X POST http://localhost:8000/api/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_negocio": "Restaurante",
    "zona": "Tijuana",
    "inversion_estimada": 100000,
    "tiene_clientes": false,
    "giro_especifico": "Comida"
  }'
```
**Resultado esperado:**
```json
{ "session_id": null, "status": "needs_clarification", "sugerencias": ["..."] }
```
**Validaciones:**
- [ ] `status` es `"needs_clarification"`
- [ ] `session_id` es `null`
- [ ] `sugerencias` tiene al menos un elemento
- [ ] `mensaje_agente` explica qué campo es ambiguo

**Estado:** ⬜ Pendiente | **Resultado:** —

---

### TC-05: Inversión exitosa

**Prerequisito:** M2 levantado con saldo inicial  
**Comando:**
```bash
curl -X POST http://localhost:8000/api/invest \
  -H "Content-Type: application/json" \
  -d '{ "pyme_id": "pyme_007", "monto": 5000 }'
```
**Resultado esperado:**
```json
{ "success": true, "nuevo_saldo": 5000, "avance_pyme": 75 }
```
**Validaciones:**
- [ ] `success` es `true`
- [ ] `nuevo_saldo` = 10000 - 5000 = `5000`
- [ ] `avance_pyme` refleja el nuevo porcentaje de fondeo de `pyme_007`
- [ ] Llamar `GET /api/user/balance` después confirma que `saldo` bajó a `5000`

**Estado:** ⬜ Pendiente | **Resultado:** —

---

### TC-06: Inversión fallida por saldo insuficiente

**Prerequisito:** TC-05 ejecutado (saldo = 5000)  
**Comando:**
```bash
curl -X POST http://localhost:8000/api/invest \
  -H "Content-Type: application/json" \
  -d '{ "pyme_id": "pyme_001", "monto": 9000 }'
```
**Resultado esperado:**
```json
{ "success": false, "error": "insufficient_balance" }
```
**Validaciones:**
- [ ] `success` es `false`
- [ ] `error` es `"insufficient_balance"`
- [ ] El saldo del usuario NO cambió

**Estado:** ⬜ Pendiente | **Resultado:** —

---

## 🧪 Bloque 2 — IA Service (M3) en aislamiento

> Ejecutar cuando M3 tenga el endpoint `/evaluate` activo en puerto 8001.

### TC-07: Evaluate con datos limpios

**Prerequisito:** M3 levantado en puerto 8001  
**Comando:**
```bash
curl -X POST http://localhost:8001/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_negocio": "Taquería de mariscos",
    "zona": "Colonia Aviación, Zona Río, Tijuana",
    "lat": 32.5260,
    "lng": -117.0330,
    "inversion_estimada": 150000,
    "tiene_clientes": false,
    "giro_especifico": "Mariscos y ceviche, precio medio",
    "pymes_cercanas": [
      { "nombre": "La Brasa Grill", "giro": "restaurante", "distancia_m": 280 }
    ]
  }'
```
**Validaciones:**
- [ ] `status` es `"valid"`
- [ ] `score` está entre `1` y `100`
- [ ] `riesgos` tiene al menos 1 elemento
- [ ] `oportunidades` tiene al menos 1 elemento
- [ ] `heatmap` tiene al menos 3 puntos
- [ ] Cada punto del `heatmap` tiene `lat`, `lng` e `intensity` (0.0–1.0)

**Estado:** ⬜ Pendiente | **Resultado:** —

---

### TC-08: Health check de M3

**Comando:**
```bash
curl http://localhost:8001/health
```
**Validaciones:**
- [ ] `status` es `"ok"`
- [ ] Response en menos de 500ms

**Estado:** ⬜ Pendiente | **Resultado:** —

---

## 🧪 Bloque 3 — Flujo completo integrado

> Solo ejecutar cuando M1, M2 y M3 estén activos y conectados.

### TC-09: Flujo end-to-end

**Prerequisito:** M1 en `localhost:5173`, M2 en `localhost:8000`, M3 en `localhost:8001`

**Pasos:**
1. Abrir `http://localhost:5173` en el navegador
2. Ver Landing page — clic en "Comenzar"
3. Completar formulario con:
   - Negocio: `Taquería de mariscos`
   - Zona: `Colonia Aviación, Tijuana`
   - Inversión: `150,000 MXN`
   - Clientes: `No`
   - Giro específico: `Mariscos y ceviche, precio medio`
4. Clic en "Analizar"
5. Esperar resultados (polling)

**Validaciones:**
- [ ] Paso 2: Landing carga sin errores de consola
- [ ] Paso 3: Los 5 campos del formulario están presentes y funcionales
- [ ] Paso 4: Se hace `POST /api/onboarding` correctamente (ver Network tab)
- [ ] Paso 5: El score aparece en pantalla (número entre 1 y 100)
- [ ] El mapa de calor se renderiza sobre Tijuana
- [ ] Se muestran al menos 3 riesgos y 3 oportunidades
- [ ] Los pines de las 15 PyMEs del seed están en el mapa

**Estado:** ⬜ Pendiente | **Resultado:** —

---

### TC-10: Flujo de inversión end-to-end

**Prerequisito:** TC-09 completado

**Pasos:**
1. En la vista del mapa, hacer clic en el pin de `pyme_007` (Logística Otay Express)
2. Ver tarjeta de la PyME con botón "Invertir"
3. Ingresar monto: `2,000 MXN`
4. Confirmar inversión

**Validaciones:**
- [ ] La tarjeta muestra `nombre`, `giro`, `score_viabilidad` y progreso de fondeo
- [ ] Se hace `POST /api/invest` correctamente
- [ ] El saldo del usuario se actualiza en la UI
- [ ] La barra de progreso de la PyME aumenta

**Estado:** ⬜ Pendiente | **Resultado:** —

---

## 🐛 Bugs Encontrados

> Agregar aquí cualquier discrepancia encontrada durante las pruebas.

| # | Fecha | Módulo responsable | Descripción | Estado |
|---|-------|--------------------|-------------|--------|
| — | — | — | Sin bugs registrados aún | — |

---

## 📋 Checklist Pre-Deploy

Antes de hacer deploy en Vercel/Render, verificar que todos estos puntos están en verde:

- [ ] TC-01 al TC-06 pasaron (M2 funciona en aislamiento)
- [ ] TC-07 y TC-08 pasaron (M3 funciona en aislamiento)
- [ ] TC-09 y TC-10 pasaron (flujo completo integrado)
- [ ] No hay errores de CORS en consola del navegador
- [ ] Las variables de entorno de producción están configuradas en Vercel y Render
- [ ] `VITE_API_BASE_URL` en Vercel apunta a la URL de Render del backend
- [ ] `GEMINI_API_KEY` está configurada en Render (no en el repo)
- [ ] El deploy de M2 (backend) y M3 (IA) están activos antes de hacer deploy de M1 (frontend)
