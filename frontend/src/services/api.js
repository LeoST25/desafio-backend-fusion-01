import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autorização
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirado, fazer logout
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Registro
  async register(email, password, affiliation = 'neutral') {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        affiliation,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Confirmar conta
  async confirmAccount(email, confirmationCode) {
    try {
      const response = await apiClient.post('/auth/confirm', {
        email,
        confirmationCode,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Obter informações do usuário
  async getUserInfo() {
    try {
      const response = await apiClient.get('/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Verificar status do Cognito
  async getCognitoStatus() {
    try {
      const response = await apiClient.get('/auth/status');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },
};

// Serviços de planetas
export const planetsService = {
  // Listar planetas
  async getAll() {
    try {
      const response = await apiClient.get('/planets');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Obter planeta por ID
  async getById(id) {
    try {
      const response = await apiClient.get(`/planets/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Criar planeta
  async create(planetData) {
    try {
      const response = await apiClient.post('/planets', planetData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Atualizar planeta
  async update(id, planetData) {
    try {
      const response = await apiClient.put(`/planets/${id}`, planetData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },

  // Deletar planeta
  async delete(id) {
    try {
      const response = await apiClient.delete(`/planets/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { message: 'Erro de conexão' }
      };
    }
  },
};

// Outros serviços da API
export const charactersService = {
  async getAll() {
    try {
      const response = await apiClient.get('/characters');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },
};

export const spaceshipsService = {
  async getAll() {
    try {
      const response = await apiClient.get('/spaceships');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },
};

export const starSystemsService = {
  async getAll() {
    try {
      const response = await apiClient.get('/star-systems');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },
};

// Exportar como default e named
export default apiClient;