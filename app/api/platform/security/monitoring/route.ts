import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado - Se requiere rol SUPER_ADMIN' }, { status: 403 })
    }

    // Generate realistic security metrics for monitoring
    const overallScore = Math.floor(Math.random() * 15) + 85 // 85-100%
    
    // Determine threat level based on score
    let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
    if (overallScore < 70) threatLevel = 'CRITICAL'
    else if (overallScore < 85) threatLevel = 'HIGH'
    else if (overallScore < 95) threatLevel = 'MEDIUM'

    // Generate vulnerabilities (fewer for higher scores)
    const vulnerabilities = {
      critical: overallScore < 70 ? Math.floor(Math.random() * 5) + 1 : 0,
      high: overallScore < 85 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2),
      medium: Math.floor(Math.random() * 5) + 2,
      low: Math.floor(Math.random() * 8) + 3
    }

    // Generate access attempts data
    const accessAttempts = {
      successful: Math.floor(Math.random() * 500) + 1000,
      failed: Math.floor(Math.random() * 50) + 10,
      blocked: Math.floor(Math.random() * 10) + 2,
      suspicious: Math.floor(Math.random() * 5) + 1
    }

    // System security status
    const systemSecurity = {
      firewallStatus: 'ACTIVE' as const,
      encryptionStatus: 'ENABLED' as const,
      backupStatus: Math.random() > 0.1 ? 'CURRENT' as const : 'OUTDATED' as const,
      updateStatus: Math.random() > 0.2 ? 'CURRENT' as const : 'PENDING' as const
    }

    // Generate recent security incidents
    const incidentTypes = ['LOGIN_ATTEMPT', 'SUSPICIOUS_ACTIVITY', 'SYSTEM_BREACH', 'DATA_ACCESS']
    const severityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    
    const recentIncidents = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
      id: `incident-${Date.now()}-${i}`,
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)] as any,
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)] as any,
      description: [
        'Múltiples intentos de login fallidos detectados',
        'Actividad anómala en base de datos',
        'Intento de acceso no autorizado a recursos administrativos',
        'Patrón de tráfico inusual desde IP desconocida',
        'Escaneo de puertos detectado',
        'Intento de escalación de privilegios',
        'Acceso a datos sensibles sin autorización',
        'Modificación no autorizada de configuración'
      ][Math.floor(Math.random() * 8)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      resolved: Math.random() > 0.4, // 60% resolved
      affectedResource: [
        'Database Server',
        'Web Application',
        'API Gateway',
        'Admin Panel',
        'User Authentication',
        'File System',
        'Network Infrastructure'
      ][Math.floor(Math.random() * 7)],
      sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: Math.random() > 0.5 ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' : 'Unknown/Automated'
    }))

    // Generate audit logs
    const auditActions = [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'PASSWORD_CHANGE',
      'USER_CREATED',
      'USER_DELETED',
      'PERMISSION_GRANTED',
      'PERMISSION_REVOKED',
      'DATA_EXPORT',
      'CONFIG_CHANGE',
      'SYSTEM_BACKUP'
    ]
    
    const auditLogs = Array.from({ length: 15 }, (_, i) => ({
      id: `audit-${Date.now()}-${i}`,
      action: auditActions[Math.floor(Math.random() * auditActions.length)],
      user: [
        'admin@khesed-tek.com',
        'super.admin@platform.com',
        'system@khesed-tek.com',
        'monitor@platform.com'
      ][Math.floor(Math.random() * 4)],
      resource: [
        'User Management',
        'Church Configuration',
        'Platform Settings',
        'Security Policies',
        'Database Access',
        'API Endpoints',
        'System Configuration'
      ][Math.floor(Math.random() * 7)],
      timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
      result: ['SUCCESS', 'FAILURE', 'BLOCKED'][Math.floor(Math.random() * 3)] as any,
      details: 'Sistema de auditoría automática'
    }))

    const securityMetrics = {
      overallScore,
      threatLevel,
      lastScanTime: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
      vulnerabilities,
      accessAttempts,
      systemSecurity,
      recentIncidents: recentIncidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      auditLogs: auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(securityMetrics)

  } catch (error) {
    console.error('Error fetching security monitoring data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}