import { z } from 'zod';
export declare const PrayerRequestStatus: z.ZodEnum<["pending", "approved", "answered", "rejected"]>;
export declare const PrayerRequestPriority: z.ZodEnum<["low", "normal", "high", "urgent"]>;
export declare const createPrayerRequestSchema: z.ZodEffects<z.ZodObject<{
    fullName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    message: z.ZodString;
    preferredContact: z.ZodDefault<z.ZodEnum<["sms", "email", "phone_call"]>>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
    priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high", "urgent"]>>;
    churchId: z.ZodString;
    formId: z.ZodOptional<z.ZodString>;
    qrCodeId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    churchId: string;
    priority: "high" | "low" | "normal" | "urgent";
    categoryId: string;
    isAnonymous: boolean;
    message: string;
    fullName: string;
    preferredContact: "email" | "sms" | "phone_call";
    phone?: string | undefined;
    email?: string | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
}, {
    churchId: string;
    categoryId: string;
    message: string;
    fullName: string;
    phone?: string | undefined;
    email?: string | undefined;
    priority?: "high" | "low" | "normal" | "urgent" | undefined;
    isAnonymous?: boolean | undefined;
    preferredContact?: "email" | "sms" | "phone_call" | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
}>, {
    churchId: string;
    priority: "high" | "low" | "normal" | "urgent";
    categoryId: string;
    isAnonymous: boolean;
    message: string;
    fullName: string;
    preferredContact: "email" | "sms" | "phone_call";
    phone?: string | undefined;
    email?: string | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
}, {
    churchId: string;
    categoryId: string;
    message: string;
    fullName: string;
    phone?: string | undefined;
    email?: string | undefined;
    priority?: "high" | "low" | "normal" | "urgent" | undefined;
    isAnonymous?: boolean | undefined;
    preferredContact?: "email" | "sms" | "phone_call" | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
}>;
export declare const getPrayerRequestsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "answered", "rejected"]>>;
    categoryId: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["low", "normal", "high", "urgent"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "rejected" | "pending" | "approved" | "answered" | undefined;
    priority?: "high" | "low" | "normal" | "urgent" | undefined;
    categoryId?: string | undefined;
}, {
    status?: "rejected" | "pending" | "approved" | "answered" | undefined;
    priority?: "high" | "low" | "normal" | "urgent" | undefined;
    categoryId?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=prayer-request.d.ts.map