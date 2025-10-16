/**
 * Automation Rule Templates Seed Script
 * Creates reusable automation templates for prayer requests and visitor workflows
 * 
 * Run with: npx tsx scripts/seed-automation-templates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding automation rule templates...\n');

  // ============================================================================
  // PRAYER REQUEST WORKFLOW TEMPLATES
  // ============================================================================

  // Template 1: Prayer Request - Immediate Church Notification
  const prayerNotification = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_prayer_church_notification' },
    update: {},
    create: {
      id: 'template_prayer_church_notification',
      name: 'Prayer Request: Immediate Church Notification',
      description: 'Notifies all pastors and prayer coordinators immediately when a new prayer request is submitted. Configurable to notify specific roles or users.',
      category: 'PRAYER_REQUEST',
      subcategory: 'CHURCH_NOTIFICATION',
      icon: '🙏',
      color: '#3B82F6',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'HIGH',
      urgentMode24x7: false,
      businessHoursOnly: false,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'PRAYER_REQUEST_SUBMITTED',
        eventSource: 'PrayerRequest',
        conditions: []
      },
      
      conditionsConfig: [],
      
      actionsConfig: [
        {
          type: 'SEND_NOTIFICATION',
          delay: 0, // Immediate
          configuration: {
            recipients: 'PASTORS', // Or specific role/user IDs (configurable)
            title: 'Nueva Petición de Oración',
            message: 'Se ha recibido una nueva petición de oración que requiere atención.',
            priority: 'HIGH',
            includeRequestDetails: true,
            actionButtons: [
              { label: 'Ver Petición', action: '/prayer-requests' },
              { label: 'Responder', action: '/prayer-requests/{{requestId}}/respond' }
            ]
          }
        },
        {
          type: 'SEND_EMAIL',
          delay: 0,
          configuration: {
            recipients: 'PASTORS',
            template: 'prayer-request-notification',
            subject: 'Nueva Petición de Oración',
            includeRequestDetails: true
          }
        }
      ],
      
      escalationConfig: {
        enabled: true,
        escalateAfterMinutes: 60,
        escalateTo: 'SENIOR_PASTOR',
        escalationMessage: 'Esta petición de oración no ha sido atendida en 1 hora.'
      },
      
      retryConfig: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelay: 300 // 5 minutes
      },
      
      fallbackChannels: ['EMAIL', 'SMS', 'PUSH'],
      
      tags: ['prayer', 'notification', 'pastors', 'urgent']
    }
  });

  // Template 2: Prayer Request - Auto-Acknowledgment to Requester
  const prayerAcknowledgment = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_prayer_acknowledgment' },
    update: {},
    create: {
      id: 'template_prayer_acknowledgment',
      name: 'Prayer Request: Auto-Acknowledgment',
      description: 'Sends an immediate acknowledgment to the prayer requester confirming receipt and explaining next steps. Respects requester\'s preferred contact method.',
      category: 'PRAYER_REQUEST',
      subcategory: 'REQUESTER_ACKNOWLEDGMENT',
      icon: '✅',
      color: '#10B981',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'NORMAL',
      urgentMode24x7: false,
      businessHoursOnly: false,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'PRAYER_REQUEST_SUBMITTED',
        eventSource: 'PrayerRequest'
      },
      
      conditionsConfig: [],
      
      actionsConfig: [
        {
          type: 'SEND_SMS',
          delay: 0,
          configuration: {
            recipient: 'REQUESTER',
            condition: 'preferredContact === "sms" || preferredContact === "phone"',
            template: 'prayer-acknowledgment-sms',
            message: 'Gracias por compartir tu petición de oración con nosotros. Un miembro de nuestro equipo se pondrá en contacto contigo pronto. Que Dios te bendiga. - {{churchName}}'
          }
        },
        {
          type: 'SEND_EMAIL',
          delay: 0,
          configuration: {
            recipient: 'REQUESTER',
            condition: 'preferredContact === "email"',
            template: 'prayer-acknowledgment-email',
            subject: 'Recibimos tu Petición de Oración',
            personalizedGreeting: true
          }
        },
        {
          type: 'SEND_WHATSAPP',
          delay: 0,
          configuration: {
            recipient: 'REQUESTER',
            condition: 'preferredContact === "whatsapp"',
            template: 'prayer-acknowledgment-whatsapp',
            message: 'Paz de Cristo {{name}}! Recibimos tu petición de oración. Nuestro equipo orará por ti y se pondrá en contacto pronto. 🙏'
          }
        }
      ],
      
      retryConfig: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelay: 300
      },
      
      fallbackChannels: ['EMAIL', 'SMS'],
      
      tags: ['prayer', 'acknowledgment', 'auto-response']
    }
  });

  // Template 3: Prayer Request - Prayer via Message (Auto or Custom)
  const prayerViaMessage = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_prayer_via_message' },
    update: {},
    create: {
      id: 'template_prayer_via_message',
      name: 'Prayer Request: Prayer via Message',
      description: 'When requester chooses "prayer via message", either sends a pre-written prayer template immediately OR creates a task for staff to write a custom prayer. Fully configurable.',
      category: 'PRAYER_REQUEST',
      subcategory: 'PRAYER_DELIVERY',
      icon: '💌',
      color: '#8B5CF6',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'NORMAL',
      urgentMode24x7: false,
      businessHoursOnly: true,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'PRAYER_REQUEST_SUBMITTED',
        eventSource: 'PrayerRequest'
      },
      
      conditionsConfig: [
        {
          field: 'responseMethod',
          operator: 'EQUALS',
          value: 'message'
        }
      ],
      
      actionsConfig: [
        {
          type: 'CREATE_PRAYER_RESPONSE',
          delay: 0,
          configuration: {
            mode: 'AUTO_OR_CUSTOM', // Options: 'AUTO', 'CUSTOM', 'AUTO_OR_CUSTOM'
            autoTemplateId: 'prayer_template_general', // Pre-written prayer
            customTaskAssignTo: 'PASTORS',
            customTaskTitle: 'Escribir oración personalizada',
            customTaskPriority: 'HIGH',
            deliveryChannel: 'REQUESTER_PREFERENCE' // Use requester's preferred contact method
          }
        },
        {
          type: 'SEND_SMS',
          delay: 0,
          configuration: {
            recipient: 'REQUESTER',
            condition: 'mode === "AUTO" && preferredContact === "sms"',
            template: 'auto-prayer-sms',
            message: '{{prayerText}}. Que Dios te bendiga abundantemente. - {{staffName}}, {{churchName}}'
          }
        },
        {
          type: 'SEND_EMAIL',
          delay: 0,
          configuration: {
            recipient: 'REQUESTER',
            condition: 'mode === "AUTO" && preferredContact === "email"',
            template: 'auto-prayer-email',
            subject: 'Una Oración para Ti',
            personalizedGreeting: true
          }
        }
      ],
      
      businessHoursConfig: {
        start: '09:00',
        end: '18:00',
        timezone: 'America/Bogota',
        days: [1, 2, 3, 4, 5, 6] // Monday-Saturday
      },
      
      retryConfig: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelay: 600
      },
      
      fallbackChannels: ['EMAIL', 'SMS'],
      
      tags: ['prayer', 'auto-response', 'custom-prayer', 'message']
    }
  });

  // Template 4: Prayer Request - Prayer via Call Assignment
  const prayerViaCall = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_prayer_via_call' },
    update: {},
    create: {
      id: 'template_prayer_via_call',
      name: 'Prayer Request: Prayer via Call Assignment',
      description: 'When requester chooses "prayer via call", assigns a staff member to call the requester and creates a follow-up task with reminder notifications.',
      category: 'PRAYER_REQUEST',
      subcategory: 'PRAYER_DELIVERY',
      icon: '📞',
      color: '#F59E0B',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'HIGH',
      urgentMode24x7: false,
      businessHoursOnly: true,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'PRAYER_REQUEST_SUBMITTED',
        eventSource: 'PrayerRequest'
      },
      
      conditionsConfig: [
        {
          field: 'responseMethod',
          operator: 'EQUALS',
          value: 'call'
        }
      ],
      
      actionsConfig: [
        {
          type: 'ASSIGN_STAFF',
          delay: 0,
          configuration: {
            assignTo: 'AVAILABLE_PASTOR', // Auto-assign to available pastor/staff
            taskType: 'PRAYER_CALL',
            taskTitle: 'Llamar para orar con {{requesterName}}',
            taskDescription: 'Contactar al solicitante y orar con ellos por teléfono.',
            priority: 'HIGH',
            dueInHours: 24,
            includeRequesterDetails: true
          }
        },
        {
          type: 'SEND_SMS',
          delay: 0,
          configuration: {
            recipient: 'REQUESTER',
            template: 'prayer-call-acknowledgment',
            message: 'Gracias por tu petición. Un miembro de nuestro equipo te llamará pronto para orar contigo. - {{churchName}}'
          }
        },
        {
          type: 'SEND_NOTIFICATION',
          delay: 3600, // 1 hour reminder if not completed
          configuration: {
            recipient: 'ASSIGNED_STAFF',
            condition: 'taskStatus === "pending"',
            title: 'Recordatorio: Llamada de oración pendiente',
            message: 'No olvides llamar a {{requesterName}} para orar.',
            priority: 'MEDIUM'
          }
        }
      ],
      
      escalationConfig: {
        enabled: true,
        escalateAfterMinutes: 1440, // 24 hours
        escalateTo: 'SENIOR_PASTOR',
        escalationMessage: 'La llamada de oración no se ha completado en 24 horas.'
      },
      
      businessHoursConfig: {
        start: '09:00',
        end: '20:00',
        timezone: 'America/Bogota',
        days: [1, 2, 3, 4, 5, 6, 0] // All days
      },
      
      retryConfig: {
        maxRetries: 2,
        backoffMultiplier: 2,
        initialDelay: 1800
      },
      
      tags: ['prayer', 'call', 'assignment', 'follow-up']
    }
  });

  // ============================================================================
  // VISITOR FOLLOW-UP WORKFLOW TEMPLATES
  // ============================================================================

  // Template 5: Visitor - First-Time Welcome (Immediate)
  const visitorFirstTimeWelcome = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_visitor_first_time_welcome' },
    update: {},
    create: {
      id: 'template_visitor_first_time_welcome',
      name: 'Visitor: First-Time Welcome (Immediate)',
      description: 'Sends an immediate welcome message to first-time visitors and creates their visitor profile in the CRM. Triggers a 7-day follow-up sequence.',
      category: 'VISITOR_FOLLOWUP',
      subcategory: 'FIRST_TIME',
      icon: '👋',
      color: '#EC4899',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'HIGH',
      urgentMode24x7: false,
      businessHoursOnly: false,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'VISITOR_FIRST_TIME',
        eventSource: 'CheckIn'
      },
      
      conditionsConfig: [
        {
          field: 'visitCount',
          operator: 'EQUALS',
          value: 1
        }
      ],
      
      actionsConfig: [
        {
          type: 'ADD_TO_CRM',
          delay: 0,
          configuration: {
            createVisitorProfile: true,
            category: 'FIRST_TIME',
            autoAssignStaff: true,
            assignmentCriteria: 'LEAST_LOADED' // Or 'ROUND_ROBIN', 'SPECIFIC_ROLE'
          }
        },
        {
          type: 'CATEGORIZE_VISITOR',
          delay: 0,
          configuration: {
            category: 'FIRST_TIME',
            trackingEnabled: true
          }
        },
        {
          type: 'SEND_SMS',
          delay: 0,
          configuration: {
            recipient: 'VISITOR',
            condition: 'preferredContact === "sms" || phone !== null',
            template: 'visitor-welcome-sms',
            message: '¡Bienvenido a {{churchName}}! 🎉 Nos alegra mucho que nos hayas visitado hoy. Esperamos verte pronto. Que Dios te bendiga!'
          }
        },
        {
          type: 'SEND_EMAIL',
          delay: 0,
          configuration: {
            recipient: 'VISITOR',
            condition: 'email !== null',
            template: 'visitor-welcome-email',
            subject: '¡Bienvenido a {{churchName}}!',
            personalizedGreeting: true,
            includeNextSteps: true
          }
        },
        {
          type: 'CREATE_FOLLOW_UP',
          delay: 259200, // 3 days later
          configuration: {
            followUpType: 'SECOND_TOUCH',
            assignTo: 'AUTO_ASSIGNED_STAFF',
            touchSequence: 2,
            category: 'MINISTRY_CONNECTION',
            priority: 'HIGH'
          }
        },
        {
          type: 'CREATE_FOLLOW_UP',
          delay: 604800, // 7 days later
          configuration: {
            followUpType: 'THIRD_TOUCH',
            assignTo: 'AUTO_ASSIGNED_STAFF',
            touchSequence: 3,
            category: 'VOLUNTEER',
            priority: 'MEDIUM'
          }
        }
      ],
      
      retryConfig: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelay: 300
      },
      
      fallbackChannels: ['EMAIL', 'SMS'],
      
      tags: ['visitor', 'first-time', 'welcome', 'crm', 'follow-up-sequence']
    }
  });

  // Template 6: Visitor - Returning Visitor Engagement
  const visitorReturningEngagement = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_visitor_returning' },
    update: {},
    create: {
      id: 'template_visitor_returning',
      name: 'Visitor: Returning Visitor Engagement',
      description: 'Recognizes and engages returning visitors (2-3 visits). Updates CRM category and sends personalized follow-up with ministry connection opportunities.',
      category: 'VISITOR_FOLLOWUP',
      subcategory: 'RETURNING',
      icon: '🔄',
      color: '#6366F1',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'MEDIUM',
      urgentMode24x7: false,
      businessHoursOnly: false,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'VISITOR_RETURNED',
        eventSource: 'CheckIn'
      },
      
      conditionsConfig: [
        {
          field: 'visitCount',
          operator: 'GREATER_THAN',
          value: 1
        },
        {
          field: 'visitCount',
          operator: 'LESS_THAN',
          value: 4
        }
      ],
      
      actionsConfig: [
        {
          type: 'CATEGORIZE_VISITOR',
          delay: 0,
          configuration: {
            category: 'RETURNING',
            updateCRM: true
          }
        },
        {
          type: 'SEND_EMAIL',
          delay: 0,
          configuration: {
            recipient: 'VISITOR',
            template: 'visitor-returning-email',
            subject: '¡Qué alegría verte de nuevo!',
            personalizedGreeting: true,
            includeMinistryOpportunities: true
          }
        },
        {
          type: 'CREATE_FOLLOW_UP',
          delay: 86400, // 1 day later
          configuration: {
            followUpType: 'MINISTRY_CONNECTION',
            assignTo: 'MINISTRY_COORDINATOR',
            category: 'MINISTRY_CONNECTION',
            priority: 'HIGH',
            includeInterestSurvey: true
          }
        }
      ],
      
      retryConfig: {
        maxRetries: 2,
        backoffMultiplier: 2,
        initialDelay: 600
      },
      
      fallbackChannels: ['EMAIL', 'SMS'],
      
      tags: ['visitor', 'returning', 'engagement', 'ministry-connection']
    }
  });

  // Template 7: Visitor - Regular Non-Member (Membership Invitation)
  const visitorRegularInvitation = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_visitor_regular_membership' },
    update: {},
    create: {
      id: 'template_visitor_regular_membership',
      name: 'Visitor: Regular Non-Member (Membership Invitation)',
      description: 'For visitors who have attended 4+ times but are not members. Automatically invites them to membership classes and assigns a membership coordinator.',
      category: 'VISITOR_FOLLOWUP',
      subcategory: 'MEMBERSHIP_TRACK',
      icon: '🤝',
      color: '#14B8A6',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'MEDIUM',
      urgentMode24x7: false,
      businessHoursOnly: true,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'VISITOR_RETURNED',
        eventSource: 'CheckIn'
      },
      
      conditionsConfig: [
        {
          field: 'visitCount',
          operator: 'GREATER_THAN',
          value: 3
        },
        {
          field: 'isMember',
          operator: 'EQUALS',
          value: false
        }
      ],
      
      actionsConfig: [
        {
          type: 'CATEGORIZE_VISITOR',
          delay: 0,
          configuration: {
            category: 'REGULAR',
            updateCRM: true
          }
        },
        {
          type: 'ASSIGN_STAFF',
          delay: 0,
          configuration: {
            assignTo: 'MEMBERSHIP_COORDINATOR',
            taskType: 'MEMBERSHIP_FOLLOWUP',
            taskTitle: 'Invitar a {{visitorName}} a clases de membresía',
            priority: 'MEDIUM'
          }
        },
        {
          type: 'SEND_EMAIL',
          delay: 86400, // 1 day later
          configuration: {
            recipient: 'VISITOR',
            template: 'membership-invitation-email',
            subject: 'Te invitamos a ser parte de nuestra familia',
            personalizedGreeting: true,
            includeMembershipInfo: true,
            includeClassSchedule: true
          }
        },
        {
          type: 'CREATE_FOLLOW_UP',
          delay: 259200, // 3 days later
          configuration: {
            followUpType: 'MEMBERSHIP_FOLLOW_UP',
            assignTo: 'ASSIGNED_STAFF',
            category: 'MEMBERSHIP',
            priority: 'HIGH'
          }
        }
      ],
      
      businessHoursConfig: {
        start: '09:00',
        end: '18:00',
        timezone: 'America/Bogota',
        days: [1, 2, 3, 4, 5]
      },
      
      retryConfig: {
        maxRetries: 2,
        backoffMultiplier: 2,
        initialDelay: 1800
      },
      
      fallbackChannels: ['EMAIL', 'SMS'],
      
      tags: ['visitor', 'regular', 'membership', 'invitation']
    }
  });

  // Template 8: Visitor - Urgent Prayer Request Follow-Up (24/7)
  const visitorUrgentPrayer = await prisma.automationRuleTemplate.upsert({
    where: { id: 'template_visitor_urgent_prayer' },
    update: {},
    create: {
      id: 'template_visitor_urgent_prayer',
      name: 'Visitor: Urgent Prayer Request (24/7)',
      description: 'For visitors who submit urgent prayer requests. Provides 24/7 response with immediate staff assignment and pastoral contact, bypassing business hours.',
      category: 'VISITOR_FOLLOWUP',
      subcategory: 'URGENT_PRAYER',
      icon: '🆘',
      color: '#EF4444',
      isSystemTemplate: true,
      isActive: true,
      isPublic: true,
      priorityLevel: 'URGENT',
      urgentMode24x7: true,
      businessHoursOnly: false,
      createManualTaskOnFail: true,
      
      triggerConfig: {
        type: 'PRAYER_REQUEST_SUBMITTED',
        eventSource: 'PrayerRequest'
      },
      
      conditionsConfig: [
        {
          field: 'priority',
          operator: 'EQUALS',
          value: 'urgent'
        },
        {
          field: 'requesterType',
          operator: 'IN',
          value: ['VISITOR', 'NON_MEMBER']
        }
      ],
      
      actionsConfig: [
        {
          type: 'ADD_TO_CRM',
          delay: 0,
          configuration: {
            createVisitorProfile: true,
            category: 'FIRST_TIME',
            priority: 'URGENT'
          }
        },
        {
          type: 'SEND_NOTIFICATION',
          delay: 0,
          configuration: {
            recipients: 'ON_CALL_PASTOR',
            title: '🆘 Petición de Oración URGENTE',
            message: 'Nueva petición urgente de un visitante requiere atención inmediata.',
            priority: 'URGENT',
            sound: 'urgent',
            vibration: true
          }
        },
        {
          type: 'ASSIGN_STAFF',
          delay: 0,
          configuration: {
            assignTo: 'ON_CALL_PASTOR',
            taskType: 'URGENT_PRAYER',
            taskTitle: 'URGENTE: Contactar a {{requesterName}}',
            priority: 'URGENT',
            dueInHours: 1
          }
        },
        {
          type: 'SEND_SMS',
          delay: 0,
          configuration: {
            recipient: 'REQUESTER',
            template: 'urgent-prayer-acknowledgment',
            message: 'Recibimos tu petición urgente. Un pastor se pondrá en contacto contigo en los próximos minutos. Estamos orando por ti ahora. - {{churchName}}'
          }
        },
        {
          type: 'ESCALATE_TO_SUPERVISOR',
          delay: 900, // 15 minutes if no response
          configuration: {
            condition: 'taskStatus === "pending"',
            escalateTo: 'SENIOR_PASTOR',
            message: 'Petición urgente sin atender por 15 minutos'
          }
        }
      ],
      
      escalationConfig: {
        enabled: true,
        escalateAfterMinutes: 15,
        escalateTo: 'SENIOR_PASTOR',
        notifyAllPastors: true
      },
      
      retryConfig: {
        maxRetries: 5,
        backoffMultiplier: 1.5,
        initialDelay: 180 // 3 minutes
      },
      
      fallbackChannels: ['SMS', 'WHATSAPP', 'EMAIL', 'PHONE'],
      
      tags: ['visitor', 'urgent', 'prayer', '24x7', 'immediate-response']
    }
  });

  console.log('✅ Created 8 automation rule templates:');
  console.log('   1. Prayer Request: Church Notification');
  console.log('   2. Prayer Request: Auto-Acknowledgment');
  console.log('   3. Prayer Request: Prayer via Message');
  console.log('   4. Prayer Request: Prayer via Call');
  console.log('   5. Visitor: First-Time Welcome');
  console.log('   6. Visitor: Returning Engagement');
  console.log('   7. Visitor: Regular Non-Member Invitation');
  console.log('   8. Visitor: Urgent Prayer Request (24/7)');
  
  console.log('\n📊 Template Statistics:');
  const totalTemplates = await prisma.automationRuleTemplate.count();
  console.log(`   Total templates: ${totalTemplates}`);
  
  const prayerTemplates = await prisma.automationRuleTemplate.count({
    where: { category: 'PRAYER_REQUEST' }
  });
  console.log(`   Prayer request templates: ${prayerTemplates}`);
  
  const visitorTemplates = await prisma.automationRuleTemplate.count({
    where: { category: 'VISITOR_FOLLOWUP' }
  });
  console.log(`   Visitor follow-up templates: ${visitorTemplates}`);
  
  console.log('\n✨ Templates are ready to be activated by churches!');
  console.log('   Churches can browse, activate, and customize these templates via:');
  console.log('   - API: /api/automation-templates');
  console.log('   - UI: /automation-rules (Templates tab)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding automation templates:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
