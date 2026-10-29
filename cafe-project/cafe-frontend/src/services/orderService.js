import api from './api';

export const orderService = {
  createOrder: async (username) => {
    const response = await api.post('/orders/create', null, {
      params: { username }
    });
    return response.data;
  },

  getUserOrders: async (username) => {
    const response = await api.get(`/orders/user/${username}`);
    return response.data;
  }
};