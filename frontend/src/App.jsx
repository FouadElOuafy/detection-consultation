import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PrivateRoute  from './components/PrivateRoute'
import Dashboard     from './pages/Dashboard'
import Candidatures  from './pages/Candidatures'
import Analyse       from './pages/Analyse'
import Utilisateurs  from './pages/Utilisateurs'
import Login         from './pages/Login'
import './App.css'

const roleColor = { admin:'#f59e0b', manager:'#3b82f6', recruteur:'#22c55e' }
const roleLabel = { admin:'Admin', manager:'Manager', recruteur:'Recruteur' }

function Sidebar() {
  const { user, logout } = useAuth()
  const initiale = user?.nom?.charAt(0).toUpperCase() || '?'
  const color    = roleColor[user?.role] || '#94a3b8'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span style={{fontSize:'28px'}}>🏢</span>
        <div>
          <h2>RecrutSmart</h2>
          <p>Plateforme RH</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/" end className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}>
              <span className="icon">📊</span> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/candidatures" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}>
              <span className="icon">📋</span> Candidatures
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/analyse" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}>
              <span className="icon">🔍</span> Analyser
            </NavLink>
          </li>
          {user?.role === 'admin' && (
            <li className="nav-item">
              <NavLink to="/utilisateurs" className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}>
                <span className="icon">👥</span> Utilisateurs
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar" style={{background: color+'33', color}}>
            {initiale}
          </div>
          <div className="user-card-info">
            <div className="user-card-name">{user?.nom}</div>
            <div className="user-card-role" style={{color}}>{roleLabel[user?.role]}</div>
          </div>
          <button className="btn-logout-sm" onClick={logout} title="Déconnexion">⏻</button>
        </div>
      </div>
    </aside>
  )
}

const pageTitles = {
  '/'             : { title: 'Dashboard',            sub: 'Vue globale de vos recrutements' },
  '/candidatures' : { title: 'Candidatures',         sub: 'Toutes les candidatures analysées' },
  '/analyse'      : { title: 'Analyser',             sub: 'Soumettre une nouvelle candidature' },
  '/utilisateurs' : { title: 'Utilisateurs',         sub: 'Gestion des comptes RH' },
}

function Layout() {
  const path  = window.location.pathname
  const page  = pageTitles[path] || pageTitles['/']

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div className="main-layout">
        <div className="topbar">
          <div>
            <p className="topbar-title">{page.title}</p>
            <p className="topbar-sub">{page.sub}</p>
          </div>
        </div>
        <div className="page-content">
          <Routes>
            <Route path="/"             element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/candidatures" element={<PrivateRoute><Candidatures /></PrivateRoute>} />
            <Route path="/analyse"      element={<PrivateRoute><Analyse /></PrivateRoute>} />
            <Route path="/utilisateurs" element={<PrivateRoute roles={['admin']}><Utilisateurs /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*"    element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App