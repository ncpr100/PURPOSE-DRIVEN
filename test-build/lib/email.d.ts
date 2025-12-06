/// <reference types="react" />
export declare const EMAIL_CONFIG: {
    from: string;
    fromName: string;
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    isDevelopment: boolean;
};
export interface EmailData {
    to: string;
    subject: string;
    html: string;
    text?: string;
    churchName?: string;
    userName?: string;
}
export interface NotificationEmailData {
    user: {
        email: string;
        name?: string;
    };
    churches: {
        name: string;
        id: string;
    };
    notification: {
        title: string;
        message: string;
        type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
        category?: string;
        priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
        actionUrl?: string;
        actionLabel?: string;
        createdAt: string;
    };
}
export interface DigestEmailData {
    user: {
        email: string;
        name?: string;
    };
    churches: {
        name: string;
        id: string;
    };
    notifications: Array<{
        title: string;
        message: string;
        type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
        category?: string;
        priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
        actionUrl?: string;
        actionLabel?: string;
        createdAt: string;
    }>;
    period: 'DAILY' | 'WEEKLY';
    date: string;
}
export declare function sendEmail(emailData: EmailData): Promise<boolean>;
export declare function renderEmailTemplate(component: React.ReactElement): string;
export declare function getEmailSubjectPrefix(type: string, priority: string): string;
export declare function formatChurchEmailSignature(churchName: string): string;
declare class EmailQueue {
    private queue;
    private processing;
    add(emailData: EmailData): Promise<void>;
    addBulk(emails: EmailData[]): Promise<void>;
    private process;
    getQueueLength(): number;
}
export declare const emailQueue: EmailQueue;
export declare function shouldSendEmailNotification(preferences: any, notificationType: string, currentTime?: Date): boolean;
export declare function shouldSendDigest(preferences: any, period: 'DAILY' | 'WEEKLY'): boolean;
export declare function getDigestSchedule(period: 'DAILY' | 'WEEKLY'): Date;
export {};
//# sourceMappingURL=email.d.ts.map