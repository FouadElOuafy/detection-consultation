import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children, roles }) {
  const { user, token } = useAuth()

  if (!token || !user) return <Navigate to="/login" />

  if (roles && !roles.includes(user.role)) {
    return (
      <div style={{textAlign:'center', padding:'80px', color:'#94a3b8'}}>
        <h2 style={{fontSize:'48px'}}>🚫</h2>
        <h3>Accès refusé</h3>
        <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    )
  }

  return children
}