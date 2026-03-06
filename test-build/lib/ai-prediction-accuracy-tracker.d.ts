/**
 * AI Prediction Accuracy Tracker & Improvement Engine
 * Continuously monitors and improves AI prediction accuracy
 */
export interface PredictionRecord {
    id: string;
    predictionType: 'retention' | 'stage_progression' | 'ministry_match' | 'growth_projection';
    memberId?: string;
    churchId: string;
    predictedValue: any;
    actualValue?: any;
    confidence: number;
    predictionDate: Date;
    validationDate?: Date;
    accuracy?: number;
    contributingFactors: string[];
    modelVersion: string;
}
export interface AccuracyMetrics {
    overall: number;
    byType: {
        [key: string]: number;
    };
    trend: 'improving' | 'stable' | 'declining';
    monthlyImprovement: number;
    confidenceCalibration: number;
}
export declare class AIPredictionAccuracyEngine {
    private churchId;
    private modelVersion;
    constructor(churchId: string);
    /**
     * Record a new prediction for future validation
     */
    recordPrediction(type: string, memberId: string | null, prediction: any, confidence: number, factors: string[]): Promise<string>;
    /**
     * Validate a prediction against actual outcomes
     */
    validatePrediction(predictionId: string, actualOutcome: any): Promise<number>;
    /**
     * Get comprehensive accuracy metrics
     */
    getAccuracyMetrics(period?: number): Promise<AccuracyMetrics>;
    /**
     * Generate improvement recommendations based on accuracy patterns
     */
    generateImprovementRecommendations(): Promise<Array<{
        category: string;
        recommendation: string;
        impact: 'high' | 'medium' | 'low';
        effort: 'high' | 'medium' | 'low';
        timeframe: string;
    }>>;
    /**
     * Auto-tune model parameters based on accuracy feedback
     */
    autoTuneModel(): Promise<{
        adjustments: string[];
        expectedImprovement: number;
        newVersion: string;
    }>;
    /**
     * A/B test new prediction models
     */
    setupABTest(testName: string, controlModel: string, testModel: string, trafficSplit?: number): Promise<string>;
    /**
     * Analyze A/B test results
     */
    analyzeABTest(testId: string): Promise<{
        controlAccuracy: number;
        testAccuracy: number;
        improvement: number;
        significance: number;
        recommendation: 'adopt' | 'reject' | 'continue';
    }>;
    private calculateAccuracy;
    private calculateRetentionAccuracy;
    private calculateStageAccuracy;
    private calculateMinistryAccuracy;
    private calculateGeneralAccuracy;
    private updateModelLearning;
    private groupBy;
    private calculateTrend;
    private calculateMonthlyImprovement;
    private calculateConfidenceCalibration;
    private adjustRetentionModelWeights;
    private adjustEngagementAlgorithm;
    private adjustMinistryMatchingAlgorithm;
    private incrementModelVersion;
    private calculateAverageAccuracy;
    private calculateStatisticalSignificance;
}
//# sourceMappingURL=ai-prediction-accuracy-tracker.d.ts.map