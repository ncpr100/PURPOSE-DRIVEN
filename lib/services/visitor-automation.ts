/**
 * Visitor Automation Integration
 * Triggers automation rules for visitor check-ins
 * Handles auto-categorization and bypass approval logic
 */

import { prisma } from '@/lib/prisma';
import { executeAutomationAction } from './automation-execution-engine';

type VisitorCategory = 'FIRST_TIME' | 'RETURNING' | 'REGULAR' | 'NON_MEMBER' | 'MEMBER_CANDIDATE';

export class VisitorAutomationService {
  /**
   * Process a visitor check-in through automation rules
   */
  static async processVisitor(checkInId: string): Promise<void> {
    try {
      // Fetch check-in with related data
      const checkIn = await prisma.check_ins.findUnique({
        where: { id: checkInId },
        include: {
          church: true,
          event: true,
        }
      });

      if (!checkIn) {
        console.error(`[Visitor Automation] Check-in ${checkInId} not found`);
        return;
      }

      // AUTO-CATEGORIZE VISITOR
      const category = await this.categorizeVisitor(checkIn);
      console.log(`[Visitor Automation] Categorized visitor as: ${category}`);

      // Create or update VisitorProfile
      const visitorProfile = await this.upsertVisitorProfile(checkIn, category);

      // Find active automation rules for this visitor category
      const triggerType = this.getTriggerTypeForCategory(category);
      
      const automation_ruless = await prisma.automation_rules.findMany({
        where: {
          churchId: checkIn.churchId,
          isActive: true,
          triggers: {
            some: {
              type: triggerType,
              isActive: true
            }
          }
        },
        include: {
          actions: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          },
          conditions: true,
          triggers: true
        }
      });

      if (automation_ruless.length === 0) {
        console.log(`[Visitor Automation] No active automation rules found for ${category} visitors`);
        return;
      }

      // Execute each matching automation rule
      for (const rule of automation_ruless) {
        // Check if conditions match
        const conditionsMatch = await this.evaluateConditions(rule.conditions, checkIn, visitorProfile);
        
        if (!conditionsMatch) {
          continue;
        }

        console.log(`[Visitor Automation] Executing rule: ${rule.name} for check-in: ${checkInId}`);

        // CHECK BYPASS APPROVAL FIELD
        if (rule.bypassApproval) {
          // SKIP APPROVAL - Execute actions immediately
          console.log(`[Visitor Automation] Bypassing approval for rule: ${rule.name}`);
          
          await this.executeRuleActions(rule, checkIn, visitorProfile);
        } else {
          // CREATE FOLLOW-UP TASK - Require manual approval
          console.log(`[Visitor Automation] Creating follow-up task for rule: ${rule.name}`);
          
          await this.createFollowUpTask(rule, checkIn, visitorProfile);
        }
      }

    } catch (error) {
      console.error('[Visitor Automation] Error processing visitor:', error);
      throw error;
    }
  }

  /**
   * AUTO-CATEGORIZE visitor based on behavior and history
   */
  private static async categorizeVisitor(check_ins: any): Promise<VisitorCategory> {
    // Check if first-time visitor
    const previousVisits = await prisma.check_ins.count({
      where: {
        email: checkIn.email,
        churchId: checkIn.churchId,
        id: { not: checkIn.id }
      }
    });

    // FIRST_TIME: New visitor (0 previous visits)
    if (previousVisits === 0) {
      return 'FIRST_TIME';
    }

    // MEMBER_CANDIDATE: 4+ visits or expressed membership interest
    if (previousVisits >= 4 || checkIn.membershipInterest) {
      return 'MEMBER_CANDIDATE';
    }

    // REGULAR: 3+ visits
    if (previousVisits >= 3) {
      return 'REGULAR';
    }

    // RETURNING: 1-2 previous visits
    return 'RETURNING';
  }

  /**
   * Create or update VisitorProfile in database
   */
  private static async upsertVisitorProfile(check_ins: any, category: VisitorCategory) {
    // Try to find existing profile by email or phone
    const existingProfile = await prisma.visitorProfile.findFirst({
      where: {
        OR: [
          { email: checkIn.email },
          { phone: checkIn.phone }
        ]
      }
    });

    if (existingProfile) {
      // Update existing profile
      return await prisma.visitorProfile.update({
        where: { id: existingProfile.id },
        data: {
          category,
          visitCount: existingProfile.visitCount + 1,
          lastVisitDate: new Date(),
          checkInId: checkIn.id // Update to latest check-in
        }
      });
    } else {
      // Create new profile
      return await prisma.visitorProfile.create({
        data: {
          checkInId: checkIn.id,
          fullName: `${checkIn.firstName} ${checkIn.lastName}`,
          email: checkIn.email,
          phone: checkIn.phone,
          category,
          visitCount: 1,
          firstVisitDate: new Date(),
          lastVisitDate: new Date(),
          interestAreas: checkIn.ministryInterest || []
        }
      });
    }
  }

  /**
   * Calculate engagement score (0-100)
   */
  private static calculateEngagementScore(check_ins: any, category: VisitorCategory): number {
    let score = 50; // Base score

    // Category bonuses
    const categoryBonus: Record<VisitorCategory, number> = {
      'FIRST_TIME': 0,
      'RETURNING': 10,
      'REGULAR': 20,
      'NON_MEMBER': 25,
      'MEMBER_CANDIDATE': 30
    };
    score += categoryBonus[category];

    // Ministry interest bonus
    if (checkIn.ministryInterest?.length > 0) {
      score += checkIn.ministryInterest.length * 5;
    }

    // Contact info completeness
    if (checkIn.email) score += 5;
    if (checkIn.phone) score += 5;

    // Prayer request or special needs
    if (checkIn.prayer_requests) score += 10;
    if (checkIn.specialNeeds) score += 10;

    return Math.min(100, score);
  }

  /**
   * Match visitor to suitable ministries based on interests and profile
   */
  private static async matchMinistries(check_ins: any, visitorProfile: any): Promise<string[]> {
    try {
      // Get available ministries for the church
      const ministries = await prisma.ministry.findMany({
        where: {
          churchId: checkIn.churchId,
          isActive: true
        }
      });

      const matches: Array<{name: string, score: number}> = [];

      for (const ministry of ministries) {
        let matchScore = 0;

        // Direct interest match (highest priority)
        if (checkIn.ministryInterest?.includes(ministry.name)) {
          matchScore += 40;
        }

        // Age group compatibility (simplified check)
        if (checkIn.ageGroup) {
          // Basic age group matching based on ministry name
          const ageGroupMatch = this.isAgeGroupCompatible(ministry.name, checkIn.ageGroup);
          if (ageGroupMatch) matchScore += 20;
        }

        // Keywords in prayer request or visit reason
        const textToAnalyze = `${checkIn.prayer_requests || ''} ${checkIn.visitReason || ''}`.toLowerCase();
        const ministryKeywords = this.getMinistryKeywords(ministry.name);
        
        for (const keyword of ministryKeywords) {
          if (textToAnalyze.includes(keyword.toLowerCase())) {
            matchScore += 15;
          }
        }

        // Family status compatibility (simplified)
        if (checkIn.familyStatus === 'FAMILY_WITH_KIDS' && ministry.name.toLowerCase().includes('niños')) {
          matchScore += 10;
        }

        // Experience level match (simplified)
        if (visitorProfile.category === 'MEMBER_CANDIDATE') {
          matchScore += 10; // Member candidates get bonus for all ministries
        }

        // Add ministry if score is meaningful
        if (matchScore >= 20) {
          matches.push({ name: ministry.name, score: matchScore });
        }
      }

      // Sort by score and return top 3 matches
      const topMatches = matches
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(match => match.name);

      console.log(`[Ministry Matching] Found ${topMatches.length} ministry matches for visitor:`, topMatches);
      
      return topMatches;

    } catch (error) {
      console.error('[Ministry Matching] Error matching ministries:', error);
      return [];
    }
  }

  /**
   * Get relevant keywords for ministry matching
   */
  private static getMinistryKeywords(ministryName: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'Alabanza y Adoración': ['música', 'canto', 'adoración', 'alabanza', 'instrumento', 'coro', 'banda'],
      'Evangelismo': ['evangelio', 'testificar', 'compartir fe', 'misiones', 'alcance'],
      'Niños': ['niños', 'infantil', 'escuela dominical', 'familia', 'hijos'],
      'Jóvenes': ['jóvenes', 'adolescentes', 'juventud', 'universidad'],
      'Diaconía': ['servicio', 'ayuda', 'necesitados', 'caridad', 'social'],
      'Intercesión': ['oración', 'intercesión', 'ayuno', 'espiritual'],
      'Medios': ['tecnología', 'sonido', 'video', 'grabación', 'streaming'],
      'Células': ['grupos pequeños', 'hogar', 'comunión', 'discipulado'],
      'Administración': ['administración', 'gestión', 'organización', 'finanzas'],
      'Ujieres': ['recepción', 'bienvenida', 'orden', 'protocolo']
    };

    return keywordMap[ministryName] || [ministryName.toLowerCase()];
  }

  /**
   * Check if age group is compatible with ministry
   */
  private static isAgeGroupCompatible(ministryName: string, ageGroup: string): boolean {
    const compatibility: Record<string, string[]> = {
      'CHILDREN': ['Niños', 'Escuela Dominical', 'Infantil'],
      'YOUTH': ['Jóvenes', 'Adolescentes', 'Juventud'],
      'ADULTS': ['Alabanza y Adoración', 'Evangelismo', 'Diaconía', 'Intercesión', 'Células', 'Administración', 'Ujieres'],
      'SENIORS': ['Intercesión', 'Diaconía', 'Células', 'Ujieres']
    };

    const compatibleMinistries = compatibility[ageGroup] || [];
    return compatibleMinistries.some(ministry => 
      ministryName.toLowerCase().includes(ministry.toLowerCase())
    );
  }

  /**
   * Map visitor category to automation trigger type
   */
  private static getTriggerTypeForCategory(category: VisitorCategory): any {
    const mapping: Record<string, any> = {
      'FIRST_TIME': 'VISITOR_FIRST_TIME',
      'RETURNING': 'VISITOR_RETURNED',
      'REGULAR': 'VISITOR_RETURNED',
      'NON_MEMBER': 'VISITOR_CHECKED_IN',
      'MEMBER_CANDIDATE': 'VISITOR_CHECKED_IN'
    };
    return mapping[category];
  }

  /**
   * Execute all actions for a rule (when bypassApproval is true)
   */
  private static async executeRuleActions(rule: any, check_ins: any, visitorProfile: any): Promise<void> {
    for (const action of rule.actions) {
      try {
        // Prepare context for action execution
        const context = {
          checkInId: checkIn.id,
          visitorProfileId: visitorProfile.id,
          churchId: checkIn.churchId,
          recipientEmail: checkIn.email,
          recipientPhone: checkIn.phone,
          recipientName: `${checkIn.firstName} ${checkIn.lastName}`,
          visitorCategory: visitorProfile.category,
          engagementScore: visitorProfile.engagementScore,
          isFirstTime: visitorProfile.category === 'FIRST_TIME',
          ministryInterests: checkIn.ministryInterest || [],
          data: {
            checkIn,
            visitorProfile
          }
        };

        // Execute action through automation engine (handles retry/fallback)
        const result = await executeAutomationAction(rule, action, context);

        if (result.success) {
          console.log(`[Visitor Automation] Action ${action.type} executed successfully`);
        } else {
          console.error(`[Visitor Automation] Action ${action.type} failed:`, result.error);
        }

      } catch (error) {
        console.error(`[Visitor Automation] Error executing action ${action.id}:`, error);
      }
    }
  }

  /**
   * Create follow-up task (when bypassApproval is false)
   */
  private static async createFollowUpTask(rule: any, check_ins: any, visitorProfile: any): Promise<void> {
    // Find a pastor or admin to assign task
    const staff = await prisma.user.findMany({
      where: {
        churchId: checkIn.churchId,
        role: {
          in: ['PASTOR', 'ADMIN_IGLESIA']
        }
      },
      take: 1
    });

    const assignee = staff[0];
    if (!assignee) {
      console.error('[Visitor Automation] No staff found for task assignment, executing anyway');
      // Execute immediately if no staff available
      await this.executeRuleActions(rule, checkIn, visitorProfile);
      return;
    }

    // Calculate scheduled follow-up time (24 hours default)
    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.visitor_follow_ups.create({
      data: {
        checkInId: checkIn.id,
        churchId: checkIn.churchId,
        followUpType: rule.name,
        category: visitorProfile.category,
        priority: rule.priorityLevel || 'NORMAL',
        scheduledAt,
        assignedTo: assignee.id,
        status: 'PENDIENTE',
        notes: `Automation rule: ${rule.name} - Requires manual approval before execution`
      }
    });

    console.log(`[Visitor Automation] Follow-up task created for check-in: ${checkIn.id}`);
  }

  /**
   * Evaluate rule conditions against check-in and visitor profile
   */
  private static async evaluateConditions(conditions: any[], check_ins: any, visitorProfile: any): Promise<boolean> {
    if (!conditions || conditions.length === 0) {
      return true; // No conditions = always match
    }

    for (const condition of conditions) {
      // Merge checkIn and visitorProfile for field lookup
      const data = { ...check_ins, ...visitorProfile };
      const fieldValue = this.getFieldValue(data, condition.field);
      const conditionValue = condition.value;

      switch (condition.operator) {
        case 'equals':
          if (fieldValue !== conditionValue) return false;
          break;
        case 'not_equals':
          if (fieldValue === conditionValue) return false;
          break;
        case 'contains':
          if (!String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase())) return false;
          break;
        case 'greater_than':
          if (!(Number(fieldValue) > Number(conditionValue))) return false;
          break;
        case 'less_than':
          if (!(Number(fieldValue) < Number(conditionValue))) return false;
          break;
        case 'is_true':
          if (!fieldValue) return false;
          break;
        case 'is_false':
          if (fieldValue) return false;
          break;
        default:
          console.warn(`[Visitor Automation] Unknown operator: ${condition.operator}`);
      }
    }

    return true; // All conditions matched
  }

  /**
   * Get field value from data object
   */
  private static getFieldValue(data: any, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value = data;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return null;
      }
    }

    return value;
  }
}
