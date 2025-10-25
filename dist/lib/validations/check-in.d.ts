import { z } from 'zod';
export declare const createCheckInSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    isFirstTime: z.ZodDefault<z.ZodBoolean>;
    visitReason: z.ZodOptional<z.ZodString>;
    prayerRequest: z.ZodOptional<z.ZodString>;
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
    phone?: string | undefined;
    email?: string | undefined;
    visitReason?: string | undefined;
    prayerRequest?: string | undefined;
    eventId?: string | undefined;
    visitorType?: "FIRST_TIME" | "RETURN" | "MINISTRY_INTEREST" | "PRAYER_REQUEST" | undefined;
    ageGroup?: "CHILDREN" | "YOUTH" | "ADULTS" | "SENIORS" | undefined;
    familyStatus?: "SINGLE" | "MARRIED" | "FAMILY_WITH_KIDS" | undefined;
    referredBy?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    email?: string | undefined;
    isFirstTime?: boolean | undefined;
    visitReason?: string | undefined;
    prayerRequest?: string | undefined;
    eventId?: string | undefined;
    visitorType?: "FIRST_TIME" | "RETURN" | "MINISTRY_INTEREST" | "PRAYER_REQUEST" | undefined;
    ministryInterest?: string[] | undefined;
    ageGroup?: "CHILDREN" | "YOUTH" | "ADULTS" | "SENIORS" | undefined;
    familyStatus?: "SINGLE" | "MARRIED" | "FAMILY_WITH_KIDS" | undefined;
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
    isFirstTime?: boolean | undefined;
    eventId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    isFirstTime?: boolean | undefined;
    eventId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=check-in.d.ts.map