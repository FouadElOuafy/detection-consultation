function StatsPanel({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Messages analysés</span>
      </div>
      <div className="stat-card">
        <span className="stat-value spam-color">{stats.spam}</span>
        <span className="stat-label">Spams détectés</span>
      </div>
      <div className="stat-card">
        <span className="stat-value ham-color">{stats.ham}</span>
        <span className="stat-label">Messages légitimes</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.spam_pourcentage}%</span>
        <span className="stat-label">Taux de spam</span>
      </div>
    </div>
  )
}

export default StatsPanel