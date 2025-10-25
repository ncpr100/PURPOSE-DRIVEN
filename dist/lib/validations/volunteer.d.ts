/// <reference types="node" />
import { z } from 'zod';
/**
 * Validation schema for creating/updating volunteers
 * Addresses CRITICAL-004: Missing Input Validation
 */
export declare const volunteerCreateSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    skills: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    availability: z.ZodOptional<z.ZodObject<{
        days: z.ZodOptional<z.ZodArray<z.ZodEnum<["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]>, "many">>;
        times: z.ZodOptional<z.ZodArray<z.ZodEnum<["morning", "afternoon", "evening"]>, "many">>;
        frequency: z.ZodOptional<z.ZodEnum<["weekly", "biweekly", "monthly", "occasional"]>>;
    }, "strip", z.ZodTypeAny, {
        frequency?: "weekly" | "biweekly" | "monthly" | "occasional" | undefined;
        days?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[] | undefined;
        times?: ("morning" | "afternoon" | "evening")[] | undefined;
    }, {
        frequency?: "weekly" | "biweekly" | "monthly" | "occasional" | undefined;
        days?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[] | undefined;
        times?: ("morning" | "afternoon" | "evening")[] | undefined;
    }>>;
    ministryId: z.ZodUnion<[z.ZodEffects<z.ZodString, string, string>, z.ZodLiteral<"no-ministry">]>;
    memberId: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    ministryId: string;
    skills: string[];
    phone?: string | undefined;
    email?: string | undefined;
    memberId?: string | undefined;
    availability?: {
        frequency?: "weekly" | "biweekly" | "monthly" | "occasional" | undefined;
        days?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[] | undefined;
        times?: ("morning" | "afternoon" | "evening")[] | undefined;
    } | undefined;
}, {
    firstName: string;
    lastName: string;
    ministryId: string;
    phone?: string | undefined;
    email?: string | undefined;
    memberId?: string | undefined;
    skills?: string[] | undefined;
    availability?: {
        frequency?: "weekly" | "biweekly" | "monthly" | "occasional" | undefined;
        days?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[] | undefined;
        times?: ("morning" | "afternoon" | "evening")[] | undefined;
    } | undefined;
}>;
export type VolunteerCreateInput = z.infer<typeof volunteerCreateSchema>;
/**
 * Validation schema for volunteer assignments
 * Addresses HIGH-012: No Scheduling Conflict Detection (validation layer)
 */
export declare const volunteerAssignmentSchema: z.ZodEffects<z.ZodObject<{
    volunteerId: z.ZodEffects<z.ZodString, string, string>;
    eventId: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    startTime: string;
    endTime: string;
    date: string | Date;
    volunteerId: string;
    description?: string | undefined;
    eventId?: string | undefined;
    notes?: string | undefined;
}, {
    title: string;
    startTime: string;
    endTime: string;
    date: string | Date;
    volunteerId: string;
    description?: string | undefined;
    eventId?: string | undefined;
    notes?: string | undefined;
}>, {
    title: string;
    startTime: string;
    endTime: string;
    date: string | Date;
    volunteerId: string;
    description?: string | undefined;
    eventId?: string | undefined;
    notes?: string | undefined;
}, {
    title: string;
    startTime: string;
    endTime: string;
    date: string | Date;
    volunteerId: string;
    description?: string | undefined;
    eventId?: string | undefined;
    notes?: string | undefined;
}>;
export type VolunteerAssignmentInput = z.infer<typeof volunteerAssignmentSchema>;
/**
 * Validation schema for spiritual profile assessment
 * Addresses HIGH-003: JSON Fields Lack Schema Validation
 */
export declare const spiritualProfileSchema: z.ZodObject<{
    memberId: z.ZodEffects<z.ZodString, string, string>;
    primaryGifts: z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">;
    secondaryGifts: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">>>;
    spiritualCalling: z.ZodOptional<z.ZodString>;
    ministryPassions: z.ZodArray<z.ZodString, "many">;
    experienceLevel: z.ZodDefault<z.ZodNumber>;
    leadershipScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    servingMotivation: z.ZodOptional<z.ZodString>;
    previousExperience: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        ministry: z.ZodString;
        role: z.ZodString;
        duration: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }, {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }>, "many">>>;
    trainingCompleted: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        course: z.ZodString;
        date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        certificate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }, {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    memberId: string;
    secondaryGifts: string[];
    experienceLevel: number;
    primaryGifts: string[];
    ministryPassions: string[];
    leadershipScore: number;
    previousExperience: {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }[];
    trainingCompleted: {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }[];
    spiritualCalling?: string | undefined;
    servingMotivation?: string | undefined;
}, {
    memberId: string;
    primaryGifts: string[];
    ministryPassions: string[];
    secondaryGifts?: string[] | undefined;
    spiritualCalling?: string | undefined;
    experienceLevel?: number | undefined;
    leadershipScore?: number | undefined;
    servingMotivation?: string | undefined;
    previousExperience?: {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }[] | undefined;
    trainingCompleted?: {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }[] | undefined;
}>;
export type SpiritualProfileInput = z.infer<typeof spiritualProfileSchema>;
/**
 * Validation schema for enhanced spiritual assessment
 * Includes all scoring fields for leadership readiness calculation
 */
export declare const enhancedSpiritualProfileSchema: z.ZodObject<z.objectUtil.extendShape<{
    memberId: z.ZodEffects<z.ZodString, string, string>;
    primaryGifts: z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">;
    secondaryGifts: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">>>;
    spiritualCalling: z.ZodOptional<z.ZodString>;
    ministryPassions: z.ZodArray<z.ZodString, "many">;
    experienceLevel: z.ZodDefault<z.ZodNumber>;
    leadershipScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    servingMotivation: z.ZodOptional<z.ZodString>;
    previousExperience: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        ministry: z.ZodString;
        role: z.ZodString;
        duration: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }, {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }>, "many">>>;
    trainingCompleted: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        course: z.ZodString;
        date: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        certificate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }, {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }>, "many">>>;
}, {
    spiritualMaturityScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    leadershipAptitudeScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    ministryPassionScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    availabilityScore: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    teachingAbility: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    pastoralHeart: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    organizationalSkills: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    communicationSkills: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    leadershipTrainingCompleted: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    leadershipTrainingDate: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>>;
    mentoringExperience: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    discipleshipTraining: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}>, "strip", z.ZodTypeAny, {
    memberId: string;
    secondaryGifts: string[];
    experienceLevel: number;
    availabilityScore: number;
    primaryGifts: string[];
    ministryPassions: string[];
    leadershipScore: number;
    previousExperience: {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }[];
    trainingCompleted: {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }[];
    spiritualMaturityScore: number;
    leadershipAptitudeScore: number;
    ministryPassionScore: number;
    teachingAbility: number;
    pastoralHeart: number;
    organizationalSkills: number;
    communicationSkills: number;
    leadershipTrainingCompleted: boolean;
    mentoringExperience: boolean;
    discipleshipTraining: boolean;
    spiritualCalling?: string | undefined;
    servingMotivation?: string | undefined;
    leadershipTrainingDate?: string | Date | null | undefined;
}, {
    memberId: string;
    primaryGifts: string[];
    ministryPassions: string[];
    secondaryGifts?: string[] | undefined;
    spiritualCalling?: string | undefined;
    experienceLevel?: number | undefined;
    availabilityScore?: number | undefined;
    leadershipScore?: number | undefined;
    servingMotivation?: string | undefined;
    previousExperience?: {
        ministry: string;
        role: string;
        duration: string;
        description?: string | undefined;
    }[] | undefined;
    trainingCompleted?: {
        date: string | Date;
        course: string;
        certificate?: string | undefined;
    }[] | undefined;
    spiritualMaturityScore?: number | undefined;
    leadershipAptitudeScore?: number | undefined;
    ministryPassionScore?: number | undefined;
    teachingAbility?: number | undefined;
    pastoralHeart?: number | undefined;
    organizationalSkills?: number | undefined;
    communicationSkills?: number | undefined;
    leadershipTrainingCompleted?: boolean | undefined;
    leadershipTrainingDate?: string | Date | null | undefined;
    mentoringExperience?: boolean | undefined;
    discipleshipTraining?: boolean | undefined;
}>;
export type EnhancedSpiritualProfileInput = z.infer<typeof enhancedSpiritualProfileSchema>;
/**
 * Validation schema for volunteer matching requests
 */
export declare const volunteerMatchingSchema: z.ZodObject<{
    ministryId: z.ZodEffects<z.ZodString, string, string>;
    eventId: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    maxRecommendations: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    ministryId: string;
    maxRecommendations: number;
    eventId?: string | undefined;
}, {
    ministryId: string;
    eventId?: string | undefined;
    maxRecommendations?: number | undefined;
}>;
export type VolunteerMatchingInput = z.infer<typeof volunteerMatchingSchema>;
/**
 * Validation schema for pagination parameters
 * Addresses HIGH-005, HIGH-013: Missing Pagination
 */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    sortOrder: "asc" | "desc";
    page: number;
    sortBy?: string | undefined;
}, {
    sortBy?: string | undefined;
    limit?: number | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: number | undefined;
}>;
export type PaginationInput = z.infer<typeof paginationSchema>;
/**
 * Helper function to parse pagination from URL search params
 */
export declare function parsePaginationParams(searchParams: URLSearchParams): PaginationInput;
//# sourceMappingURL=volunteer.d.ts.map