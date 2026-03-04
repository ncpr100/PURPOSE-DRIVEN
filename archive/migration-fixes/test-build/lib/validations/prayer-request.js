"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrayerRequestsSchema = exports.createPrayerRequestSchema = exports.PrayerRequestPriority = exports.PrayerRequestStatus = void 0;
const zod_1 = require("zod");
exports.PrayerRequestStatus = zod_1.z.enum(['pending', 'approved', 'answered', 'rejected']);
exports.PrayerRequestPriority = zod_1.z.enum(['low', 'normal', 'high', 'urgent']);
exports.createPrayerRequestSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3, 'El nombre completo es requerido'),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email('Email inválido').optional(),
    categoryId: zod_1.z.string().uuid('ID de categoría inválido'),
    message: zod_1.z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
    preferredContact: zod_1.z.enum(['sms', 'email', 'phone_call']).default('sms'),
    isAnonymous: zod_1.z.boolean().default(false),
    priority: exports.PrayerRequestPriority.default('normal'),
    churchId: zod_1.z.string().uuid('ID de iglesia inválido'),
    formId: zod_1.z.string().uuid('ID de formulario inválido').optional(),
    qrCodeId: zod_1.z.string().uuid('ID de QR inválido').optional(),
}).refine(data => data.phone || data.email, {
    message: 'Se requiere al menos un teléfono o un email',
    path: ['phone'],
});
exports.getPrayerRequestsSchema = zod_1.z.object({
    status: exports.PrayerRequestStatus.optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    priority: exports.PrayerRequestPriority.optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
//# sourceMappingURL=prayer-request.js.map