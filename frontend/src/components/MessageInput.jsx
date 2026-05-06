import { useState } from 'react'

function MessageInput({ onAnalyser, loading }) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message.trim()) onAnalyser(message)
  }

  return (
    <div className="card">
      <h2>🔍 Analyser un message</h2>
      <textarea
        className="textarea"
        rows={5}
        placeholder="Collez votre message ici..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="btn"
        onClick={handleSubmit}
        disabled={loading || !message.trim()}
      >
        {loading ? 'Analyse en cours...' : 'Analyser'}
      </button>
    </div>
  )
}

export default MessageInput