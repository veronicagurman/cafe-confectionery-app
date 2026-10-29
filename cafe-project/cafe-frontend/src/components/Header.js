import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService'; 
import './Header.css';

const Header = ({ currentUser, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    closeSidebar();
  };

  const getUserRoles = () => {
    try {
      const roles = localStorage.getItem('userRoles');
      if (roles) {
        return JSON.parse(roles);
      }
      
      if (authService.getCurrentUserRoles) {
        return authService.getCurrentUserRoles();
      }
      
      return [];
    } catch (error) {
      return [];
    }
  };

  const userRoles = getUserRoles();
  const isAdmin = userRoles.includes('ROLE_ADMIN') || authService.hasRole('ROLE_ADMIN');
  const isRegularUser = userRoles.includes('ROLE_USER') || authService.hasRole('ROLE_USER');

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <button 
              className="menu-button"
              onClick={toggleSidebar}
              aria-label="Открыть меню"
            >
              <img src="/images/menu.svg" alt="Меню" className="menu-icon" />
            </button>

            <div className="logo">
              <Link to="/" className="logo-link">
                <img 
                  src="/images/logo_dark.svg" 
                  alt="PAUSE кондитерская" 
                  className="logo-image"
                />
              </Link>
            </div>

            <div className="header-actions">
              {currentUser ? (
                <div className="user-menu">
                  {isAdmin && (
                    <>
                      <Link to="/admin" className="admin-btn" title="Админ панель">
                        <img src="/images/admin.svg" alt="Админ" className="admin-icon" />
                      </Link>
                    </>
                  )}
                  
                  <button onClick={onLogout} className="logout-btn">Выйти</button>
                </div>
              ) : (
                <Link to="/login" className="login-section">
                  <img src="/images/icon.svg" alt="Войти" className="user-icon" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      ></div>
      
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/images/logo_lite.svg" alt="PAUSE" className="sidebar-logo-image" />
          </div>
          <button className="sidebar-close" onClick={closeSidebar}>×</button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <h3>Каталог</h3>
            <div className="sidebar-links">
              <Link to="/cakes" className="sidebar-link" onClick={closeSidebar}>Торты</Link>
              <Link to="/desserts" className="sidebar-link" onClick={closeSidebar}>Десерты</Link>
              <Link to="/bakery" className="sidebar-link" onClick={closeSidebar}>Выпечка</Link>
              <Link to="/drinks" className="sidebar-link" onClick={closeSidebar}>Напитки</Link>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Навигация</h3>
            <div className="sidebar-links">
              <Link to="/" className="sidebar-link" onClick={closeSidebar}>Главная</Link>
              <Link to="/about" className="sidebar-link" onClick={closeSidebar}>О нас</Link>
              
              {isRegularUser && (
                <Link to="/cart" className="sidebar-link" onClick={closeSidebar}>
                  Корзина
                </Link>
              )}
              
              {isAdmin && (
                <>
                  <Link to="/admin" className="sidebar-link admin-link" onClick={closeSidebar}>
                    Админ-панель
                  </Link>
                  <Link to="/admin/orders" className="sidebar-link" onClick={closeSidebar}>
                    Управление заказами
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Аккаунт</h3>
            <div className="sidebar-links">
              {currentUser ? (
                <>
                  {!isAdmin && (
                    <Link to="/cart" className="sidebar-link" onClick={closeSidebar}>
                      Моя корзина
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="sidebar-link logout">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="sidebar-link" onClick={closeSidebar}>Войти</Link>
                  <Link to="/register" className="sidebar-link" onClick={closeSidebar}>Регистрация</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Header;