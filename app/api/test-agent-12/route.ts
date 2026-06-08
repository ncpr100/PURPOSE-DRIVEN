import { executeAgent } from '@/lib/agents/executor';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const mockContext = {
      service_date: '2026-06-14',
      service_time: '10:00 AM',
      ministry_name: 'Alabanza y Adoración',
      assigned_volunteers: [
        {
          id: '1',
          name: 'Pedro Ramirez',
          phone: '+573001111111',
          role: 'Lider de Alabanza',
          status: 'confirmed'
        },
        {
          id: '2',
          name: 'Maria Lopez',
          phone: '+573002222222',
          role: 'Coro',
          status: 'cancelled',
          cancellation_reason: 'Emergencia familiar'
        },
        {
          id: '3',
          name: 'Carlos Ruiz',
          phone: '+573003333333',
          role: 'Guitarra',
          status: 'pending'
        }
      ],
      available_backups: [
        {
          id: '4',
          name: 'Ana Torres',
          phone: '+573004444444',
          role: 'Coro',
          availability_score: 9,
          last_served_date: '2026-05-15',
          preferred_contact: 'whatsapp'
        },
        {
          id: '5',
          name: 'Lucia Mendez',
          phone: '+573005555555',
          role: 'Coro',
          availability_score: 7,
          last_served_date: '2026-04-20',
          preferred_contact: 'whatsapp'
        },
        {
          id: '6',
          name: 'Juan Perez',
          phone: '+573006666666',
          role: 'Guitarra',
          availability_score: 8,
          last_served_date: '2026-05-28',
          preferred_contact: 'sms'
        }
      ],
      cascade_depth: 2,
      whatsapp_enabled: false // MODO CONTINGENCIA: WhatsApp no habilitado
    };
    const result = await executeAgent(12, mockContext);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
