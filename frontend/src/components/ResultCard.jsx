function ResultCard({ resultat }) {
  const isSpam = resultat.resultat === 'spam'

  return (
    <div className={`card result-card ${isSpam ? 'spam' : 'ham'}`}>
      <div className="result-header">
        <span className="result-icon">{isSpam ? '🚨' : '✅'}</span>
        <h2>{isSpam ? 'SPAM détecté' : 'Message légitime'}</h2>
      </div>
      <div className="result-bars">
        <div className="bar-row">
          <span>Spam</span>
          <div className="bar-bg">
            <div className="bar-fill spam-fill" style={{ width: `${resultat.probabilite_spam}%` }} />
          </div>
          <span>{resultat.probabilite_spam}%</span>
        </div>
        <div className="bar-row">
          <span>Ham</span>
          <div className="bar-bg">
            <div className="bar-fill ham-fill" style={{ width: `${resultat.probabilite_ham}%` }} />
          </div>
          <span>{resultat.probabilite_ham}%</span>
        </div>
      </div>
    </div>
  )
}

export default ResultCard