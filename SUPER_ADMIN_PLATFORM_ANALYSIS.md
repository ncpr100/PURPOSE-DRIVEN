# SUPER_ADMIN Platform Management - Current State & Implementation Plan

**Date**: January 7, 2026  
**Status**: Analysis Complete - Ready for Implementation  
**Priority**: HIGH - Core Platform Functionality  

---

## 📋 Current State Analysis

### **1. Temporary Password Workflow** ✅ PARTIALLY IMPLEMENTED

**Current Implementation** (`app/api/platform/churches/route.ts`):

```typescript
// Line 168: Password generation during church creation
const hashedPassword = await bcrypt.hash(adminUser.password || 'cambiarpassword123', 12)

// Line 241-267: Email delivery
const temporaryPassword = adminUser.password || 'cambiarpassword123'
// Email sent to: adminUser.email (CHURCH_ADMIN email, NOT church email)
```

**✅ What Works:**
- Temporary password created during church creation
- Welcome email sent with credentials
- Password is hashed using bcrypt (12 rounds - secure)
- Email includes clear instructions to change password

**❌ Gaps Identified:**
1. **Email Target**: Currently sent to `adminUser.email` ✅ CORRECT (church admin, not generic church email)
2. **Password Change Enforcement**: NO ENFORCEMENT - users can keep using temp password
3. **First Login Flag**: `isFirstLogin` not tracked in `users` table
4. **Forced Password Change**: No middleware/UI to enforce password change on first login

---

### **2. Password Update Flow** ⚠️ NEEDS IMPLEMENTATION

**Current State:**
- Profile page exists (`app/(dashboard)/profile/page.tsx`)
- NO API endpoint for password changes
- NO first-login detection
- NO forced password change flow

**Required Implementation:**
```typescript
// NEW: app/api/auth/change-password/route.ts
POST /api/auth/change-password
{
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}

// Response: 
{
  success: boolean,
  message: string,
  requiresRelogin?: boolean
}
```

---

### **3. SUPER_ADMIN Edit Capabilities** ⚠️ PARTIALLY IMPLEMENTED

**Current State:**
- Church users viewable (`app/(platform)/platform/churches/[id]/users/page.tsx`)
- NO EDIT functionality for church admin personal info
- Can view user list but cannot modify

**Gaps:**
- No edit dialog for user information
- No API endpoint to update user profiles (SUPER_ADMIN scope)
- Cannot update: name, email, phone, role from platform level

**Required:**
```typescript
// NEW: app/api/platform/users/[userId]/route.ts
PUT /api/platform/users/[userId]
{
  name?: string,
  email?: string,
  phone?: string,
  role?: string,
  isActive?: boolean
}
```

---

### **4. Invoice Workflow** ✅ FOUNDATION EXISTS, NEEDS COMPLETION

**Current Implementation:**

**Database Schema** (`prisma/schema.prisma` line 937):
```prisma
model invoices {
  id                String   @id
  invoiceNumber     String   @unique
  churchId          String
  status            String   @default("DRAFT")  // DRAFT, SENT, PAID, OVERDUE, CANCELLED
  type              String   @default("SUBSCRIPTION")
  subtotal          Float
  taxAmount         Float
  totalAmount       Float
  dueDate           DateTime
  sentAt            DateTime?
  paidAt            DateTime?
  // Relations:
  invoice_line_items     invoice_line_items[]
  invoice_payments       invoice_payments[]
  invoice_communications invoice_communications[]
}
```

**API Routes:**
- ✅ `GET /api/platform/invoices` - List invoices
- ✅ `POST /api/platform/invoices` - Create invoice
- ⚠️ Missing: Update, Delete, Send, Mark as Paid

**UI:**
- ✅ Invoice list page exists (`app/(platform)/platform/invoices/page.tsx`)
- ⚠️ Missing: Invoice detail view, payment recording, email sending

---

## 🎯 Implementation Plan

### **PRIORITY 1: Password Change Flow** (CRITICAL SECURITY)

**Steps:**
1. Add `isFirstLogin` boolean to `users` table (migration)
2. Create `/api/auth/change-password` endpoint
3. Add middleware check for first login
4. Create password change modal/page
5. Force redirect to password change on first login

**Files to Create/Modify:**
- `prisma/schema.prisma` - Add `isFirstLogin` field
- `app/api/auth/change-password/route.ts` - NEW
- `app/(dashboard)/profile/_components/change-password-modal.tsx` - NEW
- `middleware.ts` - Add first login check
- `app/api/platform/churches/route.ts` - Set `isFirstLogin: true` on creation

---

### **PRIORITY 2: SUPER_ADMIN User Management**

**Steps:**
1. Create API endpoint for updating user profiles
2. Add edit dialog to church users page
3. Implement role change capability
4. Add user deactivation/activation

**Files to Create/Modify:**
- `app/api/platform/users/[userId]/route.ts` - NEW (PUT, DELETE methods)
- `app/(platform)/platform/churches/[id]/users/_components/edit-user-dialog.tsx` - NEW
- `app/(platform)/platform/churches/[id]/users/page.tsx` - Add edit functionality

---

### **PRIORITY 3: Invoice Workflow Completion**

**Steps:**
1. Create invoice detail view
2. Add "Send Invoice" functionality (email)
3. Add "Record Payment" functionality
4. Add invoice status transitions
5. Implement automatic overdue detection

**Files to Create/Modify:**
- `app/api/platform/invoices/[id]/route.ts` - NEW (PUT, DELETE)
- `app/api/platform/invoices/[id]/send/route.ts` - NEW (send email)
- `app/api/platform/invoices/[id]/payment/route.ts` - NEW (record payment)
- `app/(platform)/platform/invoices/[id]/page.tsx` - NEW (detail view)
- `lib/email-templates/invoice.ts` - NEW (invoice email template)

---

## 🔧 Technical Details

### **Database Migrations Required**

```sql
-- Add isFirstLogin to users table
ALTER TABLE users ADD COLUMN "isFirstLogin" BOOLEAN DEFAULT false;

-- Update existing church admins to require password change
UPDATE users 
SET "isFirstLogin" = true 
WHERE role = 'ADMIN_IGLESIA' 
  AND "createdAt" > NOW() - INTERVAL '30 days';  -- Recent users only
```

### **Environment Variables**

Already configured:
- `NEXTAUTH_SECRET` ✅ (for password hashing)
- `DATABASE_URL` ✅
- `MAILGUN_API_KEY` ✅ (for invoice emails)

No new environment variables required.

---

## 📊 Success Metrics

**Password Security:**
- ✅ 100% of new church admins forced to change password
- ✅ <24 hours average time to first password change
- ✅ Zero temp passwords older than 7 days

**Platform Administration:**
- ✅ SUPER_ADMIN can edit any user profile
- ✅ <2 minutes to update church admin information
- ✅ Audit trail of all admin changes

**Invoice Management:**
- ✅ Invoices sent within 24 hours of creation
- ✅ Payment recording <5 minutes
- ✅ Automatic overdue detection (daily cron)

---

## 🚀 Implementation Timeline

**Week 1** (Current):
- ✅ Analysis complete
- 🔄 Password change flow implementation
- 🔄 SUPER_ADMIN user editing

**Week 2**:
- 🔄 Invoice workflow completion
- 🔄 Testing & QA
- 🔄 Documentation updates

---

## 📝 Next Steps

1. **Approve this analysis** ✓
2. **Start with PRIORITY 1** - Password change (highest security impact)
3. **Sequential implementation** - Complete each priority before moving to next
4. **Test after each feature** - Deploy incrementally
5. **Update copilot instructions** - Document new patterns

---

**Ready to proceed with implementation?**
