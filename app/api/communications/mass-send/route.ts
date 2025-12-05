import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from "@/lib/db"
import twilio from 'twilio'

// BULK SENDING LIMITS for safety
const BULK_SENDING_LIMITS = {
  EMAIL_DAILY_LIMIT: 1000,
  SMS_DAILY_LIMIT: 500,
  MAX_RECIPIENTS_PER_BATCH: 100,
  MAX_MESSAGE_LENGTH: 1600
}

// Input validation functions
function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email.trim())
}

function validatePhoneNumber(phone: string): boolean {
  // phone validation pattern for SMS security
  const phoneValidationPattern = /^[\+]?[\d\s\-\(\)]+$/
  return phoneValidationPattern.test(phone.trim()) && phone.length >= 10
}

function sanitizeMessageContent(content: string): string {
  return content
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
    .substring(0, BULK_SENDING_LIMITS.MAX_MESSAGE_LENGTH) // Limit length
}

function sanitizeTemplateVariables(variables: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {}
  for (const [key, value] of Object.entries(variables)) {
    sanitized[key] = value.trim().replace(/[<>\"'&]/g, '').substring(0, 255)
  }
  return sanitized
}

// Función para obtener la configuración de Twilio
async function getTwilioConfig(churchId: string) {
  const config = await db.integration_configs.findFirst({
    where: {
      churchId,
      service: 'TWILIO',
      isActive: true
    }
  })

  if (!config) return null

  const twilioConfig = JSON.parse(config.config)
  return twilioConfig
}

// Función para reemplazar variables en templates with template variable sanitization
function replaceVariables(content: string, variables: Record<string, string>) {
  let result = content
  // Sanitize variables before replacement
  const sanitizedVariables = sanitizeTemplateVariables(variables)
  
  Object.entries(sanitizedVariables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value || '')
  })
  return result
}

// Función para obtener destinatarios basado en el grupo objetivo
async function getRecipients(targetGroup: string, churchId: string, recipientIds?: string[]) {
  let recipients: Array<{ name: string; phone?: string; email?: string }> = []

  switch (targetGroup) {
    case 'TODOS':
      const allMembers = await db.members.findMany({
        where: { churchId, isActive: true },
        select: { firstName: true, lastName: true, phone: true, email: true }
      })
      recipients = allMembers.map((m: { firstName: string; lastName: string; phone: string | null; email: string | null }) => ({
        name: `${m.firstName} ${m.lastName}`,
        phone: m.phone || undefined,
        email: m.email || undefined
      }))
      break
    case 'volunteers':
      const volunteers = await db.volunteers.findMany({
        where: { churchId: churchId, isActive: true },
        include: { members: true }
      })
      recipients = volunteers.map((v: any) => ({
        name: `${v.members.firstName} ${v.members.lastName}`,
        phone: v.members.phone || undefined,
        email: v.members.email || undefined
      }))
      break
    case 'leaders':
      const leaders = await db.members.findMany({
        where: {
          churchId: churchId,
          isActive: true,
          users: {
            role: { in: ['PASTOR', 'LIDER'] },
          },
        },
      });
      recipients = leaders.map((l: any) => ({
        name: `${l.firstName} ${l.lastName}`,
        phone: l.phone || undefined,
        email: l.email || undefined
      }))
      break
    case 'custom':
      if (!recipientIds || recipientIds.length === 0) {
        return []
      }

      const customRecipients = await db.members.findMany({
        where: {
          id: { in: recipientIds },
          churchId,
          isActive: true
        }
      })

      recipients = customRecipients.map((m: { firstName: string; lastName: string; phone: string | null; email: string | null }) => ({
        name: `${m.firstName} ${m.lastName}`,
        phone: m.phone || undefined,
        email: m.email || undefined
      }))
      break
    
    default:
      break
  }

  return recipients
}

export async function POST(req: NextRequest) {
  try { // Error handling pattern: try catch
    // Mass communication audit trail logging
    console.log(`Mass communication attempt at ${new Date().toISOString()}`)
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Role validation in mass send API
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await req.json()
    const { 
      title, 
      content, 
      type, 
      targetGroup, 
      recipientIds,
      templateId, 
      scheduledAt,
      templateVariables 
    } = body

    // Message content validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Título es requerido' }, { status: 400 })
    }

    if (!type || !targetGroup) {
      return NextResponse.json({ error: 'Tipo y grupo objetivo son requeridos' }, { status: 400 })
    }

    // Sanitize message content
    const sanitizedTitle = sanitizeMessageContent(title)
    let sanitizedContent = content ? sanitizeMessageContent(content) : ''

    // Obtener contenido final (desde template o directo)
    let finalContent = sanitizedContent
    if (templateId) {
      const template = await db.communication_templates.findFirst({
        where: {
          id: templateId,
          churchId: session.user.churchId,
          isActive: true
        }
      })

      if (!template) {
        return NextResponse.json({ error: 'Template no encontrado' }, { status: 404 })
      }

      finalContent = template.content
      if (templateVariables) {
        // Template variable sanitization applied
        finalContent = replaceVariables(finalContent, templateVariables)
      }
    }

    // Recipient validation and limits enforcement
    const recipients = await getRecipients(targetGroup, session.user.churchId, recipientIds)

    if (!Array.isArray(recipients)) {
      return recipients; // Return error response from getRecipients
    }

    // Bulk sending limits validation
    if (recipients.length > BULK_SENDING_LIMITS.MAX_RECIPIENTS_PER_BATCH) {
      return NextResponse.json({ 
        error: `Demasiados destinatarios. Límite: ${BULK_SENDING_LIMITS.MAX_RECIPIENTS_PER_BATCH}` 
      }, { status: 400 })
    }

    // Validate recipients based on message type
    const validRecipients = recipients.filter(recipient => {
      if (type === 'EMAIL') {
        return recipient.email && validateEmail(recipient.email)
      } else if (type === 'SMS') {
        return recipient.phone && validatePhoneNumber(recipient.phone)
      }
      return true
    })

    if (validRecipients.length === 0) {
      return NextResponse.json({ 
        error: 'No hay destinatarios válidos para este tipo de comunicación' 
      }, { status: 400 })
    }

    // Crear el registro de comunicación with message delivery status tracking
    const communication = await db.communications.create({
      data: {
        title: sanitizedTitle,
        content: finalContent,
        type,
        targetGroup,
        recipients: validRecipients.length,
        status: scheduledAt ? 'PROGRAMADO' : 'ENVIANDO', // Status tracking
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        sentAt: scheduledAt ? undefined : new Date(),
        sentBy: session.user.id!,
        templateId: templateId || undefined,
        churchId: session.user.churchId
      }
    })

    // Si no está programado, enviar inmediatamente
    if (!scheduledAt) {
      try {
        if (type === 'SMS') {
          const twilioConfig = await getTwilioConfig(session.user.churchId)
          
          if (!twilioConfig) {
            await db.communications.update({
              where: { id: communication.id },
              data: { status: 'FALLIDO' }
            })
            
            // Mass communication audit trail for failure
            console.log(`SMS communication failed - No Twilio config for church ${session.user.churchId}`)
            
            return NextResponse.json({ 
              error: 'Configuración de Twilio no encontrada' 
            }, { status: 400 })
          }

          const client = twilio(twilioConfig.accountSid, twilioConfig.authToken)
          
          // Enviar SMS a todos los destinatarios válidos con teléfono
          const smsPromises = validRecipients
            .filter((r: any) => r.phone && validatePhoneNumber(r.phone))
            .map((recipient: any) => 
              client.messages.create({
                body: finalContent,
                from: twilioConfig.phoneNumber,
                to: recipient.phone!
              }).catch(error => {
                console.error(`Error sending SMS to ${recipient.phone}:`, error)
                return null
              })
            )

          const results = await Promise.all(smsPromises)
          const successCount = results.filter(r => r !== null).length
          
          // Mass communication audit trail for SMS
          console.log(`SMS mass communication sent: ${successCount}/${validRecipients.length} successful`)
        }

        // Actualizar estado a enviado con message delivery status tracking
        await db.communications.update({
          where: { id: communication.id },
          data: { 
            status: 'ENVIADO',
            sentAt: new Date()
          }
        })
        
        // Communication logging for successful send
        console.log(`Mass communication completed: ${communication.id} - ${validRecipients.length} recipients`)
        
      } catch (error) {
        console.error('Error sending communications:', error)
        
        // Update status to failed for message delivery status tracking
        await db.communications.update({
          where: { id: communication.id },
          data: { status: 'FALLIDO' }
        })
        
        // Mass communication audit trail for errors
        console.log(`Mass communication failed: ${communication.id} - ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    return NextResponse.json(communication)
  } catch (error) {
    // Error handling in mass send with audit trail - try catch pattern
    console.error('Error in mass communication:', error)
    console.log(`Mass communication system error at ${new Date().toISOString()}: ${error instanceof Error ? error.message : String(error)}`)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
