# ⚡ AUTOMATION TESTING - QUICK START

**Status:** ✅ Dev server running on http://localhost:3000  
**Date:** October 16, 2025  
**Build:** 174 routes compiled successfully

---

## 🎯 WHY MANUAL TESTING IS FASTER

**The Problem:**
- Database seed script was hanging (trying to install tsx interactively)
- Would take 5+ minutes to seed entire database
- We don't actually need seed data to test automation!

**The Solution:**
- ✅ Test directly in the running app
- ✅ Create test data through the UI (2 minutes)
- ✅ Watch server logs in real-time
- ✅ Immediate feedback

---

## 🚀 3-STEP QUICK TEST (2 MINUTES)

### **STEP 1: Open the App** (10 seconds)
```
✅ Server running: http://localhost:3000
✅ Login with your admin credentials
✅ Make sure you have a church account
```

### **STEP 2: Test Prayer Automation** (1 minute)
```
1. Go to: http://localhost:3000/prayer-requests
2. Click "New Prayer Request"
3. Fill in:
   - Category: URGENT ← Important!
   - Title: "Test Automation"
   - Description: "Testing flow"
4. Submit
5. Watch terminal for logs ↓
```

**Expected Terminal Output:**
```bash
# Terminal should show:
Processing prayer request automation for ID: clxxx...
✅ Found rules for PRAYER_REQUEST_URGENT
✅ Executing automation...
```

OR (if no templates activated yet):
```bash
⚠️  No active automation rules found for trigger: PRAYER_REQUEST_URGENT
   → This is NORMAL - you need to activate templates first!
```

### **STEP 3: Test Visitor Automation** (1 minute)
```
1. Go to: http://localhost:3000/check-ins
2. Create new check-in:
   - Name: "Test Visitor"
   - Email: "test@example.com"  
   - Phone: "+1234567890"
3. Submit
4. Watch terminal for logs ↓
```

**Expected Terminal Output:**
```bash
Processing visitor check-in automation for ID: clxxx...
✅ Auto-categorized as: FIRST_TIME (0 previous visits)
✅ Created VisitorProfile
✅ Executing automation...
```

---

## 📊 WHAT TO VERIFY

### ✅ SUCCESS = You See These Logs:
- `"Processing prayer request automation..."`
- `"Processing visitor check-in automation..."`
- `"Auto-categorized as: FIRST_TIME"`
- `"Created/Updated VisitorProfile"`

### ⚠️ EXPECTED WARNINGS (Normal):
- `"No active automation rules found"` → Need to activate templates
- `"bypassApproval=false, creating follow-up task"` → Working correctly
- `"SMS/Email not configured"` → Need to setup Twilio/Mailgun

### ❌ ERRORS TO INVESTIGATE:
- Stack traces in terminal
- 500 errors in browser
- "Cannot find module" errors

---

## 🎨 VISUAL CONFIRMATION

### What You'll See in Browser:
1. **Prayer Request Created** → Success message
2. **Check-In Created** → Visitor added to list
3. **No errors** → Good sign!

### What You'll See in Terminal:
1. **Automation logs** → Services are being called ✅
2. **Database queries** → Prisma operations
3. **Execution results** → Success or informational warnings

---

## 📝 TEST CHECKLIST

Copy this and check off as you test:

```
PRAYER AUTOMATION:
[ ] Created urgent prayer request in UI
[ ] Saw "Processing prayer request automation" in terminal
[ ] No errors in browser console
[ ] No errors in server terminal

VISITOR AUTOMATION:
[ ] Created first-time check-in in UI
[ ] Saw "Processing visitor check-in automation" in terminal
[ ] Saw "Auto-categorized as: FIRST_TIME" in terminal
[ ] Saw "Created VisitorProfile" in terminal
[ ] No errors

INTEGRATION VERIFICATION:
[ ] Both automation services are being called
[ ] Services execute without crashing
[ ] Database operations succeed
[ ] Ready to activate templates!
```

---

## 🔧 IF NO LOGS APPEAR

**This means the automation hooks might not be firing. Check:**

1. **Verify code changes were saved:**
   ```bash
   git diff app/api/prayer-requests/route.ts
   git diff app/api/check-ins/route.ts
   ```

2. **Restart dev server:**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

3. **Check imports in API routes:**
   - Should have dynamic imports of automation services
   - Should call `.processPrayerRequest()` and `.processVisitor()`

---

## 🎯 NEXT STEPS AFTER VERIFICATION

### Once you confirm logs appear:

**OPTION A: Activate Templates** (5 min)
```
1. Go to /automation-rules/templates
2. Activate 3-4 pre-built templates
3. Re-test to see actual executions
4. Check AutomationExecution table in Prisma Studio
```

**OPTION B: Build Dashboard** (30 min)
```
1. Create /automation-rules/dashboard page
2. Show execution history from AutomationExecution table
3. Display success/failure rates
4. Show manual approval queue
5. Real-time monitoring
```

**OPTION C: End-to-End Integration Test** (10 min)
```
1. Activate templates
2. Configure Twilio SMS (test phone)
3. Configure Mailgun Email (test email)
4. Create real prayer request
5. Verify SMS/Email received
6. Test retry/fallback logic
```

---

## 💡 RECOMMENDED PATH

```
✅ 1. Quick test (2 min) ← YOU ARE HERE
   → Verify automation services are called
   
✅ 2. Activate 2-3 templates (5 min)
   → See actual rule execution
   
✅ 3. Build dashboard (30 min)
   → Visual monitoring of executions
   
✅ 4. Full E2E test (10 min)
   → Real SMS/Email with test credentials
```

---

## 🚀 START TESTING NOW!

**Your dev server is ready:** http://localhost:3000

**Just:**
1. Login
2. Create 1 urgent prayer request
3. Watch the terminal

**If you see automation logs → SUCCESS! 🎉**  
**If not → Check the troubleshooting steps above**

---

**📞 Questions?**
- Check `/MANUAL_TESTING_GUIDE.md` for detailed instructions
- Check server terminal for error messages
- Check browser console for client errors

**Ready to test? Go to: http://localhost:3000** 🚀
