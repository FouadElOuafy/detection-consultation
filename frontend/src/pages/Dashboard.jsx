import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total:0, legitimes:0, suspectes:0, taux_suspicion:0 })
  const [candidatures, setCandidatures] = useState([])

  useEffect(() => {
    api.get('/rh/stats-rh').then(r => setStats(r.data))
    api.get('/rh/candidatures').then(r => setCandidatures(r.data))
  }, [])

  const statCards = [
    { label:'Total candidatures', value: stats.total,          icon:'📁', bg:'#eff6ff', color:'#2563eb' },
    { label:'Légitimes',          value: stats.legitimes,      icon:'✅', bg:'#f0fdf4', color:'#16a34a' },
    { label:'Suspectes',          value: stats.suspectes,      icon:'🚨', bg:'#fef2f2', color:'#dc2626' },
    { label:'Taux de suspicion',  value: stats.taux_suspicion+'%', icon:'📈', bg:'#fefce8', color:'#ca8a04' },
  ]

  return (
    <>
      <p style={{color:'#94a3b8', marginBottom:'24px', fontSize:'14px'}}>
        Bonjour, <strong style={{color:'#1e293b'}}>{user?.nom}</strong> 👋
      </p>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {statCards.map((s,i) => (
          <div className="col-md-3" key={i}>
            <div className="stat-card-new">
              <div className="stat-icon" style={{background: s.bg}}>
                {s.icon}
              </div>
              <div>
                <div className="stat-info-value" style={{color: s.color}}>{s.value}</div>
                <div className="stat-info-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau dernières candidatures */}
      <div className="content-card">
        <div className="content-card-title">🕐 Dernières candidatures</div>
        <table className="table-clean">
          <thead>
            <tr>
              <th>Nom</th><th>Poste</th><th>Date</th><th>Score</th><th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {candidatures.slice(0,5).map(c => (
              <tr key={c.id}>
                <td style={{fontWeight:600}}>{c.nom}</td>
                <td>{c.poste}</td>
                <td style={{color:'#94a3b8', fontSize:'13px'}}>{c.date}</td>
                <td style={{minWidth:'130px'}}>
                  <div className="score-bar">
                    <div className={c.statut==='legitime'?'score-fill-green':'score-fill-red'}
                      style={{width:`${c.score}%`}} />
                  </div>
                  <span style={{fontSize:'12px', color:'#94a3b8'}}>{c.score}%</span>
                </td>
                <td>
                  <span className={c.statut==='legitime'?'badge-legitime':'badge-suspecte'}>
                    {c.statut==='legitime'?'✅ Légitime':'🚨 Suspecte'}
                  </span>
                </td>
              </tr>
            ))}
            {candidatures.length === 0 && (
              <tr><td colSpan="5" style={{textAlign:'center', color:'#94a3b8', padding:'40px'}}>
                Aucune candidature analysée
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}