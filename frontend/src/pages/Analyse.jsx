import { useState } from 'react'
import api from '../api'

export default function Analyse() {
  const [form,     setForm]     = useState({ nom:'', poste:'', email:'', departement:'', lettre:'' })
  const [resultat, setResultat] = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [erreur,   setErreur]   = useState('')

  const analyser = async () => {
    setLoading(true); setResultat(null); setErreur('')
    try {
      const res = await api.post('/rh/analyser-candidature', form)
      setResultat(res.data)
    } catch { setErreur('Erreur lors de l\'analyse') }
    setLoading(false)
  }

  return (
    <div className="content-card" style={{maxWidth:'800px'}}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label-custom">Nom du candidat</label>
          <input className="input-custom" placeholder="Ex: Ahmed Ben Ali"
            value={form.nom} onChange={e => setForm({...form, nom:e.target.value})} />
        </div>
        <div className="col-md-6">
          <label className="form-label-custom">Poste visé</label>
          <input className="input-custom" placeholder="Ex: Développeur Full Stack"
            value={form.poste} onChange={e => setForm({...form, poste:e.target.value})} />
        </div>
        <div className="col-md-6">
          <label className="form-label-custom">Email</label>
          <input className="input-custom" type="email" placeholder="candidat@email.com"
            value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        </div>
        <div className="col-md-6">
          <label className="form-label-custom">Département</label>
          <input className="input-custom" placeholder="Ex: Informatique"
            value={form.departement} onChange={e => setForm({...form, departement:e.target.value})} />
        </div>
        <div className="col-12">
          <label className="form-label-custom">Lettre de motivation</label>
          <textarea className="input-custom textarea-custom" rows={7}
            placeholder="Collez la lettre de motivation ici..."
            value={form.lettre} onChange={e => setForm({...form, lettre:e.target.value})} />
        </div>
      </div>

      {erreur && <div className="alert-error-custom mt-3">{erreur}</div>}

      <button className="btn btn-primary mt-3" onClick={analyser}
        disabled={loading || !form.lettre.trim() || !form.nom.trim()}>
        {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Analyse...</> : '🔍 Analyser la candidature'}
      </button>

      {resultat && (
        <div className={`result-box ${resultat.statut} mt-4`}>
          <div className="result-title">
            {resultat.statut==='legitime' ? '✅' : '🚨'}
            {resultat.statut==='legitime' ? 'Candidature légitime' : 'Candidature suspecte'}
          </div>
          <p style={{marginTop:'12px', color:'#64748b', fontSize:'14px'}}>
            Score de légitimité : <strong style={{color:'#1e293b', fontSize:'18px'}}>{resultat.score}%</strong>
          </p>
          <div className="score-bar mt-2">
            <div className={resultat.statut==='legitime'?'score-fill-green':'score-fill-red'}
              style={{width:`${resultat.score}%`}} />
          </div>
        </div>
      )}
    </div>
  )
}