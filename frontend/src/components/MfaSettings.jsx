import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Phone, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const MfaSettings = () => {
  const { user } = useAuth();
  const [mfaStatus, setMfaStatus] = useState({
    enabled: false,
    phoneNumber: '',
    loading: true
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadMfaStatus();
  }, []);

  const loadMfaStatus = async () => {
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar status MFA mockado no localStorage
      const mfaData = JSON.parse(localStorage.getItem('userMfaSettings') || '{}');
      
      setMfaStatus({
        enabled: mfaData.enabled || false,
        phoneNumber: mfaData.phoneNumber || '',
        loading: false
      });
      setPhoneNumber(mfaData.phoneNumber || '');
    } catch (err) {
      console.error('Erro ao carregar MFA status:', err);
      setError('Erro ao carregar configurações');
      setMfaStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const enableMfa = async () => {
    if (!phoneNumber) {
      setError('Por favor, informe um número de telefone');
      return;
    }

    // Validar formato do telefone
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Formato inválido. Use +5511999999999');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar configurações MFA no localStorage
      const mfaData = {
        enabled: true,
        phoneNumber: phoneNumber
      };
      localStorage.setItem('userMfaSettings', JSON.stringify(mfaData));
      
      setMessage('MFA habilitado com sucesso! Códigos serão enviados para ' + phoneNumber);
      await loadMfaStatus();
    } catch (err) {
      console.error('Erro ao habilitar MFA:', err);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const disableMfa = async () => {
    if (!window.confirm('Tem certeza que deseja desabilitar o MFA? Isso reduzirá a segurança da sua conta.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remover configurações MFA do localStorage
      const mfaData = {
        enabled: false,
        phoneNumber: ''
      };
      localStorage.setItem('userMfaSettings', JSON.stringify(mfaData));
      
      setMessage('MFA desabilitado com sucesso');
      setPhoneNumber('');
      await loadMfaStatus();
    } catch (err) {
      console.error('Erro ao desabilitar MFA:', err);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  if (mfaStatus.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-800">Autenticação Multi-Fator</h2>
          <p className="text-sm text-gray-600">Configure MFA para maior segurança</p>
        </div>
      </div>

      {/* Status atual do MFA */}
      <div className="mb-6 p-4 rounded-xl border">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Status do MFA</span>
          <div className="flex items-center">
            {mfaStatus.enabled ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-600 font-medium">Habilitado</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-600 font-medium">Desabilitado</span>
              </>
            )}
          </div>
        </div>
        
        {mfaStatus.enabled && mfaStatus.phoneNumber && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{mfaStatus.phoneNumber}</span>
          </div>
        )}
      </div>

      {/* Mensagens */}
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Formulário para habilitar MFA */}
      {!mfaStatus.enabled && (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+5511999999999"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use o formato internacional (+55 para Brasil)
            </p>
          </div>

          <button
            onClick={enableMfa}
            disabled={loading || !phoneNumber}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <Shield className="w-5 h-5 mr-2" />
            )}
            Habilitar MFA
          </button>
        </div>
      )}

      {/* Botão para desabilitar MFA */}
      {mfaStatus.enabled && (
        <button
          onClick={disableMfa}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : (
            <XCircle className="w-5 h-5 mr-2" />
          )}
          Desabilitar MFA
        </button>
      )}

      {/* Informações sobre MFA */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-medium text-blue-800 mb-2">Sobre o MFA</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Adiciona uma camada extra de segurança</li>
          <li>• Código SMS será enviado a cada login</li>
          <li>• Protege contra acesso não autorizado</li>
          <li>• Pode ser desabilitado a qualquer momento</li>
        </ul>
      </div>
    </div>
  );
};

export default MfaSettings;