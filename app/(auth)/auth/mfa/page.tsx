'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
type VerificationMethod = 'totp' | 'backup';
export default function MFAVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('callbackUrl') || searchParams.get('redirect') || '/';
  const [method, setMethod] = useState<VerificationMethod>('totp');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type: method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'CÃ³digo invÃ¡lido');
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        setLoading(false);
        return;
      }
      // Ã‰xito - redirigir al destino
      router.push(redirectTo);
    } catch (err: any) {
      setError('Error de conexiÃ³n. Intenta de nuevo.');
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            VerificaciÃ³n de Dos Factores
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa el cÃ³digo de verificaciÃ³n para continuar
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
              {remainingAttempts !== null && (
                <p className="text-red-600 text-xs mt-1">
                  Intentos restantes: {remainingAttempts}
                </p>
              )}
            </div>
          )}
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMethod('totp');
                  setCode('');
                  setError('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  method === 'totp'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                CÃ³digo de App
              </button>
              <button
                onClick={() => {
                  setMethod('backup');
                  setCode('');
                  setError('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  method === 'backup'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                CÃ³digo de Respaldo
              </button>
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                {method === 'totp' 
                  ? 'CÃ³digo de 6 dÃ­gitos de tu app de autenticaciÃ³n' 
                  : 'CÃ³digo de respaldo de 8 caracteres'}
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  if (method === 'totp') {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  } else {
                    setCode(e.target.value.toUpperCase().slice(0, 9));
                  }
                }}
                placeholder={method === 'totp' ? '000000' : 'XXXX-XXXX'}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm font-mono text-center text-xl tracking-widest"
                autoFocus
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || (method === 'totp' ? code.length !== 6 : code.length < 8)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              â† Volver al inicio de sesiÃ³n
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

