// 📋 SMART TEMPLATES & PRESET FIELDS DEFINITIONS
// Extracted from branded-form-builder.tsx to reduce bundle size

export const SMART_TEMPLATES = [
  {
    id: 'simple-visitor-tracking',
    name: 'Visitante Básico',
    description: 'Información esencial de contacto para nuevos visitantes', 
    icon: 'Sparkles',
    category: 'Visitantes',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: false },
      { 
        id: 'source', 
        label: '¿Cómo se enteró de nuestra iglesia?', 
        type: 'select', 
        required: false,
        options: ['Facebook', 'Instagram', 'YouTube', 'Amigo/Familiar', 'Google', 'Pasando por aquí', 'Otro']
      }
    ]
  },
  {
    id: 'visitor-source-tracking',
    name: 'Rastreo de Fuentes de Visitantes',
    description: 'Formulario completo para conocer cómo llegaron los visitantes',
    icon: 'BarChart3',
    category: 'Visitantes',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: false },
      { 
        id: 'source', 
        label: '¿Cómo se enteró de nuestra iglesia?', 
        type: 'select', 
        required: true,
        options: ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Google', 'Sitio Web', 'Amigo/Familiar', 'Volante', 'Radio/TV', 'Pasando por aquí', 'Evento especial', 'Otro']
      },
      { id: 'visit_reason', label: 'Motivo de la visita', type: 'textarea', required: false }
    ]
  },
  {
    id: 'social-media-engagement',
    name: 'Interacción Redes Sociales',
    description: 'Para eventos específicos o campañas digitales',
    icon: 'Share2',
    category: 'Marketing',
    fields: [
      { id: 'name', label: 'Nombre', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      {
        id: 'social_platform',
        label: '¿En qué red social nos sigues?',
        type: 'select',
        required: true,
        options: ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'LinkedIn', 'Twitter/X', 'WhatsApp', 'No uso redes sociales']
      },
      {
        id: 'content_interest',
        label: '¿Qué contenido te interesa más?',
        type: 'select',
        required: false,
        options: ['Sermones', 'Música/Adoración', 'Testimonios', 'Eventos', 'Estudios bíblicos', 'Contenido juvenil', 'Familia', 'Oración']
      },
      { id: 'comments', label: 'Comentarios adicionales', type: 'textarea', required: false }
    ]
  },
  {
    id: 'prayer-request-form',
    name: 'Solicitud de Oración',
    description: 'Para recopilar peticiones de oración de la congregación',
    icon: 'Heart',
    category: 'Ministerial',
    fields: [
      { id: 'name', label: 'Nombre (opcional)', type: 'text', required: false },
      { id: 'email', label: 'Email para seguimiento', type: 'email', required: false },
      { id: 'prayer_request', label: 'Petición de oración', type: 'textarea', required: true },
      {
        id: 'prayer_type',
        label: 'Tipo de oración',
        type: 'select',
        required: false,
        options: ['Sanidad', 'Familia', 'Trabajo', 'Finanzas', 'Decisiones importantes', 'Agradecimiento', 'Otro']
      },
      {
        id: 'is_public',
        label: '¿Puede ser compartida públicamente?',
        type: 'select',
        required: true,
        options: ['Sí, pueden orar por mí públicamente', 'No, prefiero que sea privada']
      }
    ]
  },
  {
    id: 'event-registration',
    name: 'Registro de Eventos',
    description: 'Para inscripciones a eventos, conferencias y actividades',
    icon: 'Calendar',
    category: 'Eventos',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: true },
      {
        id: 'attendance_type',
        label: '¿Cómo planeas asistir?',
        type: 'select',
        required: true,
        options: ['Presencial', 'Virtual', 'Aún no estoy seguro']
      },
      { id: 'dietary_restrictions', label: 'Restricciones alimentarias', type: 'text', required: false },
      { id: 'emergency_contact', label: 'Contacto de emergencia', type: 'text', required: false },
      { id: 'comments', label: 'Comentarios adicionales', type: 'textarea', required: false }
    ]
  },
  {
    id: 'volunteer-application',
    name: 'Aplicación de Voluntarios', 
    description: 'Para personas interesadas en servir en ministerios',
    icon: 'Users',
    category: 'Voluntarios',
    fields: [
      { id: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: true },
      {
        id: 'ministry_interest',
        label: '¿En qué ministerio te gustaría servir?',
        type: 'select',
        required: true,
        options: ['Niños', 'Jóvenes', 'Música/Adoración', 'Técnico/Sonido', 'Ujieres', 'Limpieza', 'Cocina', 'Evangelismo', 'Oración', 'Administración']
      },
      {
        id: 'availability',
        label: 'Disponibilidad',
        type: 'select',
        required: true,
        options: ['Domingos mañana', 'Domingos tarde', 'Entre semana', 'Fines de semana', 'Eventos especiales', 'Flexible']
      },
      { id: 'experience', label: 'Experiencia previa', type: 'textarea', required: false },
      { id: 'skills', label: 'Habilidades especiales', type: 'textarea', required: false }
    ]
  },
  {
    id: 'testimonial-submission',
    name: 'Envío de Testimonio',
    description: 'Para compartir testimonios de fe y experiencias',
    icon: 'HandHeart',
    category: 'Testimonios',
    fields: [
      { id: 'name', label: 'Nombre', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: false },
      { id: 'testimony', label: 'Mi testimonio', type: 'textarea', required: true },
      {
        id: 'testimony_category',
        label: 'Categoría del testimonio',
        type: 'select',
        required: false,
        options: ['Salvación', 'Sanidad', 'Provisión financiera', 'Restauración familiar', 'Crecimiento espiritual', 'Superación de adicciones', 'Otro']
      },
      {
        id: 'can_share',
        label: '¿Podemos compartir tu testimonio?',
        type: 'select',
        required: true,
        options: ['Sí, pueden usarlo públicamente', 'Solo para pastores/líderes', 'Prefiero mantenerlo privado']
      }
    ]
  },
  {
    id: 'spiritual-assessment-public',
    name: 'Evaluación Espiritual Pública',
    description: 'Para miembros sin acceso al sistema - evaluación completa',
    icon: 'Heart',
    category: 'Evaluaciones',
    fields: [
      { id: 'firstName', label: 'Nombre', type: 'text', required: true },
      { id: 'lastName', label: 'Apellido', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: true },
      {
        id: 'spiritual_gifts',
        label: 'Dones Espirituales (selecciona los que sientes que tienes)',
        type: 'select',
        required: false,
        options: ['Liderazgo', 'Enseñanza', 'Evangelismo', 'Pastor/Cuidado', 'Misericordia', 'Servicio', 'Administración', 'Dar/Generosidad', 'Fe', 'Sanidad', 'Discernimiento', 'Lenguas/Interpretación']
      },
      {
        id: 'ministry_passions',
        label: '¿Qué ministerios te apasionan más?',
        type: 'select',
        required: false,
        options: ['Niños', 'Jóvenes', 'Familia', 'Matrimonios', 'Adultos Mayores', 'Evangelismo', 'Discipulado', 'Música/Adoración', 'Tecnología', 'Administración', 'Cuidado Pastoral', 'Misiones']
      },
      {
        id: 'experience_level',
        label: 'Nivel de experiencia en ministerio',
        type: 'select',
        required: false,
        options: ['Novato - Recién comenzando', 'Intermedio - Alguna experiencia', 'Avanzado - Mucha experiencia']
      },
      { id: 'spiritual_calling', label: '¿Sientes algún llamado específico de Dios en tu vida?', type: 'textarea', required: false },
      { id: 'availability_comments', label: 'Comentarios sobre tu disponibilidad', type: 'textarea', required: false }
    ]
  },
  {
    id: 'volunteer-availability-public',
    name: 'Disponibilidad de Voluntarios',
    description: 'Para reclutar voluntarios externos sin acceso al sistema',
    icon: 'Users',
    category: 'Voluntarios',
    fields: [
      { id: 'firstName', label: 'Nombre', type: 'text', required: true },
      { id: 'lastName', label: 'Apellido', type: 'text', required: true },
      { id: 'email', label: 'Correo Electrónico', type: 'email', required: true },
      { id: 'phone', label: 'Teléfono', type: 'text', required: true },
      {
        id: 'ministry_interests',
        label: '¿En qué ministerios te gustaría participar?',
        type: 'select',
        required: false,
        options: ['Niños', 'Música/Adoración', 'Técnico/Audiovisual', 'Ujieres/Recepción', 'Limpieza/Mantenimiento', 'Cocina/Hospitalidad', 'Evangelismo', 'Grupos Pequeños', 'Jóvenes', 'Administración']
      },
      {
        id: 'skills_talents',
        label: 'Habilidades y talentos especiales',
        type: 'select',
        required: false,
        options: ['Música/Canto', 'Tecnología/Computación', 'Diseño/Arte', 'Carpintería/Reparaciones', 'Cocina', 'Enseñanza', 'Contabilidad', 'Fotografía/Video', 'Deportes', 'Idiomas', 'Consejería', 'Otro']
      },
      {
        id: 'availability_days',
        label: 'Disponibilidad de tiempo',
        type: 'select',
        required: false,
        options: ['Domingo mañana', 'Domingo tarde/noche', 'Lunes a Viernes mañanas', 'Lunes a Viernes tardes', 'Sábados', 'Entre semana noches', 'Solo eventos especiales', 'Muy flexible']
      },
      {
        id: 'time_commitment',
        label: '¿Cuánto tiempo puedes dedicar semanalmente?',
        type: 'select',
        required: false,
        options: ['1-2 horas', '3-5 horas', '6-10 horas', '10+ horas']
      },
      {
        id: 'leadership_interest',
        label: 'Interés en posiciones de liderazgo',
        type: 'select',
        required: false,
        options: ['Muy interesado en liderar', 'Abierto a liderar eventualmente', 'Prefiero ayudar sin liderar']
      },
      { id: 'special_requirements', label: 'Requerimientos especiales o comentarios', type: 'textarea', required: false }
    ]
  }
]

export const PRESET_FIELDS = [
  // Contact Fields
  { id: 'name', label: 'Nombre', type: 'text', icon: 'Mail', category: 'Contacto' },
  { id: 'email', label: 'Email', type: 'email', icon: 'Mail', category: 'Contacto' },
  { id: 'phone', label: 'Teléfono', type: 'text', icon: 'Phone', category: 'Contacto' },
  { id: 'address', label: 'Dirección', type: 'text', icon: 'MapPin', category: 'Contacto' },
  
  // Social Media Tracking
  { 
    id: 'social_platform', 
    label: '¿Cómo nos conociste?', 
    type: 'select', 
    icon: 'Share2', 
    category: 'Redes Sociales',
    options: ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Google', 'Amigo/Familiar', 'Pasando por aquí', 'Volante', 'Radio/TV', 'Evento especial', 'Sitio web', 'Otro']
  },
  { 
    id: 'social_engagement', 
    label: '¿Nos sigues en redes sociales?', 
    type: 'select', 
    icon: 'Share2', 
    category: 'Redes Sociales',
    options: ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'LinkedIn', 'Twitter/X', 'WhatsApp', 'No uso redes sociales']
  },
  {
    id: 'content_preference',
    label: '¿Qué contenido prefieres?',
    type: 'select',
    icon: 'Share2',
    category: 'Redes Sociales',
    options: ['Sermones', 'Música/Adoración', 'Testimonios', 'Eventos', 'Estudios bíblicos', 'Contenido juvenil', 'Familia', 'Oración', 'Noticias de la iglesia']
  },

  // Demographics
  { 
    id: 'age_range', 
    label: 'Rango de edad', 
    type: 'select', 
    icon: 'MapPin', 
    category: 'Demográfico',
    options: ['13-17', '18-25', '26-35', '36-45', '46-55', '56-65', '65+']
  },
  { 
    id: 'gender', 
    label: 'Género', 
    type: 'select', 
    icon: 'MapPin', 
    category: 'Demográfico',
    options: ['Masculino', 'Femenino', 'Prefiero no decir']
  },
  { 
    id: 'marital_status', 
    label: 'Estado civil', 
    type: 'select', 
    icon: 'MapPin', 
    category: 'Demográfico',
    options: ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión libre']
  },
  { id: 'city', label: 'Ciudad', type: 'text', icon: 'MapPin', category: 'Demográfico' },
  { id: 'country', label: 'País', type: 'text', icon: 'MapPin', category: 'Demográfico' },
  { id: 'birthdate', label: 'Fecha de Nacimiento', type: 'date', icon: 'MapPin', category: 'Demográfico' },

  // Ministry & Interests
  { id: 'ministerios', label: 'Ministerios de Interés', type: 'text', icon: 'MapPin', category: 'Ministerio' },
  { id: 'disponibilidad', label: 'Disponibilidad', type: 'text', icon: 'MapPin', category: 'Ministerio' },
  { id: 'experiencia', label: 'Experiencia Previa', type: 'textarea', icon: 'MapPin', category: 'Ministerio' },
  { id: 'habilidades', label: 'Habilidades', type: 'text', icon: 'MapPin', category: 'Ministerio' },
  { id: 'intereses', label: 'Intereses', type: 'text', icon: 'MapPin', category: 'Ministerio' },

  // Text Fields
  { id: 'comentarios', label: 'Comentarios', type: 'textarea', icon: 'Mail', category: 'Texto' },
  { id: 'oracion', label: 'Peticiones de Oración', type: 'textarea', icon: 'Mail', category: 'Texto' },
  { id: 'necesidades', label: 'Necesidades', type: 'textarea', icon: 'Mail', category: 'Texto' },
  { id: 'testimonio', label: 'Testimonio', type: 'textarea', icon: 'Mail', category: 'Texto' },

  // Church-Specific
  { id: 'primera_vez', label: '¿Es su primera vez?', type: 'select', icon: 'MapPin', category: 'Iglesia', options: ['Sí', 'No'] },
  { id: 'instagram', label: 'Instagram', type: 'text', icon: 'Share2', category: 'Contacto' },
  { id: 'whatsapp', label: 'WhatsApp', type: 'text', icon: 'Phone', category: 'Contacto' }
]