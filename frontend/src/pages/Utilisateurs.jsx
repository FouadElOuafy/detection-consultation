import { useState, useEffect } from 'react'
import api from '../api'

export default function Utilisateurs() {
  const [users,   setUsers]   = useState([])
  const [form,    setForm]    = useState({ nom:'', email:'', password:'', role:'recruteur', departement:'' })
  const [loading, setLoading] = useState(false)
  const [erreur,  setErreur]  = useState('')
  const [succes,  setSucces]  = useState('')

  const fetchUsers = () => api.get('/admin/utilisateurs').then(r => setUsers(r.data))
  useEffect(() => { fetchUsers() }, [])

  const creer = async () => {
    setLoading(true); setErreur(''); setSucces('')
    try {
      await api.post('/admin/utilisateurs', form)
      setSucces(`Compte ${form.role} créé pour ${form.nom}`)
      setForm({ nom:'', email:'', password:'', role:'recruteur', departement:'' })
      fetchUsers()
    } catch (err) { setErreur(err.response?.data?.error || 'Erreur') }
    setLoading(false)
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await api.delete(`/admin/utilisateurs/${id}`)
    fetchUsers()
  }

  const roleBadgeClass = { admin:'badge-admin', manager:'badge-manager', recruteur:'badge-recruteur' }
  const roleColors = { recruteur:'#22c55e', manager:'#3b82f6', admin:'#f59e0b' }

  return (
    <>
      {/* Formulaire */}
      <div className="content-card mb-4">
        <div className="content-card-title">➕ Créer un compte</div>

        {erreur && <div className="alert-error-custom">{erreur}</div>}
        {succes && <div className="alert-success-custom">{succes}</div>}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label-custom">Nom complet</label>
            <input className="input-custom" placeholder="Ex: Sara Alami"
              value={form.nom} onChange={e => setForm({...form, nom:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label-custom">Email</label>
            <input className="input-custom" type="email" placeholder="sara@recrutsmart.com"
              value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label-custom">Mot de passe</label>
            <input className="input-custom" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label-custom">Département</label>
            <input className="input-custom" placeholder="Ex: Informatique"
              value={form.departement} onChange={e => setForm({...form, departement:e.target.value})} />
          </div>
          <div className="col-12">
            <label className="form-label-custom">Rôle</label>
            <div className="d-flex gap-2 mt-1">
              {['recruteur','manager','admin'].map(r => (
                <button key={r} onClick={() => setForm({...form, role:r})}
                  style={{
                    padding:'8px 20px', borderRadius:'8px', border:'2px solid',
                    borderColor: form.role===r ? roleColors[r] : '#e2e8f0',
                    background: form.role===r ? roleColors[r]+'15' : '#fff',
                    color: form.role===r ? roleColors[r] : '#94a3b8',
                    cursor:'pointer', fontWeight:600, fontSize:'13px',
                    textTransform:'capitalize', transition:'all .2s'
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={creer}
          disabled={loading || !form.nom || !form.email || !form.password}>
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
      </div>

      {/* Liste */}
      <div className="content-card">
        <div className="content-card-title">📋 Comptes existants ({users.length})</div>
        <table className="table-clean">
          <thead>
            <tr><th>#</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Département</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{color:'#94a3b8'}}>#{u.id}</td>
                <td style={{fontWeight:600}}>{u.nom}</td>
                <td style={{color:'#94a3b8'}}>{u.email}</td>
                <td><span className={roleBadgeClass[u.role]||''}>{u.role}</span></td>
                <td style={{color:'#94a3b8'}}>{u.departement||'—'}</td>
                <td>
                  <button onClick={() => supprimer(u.id)}
                    className="btn btn-sm btn-outline-danger">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}