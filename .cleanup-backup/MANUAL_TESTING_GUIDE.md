# 🧪 MANUAL AUTOMATION TESTING GUIDE

Since the database seed script is hanging, here's how to test automation **manually through the UI**:

---

## ⚡ QUICK TEST PLAN (5 Minutes)

### **OPTION A: Test in Development Server** (Recommended)

1. **Start Dev Server** (if not running):
   ```bash
   npm run dev
   ```

2. **Login to App**:
   - Go to http://localhost:3000
   - Login with your admin credentials
   - Make sure you have a church and user account

3. **Test Prayer Automation** (2 min):
   ```
   ✅ Go to: /prayer-requests
   ✅ Create new prayer request with:
      - Category: URGENT
      - Title: "Test Urgent Prayer"
      - Description: "Testing automation flow"
   ✅ Check browser console for logs
   ✅ Expected: PrayerAutomationService.processPrayerRequest() called
   ```

4. **Test Visitor Automation** (2 min):
   ```
   ✅ Go to: /check-ins (or visitor check-in page)
   ✅ Create new check-in with:
      - Visitor Name: "Test First Timer"
      - Email: "test@example.com"
      - Phone: "+1234567890"
   ✅ Check browser console for logs
   ✅ Expected: VisitorAutomationService.processVisitor() called
   ```

5. **Verify Execution**:
   ```
   ✅ Open browser DevTools → Network tab
   ✅ Look for API calls to:
      - POST /api/prayer-requests (should succeed)
      - POST /api/check-ins (should succeed)
   ✅ Check server terminal for automation logs
   ```

---

## 🔍 VERIFICATION CHECKLIST

### What to Look For in Server Logs:

```bash
# Terminal running 'npm run dev' should show:

✅ "Processing prayer request automation for ID: clxxx..."
✅ "Found X active automation rules for trigger: PRAYER_REQUEST_URGENT"
✅ "Executing automation rule: [rule name]"
✅ "Automation execution completed successfully"

OR (if no rules):
⚠️  "No active automation rules found for trigger: PRAYER_REQUEST_URGENT"
```

### What to Check in Database:

```bash
# Quick database query:
npx prisma studio

# Then check:
1. AutomationExecution table → Should have new entries
2. VisitorProfile table → Should have new profile created
3. VisitorFollowUp table → Should have follow-up tasks (if bypassApproval=false)
```

---

## 🚀 FASTER ALTERNATIVE: Direct API Test

**Skip UI, test APIs directly:**

```bash
# 1. Get auth token first (from browser cookies after login)
# 2. Test Prayer API:
curl -X POST http://localhost:3000/api/prayer-requests \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "category": "URGENT",
    "title": "API Test Prayer",
    "description": "Testing automation",
    "prayerType": "HEALING",
    "isPublic": false
  }'

# 3. Test Check-in API:
curl -X POST http://localhost:3000/api/check-ins \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "visitorName": "API Test Visitor",
    "visitorEmail": "api@test.com",
    "visitorPhone": "+1234567890",
    "checkInDate": "2025-10-16T10:00:00Z",
    "source": "MANUAL"
  }'
```

---

## 📊 EXPECTED RESULTS

### ✅ SUCCESS Indicators:

1. **API Response 200/201** - Request created successfully
2. **Server logs show automation trigger** - Service called
3. **AutomationExecution records created** - Database updated
4. **No errors in console** - Clean execution

### ⚠️ EXPECTED WARNINGS (Normal):

- "No active automation rules found" → Need to activate templates first
- "bypassApproval=false, creating manual task" → Working as designed
- "SMS/Email service not configured" → Need Twilio/Mailgun setup

### ❌ FAILURE Indicators:

- API returns 500 error → Check server logs for stack trace
- "Cannot find module" errors → Missing dependencies
- Prisma errors → Database connection issues

---

## 🎯 WHAT WE'RE TESTING

### Prayer Automation Flow:
```
User creates prayer (UI/API)
  ↓
POST /api/prayer-requests
  ↓
PrayerAutomationService.processPrayerRequest(id)
  ↓
Find active rules for trigger "PRAYER_REQUEST_URGENT"
  ↓
Evaluate conditions (category === URGENT)
  ↓
IF bypassApproval=true:
  → Execute actions (SMS/Email/Push)
  → Create AutomationExecution record
ELSE:
  → Create VisitorFollowUp task for manual approval
```

### Visitor Automation Flow:
```
User creates check-in (UI/API)
  ↓
POST /api/check-ins
  ↓
VisitorAutomationService.processVisitor(checkInId)
  ↓
Count previous visits by email/phone
  ↓
Auto-categorize (FIRST_TIME, RETURNING, REGULAR, MEMBER_CANDIDATE)
  ↓
Create/Update VisitorProfile
  ↓
Find active rules for trigger "VISITOR_FIRST_TIME"
  ↓
Execute or create manual task
```

---

## 💡 QUICKEST TEST (30 seconds):

**Just check if the code is hooked up:**

1. Open `app/api/prayer-requests/route.ts` line 189-196
   - Verify: `PrayerAutomationService.processPrayerRequest()` is called ✅

2. Open `app/api/check-ins/route.ts` 
   - Verify: `VisitorAutomationService.processVisitor()` is called ✅

3. Start dev server and watch terminal:
   ```bash
   npm run dev
   ```

4. Create ONE test prayer request in the UI

5. Watch server terminal for:
   ```
   "Processing prayer request automation..." ← SUCCESS!
   ```

**If you see that log, automation is working! 🎉**

---

## 🔧 TROUBLESHOOTING

### If no logs appear:

1. **Check imports** in API routes:
   ```typescript
   // Should have:
   import { PrayerAutomationService } from '@/lib/services/prayer-automation'
   import { VisitorAutomationService } from '@/lib/services/visitor-automation'
   ```

2. **Check dynamic imports** (if using):
   ```typescript
   const { PrayerAutomationService } = await import('@/lib/services/prayer-automation')
   ```

3. **Check try-catch blocks** - Errors might be silently caught

### If "No automation rules found":

This is EXPECTED! You need to:
1. Go to `/automation-rules/templates`
2. Activate at least 1 template
3. Test again

---

## 📈 NEXT STEP AFTER TESTING

Once you confirm automation triggers are being called:

**BUILD THE DASHBOARD** to monitor executions visually:
```
/automation-rules/dashboard
- Show execution history
- Success/failure rates
- Manual approval queue
- Retry attempts
- Real-time monitoring
```

---

**🚀 RECOMMENDATION: Test in UI (Option A) - Takes 2 minutes, visual confirmation!**
