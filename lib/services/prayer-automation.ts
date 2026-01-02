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
  static async processPrayerRequest(prayer_requestsId: string): Promise<void> {
    try {
      // Fetch prayer request with contact and category
      const prayer_requests = await prisma.prayer_requests.findUnique({
        where: { id: prayer_requestsId }
      });

      if (!prayer_requests) {
        console.error(`[Prayer Automation] Prayer request ${prayer_requestsId} not found`);
        return;
      }

      // Find active automation rules for prayer requests
      const automation_ruless = await prisma.automation_rules.findMany({
        where: {
          churchId: prayer_requests.churchId,
          isActive: true
        },
        include: {
          automation_actions: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (automation_ruless.length === 0) {
        console.log('[Prayer Automation] No active automation rules found for prayer requests');
        return;
      }

      // Execute each matching automation rule
      for (const rule of automation_ruless) {
        // Check if conditions match (simplified - no conditions in schema)
        // const conditionsMatch = await this.evaluateConditions(rule.conditions, prayer_requests);
        
        // if (!conditionsMatch) {
        //   continue;
        // }

        console.log(`[Prayer Automation] Executing rule: ${rule.name} for prayer request: ${prayer_requestsId}`);

        // CHECK BYPASS APPROVAL FIELD
        if (rule.bypassApproval) {
          // SKIP APPROVAL - Execute actions immediately
          console.log(`[Prayer Automation] Bypassing approval for rule: ${rule.name}`);
          
          await this.executeRuleActions(rule, prayer_requests);
        } else {
          // CREATE APPROVAL RECORD - Require manual approval
          console.log(`[Prayer Automation] Creating approval record for rule: ${rule.name}`);
          
          // Find a pastor or admin to assign approval
          const pastors = await prisma.users.findMany({
            where: {
              churchId: prayer_requests.churchId,
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

          await prisma.prayer_approvals.create({
            data: {
              id: require('nanoid').nanoid(),
              requestId: prayer_requests.id,
              churchId: prayer_requests.churchId,
              contactId: prayer_requests.contactId,
              approvedBy: approver.id,
              status: 'pending',
              notes: `Pending approval from automation rule: ${rule.name}`
            }
          });

          console.log(`[Prayer Automation] Approval record created for prayer request: ${prayer_requestsId}`);
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
  private static async executeRuleActions(rule: any, prayer_requests: any): Promise<void> {
    for (const action of rule.actions) {
      try {
        // Prepare context for action execution
        const context = {
          prayer_requestsId: prayer_requests.id,
          contactId: prayer_requests.contactId,
          churchId: prayer_requests.churchId,
          recipientEmail: prayer_requests.contact.email,
          recipientPhone: prayer_requests.contact.phone,
          recipientName: prayer_requests.contact.fullName,
          prayerMessage: prayer_requests.message,
          priority: prayer_requests.priority,
          category: prayer_requests.category?.name,
          isAnonymous: prayer_requests.isAnonymous,
          data: {
            prayer_requests,
            contact: prayer_requests.contact,
            category: prayer_requests.category
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
  private static async evaluateConditions(conditions: any[], prayer_requests: any): Promise<boolean> {
    if (!conditions || conditions.length === 0) {
      return true; // No conditions = always match
    }

    for (const condition of conditions) {
      const fieldValue = this.getFieldValue(prayer_requests, condition.field);
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
  private static getFieldValue(prayer_requests: any, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value = prayer_requests;

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
      const approval = await prisma.prayer_approvals.update({
        where: { id: approvalId },
        data: {
          status: 'approved',
          approvedBy: approverId,
          approvedAt: new Date()
        }
      });

      // Fetch the prayer request separately
      const prayerRequest = await prisma.prayer_requests.findUnique({
        where: { id: approval.requestId }
      });

      // Find the automation rule that created this approval
      const automation_rules = await prisma.automation_rules.findFirst({
        where: {
          churchId: approval.churchId,
          isActive: true
        },
        include: {
          automation_actions: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (automation_rules && prayerRequest) {
        // Execute rule actions now that it's approved
        await this.executeRuleActions(automation_rules, prayerRequest);
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
