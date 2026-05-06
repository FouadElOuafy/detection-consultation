import { useState, useEffect } from 'react'
import api from '../api'
import CandidatureCard from '../components/CandidatureCard'
import FilterPanel     from '../components/FilterPanel'

export default function Candidatures() {
  const [candidatures, setCandidatures] = useState([])
  const [filtre,       setFiltre]       = useState('tous')

  const fetchCandidatures = () => {
    api.get('/rh/candidatures').then(r => setCandidatures(r.data))
  }

  useEffect(() => { fetchCandidatures() }, [])

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette candidature ?')) return
    await api.delete(`/rh/candidatures/${id}`)
    fetchCandidatures()
  }

  const filtrees = filtre === 'tous'
    ? candidatures
    : candidatures.filter(c => c.statut === filtre)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <FilterPanel
          filtre={filtre}
          setFiltre={setFiltre}
          total={candidatures.length}
        />
        <span className="badge bg-secondary">{filtrees.length} résultat(s)</span>
      </div>

      <div className="content-card">
        <table className="table-clean">
          <thead>
            <tr>
              <th>#</th><th>Nom</th><th>Poste</th><th>Email</th>
              <th>Score</th><th>Statut</th><th>Date</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtrees.map(c => (
              <CandidatureCard
                key={c.id}
                candidature={c}
                onSupprimer={supprimer}
              />
            ))}
            {filtrees.length === 0 && (
              <tr>
                <td colSpan="8" style={{textAlign:'center', color:'#94a3b8', padding:'40px'}}>
                  Aucune candidature
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}