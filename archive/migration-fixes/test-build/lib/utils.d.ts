import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare function formatDate(date: Date | string): string;
export declare function formatDateTime(date: Date | string): string;
export declare function truncateText(text: string, maxLength: number): string;
export declare function validateEmail(email: string): boolean;
export declare function validatePhone(phone: string): boolean;
export declare const roleTranslations: {
    SUPER_ADMIN: string;
    ADMIN_IGLESIA: string;
    PASTOR: string;
    LIDER: string;
    MIEMBRO: string;
};
export declare function translateRole(role: string): string;
//# sourceMappingURL=utils.d.ts.map