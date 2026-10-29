import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import './Bakery.css';

const Bakery = ({ addToCart, currentUser }) => {
  const [bakeryItems, setBakeryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getProductImage = (item) => {
    if (!item) return '/images/placeholder-bakery.png';
    
    if (item.imageUrl) {
      const url = item.imageUrl.trim();
      if (url) {
        return url.startsWith('/') ? url : '/' + url;
      }
    }
    
    return `/images/bakery/${item.id}.png`;
  };

  useEffect(() => {
    fetchBakery();
  }, []);

  const fetchBakery = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      
      const bakeryProducts = allProducts.filter(product => 
        product.category?.toLowerCase().includes('выпечка') ||
        product.category?.toLowerCase().includes('печка') ||
        product.category?.toLowerCase().includes('булка') ||
        product.category?.toLowerCase().includes('хлеб')
      );
      
      if (bakeryProducts.length > 0) {
        setBakeryItems(bakeryProducts);
      } else {
        setError('Выпечка не найдена');
        setBakeryItems([]);
      }
    } catch (error) {
      setError('Ошибка загрузки выпечки');
      setBakeryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему чтобы добавить товар в корзину');
      navigate('/login');
      return;
    }
    addToCart(item, 1);
  };

  if (loading) {
    return (
      <div className="bakery-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка выпечки...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bakery-page">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/">Главная</Link>
          <span> / </span>
          <span>Выпечка</span>
        </nav>

        <div className="bakery-header">
          <h1>Выпечка</h1>
          <p>Не только сладкая, но и соленая</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="bakery-grid">
          {bakeryItems.length > 0 ? (
            bakeryItems.map(item => (
              <div 
                key={item.id} 
                className="bakery-card clickable-card" 
                onClick={() => handleCardClick(item.id)}
              >
                <div className="bakery-image">
                  <img 
                    src={getProductImage(item)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-bakery.png';
                    }}
                  />
                </div>
                <div className="bakery-info">
                  <h3 className="bakery-name">{item.name}</h3>
                  <p className="bakery-description">{item.description}</p>
                  <div className="bakery-details">
                    <span className="bakery-weight">{item.weight || '180 г'}</span>
                    <span className="bakery-price">{item.price?.toFixed(2)} р.</span>
                  </div>
                  <button 
                    className="add-to-cart"
                    onClick={(e) => handleAddToCart(e, item)}
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
              <p>Выпечка временно отсутствует</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bakery;