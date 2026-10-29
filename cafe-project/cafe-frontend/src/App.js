import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Cakes from './pages/Cakes';
import Desserts from './pages/Desserts';
import Bakery from './pages/Bakery';
import Drinks from './pages/Drinks';
import ProductDetails from './components/ProductDetails';
import AboutPage from './pages/AboutPage';
import AdminPanel from './pages/AdminPanel';
import AdminOrders from './pages/AdminOrders';
import { authService } from './services/authService';
import './App.css';

const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};
const AdminRoute = ({ children }) => {
  if (!authService.isAuthenticated() || !authService.hasRole('ROLE_ADMIN')) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = async (product, quantity) => {
    try {
      const token = authService.getToken();
      if (!token || !currentUser) {
        alert('Пожалуйста, войдите в систему');
        return;
      }
      if (!product || !product.id) {
        console.error('Товар не определен или отсутствует ID:', product);
        alert('Ошибка: товар не найден');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/cart/add?username=${currentUser}&productId=${product.id}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
     
      if (response.ok) {
        const addedItem = await response.json();
       
        await loadCart();
        
        alert(`${product.name} добавлен в корзину!`);
      } else {
        const errorText = await response.text();
         alert('Ошибка добавления в корзину');
      }
    } catch (error) {
       alert('Ошибка соединения с сервером');
    }
  };

  const loadCart = async () => {
    if (!currentUser) {
      setCart([]);
      return;
    }
    
    try {
      const token = authService.getToken();
     
      const response = await fetch(`http://localhost:8080/api/cart/${currentUser}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      } else if (response.status === 404) {
        setCart([]);
      } else {
        setCart([]);
      }
    } catch (error) {
      setCart([]);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);

  };
  const removeFromCart = async (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    
  };

  const clearCart = async () => {
    if (!currentUser) return;
    
    try {
      const token = authService.getToken();
      const response = await fetch(`http://localhost:8080/api/cart/clear/${currentUser}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        setCart([]);
        alert('Корзина очищена');
      }
    } catch (error) {
      console.error('Ошибка очистки корзины:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
     
      const result = await authService.checkAuth();
      if (result.authenticated) {
        setCurrentUser(result.username);
      } else {
        authService.logout();
        setCurrentUser(null);
      }
      setLoading(false);
    };
    
    initialize();
  }, []);

  useEffect(() => {
    if (currentUser) {
       loadCart();
    } else {
      setCart([]);
    }
  }, [currentUser]);

  const login = (username) => {
    setCurrentUser(username);
    loadCart();
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setCart([]);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header currentUser={currentUser} onLogout={logout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cakes" element={<Cakes addToCart={addToCart} currentUser={currentUser} />} />
            <Route path="/desserts" element={<Desserts addToCart={addToCart} currentUser={currentUser} />} />
            <Route path="/bakery" element={<Bakery addToCart={addToCart} currentUser={currentUser} />} />
            <Route path="/drinks" element={<Drinks addToCart={addToCart} currentUser={currentUser} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route 
  path="/product/:id" 
  element={<ProductDetails addToCart={addToCart} currentUser={currentUser} />} 
/>
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } 
            />
            <Route 
  path="/admin/orders" 
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  } 
/>
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <CartPage 
                    currentUser={currentUser}
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                    loadCart={loadCart}
                  />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;