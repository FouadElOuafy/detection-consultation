export default function FilterPanel({ filtre, setFiltre, total }) {
  const filtres = [
    { value:'tous',     label:'Tous',        count: total },
    { value:'legitime', label:'✅ Légitimes' },
    { value:'suspecte', label:'🚨 Suspectes' },
  ]

  return (
    <div className="d-flex align-items-center gap-2">
      {filtres.map(f => (
        <button key={f.value}
          onClick={() => setFiltre(f.value)}
          className={'btn btn-sm ' + (filtre === f.value ? 'btn-primary' : 'btn-outline-secondary')}>
          {f.label}
          {f.count !== undefined && (
            <span className="badge bg-white text-primary ms-1">{f.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}