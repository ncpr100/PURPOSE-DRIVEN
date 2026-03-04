"use strict";
/**
 * SPIRITUAL GIFTS CONFIGURATION
 * Complete mapping of spiritual gifts, categories, and ministry alignments
 * Based on provided assessment form and strategic analysis
 *
 * @created October 18, 2024
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPIRITUAL_GIFTS_SUMMARY = exports.meetsExperienceRequirement = exports.getExperienceLevel = exports.getTotalSubcategories = exports.getCategoryIcon = exports.getCategoryColor = exports.getRelatedMinistries = exports.isLeadershipGift = exports.getLeadershipGifts = exports.getSubcategoriesByLeadership = exports.findCategory = exports.findSubcategory = exports.getAllSubcategories = exports.EXPERIENCE_LEVELS = exports.MINISTRY_PASSIONS = exports.SPIRITUAL_GIFT_CATEGORIES = void 0;
// ============================================================================
// 8 SPIRITUAL GIFT CATEGORIES (From Assessment Form)
// ============================================================================
exports.SPIRITUAL_GIFT_CATEGORIES = [
    {
        id: 'artistico',
        name: 'Artístico',
        icon: '🎨',
        color: 'from-purple-500 to-pink-500',
        description: 'Dones creativos y expresivos para la adoración y comunicación visual',
        subcategories: [
            {
                id: 'kelly-creatividad',
                name: 'Kelly y Creatividad',
                description: 'Diseño gráfico, arte visual, creatividad artística',
                relatedMinistries: ['diseno', 'multimedia', 'eventos', 'comunicaciones'],
                leadershipPotential: 'medium',
                skillKeywords: ['diseño', 'arte', 'creatividad', 'gráfico', 'visual', 'ilustración']
            },
            {
                id: 'musica',
                name: 'Música',
                description: 'Instrumentos musicales, canto, composición, dirección musical',
                relatedMinistries: ['adoracion', 'alabanza', 'multimedia', 'eventos'],
                leadershipPotential: 'high',
                skillKeywords: ['música', 'canto', 'instrumento', 'vocal', 'composición', 'dirección']
            },
            {
                id: 'danza',
                name: 'Danza',
                description: 'Expresión corporal, danza profética, coreografía',
                relatedMinistries: ['adoracion', 'eventos', 'jovenes'],
                leadershipPotential: 'medium',
                skillKeywords: ['danza', 'coreografía', 'expresión corporal', 'baile']
            },
            {
                id: 'diseno',
                name: 'Diseño',
                description: 'Diseño gráfico, diseño de espacios, decoración',
                relatedMinistries: ['diseno', 'multimedia', 'eventos', 'comunicaciones'],
                leadershipPotential: 'medium',
                skillKeywords: ['diseño', 'decoración', 'espacios', 'gráfico', 'branding']
            }
        ]
    },
    {
        id: 'comunicacion',
        name: 'Comunicación',
        icon: '💬',
        color: 'from-blue-500 to-cyan-500',
        description: 'Dones de proclamación, enseñanza y comunicación de la Palabra',
        subcategories: [
            {
                id: 'predicacion',
                name: 'Predicación',
                description: 'Proclamación de la Palabra, predicación expositiva, sermones',
                relatedMinistries: ['ensenanza', 'pastoral', 'evangelismo'],
                leadershipPotential: 'high',
                skillKeywords: ['predicación', 'sermón', 'homilética', 'oratoria', 'proclamación']
            },
            {
                id: 'profecia',
                name: 'Profecía',
                description: 'Palabra profética, discernimiento espiritual, revelación',
                relatedMinistries: ['oracion', 'pastoral', 'intercesion'],
                leadershipPotential: 'high',
                skillKeywords: ['profecía', 'profético', 'revelación', 'discernimiento']
            },
            {
                id: 'ensenanza',
                name: 'Enseñanza',
                description: 'Enseñanza bíblica, discipulado, educación cristiana',
                relatedMinistries: ['educacion', 'grupos-pequenos', 'discipulado', 'escuela-dominical'],
                leadershipPotential: 'high',
                skillKeywords: ['enseñanza', 'maestro', 'educación', 'instrucción', 'docente']
            },
            {
                id: 'evangelismo',
                name: 'Evangelismo',
                description: 'Compartir el evangelio, testimonio personal, evangelización',
                relatedMinistries: ['evangelismo', 'misiones', 'alcance', 'visitantes'],
                leadershipPotential: 'medium',
                skillKeywords: ['evangelismo', 'evangelización', 'testimonio', 'predicar', 'alcance']
            }
        ]
    },
    {
        id: 'equilibrar',
        name: 'Equilibrar',
        icon: '⚖️',
        color: 'from-green-500 to-teal-500',
        description: 'Dones de discernimiento, sabiduría y balance espiritual',
        subcategories: [
            {
                id: 'discernimiento',
                name: 'Discernimiento',
                description: 'Sabiduría espiritual, discernimiento de espíritus, consejo',
                relatedMinistries: ['consejeria', 'oracion', 'pastoral', 'liderazgo'],
                leadershipPotential: 'high',
                skillKeywords: ['discernimiento', 'sabiduría', 'consejo', 'dirección', 'prudencia']
            },
            {
                id: 'intercesion',
                name: 'Intercesión',
                description: 'Oración intercesora, guerra espiritual, vigilancia',
                relatedMinistries: ['oracion', 'intercesion', 'pastoral'],
                leadershipPotential: 'medium',
                skillKeywords: ['intercesión', 'oración', 'guerra espiritual', 'vigilancia', 'intercesor']
            }
        ]
    },
    {
        id: 'liderazgo',
        name: 'Liderazgo',
        icon: '👑',
        color: 'from-yellow-500 to-orange-500',
        description: 'Dones de liderazgo, administración y gestión de recursos',
        subcategories: [
            {
                id: 'administracion',
                name: 'Administración',
                description: 'Organización, planificación, gestión de recursos y proyectos',
                relatedMinistries: ['administracion', 'finanzas', 'operaciones', 'eventos'],
                leadershipPotential: 'high',
                skillKeywords: ['administración', 'organización', 'planificación', 'gestión', 'coordinación']
            },
            {
                id: 'liderazgo-vision',
                name: 'Liderazgo',
                description: 'Visión estratégica, dirección de equipos, inspiración',
                relatedMinistries: ['pastoral', 'liderazgo', 'multiples'],
                leadershipPotential: 'high',
                skillKeywords: ['liderazgo', 'visión', 'dirección', 'líder', 'estrategia', 'equipo']
            }
        ]
    },
    {
        id: 'ministerial',
        name: 'Ministerial',
        icon: '🙏',
        color: 'from-indigo-500 to-purple-500',
        description: 'Dones para ministerios específicos y grupos demográficos',
        subcategories: [
            {
                id: 'ministerio-familia',
                name: 'Ministerio y Familia',
                description: 'Trabajo con familias, matrimonios, consejería familiar',
                relatedMinistries: ['familias', 'matrimonios', 'consejeria', 'grupos-familiares'],
                leadershipPotential: 'medium',
                skillKeywords: ['familia', 'matrimonio', 'consejería familiar', 'parejas', 'hogar']
            },
            {
                id: 'trabajo-juvenil',
                name: 'Trabajo Juvenil',
                description: 'Ministerio con jóvenes, adolescentes y preadolescentes',
                relatedMinistries: ['jovenes', 'adolescentes', 'ninos', 'grupos-juveniles'],
                leadershipPotential: 'medium',
                skillKeywords: ['jóvenes', 'juventud', 'adolescentes', 'teens', 'preadolescentes']
            }
        ]
    },
    {
        id: 'relacional',
        name: 'Relacional',
        icon: '🤝',
        color: 'from-pink-500 to-rose-500',
        description: 'Dones de relaciones, cuidado pastoral y construcción de comunidad',
        subcategories: [
            {
                id: 'consejeria',
                name: 'Consejería',
                description: 'Acompañamiento pastoral, consejería bíblica, escucha activa',
                relatedMinistries: ['consejeria', 'cuidado-pastoral', 'grupos-pequenos'],
                leadershipPotential: 'medium',
                skillKeywords: ['consejería', 'acompañamiento', 'escucha', 'pastoral', 'orientación']
            },
            {
                id: 'misiones',
                name: 'Misiones',
                description: 'Misiones transculturales, alcance comunitario, evangelización',
                relatedMinistries: ['misiones', 'alcance', 'evangelismo', 'accion-social'],
                leadershipPotential: 'medium',
                skillKeywords: ['misiones', 'misionero', 'transcultural', 'alcance', 'comunidad']
            },
            {
                id: 'hospitalidad-relacional',
                name: 'Hospitalidad',
                description: 'Apertura relacional, construcción de comunidad, acogida',
                relatedMinistries: ['bienvenida', 'grupos-pequenos', 'eventos', 'visitantes'],
                leadershipPotential: 'low',
                skillKeywords: ['hospitalidad', 'acogida', 'comunidad', 'relaciones', 'conexión']
            }
        ]
    },
    {
        id: 'servicio',
        name: 'Servicio',
        icon: '❤️',
        color: 'from-red-500 to-pink-500',
        description: 'Dones prácticos de servicio, ayuda y compasión',
        subcategories: [
            {
                id: 'ayuda',
                name: 'Ayuda',
                description: 'Servicio práctico, apoyo logístico, asistencia',
                relatedMinistries: ['logistica', 'eventos', 'mantenimiento', 'operaciones'],
                leadershipPotential: 'low',
                skillKeywords: ['ayuda', 'apoyo', 'asistencia', 'logística', 'práctico']
            },
            {
                id: 'hospitalidad-servicio',
                name: 'Hospitalidad',
                description: 'Servicio de recepción, atención, preparación de alimentos',
                relatedMinistries: ['bienvenida', 'eventos', 'cocina', 'recepcion'],
                leadershipPotential: 'low',
                skillKeywords: ['hospitalidad', 'recepción', 'atención', 'servicio', 'cocina']
            },
            {
                id: 'misericordia',
                name: 'Misericordia',
                description: 'Compasión práctica, cuidado de necesitados, acción social',
                relatedMinistries: ['accion-social', 'cuidado-pastoral', 'benevolencia'],
                leadershipPotential: 'medium',
                skillKeywords: ['misericordia', 'compasión', 'cuidado', 'social', 'ayuda']
            },
            {
                id: 'servicio-general',
                name: 'Servicio',
                description: 'Servicio general, voluntariado, disponibilidad para servir',
                relatedMinistries: ['multiples', 'eventos', 'logistica'],
                leadershipPotential: 'low',
                skillKeywords: ['servicio', 'voluntario', 'servidor', 'disponible', 'ayudar']
            }
        ]
    },
    {
        id: 'tecnico',
        name: 'Técnico',
        icon: '🔧',
        color: 'from-gray-500 to-slate-500',
        description: 'Dones técnicos, tecnológicos y especializados',
        subcategories: [
            {
                id: 'construccion-digital',
                name: 'Construcción Digital',
                description: 'Programación, desarrollo web, aplicaciones, tecnología',
                relatedMinistries: ['tecnologia', 'multimedia', 'comunicaciones', 'web'],
                leadershipPotential: 'medium',
                skillKeywords: ['programación', 'desarrollo', 'web', 'tecnología', 'software', 'código']
            },
            {
                id: 'musica-audiovisual',
                name: 'Música Audiovisual',
                description: 'Audio profesional, video, producción, transmisión en vivo',
                relatedMinistries: ['multimedia', 'transmision', 'tecnologia', 'eventos'],
                leadershipPotential: 'medium',
                skillKeywords: ['audio', 'video', 'producción', 'transmisión', 'streaming', 'multimedia']
            },
            {
                id: 'tecnico-general',
                name: 'Técnico',
                description: 'Soporte técnico, mantenimiento, reparaciones',
                relatedMinistries: ['tecnologia', 'mantenimiento', 'operaciones'],
                leadershipPotential: 'low',
                skillKeywords: ['técnico', 'soporte', 'mantenimiento', 'reparación', 'instalación']
            }
        ]
    }
];
// ============================================================================
// MINISTRY PASSIONS (14 Options from Form)
// ============================================================================
exports.MINISTRY_PASSIONS = [
    {
        id: 'ninos-preescolares',
        name: 'Niños Preescolares',
        category: 'Niños',
        description: 'Ministerio con niños de 0-5 años'
    },
    {
        id: 'ninos',
        name: 'Niños',
        category: 'Niños',
        description: 'Ministerio con niños de 6-12 años'
    },
    {
        id: 'familia',
        name: 'Familia',
        category: 'Familia',
        description: 'Ministerio familiar, matrimonios, padres'
    },
    {
        id: 'evangelismo',
        name: 'Evangelismo',
        category: 'Alcance',
        description: 'Evangelización, testimonio, alcance'
    },
    {
        id: 'musica',
        name: 'Música',
        category: 'Adoración',
        description: 'Adoración musical, alabanza'
    },
    {
        id: 'administracion',
        name: 'Administración',
        category: 'Servicio',
        description: 'Administración, organización, gestión'
    },
    {
        id: 'hospitalidad',
        name: 'Hospitalidad',
        category: 'Servicio',
        description: 'Recepción, acogida, atención'
    },
    {
        id: 'ancianos-mayores',
        name: 'Ancianos Mayores',
        category: 'Grupos Demográficos',
        description: 'Ministerio con adultos mayores'
    },
    {
        id: 'educacion',
        name: 'Educación',
        category: 'Enseñanza',
        description: 'Educación cristiana, enseñanza'
    },
    {
        id: 'jovenes',
        name: 'Jóvenes',
        category: 'Grupos Demográficos',
        description: 'Ministerio juvenil, adolescentes'
    },
    {
        id: 'misiones',
        name: 'Misiones',
        category: 'Alcance',
        description: 'Misiones locales e internacionales'
    },
    {
        id: 'adultos-jovenes',
        name: 'Adultos Jóvenes',
        category: 'Grupos Demográficos',
        description: 'Ministerio con adultos jóvenes (18-35)'
    },
    {
        id: 'cuidado-pastoral',
        name: 'Cuidado Pastoral',
        category: 'Pastoral',
        description: 'Consejería, acompañamiento pastoral'
    },
    {
        id: 'medios',
        name: 'Medios',
        category: 'Comunicación',
        description: 'Medios de comunicación, redes sociales'
    }
];
// ============================================================================
// EXPERIENCE LEVELS (3 Levels from Form)
// ============================================================================
exports.EXPERIENCE_LEVELS = [
    {
        id: 'novato',
        value: 'NOVATO',
        name: 'Principiante',
        label: 'Nivel 1 (Principiante)',
        range: '0-2 años',
        yearsOfService: '0-2',
        description: 'Nuevo en el ministerio, comenzando a explorar dones y llamado'
    },
    {
        id: 'intermedio',
        value: 'INTERMEDIO',
        name: 'Intermedio',
        label: 'Nivel 2 (Intermedio)',
        range: '3-5 años',
        yearsOfService: '3-5',
        description: 'Experiencia activa en ministerio, desarrollando habilidades'
    },
    {
        id: 'avanzado',
        value: 'AVANZADO',
        name: 'Avanzado',
        label: 'Nivel 3 (Avanzado)',
        range: '6+ años',
        yearsOfService: '6+',
        description: 'Experiencia significativa, listo para mentorear y liderar'
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Get all subcategories across all categories
 */
function getAllSubcategories() {
    return exports.SPIRITUAL_GIFT_CATEGORIES.flatMap(category => category.subcategories);
}
exports.getAllSubcategories = getAllSubcategories;
/**
 * Find a subcategory by ID
 */
function findSubcategory(subcategoryId) {
    return getAllSubcategories().find(sub => sub.id === subcategoryId);
}
exports.findSubcategory = findSubcategory;
/**
 * Find a category by ID
 */
function findCategory(categoryId) {
    return exports.SPIRITUAL_GIFT_CATEGORIES.find(cat => cat.id === categoryId);
}
exports.findCategory = findCategory;
/**
 * Get subcategories by leadership potential
 */
function getSubcategoriesByLeadership(level) {
    return getAllSubcategories().filter(sub => sub.leadershipPotential === level);
}
exports.getSubcategoriesByLeadership = getSubcategoriesByLeadership;
/**
 * Get high leadership potential gifts
 */
function getLeadershipGifts() {
    return getSubcategoriesByLeadership('high');
}
exports.getLeadershipGifts = getLeadershipGifts;
/**
 * Check if a gift has high leadership potential
 */
function isLeadershipGift(subcategoryId) {
    const subcategory = findSubcategory(subcategoryId);
    return subcategory?.leadershipPotential === 'high';
}
exports.isLeadershipGift = isLeadershipGift;
/**
 * Get all ministry IDs that align with a gift
 */
function getRelatedMinistries(subcategoryId) {
    const subcategory = findSubcategory(subcategoryId);
    return subcategory?.relatedMinistries || [];
}
exports.getRelatedMinistries = getRelatedMinistries;
/**
 * Get category color classes for a subcategory
 */
function getCategoryColor(subcategoryId) {
    const allCategories = exports.SPIRITUAL_GIFT_CATEGORIES;
    for (const category of allCategories) {
        if (category.subcategories.some(sub => sub.id === subcategoryId)) {
            return category.color;
        }
    }
    return 'from-gray-500 to-slate-500'; // default
}
exports.getCategoryColor = getCategoryColor;
/**
 * Get category icon for a subcategory
 */
function getCategoryIcon(subcategoryId) {
    const allCategories = exports.SPIRITUAL_GIFT_CATEGORIES;
    for (const category of allCategories) {
        if (category.subcategories.some(sub => sub.id === subcategoryId)) {
            return category.icon;
        }
    }
    return '🎯'; // default
}
exports.getCategoryIcon = getCategoryIcon;
/**
 * Count total subcategories
 */
function getTotalSubcategories() {
    return getAllSubcategories().length;
}
exports.getTotalSubcategories = getTotalSubcategories;
/**
 * Get experience level by value
 */
function getExperienceLevel(value) {
    return exports.EXPERIENCE_LEVELS.find(level => level.value === value);
}
exports.getExperienceLevel = getExperienceLevel;
/**
 * Check if experience level meets minimum requirement
 */
function meetsExperienceRequirement(currentLevel, requiredLevel) {
    const levels = ['NOVATO', 'INTERMEDIO', 'AVANZADO'];
    const currentIndex = levels.indexOf(currentLevel);
    const requiredIndex = levels.indexOf(requiredLevel);
    return currentIndex >= requiredIndex;
}
exports.meetsExperienceRequirement = meetsExperienceRequirement;
// ============================================================================
// EXPORT SUMMARY
// ============================================================================
exports.SPIRITUAL_GIFTS_SUMMARY = {
    totalCategories: exports.SPIRITUAL_GIFT_CATEGORIES.length,
    totalSubcategories: getTotalSubcategories(),
    totalMinistryPassions: exports.MINISTRY_PASSIONS.length,
    totalExperienceLevels: exports.EXPERIENCE_LEVELS.length,
    highLeadershipGifts: getLeadershipGifts().length,
    categories: exports.SPIRITUAL_GIFT_CATEGORIES.map(cat => ({
        id: cat.id,
        name: cat.name,
        subcategoryCount: cat.subcategories.length
    }))
};
// Log configuration summary (development only)
if (process.env.NODE_ENV === 'development') {
    console.log('✅ Spiritual Gifts Configuration Loaded');
    console.log(`   📊 ${exports.SPIRITUAL_GIFTS_SUMMARY.totalCategories} categories`);
    console.log(`   🎯 ${exports.SPIRITUAL_GIFTS_SUMMARY.totalSubcategories} subcategories`);
    console.log(`   👑 ${exports.SPIRITUAL_GIFTS_SUMMARY.highLeadershipGifts} leadership gifts`);
    console.log(`   ❤️  ${exports.SPIRITUAL_GIFTS_SUMMARY.totalMinistryPassions} ministry passions`);
}
//# sourceMappingURL=spiritual-gifts-config.js.map