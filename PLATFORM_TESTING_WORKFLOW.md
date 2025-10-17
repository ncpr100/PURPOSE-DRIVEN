# 🎯 KHESED-TEK PLATFORM TESTING WORKFLOW

**Testing Date**: October 17, 2025  
**Church**: Iglesia Comunidad de Fe  
**Test Data**: 999 migrated members from Planning Center  

---

## 🔧 ISSUE #1: DEMOGRAPHIC BREAKDOWN NOT SHOWING

### Current Problem
✅ **Total Members**: Shows 999 correctly  
❌ **Hombres (Men)**: Shows 0 (WRONG!)  
❌ **Mujeres (Women)**: Shows 0 (WRONG!)  

### Root Cause
**Data mismatch**: Migration created gender as "Masculino"/"Femenino" but the filter checks for lowercase "masculino"/"femenino"

### Fix Required
Update line 667-668 in `/app/(dashboard)/members/_components/members-client.tsx`:

```typescript
// WRONG (case-sensitive):
{filteredMembers.filter(m => m.gender === 'masculino').length}
{filteredMembers.filter(m => m.gender === 'femenino').length}

// CORRECT (case-insensitive):
{filteredMembers.filter(m => m.gender?.toLowerCase() === 'masculino').length}
{filteredMembers.filter(m => m.gender?.toLowerCase() === 'femenino').length}
```

---

## 👨‍👩‍👧‍👦 FEATURE REQUEST: FAMILIES TAB

### Requirements
- New tab to view members grouped by families
- Identify family relationships (parent, spouse, children)
- Quick view of complete family units
- Assign families to ministries together

### Implementation Plan
1. Add `familyId` field to Member schema
2. Create Family model with relationships
3. Add "Familias" tab to members page
4. Build family grouping UI
5. Allow family-based actions (bulk assign, contact, etc.)

---

## 📋 PLATFORM WORKFLOW OVERVIEW

### 1️⃣ **LOGIN & CHURCH SELECTION**
```
URL: https://khesed-tek-cms.up.railway.app/auth/signin
↓
Login with role credentials
↓
Redirects based on role:
- SUPER_ADMIN → /platform/dashboard (all churches)
- ADMIN_IGLESIA → /home (single church dashboard)
- PASTOR → /home (church dashboard with pastoral features)
- LIDER → /home (limited to their ministry)
```

### 2️⃣ **DASHBOARD OVERVIEW** (`/home`)
**Purpose**: Central hub showing church health metrics

**Key Metrics Displayed**:
- Total members, recent growth
- Recent donations, monthly trends
- Active volunteers
- Upcoming events
- Recent prayer requests
- Pending follow-ups

**Quick Actions**:
- Add new member
- Record donation
- Create prayer request
- Schedule event

### 3️⃣ **MEMBERS MANAGEMENT** (`/members`)
**Purpose**: Complete CRM for all church members

#### Smart Lists (Tabs)
1. **Todos los Miembros** - All 999 members
2. **Nuevos Miembros (30d)** - Joined in last 30 days
3. **Miembros Inactivos** - No activity in 6 months
4. **Cumpleaños este Mes** - Birthdays this month
5. **Aniversarios de Membresía** - Membership anniversaries
6. **Líderes de Ministerio** - Ministry leaders
7. **Visitantes → Miembros** - New converts (90 days)
8. **Necesitan Oración** - Members needing prayer

#### Member Actions
- ✅ **View**: See full member profile
- ✅ **Edit**: Update member information
- ✅ **Delete**: Remove member (with confirmation)
- ✅ **Add to Ministry**: Assign to ministries
- ✅ **Recruit as Volunteer**: Convert to volunteer role
- ✅ **Export**: Download member data (CSV/Excel)
- ✅ **Bulk Actions**: Select multiple members for batch operations

#### Search & Filters
- Search by name, email, phone
- Filter by gender (Masculino/Femenino)
- Filter by marital status
- Filter by ministry assignment
- Filter by active/inactive status

### 4️⃣ **VOLUNTEERS SYSTEM** (`/volunteers`)
**Purpose**: Manage volunteer recruitment, assignments, and tracking

#### Workflow
```
Member (in /members)
↓
Click "Reclutar Voluntario" button
↓
System checks qualification criteria:
  - Membership duration (default: immediate)
  - Spiritual maturity score (if assessed)
  - Active status
  - Background check (if required)
↓
Create Volunteer record
↓
Assign to Ministry
↓
Track volunteer hours and participation
```

#### Volunteer Features
- **Recommendations**: AI-powered ministry matches based on spiritual gifts
- **Availability Matrix**: Track when volunteers are available
- **Skills Tracking**: Technical and interpersonal skills
- **Background Checks**: Track clearance dates
- **Volunteer Hours**: Log and report volunteer time

### 5️⃣ **AUTOMATION SYSTEM** (`/automation-rules`)
**Purpose**: Automated workflows for repetitive pastoral tasks

#### Main Sections
1. **Templates** (`/automation-rules/templates`) - Pre-built automation recipes
2. **Rules** (`/automation-rules`) - Your active automation rules
3. **Dashboard** (`/automation-rules/dashboard`) - Execution logs and analytics

#### Available Automations
1. **Prayer Request Automation**
   - Trigger: New prayer request submitted
   - Actions: 
     - Notify prayer team via email/SMS
     - Create follow-up task for pastor
     - Add to prayer wall
     - Schedule 7-day follow-up

2. **Visitor Follow-up Automation**
   - Trigger: New visitor checks in
   - Actions:
     - Send welcome email/SMS
     - Assign to follow-up team
     - Create 3-day follow-up task
     - Add to visitor nurture sequence

3. **Donation Thank You Automation**
   - Trigger: Donation received
   - Actions:
     - Send thank you email
     - Generate tax receipt
     - Update donor record
     - Notify finance team

4. **Birthday Greeting Automation**
   - Trigger: Member birthday
   - Actions:
     - Send birthday card/email
     - Notify pastoral team
     - Add to prayer list

#### Automation Workflow
```
Trigger Event Occurs
↓
Automation Rule Evaluates
↓
Check Conditions (if any)
↓
Execute Actions (email, SMS, task, webhook)
↓
Log Execution in Dashboard
↓
Retry on Failure (up to 3 times)
```

### 6️⃣ **PRAYER WALL** (`/prayer-wall`)
**Purpose**: Manage church prayer requests and intercessory prayer

#### Features
- Public prayer wall (visible to all members)
- Private prayer requests (pastor only)
- Urgent prayers (highlighted)
- Prayer categories (health, family, work, spiritual)
- "Praying for you" counter
- Comments and testimonies
- Answered prayers tracking

#### Workflow
```
Member submits prayer request
↓
Triggers Prayer Automation (if enabled)
↓
Notifies prayer team
↓
Appears on prayer wall
↓
Members can pray and comment
↓
Pastor follows up
↓
Mark as answered when resolved
```

### 7️⃣ **CHECK-INS / VISITORS** (`/check-ins`)
**Purpose**: Track church attendance and follow up with visitors

#### Visitor Categories (Auto-assigned)
1. **FIRST_TIME** - First visit (high priority)
2. **RETURNING** - Visited 2-3 times
3. **REGULAR** - Attended 4+ times in 3 months
4. **MEMBER_CANDIDATE** - Expressed interest in joining

#### Check-in Workflow
```
Visitor arrives at church
↓
Check-in recorded (kiosk/app/manual)
↓
Triggers Visitor Automation (if enabled)
↓
Assigns follow-up task
↓
Sends welcome message
↓
Adds to visitor nurture track
↓
Tracks conversion to member
```

### 8️⃣ **DONATIONS** (`/donations`)
**Purpose**: Track giving, generate receipts, manage campaigns

#### Features
- Record one-time donations
- Recurring donation management
- Donation campaigns
- Donor analytics
- Tax receipts generation
- Giving trends and reports
- Integration with Stripe/PayPal

### 9️⃣ **EVENTS** (`/eventos`)
**Purpose**: Plan and manage church events

#### Features
- Event calendar
- RSVP management
- Volunteer scheduling for events
- Event check-in
- Post-event follow-up
- Event analytics

### 🔟 **SERMONS** (`/sermons` or `/asistente-de-sermones`)
**Purpose**: Organize sermon content and resources

#### Features
- Sermon library
- Scripture references
- Sermon outlines
- Media attachments (audio/video)
- Sermon series tracking
- Search by topic/scripture

---

## ✅ EFFICIENT TESTING STRATEGY

### PHASE 1: VERIFY CORE DATA (5 minutes)
**Current Status: PASSING ✅ except demographics**

```bash
1. Login: admin@comunidaddefe.org / ChurchAdmin2025!
2. Navigate to /members
3. Check:
   ✅ Total members = 999
   ❌ Hombres = 0 (should be ~500) - BUG TO FIX
   ❌ Mujeres = 0 (should be ~500) - BUG TO FIX
   ✅ Member list loads
   ✅ Search works
   ✅ Pagination works
```

### PHASE 2: TEST SMART LISTS (10 minutes)
```bash
Tab through each smart list:
1. "Nuevos Miembros" - Should show members who joined recently
2. "Cumpleaños este Mes" - Should show October birthdays
3. "Aniversarios" - Should show membership anniversaries in October
4. "Líderes de Ministerio" - Should show 50 LIDER users
5. "Candidatos Voluntarios" - Should show eligible members

Expected: Each list filters correctly
```

### PHASE 3: TEST MEMBER DETAIL (5 minutes)
```bash
1. Click on any member (e.g., Felipe Torres)
2. Verify displays:
   ✅ Name, email, phone
   ✅ Address (Los Angeles, CA)
   ✅ Birth date
   ✅ Membership date
   ✅ Marital status (Casado/Soltero/etc.)
   ✅ Ministry assignment (if any)
3. Click "Edit" - form should populate
4. Update a field and save
5. Verify change persists
```

### PHASE 4: TEST VOLUNTEER RECRUITMENT (10 minutes)
```bash
1. From /members, find a member
2. Click "Reclutar Voluntario" button
3. Fill out volunteer form:
   - Select ministry
   - Set skills
   - Add availability
   - Notes
4. Save volunteer
5. Navigate to /volunteers
6. Verify new volunteer appears
7. Check volunteer recommendations
```

### PHASE 5: TEST AUTOMATION (15 minutes)
**CRITICAL: This is the core feature!**

#### 5a. Prayer Request Automation
```bash
1. Navigate to /automation-rules/templates
2. Find "Prayer Request Automation" template
3. Click "Use Template"
4. Configure:
   - Email notifications: ON
   - SMS notifications: ON (if Twilio configured)
   - Follow-up tasks: ON
5. Save and activate

6. Navigate to /prayer-wall
7. Create new prayer request:
   - Title: "Prueba - Necesito oración por sanidad"
   - Description: "Por favor oren por mi recuperación"
   - Category: Salud
   - Priority: Urgent
8. Submit

9. Check /automation-rules/dashboard
   - Should see new execution log
   - Status should be "SUCCESS"
   - Actions executed should list:
     ✅ Email sent
     ✅ SMS sent (if configured)
     ✅ Task created

10. Verify:
    - Check email inbox for prayer notification
    - Check tasks for follow-up task created
    - Check prayer wall for new request
```

#### 5b. Visitor Follow-up Automation
```bash
1. Navigate to /automation-rules/templates
2. Find "Visitor Follow-up Automation"
3. Activate template

4. Navigate to /check-ins
5. Create new visitor check-in:
   - Name: Juan Visitante
   - Email: juan.visitante@test.com
   - Phone: +1-555-TEST-123
   - Visit type: First time
6. Submit

7. Check /automation-rules/dashboard
   - Should see new execution
   - Actions: Welcome email, follow-up task assigned

8. Verify:
    - Email sent to visitor
    - Follow-up task created
    - Visitor appears in check-in list
```

### PHASE 6: TEST SEARCH & FILTERS (10 minutes)
```bash
1. Members page: /members
2. Test search:
   - Search "Rodriguez" → Should return multiple results
   - Search "maria" → Should return Marías
   - Search "@planningcenter" → Should return all members
   - Search phone "555" → Should return members with 555 numbers

3. Test gender filter:
   - Select "Masculino" → Filter to male members only
   - Select "Femenino" → Filter to female members only
   - Select "Todos" → Show all

4. Test combined filters:
   - Search "Rodriguez" + Gender "Masculino"
   - Should show only male Rodriguez members
```

### PHASE 7: TEST BULK ACTIONS (5 minutes)
```bash
1. Members page
2. Select checkboxes for 5-10 members
3. Click "Bulk Actions" button
4. Test available actions:
   - Send email to selected
   - Assign to ministry
   - Export selected
   - Add tags
   - Mark inactive

5. Execute one action (e.g., "Assign to Ministry")
6. Verify all selected members updated
```

### PHASE 8: TEST EXPORT FUNCTIONALITY (5 minutes)
```bash
1. Members page
2. Click "Export" button (Download icon)
3. Should download CSV/Excel with:
   ✅ All 999 members
   ✅ All fields (name, email, phone, address, etc.)
   ✅ Proper formatting

4. Open file in Excel/Google Sheets
5. Verify data integrity
6. Check for any encoding issues (Spanish characters)
```

### PHASE 9: TEST PERMISSIONS (10 minutes)
**Test role-based access control**

```bash
1. Logout from admin@comunidaddefe.org

2. Login as PASTOR:
   - Email: Find in database (firstname.lastname.1000@planningcenter.com)
   - Password: ChurchMember2025!
   - Expected access:
     ✅ Can view members
     ✅ Can add members
     ✅ Can edit members
     ✅ Can view prayer requests
     ✅ Can view reports
     ❌ Cannot delete church
     ❌ Cannot access admin settings

3. Login as LIDER:
   - Email: Find in database (firstname.lastname.2000@planningcenter.com)
   - Password: ChurchMember2025!
   - Expected access:
     ✅ Can view members
     ✅ Can add members to their ministry
     ✅ Can view their ministry's volunteers
     ❌ Cannot delete members
     ❌ Cannot access automation settings
     ❌ Cannot view donations
```

### PHASE 10: TEST PERFORMANCE (5 minutes)
```bash
1. Members page with 999 members
2. Measure:
   - Initial page load time (should be < 3 seconds)
   - Search response time (should be instant)
   - Filter response time (should be < 1 second)
   - Pagination navigation (should be instant)

3. Open browser dev tools (F12)
4. Check Network tab for slow queries
5. Check Console for errors
```

---

## 🐛 KNOWN ISSUES TO FIX

### HIGH PRIORITY
1. ❌ **Gender Demographics Not Showing**
   - Location: `/app/(dashboard)/members/_components/members-client.tsx:667-672`
   - Fix: Case-insensitive gender comparison
   - Impact: Statistics cards show 0 for Hombres/Mujeres

2. ❌ **No Family Grouping Feature**
   - Status: Feature doesn't exist yet
   - Impact: Cannot view families together
   - Solution: Add Families tab (new feature request)

### MEDIUM PRIORITY
3. ⚠️ **Gender Filter Doesn't Match Data**
   - Location: Same file, line 341
   - Data uses "Masculino"/"Femenino" (capitalized)
   - Filter checks "masculino"/"femenino" (lowercase)
   - Fix: Case-insensitive filter

4. ⚠️ **No Member Photos**
   - All 999 members have NULL photo field
   - Impact: Member list shows no avatars
   - Solution: Add photo upload in member form

### LOW PRIORITY
5. ℹ️ **Spiritual Gifts Not Populated**
   - Migrated members don't have spiritual gifts assigned
   - Impact: Volunteer recommendations less accurate
   - Solution: Add spiritual gifts assessment workflow

6. ℹ️ **All Users Have Same Password**
   - 56 user accounts all use "ChurchMember2025!"
   - Impact: Security concern for production
   - Solution: Force password reset on first login

---

## 📊 EXPECTED TEST RESULTS

### If Everything Works:
✅ 999 members visible  
✅ ~500 Hombres, ~500 Mujeres (after fix)  
✅ Search returns relevant results  
✅ Smart lists filter correctly  
✅ Automation executes and logs  
✅ Email/SMS notifications sent  
✅ Volunteer recruitment creates volunteer records  
✅ Export downloads complete member list  
✅ Role permissions enforced correctly  
✅ Performance acceptable with 999 members  

### Current Status:
✅ 999 members loaded correctly  
✅ Member list displays  
✅ Search works  
✅ Pagination works  
❌ Gender statistics broken (shows 0/0)  
⚠️ Automation untested (needs manual verification)  
⚠️ Family grouping doesn't exist (feature request)  

---

## 🚀 RECOMMENDED TESTING ORDER

**Start Here** (Most Important → Least Important):

1. **Fix Gender Stats Bug** (5 min) ⚡ URGENT
2. **Test Automation** (15 min) ⚡ CRITICAL
3. **Test Member CRUD** (10 min)
4. **Test Volunteer System** (10 min)
5. **Test Search & Filters** (10 min)
6. **Test Smart Lists** (10 min)
7. **Test Export** (5 min)
8. **Test Permissions** (10 min)
9. **Test Performance** (5 min)
10. **Plan Family Feature** (future)

**Total Testing Time: ~90 minutes for complete platform validation**

---

## 📞 SUPPORT

**Issues or Questions?**
- Check `MIGRATION_TESTING_COMPLETE.md` for setup details
- Review `TENANT_LOGIN_CREDENTIALS.md` for all login credentials
- Check browser console (F12) for JavaScript errors
- Check Network tab for failed API calls

**Automation Help:**
- See `/help/manual/automation-rules` in the app
- Check `/automation-rules/dashboard` for execution logs
- Review `AUTOMATION_SYSTEM_DOCUMENTATION.md`

---

*Testing Guide created: October 17, 2025*  
*Platform: Khesed-Tek CMS v1.0*  
*Test Environment: Railway Production with 999 migrated members*
