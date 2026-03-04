"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDonationSchema = exports.getDonationsSchema = exports.DonationStatus = void 0;
const zod_1 = require("zod");
exports.DonationStatus = zod_1.z.enum(['COMPLETADA', 'PENDIENTE', 'FALLIDA', 'REEMBOLSADA']);
exports.getDonationsSchema = zod_1.z.object({
    categoryId: zod_1.z.string().uuid().optional(),
    paymentMethodId: zod_1.z.string().uuid().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    status: exports.DonationStatus.optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
});
exports.createDonationSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('El monto debe ser mayor a 0'),
    currency: zod_1.z.string().length(3).default('COP'),
    donorName: zod_1.z.string().min(2, 'El nombre del donante es requerido').optional(),
    donorEmail: zod_1.z.string().email('Email inválido').optional(),
    donorPhone: zod_1.z.string().optional(),
    memberId: zod_1.z.string().uuid().optional(),
    categoryId: zod_1.z.string().uuid('ID de categoría inválido'),
    paymentMethodId: zod_1.z.string().uuid('ID de método de pago inválido'),
    reference: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    isAnonymous: zod_1.z.boolean().default(false),
    status: exports.DonationStatus.default('COMPLETADA'),
    donationDate: zod_1.z.string().datetime().optional(),
    campaignId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=donation.js.map