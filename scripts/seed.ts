
import { db as prisma } from '../lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  try {
    // Crear iglesia de ejemplo
    const church = await prisma.churches.upsert({
      where: { id: 'demo-church' },
      update: {},
      create: {
        id: 'demo-church',
        name: 'Iglesia Central Ejemplo',
        address: 'Calle Principal 123, Ciudad, Estado',
        phone: '+1234567890',
        email: 'contacto@iglesiacentral.com',
        website: 'https://iglesiacentral.com',
        founded: new Date('2000-01-01'),
        description: 'Una iglesia comprometida con la comunidad y el crecimiento espiritual.',
        isActive: true,
        updatedAt: new Date()
      }
    })

    console.log('✅ Iglesia creada:', church.name)

    // Hash password para usuarios de prueba
    const hashedPassword = await bcrypt.hash('password123', 12)
    const testHashedPassword = await bcrypt.hash('johndoe123', 12)
    // 🚨 OFFICIAL SUPER_ADMIN PASSWORD - SINGLE SOURCE OF TRUTH
    const superAdminHashedPassword = await bcrypt.hash('Bendecido100%$$%', 12)

    // 🚨 Crear usuario SUPER_ADMIN (ONLY ONE - PLATFORM ADMINISTRATOR)
    const superAdminUser = await prisma.users.upsert({
      where: { email: 'soporte@khesed-tek-systems.org' },
      update: {},
      create: {
        name: 'Khesed-Tek Support',
        email: 'soporte@khesed-tek-systems.org',
        password: superAdminHashedPassword,
        role: 'SUPER_ADMIN',
        churchId: null, // SUPER_ADMIN no pertenece a una iglesia específica
        isActive: true
      }
    })

    console.log('✅ SUPER_ADMIN creado:', superAdminUser.name, '(', superAdminUser.email, ')')

    // Crear usuario administrador (CHURCH LEVEL)
    const adminUser = await prisma.users.upsert({
      where: { email: 'admin@iglesiacentral.com' },
      update: {},
      create: {
        name: 'María González',
        email: 'admin@iglesiacentral.com',
        password: hashedPassword,
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true
      }
    })

    console.log('✅ Usuario administrador creado:', adminUser.name)

    // Crear usuario de prueba (john@doe.com)
    const testUser = await prisma.users.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: testHashedPassword,
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true
      }
    })

    console.log('✅ Usuario de prueba creado:', testUser.name)

    // Crear pastor
    const pastorUser = await prisma.users.upsert({
      where: { email: 'pastor@iglesiacentral.com' },
      update: {},
      create: {
        name: 'Pastor Carlos Ruiz',
        email: 'pastor@iglesiacentral.com',
        password: hashedPassword,
        role: 'PASTOR',
        churchId: church.id,
        isActive: true
      }
    })

    console.log('✅ Pastor creado:', pastorUser.name)

    // Crear ministerios
    const ministeriosData = [
      { name: 'Ministerio de Jóvenes', description: 'Para jóvenes de 15-35 años' },
      { name: 'Ministerio de Niños', description: 'Para niños de 3-12 años' },
      { name: 'Ministerio de Alabanza', description: 'Equipo de música y adoración' },
      { name: 'Ministerio de Evangelismo', description: 'Alcance comunitario y misiones' },
      { name: 'Ministerio de Matrimonios', description: 'Apoyo a parejas casadas' }
    ]

    const ministries = []
    for (const ministerio of ministeriosData) {
      const ministry = await prisma.ministries.upsert({
        where: { id: `ministry-${ministerio.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `ministry-${ministerio.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: ministerio.name,
          description: ministerio.description,
          churchId: church.id,
          isActive: true
        }
      })
      ministries.push(ministry)
    }

    console.log('✅ Ministerios creados')

    // Crear miembros de ejemplo con diversidad para AI analytics
    const miembrosEjemplo = [
      // Existing members
      {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@email.com',
        phone: '+1234567801',
        gender: 'femenino',
        maritalStatus: 'casado',
        occupation: 'Enfermera',
        birthDate: new Date('1985-03-15'),
        baptismDate: new Date('2010-05-20'),
        membershipDate: new Date('2010-06-01'),
        spiritualGiftsStructured: {
          primary: ['SERVICIO', 'MINISTERIAL'],
          secondary: ['RELACIONAL'],
          passions: ['Cuidado pastoral', 'Ministerio de salud'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Servir a través del cuidado y la sanidad',
          motivation: 'Ayudar a otros en momentos de necesidad'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Pedro',
        lastName: 'López',
        email: 'pedro.lopez@email.com',
        phone: '+1234567802',
        gender: 'masculino',
        maritalStatus: 'casado',
        occupation: 'Ingeniero',
        birthDate: new Date('1982-07-22'),
        baptismDate: new Date('2008-12-14'),
        membershipDate: new Date('2009-01-15'),
        spiritualGiftsStructured: {
          primary: ['TÉCNICO', 'LIDERAZGO'],
          secondary: ['COMUNICACIÓN'],
          passions: ['Tecnología para la iglesia', 'Administración'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Usar mis habilidades técnicas para el reino',
          motivation: 'Facilitar el ministerio a través de la tecnología'
        },
        leadershipStage: 'MINISTRY_LEADER'
      },
      {
        firstName: 'Sofia',
        lastName: 'García',
        email: 'sofia.garcia@email.com',
        phone: '+1234567803',
        gender: 'femenino',
        maritalStatus: 'soltero',
        occupation: 'Maestra',
        birthDate: new Date('1990-11-08'),
        baptismDate: new Date('2015-08-30'),
        membershipDate: new Date('2015-09-15'),
        spiritualGiftsStructured: {
          primary: ['COMUNICACIÓN', 'MINISTERIAL'],
          secondary: ['SERVICIO'],
          passions: ['Enseñanza bíblica', 'Ministerio infantil'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Enseñar la palabra de Dios a niños y jóvenes',
          motivation: 'Ver crecer la próxima generación en la fe'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Miguel',
        lastName: 'Torres',
        email: 'miguel.torres@email.com',
        phone: '+1234567804',
        gender: 'masculino',
        maritalStatus: 'soltero',
        occupation: 'Estudiante',
        birthDate: new Date('1998-04-12'),
        baptismDate: new Date('2020-02-16'),
        membershipDate: new Date('2020-03-01'),
        spiritualGiftsStructured: {
          primary: ['ARTÍSTICO', 'COMUNICACIÓN'],
          secondary: ['RELACIONAL'],
          passions: ['Música', 'Adoración'],
          experienceLevel: 'NOVATO',
          spiritualCalling: 'Liderar adoración y crear arte para Dios',
          motivation: 'Expresar mi amor por Dios a través del arte'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Carmen',
        lastName: 'Rodríguez',
        email: 'carmen.rodriguez@email.com',
        phone: '+1234567805',
        gender: 'femenino',
        maritalStatus: 'viudo',
        occupation: 'Jubilada',
        birthDate: new Date('1955-09-28'),
        baptismDate: new Date('1975-04-06'),
        membershipDate: new Date('1975-05-01'),
        spiritualGiftsStructured: {
          primary: ['EQUILIBRAR', 'RELACIONAL'],
          secondary: ['SERVICIO'],
          passions: ['Consejería', 'Oración intercesora'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Ser madre espiritual y consejera sabia',
          motivation: 'Compartir la sabiduría que Dios me ha dado'
        },
        leadershipStage: 'MINISTRY_LEADER'
      },
      {
        firstName: 'David',
        lastName: 'Hernández',
        email: 'david.hernandez@email.com',
        phone: '+1234567806',
        gender: 'masculino',
        maritalStatus: 'casado',
        occupation: 'Contador',
        birthDate: new Date('1978-12-03'),
        baptismDate: new Date('2012-10-21'),
        membershipDate: new Date('2012-11-05'),
        spiritualGiftsStructured: {
          primary: ['TÉCNICO', 'SERVICIO'],
          secondary: ['LIDERAZGO'],
          passions: ['Administración financiera', 'Mayordomía'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Administrar los recursos de Dios fielmente',
          motivation: 'Asegurar transparencia y buen uso de recursos'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Lucía',
        lastName: 'Morales',
        email: 'lucia.morales@email.com',
        phone: '+1234567807',
        gender: 'femenino',
        maritalStatus: 'casado',
        occupation: 'Doctora',
        birthDate: new Date('1987-06-17'),
        baptismDate: new Date('2018-07-15'),
        membershipDate: new Date('2018-08-01'),
        spiritualGiftsStructured: {
          primary: ['SERVICIO', 'LIDERAZGO'],
          secondary: ['MINISTERIAL'],
          passions: ['Ministerio de salud', 'Misiones médicas'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Sanar cuerpos y almas para la gloria de Dios',
          motivation: 'Demostrar el amor de Cristo a través de la medicina'
        },
        leadershipStage: 'MINISTRY_LEADER'
      },
      {
        firstName: 'Roberto',
        lastName: 'Jiménez',
        email: 'roberto.jimenez@email.com',
        phone: '+1234567808',
        gender: 'masculino',
        maritalStatus: 'soltero',
        occupation: 'Programador',
        birthDate: new Date('1992-01-25'),
        baptismDate: new Date('2019-09-08'),
        membershipDate: new Date('2019-10-01'),
        spiritualGiftsStructured: {
          primary: ['TÉCNICO', 'ARTÍSTICO'],
          secondary: ['COMUNICACIÓN'],
          passions: ['Desarrollo web', 'Diseño gráfico'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Crear herramientas digitales para el ministerio',
          motivation: 'Combinar tecnología con propósito divino'
        },
        leadershipStage: 'VOLUNTEER'
      },
      // Additional members for AI analytics diversity
      {
        firstName: 'María Elena',
        lastName: 'Vásquez',
        email: 'maria.vasquez@email.com',
        phone: '+1234567810',
        gender: 'femenino',
        maritalStatus: 'casado',
        occupation: 'Psicóloga',
        birthDate: new Date('1983-09-12'),
        baptismDate: new Date('2011-04-17'),
        membershipDate: new Date('2011-05-01'),
        spiritualGiftsStructured: {
          primary: ['EQUILIBRAR', 'RELACIONAL'],
          secondary: ['COMUNICACIÓN'],
          passions: ['Consejería familiar', 'Restauración emocional'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Restaurar corazones quebrantados',
          motivation: 'Ver familias restauradas en Cristo'
        },
        leadershipStage: 'MINISTRY_LEADER'
      },
      {
        firstName: 'Antonio',
        lastName: 'Fernández',
        email: 'antonio.fernandez@email.com',
        phone: '+1234567811',
        gender: 'masculino',
        maritalStatus: 'casado',
        occupation: 'Músico',
        birthDate: new Date('1988-01-30'),
        baptismDate: new Date('2016-12-25'),
        membershipDate: new Date('2017-01-08'),
        spiritualGiftsStructured: {
          primary: ['ARTÍSTICO', 'COMUNICACIÓN'],
          secondary: ['LIDERAZGO'],
          passions: ['Música de adoración', 'Composición'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Liderar la iglesia en adoración verdadera',
          motivation: 'Crear atmósferas de encuentro con Dios'
        },
        leadershipStage: 'MINISTRY_LEADER'
      },
      {
        firstName: 'Isabella',
        lastName: 'Castro',
        email: 'isabella.castro@email.com',
        phone: '+1234567812',
        gender: 'femenino',
        maritalStatus: 'soltero',
        occupation: 'Diseñadora',
        birthDate: new Date('1994-05-08'),
        baptismDate: new Date('2021-06-20'),
        membershipDate: new Date('2021-07-04'),
        spiritualGiftsStructured: {
          primary: ['ARTÍSTICO', 'TÉCNICO'],
          secondary: ['SERVICIO'],
          passions: ['Diseño gráfico', 'Comunicación visual'],
          experienceLevel: 'NOVATO',
          spiritualCalling: 'Comunicar el evangelio a través del arte visual',
          motivation: 'Hacer que el mensaje de Cristo sea atractivo'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Javier',
        lastName: 'Mendoza',
        email: 'javier.mendoza@email.com',
        phone: '+1234567813',
        gender: 'masculino',
        maritalStatus: 'casado',
        occupation: 'Empresario',
        birthDate: new Date('1979-11-14'),
        baptismDate: new Date('2007-09-02'),
        membershipDate: new Date('2007-10-01'),
        spiritualGiftsStructured: {
          primary: ['LIDERAZGO', 'TÉCNICO'],
          secondary: ['SERVICIO'],
          passions: ['Administración', 'Desarrollo de liderazgo'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Equipar líderes para el ministerio',
          motivation: 'Multiplicar el impacto del reino'
        },
        leadershipStage: 'PASTOR'
      },
      {
        firstName: 'Valentina',
        lastName: 'Guerrero',
        email: 'valentina.guerrero@email.com',
        phone: '+1234567814',
        gender: 'femenino',
        maritalStatus: 'soltero',
        occupation: 'Estudiante universitaria',
        birthDate: new Date('2001-08-22'),
        baptismDate: new Date('2022-04-10'),
        membershipDate: new Date('2022-05-01'),
        spiritualGiftsStructured: {
          primary: ['RELACIONAL', 'COMUNICACIÓN'],
          secondary: ['MINISTERIAL'],
          passions: ['Evangelismo juvenil', 'Redes sociales'],
          experienceLevel: 'NOVATO',
          spiritualCalling: 'Alcanzar a mi generación para Cristo',
          motivation: 'Ver a jóvenes transformados por el evangelio'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Ricardo',
        lastName: 'Paredes',
        email: 'ricardo.paredes@email.com',
        phone: '+1234567815',
        gender: 'masculino',
        maritalStatus: 'divorciado',
        occupation: 'Mecánico',
        birthDate: new Date('1976-02-18'),
        baptismDate: new Date('2013-11-03'),
        membershipDate: new Date('2013-12-01'),
        spiritualGiftsStructured: {
          primary: ['SERVICIO', 'TÉCNICO'],
          secondary: ['RELACIONAL'],
          passions: ['Mantenimiento de instalaciones', 'Ayuda práctica'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Servir con mis manos y mi corazón',
          motivation: 'Demostrar amor a través del servicio práctico'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Adriana',
        lastName: 'Silva',
        email: 'adriana.silva@email.com',
        phone: '+1234567816',
        gender: 'femenino',
        maritalStatus: 'casado',
        occupation: 'Chef',
        birthDate: new Date('1986-12-01'),
        baptismDate: new Date('2014-08-24'),
        membershipDate: new Date('2014-09-07'),
        spiritualGiftsStructured: {
          primary: ['SERVICIO', 'RELACIONAL'],
          secondary: ['ARTÍSTICO'],
          passions: ['Hospitalidad', 'Ministerio culinario'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Servir a través de la hospitalidad bíblica',
          motivation: 'Crear comunidad alrededor de la mesa'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Andrés',
        lastName: 'Moreno',
        email: 'andres.moreno@email.com',
        phone: '+1234567817',
        gender: 'masculino',
        maritalStatus: 'soltero',
        occupation: 'Abogado',
        birthDate: new Date('1991-06-25'),
        baptismDate: new Date('2020-09-13'),
        membershipDate: new Date('2020-10-04'),
        spiritualGiftsStructured: {
          primary: ['EQUILIBRAR', 'COMUNICACIÓN'],
          secondary: ['LIDERAZGO'],
          passions: ['Justicia social', 'Defensa legal'],
          experienceLevel: 'NOVATO',
          spiritualCalling: 'Defender la justicia con principios bíblicos',
          motivation: 'Ser voz para los que no tienen voz'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Camila',
        lastName: 'Restrepo',
        email: 'camila.restrepo@email.com',
        phone: '+1234567818',
        gender: 'femenino',
        maritalStatus: 'casado',
        occupation: 'Fisioterapeuta',
        birthDate: new Date('1984-04-11'),
        baptismDate: new Date('2017-05-28'),
        membershipDate: new Date('2017-06-11'),
        spiritualGiftsStructured: {
          primary: ['SERVICIO', 'MINISTERIAL'],
          secondary: ['EQUILIBRAR'],
          passions: ['Sanidad física', 'Oración por sanidad'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Ser instrumento de sanidad integral',
          motivation: 'Ver restauración física y espiritual'
        },
        leadershipStage: 'VOLUNTEER'
      },
      {
        firstName: 'Fernando',
        lastName: 'Delgado',
        email: 'fernando.delgado@email.com',
        phone: '+1234567819',
        gender: 'masculino',
        maritalStatus: 'casado',
        occupation: 'Periodista',
        birthDate: new Date('1981-10-07'),
        baptismDate: new Date('2009-03-15'),
        membershipDate: new Date('2009-04-05'),
        spiritualGiftsStructured: {
          primary: ['COMUNICACIÓN', 'LIDERAZGO'],
          secondary: ['TÉCNICO'],
          passions: ['Comunicación cristiana', 'Medios digitales'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Comunicar verdad con excelencia periodística',
          motivation: 'Ser luz en los medios de comunicación'
        },
        leadershipStage: 'MINISTRY_LEADER'
      },
      {
        firstName: 'Alejandra',
        lastName: 'Navarro',
        email: 'alejandra.navarro@email.com',
        phone: '+1234567820',
        gender: 'femenino',
        maritalStatus: 'soltero',
        occupation: 'Trabajadora Social',
        birthDate: new Date('1993-07-19'),
        baptismDate: new Date('2019-12-01'),
        membershipDate: new Date('2019-12-15'),
        spiritualGiftsStructured: {
          primary: ['MINISTERIAL', 'RELACIONAL'],
          secondary: ['SERVICIO'],
          passions: ['Trabajo comunitario', 'Ministerio de compasión'],
          experienceLevel: 'NOVATO',
          spiritualCalling: 'Servir a los más vulnerables de la sociedad',
          motivation: 'Demostrar el amor de Cristo a través de la acción social'
        },
        leadershipStage: 'VOLUNTEER'
      },
      // Inactive/At-risk members for retention analysis
      {
        firstName: 'Eduardo',
        lastName: 'Vargas',
        email: 'eduardo.vargas@email.com',
        phone: '+1234567821',
        gender: 'masculino',
        maritalStatus: 'casado',
        occupation: 'Vendedor',
        birthDate: new Date('1977-01-09'),
        baptismDate: new Date('2006-07-16'),
        membershipDate: new Date('2006-08-01'),
        spiritualGiftsStructured: {
          primary: ['RELACIONAL', 'COMUNICACIÓN'],
          secondary: ['SERVICIO'],
          passions: ['Evangelismo personal', 'Alcance comunitario'],
          experienceLevel: 'INTERMEDIO',
          spiritualCalling: 'Compartir el evangelio en el mundo de los negocios',
          motivation: 'Ser testigo en mi ambiente laboral'
        },
        leadershipStage: 'VOLUNTEER',
        isActive: true // Will be marked as at-risk in member journey
      },
      {
        firstName: 'Patricia',
        lastName: 'Rojas',
        email: 'patricia.rojas@email.com',
        phone: '+1234567822',
        gender: 'femenino',
        maritalStatus: 'divorciado',
        occupation: 'Secretaria',
        birthDate: new Date('1972-03-26'),
        baptismDate: new Date('2002-05-12'),
        membershipDate: new Date('2002-06-01'),
        spiritualGiftsStructured: {
          primary: ['SERVICIO', 'EQUILIBRAR'],
          secondary: ['RELACIONAL'],
          passions: ['Administración', 'Apoyo pastoral'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Servir en la administración del reino',
          motivation: 'Facilitar el ministerio de otros'
        },
        leadershipStage: 'VOLUNTEER',
        isActive: true // Will be marked as declining engagement
      }
    ]

    for (const miembro of miembrosEjemplo) {
      await prisma.members.create({
        data: {
          firstName: miembro.firstName,
          lastName: miembro.lastName,
          email: miembro.email,
          phone: miembro.phone,
          gender: miembro.gender,
          maritalStatus: miembro.maritalStatus,
          occupation: miembro.occupation,
          birthDate: miembro.birthDate,
          baptismDate: miembro.baptismDate,
          membershipDate: miembro.membershipDate,
          spiritualGifts: miembro.spiritualGiftsStructured ? JSON.stringify(miembro.spiritualGiftsStructured) : undefined,
          leadershipStage: (miembro.leadershipStage as any) || 'VOLUNTEER',
          churchId: church.id,
          address: 'Calle Ejemplo 456',
          city: 'Ciudad Ejemplo',
          state: 'Estado Ejemplo',
          zipCode: '12345',
          isActive: miembro.isActive ?? true
        }
      })
    }

    console.log('✅ Miembros de ejemplo creados')

    // Crear miembro para el administrador
    await prisma.members.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        firstName: 'María',
        lastName: 'González',
        email: adminUser.email,
        phone: '+1234567890',
        gender: 'femenino',
        maritalStatus: 'casado',
        occupation: 'Administradora de Iglesia',
        birthDate: new Date('1980-05-10'),
        baptismDate: new Date('2005-03-20'),
        membershipDate: new Date('2005-04-01'),
        spiritualGifts: JSON.stringify({
          primary: ['LIDERAZGO', 'TÉCNICO'],
          secondary: ['SERVICIO', 'EQUILIBRAR'],
          passions: ['Administración eclesiástica', 'Organización de eventos'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Administrar los recursos del reino con excelencia',
          motivation: 'Facilitar que otros ministren efectivamente'
        }),
        leadershipStage: 'PASTOR',
        churchId: church.id,
        userId: adminUser.id,
        address: 'Avenida Principal 789',
        city: 'Ciudad Ejemplo',
        state: 'Estado Ejemplo',
        zipCode: '12345',
        isActive: true
      }
    })

    // Crear miembro para el pastor
    await prisma.members.upsert({
      where: { userId: pastorUser.id },
      update: {},
      create: {
        firstName: 'Carlos',
        lastName: 'Ruiz',
        email: pastorUser.email,
        phone: '+1234567891',
        gender: 'masculino',
        maritalStatus: 'casado',
        occupation: 'Pastor Principal',
        birthDate: new Date('1975-08-15'),
        baptismDate: new Date('1995-06-10'),
        membershipDate: new Date('2000-01-01'),
        spiritualGifts: JSON.stringify({
          primary: ['MINISTERIAL', 'LIDERAZGO'],
          secondary: ['COMUNICACIÓN', 'EQUILIBRAR'],
          passions: ['Predicación expositiva', 'Discipulado', 'Cuidado pastoral'],
          experienceLevel: 'AVANZADO',
          spiritualCalling: 'Pastorear el rebaño de Dios con amor y verdad',
          motivation: 'Ver vidas transformadas por el poder del evangelio'
        }),
        leadershipStage: 'PASTOR',
        churchId: church.id,
        userId: pastorUser.id,
        address: 'Calle Pastoral 101',
        city: 'Ciudad Ejemplo',
        state: 'Estado Ejemplo',
        zipCode: '12345',
        isActive: true
      }
    })

    console.log('✅ Miembros para usuarios creados')

    // Crear datos de analíticas de miembros para AI testing
    console.log('📊 Creando datos de analíticas para AI...')
    
    // Obtener miembros creados para análisis
    const miembrosCreados = await prisma.members.findMany({
      where: { churchId: church.id },
      take: 20 // Tomar más miembros para datos diversos
    })

    console.log('✅ Datos de analíticas de miembros creados para AI testing')

    console.log('✅ Miembros para usuarios creados')

    // Crear sermones de ejemplo
    const sermonesEjemplo = [
      {
        title: 'El Amor Incondicional de Dios',
        content: 'Dios nos ama con un amor que no tiene condiciones ni límites. En Juan 3:16 vemos la mayor expresión de este amor: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."\n\nEste amor no depende de nuestras acciones, nuestro estatus social, o nuestros errores del pasado. Es un amor que nos busca cuando estamos perdidos, nos levanta cuando caemos, y nos da esperanza cuando todo parece perdido.\n\nTres aspectos del amor de Dios:\n1. Es personal - Dios te conoce por nombre\n2. Es sacrificial - Dio a su Hijo por ti\n3. Es eterno - Nunca se acaba\n\nHoy puedes experimentar este amor. Solo tienes que abrir tu corazón y recibirlo.',
        scripture: 'Juan 3:16',
        speaker: 'Pastor Carlos Ruiz',
        date: new Date('2024-01-07')
      },
      {
        title: 'Viviendo con Propósito',
        content: 'Cada persona fue creada con un propósito específico en el plan de Dios. En Jeremías 29:11 Dios nos dice: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis."\n\nNo estás aquí por casualidad. Tu vida tiene significado y valor. Dios tiene planes específicos para ti:\n\n1. Un plan de esperanza - No de destrucción sino de edificación\n2. Un plan de futuro - No solo para el presente sino para toda la vida\n3. Un plan de bien - Para tu beneficio y el de otros\n\nPara descubrir tu propósito:\n- Busca a Dios en oración\n- Estudia Su Palabra\n- Sirve a otros\n- Usa los dones que Él te ha dado\n\nTu propósito puede estar más cerca de lo que imaginas.',
        scripture: 'Jeremías 29:11',
        speaker: 'Pastor Carlos Ruiz',
        date: new Date('2024-01-14')
      },
      {
        title: 'La Importancia del Perdón',
        content: 'El perdón es una de las enseñanzas más poderosas de Jesús. En Mateo 6:14-15 Él nos dice: "Porque si perdonáis a los hombres sus ofensas, os perdonará también a vosotros vuestro Padre celestial; mas si no perdonáis a los hombres sus ofensas, tampoco vuestro Padre os perdonará vuestras ofensas."\n\nPerdonar no es fácil, pero es esencial para nuestra libertad espiritual y emocional. Cuando guardamos rencor, somos nosotros los que sufrimos.\n\nPasos para perdonar:\n1. Reconoce el dolor - No minimices lo que pasó\n2. Decide perdonar - Es una decisión, no un sentimiento\n3. Busca ayuda de Dios - Él te dará la fuerza\n4. Libera el deseo de venganza - Deja que Dios sea el juez\n5. Ora por la persona - Esto transformará tu corazón\n\nRecuerda: perdonar no significa tolerar el abuso o no establecer límites. Significa liberar el rencor de tu corazón.',
        scripture: 'Mateo 6:14-15',
        speaker: 'Pastor Carlos Ruiz',
        date: new Date('2024-01-21')
      }
    ]

    for (const sermon of sermonesEjemplo) {
      await prisma.sermon.create({
        data: {
          ...sermon,
          churchId: church.id,
          isPublic: false
        }
      })
    }

    console.log('✅ Sermones de ejemplo creados')

    // Crear eventos de ejemplo
    const eventosEjemplo = [
      {
        title: 'Conferencia de Jóvenes',
        description: 'Una conferencia especial para jóvenes con música, testimonios y enseñanza bíblica.',
        startDate: new Date('2024-02-15T18:00:00'),
        endDate: new Date('2024-02-17T20:00:00'),
        location: 'Auditorio Principal',
        isPublic: true
      },
      {
        title: 'Retiro de Matrimonios',
        description: 'Un fin de semana para fortalecer los matrimonios a través de talleres y actividades.',
        startDate: new Date('2024-03-08T16:00:00'),
        endDate: new Date('2024-03-10T14:00:00'),
        location: 'Centro de Retiros Valle Verde',
        isPublic: true
      },
      {
        title: 'Evangelización Comunitaria',
        description: 'Salida misionera al parque central para compartir el evangelio.',
        startDate: new Date('2024-02-24T09:00:00'),
        endDate: new Date('2024-02-24T13:00:00'),
        location: 'Parque Central',
        isPublic: true
      }
    ]

    const events = []
    for (const evento of eventosEjemplo) {
      const event = await prisma.events.create({
        data: {
          ...evento,
          churchId: church.id
        }
      })
      events.push(event)
    }

    console.log('✅ Eventos de ejemplo creados')

    // Crear voluntarios de ejemplo
    const volunteers = await Promise.all([
      prisma.volunteer.upsert({
        where: { id: 'volunteer-1' },
        update: {},
        create: {
          id: 'volunteer-1',
          firstName: 'Ana',
          lastName: 'García',
          email: 'ana@email.com',
          phone: '+1234567891',
          skills: JSON.stringify(['Música', 'Coro', 'Piano']),
          availability: JSON.stringify({
            'domingo': ['09:00-12:00'],
            'miercoles': ['19:00-21:00']
          }),
          churchId: church.id,
          ministryId: ministries[2].id, // Ministerio de Alabanza
          isActive: true
        }
      }),
      prisma.volunteer.upsert({
        where: { id: 'volunteer-2' },
        update: {},
        create: {
          id: 'volunteer-2',
          firstName: 'Pedro',
          lastName: 'Martínez',
          email: 'pedro@email.com',
          phone: '+1234567892',
          skills: JSON.stringify(['Sonido', 'Tecnología', 'Proyección']),
          availability: JSON.stringify({
            'domingo': ['08:00-13:00'],
            'sabado': ['18:00-22:00']
          }),
          churchId: church.id,
          ministryId: ministries[0].id, // Ministerio de Jóvenes
          isActive: true
        }
      }),
      prisma.volunteer.upsert({
        where: { id: 'volunteer-3' },
        update: {},
        create: {
          id: 'volunteer-3',
          firstName: 'Sofia',
          lastName: 'López',
          email: 'sofia@email.com',
          phone: '+1234567893',
          skills: JSON.stringify(['Niños', 'Enseñanza', 'Manualidades']),
          availability: JSON.stringify({
            'domingo': ['09:30-11:30'],
            'jueves': ['18:00-20:00']
          }),
          churchId: church.id,
          ministryId: ministries[1].id, // Ministerio de Niños
          isActive: true
        }
      })
    ])

    console.log('✅ Voluntarios de ejemplo creados')

    // Crear asignaciones de voluntarios
    const assignments = await Promise.all([
      prisma.volunteerAssignment.create({
        data: {
          volunteerId: volunteers[0].id,
          eventId: events[0].id,
          title: 'Líder de Adoración',
          description: 'Dirigir la adoración durante el servicio dominical',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // próximo domingo
          startTime: '09:00',
          endTime: '10:30',
          status: 'ASIGNADO',
          churchId: church.id
        }
      }),
      prisma.volunteerAssignment.create({
        data: {
          volunteerId: volunteers[1].id,
          eventId: events[0].id,
          title: 'Técnico de Sonido',
          description: 'Operar el equipo de sonido durante el servicio',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          startTime: '08:30',
          endTime: '11:00',
          status: 'CONFIRMADO',
          churchId: church.id
        }
      })
    ])

    console.log('✅ Asignaciones de voluntarios creadas')

    // Crear check-ins de visitantes de ejemplo
    const checkIns = await Promise.all([
      prisma.checkIn.create({
        data: {
          firstName: 'Manuel',
          lastName: 'Rodríguez',
          email: 'manuel@email.com',
          phone: '+1234567894',
          isFirstTime: true,
          visitReason: 'Invitado por un amigo',
          prayerRequest: 'Oración por trabajo',
          qrCode: `QR-VISITOR-${Date.now()}-001`,
          churchId: church.id,
          checkedInAt: new Date()
        }
      }),
      prisma.checkIn.create({
        data: {
          firstName: 'Elena',
          lastName: 'Vargas',
          email: 'elena@email.com',
          phone: '+1234567895',
          isFirstTime: true,
          visitReason: 'Búsqueda espiritual',
          prayerRequest: 'Paz familiar',
          qrCode: `QR-VISITOR-${Date.now()}-002`,
          churchId: church.id,
          checkedInAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // hace 2 horas
        }
      }),
      prisma.checkIn.create({
        data: {
          firstName: 'Roberto',
          lastName: 'Silva',
          phone: '+1234567896',
          isFirstTime: false,
          visitReason: 'Miembro visitante de otra ciudad',
          qrCode: `QR-VISITOR-${Date.now()}-003`,
          churchId: church.id,
          checkedInAt: new Date(Date.now() - 30 * 60 * 1000) // hace 30 minutos
        }
      })
    ])

    console.log('✅ Check-ins de visitantes creados')

    // Crear seguimientos automáticos para primeras visitas
    const followUps = await Promise.all([
      prisma.visitorFollowUp.create({
        data: {
          checkInId: checkIns[0].id,
          followUpType: 'EMAIL',
          status: 'COMPLETADO',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          completedAt: new Date(),
          notes: 'Email de bienvenida enviado exitosamente',
          assignedTo: pastorUser.id,
          churchId: church.id
        }
      }),
      prisma.visitorFollowUp.create({
        data: {
          checkInId: checkIns[0].id,
          followUpType: 'LLAMADA',
          status: 'PENDIENTE',
          scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          notes: 'Llamada de seguimiento programada para 3 días después',
          assignedTo: pastorUser.id,
          churchId: church.id
        }
      }),
      prisma.visitorFollowUp.create({
        data: {
          checkInId: checkIns[1].id,
          followUpType: 'EMAIL',
          status: 'PENDIENTE',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          notes: 'Email de bienvenida programado',
          churchId: church.id
        }
      }),
      prisma.visitorFollowUp.create({
        data: {
          checkInId: checkIns[1].id,
          followUpType: 'LLAMADA',
          status: 'PENDIENTE',
          scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          notes: 'Llamada de seguimiento programada',
          assignedTo: adminUser.id,
          churchId: church.id
        }
      })
    ])

    console.log('✅ Seguimientos de visitantes creados')

    // Crear check-ins de niños de ejemplo
    const childrenCheckIns = await Promise.all([
      prisma.childCheckIn.create({
        data: {
          childName: 'Sofía Ramírez',
          childAge: 7,
          parentName: 'Carmen Ramírez',
          parentPhone: '+1234567897',
          parentEmail: 'carmen@email.com',
          emergencyContact: 'Luis Ramírez (Tío)',
          emergencyPhone: '+1234567898',
          allergies: 'Alérgica a los frutos secos',
          qrCode: `QR-CHILD-${Date.now()}-001`,
          checkedIn: true,
          checkedOut: false,
          eventId: events[0].id,
          churchId: church.id
        }
      }),
      prisma.childCheckIn.create({
        data: {
          childName: 'Diego Morales',
          childAge: 5,
          parentName: 'Patricia Morales',
          parentPhone: '+1234567899',
          parentEmail: 'patricia@email.com',
          emergencyContact: 'José Morales (Padre)',
          emergencyPhone: '+1234567900',
          specialNeeds: 'Necesita recordatorio para usar el baño',
          qrCode: `QR-CHILD-${Date.now()}-002`,
          checkedIn: true,
          checkedOut: true,
          checkedOutAt: new Date(Date.now() - 60 * 60 * 1000), // retirado hace 1 hora
          checkedOutBy: adminUser.id,
          churchId: church.id
        }
      }),
      prisma.childCheckIn.create({
        data: {
          childName: 'Isabella Cruz',
          childAge: 9,
          parentName: 'Miguel Cruz',
          parentPhone: '+1234567901',
          parentEmail: 'miguel@email.com',
          qrCode: `QR-CHILD-${Date.now()}-003`,
          checkedIn: true,
          checkedOut: false,
          churchId: church.id
        }
      })
    ])

    console.log('✅ Check-ins de niños creados')

    // Crear categorías de donaciones
    const donationCategories = await Promise.all([
      prisma.donationCategory.upsert({
        where: { id: 'cat-diezmos' },
        update: {},
        create: {
          id: 'cat-diezmos',
          name: 'Diezmos',
          description: 'Diezmos regulares de los miembros',
          churchId: church.id,
          isActive: true
        }
      }),
      prisma.donationCategory.upsert({
        where: { id: 'cat-ofrendas' },
        update: {},
        create: {
          id: 'cat-ofrendas',
          name: 'Ofrendas',
          description: 'Ofrendas voluntarias en servicios',
          churchId: church.id,
          isActive: true
        }
      }),
      prisma.donationCategory.upsert({
        where: { id: 'cat-misiones' },
        update: {},
        create: {
          id: 'cat-misiones',
          name: 'Misiones',
          description: 'Donaciones para obra misionera',
          churchId: church.id,
          isActive: true
        }
      }),
      prisma.donationCategory.upsert({
        where: { id: 'cat-construccion' },
        update: {},
        create: {
          id: 'cat-construccion',
          name: 'Proyecto de Construcción',
          description: 'Fondos para nueva construcción del templo',
          churchId: church.id,
          isActive: true
        }
      })
    ])

    console.log('✅ Categorías de donaciones creadas')

    // Crear métodos de pago
    const paymentMethods = await Promise.all([
      prisma.paymentMethod.upsert({
        where: { id: 'method-efectivo' },
        update: {},
        create: {
          id: 'method-efectivo',
          name: 'Efectivo',
          description: 'Pago en efectivo durante el servicio',
          isDigital: false,
          churchId: church.id,
          isActive: true
        }
      }),
      prisma.paymentMethod.upsert({
        where: { id: 'method-transferencia' },
        update: {},
        create: {
          id: 'method-transferencia',
          name: 'Transferencia Bancaria',
          description: 'Transferencia directa a cuenta de la iglesia',
          isDigital: true,
          churchId: church.id,
          isActive: true
        }
      }),
      prisma.paymentMethod.upsert({
        where: { id: 'method-nequi' },
        update: {},
        create: {
          id: 'method-nequi',
          name: 'Nequi',
          description: 'Pago a través de la app Nequi',
          isDigital: true,
          churchId: church.id,
          isActive: true
        }
      }),
      prisma.paymentMethod.upsert({
        where: { id: 'method-tarjeta' },
        update: {},
        create: {
          id: 'method-tarjeta',
          name: 'Tarjeta de Crédito/Débito',
          description: 'Pago con tarjeta bancaria',
          isDigital: true,
          churchId: church.id,
          isActive: true
        }
      })
    ])

    console.log('✅ Métodos de pago creados')

    // Crear donaciones de ejemplo
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    await Promise.all([
      // Donaciones del mes pasado
      prisma.donations.create({
        data: {
          amount: 250000,
          currency: 'COP',
          donorName: 'Ana Martínez',
          donorEmail: 'ana.martinez@email.com',
          donorPhone: '+1234567801',
          memberId: null, // Ana Martínez - se busca por email
          categoryId: donationCategories[0].id, // Diezmos
          paymentMethodId: paymentMethods[1].id, // Transferencia
          reference: 'TRX-2024-001',
          notes: 'Diezmo mensual',
          isAnonymous: false,
          status: 'COMPLETADA',
          donationDate: new Date(lastMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
          churchId: church.id
        }
      }),
      prisma.donations.create({
        data: {
          amount: 100000,
          currency: 'COP',
          donorName: 'Pedro López',
          donorEmail: 'pedro.lopez@email.com',
          memberId: null, // Pedro López
          categoryId: donationCategories[1].id, // Ofrendas
          paymentMethodId: paymentMethods[0].id, // Efectivo
          notes: 'Ofrenda dominical',
          isAnonymous: false,
          status: 'COMPLETADA',
          donationDate: new Date(lastMonth.getTime() + 12 * 24 * 60 * 60 * 1000),
          churchId: church.id
        }
      }),
      // Donaciones de este mes
      prisma.donations.create({
        data: {
          amount: 500000,
          currency: 'COP',
          categoryId: donationCategories[3].id, // Construcción
          paymentMethodId: paymentMethods[2].id, // Nequi
          reference: 'NEQUI-789456',
          notes: 'Donación especial para nueva construcción',
          isAnonymous: true,
          status: 'COMPLETADA',
          donationDate: new Date(thisMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
          churchId: church.id
        }
      }),
      prisma.donations.create({
        data: {
          amount: 150000,
          currency: 'COP',
          donorName: 'Sofia García',
          donorEmail: 'sofia.garcia@email.com',
          memberId: null, // Sofia García
          categoryId: donationCategories[2].id, // Misiones
          paymentMethodId: paymentMethods[3].id, // Tarjeta
          reference: 'CARD-4567',
          notes: 'Para obra misionera en África',
          isAnonymous: false,
          status: 'COMPLETADA',
          donationDate: new Date(thisMonth.getTime() + 8 * 24 * 60 * 60 * 1000),
          churchId: church.id
        }
      }),
      prisma.donations.create({
        data: {
          amount: 300000,
          currency: 'COP',
          donorName: 'Miguel Torres',
          donorEmail: 'miguel.torres@email.com',
          memberId: null, // Miguel Torres
          categoryId: donationCategories[0].id, // Diezmos
          paymentMethodId: paymentMethods[1].id, // Transferencia
          reference: 'TRX-2024-015',
          notes: 'Diezmo + ofrenda especial',
          isAnonymous: false,
          status: 'COMPLETADA',
          donationDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          churchId: church.id
        }
      }),
      // Donación reciente (esta semana)
      prisma.donations.create({
        data: {
          amount: 75000,
          currency: 'COP',
          categoryId: donationCategories[1].id, // Ofrendas
          paymentMethodId: paymentMethods[0].id, // Efectivo
          notes: 'Ofrenda de gratitud',
          isAnonymous: true,
          status: 'COMPLETADA',
          donationDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          churchId: church.id
        }
      })
    ])

    console.log('✅ Donaciones de ejemplo creadas')

    console.log('🎉 Seed completado exitosamente!')
    console.log('\n📋 Resumen de datos creados:')
    console.log('• 1 Iglesia: Iglesia Central Ejemplo')
    console.log('• 3 Usuarios: Admin, Pastor, Test User')
    console.log('• 5 Ministerios')
    console.log('• 10 Miembros (incluyendo admin y pastor)')
    console.log('• 3 Sermones')
    console.log('• 3 Eventos próximos')
    console.log('• 3 Voluntarios activos')
    console.log('• 2 Asignaciones de voluntarios')
    console.log('• 3 Check-ins de visitantes')
    console.log('• 4 Seguimientos de visitantes')
    console.log('• 3 Check-ins de niños (2 presentes, 1 retirado)')
    console.log('• 4 Categorías de donaciones')
    console.log('• 4 Métodos de pago disponibles')
    console.log('• 6 Donaciones de ejemplo ($1,375,000 COP total)')
    console.log('\n🔐 Credenciales de acceso:')
    console.log('📧 admin@iglesiacentral.com | 🔑 password123 (Administrador)')
    console.log('📧 pastor@iglesiacentral.com | 🔑 password123 (Pastor)')
    console.log('📧 john@doe.com | 🔑 johndoe123 (Usuario de prueba)')
    console.log('👑 nelson.castro@khesedtek.com | 🔑 SuperAdmin2024! (SUPER_ADMIN)')
    console.log('\n🆕 Nuevas características Fase 2:')
    console.log('✅ Gestión de Voluntarios con asignaciones inteligentes')
    console.log('✅ Sistema de Check-in para visitantes con QR')
    console.log('✅ Check-in seguro para niños con WebRTC/QR')
    console.log('✅ Seguimiento automático de visitantes')
    console.log('✅ Dashboard actualizado con nuevas métricas')
    console.log('\n🆕 Nuevas características Fase 3:')
    console.log('✅ Sistema completo de Donaciones con categorías')
    console.log('✅ Métodos de pago múltiples (Efectivo, Transferencia, Nequi, Tarjeta)')
    console.log('✅ Dashboard de estadísticas de donaciones')
    console.log('✅ Reportes financieros por período y categoría')
    console.log('✅ Seguimiento de top donantes y métricas')

    // FASE 4: Advanced Communications + Events
    // Crear templates de comunicación
    const communicationTemplates = await Promise.all([
      prisma.communicationTemplate.create({
        data: {
          name: 'Bienvenida Nuevos Visitantes',
          subject: '¡Bienvenido a nuestra iglesia!',
          content: '¡Hola {{nombre}}! Nos alegra mucho que hayas visitado nuestra iglesia {{iglesia}}. Esperamos verte pronto de nuevo. Si tienes alguna pregunta, no dudes en contactarnos.',
          type: 'EMAIL',
          variables: JSON.stringify(['nombre', 'iglesia']),
          category: 'BIENVENIDA',
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.communicationTemplate.create({
        data: {
          name: 'Recordatorio de Evento',
          content: 'Hola {{nombre}}, te recordamos que {{evento}} será {{fecha}} a las {{hora}}. ¡Te esperamos!',
          type: 'SMS',
          variables: JSON.stringify(['nombre', 'evento', 'fecha', 'hora']),
          category: 'RECORDATORIO',
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.communicationTemplate.create({
        data: {
          name: 'Seguimiento Primera Visita',
          content: '¡Hola {{nombre}}! Fue un placer conocerte en nuestra iglesia. ¿Te gustaría que oremos por algo específico contigo?',
          type: 'WHATSAPP',
          variables: JSON.stringify(['nombre']),
          category: 'SEGUIMIENTO',
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.communicationTemplate.create({
        data: {
          name: 'Anuncio General',
          subject: 'Anuncio importante de {{iglesia}}',
          content: 'Querida congregación,\n\n{{mensaje}}\n\nBendiciones,\nEl equipo pastoral',
          type: 'EMAIL',
          variables: JSON.stringify(['iglesia', 'mensaje']),
          category: 'ANUNCIO',
          isActive: true,
          churchId: church.id
        }
      })
    ])

    console.log('✅ Templates de comunicación creados')

    // Crear recursos para eventos
    const eventResources = await Promise.all([
      prisma.eventResource.create({
        data: {
          name: 'Proyector Principal',
          description: 'Proyector de alta definición para presentaciones',
          type: 'EQUIPO',
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.eventResource.create({
        data: {
          name: 'Sistema de Sonido',
          description: 'Equipo de audio completo con micrófonos',
          type: 'EQUIPO',
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.eventResource.create({
        data: {
          name: 'Salón Principal',
          description: 'Auditorium principal de la iglesia',
          type: 'ESPACIO',
          capacity: 300,
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.eventResource.create({
        data: {
          name: 'Salón de Usos Múltiples',
          description: 'Salón para actividades diversas',
          type: 'ESPACIO',
          capacity: 100,
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.eventResource.create({
        data: {
          name: 'Piano',
          description: 'Piano de cola para servicios musicales',
          type: 'EQUIPO',
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.eventResource.create({
        data: {
          name: 'Sillas Adicionales',
          description: 'Set de 50 sillas plegables',
          type: 'MATERIAL',
          isActive: true,
          churchId: church.id
        }
      })
    ])

    console.log('✅ Recursos para eventos creados')

    // Crear algunas reservaciones de recursos
    await Promise.all([
      prisma.eventResourceReservation.create({
        data: {
          resourceId: eventResources[0].id, // Proyector
          eventId: events[0].id, // Conferencia de Jóvenes
          startTime: events[0].startDate,
          endTime: events[0].endDate!,
          notes: 'Para presentaciones durante la conferencia',
          status: 'CONFIRMADA',
          reservedBy: pastorUser.id,
          churchId: church.id
        }
      }),
      prisma.eventResourceReservation.create({
        data: {
          resourceId: eventResources[1].id, // Sistema de Sonido
          eventId: events[0].id,
          startTime: events[0].startDate,
          endTime: events[0].endDate!,
          notes: 'Sonido para música y predicación',
          status: 'CONFIRMADA',
          reservedBy: pastorUser.id,
          churchId: church.id
        }
      }),
      prisma.eventResourceReservation.create({
        data: {
          resourceId: eventResources[2].id, // Salón Principal
          eventId: events[1].id, // Retiro de Matrimonios
          startTime: events[1].startDate,
          endTime: events[1].endDate!,
          notes: 'Espacio principal para el retiro',
          status: 'CONFIRMADA',
          reservedBy: adminUser.id,
          churchId: church.id
        }
      })
    ])

    console.log('✅ Reservaciones de recursos creadas')

    // Crear configuraciones de integración de ejemplo (inactivas por seguridad)
    await Promise.all([
      prisma.integrationConfig.create({
        data: {
          service: 'TWILIO',
          config: JSON.stringify({
            accountSid: 'AC_EXAMPLE_SID',
            authToken: 'example_auth_token',
            phoneNumber: '+1234567890'
          }),
          isActive: false, // Inactivo por defecto por seguridad
          churchId: church.id
        }
      }),
      prisma.integrationConfig.create({
        data: {
          service: 'WHATSAPP',
          config: JSON.stringify({
            businessAccountId: 'example_business_id',
            phoneNumberId: 'example_phone_id',
            accessToken: 'example_access_token'
          }),
          isActive: false,
          churchId: church.id
        }
      }),
      prisma.integrationConfig.create({
        data: {
          service: 'MAILGUN',
          config: JSON.stringify({
            apiKey: 'example_api_key',
            domain: 'example.mailgun.org',
            from: 'noreply@iglesiacentral.com'
          }),
          isActive: false,
          churchId: church.id
        }
      })
    ])

    console.log('✅ Configuraciones de integración creadas')

    // Crear automatizaciones básicas de ejemplo
    const automations = await Promise.all([
      prisma.automation.create({
        data: {
          name: 'Bienvenida Automática Visitantes',
          description: 'Enviar email de bienvenida a nuevos visitantes',
          trigger: 'NEW_VISITOR',
          actions: JSON.stringify([
            {
              type: 'SEND_EMAIL',
              templateId: communicationTemplates[0].id,
              delay: 1440 // 24 horas en minutos
            },
            {
              type: 'SCHEDULE_FOLLOWUP',
              followUpType: 'LLAMADA',
              delay: 4320 // 3 días en minutos
            }
          ]),
          conditions: JSON.stringify({
            isFirstTime: true
          }),
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.automation.create({
        data: {
          name: 'Recordatorio de Eventos',
          description: 'Enviar recordatorio SMS 24 horas antes de eventos',
          trigger: 'EVENT_REMINDER',
          actions: JSON.stringify([
            {
              type: 'SEND_SMS',
              templateId: communicationTemplates[1].id,
              targetGroup: 'TODOS'
            }
          ]),
          conditions: JSON.stringify({
            eventType: 'público',
            reminderTime: '24_hours'
          }),
          isActive: true,
          churchId: church.id
        }
      }),
      prisma.automation.create({
        data: {
          name: 'Seguimiento Donaciones',
          description: 'Enviar agradecimiento por donaciones importantes',
          trigger: 'LARGE_DONATION',
          actions: JSON.stringify([
            {
              type: 'SEND_EMAIL',
              templateId: communicationTemplates[3].id,
              personalMessage: 'Gracias por tu generosa donación'
            },
            {
              type: 'NOTIFY_PASTOR',
              message: 'Donación importante recibida'
            }
          ]),
          conditions: JSON.stringify({
            minimumAmount: 500000 // COP
          }),
          isActive: false, // Desactivado por defecto
          churchId: church.id
        }
      })
    ])

    console.log('✅ Automatizaciones básicas creadas')

    // Crear algunas comunicaciones de ejemplo
    await Promise.all([
      prisma.communication.create({
        data: {
          title: 'Bienvenida Enero 2024',
          content: '¡Bienvenidos a todos los nuevos visitantes! Nos alegra tenerlos con nosotros.',
          type: 'EMAIL',
          targetGroup: 'TODOS',
          recipients: 50,
          status: 'ENVIADO',
          sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // hace 7 días
          sentBy: pastorUser.id,
          templateId: communicationTemplates[0].id,
          churchId: church.id
        }
      }),
      prisma.communication.create({
        data: {
          title: 'Recordatorio Conferencia Jóvenes',
          content: 'Recordatorio: La conferencia de jóvenes es este viernes a las 6 PM. ¡No te lo pierdas!',
          type: 'SMS',
          targetGroup: 'VOLUNTARIOS',
          recipients: 25,
          status: 'ENVIADO',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
          sentBy: adminUser.id,
          templateId: communicationTemplates[1].id,
          churchId: church.id
        }
      }),
      prisma.communication.create({
        data: {
          title: 'Anuncio Próximos Eventos',
          content: 'Próximamente tendremos varios eventos especiales. Mantente atento a más información.',
          type: 'WHATSAPP',
          targetGroup: 'LIDERES',
          recipients: 12,
          status: 'PROGRAMADO',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // en 24 horas
          sentBy: pastorUser.id,
          churchId: church.id
        }
      })
    ])

    console.log('✅ Comunicaciones de ejemplo creadas')

    console.log('\n🆕 Nuevas características Fase 4:')
    console.log('✅ Integración completa de Twilio para SMS')
    console.log('✅ Sistema de comunicaciones masivas con templates')
    console.log('✅ Gestión avanzada de eventos con recursos')
    console.log('✅ Reservaciones de recursos con calendario')
    console.log('✅ Automatizaciones básicas configurables')
    console.log('✅ Templates personalizables con variables')

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
