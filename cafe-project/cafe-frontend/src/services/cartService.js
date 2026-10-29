import api from './api';

export const cartService = {
  getCart: async (username) => {
    try {
      const response = await api.get(`/cart/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  },

  addToCart: async (username, productId, quantity) => {
    const response = await api.post('/cart/add', null, {
      params: { username, productId, quantity }
    });
    return response.data;
  },

  clearCart: async (username) => {
    await api.delete(`/cart/clear/${username}`);
  }
};