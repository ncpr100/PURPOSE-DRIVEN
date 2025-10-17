/**
 * Script para actualizar plantillas de automatización a ESPAÑOL
 * 
 * Este script actualiza los nombres y descripciones de las plantillas
 * del inglés al español para usuarios hispanohablantes.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SPANISH_TEMPLATES = {
  'Prayer Request: Immediate Church Notification': {
    name: 'Petición de Oración: Notificación Inmediata a la Iglesia',
    description: 'Notifica a todos los pastores y coordinadores de oración inmediatamente cuando se envía una nueva petición de oración. Configurable para notificar roles o usuarios específicos.',
  },
  'Prayer Request: Auto-Acknowledgment': {
    name: 'Petición de Oración: Confirmación Automática',
    description: 'Envía una confirmación inmediata al solicitante confirmando recepción y explicando los próximos pasos. Respeta el método de contacto preferido del solicitante.',
  },
  'Prayer Request: Prayer via Message': {
    name: 'Petición de Oración: Oración por Mensaje',
    description: 'Cuando el solicitante elige "oración por mensaje", envía una oración escrita personalizada o generada por IA por el canal preferido (SMS, WhatsApp, Email).',
  },
  'Prayer Request: Prayer via Call Assignment': {
    name: 'Petición de Oración: Asignación de Llamada de Oración',
    description: 'Cuando el solicitante elige "oración por llamada", asigna un miembro del equipo para llamar al solicitante y crea una tarea de seguimiento con notificaciones recordatorias.',
  },
  'Visitor: First-Time Welcome (Immediate)': {
    name: 'Visitante: Bienvenida Primera Vez (Inmediato)',
    description: 'Envía un mensaje de bienvenida inmediato a visitantes primerizos y crea su registro de visitante en el CRM. Configurable para enviar por SMS, Email o WhatsApp.',
  },
  'Visitor: Returning Visitor Engagement': {
    name: 'Visitante: Compromiso de Visitante Recurrente',
    description: 'Reconoce y compromete a visitantes recurrentes (2-3 visitas). Actualiza categoría CRM y envía invitación personalizada a eventos/ministerios relevantes.',
  },
  'Visitor: Regular Non-Member (Membership Invitation)': {
    name: 'Visitante: Regular No-Miembro (Invitación a Membresía)',
    description: 'Para visitantes que han asistido 4+ veces pero no son miembros. Invita automáticamente a la clase de membresía y programa seguimiento pastoral.',
  },
  'Visitor: Urgent Prayer Request (24/7)': {
    name: 'Visitante: Petición de Oración Urgente (24/7)',
    description: 'Para visitantes que envían peticiones de oración urgentes. Proporciona respuesta 24/7 con asignación inmediata de personal y contacto pastoral, ignorando horario laboral.',
  },
};

async function updateTemplates() {
  console.log('=== ACTUALIZACIÓN DE PLANTILLAS A ESPAÑOL ===\n');

  let updated = 0;
  let notFound = 0;

  for (const [englishName, spanish] of Object.entries(SPANISH_TEMPLATES)) {
    try {
      const result = await prisma.automationRuleTemplate.updateMany({
        where: { name: englishName },
        data: {
          name: spanish.name,
          description: spanish.description,
        },
      });

      if (result.count > 0) {
        console.log(`✅ Actualizado: "${englishName}"`);
        console.log(`   → "${spanish.name}"\n`);
        updated++;
      } else {
        console.log(`⚠️  No encontrado: "${englishName}"\n`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Error actualizando "${englishName}":`, error);
    }
  }

  console.log('\n=== RESUMEN ===');
  console.log(`✅ Plantillas actualizadas: ${updated}`);
  console.log(`⚠️  Plantillas no encontradas: ${notFound}`);
  console.log(`📊 Total procesadas: ${Object.keys(SPANISH_TEMPLATES).length}\n`);

  // Verificar resultado
  console.log('=== VERIFICACIÓN ===\n');
  const allTemplates = await prisma.automationRuleTemplate.findMany({
    select: { name: true, category: true },
    orderBy: { category: 'asc' },
  });

  const hasEnglish = allTemplates.some(
    (t) =>
      t.name.includes('Prayer Request') ||
      t.name.includes('Visitor:') ||
      t.name.includes('Welcome') ||
      t.name.includes('Acknowledgment')
  );

  if (hasEnglish) {
    console.log('⚠️  ADVERTENCIA: Aún hay plantillas con texto en inglés:\n');
    allTemplates
      .filter(
        (t) =>
          t.name.includes('Prayer') ||
          t.name.includes('Visitor:') ||
          t.name.includes('Welcome')
      )
      .forEach((t) => {
        console.log(`   - ${t.name} (${t.category})`);
      });
  } else {
    console.log('✅ ÉXITO: Todas las plantillas están en español');
    console.log('\nPlantillas actuales:');
    allTemplates.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.name}`);
    });
  }

  await prisma.$disconnect();
}

updateTemplates()
  .then(() => {
    console.log('\n✅ Actualización completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en actualización:', error);
    process.exit(1);
  });
