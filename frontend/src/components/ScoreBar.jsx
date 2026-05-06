export default function ScoreBar({ score, statut }) {
  return (
    <div style={{minWidth:'140px'}}>
      <div className="score-bar mb-1">
        <div
          className={statut === 'legitime' ? 'score-fill-green' : 'score-fill-red'}
          style={{width: `${score}%`}}
        />
      </div>
      <span style={{fontSize:'12px', color:'#94a3b8'}}>{score}%</span>
    </div>
  )
}