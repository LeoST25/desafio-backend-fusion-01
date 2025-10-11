import React, { useState } from 'react';
import { Shield, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const MfaVerification = ({ session, username, onVerified, onBack }) => {
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mfaCode || mfaCode.length !== 6) {
      setError('Por favor, digite o código de 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Para demonstração, aceitar código 123456 ou 000000
      if (mfaCode === '123456' || mfaCode === '000000') {
        // Simular tokens de sucesso
        const mockTokenData = {
          accessToken: 'mock_access_token_' + Date.now(),
          idToken: 'mock_id_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now()
        };

        // Criar dados do usuário
        const mockUser = {
          id: '1',
          email: username,
          name: username.split('@')[0],
          affiliation: 'jedi'
        };

        // Salvar tokens e usuário
        localStorage.setItem('accessToken', mockTokenData.accessToken);
        localStorage.setItem('idToken', mockTokenData.idToken);
        localStorage.setItem('refreshToken', mockTokenData.refreshToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        onVerified(mockTokenData);
      } else {
        setError('Código MFA inválido. Use 123456 ou 000000 para testar');
      }
    } catch (err) {
      console.error('Erro na verificação MFA:', err);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setError('');
      // Em uma implementação real, você chamaria um endpoint para reenviar o código
      // Por enquanto, apenas mostrar uma mensagem
      alert('Funcionalidade de reenvio ainda não implementada');
    } catch (err) {
      setError('Erro ao reenviar código');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verificação MFA
            </h1>
            <p className="text-gray-300">
              Digite o código de 6 dígitos enviado por SMS
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de código MFA */}
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-300 mb-2">
                Código de Verificação
              </label>
              <input
                id="mfaCode"
                type="text"
                value={mfaCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setMfaCode(value);
                  setError('');
                }}
                placeholder="123456"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-wider font-mono"
                maxLength="6"
                disabled={loading}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}

            {/* Botões */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || mfaCode.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Shield className="w-5 h-5 mr-2" />
                )}
                Verificar Código
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                  className="flex-1 bg-white/10 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="flex-1 bg-white/10 text-white py-3 px-4 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reenviar
                </button>
              </div>
            </div>
          </form>

          {/* Informações adicionais */}
          <div className="mt-6 p-4 bg-blue-500/20 rounded-xl">
            <p className="text-blue-200 text-sm text-center">
              Não recebeu o código? Verifique sua caixa de SMS ou aguarde alguns minutos antes de solicitar um novo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaVerification;