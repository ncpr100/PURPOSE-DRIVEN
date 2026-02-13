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
    message: string;
    priority: "high" | "low" | "urgent" | "normal";
    categoryId: string;
    isAnonymous: boolean;
    preferredContact: "email" | "sms" | "phone_call";
    fullName: string;
    email?: string | undefined;
    phone?: string | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
}, {
    churchId: string;
    message: string;
    categoryId: string;
    fullName: string;
    email?: string | undefined;
    phone?: string | undefined;
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
    isAnonymous?: boolean | undefined;
    preferredContact?: "email" | "sms" | "phone_call" | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
}>, {
    churchId: string;
    message: string;
    priority: "high" | "low" | "urgent" | "normal";
    categoryId: string;
    isAnonymous: boolean;
    preferredContact: "email" | "sms" | "phone_call";
    fullName: string;
    email?: string | undefined;
    phone?: string | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
}, {
    churchId: string;
    message: string;
    categoryId: string;
    fullName: string;
    email?: string | undefined;
    phone?: string | undefined;
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
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
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
    categoryId?: string | undefined;
}, {
    limit?: number | undefined;
    status?: "rejected" | "pending" | "approved" | "answered" | undefined;
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
    categoryId?: string | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=prayer-request.d.ts.map