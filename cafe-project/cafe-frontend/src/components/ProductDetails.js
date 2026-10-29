import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import './ProductDetails.css';

const ProductDetails = ({ addToCart, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setImageError(false);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const getImageUrl = () => {
    if (!product?.imageUrl) return '';
    
    let url = product.imageUrl.trim();
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    
    return url;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Загрузка товара...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h2 className="error-message">Товар не найден</h2>
            <button 
              onClick={() => navigate('/cakes')}
              className="btn-back"
            >
              Вернуться в каталог
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl();

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumbs">
          <button 
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            ← Назад
          </button>
        </nav>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              {imageUrl ? (
                <>
                  <img 
                    src={imageUrl}
                    alt={product.name}
                    onError={() => {
                      setImageError(true);
                    }}
                    onLoad={() => {
                      setImageError(false);
                    }}
                  />
                  
                  {imageError && (
                    <div className="image-error">
                      <p>Изображение не загрузилось</p>
                      <p><strong>Путь:</strong> {imageUrl}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image">
                  <p>Нет изображения</p>
                  <p style={{ fontSize: '14px' }}>
                    imageUrl не указан
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="product-category">{product.category}</span>
              <span className="product-weight">{product.weight || '100 г'}</span>
            </div>
            
            <p className="product-description">{product.description}</p>
            
            <div className="product-price-section">
              <div className="price">
                <span className="price-value">{product.price?.toFixed(2)}</span>
                <span className="price-unit">р.</span>
              </div>
            </div>
            
            <div className="quantity-control">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="quantity-btn"
              >
                -
              </button>
              <div className="quantity-value">
                {quantity}
              </div>
              <button
                onClick={incrementQuantity}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!currentUser}
              className="btn-add-to-cart"
            >
              {currentUser ? 'Добавить в корзину' : 'Войдите для заказа'}
            </button>
            
            <div className="additional-info">
              <h3>Характеристики</h3>
              <ul>
                <li>
                  <strong>Категория:</strong> 
                  <span>{product.category}</span>
                </li>
                <li>
                  <strong>Вес:</strong> 
                  <span>{product.weight || '100 г'}</span>
                </li>
                <li>
                  <strong>Состав:</strong> 
                  <span>{product.composition || 'Не указано'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;