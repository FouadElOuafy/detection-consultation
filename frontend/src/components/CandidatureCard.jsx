import ScoreBar from './ScoreBar'

export default function CandidatureCard({ candidature, onSupprimer }) {
  const isSpam = candidature.statut === 'suspecte'

  return (
    <tr>
      <td style={{color:'#94a3b8'}}>#{candidature.id}</td>
      <td style={{fontWeight:600}}>{candidature.nom}</td>
      <td>{candidature.poste}</td>
      <td style={{color:'#94a3b8'}}>{candidature.email}</td>
      <td>
        <ScoreBar score={candidature.score} statut={candidature.statut} />
      </td>
      <td>
        <span className={isSpam ? 'badge-suspecte' : 'badge-legitime'}>
          {isSpam ? '🚨 Suspecte' : '✅ Légitime'}
        </span>
      </td>
      <td style={{color:'#94a3b8', fontSize:'13px'}}>{candidature.date}</td>
      <td>
        <button
          onClick={() => onSupprimer(candidature.id)}
          className="btn btn-sm btn-outline-danger"
        >
          🗑️
        </button>
      </td>
    </tr>
  )
}