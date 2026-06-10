'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
interface MFAPolicy {
  id: string;
  isEnabled: boolean;
  enforcedAt: string | null;
  gracePeriodHours: number;
  requiredRoles: string[];
}
export default function MFAPolicyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [policy, setPolicy] = useState<MFAPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gracePeriod, setGracePeriod] = useState(24);
  const [requiredRoles, setRequiredRoles] = useState<string[]>(['ADMIN', 'SUPER_ADMIN']);
  useEffect(() => {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      router.push('/platform');
      return;
    }
    loadPolicy();
  }, [session, router]);
  const loadPolicy = async () => {
    try {
      const res = await fetch('/api/platform/mfa/policy');
      if (res.ok) {
        const data = await res.json();
        setPolicy(data);
        setGracePeriod(data.gracePeriodHours || 24);
        setRequiredRoles(data.requiredRoles || ['ADMIN', 'SUPER_ADMIN']);
      }
    } catch (err) {
      console.error('Error loading policy:', err);
    } finally {
      setLoading(false);
    }
  };
  const togglePolicy = async () => {
    if (!policy) return;
    setSaving(true);
    try {
      const res = await fetch('/api/platform/mfa/policy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled: !policy.isEnabled,
          gracePeriodHours: gracePeriod,
          requiredRoles,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPolicy(updated);
      }
    } catch (err) {
      console.error('Error toggling policy:', err);
    } finally {
      setSaving(false);
    }
  };
  const saveSettings = async () => {
    if (!policy) return;
    setSaving(true);
    try {
      const res = await fetch('/api/platform/mfa/policy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled: policy.isEnabled,
          gracePeriodHours: gracePeriod,
          requiredRoles,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPolicy(updated);
        alert('✅ Configuración guardada');
      }
    } catch (err) {
      console.error('Error saving policy:', err);
      alert('❌ Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };
  const toggleRole = (role: string) => {
    setRequiredRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Cargando política MFA...</div>
      </div>
    );
  }
  const allRoles = ['SUPER_ADMIN', 'ADMIN', 'PASTOR', 'LIDER', 'MIEMBRO'];
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Política de Autenticación de Dos Factores</h1>
        <p className="text-gray-600 mt-1">
          Controla qué roles deben activar 2FA obligatoriamente
        </p>
      </div>
      {/* Estado Actual */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Estado de la Política</h2>
            <p className="text-sm text-gray-600 mt-1">
              {policy?.isEnabled 
                ? 'La política está ACTIVA. Los usuarios deben activar 2FA dentro del período de gracia.' 
                : 'La política está INACTIVA. El 2FA es opcional para todos los usuarios.'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full font-medium ${
            policy?.isEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {policy?.isEnabled ? '✓ ACTIVA' : 'INACTIVA'}
          </div>
        </div>
        {policy?.isEnabled && policy.enforcedAt && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Activada el:</strong> {new Date(policy.enforcedAt).toLocaleString('es-ES')}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Los usuarios que aún no han activado 2FA verán un banner de alerta con cuenta regresiva.
            </p>
          </div>
        )}
        <button
          onClick={togglePolicy}
          disabled={saving}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            policy?.isEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? 'Procesando...' : (policy?.isEnabled ? 'Desactivar Política' : 'Activar Política')}
        </button>
      </div>
      {/* Configuración */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold">Configuración</h2>
        {/* Período de Gracia */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Período de Gracia (horas)
          </label>
          <p className="text-xs text-gray-600 mb-2">
            Tiempo que tienen los usuarios para activar 2FA después de habilitar la política.
            Después de este período, serán redirigidos forzosamente a la página de configuración.
          </p>
          <input
            type="number"
            min="1"
            max="168"
            value={gracePeriod}
            onChange={(e) => setGracePeriod(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recomendado: 24 horas. Máximo: 168 horas (1 semana).
          </p>
        </div>
        {/* Roles Requeridos */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Roles que Deben Activar 2FA
          </label>
          <p className="text-xs text-gray-600 mb-3">
            Selecciona qué roles estarán sujetos a la política obligatoria de 2FA.
          </p>
          <div className="space-y-2">
            {allRoles.map(role => (
              <label key={role} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiredRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                  className="w-4 h-4"
                />
                <span className={`font-mono text-sm ${
                  role === 'SUPER_ADMIN' ? 'text-purple-700' :
                  role === 'ADMIN' ? 'text-blue-700' :
                  role === 'PASTOR' ? 'text-green-700' :
                  'text-gray-700'
                }`}>
                  {role}
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
      {/* Advertencia */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Importante</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Activar esta política afectará a todos los usuarios con los roles seleccionados.</li>
          <li>Los usuarios verán un banner de alerta inmediatamente después del login.</li>
          <li>Después del período de gracia, serán bloqueados hasta activar 2FA.</li>
          <li>Asegúrate de comunicar este cambio antes de activarlo.</li>
        </ul>
      </div>
    </div>
  );
}
