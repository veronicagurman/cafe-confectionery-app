import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import './Desserts.css';
import { Link } from 'react-router-dom';

const Desserts = ({ addToCart, currentUser }) => {
  const [desserts, setDesserts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getProductImage = (item) => {
    if (!item) return '/images/placeholder-dessert.png';
    
    if (item.imageUrl) {
      const url = item.imageUrl.trim();
      if (url) {
        return url.startsWith('/') ? url : '/' + url;
      }
    }
    
    return `/images/desserts/${item.id}.png`;
  };

  useEffect(() => {
    fetchDesserts();
  }, []);

  const fetchDesserts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      
      const dessertProducts = allProducts.filter(product => 
        product.category?.toLowerCase().includes('десерт') || 
        product.category?.toLowerCase() === 'десерты'
      );
      
      if (dessertProducts.length > 0) {
        setDesserts(dessertProducts);
      } else {
        setError('Десерты не найдены');
        setDesserts([]);
      }
    } catch (error) {
      setError('Ошибка загрузки десертов');
      setDesserts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, dessert) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему чтобы добавить товар в корзину');
      navigate('/login');
      return;
    }
    addToCart(dessert, 1);
  };

  const handleCardClick = (dessertId) => {
    navigate(`/product/${dessertId}`);
  };

  if (loading) {
    return (
      <div className="desserts-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка десертов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="desserts-page">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/">Главная</Link>
          <span> / </span>
          <span>Десерты</span>
        </nav>

        <div className="desserts-header">
          <h1>Десерты</h1>
          <p>Вкусный финал вашей трапезы</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="desserts-grid">
          {desserts.length > 0 ? (
            desserts.map(dessert => (
              <div 
                key={dessert.id} 
                className="dessert-card clickable-card"
                onClick={() => handleCardClick(dessert.id)}
              >
                <div className="dessert-image">
                  <img 
                    src={getProductImage(dessert)}
                    alt={dessert.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-dessert.png';
                    }}
                  />
                </div>
                <div className="dessert-info">
                  <h3 className="dessert-name">{dessert.name}</h3>
                  <p className="dessert-description">{dessert.description}</p>
                  <div className="dessert-details">
                    <span className="dessert-weight">{dessert.weight || '400 г'}</span>
                    <span className="dessert-price">{dessert.price?.toFixed(2)} р.</span>
                  </div>
                  <button 
                    className="add-to-cart"
                    onClick={(e) => handleAddToCart(e, dessert)}
                    disabled={!currentUser}
                  >
                    {currentUser ? 'В корзину' : 'Войдите для заказа'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>Десерты временно отсутствуют</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Desserts;