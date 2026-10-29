import api from './api';

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; 
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await api.get(`/products/search?name=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};