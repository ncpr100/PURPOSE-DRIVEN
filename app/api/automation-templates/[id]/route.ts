/**
 * Automation Rule Template Detail API
 * Get full template details and activate templates for a church
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

// GET /api/automation-templates/[id] - Get full template details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 400 });
    }

    const template = await prisma.automation_rulesTemplate.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!template) {
      return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 });
    }

    // Check if church has already installed this template
    const installation = await prisma.automation_rulesTemplateInstallation.findUnique({
      where: {
        templateId_churchId: {
          templateId: template.id,
          churchId: user.churchId!
        }
      },
      include: {
        automation_rules: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    });

    return NextResponse.json({
      template,
      installation: installation || null,
      isInstalled: !!installation
    });

  } catch (error) {
    console.error('Error fetching template details:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/automation-templates/[id]/activate - Activate template for church
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    });

    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario no encontrado o sin iglesia' }, { status: 400 });
    }

    // Check admin permission
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos para activar plantillas' }, { status: 403 });
    }

    const body = await request.json();
    const { customizations } = body;

    // Get the template
    const template = await prisma.automation_rulesTemplate.findUnique({
      where: { id: params.id }
    });

    if (!template) {
      return NextResponse.json({ error: 'Plantilla no encontrada' }, { status: 404 });
    }

    // Check if already installed
    const existingInstallation = await prisma.automation_rulesTemplateInstallation.findUnique({
      where: {
        templateId_churchId: {
          templateId: template.id,
          churchId: user.churchId
        }
      }
    });

    if (existingInstallation) {
      return NextResponse.json(
        { error: 'Esta plantilla ya está instalada' },
        { status: 400 }
      );
    }

    // Merge template config with customizations
    const finalConfig = {
      triggerConfig: customizations?.triggerConfig || template.triggerConfig,
      conditionsConfig: customizations?.conditionsConfig || template.conditionsConfig,
      actionsConfig: customizations?.actionsConfig || template.actionsConfig,
      escalationConfig: customizations?.escalationConfig || template.escalationConfig,
      businessHoursConfig: customizations?.businessHoursConfig || template.businessHoursConfig,
      retryConfig: customizations?.retryConfig || template.retryConfig,
      fallbackChannels: customizations?.fallbackChannels || template.fallbackChannels
    };

    // Create the automation rule from template
    const automation_rules = await prisma.automation_rules.create({
      data: {
        name: customizations?.name || template.name,
        description: template.description,
        churchId: user.churchId,
        isActive: customizations?.isActive !== undefined ? customizations.isActive : true,
        priority: customizations?.priority !== undefined ? customizations.priority : 0,
        bypassApproval: customizations?.bypassApproval !== undefined ? customizations.bypassApproval : true,
        priorityLevel: customizations?.priorityLevel || template.priorityLevel,
        escalationConfig: finalConfig.escalationConfig,
        businessHoursOnly: customizations?.businessHoursOnly !== undefined ? customizations.businessHoursOnly : template.businessHoursOnly,
        businessHoursConfig: finalConfig.businessHoursConfig,
        urgentMode24x7: customizations?.urgentMode24x7 !== undefined ? customizations.urgentMode24x7 : template.urgentMode24x7,
        retryConfig: finalConfig.retryConfig,
        fallbackChannels: finalConfig.fallbackChannels,
        createManualTaskOnFail: customizations?.createManualTaskOnFail !== undefined ? customizations.createManualTaskOnFail : template.createManualTaskOnFail,
        createdBy: user.id,
        // Create triggers
        triggers: {
          create: {
            type: (template.triggerConfig as any).type,
            eventSource: (template.triggerConfig as any).eventSource || null,
            configuration: template.triggerConfig as any,
            isActive: true
          }
        },
        // Create conditions
        conditions: {
          create: (finalConfig.conditionsConfig || []).map((condition: any) => ({
            field: condition.field,
            operator: condition.operator,
            value: JSON.stringify(condition.value),
            metadata: condition
          }))
        },
        // Create actions
        actions: {
          create: (finalConfig.actionsConfig || []).map((action: any, index: number) => ({
            type: action.type,
            configuration: action.configuration || {},
            order: index,
            delay: action.delay || 0,
            isActive: true
          }))
        }
      }
    });

    // Create installation record
    const installation = await prisma.automation_rulesTemplateInstallation.create({
      data: {
        churchId: user.churchId,
        templateId: template.id,
        automation_rulesId: automation_rules.id,
        customizations: customizations || {},
        installedBy: user.id
      }
    });

    // Update template stats
    await prisma.automation_rulesTemplate.update({
      where: { id: template.id },
      data: {
        installCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      automation_rules,
      installation
    }, { status: 201 });

  } catch (error) {
    console.error('Error activating template:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
