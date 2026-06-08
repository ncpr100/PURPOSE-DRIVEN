import { executeAgent } from '@/lib/agents/executor';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const mockContext = {
      members: [
        {
          id: '1',
          name: 'Maria Lopez',
          last_attendance_date: '2026-05-04',
          weeks_absent: 5,
          ministry_role: 'Maestra de Escuela Dominical',
          small_group: 'Grupo Mujeres de Fe',
          giving_status: 'declining',
          previous_engagement_score: 8
        },
        {
          id: '2',
          name: 'Carlos Ruiz',
          last_attendance_date: '2026-05-25',
          weeks_absent: 2,
          ministry_role: 'Ujier',
          small_group: 'Grupo Varones',
          giving_status: 'active',
          previous_engagement_score: 7
        },
        {
          id: '3',
          name: 'Ana Torres',
          last_attendance_date: '2026-04-13',
          weeks_absent: 8,
          ministry_role: null,
          small_group: null,
          giving_status: 'inactive',
          previous_engagement_score: 4
        },
        {
          id: '4',
          name: 'Pedro Ramirez',
          last_attendance_date: '2026-06-01',
          weeks_absent: 1,
          ministry_role: 'Lider de Alabanza',
          small_group: 'Grupo Matrimonios',
          giving_status: 'active',
          previous_engagement_score: 9
        },
        {
          id: '5',
          name: 'Lucia Mendez',
          last_attendance_date: '2026-05-11',
          weeks_absent: 4,
          ministry_role: 'Diaconisa',
          small_group: null,
          giving_status: 'declining',
          previous_engagement_score: 6
        }
      ],
      current_date: '2026-06-08',
      risk_threshold_weeks: 4
    };
    const result = await executeAgent(5, mockContext);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
