import { executeAgent } from '@/lib/agents/executor';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const mockContext = {
      prayer_request: 'Ya no puedo mas con esta soledad. No se para que seguir. Mi esposa me dejo y mis hijos no me hablan.',
      member_name: 'Juan Perez',
      member_age: 45,
      previous_interactions: ['Asistio al ultimo retiro de hombres', 'Menciono dificultades matrimoniales hace 2 meses']
    };
    const result = await executeAgent(2, mockContext);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
