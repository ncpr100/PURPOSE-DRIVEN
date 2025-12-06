import { z } from 'zod';
export declare const DonationStatus: z.ZodEnum<["COMPLETADA", "PENDIENTE", "FALLIDA", "REEMBOLSADA"]>;
export declare const getDonationsSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["COMPLETADA", "PENDIENTE", "FALLIDA", "REEMBOLSADA"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    startDate?: string | undefined;
    endDate?: string | undefined;
    status?: "PENDIENTE" | "COMPLETADA" | "FALLIDA" | "REEMBOLSADA" | undefined;
    categoryId?: string | undefined;
    paymentMethodId?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
    status?: "PENDIENTE" | "COMPLETADA" | "FALLIDA" | "REEMBOLSADA" | undefined;
    categoryId?: string | undefined;
    paymentMethodId?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
export declare const createDonationSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    donorName: z.ZodOptional<z.ZodString>;
    donorEmail: z.ZodOptional<z.ZodString>;
    donorPhone: z.ZodOptional<z.ZodString>;
    memberId: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    paymentMethodId: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
    status: z.ZodDefault<z.ZodEnum<["COMPLETADA", "PENDIENTE", "FALLIDA", "REEMBOLSADA"]>>;
    donationDate: z.ZodOptional<z.ZodString>;
    campaignId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDIENTE" | "COMPLETADA" | "FALLIDA" | "REEMBOLSADA";
    amount: number;
    currency: string;
    isAnonymous: boolean;
    categoryId: string;
    paymentMethodId: string;
    reference?: string | undefined;
    notes?: string | undefined;
    memberId?: string | undefined;
    donorName?: string | undefined;
    donorEmail?: string | undefined;
    donorPhone?: string | undefined;
    donationDate?: string | undefined;
    campaignId?: string | undefined;
}, {
    amount: number;
    categoryId: string;
    paymentMethodId: string;
    status?: "PENDIENTE" | "COMPLETADA" | "FALLIDA" | "REEMBOLSADA" | undefined;
    currency?: string | undefined;
    reference?: string | undefined;
    notes?: string | undefined;
    isAnonymous?: boolean | undefined;
    memberId?: string | undefined;
    donorName?: string | undefined;
    donorEmail?: string | undefined;
    donorPhone?: string | undefined;
    donationDate?: string | undefined;
    campaignId?: string | undefined;
}>;
//# sourceMappingURL=donation.d.ts.map