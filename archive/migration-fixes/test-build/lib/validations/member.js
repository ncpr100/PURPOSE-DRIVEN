"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberSchema = exports.createMemberSchema = void 0;
const zod_1 = require("zod");
exports.createMemberSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'El nombre es requerido'),
    lastName: zod_1.z.string().min(2, 'El apellido es requerido'),
    email: zod_1.z.string().email('Email inválido').optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    zipCode: zod_1.z.string().optional(),
    birthDate: zod_1.z.string().datetime().optional(),
    baptismDate: zod_1.z.string().datetime().optional(),
    membershipDate: zod_1.z.string().datetime().optional(),
    maritalStatus: zod_1.z.enum(['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'UNION_LIBRE']).optional(),
    gender: zod_1.z.enum(['MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR']).optional(),
    occupation: zod_1.z.string().optional(),
    photo: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().optional(),
    ministryId: zod_1.z.string().uuid().optional(),
    spiritualGifts: zod_1.z.array(zod_1.z.string()).optional(),
    secondaryGifts: zod_1.z.array(zod_1.z.string()).optional(),
    spiritualCalling: zod_1.z.string().optional(),
    ministryPassion: zod_1.z.array(zod_1.z.string()).optional(),
    experienceLevel: zod_1.z.number().int().min(1).max(10).optional(),
    leadershipReadiness: zod_1.z.number().int().min(1).max(10).optional(),
    skillsMatrix: zod_1.z.record(zod_1.z.any()).optional(),
    personalityType: zod_1.z.string().optional(),
    transportationOwned: zod_1.z.boolean().optional(),
    childcareAvailable: zod_1.z.boolean().optional(),
    emergencyContact: zod_1.z.string().optional(),
});
exports.updateMemberSchema = exports.createMemberSchema.partial();
//# sourceMappingURL=member.js.map