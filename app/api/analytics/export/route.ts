import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { db } from '@/lib/db';
import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';

export const dynamic = 'force-dynamic';

interface ExportRequest {
  format: 'pdf' | 'excel' | 'csv';
  reportType: 'overview' | 'trends' | 'insights' | 'executive';
  period: number;
  includeCharts: boolean;
  includeAI: boolean;
}

interface ChurchBranding {
  name: string;
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  address?: string;
  contact?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { format, reportType, period, includeCharts, includeAI }: ExportRequest = await request.json();

    // Get church branding information
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        church: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true
          }
        }
      }
    });

    if (!user?.church) {
      return NextResponse.json(
        { error: 'Iglesia no encontrada' },
        { status: 404 }
      );
    }

    const branding: ChurchBranding = {
      name: user.church.name,
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0f766e'
      },
      address: user.church.address || undefined,
      contact: user.church.email || user.church.phone || undefined
    };

    // Get analytics data based on report type
    const analyticsData = await getAnalyticsData(user.church.id, reportType, period, includeAI);

    // Generate export based on format
    let exportData: Uint8Array | string;
    let contentType: string;
    let filename: string;

    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'pdf':
        exportData = await generatePDFReport(analyticsData, branding, reportType, includeCharts);
        contentType = 'application/pdf';
        filename = `${reportType}-report-${timestamp}.pdf`;
        break;

      case 'excel':
        exportData = await generateExcelReport(analyticsData, branding, reportType);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `${reportType}-report-${timestamp}.xlsx`;
        break;

      case 'csv':
        exportData = generateCSVReport(analyticsData, branding, reportType);
        contentType = 'text/csv';
        filename = `${reportType}-report-${timestamp}.csv`;
        break;

      default:
        return NextResponse.json(
          { error: 'Formato no soportado' },
          { status: 400 }
        );
    }

    // Return file response
    const responseBody = typeof exportData === 'string' 
      ? new TextEncoder().encode(exportData)
      : exportData;
      
    const response = new NextResponse(responseBody, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    return response;

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Error generando reporte' },
      { status: 500 }
    );
  }
}

async function getAnalyticsData(churchId: string, reportType: string, period: number, includeAI: boolean) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Base analytics data
  const [members, events, donations, communications] = await Promise.all([
    db.members.findMany({
      where: { churchId }
    }),
    db.event.findMany({
      where: {
        churchId,
        startDate: { gte: startDate }
      },
      include: {
        checkIns: true
      }
    }),
    db.donation.findMany({
      where: {
        churchId,
        createdAt: { gte: startDate }
      }
    }),
    db.communication.findMany({
      where: {
        churchId,
        createdAt: { gte: startDate }
      }
    })
  ]);

  // AI insights if requested
  let aiInsights = null;
  if (includeAI) {
    try {
      const aiResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/analytics/ai-insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (aiResponse.ok) {
        aiInsights = await aiResponse.json();
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  }

  return {
    reportType,
    period,
    generatedAt: new Date().toISOString(),
    church: { id: churchId },
    summary: {
      totalMembers: members.length,
      newMembers: members.filter(m => m.createdAt >= startDate).length,
      totalEvents: events.length,
      totalAttendance: events.reduce((sum, e) => sum + e.checkIns.length, 0),
      totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
      averageDonation: donations.length > 0 ? donations.reduce((sum, d) => sum + d.amount, 0) / donations.length : 0,
      totalCommunications: communications.length
    },
    members,
    events,
    donations,
    communications,
    aiInsights
  };
}

async function generatePDFReport(data: any, branding: ChurchBranding, reportType: string, includeCharts: boolean): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add church branding header
  doc.setFontSize(20);
  doc.setTextColor(branding.colors.primary);
  doc.text(branding.name, 20, 30);

  doc.setFontSize(16);
  doc.setTextColor('#000000');
  doc.text(`Reporte Analítico - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 20, 45);

  doc.setFontSize(12);
  doc.setTextColor('#666666');
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 55);
  doc.text(`Período: ${data.period} días`, 20, 65);

  if (branding.address) {
    doc.text(branding.address, 20, 75);
  }
  if (branding.contact) {
    doc.text(branding.contact, 20, 85);
  }

  // Add summary section
  doc.setFontSize(14);
  doc.setTextColor('#000000');
  doc.text('Resumen Ejecutivo', 20, 105);

  doc.setFontSize(11);
  let yPos = 115;
  const summaryData = [
    [`Miembros Totales`, data.summary.totalMembers.toString()],
    [`Nuevos Miembros`, data.summary.newMembers.toString()],
    [`Eventos Realizados`, data.summary.totalEvents.toString()],
    [`Asistencia Total`, data.summary.totalAttendance.toString()],
    [`Donaciones Totales`, `$${data.summary.totalDonations.toLocaleString('es-ES')}`],
    [`Donación Promedio`, `$${data.summary.averageDonation.toFixed(2)}`],
    [`Comunicaciones`, data.summary.totalCommunications.toString()]
  ];

  summaryData.forEach(([label, value]) => {
    doc.text(`${label}:`, 25, yPos);
    doc.text(value, 100, yPos);
    yPos += 8;
  });

  // Add AI insights if available
  if (data.aiInsights && data.aiInsights.insights && data.aiInsights.insights.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Perspectivas de IA', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    data.aiInsights.insights.slice(0, 5).forEach((insight: any) => {
      const priority = insight.priority === 'high' ? '🔴' : insight.priority === 'medium' ? '🟡' : '🟢';
      doc.text(`${priority} ${insight.description}`, 25, yPos);
      yPos += 6;
      if (insight.recommendation) {
        doc.setTextColor('#666666');
        doc.text(`   Recomendación: ${insight.recommendation}`, 25, yPos);
        doc.setTextColor('#000000');
        yPos += 6;
      }
      yPos += 2;
    });
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor('#999999');
  doc.text('Generado por Sistema de Gestión Eclesiástica', 20, pageHeight - 20);
  doc.text(`Página 1 de 1`, 150, pageHeight - 20);

  return new Uint8Array(doc.output('arraybuffer'));
}

async function generateExcelReport(data: any, branding: ChurchBranding, reportType: string): Promise<Uint8Array> {
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = branding.name;
  workbook.lastModifiedBy = branding.name;
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create summary worksheet
  const summarySheet = workbook.addWorksheet('Resumen');
  
  // Header styling
  summarySheet.mergeCells('A1:F1');
  const headerCell = summarySheet.getCell('A1');
  headerCell.value = `${branding.name} - Reporte Analítico`;
  headerCell.font = { size: 18, bold: true, color: { argb: branding.colors.primary.replace('#', '') } };
  headerCell.alignment = { horizontal: 'center' };

  // Metadata
  summarySheet.getCell('A3').value = 'Generado:';
  summarySheet.getCell('B3').value = new Date().toLocaleDateString('es-ES');
  summarySheet.getCell('A4').value = 'Período:';
  summarySheet.getCell('B4').value = `${data.period} días`;
  summarySheet.getCell('A5').value = 'Tipo:';
  summarySheet.getCell('B5').value = reportType.charAt(0).toUpperCase() + reportType.slice(1);

  // Summary data
  summarySheet.getCell('A7').value = 'Métrica';
  summarySheet.getCell('B7').value = 'Valor';
  summarySheet.getCell('A7').font = { bold: true };
  summarySheet.getCell('B7').font = { bold: true };

  const summaryData = [
    ['Miembros Totales', data.summary.totalMembers],
    ['Nuevos Miembros', data.summary.newMembers],
    ['Eventos Realizados', data.summary.totalEvents],
    ['Asistencia Total', data.summary.totalAttendance],
    ['Donaciones Totales', data.summary.totalDonations],
    ['Donación Promedio', data.summary.averageDonation],
    ['Comunicaciones', data.summary.totalCommunications]
  ];

  summaryData.forEach(([metric, value], index) => {
    const row = index + 8;
    summarySheet.getCell(`A${row}`).value = metric;
    summarySheet.getCell(`B${row}`).value = value;
  });

  // Auto-fit columns
  summarySheet.columns.forEach(column => {
    column.width = 20;
  });

  // Create detailed data sheets if data exists
  if (data.members && data.members.length > 0) {
    const membersSheet = workbook.addWorksheet('Miembros');
    membersSheet.addRow(['Nombre', 'Email', 'Teléfono', 'Fecha Registro', 'Estado']);
    
    data.members.forEach((member: any) => {
      membersSheet.addRow([
        `${member.firstName} ${member.lastName}`,
        member.email || '',
        member.phone || '',
        new Date(member.createdAt).toLocaleDateString('es-ES'),
        member.status || 'Activo'
      ]);
    });

    membersSheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  if (data.events && data.events.length > 0) {
    const eventsSheet = workbook.addWorksheet('Eventos');
    eventsSheet.addRow(['Título', 'Fecha', 'Asistencia', 'Descripción']);
    
    data.events.forEach((event: any) => {
      eventsSheet.addRow([
        event.title,
        new Date(event.date).toLocaleDateString('es-ES'),
        event.attendance?.length || 0,
        event.description || ''
      ]);
    });

    eventsSheet.columns.forEach(column => {
      column.width = 20;
    });
  }

  if (data.donations && data.donations.length > 0) {
    const donationsSheet = workbook.addWorksheet('Donaciones');
    donationsSheet.addRow(['Fecha', 'Monto', 'Tipo', 'Método']);
    
    data.donations.forEach((donation: any) => {
      donationsSheet.addRow([
        new Date(donation.createdAt).toLocaleDateString('es-ES'),
        donation.amount,
        donation.type || 'General',
        donation.method || 'No especificado'
      ]);
    });

    donationsSheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  // AI Insights sheet if available
  if (data.aiInsights && data.aiInsights.insights && data.aiInsights.insights.length > 0) {
    const aiSheet = workbook.addWorksheet('Perspectivas IA');
    aiSheet.addRow(['Prioridad', 'Categoría', 'Descripción', 'Recomendación', 'Confianza']);
    
    data.aiInsights.insights.forEach((insight: any) => {
      aiSheet.addRow([
        insight.priority || 'medium',
        insight.category || 'general',
        insight.description || '',
        insight.recommendation || '',
        `${(insight.confidence || 0) * 100}%`
      ]);
    });

    aiSheet.columns.forEach(column => {
      column.width = 25;
    });
  }

  return new Uint8Array(await workbook.xlsx.writeBuffer() as ArrayBuffer);
}

function generateCSVReport(data: any, branding: ChurchBranding, reportType: string): string {
  const csvLines: string[] = [];
  
  // Header
  csvLines.push(`"${branding.name} - Reporte Analítico"`);
  csvLines.push(`"Generado","${new Date().toLocaleDateString('es-ES')}"`);
  csvLines.push(`"Período","${data.period} días"`);
  csvLines.push(`"Tipo","${reportType}"`);
  csvLines.push('');

  // Summary
  csvLines.push('"Resumen Ejecutivo"');
  csvLines.push('"Métrica","Valor"');
  csvLines.push(`"Miembros Totales","${data.summary.totalMembers}"`);
  csvLines.push(`"Nuevos Miembros","${data.summary.newMembers}"`);
  csvLines.push(`"Eventos Realizados","${data.summary.totalEvents}"`);
  csvLines.push(`"Asistencia Total","${data.summary.totalAttendance}"`);
  csvLines.push(`"Donaciones Totales","${data.summary.totalDonations}"`);
  csvLines.push(`"Donación Promedio","${data.summary.averageDonation}"`);
  csvLines.push(`"Comunicaciones","${data.summary.totalCommunications}"`);
  csvLines.push('');

  // AI Insights if available
  if (data.aiInsights && data.aiInsights.insights && data.aiInsights.insights.length > 0) {
    csvLines.push('"Perspectivas de IA"');
    csvLines.push('"Prioridad","Categoría","Descripción","Recomendación","Confianza"');
    
    data.aiInsights.insights.forEach((insight: any) => {
      csvLines.push([
        `"${insight.priority || 'medium'}"`,
        `"${insight.category || 'general'}"`,
        `"${insight.description || ''}"`,
        `"${insight.recommendation || ''}"`,
        `"${(insight.confidence || 0) * 100}%"`
      ].join(','));
    });
  }

  return csvLines.join('\n');
}