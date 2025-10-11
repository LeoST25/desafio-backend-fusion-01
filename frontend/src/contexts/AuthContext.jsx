import React, { createContext, useContext, useState, useEffect } from 'react';

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
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar usuários registrados ou permitir usuário teste
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      let user = users.find(u => u.email === email && u.password === password);
      
      // Usuário teste padrão
      if (email === 'test@test.com' && password === 'Test123!') {
        user = { email: 'test@test.com', password: 'Test123!', confirmed: true, affiliation: 'jedi' };
      }
      
      if (!user) {
        return { success: false, error: 'Email ou senha inválidos. Tente test@test.com / Test123!' };
      }
      
      if (!user.confirmed) {
        return { success: false, error: 'Conta não confirmada. Use o código 123456' };
      }

      // Verificar se MFA está habilitado para este usuário
      const mfaSettings = JSON.parse(localStorage.getItem('userMfaSettings') || '{}');
      if (mfaSettings.enabled) {
        // Simular desafio MFA
        return {
          success: false,
          requiresMfa: true,
          session: 'mock_session_' + Date.now(),
          challengeName: 'SMS_MFA',
          error: 'Código SMS enviado para ' + mfaSettings.phoneNumber
        };
      }
      
      // Login bem-sucedido
      const mockUser = {
        id: '1',
        email: user.email,
        name: user.email.split('@')[0],
        affiliation: user.affiliation || 'jedi'
      };
      
      const mockToken = 'mock_token_' + Date.now();
      
      localStorage.setItem('accessToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, affiliation) => {
    try {
      setLoading(true);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação de senha
      if (password.length < 8) {
        return { success: false, error: 'A senha deve ter pelo menos 8 caracteres' };
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return { success: false, error: 'A senha deve conter pelo menos uma maiúscula, uma minúscula e um número' };
      }
      
      // Registrar usuário localmente
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Verificar se usuário já existe
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'Usuário já existe' };
      }
      
      // Adicionar novo usuário
      users.push({ 
        email, 
        password, 
        affiliation, 
        confirmed: false,
        confirmationCode: '123456' // Código fixo para teste
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      return { success: true, message: 'Conta criada! Use o código 123456 para confirmar.' };
    } catch (error) {
      return { success: false, error: 'Erro ao registrar usuário' };
    } finally {
      setLoading(false);
    }
  };

  const confirmAccount = async (email, confirmationCode) => {
    try {
      setLoading(true);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      // Para teste, aceitar código 123456
      if (confirmationCode !== '123456') {
        return { success: false, error: 'Código inválido. Use: 123456' };
      }
      
      users[userIndex].confirmed = true;
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      return { success: true, message: 'Conta confirmada com sucesso!' };
    } catch (error) {
      return { success: false, error: 'Erro ao confirmar conta' };
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Código reenviado! Use: 123456' };
    } catch (error) {
      return { success: false, error: 'Erro ao reenviar código' };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Código de recuperação: 123456' };
    } catch (error) {
      return { success: false, error: 'Erro ao solicitar recuperação' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, confirmationCode, newPassword) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (confirmationCode !== '123456') {
        return { success: false, error: 'Código inválido. Use: 123456' };
      }
      
      return { success: true, message: 'Senha alterada com sucesso!' };
    } catch (error) {
      return { success: false, error: 'Erro ao redefinir senha' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpar storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

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