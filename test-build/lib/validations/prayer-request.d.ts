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
    priority: "high" | "low" | "urgent" | "normal";
    message: string;
    isAnonymous: boolean;
    fullName: string;
    preferredContact: "email" | "sms" | "phone_call";
    categoryId: string;
    email?: string | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
    phone?: string | undefined;
}, {
    churchId: string;
    message: string;
    fullName: string;
    categoryId: string;
    email?: string | undefined;
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
    isAnonymous?: boolean | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
    phone?: string | undefined;
    preferredContact?: "email" | "sms" | "phone_call" | undefined;
}>, {
    churchId: string;
    priority: "high" | "low" | "urgent" | "normal";
    message: string;
    isAnonymous: boolean;
    fullName: string;
    preferredContact: "email" | "sms" | "phone_call";
    categoryId: string;
    email?: string | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
    phone?: string | undefined;
}, {
    churchId: string;
    message: string;
    fullName: string;
    categoryId: string;
    email?: string | undefined;
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
    isAnonymous?: boolean | undefined;
    formId?: string | undefined;
    qrCodeId?: string | undefined;
    phone?: string | undefined;
    preferredContact?: "email" | "sms" | "phone_call" | undefined;
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
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
    status?: "rejected" | "pending" | "approved" | "answered" | undefined;
    categoryId?: string | undefined;
}, {
    priority?: "high" | "low" | "urgent" | "normal" | undefined;
    status?: "rejected" | "pending" | "approved" | "answered" | undefined;
    categoryId?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=prayer-request.d.ts.map