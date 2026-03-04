import { z } from 'zod';
export declare const createCheckInSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    isFirstTime: z.ZodDefault<z.ZodBoolean>;
    visitReason: z.ZodOptional<z.ZodString>;
    prayer_requests: z.ZodOptional<z.ZodString>;
    eventId: z.ZodOptional<z.ZodString>;
    visitorType: z.ZodOptional<z.ZodEnum<["FIRST_TIME", "RETURN", "MINISTRY_INTEREST", "PRAYER_REQUEST"]>>;
    ministryInterest: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    ageGroup: z.ZodOptional<z.ZodEnum<["CHILDREN", "YOUTH", "ADULTS", "SENIORS"]>>;
    familyStatus: z.ZodOptional<z.ZodEnum<["SINGLE", "MARRIED", "FAMILY_WITH_KIDS"]>>;
    referredBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    isFirstTime: boolean;
    ministryInterest: string[];
    email?: string | undefined;
    phone?: string | undefined;
    prayer_requests?: string | undefined;
    visitReason?: string | undefined;
    eventId?: string | undefined;
    visitorType?: "FIRST_TIME" | "RETURN" | "MINISTRY_INTEREST" | "PRAYER_REQUEST" | undefined;
    ageGroup?: "CHILDREN" | "YOUTH" | "ADULTS" | "SENIORS" | undefined;
    familyStatus?: "FAMILY_WITH_KIDS" | "SINGLE" | "MARRIED" | undefined;
    referredBy?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    email?: string | undefined;
    phone?: string | undefined;
    prayer_requests?: string | undefined;
    isFirstTime?: boolean | undefined;
    visitReason?: string | undefined;
    eventId?: string | undefined;
    visitorType?: "FIRST_TIME" | "RETURN" | "MINISTRY_INTEREST" | "PRAYER_REQUEST" | undefined;
    ministryInterest?: string[] | undefined;
    ageGroup?: "CHILDREN" | "YOUTH" | "ADULTS" | "SENIORS" | undefined;
    familyStatus?: "FAMILY_WITH_KIDS" | "SINGLE" | "MARRIED" | undefined;
    referredBy?: string | undefined;
}>;
export declare const getCheckInsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    isFirstTime: z.ZodOptional<z.ZodBoolean>;
    eventId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    startDate?: string | undefined;
    endDate?: string | undefined;
    isFirstTime?: boolean | undefined;
    eventId?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
    isFirstTime?: boolean | undefined;
    eventId?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=check-in.d.ts.map