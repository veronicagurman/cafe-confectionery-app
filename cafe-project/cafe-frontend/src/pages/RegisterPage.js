import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const texts = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Отличный'];
    const classes = ['strength-weak', 'strength-weak', 'strength-medium', 'strength-medium', 'strength-strong'];
    
    return {
      score: score,
      text: texts[score] || '',
      className: classes[score] || ''
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    if (name === 'password' && errors.confirmPassword) {
      const newErrors = { ...errors };
      delete newErrors.confirmPassword;
      setErrors(newErrors);
    }
    
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Минимум 3 символа';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Максимум 20 символов';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Только латинские буквы, цифры и подчеркивание';
    }

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Пароль слишком слабый';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
      const result = await authService.register(
        formData.username,
        formData.password,
        formData.email
      );
      
      if (result.success) {
        window.location.href = '/';
      } else {
        setServerError(result.error || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.response?.data?.error || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img 
            src="/images/logo_lite.svg" 
            alt="PAUSE" 
            className="register-logo"
          />
        </div>

        <div className="register-content">
          <h2 style={{
            fontFamily: "'Abhaya Libre', serif",
            fontSize: "2rem",
            color: "#401B00",
            marginBottom: "0.5rem",
            textAlign: "center"
          }}>
            Создать аккаунт
          </h2>
          <p style={{
            fontFamily: "'Afacad', sans-serif",
            fontSize: "1.1rem",
            color: "#666",
            marginBottom: "2rem",
            textAlign: "center"
          }}>
            Заполните форму ниже для регистрации
          </p>
          
          {serverError && (
            <div className="server-error">{serverError}</div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Имя пользователя *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  placeholder="alex123"
                  disabled={loading}
                  autoComplete="username"
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="alex@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="password">Пароль *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Минимум 6 символов"
                disabled={loading}
                autoComplete="new-password"
              />
              <div className="password-strength">
                <div className={`strength-bar ${passwordStrength.className}`}></div>
              </div>
              {formData.password && (
                <span className="strength-text">
                  Сила пароля: {passwordStrength.text}
                </span>
              )}
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="confirmPassword">Подтвердите пароль *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Повторите пароль"
                disabled={loading}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="register-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{ opacity: 0.7 }}>Регистрация...</span>
                </>
              ) : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="register-links">
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;