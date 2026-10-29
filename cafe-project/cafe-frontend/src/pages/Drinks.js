import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import './Drinks.css';
import { Link } from 'react-router-dom';

const Drinks = ({ addToCart, currentUser }) => {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getProductImage = (item) => {
    if (!item) return '/images/placeholder-drink.png';
    
    if (item.imageUrl) {
      const url = item.imageUrl.trim();
      if (url) {
        return url.startsWith('/') ? url : '/' + url;
      }
    }
    return `/images/drinks/${item.id}.png`;
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      
      const drinkProducts = allProducts.filter(product => 
        product.category?.toLowerCase().includes('напиток') ||
        product.category?.toLowerCase().includes('кофе') ||
        product.category?.toLowerCase().includes('чай') ||
        product.category?.toLowerCase() === 'напитки'
      );
      
      console.log('Напитки с сервера:', drinkProducts);
      
      if (drinkProducts.length > 0) {
        setDrinks(drinkProducts);
      } else {
        setError('Напитки не найдены');
        setDrinks([]);
      }
    } catch (error) {
      console.error('Error fetching drinks:', error);
      setError('Ошибка загрузки напитков');
      setDrinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, drink) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему чтобы добавить товар в корзину');
      return;
    }
    addToCart(drink, 1);
  };

  const handleCardClick = (drinkId) => {
    navigate(`/product/${drinkId}`);
  };

  if (loading) {
    return (
      <div className="drinks-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка напитков...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="drinks-page">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/">Главная</Link>
          <span> / </span>
          <span>Напитки</span>
        </nav>

        <div className="drinks-header">
          <h1>Напитки</h1>
          <p>Согреем в холод, освежим в жару</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="drinks-grid">
          {drinks.length > 0 ? (
            drinks.map(drink => (
              <div 
                key={drink.id} 
                className="drink-card clickable-card"
                onClick={() => handleCardClick(drink.id)}
              >
                <div className="drink-image">
                  <img 
                    src={getProductImage(drink)}
                    alt={drink.name}
                    onError={(e) => {
                      console.log('Ошибка загрузки картинки для:', drink.name, 'URL:', e.target.src);
                      e.target.src = '/images/placeholder-drink.png';
                    }}
                  />
                </div>
                <div className="drink-info">
                  <h3 className="drink-name">{drink.name}</h3>
                  <p className="drink-description">{drink.description}</p>
                  <div className="drink-details">
                    <span className="drink-volume">{drink.volume || drink.weight || '200 мл'}</span>
                    <span className="drink-price">{drink.price?.toFixed(2)} р.</span>
                  </div>
                  <button 
                    className="add-to-cart"
                    onClick={(e) => handleAddToCart(e, drink)}
                    disabled={!currentUser}
                    title={!currentUser ? "Войдите для заказа" : ""}
                  >
                    {currentUser ? 'В корзину' : 'Войдите для заказа'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>Напитки временно отсутствуют</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drinks;