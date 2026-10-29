import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Торты',
    composition: '',
    weight: '',
    calories: '',
    expirationDays: '',
    storageConditions: '',
    imageUrl: ''
  });

  const categories = ['Торты', 'Десерты', 'Выпечка', 'Напитки'];

  useEffect(() => {
    const checkAdmin = async () => {
      if (!authService.isAuthenticated()) {
        window.location.href = '/login';
        return;
      }
      
      if (!authService.hasRole('ROLE_ADMIN')) {
        window.location.href = '/';
      }
    };
    
    checkAdmin();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = authService.getToken();
      
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        calories: newProduct.calories ? parseInt(newProduct.calories) : null,
        expirationDays: newProduct.expirationDays ? parseInt(newProduct.expirationDays) : null,
        available: true
      };
      
      const response = await fetch('http://localhost:8080/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('Товар добавлен!');
        setNewProduct({
          name: '',
          description: '',
          price: '',
          category: 'Торты',
          composition: '',
          weight: '',
          calories: '',
          expirationDays: '',
          storageConditions: '',
          imageUrl: ''
        });
        fetchProducts();
      } else {
        const errorText = await response.text();
        alert('Ошибка при добавлении товара: ' + errorText);
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    
    try {
      const token = authService.getToken();
      const response = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        alert('Товар удален!');
        fetchProducts();
      } else {
        alert('Ошибка при удалении товара');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Панель администратора</h1>
        
        <section className="add-product-section">
          <h2>Добавить новый товар</h2>
          <form onSubmit={handleAddProduct} className="product-form">
            <input
              type="text"
              name="name"
              placeholder="Название товара"
              value={newProduct.name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            
            <textarea
              name="description"
              placeholder="Описание товара"
              value={newProduct.description}
              onChange={handleInputChange}
              required
              disabled={loading}
              rows="3"
            />
            
            <input
              type="number"
              name="price"
              placeholder="Цена"
              value={newProduct.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              disabled={loading}
            />
            
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <textarea
              name="composition"
              placeholder="Состав (ингредиенты через запятую)"
              value={newProduct.composition}
              onChange={handleInputChange}
              disabled={loading}
              rows="2"
            />
            
            <input
              type="text"
              name="weight"
              placeholder="Вес (например: 1200 г, 450 мл)"
              value={newProduct.weight}
              onChange={handleInputChange}
              disabled={loading}
            />
            
            <input
              type="number"
              name="calories"
              placeholder="Калорийность на 100г"
              value={newProduct.calories}
              onChange={handleInputChange}
              min="0"
              disabled={loading}
            />
            
            <input
              type="number"
              name="expirationDays"
              placeholder="Срок годности (дней)"
              value={newProduct.expirationDays}
              onChange={handleInputChange}
              min="1"
              disabled={loading}
            />
            
            <input
              type="text"
              name="storageConditions"
              placeholder="Условия хранения (например: при +2...+6°C)"
              value={newProduct.storageConditions}
              onChange={handleInputChange}
              disabled={loading}
            />
            
            <input
              type="text"
              name="imageUrl"
              placeholder="URL изображения (опционально)"
              value={newProduct.imageUrl}
              onChange={handleInputChange}
              disabled={loading}
            />
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Добавление...' : 'Добавить товар'}
            </button>
          </form>
        </section>

        <section className="products-section">
          <h2>Управление товарами ({products.length})</h2>
          <div className="products-grid">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  
                  {product.composition && (
                    <p className="composition"><strong>Состав:</strong> {product.composition}</p>
                  )}
                  
                  {product.weight && (
                    <p className="weight"><strong>Вес:</strong> {product.weight}</p>
                  )}
                  
                  {product.calories && (
                    <p className="calories"><strong>Калорийность:</strong> {product.calories} ккал/100г</p>
                  )}
                  
                  <div className="product-details">
                    <span className="price">{product.price} р.</span>
                    <span className="category">{product.category}</span>
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={loading}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Товары не найдены</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;