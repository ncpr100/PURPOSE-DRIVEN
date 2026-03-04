# 🧪 KHESED-TEK CMS COMPREHENSIVE TESTING FRAMEWORK

## 📊 TESTING OVERVIEW

**Platform URL:** https://khesed-tek-cms.vercel.app  
**Testing Date:** March 4, 2026  
**Framework Version:** 1.0  

### 🎯 TEST ROLES & CREDENTIALS

**Tenant Level (Church Admin):**  
- Email: `cjisok1@gmail.com`
- Password: `Business100%`
- Role: `CHURCH_ADMIN`

**Super Admin Level (Platform Admin):**  
- Email: `soporte@khesed-tek-systems.org`  
- Password: `Bendecido100%$$%`
- Role: `SUPER_ADMIN`

---

## 🎯 PRIORITY TESTING AREAS

### ⚠️ HIGH PRIORITY ISSUES TO VALIDATE
1. **Members Module Tab Counts** - Incorrect data display across tabs
2. **Spanish Language Consistency** - English words in Spanish UI
3. **New Church Workflow** - Role assignment and email automation
4. **Cross-Module Data Flow** - Member → Contributions integration

---

## 📋 TESTING METHODOLOGY

### STEP 1: SESSION VALIDATION
```bash
# Test login endpoints and session management
1. Login with tenant credentials
2. Verify JWT token in localStorage/cookies
3. Test protected route access
4. Login with super admin credentials  
5. Verify role-based access control
```

### STEP 2: TENANT LEVEL TESTING
```bash
# Members Module (CRITICAL)
1. Navigate to /members
2. Check API call: GET /api/members
3. Validate tab counts vs actual data
4. Test each sub-tab filter
5. Create/edit/delete member workflow
6. Verify cross-tab data consistency
```

### STEP 3: SUPER ADMIN TESTING
```bash
# New Church Creation Workflow (CRITICAL)
1. Navigate to church creation form
2. Test role assignment options
3. Verify email automation trigger
4. Check new user credential generation
5. Validate data isolation between churches
```

---

## 🔍 MANUAL TESTING CHECKLIST

### A. LOGIN & AUTHENTICATION TESTING

**Test Case 1.1: Tenant Login**
- [ ] Navigate to login page
- [ ] Enter tenant credentials: `cjisok1@gmail.com / Business100%`
- [ ] Verify successful redirect to dashboard
- [ ] Check Network tab for API calls
- [ ] Verify session token presence
- [ ] Note any console errors

**Test Case 1.2: Super Admin Login**  
- [ ] Logout from tenant session
- [ ] Enter super admin credentials: `soporte@khesed-tek-systems.org / Bendecido100%$$%`
- [ ] Verify access to platform-level features
- [ ] Check role-based UI differences

**Expected Results:**
- Successful authentication for both roles
- Proper session management
- Role-appropriate navigation menus
- No console errors during login

---

### B. MEMBERS MODULE TESTING (TENANT LEVEL)

**Test Case 2.1: Main Members List**
- [ ] Navigate to `/members` or Members tab
- [ ] **API Validation**: Check Network tab for `GET /api/members`
- [ ] Verify response structure and data
- [ ] Count total members displayed
- [ ] Test pagination (if applicable)
- [ ] Test search functionality

**Test Case 2.2: Age Groups Tab**
- [ ] Click "Age Groups" tab
- [ ] **API Validation**: Check for specific API call
- [ ] Compare badge count vs actual displayed members
- [ ] **CRITICAL**: Document count discrepancies
- [ ] Test age group filters

**Test Case 2.3: Volunteers Tab**
- [ ] Click "Volunteers" tab  
- [ ] **API Validation**: Check endpoint (likely `/api/members?role=volunteer`)
- [ ] Count volunteer members displayed
- [ ] Compare with badge count
- [ ] Test volunteer status changes

**Test Case 2.4: Candidates Tab**
- [ ] Click "Candidates" tab
- [ ] Verify candidate-specific data
- [ ] Check count accuracy
- [ ] Test promotion workflow (if applicable)

**Test Case 2.5: Active Members Tab**
- [ ] Click "Active Members" tab
- [ ] Verify active status filtering
- [ ] Check count vs displayed data
- [ ] Test status toggle functionality

**Test Case 2.6: Add New Member Workflow**
- [ ] Click "Add Member" button
- [ ] Fill required fields
- [ ] **Language Check**: Note any English labels
- [ ] Submit form
- [ ] **API Validation**: Check `POST /api/members`
- [ ] Verify member appears in appropriate tabs
- [ ] Check if tab counts update in real-time

**Test Case 2.7: Edit Member Workflow**
- [ ] Select existing member for editing
- [ ] Modify volunteer status
- [ ] Save changes
- [ ] **Critical**: Verify member moves between tabs  
- [ ] Check if counts update without page refresh

---

### C. CROSS-MODULE INTEGRATION TESTING

**Test Case 3.1: Member → Contributions Flow**
- [ ] From Members list, select a member
- [ ] Navigate to member's contributions
- [ ] **API Validation**: Check URL contains member ID
- [ ] Verify contributions belong to selected member
- [ ] Add new contribution for member
- [ ] Return to Members list - verify no data corruption

**Test Case 3.2: Member → Events Integration**
- [ ] Check member event participation
- [ ] Verify event attendance tracking
- [ ] Test member check-in workflow

---

### D. SUPER ADMIN TESTING

**Test Case 4.1: New Church Creation Workflow**
- [ ] Navigate to church creation section
- [ ] **Form Analysis**: Document available fields
- [ ] **Role Options**: Check for Pastor vs Admin distinction
- [ ] Create test church: "Test Church QA"
- [ ] **API Validation**: Check `POST /api/churches`
- [ ] Monitor email automation trigger

**Test Case 4.2: Email Service Analysis**
- [ ] **Network Monitoring**: Watch for Resend API calls
- [ ] Document current email integration
- [ ] Check environment variables (if accessible)
- [ ] Note email delivery confirmation

**Test Case 4.3: New User Role Assignment**  
- [ ] After church creation, check assigned user role
- [ ] **Database Check**: Confirm role in users table
- [ ] Test login with new church credentials
- [ ] Verify data isolation between churches

---

### E. LANGUAGE CONSISTENCY TESTING

**Test Case 5.1: UI Text Audit**
- [ ] Navigate through each module as tenant
- [ ] **Document English Text**: Location and context
- [ ] Check form labels, buttons, error messages
- [ ] Verify date/time formatting (Spanish locale)
- [ ] Check data table headers

**Test Case 5.2: Super Admin Language Check**
- [ ] Audit super admin interface
- [ ] Check platform-level terminology
- [ ] Verify consistency with tenant interface

---

## 📊 EXPECTED API ENDPOINTS

### Tenant Level APIs
```typescript
// Member Management
GET /api/members                    // Main list
GET /api/members?role=volunteer     // Volunteers tab
GET /api/members?status=active      // Active members
GET /api/members?group=age_group    // Age groups
POST /api/members                   // Create member
PUT /api/members/[id]               // Update member
DELETE /api/members/[id]            // Delete member

// Contributions
GET /api/contributions              // All contributions
GET /api/contributions?member=[id]  // Member-specific

// Events  
GET /api/events                     // Church events
GET /api/events/[id]/attendees      // Event participants
```

### Super Admin APIs
```typescript
// Church Management
GET /api/platform/churches          // All churches
POST /api/platform/churches         // Create church
PUT /api/platform/churches/[id]     // Update church

// User Management
POST /api/platform/users            // Create church user  
GET /api/platform/stats             // Platform statistics

// Email Services (Current: Resend)
POST /api/email/send-credentials    // Send user credentials
```

---

## 🐛 ISSUE DOCUMENTATION TEMPLATE

### Critical Issue Format
```markdown
## Issue #X: [Title]
**Severity:** High/Medium/Low  
**Module:** [Module Name]  
**Role:** Tenant/Super Admin  

**Steps to Reproduce:**
1. Login as [role]
2. Navigate to [path]
3. Click [element]
4. Observe [behavior]

**Expected Result:**
[What should happen]

**Actual Result:**  
[What actually happened]

**API Analysis:**
- Endpoint: [URL]
- Method: [GET/POST/etc]
- Response: [Status code and data structure]
- Issues: [Missing parameters, wrong data, etc]

**Console Errors:**
[Any JavaScript errors]

**Screenshots:**
[Visual evidence if UI issue]

**Suggested Fix:**
[Technical recommendation]
```

---

## ✅ SUCCESS CRITERIA

### Module Testing Completion
- [ ] All tenant-level modules tested
- [ ] All super admin features validated  
- [ ] Cross-module workflows verified
- [ ] Language consistency documented
- [ ] API endpoints analyzed
- [ ] Performance issues identified

### Critical Issues Resolution
- [ ] Members tab counts accurate
- [ ] Real-time data updates working
- [ ] New church workflow improved
- [ ] Role distinction implemented
- [ ] Email service migration planned
- [ ] Spanish language consistency achieved

---

## 🎯 NEXT STEPS AFTER TESTING

1. **Document all findings** using issue templates
2. **Prioritize fixes** by severity and impact
3. **Create fix scripts** for identified issues
4. **Implement language corrections**
5. **Enhance new church workflow**
6. **Plan Resend → Google Workspace migration**
7. **Add automated tests** for critical workflows

---

## 🛠️ TESTING TOOLS PROVIDED

1. `testing-automation-scripts.js` - Automated API endpoint testing
2. `language-audit-tool.js` - Spanish/English text detection
3. `api-validation-suite.js` - Response structure validation
4. `cross-module-integration-test.js` - Data flow verification
5. `performance-monitoring.js` - Page load and API response times

**Ready to execute comprehensive testing with systematic documentation!** 🚀