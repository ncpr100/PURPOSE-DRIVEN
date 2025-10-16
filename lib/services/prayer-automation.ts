/**
 * Prayer Request Automation Integration
 * Triggers automation rules for prayer requests
 * Handles bypassApproval logic to skip manual approval
 */

import { prisma } from '@/lib/prisma';
import { executeAutomationAction } from './automation-execution-engine';

export class PrayerAutomation {
  /**
   * Process a new prayer request through automation rules
   */
  static async processPrayerRequest(prayerRequestId: string): Promise<void> {
    try {
      // Fetch prayer request with contact and category
      const prayerRequest = await prisma.prayerRequest.findUnique({
        where: { id: prayerRequestId },
        include: {
          contact: true,
          category: true,
        }
      });

      if (!prayerRequest) {
        console.error(`[Prayer Automation] Prayer request ${prayerRequestId} not found`);
        return;
      }

      // Find active automation rules for prayer requests
      const automationRules = await prisma.automationRule.findMany({
        where: {
          churchId: prayerRequest.churchId,
          isActive: true,
          triggers: {
            some: {
              type: 'PRAYER_REQUEST_SUBMITTED',
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

      if (automationRules.length === 0) {
        console.log('[Prayer Automation] No active automation rules found for prayer requests');
        return;
      }

      // Execute each matching automation rule
      for (const rule of automationRules) {
        // Check if conditions match
        const conditionsMatch = await this.evaluateConditions(rule.conditions, prayerRequest);
        
        if (!conditionsMatch) {
          continue;
        }

        console.log(`[Prayer Automation] Executing rule: ${rule.name} for prayer request: ${prayerRequestId}`);

        // CHECK BYPASS APPROVAL FIELD
        if (rule.bypassApproval) {
          // SKIP APPROVAL - Execute actions immediately
          console.log(`[Prayer Automation] Bypassing approval for rule: ${rule.name}`);
          
          await this.executeRuleActions(rule, prayerRequest);
        } else {
          // CREATE APPROVAL RECORD - Require manual approval
          console.log(`[Prayer Automation] Creating approval record for rule: ${rule.name}`);
          
          // Find a pastor or admin to assign approval
          const pastors = await prisma.user.findMany({
            where: {
              churchId: prayerRequest.churchId,
              role: {
                in: ['PASTOR', 'ADMIN_IGLESIA']
              }
            },
            take: 1
          });

          const approver = pastors[0];
          if (!approver) {
            console.error('[Prayer Automation] No pastor/admin found for approval, skipping');
            continue;
          }

          await prisma.prayerApproval.create({
            data: {
              requestId: prayerRequest.id,
              churchId: prayerRequest.churchId,
              contactId: prayerRequest.contactId,
              approvedBy: approver.id,
              status: 'pending',
              notes: `Pending approval from automation rule: ${rule.name}`
            }
          });

          console.log(`[Prayer Automation] Approval record created for prayer request: ${prayerRequestId}`);
        }
      }

    } catch (error) {
      console.error('[Prayer Automation] Error processing prayer request:', error);
      throw error;
    }
  }

  /**
   * Execute all actions for a rule (when bypassApproval is true)
   */
  private static async executeRuleActions(rule: any, prayerRequest: any): Promise<void> {
    for (const action of rule.actions) {
      try {
        // Prepare context for action execution
        const context = {
          prayerRequestId: prayerRequest.id,
          contactId: prayerRequest.contactId,
          churchId: prayerRequest.churchId,
          recipientEmail: prayerRequest.contact.email,
          recipientPhone: prayerRequest.contact.phone,
          recipientName: prayerRequest.contact.fullName,
          prayerMessage: prayerRequest.message,
          priority: prayerRequest.priority,
          category: prayerRequest.category?.name,
          isAnonymous: prayerRequest.isAnonymous,
          data: {
            prayerRequest,
            contact: prayerRequest.contact,
            category: prayerRequest.category
          }
        };

        // Execute action through automation engine (handles retry/fallback)
        const result = await executeAutomationAction(rule, action, context);

        if (result.success) {
          console.log(`[Prayer Automation] Action ${action.type} executed successfully`);
        } else {
          console.error(`[Prayer Automation] Action ${action.type} failed:`, result.error);
        }

      } catch (error) {
        console.error(`[Prayer Automation] Error executing action ${action.id}:`, error);
      }
    }
  }

  /**
   * Evaluate rule conditions against prayer request
   */
  private static async evaluateConditions(conditions: any[], prayerRequest: any): Promise<boolean> {
    if (!conditions || conditions.length === 0) {
      return true; // No conditions = always match
    }

    for (const condition of conditions) {
      const fieldValue = this.getFieldValue(prayerRequest, condition.field);
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
          console.warn(`[Prayer Automation] Unknown operator: ${condition.operator}`);
      }
    }

    return true; // All conditions matched
  }

  /**
   * Get field value from prayer request object
   */
  private static getFieldValue(prayerRequest: any, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value = prayerRequest;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return null;
      }
    }

    return value;
  }

  /**
   * Manually approve a prayer request (trigger deferred actions)
   */
  static async approvePrayerRequest(approvalId: string, approverId: string): Promise<void> {
    try {
      // Update approval status
      const approval = await prisma.prayerApproval.update({
        where: { id: approvalId },
        data: {
          status: 'approved',
          approvedBy: approverId,
          approvedAt: new Date()
        },
        include: {
          request: {
            include: {
              contact: true,
              category: true
            }
          }
        }
      });

      // Find the automation rule that created this approval
      const automationRule = await prisma.automationRule.findFirst({
        where: {
          churchId: approval.churchId,
          isActive: true,
          triggers: {
            some: {
              type: 'PRAYER_REQUEST_APPROVED',
              isActive: true
            }
          }
        },
        include: {
          actions: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (automationRule && approval.request) {
        // Execute rule actions now that it's approved
        await this.executeRuleActions(automationRule, approval.request);
      }

    } catch (error) {
      console.error('[Prayer Automation] Error approving prayer request:', error);
      throw error;
    }
  }

  // Legacy method for compatibility
  async createFromVisitor(data: any): Promise<string> {
    console.log('Prayer request created from visitor:', data);
    return 'prayer-request-id';
  }
}
