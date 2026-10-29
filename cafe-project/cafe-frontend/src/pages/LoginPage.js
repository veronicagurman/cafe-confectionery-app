import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Имя пользователя обязательно';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const result = await authService.login(formData.username, formData.password);
      
      if (result.success) {
        onLogin(result.user);
        navigate('/'); 
      } else {
        setServerError(result.error);
      }
    } catch (error) {
      setServerError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-content">
            <h1>Войти в аккаунт</h1>
            <p>Добро пожаловать! Пожалуйста, войдите в свой аккаунт.</p>
            
            {serverError && (
              <div className="server-error">{serverError}</div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label> 
                <input
                  type="text" 
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  placeholder="Введите ваше имя пользователя" 
                  disabled={loading}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Введите ваш пароль"
                  disabled={loading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </form>

            <div className="login-links">
              <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-image">
            <div className="image-overlay">
              <img 
            src="/images/logo_lite.svg" 
            alt="PAUSE" 
            className="register-logo"
          />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;