import { executeAgent } from '@/lib/agents/executor';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const mockContext = {
      prayer_requests: [
        {
          id: '1',
          member_name: 'Juan Perez',
          request_text: 'Por favor oren por la cirugia de mi madre el 15 de junio. Esta muy nerviosa.',
          created_at: '2026-06-01T10:00:00Z',
          event_date: '2026-06-15',
          event_type: 'Cirugia'
        },
        {
          id: '2',
          member_name: 'Maria Gonzalez',
          request_text: 'Oren por mi examen de la universidad la proxima semana. Estoy muy ansiosa.',
          created_at: '2026-06-05T14:30:00Z',
          event_date: '2026-06-12',
          event_type: 'Examen'
        },
        {
          id: '3',
          member_name: 'Pedro Ramirez',
          request_text: 'Oren por mi situacion laboral. No se que hacer.',
          created_at: '2026-06-06T09:15:00Z',
          event_date: null,
          event_type: null
        },
        {
          id: '4',
          member_name: 'Ana Torres',
          request_text: 'Mi esposo tiene un juicio el 20 de junio. Oren por justicia.',
          created_at: '2026-06-07T16:45:00Z',
          event_date: '2026-06-20',
          event_type: 'Juicio'
        }
      ],
      current_date: '2026-06-08',
      look_ahead_days: 14
    };
    const result = await executeAgent(4, mockContext);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
