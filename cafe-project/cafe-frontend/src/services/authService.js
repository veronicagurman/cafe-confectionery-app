import api from './api';

export const authService = {
  login: async (username, password) => {
    try {
      
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      const { token, username: userFromServer, roles } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', userFromServer);
      localStorage.setItem('userRoles', JSON.stringify(roles || []));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { 
        success: true, 
        user: userFromServer, 
        roles: roles || []
      };
    } catch (error) {
      console.error('Ошибка логина:', error);
      console.error('Ответ сервера:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Ошибка авторизации' 
      };
    }
  },

  register: async (username, password, email) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        password,
        email
      });
      
      const { token, username: userFromServer } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', userFromServer);
      localStorage.setItem('userRoles', JSON.stringify(['USER']));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { 
        success: true, 
        user: userFromServer 
      };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Ошибка регистрации' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRoles');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser: () => {
    return localStorage.getItem('currentUser');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUserRoles: () => {
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles) : [];
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
hasRole: (role) => {
  const roles = authService.getUserRoles();
  return roles.includes(role);
},

isRegularUser: () => {
  const roles = authService.getUserRoles();
  return roles.includes('ROLE_USER') && !roles.includes('ROLE_ADMIN');
},
  checkAuth: async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        return { authenticated: false };
      }
      const user = authService.getCurrentUser();
      return { 
        authenticated: !!user,
        username: user || null
      };
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      return { authenticated: false };
    }
  }
};

const token = authService.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}