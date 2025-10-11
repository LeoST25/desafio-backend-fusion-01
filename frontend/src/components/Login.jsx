import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import MfaVerification from './MfaVerification';

const Login = () => {
  const { login, register, confirmAccount, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    affiliation: 'jedi',
    confirmationCode: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mfaChallenge, setMfaChallenge] = useState(null);

  // Se já estiver autenticado, redirecionar
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (!result.success) {
      // Verificar se é desafio MFA
      if (result.requiresMfa) {
        setMfaChallenge({
          session: result.session,
          username: formData.email
        });
      } else {
        setError(result.error);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    const result = await register(formData.email, formData.password, formData.affiliation);
    if (result.success) {
      setSuccess('Conta criada! Verifique seu email para o código de confirmação.');
      setActiveTab('confirm');
    } else {
      setError(result.error);
    }
  };

  const handleConfirmAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.confirmationCode) {
      setError('Por favor, preencha email e código de confirmação');
      return;
    }

    const result = await confirmAccount(formData.email, formData.confirmationCode);
    if (result.success) {
      setSuccess('Conta confirmada! Você pode fazer login agora.');
      setActiveTab('login');
      setFormData({ ...formData, confirmationCode: '' });
    } else {
      setError(result.error);
    }
  };

  const handleMfaVerified = (tokenData) => {
    // MFA verificado com sucesso, o AuthContext deve atualizar automaticamente
    setMfaChallenge(null);
    window.location.reload(); // Forçar atualização para redirecionar para dashboard
  };

  const handleMfaBack = () => {
    setMfaChallenge(null);
    setError('');
  };

  // Se há desafio MFA, mostrar componente MFA
  if (mfaChallenge) {
    return (
      <MfaVerification
        session={mfaChallenge.session}
        username={mfaChallenge.username}
        onVerified={handleMfaVerified}
        onBack={handleMfaBack}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="login-title">Sistema Galáctico</h1>
          <p className="login-subtitle">Acesse sua conta para continuar sua jornada</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button 
            className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Entrar
          </button>
          <button 
            className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Registrar
          </button>
          <button 
            className={`login-tab ${activeTab === 'confirm' ? 'active' : ''}`}
            onClick={() => setActiveTab('confirm')}
          >
            Confirmar
          </button>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <span>✅</span>
            {success}
          </div>
        )}

        {/* Formulário de Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite seu email"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock className="inline w-4 h-4 mr-2" />
                Senha
              </label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                'Entrar na Galáxia'
              )}
            </button>
          </form>
        )}

        {/* Formulário de Registro */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite seu email"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock className="inline w-4 h-4 mr-2" />
                Senha
              </label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Crie uma senha forte (mín. 8 caracteres)"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <small style={{color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                Deve conter: maiúscula, minúscula, número e símbolo especial
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                <User className="inline w-4 h-4 mr-2" />
                Afiliação na Galáxia
              </label>
              <select
                name="affiliation"
                value={formData.affiliation}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="jedi">🌟 Jedi - Guardiões da Paz</option>
                <option value="sith">⚡ Sith - Mestres do Poder</option>
                <option value="rebel">🚀 Rebelião - Luta pela Liberdade</option>
                <option value="empire">🏛️ Império - Ordem e Controle</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando conta...
                </>
              ) : (
                'Ingressar na Galáxia'
              )}
            </button>
          </form>
        )}

        {/* Formulário de Confirmação */}
        {activeTab === 'confirm' && (
          <form onSubmit={handleConfirmAccount}>
            <div className="form-group">
              <label className="form-label">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite seu email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Shield className="inline w-4 h-4 mr-2" />
                Código de Confirmação
              </label>
              <input
                type="text"
                name="confirmationCode"
                value={formData.confirmationCode}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Digite o código recebido por email"
                required
                maxLength={6}
                style={{fontSize: '18px', letterSpacing: '2px', textAlign: 'center'}}
              />
              <small style={{color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                Código de 6 dígitos enviado para seu email
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Confirmando...
                </>
              ) : (
                'Confirmar Conta'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;