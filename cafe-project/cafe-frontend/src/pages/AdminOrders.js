import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = authService.getToken();
      
      const response = await fetch('http://localhost:8080/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else if (response.status === 401) {
        setError('Вы не авторизованы как администратор');
      } else if (response.status === 403) {
        setError('У вас нет прав администратора');
      } else {
        setError(`Ошибка сервера: ${response.status}`);
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    if (window.confirm('Подтвердить заказ?')) {
      try {
        const token = authService.getToken();
        
        const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/confirm`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          alert('Заказ подтвержден!');
          fetchOrders();
        } else {
          alert('Ошибка подтверждения заказа');
        }
      } catch (error) {
        alert('Ошибка подтверждения');
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Отменить заказ?')) {
      try {
        const token = authService.getToken();
        
        const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/cancel`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          alert('Заказ отменен!');
          fetchOrders();
        } else {
          alert('Ошибка отмены заказа');
        }
      } catch (error) {
        alert('Ошибка отмены');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU');
    } catch (error) {
      return dateString;
    }
  };

  const getOrderStatus = (order) => {
    return order?.status || 'ОЖИДАЕТ';
  };

  const getUsername = (order) => {
    if (!order?.user) return 'Неизвестно';
    return order.user.username || order.user.name || 'Неизвестно';
  };

  const getEmail = (order) => {
    if (!order?.user) return 'Не указан';
    return order.user.email || 'Не указан';
  };

  const getTotalPrice = (order) => {
    const price = order?.totalPrice || order?.total || 0;
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка заказов...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders">
        <div className="container">
          <div className="error-message">
            <h2>Ошибка</h2>
            <p>{error}</p>
            <button onClick={() => window.location.href = '/login'} className="btn-login">
              Войти как администратор
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="container">
        <h1>Управление заказами</h1>
        
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Всего заказов</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {orders.filter(o => getOrderStatus(o) === 'ОЖИДАЕТ').length}
            </span>
            <span className="stat-label">Ожидают</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {orders.filter(o => getOrderStatus(o) === 'ПОДТВЕРЖДЕН').length}
            </span>
            <span className="stat-label">Подтверждены</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {orders.filter(o => getOrderStatus(o) === 'ОТМЕНЕН').length}
            </span>
            <span className="stat-label">Отменены</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Нет заказов для отображения</p>
            <button onClick={fetchOrders} className="btn-refresh">
              Обновить
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const status = getOrderStatus(order);
              const statusClass = status.toLowerCase();
              
              return (
                <div key={order.id} className={`order-card status-${statusClass}`}>
                  <div className="order-header">
                    <h3>Заказ #{order.id}</h3>
                    <span className={`status-badge status-${statusClass}`}>
                      {status}
                    </span>
                  </div>
                  
                  <div className="order-info">
                    <p><strong>Клиент:</strong> {getUsername(order)}</p>
                    <p><strong>Email:</strong> {getEmail(order)}</p>
                    <p><strong>Сумма:</strong> {getTotalPrice(order)} р.</p>
                    <p><strong>Дата создания:</strong> {formatDate(order.createdAt)}</p>
                  </div>
                  
                  <div className="order-actions">
                    {status === 'ОЖИДАЕТ' && (
                      <>
                        <button 
                          className="btn-confirm"
                          onClick={() => handleConfirmOrder(order.id)}
                        >
                          ✓ Подтвердить
                        </button>
                        <button 
                          className="btn-cancel"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          ✗ Отменить
                        </button>
                      </>
                    )}
                    
                    {status === 'ПОДТВЕРЖДЕН' && (
                      <span className="confirmed-text">✓ Заказ подтвержден</span>
                    )}
                    
                    {status === 'ОТМЕНЕН' && (
                      <span className="cancelled-text">✗ Заказ отменен</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;