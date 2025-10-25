"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckInsSchema = exports.createCheckInSchema = void 0;
const zod_1 = require("zod");
exports.createCheckInSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'El nombre es requerido'),
    lastName: zod_1.z.string().min(2, 'El apellido es requerido'),
    email: zod_1.z.string().email('Email inválido').optional(),
    phone: zod_1.z.string().optional(),
    isFirstTime: zod_1.z.boolean().default(false),
    visitReason: zod_1.z.string().optional(),
    prayerRequest: zod_1.z.string().optional(),
    eventId: zod_1.z.string().uuid().optional(),
    visitorType: zod_1.z.enum(['FIRST_TIME', 'RETURN', 'MINISTRY_INTEREST', 'PRAYER_REQUEST']).optional(),
    ministryInterest: zod_1.z.array(zod_1.z.string()).default([]),
    ageGroup: zod_1.z.enum(['CHILDREN', 'YOUTH', 'ADULTS', 'SENIORS']).optional(),
    familyStatus: zod_1.z.enum(['SINGLE', 'MARRIED', 'FAMILY_WITH_KIDS']).optional(),
    referredBy: zod_1.z.string().optional(),
});
exports.getCheckInsSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    isFirstTime: zod_1.z.coerce.boolean().optional(),
    eventId: zod_1.z.string().uuid().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
//# sourceMappingURL=check-in.js.map