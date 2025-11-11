/**
 * ✅ SECURITY: Comprehensive Input Validation Schemas
 *
 * This file contains Zod validation schemas for all API endpoints
 * to prevent injection attacks and ensure data integrity.
 *
 * Security Features:
 * - Input sanitization and validation
 * - SQL injection prevention
 * - XSS attack prevention
 * - Data type enforcement
 * - Length and format restrictions
 */
import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    remember: z.ZodOptional<z.ZodBoolean>;
    churchSlug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    churchSlug: string;
    remember?: boolean | undefined;
}, {
    email: string;
    password: string;
    churchSlug: string;
    remember?: boolean | undefined;
}>;
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    churchId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    churchId?: string | undefined;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    churchId?: string | undefined;
}>, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    churchId?: string | undefined;
}, {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    churchId?: string | undefined;
}>;
export declare const passwordResetSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const passwordChangeSchema: z.ZodEffects<z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
}, {
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
}>, {
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
}, {
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
}>;
export declare const prayerRequestSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    categoryId: z.ZodString;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
    isUrgent: z.ZodDefault<z.ZodBoolean>;
    contactId: z.ZodOptional<z.ZodString>;
    expectedDuration: z.ZodOptional<z.ZodEnum<["short", "medium", "long"]>>;
    followUpRequested: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    categoryId: string;
    isAnonymous: boolean;
    isUrgent: boolean;
    followUpRequested: boolean;
    contactId?: string | undefined;
    expectedDuration?: "medium" | "long" | "short" | undefined;
}, {
    description: string;
    title: string;
    categoryId: string;
    isAnonymous?: boolean | undefined;
    contactId?: string | undefined;
    isUrgent?: boolean | undefined;
    expectedDuration?: "medium" | "long" | "short" | undefined;
    followUpRequested?: boolean | undefined;
}>;
export declare const prayerRequestUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "fulfilled"]>>;
    isAnonymous: z.ZodOptional<z.ZodBoolean>;
    isUrgent: z.ZodOptional<z.ZodBoolean>;
    expectedDuration: z.ZodOptional<z.ZodEnum<["short", "medium", "long"]>>;
    followUpRequested: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    status?: "rejected" | "fulfilled" | "pending" | "approved" | undefined;
    title?: string | undefined;
    categoryId?: string | undefined;
    isAnonymous?: boolean | undefined;
    isUrgent?: boolean | undefined;
    expectedDuration?: "medium" | "long" | "short" | undefined;
    followUpRequested?: boolean | undefined;
}, {
    description?: string | undefined;
    status?: "rejected" | "fulfilled" | "pending" | "approved" | undefined;
    title?: string | undefined;
    categoryId?: string | undefined;
    isAnonymous?: boolean | undefined;
    isUrgent?: boolean | undefined;
    expectedDuration?: "medium" | "long" | "short" | undefined;
    followUpRequested?: boolean | undefined;
}>;
export declare const prayerRequestApprovalSchema: z.ZodObject<{
    approved: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
    modifications: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    approved: boolean;
    reason?: string | undefined;
    modifications?: string | undefined;
}, {
    approved: boolean;
    reason?: string | undefined;
    modifications?: string | undefined;
}>;
export declare const prayerSchema: z.ZodObject<{
    prayerRequestId: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prayerRequestId: string;
    note?: string | undefined;
}, {
    prayerRequestId: string;
    note?: string | undefined;
}>;
export declare const prayerUpdateSchema: z.ZodObject<{
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    note?: string | undefined;
}, {
    note?: string | undefined;
}>;
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    preferredContact: z.ZodDefault<z.ZodEnum<["email", "phone", "whatsapp", "sms"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    preferredContact: "phone" | "email" | "whatsapp" | "sms";
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
}, {
    name: string;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
    preferredContact?: "phone" | "email" | "whatsapp" | "sms" | undefined;
}>;
export declare const contactUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    preferredContact: z.ZodOptional<z.ZodDefault<z.ZodEnum<["email", "phone", "whatsapp", "sms"]>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
    preferredContact?: "phone" | "email" | "whatsapp" | "sms" | undefined;
}, {
    name?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
    preferredContact?: "phone" | "email" | "whatsapp" | "sms" | undefined;
}>;
export declare const categorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    color: z.ZodDefault<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    color: string;
    sortOrder: number;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    isActive?: boolean | undefined;
    color?: string | undefined;
    sortOrder?: number | undefined;
}>;
export declare const categoryUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    color?: string | undefined;
    sortOrder?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    color?: string | undefined;
    sortOrder?: number | undefined;
}>;
export declare const responseTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    content: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    variables: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    content: string;
    variables?: string[] | undefined;
    categoryId?: string | undefined;
}, {
    name: string;
    content: string;
    isActive?: boolean | undefined;
    variables?: string[] | undefined;
    categoryId?: string | undefined;
}>;
export declare const responseTemplateUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    variables: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    content?: string | undefined;
    variables?: string[] | undefined;
    categoryId?: string | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    content?: string | undefined;
    variables?: string[] | undefined;
    categoryId?: string | undefined;
}>;
export declare const memberSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    birthDate: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<["male", "female", "other"]>>;
    maritalStatus: z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed"]>>;
    membershipDate: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["active", "inactive", "visitor"]>>;
    role: z.ZodDefault<z.ZodEnum<["member", "leader", "pastor", "admin"]>>;
    address: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "inactive" | "visitor";
    firstName: string;
    lastName: string;
    role: "member" | "leader" | "pastor" | "admin";
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
    birthDate?: string | undefined;
    membershipDate?: string | undefined;
    maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
    gender?: "other" | "male" | "female" | undefined;
}, {
    firstName: string;
    lastName: string;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    status?: "active" | "inactive" | "visitor" | undefined;
    notes?: string | undefined;
    birthDate?: string | undefined;
    membershipDate?: string | undefined;
    maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
    gender?: "other" | "male" | "female" | undefined;
    role?: "member" | "leader" | "pastor" | "admin" | undefined;
}>;
export declare const memberUpdateSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    birthDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    gender: z.ZodOptional<z.ZodOptional<z.ZodEnum<["male", "female", "other"]>>>;
    maritalStatus: z.ZodOptional<z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed"]>>>;
    membershipDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["active", "inactive", "visitor"]>>>;
    role: z.ZodOptional<z.ZodDefault<z.ZodEnum<["member", "leader", "pastor", "admin"]>>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    status?: "active" | "inactive" | "visitor" | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    notes?: string | undefined;
    birthDate?: string | undefined;
    membershipDate?: string | undefined;
    maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
    gender?: "other" | "male" | "female" | undefined;
    role?: "member" | "leader" | "pastor" | "admin" | undefined;
}, {
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    status?: "active" | "inactive" | "visitor" | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    notes?: string | undefined;
    birthDate?: string | undefined;
    membershipDate?: string | undefined;
    maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
    gender?: "other" | "male" | "female" | undefined;
    role?: "member" | "leader" | "pastor" | "admin" | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
    limit: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
}, {
    limit?: string | undefined;
    page?: string | undefined;
}>;
export declare const searchSchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["all", "active", "inactive", "pending", "approved", "rejected"]>>;
    category: z.ZodDefault<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<["name", "date", "status", "category"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    status: "rejected" | "active" | "inactive" | "all" | "pending" | "approved";
    category: string;
    sortBy: "name" | "status" | "category" | "date";
    sortOrder: "asc" | "desc";
    q?: string | undefined;
}, {
    status?: "rejected" | "active" | "inactive" | "all" | "pending" | "approved" | undefined;
    category?: string | undefined;
    sortBy?: "name" | "status" | "category" | "date" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    q?: string | undefined;
}>;
export declare const analyticsQuerySchema: z.ZodObject<{
    days: z.ZodDefault<z.ZodNullable<z.ZodEffects<z.ZodString, number, string>>>;
    category: z.ZodDefault<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["all", "pending", "approved", "rejected", "fulfilled"]>>;
    contactMethod: z.ZodDefault<z.ZodEnum<["all", "email", "phone", "whatsapp", "sms"]>>;
}, "strip", z.ZodTypeAny, {
    status: "rejected" | "fulfilled" | "all" | "pending" | "approved";
    category: string;
    days: number | null;
    contactMethod: "phone" | "email" | "all" | "whatsapp" | "sms";
}, {
    status?: "rejected" | "fulfilled" | "all" | "pending" | "approved" | undefined;
    category?: string | undefined;
    days?: string | null | undefined;
    contactMethod?: "phone" | "email" | "all" | "whatsapp" | "sms" | undefined;
}>;
export declare const fileUploadSchema: z.ZodObject<{
    filename: z.ZodString;
    mimetype: z.ZodEnum<["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]>;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    size: number;
    filename: string;
    mimetype: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "application/pdf" | "text/csv" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}, {
    size: number;
    filename: string;
    mimetype: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "application/pdf" | "text/csv" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}>;
export declare const churchConfigSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    language: z.ZodDefault<z.ZodEnum<["es", "en"]>>;
    currency: z.ZodDefault<z.ZodEnum<["CRC", "USD", "EUR"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    currency: "USD" | "EUR" | "CRC";
    slug: string;
    language: "es" | "en";
    timezone: string;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    website?: string | undefined;
}, {
    name: string;
    slug: string;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    website?: string | undefined;
    currency?: "USD" | "EUR" | "CRC" | undefined;
    language?: "es" | "en" | undefined;
    timezone?: string | undefined;
}>;
export declare const churchConfigUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    website: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    timezone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    language: z.ZodOptional<z.ZodDefault<z.ZodEnum<["es", "en"]>>>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["CRC", "USD", "EUR"]>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    website?: string | undefined;
    currency?: "USD" | "EUR" | "CRC" | undefined;
    slug?: string | undefined;
    language?: "es" | "en" | undefined;
    timezone?: string | undefined;
}, {
    name?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    website?: string | undefined;
    currency?: "USD" | "EUR" | "CRC" | undefined;
    slug?: string | undefined;
    language?: "es" | "en" | undefined;
    timezone?: string | undefined;
}>;
export declare const spiritualAssessmentSchema: z.ZodObject<{
    memberId: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["initial", "annual", "special"]>>;
    responses: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    notes: z.ZodOptional<z.ZodString>;
    assessorId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "initial" | "annual" | "special";
    memberId: string;
    responses: Record<string, string | number | boolean>;
    notes?: string | undefined;
    assessorId?: string | undefined;
}, {
    memberId: string;
    responses: Record<string, string | number | boolean>;
    type?: "initial" | "annual" | "special" | undefined;
    notes?: string | undefined;
    assessorId?: string | undefined;
}>;
export declare const spiritualAssessmentUpdateSchema: z.ZodObject<{
    memberId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodDefault<z.ZodEnum<["initial", "annual", "special"]>>>;
    responses: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    assessorId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type?: "initial" | "annual" | "special" | undefined;
    memberId?: string | undefined;
    notes?: string | undefined;
    responses?: Record<string, string | number | boolean> | undefined;
    assessorId?: string | undefined;
}, {
    type?: "initial" | "annual" | "special" | undefined;
    memberId?: string | undefined;
    notes?: string | undefined;
    responses?: Record<string, string | number | boolean> | undefined;
    assessorId?: string | undefined;
}>;
/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export declare function sanitizeHtml(input: string): string;
/**
 * Validates UUID format
 */
export declare function isValidUUID(uuid: string): boolean;
/**
 * Sanitizes search query to prevent injection
 */
export declare function sanitizeSearchQuery(query: string): string;
/**
 * Validates and sanitizes file path
 */
export declare function sanitizeFilePath(path: string): string;
/**
 * Rate limiting validation helper
 */
export declare function validateRateLimitWindow(window: string): boolean;
declare const _default: {
    loginSchema: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        remember: z.ZodOptional<z.ZodBoolean>;
        churchSlug: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        churchSlug: string;
        remember?: boolean | undefined;
    }, {
        email: string;
        password: string;
        churchSlug: string;
        remember?: boolean | undefined;
    }>;
    registerSchema: z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
        churchId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        churchId?: string | undefined;
    }, {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        churchId?: string | undefined;
    }>, {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        churchId?: string | undefined;
    }, {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        churchId?: string | undefined;
    }>;
    passwordResetSchema: z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>;
    passwordChangeSchema: z.ZodEffects<z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
        confirmPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        confirmPassword: string;
        currentPassword: string;
        newPassword: string;
    }, {
        confirmPassword: string;
        currentPassword: string;
        newPassword: string;
    }>, {
        confirmPassword: string;
        currentPassword: string;
        newPassword: string;
    }, {
        confirmPassword: string;
        currentPassword: string;
        newPassword: string;
    }>;
    prayerRequestSchema: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        categoryId: z.ZodString;
        isAnonymous: z.ZodDefault<z.ZodBoolean>;
        isUrgent: z.ZodDefault<z.ZodBoolean>;
        contactId: z.ZodOptional<z.ZodString>;
        expectedDuration: z.ZodOptional<z.ZodEnum<["short", "medium", "long"]>>;
        followUpRequested: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        categoryId: string;
        isAnonymous: boolean;
        isUrgent: boolean;
        followUpRequested: boolean;
        contactId?: string | undefined;
        expectedDuration?: "medium" | "long" | "short" | undefined;
    }, {
        description: string;
        title: string;
        categoryId: string;
        isAnonymous?: boolean | undefined;
        contactId?: string | undefined;
        isUrgent?: boolean | undefined;
        expectedDuration?: "medium" | "long" | "short" | undefined;
        followUpRequested?: boolean | undefined;
    }>;
    prayerRequestUpdateSchema: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "fulfilled"]>>;
        isAnonymous: z.ZodOptional<z.ZodBoolean>;
        isUrgent: z.ZodOptional<z.ZodBoolean>;
        expectedDuration: z.ZodOptional<z.ZodEnum<["short", "medium", "long"]>>;
        followUpRequested: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        status?: "rejected" | "fulfilled" | "pending" | "approved" | undefined;
        title?: string | undefined;
        categoryId?: string | undefined;
        isAnonymous?: boolean | undefined;
        isUrgent?: boolean | undefined;
        expectedDuration?: "medium" | "long" | "short" | undefined;
        followUpRequested?: boolean | undefined;
    }, {
        description?: string | undefined;
        status?: "rejected" | "fulfilled" | "pending" | "approved" | undefined;
        title?: string | undefined;
        categoryId?: string | undefined;
        isAnonymous?: boolean | undefined;
        isUrgent?: boolean | undefined;
        expectedDuration?: "medium" | "long" | "short" | undefined;
        followUpRequested?: boolean | undefined;
    }>;
    prayerRequestApprovalSchema: z.ZodObject<{
        approved: z.ZodBoolean;
        reason: z.ZodOptional<z.ZodString>;
        modifications: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        approved: boolean;
        reason?: string | undefined;
        modifications?: string | undefined;
    }, {
        approved: boolean;
        reason?: string | undefined;
        modifications?: string | undefined;
    }>;
    prayerSchema: z.ZodObject<{
        prayerRequestId: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        prayerRequestId: string;
        note?: string | undefined;
    }, {
        prayerRequestId: string;
        note?: string | undefined;
    }>;
    prayerUpdateSchema: z.ZodObject<{
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        note?: string | undefined;
    }, {
        note?: string | undefined;
    }>;
    contactSchema: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        preferredContact: z.ZodDefault<z.ZodEnum<["email", "phone", "whatsapp", "sms"]>>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        preferredContact: "phone" | "email" | "whatsapp" | "sms";
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        notes?: string | undefined;
    }, {
        name: string;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        notes?: string | undefined;
        preferredContact?: "phone" | "email" | "whatsapp" | "sms" | undefined;
    }>;
    contactUpdateSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        preferredContact: z.ZodOptional<z.ZodDefault<z.ZodEnum<["email", "phone", "whatsapp", "sms"]>>>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        notes?: string | undefined;
        preferredContact?: "phone" | "email" | "whatsapp" | "sms" | undefined;
    }, {
        name?: string | undefined;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        notes?: string | undefined;
        preferredContact?: "phone" | "email" | "whatsapp" | "sms" | undefined;
    }>;
    categorySchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        color: z.ZodDefault<z.ZodString>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        isActive: boolean;
        color: string;
        sortOrder: number;
        description?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        isActive?: boolean | undefined;
        color?: string | undefined;
        sortOrder?: number | undefined;
    }>;
    categoryUpdateSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        color: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        color?: string | undefined;
        sortOrder?: number | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        isActive?: boolean | undefined;
        color?: string | undefined;
        sortOrder?: number | undefined;
    }>;
    responseTemplateSchema: z.ZodObject<{
        name: z.ZodString;
        content: z.ZodString;
        categoryId: z.ZodOptional<z.ZodString>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        variables: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        isActive: boolean;
        content: string;
        variables?: string[] | undefined;
        categoryId?: string | undefined;
    }, {
        name: string;
        content: string;
        isActive?: boolean | undefined;
        variables?: string[] | undefined;
        categoryId?: string | undefined;
    }>;
    responseTemplateUpdateSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        variables: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        isActive?: boolean | undefined;
        content?: string | undefined;
        variables?: string[] | undefined;
        categoryId?: string | undefined;
    }, {
        name?: string | undefined;
        isActive?: boolean | undefined;
        content?: string | undefined;
        variables?: string[] | undefined;
        categoryId?: string | undefined;
    }>;
    memberSchema: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        birthDate: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodEnum<["male", "female", "other"]>>;
        maritalStatus: z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed"]>>;
        membershipDate: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["active", "inactive", "visitor"]>>;
        role: z.ZodDefault<z.ZodEnum<["member", "leader", "pastor", "admin"]>>;
        address: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "active" | "inactive" | "visitor";
        firstName: string;
        lastName: string;
        role: "member" | "leader" | "pastor" | "admin";
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        notes?: string | undefined;
        birthDate?: string | undefined;
        membershipDate?: string | undefined;
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        gender?: "other" | "male" | "female" | undefined;
    }, {
        firstName: string;
        lastName: string;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        status?: "active" | "inactive" | "visitor" | undefined;
        notes?: string | undefined;
        birthDate?: string | undefined;
        membershipDate?: string | undefined;
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        gender?: "other" | "male" | "female" | undefined;
        role?: "member" | "leader" | "pastor" | "admin" | undefined;
    }>;
    memberUpdateSchema: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        birthDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        gender: z.ZodOptional<z.ZodOptional<z.ZodEnum<["male", "female", "other"]>>>;
        maritalStatus: z.ZodOptional<z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed"]>>>;
        membershipDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["active", "inactive", "visitor"]>>>;
        role: z.ZodOptional<z.ZodDefault<z.ZodEnum<["member", "leader", "pastor", "admin"]>>>;
        address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        status?: "active" | "inactive" | "visitor" | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        notes?: string | undefined;
        birthDate?: string | undefined;
        membershipDate?: string | undefined;
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        gender?: "other" | "male" | "female" | undefined;
        role?: "member" | "leader" | "pastor" | "admin" | undefined;
    }, {
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        status?: "active" | "inactive" | "visitor" | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        notes?: string | undefined;
        birthDate?: string | undefined;
        membershipDate?: string | undefined;
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        gender?: "other" | "male" | "female" | undefined;
        role?: "member" | "leader" | "pastor" | "admin" | undefined;
    }>;
    paginationSchema: z.ZodObject<{
        page: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
    }, {
        limit?: string | undefined;
        page?: string | undefined;
    }>;
    searchSchema: z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["all", "active", "inactive", "pending", "approved", "rejected"]>>;
        category: z.ZodDefault<z.ZodString>;
        sortBy: z.ZodDefault<z.ZodEnum<["name", "date", "status", "category"]>>;
        sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "rejected" | "active" | "inactive" | "all" | "pending" | "approved";
        category: string;
        sortBy: "name" | "status" | "category" | "date";
        sortOrder: "asc" | "desc";
        q?: string | undefined;
    }, {
        status?: "rejected" | "active" | "inactive" | "all" | "pending" | "approved" | undefined;
        category?: string | undefined;
        sortBy?: "name" | "status" | "category" | "date" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        q?: string | undefined;
    }>;
    analyticsQuerySchema: z.ZodObject<{
        days: z.ZodDefault<z.ZodNullable<z.ZodEffects<z.ZodString, number, string>>>;
        category: z.ZodDefault<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["all", "pending", "approved", "rejected", "fulfilled"]>>;
        contactMethod: z.ZodDefault<z.ZodEnum<["all", "email", "phone", "whatsapp", "sms"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "rejected" | "fulfilled" | "all" | "pending" | "approved";
        category: string;
        days: number | null;
        contactMethod: "phone" | "email" | "all" | "whatsapp" | "sms";
    }, {
        status?: "rejected" | "fulfilled" | "all" | "pending" | "approved" | undefined;
        category?: string | undefined;
        days?: string | null | undefined;
        contactMethod?: "phone" | "email" | "all" | "whatsapp" | "sms" | undefined;
    }>;
    fileUploadSchema: z.ZodObject<{
        filename: z.ZodString;
        mimetype: z.ZodEnum<["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]>;
        size: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        size: number;
        filename: string;
        mimetype: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "application/pdf" | "text/csv" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }, {
        size: number;
        filename: string;
        mimetype: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "application/pdf" | "text/csv" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }>;
    churchConfigSchema: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodString;
        address: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        timezone: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodEnum<["es", "en"]>>;
        currency: z.ZodDefault<z.ZodEnum<["CRC", "USD", "EUR"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        currency: "USD" | "EUR" | "CRC";
        slug: string;
        language: "es" | "en";
        timezone: string;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        website?: string | undefined;
    }, {
        name: string;
        slug: string;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        website?: string | undefined;
        currency?: "USD" | "EUR" | "CRC" | undefined;
        language?: "es" | "en" | undefined;
        timezone?: string | undefined;
    }>;
    churchConfigUpdateSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        website: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        timezone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        language: z.ZodOptional<z.ZodDefault<z.ZodEnum<["es", "en"]>>>;
        currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["CRC", "USD", "EUR"]>>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        website?: string | undefined;
        currency?: "USD" | "EUR" | "CRC" | undefined;
        slug?: string | undefined;
        language?: "es" | "en" | undefined;
        timezone?: string | undefined;
    }, {
        name?: string | undefined;
        address?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        website?: string | undefined;
        currency?: "USD" | "EUR" | "CRC" | undefined;
        slug?: string | undefined;
        language?: "es" | "en" | undefined;
        timezone?: string | undefined;
    }>;
    spiritualAssessmentSchema: z.ZodObject<{
        memberId: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["initial", "annual", "special"]>>;
        responses: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        notes: z.ZodOptional<z.ZodString>;
        assessorId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "initial" | "annual" | "special";
        memberId: string;
        responses: Record<string, string | number | boolean>;
        notes?: string | undefined;
        assessorId?: string | undefined;
    }, {
        memberId: string;
        responses: Record<string, string | number | boolean>;
        type?: "initial" | "annual" | "special" | undefined;
        notes?: string | undefined;
        assessorId?: string | undefined;
    }>;
    spiritualAssessmentUpdateSchema: z.ZodObject<{
        memberId: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodDefault<z.ZodEnum<["initial", "annual", "special"]>>>;
        responses: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        assessorId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        type?: "initial" | "annual" | "special" | undefined;
        memberId?: string | undefined;
        notes?: string | undefined;
        responses?: Record<string, string | number | boolean> | undefined;
        assessorId?: string | undefined;
    }, {
        type?: "initial" | "annual" | "special" | undefined;
        memberId?: string | undefined;
        notes?: string | undefined;
        responses?: Record<string, string | number | boolean> | undefined;
        assessorId?: string | undefined;
    }>;
    sanitizeHtml: typeof sanitizeHtml;
    isValidUUID: typeof isValidUUID;
    sanitizeSearchQuery: typeof sanitizeSearchQuery;
    sanitizeFilePath: typeof sanitizeFilePath;
    validateRateLimitWindow: typeof validateRateLimitWindow;
};
export default _default;
//# sourceMappingURL=validation-schemas.d.ts.map