import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [erreur,  setErreur]  = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async () => {
    setLoading(true); setErreur('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch { setErreur('Email ou mot de passe incorrect') }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span style={{fontSize:'48px'}}>🏢</span>
          <h1>RecrutSmart</h1>
          <p>Connectez-vous à votre espace RH</p>
        </div>

        {erreur && <div className="alert-error-custom">{erreur}</div>}

        <div className="mb-3">
          <label className="form-label-custom">Email</label>
          <input className="input-custom" type="email" placeholder="votre@email.com"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>

        <div className="mb-3">
          <label className="form-label-custom">Mot de passe</label>
          <input className="input-custom" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>

        <button className="btn btn-primary w-100 mt-2" onClick={handleSubmit}
          disabled={loading || !form.email || !form.password}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="login-hint">
          Compte admin par défaut :<br/>
          <code>admin@recrutsmart.com / admin123</code>
        </div>
      </div>
    </div>
  )
}