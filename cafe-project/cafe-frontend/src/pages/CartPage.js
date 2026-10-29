import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ 
  cart, 
  currentUser, 
  updateQuantity, 
  clearCart 
}) => {
  const getProductImage = (product) => {
    if (!product) return '/images/placeholder.png';
    
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      let url = product.imageUrl.trim();
      if (!url.startsWith('/')) {
        url = '/' + url;
      }
      return url;
    }
    
    const category = product.category?.toLowerCase() || '';
    
    if (category.includes('торт')) {
      return `/images/cakes/${product.id}.png`;
    } else if (category.includes('десерт')) {
      return `/images/desserts/${product.id}.png`;
    } else if (category.includes('выпечка') || category.includes('печка') || category.includes('булка') || category.includes('хлеб')) {
      return `/images/bakery/${product.id}.png`;
    } else if (category.includes('напиток')) {
      return `/images/drinks/${product.id}.png`;
    }
    
    return `/images/products/${product.id}.png`;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = calculateTotal();

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Удалить товар из корзины?')) {
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/orders/create?username=${currentUser}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        alert('Заказ успешно оформлен!');
        clearCart();
      }
    } catch (error) {
      alert('Ошибка при оформлении заказа');
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <nav className="breadcrumbs">
            <Link to="/">Главная</Link>
            <span> / </span>
            <span>Корзина</span>
          </nav>
          
          <div className="empty-cart">
            <h2>Корзина пуста</h2>
            <p>Добавьте товары из каталога, чтобы сделать заказ</p>
            <Link to="/cakes" className="btn-shopping">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/">Главная</Link>
          <span> / </span>
          <span>Корзина</span>
        </nav>

        <div className="cart-header">
          <h1>Корзина</h1>
          <div className="cart-summary">
            В корзине: <strong>{totalItems} товар(ов)</strong>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={getProductImage(item.product)}
                    alt={item.product?.name || 'Товар'}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </div>
                
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.product?.name || 'Товар'}</h3>
                  <p className="cart-item-description">{item.product?.description || ''}</p>
                  <span className="cart-item-weight">{item.product?.weight || '100 г'}</span>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-price">
                  {(item.product?.price * item.quantity || 0).toFixed(2)} р.
                </div>
                
                <button 
                  className="cart-item-remove"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary-panel">
            <h2>Итого</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span className="label">Товары ({totalItems})</span>
                <span className="value">{totalPrice.toFixed(2)} р.</span>
              </div>
              <div className="summary-row">
                <span className="label">Доставка</span>
                <span className="value">Бесплатно</span>
              </div>
            </div>
            
            <div className="summary-total">
              <span className="label">К оплате</span>
              <span className="value">{totalPrice.toFixed(2)} р.</span>
            </div>
            
            <div className="cart-actions">
              <button 
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={!currentUser}
              >
                {currentUser ? 'Оформить заказ' : 'Войдите для заказа'}
              </button>
              <button 
                className="btn-clear"
                onClick={clearCart}
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;