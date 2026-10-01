import { useState } from 'react';
import Products from './Products';
import Profile from './Profile';
import DashboardHome from './DashboardHome';

interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
  createDate: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdated: (user: User) => void;
}

function Dashboard({ user, onLogout, onUserUpdated }: DashboardProps) {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'products' | 'profile'
  >('dashboard');

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            className="offcorss-logo"
            src="https://offcorss.vtexassets.com/arquivos/header__logo-offcorss.png"
            alt="OFFCORSS"
          />
          <div className="brand-subtitle">E-commerce Platform</div>
        </div>

        <div className="sidebar-section-title">MENÚ</div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          <button
            type="button"
            className={`nav-item ${
              activeView === 'dashboard' ? 'nav-item-active' : ''
            }`}
            onClick={() => setActiveView('dashboard')}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              activeView === 'products' ? 'nav-item-active' : ''
            }`}
            onClick={() => setActiveView('products')}
          >
            <span className="nav-icon">▦</span>
            <span>Productos</span>
          </button>

          <button
            type="button"
            className={`nav-item ${
              activeView === 'profile' ? 'nav-item-active' : ''
            }`}
            onClick={() => setActiveView('profile')}
          >
            <span className="nav-icon">◉</span>
            <span>Mi perfil</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="sidebar-user-info">
              <strong>{user.name}</strong>
              <span>{user.userType}</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={onLogout}
          >
            <span>↪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">Plataforma E-commerce</span>
            <span className="topbar-title">OFFCORSS</span>
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>
                {user.name} {user.lastName}
              </strong>
              <span>{user.email}</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          {activeView === 'dashboard' && (
            <DashboardHome userName={user.name} />
          )}

          {activeView === 'products' && <Products />}

          {activeView === 'profile' && (
            <Profile
              user={user}
              onUserUpdated={onUserUpdated}
              onBack={() => setActiveView('dashboard')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
