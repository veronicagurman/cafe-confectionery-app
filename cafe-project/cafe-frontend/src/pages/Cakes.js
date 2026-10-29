import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import './Cakes.css';
import { Link } from 'react-router-dom';

const Cakes = ({ addToCart, currentUser }) => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getProductImage = (item) => {
    if (!item) return '/images/placeholder-cake.png';
    
    if (item.imageUrl) {
      const url = item.imageUrl.trim();
      if (url) {
        return url.startsWith('/') ? url : '/' + url;
      }
    }
    
    return `/images/cakes/${item.id}.png`;
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      
      const cakeProducts = allProducts.filter(product => 
        product.category?.toLowerCase().includes('торт') || 
        product.category?.toLowerCase() === 'торты' ||
        product.name?.toLowerCase().includes('торт')
      );
      
      if (cakeProducts.length > 0) {
        setCakes(cakeProducts);
      } else {
        setError('Торты не найдены');
        setCakes([]);
      }
    } catch (error) {
      setError('Ошибка загрузки тортов');
      setCakes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, cake) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему чтобы добавить товар в корзину');
      navigate('/login');
      return;
    }
    
    if (!addToCart) {
      alert('Ошибка: функция добавления в корзину недоступна');
      return;
    }
    
    if (!cake.id) {
      alert('Ошибка: у товара отсутствует ID');
      return;
    }
   
    addToCart(cake, 1);
  };

  const handleCardClick = (cakeId) => {
    navigate(`/product/${cakeId}`);
  };

  if (loading) {
    return (
      <div className="cakes-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка тортов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cakes-page">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/">Главная</Link>
          <span> / </span>
          <span>Торты</span>
        </nav>

        <div className="cakes-header">
          <h1>Торты</h1>
          <p>Сделаем любой день слаще с нашими авторскими тортами</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="cakes-grid">
          {cakes.length > 0 ? (
            cakes.map(cake => (
              <div 
                key={cake.id} 
                className="cake-card clickable-card"
                onClick={() => handleCardClick(cake.id)}
              >
                <div className="cake-image">
                  <img 
                    src={getProductImage(cake)}
                    alt={cake.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-cake.png';
                    }}
                  />
                </div>
                <div className="cake-info">
                  <h3 className="cake-name">
                    {cake.name}
                  </h3>
                  <p className="cake-description">
                    {cake.description || 'Вкусный десерт'}
                  </p>
                  <div className="cake-details">
                    <span className="cake-weight">{cake.weight || '1200 г'}</span>
                    <span className="cake-price">{cake.price?.toFixed(2)} р.</span>
                  </div>
                  <button 
                    className="add-to-cart"
                    onClick={(e) => handleAddToCart(e, cake)}
                    disabled={!currentUser}
                    title={!currentUser ? "Войдите для заказа" : "Добавить в корзину"}
                  >
                    {currentUser ? 'В корзину' : 'Войдите для заказа'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>Торты временно отсутствуют</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cakes;