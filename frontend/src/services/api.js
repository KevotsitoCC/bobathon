import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── PyMEs ───────────────────────────────────────────────── */

/**
 * Obtiene la lista de PyMEs para pintar pines en el mapa.
 * GET /api/pymes
 * @returns {Promise<Array<{ id, nombre, lat, lng, sector, score }>>}
 */
export const getPymes = () => api.get('/pymes').then(r => r.data)

/* ── Onboarding ──────────────────────────────────────────── */

/**
 * Envía las respuestas del formulario guiado para análisis.
 * POST /api/onboarding
 * @param {{ respuestas: object }} payload
 * @returns {Promise<{ session_id: string }>}
 */
export const postOnboarding = (payload) =>
  api.post('/onboarding', payload).then(r => r.data)

/* ── Resultados ──────────────────────────────────────────── */

/**
 * Obtiene el score, mapa de calor y análisis de una sesión.
 * GET /api/results/:session_id
 * @param {string} sessionId
 * @returns {Promise<{ score, riesgos, oportunidades, heatmap: Array<{lat,lng,intensity}> }>}
 */
export const getResults = (sessionId) =>
  api.get(`/results/${sessionId}`).then(r => r.data)

/* ── Cuenta / Inversión ──────────────────────────────────── */

/**
 * Obtiene el saldo simulado del usuario (vista inversionista).
 * GET /api/user/balance
 * @returns {Promise<{ saldo, inversiones: Array }>}
 */
export const getUserBalance = () => api.get('/user/balance').then(r => r.data)

/**
 * Registra una inversión simulada en una PyME.
 * POST /api/invest
 * @param {{ pyme_id: string, monto: number }} payload
 * @returns {Promise<{ confirmacion, nueva_inversion }>}
 */
export const postInvest = (payload) =>
  api.post('/invest', payload).then(r => r.data)

export default api
