'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
type MFAStatus = 'loading' | 'disabled' | 'pending_verification' | 'enabled';
interface MFASetupData {
  qrCodeUrl: string;
  otpauthUrl: string;
  secret: string;
  backupCodes: string[];
}
export default function SecuritySettingsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<MFAStatus>('loading');
  const [setupData, setSetupData] = useState<MFASetupData | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);
  useEffect(() => {
    checkMFAStatus();
  }, []);
  const checkMFAStatus = async () => {
    try {
      const res = await fetch('/api/platform/settings/mfa/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data.isEnabled ? 'enabled' : 'disabled');
      } else {
        setStatus('disabled');
      }
    } catch (err) {
      console.error('Error checking MFA status:', err);
      setStatus('disabled');
    }
  };
  const handleSetupMFA = async () => {
    setError('');
    try {
      const res = await fetch('/api/platform/settings/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error iniciando configuración 2FA');
      }
      const data = await res.json();
      setSetupData(data);
      setStatus('pending_verification');
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleVerifyMFA = async () => {
    setError('');
    if (totpCode.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    try {
      const res = await fetch('/api/platform/settings/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: totpCode }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Código inválido');
      }
      setShowBackupCodes(true);
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleDisableMFA = async () => {
    setError('');
    if (!disablePassword) {
      setError('Ingresa tu contraseña para desactivar 2FA');
      return;
    }
    try {
      const res = await fetch('/api/platform/settings/mfa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error desactivando 2FA');
      }
      setShowDisableModal(false);
      setDisablePassword('');
      setStatus('disabled');
      setSetupData(null);
    } catch (err: any) {
      setError(err.message);
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };
  const downloadBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    const content = setupData.backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'khesed-tek-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Seguridad</h1>
          <p className="text-gray-600">Gestiona la autenticación de dos factores</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">Cargando...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seguridad</h1>
        <p className="text-gray-600">Gestiona la autenticación de dos factores</p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Autenticación de Dos Factores (2FA)</h2>
            <p className="text-sm text-gray-600 mt-1">
              Añade una capa extra de seguridad a tu cuenta
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'enabled' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status === 'enabled' ? '✓ Activado' : 'Desactivado'}
          </div>
        </div>
        {status === 'disabled' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Protege tu cuenta con un código de verificación adicional cada vez que inicies sesión.
            </p>
            <button
              onClick={handleSetupMFA}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Activar 2FA
            </button>
          </div>
        )}
        {status === 'pending_verification' && setupData && !showBackupCodes && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Paso 1: Escanea el código QR</h3>
              <p className="text-sm text-gray-600 mb-4">
                Usa una app como Google Authenticator, Authy o 1Password para escanear este código:
              </p>
              <div className="flex justify-center mb-4">
                <img src={setupData.qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">
                  ¿No puedes escanear? Ingresa esta clave manualmente:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                    {setupData.secret}
                  </code>
                  <button
                    onClick={() => copyToClipboard(setupData.secret)}
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Paso 2: Verifica el código</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ingresa el código de 6 dígitos que muestra tu app:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="flex-1 px-4 py-2 border rounded-lg font-mono text-center text-xl tracking-widest"
                  maxLength={6}
                />
                <button
                  onClick={handleVerifyMFA}
                  disabled={totpCode.length !== 6}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Verificar
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setStatus('disabled');
                setSetupData(null);
                setTotpCode('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        )}
        {status === 'pending_verification' && setupData && showBackupCodes && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                ✓ 2FA activado correctamente
              </h3>
              <p className="text-sm text-green-800">
                Guarda estos códigos de respaldo en un lugar seguro. Cada código solo puede usarse una vez.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Códigos de Respaldo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Si pierdes acceso a tu app de autenticación, usa uno de estos códigos para iniciar sesión:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {setupData.backupCodes.map((code, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <code className="font-mono text-sm">{code}</code>
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Copiar
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={downloadBackupCodes}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Descargar Códigos
                </button>
                <button
                  onClick={() => {
                    setStatus('enabled');
                    setSetupData(null);
                    setShowBackupCodes(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  He guardado los códigos
                </button>
              </div>
            </div>
          </div>
        )}
        {status === 'enabled' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Tu cuenta está protegida con autenticación de dos factores.
            </p>
            <button
              onClick={() => setShowDisableModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Desactivar 2FA
            </button>
          </div>
        )}
      </div>
      {showDisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Desactivar 2FA</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa tu contraseña para confirmar que quieres desactivar la autenticación de dos factores:
            </p>
            <input
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              placeholder="Tu contraseña"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDisableModal(false);
                  setDisablePassword('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDisableMFA}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
