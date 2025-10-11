import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se usuário está logado ao inicializar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        // Verificar se o token ainda é válido
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.get('/auth/profile');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token inválido, fazer logout
          logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await api.post('/cognito-auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const { accessToken, user: userData } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Configurar header de autorização padrão
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: response.data.message || 'Erro no login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.response?.status === 400) {
        return { success: false, error: error.response.data.message || 'Email ou senha inválidos' };
      } else if (error.response?.status === 401) {
        return { success: false, error: 'Email ou senha inválidos' };
      } else if (error.response?.status === 403) {
        return { success: false, error: 'Conta não confirmada. Verifique seu email.' };
      }
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, affiliation = 'jedi') => {
    try {
      setLoading(true);
      
      const response = await api.post('/cognito-auth/register', {
        email,
        password,
        affiliation
      });
      
      if (response.data.success) {
        return { success: true, message: 'Conta criada! Verifique seu email para confirmar.' };
      } else {
        return { success: false, error: response.data.message || 'Erro ao registrar' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      if (error.response?.status === 400) {
        const message = error.response.data.message;
        if (message.includes('already exists')) {
          return { success: false, error: 'Este email já está cadastrado' };
        } else if (message.includes('Password')) {
          return { success: false, error: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número' };
        }
        return { success: false, error: message || 'Dados inválidos' };
      }
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  const confirmAccount = async (email, confirmationCode) => {
    try {
      setLoading(true);
      
      const response = await api.post('/cognito-auth/confirm', {
        email,
        confirmationCode
      });
      
      if (response.data.success) {
        return { success: true, message: 'Conta confirmada com sucesso! Agora você pode fazer login.' };
      } else {
        return { success: false, error: response.data.message || 'Código de confirmação inválido' };
      }
    } catch (error) {
      console.error('Erro na confirmação:', error);
      if (error.response?.status === 400) {
        const message = error.response.data.message;
        if (message.includes('already confirmed')) {
          return { success: false, error: 'Esta conta já foi confirmada' };
        } else if (message.includes('expired')) {
          return { success: false, error: 'Código expirado. Solicite um novo código.' };
        }
        return { success: false, error: message || 'Código de confirmação inválido' };
      }
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      setLoading(true);
      
      const response = await api.post('/cognito-auth/resend-confirmation', {
        email
      });
      
      if (response.data.success) {
        return { success: true, message: 'Novo código enviado para seu email' };
      } else {
        return { success: false, error: response.data.message || 'Erro ao reenviar código' };
      }
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      
      const response = await api.post('/cognito-auth/forgot-password', {
        email
      });
      
      if (response.data.success) {
        return { success: true, message: 'Código de recuperação enviado para seu email' };
      } else {
        return { success: false, error: response.data.message || 'Erro ao solicitar recuperação' };
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, confirmationCode, newPassword) => {
    try {
      setLoading(true);
      
      const response = await api.post('/cognito-auth/reset-password', {
        email,
        confirmationCode,
        newPassword
      });
      
      if (response.data.success) {
        return { success: true, message: 'Senha alterada com sucesso!' };
      } else {
        return { success: false, error: response.data.message || 'Erro ao redefinir senha' };
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpar storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // Remover header de autorização
    delete api.defaults.headers.Authorization;

    // Limpar estado
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    confirmAccount,
    resendConfirmationCode,
    forgotPassword,
    resetPassword,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;