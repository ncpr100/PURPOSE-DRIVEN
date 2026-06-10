'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
interface MFAPolicy {
  isEnabled: boolean;
  enforcedAt: string | null;
  gracePeriodHours: number;
  userHasMFA: boolean;
  hoursRemaining: number | null;
  isExpired: boolean;
}
export function MFARequiredBanner() {
  const { data: session } = useSession();
  const router = useRouter();
  const [policy, setPolicy] = useState<MFAPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkPolicy();
    const interval = setInterval(checkPolicy, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  const checkPolicy = async () => {
    try {
      const res = await fetch('/api/platform/mfa/policy-status');
      if (res.ok) {
        const data = await res.json();
        setPolicy(data);
      }
    } catch (err) {
      console.error('Error checking MFA policy:', err);
    } finally {
      setLoading(false);
    }
  };
  if (loading || !policy || !policy.isEnabled || policy.userHasMFA) {
    return null;
  }
  const { hoursRemaining, isExpired, gracePeriodHours } = policy;
  if (isExpired) {
    // Redirigir forzado a configuración de seguridad
    router.push('/platform/settings/security?reason=mfa_required');
    return null;
  }
  const isUrgent = hoursRemaining !== null && hoursRemaining < 6;
  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-lg
        ${isUrgent ? 'bg-red-600' : 'bg-yellow-500'}
        text-white
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-semibold text-sm">
              🔐 Autenticación de Dos Factores Requerida
            </p>
            <p className="text-xs opacity-90">
              {isUrgent
                ? `⚠️ URGENTE: Debes activar 2FA en menos de ${Math.ceil(hoursRemaining || 0)} horas o perderás acceso`
                : `Tu rol requiere 2FA activo. Tienes ${Math.ceil(hoursRemaining || 0)} horas restantes del período de gracia de ${gracePeriodHours}h`}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/platform/settings/security')}
          className="px-4 py-1.5 bg-white text-gray-900 rounded-md hover:bg-gray-100 font-medium text-sm whitespace-nowrap transition-colors"
        >
          Activar 2FA →
        </button>
      </div>
    </div>
  );
}
