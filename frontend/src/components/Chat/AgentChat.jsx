import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble.jsx'
import styles from './AgentChat.module.css'

/**
 * Las 5 preguntas guiadas del onboarding.
 * Cada question incluye la pregunta del agente y opciones opcionales.
 */
const QUESTIONS = [
  {
    id: 'sector',
    text: '¡Hola! Soy el agente de RAVENCODE. Vamos a evaluar la viabilidad de tu PyME. ¿En qué sector opera tu negocio?',
    options: ['Alimentos y Bebidas', 'Comercio', 'Manufactura', 'Servicios', 'Tecnología', 'Otro'],
  },
  {
    id: 'antiguedad',
    text: '¿Cuántos años lleva operando tu negocio?',
    options: ['Menos de 1 año', '1 a 3 años', '3 a 5 años', 'Más de 5 años'],
  },
  {
    id: 'empleados',
    text: '¿Cuántos empleados tiene actualmente tu empresa?',
    options: ['1 a 5', '6 a 15', '16 a 50', 'Más de 50'],
  },
  {
    id: 'ubicacion',
    text: '¿En qué municipio o colonia de Tijuana se encuentra tu negocio? (Puedes escribirlo)',
    options: null,
  },
  {
    id: 'inversion',
    text: '¿Cuánto capital de inversión estás buscando?',
    options: ['Menos de $50,000 MXN', '$50,000 – $200,000 MXN', '$200,000 – $500,000 MXN', 'Más de $500,000 MXN'],
  },
]

const now = () =>
  new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

/**
 * AgentChat — Interfaz conversacional tipo chat para el flujo de Onboarding.
 *
 * @param {{ onComplete: (respuestas: object) => void }} props
 */
export default function AgentChat({ onComplete }) {
  const [messages, setMessages]   = useState([])
  const [step, setStep]           = useState(0)
  const [input, setInput]         = useState('')
  const [respuestas, setResp]     = useState({})
  const [finished, setFinished]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef(null)

  // Mensaje inicial del agente
  useEffect(() => {
    setMessages([{
      role: 'agent',
      content: QUESTIONS[0].text,
      time: now(),
    }])
  }, [])

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendUserMessage = (text) => {
    const userMsg = { role: 'user', content: text, time: now() }
    const nextStep = step + 1
    const currentQ = QUESTIONS[step]

    const updated = { ...respuestas, [currentQ.id]: text }
    setResp(updated)
    setMessages(prev => [...prev, userMsg])
    setInput('')

    if (nextStep < QUESTIONS.length) {
      setLoading(true)
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'agent', content: QUESTIONS[nextStep].text, time: now() },
        ])
        setLoading(false)
        setStep(nextStep)
      }, 700)
    } else {
      setLoading(true)
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'agent',
            content: '¡Perfecto! Tengo toda la información. Analizando la viabilidad de tu PyME…',
            time: now(),
          },
        ])
        setFinished(true)
        setLoading(false)
        onComplete?.(updated)
      }, 800)
    }
  }

  const handleOption = (opt) => sendUserMessage(opt)

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || finished) return
    sendUserMessage(text)
  }

  const currentQ = QUESTIONS[step]

  return (
    <div className={styles.chatContainer}>
      {/* Mensajes */}
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} time={msg.time} />
        ))}
        {loading && (
          <ChatBubble role="agent" content="…" />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Opciones rápidas */}
      {!finished && !loading && currentQ?.options && (
        <div className={styles.options}>
          {currentQ.options.map(opt => (
            <button key={opt} className={styles.optBtn} onClick={() => handleOption(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Input de texto */}
      {!finished && (
        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Escribe tu respuesta…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className={`btn btn-primary ${styles.sendBtn}`}
            disabled={!input.trim() || loading}
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  )
}
