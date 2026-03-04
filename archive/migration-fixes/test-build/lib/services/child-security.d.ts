export interface PhotoCaptureData {
    childPhoto: string;
    parentPhoto: string;
    childId: string;
    securityPin: string;
}
export interface PickupAttempt {
    timestamp: string;
    photoSubmitted: string;
    pinAttempt: string;
    success: boolean;
    attemptedBy: string;
    matchScore?: number;
}
export declare class ChildSecurityService {
    private readonly PHOTO_RETENTION_DAYS;
    private readonly MAX_PICKUP_ATTEMPTS;
    private readonly MIN_PHOTO_MATCH_THRESHOLD;
    /**
     * Process check-in with WebRTC photo capture
     */
    processCheckInWithPhotos(data: PhotoCaptureData): Promise<{
        success: boolean;
        checkInId: string;
        securityPin: string;
        qrCode: string;
    }>;
    /**
     * Verify pickup with BOTH photo matching AND PIN code
     */
    verifyPickup(checkInId: string, pickupPhoto: string, pinAttempt: string, attemptedBy: string): Promise<{
        success: boolean;
        reason?: string;
        requiresManagerOverride?: boolean;
    }>;
    /**
     * Manager override for emergency situations
     */
    emergencyOverride(checkInId: string, managerId: string, overrideReason: string): Promise<{
        success: boolean;
    }>;
    /**
     * Generate secure 6-digit PIN
     */
    private generateSecurityPin;
    /**
     * Generate QR code for check-in
     */
    private generateQRCode;
    /**
     * Generate backup authorization codes
     */
    private generateBackupCodes;
    /**
     * Encrypt and store photo securely
     */
    private storeEncryptedPhoto;
    /**
     * Photo encryption (placeholder implementation)
     */
    private encryptPhoto;
    /**
     * Compare photos using ML/AI service (placeholder)
     */
    private comparePhotos;
    /**
     * Schedule automatic photo deletion after 7 days
     */
    private schedulePhotoDeletion;
    /**
     * Clean up photos (immediate or scheduled)
     */
    private cleanupPhotos;
    /**
     * Delete secure photo file
     */
    private deleteSecurePhoto;
    /**
     * Mask PIN for logging
     */
    private maskPin;
    /**
     * Get pickup attempt history for audit
     */
    getPickupHistory(checkInId: string): Promise<PickupAttempt[]>;
    /**
     * Clean up expired photos (run via cron job)
     */
    cleanupExpiredPhotos(): Promise<number>;
}
//# sourceMappingURL=child-security.d.ts.map