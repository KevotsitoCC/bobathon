import styles from './ChatBubble.module.css'

/**
 * ChatBubble — Burbuja de mensaje individual
 *
 * @param {{
 *   role:    'agent' | 'user',
 *   content: string,
 *   time?:   string
 * }} props
 */
export default function ChatBubble({ role, content, time }) {
  const isAgent = role === 'agent'
  return (
    <div className={`${styles.wrapper} ${isAgent ? styles.agentWrapper : styles.userWrapper}`}>
      {isAgent && (
        <div className={styles.avatar} aria-label="Agente">R</div>
      )}
      <div className={`${styles.bubble} ${isAgent ? styles.agentBubble : styles.userBubble}`}>
        <p className={styles.text}>{content}</p>
        {time && <span className={styles.time}>{time}</span>}
      </div>
    </div>
  )
}
