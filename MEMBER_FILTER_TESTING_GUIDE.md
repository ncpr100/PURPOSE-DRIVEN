# MEMBER FILTER TESTING GUIDE

**Date:** October 21, 2025  
**Issue:** Filters showing correct count at dashboard but not in members section  
**Status:** Testing & Verification

---

## 🔍 DIAGNOSTIC STEPS

### Step 1: Verify Data is Being Fetched

**Open Developer Console** (F12) and navigate to `/members`

Check console logs for:
```
📊 Total members: X
🎯 Active filters: { searchTerm, genderFilter, ageFilter, maritalStatusFilter, activeSmartList }
✅ Filtered result: Y members
```

### Step 2: Test Each Filter Individually

#### A. Gender Filter
1. Navigate to `/members`
2. Select "Masculino" from gender dropdown
3. Check console: Should show filtered count
4. Verify table displays only male members
5. Repeat for "Femenino"

**Expected Behavior:**
- Filter should be case-insensitive
- Should match `gender` field exactly

#### B. Age Filter
1. Select age range (e.g., "18-25")
2. Check console for filtered count
3. Verify only members in that age range show

**Expected Behavior:**
- Calculates age from `birthDate`
- Filters members without birthDate

#### C. Marital Status Filter
1. Select status (Soltero/Casado/etc.)
2. Check console logs
3. Verify only matching members show

#### D. Smart Lists
Test each smart list:
- "Nuevos Miembros" (last 30 days)
- "Miembros Inactivos" (6+ months)
- "Cumpleaños Este Mes"
- "Aniversarios"
- "Candidatos a Voluntarios"
- "Voluntarios Activos"
- "Listos para Liderazgo"

---

## 🐛 KNOWN ISSUES & FIXES

### Issue 1: Gender Filter Case Sensitivity
**Problem:** Gender values in DB might be "masculino" but filter expects "Masculino"

**Current Fix in Code (Line 363):**
```typescript
if (genderFilter !== 'all') {
  filtered = filtered.filter(member => 
    member.gender?.toLowerCase() === genderFilter.toLowerCase()
  )
}
```

**Status:** ✅ FIXED (case-insensitive comparison)

### Issue 2: Missing Fields in API Response
**Problem:** API wasn't returning gender/maritalStatus fields

**Fix Applied:**
```typescript
// In /api/members/route.ts
select: {
  gender: true,
  maritalStatus: true,
  birthDate: true,
  // ... other fields
}
```

**Status:** ✅ FIXED

### Issue 3: Filter Not Triggering Re-render
**Problem:** Filters update state but UI doesn't refresh

**Check:** Verify `useEffect` dependency array
```typescript
useEffect(() => {
  filterMembers()
}, [members, searchTerm, genderFilter, ageFilter, maritalStatusFilter, activeSmartList])
```

**Status:** ✅ CORRECT (all dependencies included)

---

## 📊 TEST CASES

### Test Case 1: Gender Filter
```
1. Initial state: Show all members (e.g., 50 total)
2. Select gender: "Masculino"
3. Expected: Only male members show
4. Actual count should match filtered count in console
```

### Test Case 2: Combined Filters
```
1. Select gender: "Femenino"
2. Select age: "26-35"
3. Expected: Only females aged 26-35
4. Counts should match at all levels
```

### Test Case 3: Smart List + Regular Filter
```
1. Select "Nuevos Miembros" smart list
2. Apply gender filter
3. Expected: New female members only
4. Filters should work together
```

---

## 🔧 DEBUGGING COMMANDS

### Check Members Data in Console
```javascript
// In browser console on /members page
console.log('All members:', members)
console.log('Filtered members:', filteredMembers)
console.log('Gender filter value:', genderFilter)
console.log('Members with gender:', members.filter(m => m.gender))
```

### Verify Filter Logic
```javascript
// Test filter manually
const testFilter = 'masculino'
const result = members.filter(m => 
  m.gender?.toLowerCase() === testFilter.toLowerCase()
)
console.log('Manual filter result:', result.length)
```

---

## ✅ VERIFICATION CHECKLIST

### API Level
- [ ] GET /api/members returns all members
- [ ] Response includes `gender` field
- [ ] Response includes `maritalStatus` field
- [ ] Response includes `birthDate` field
- [ ] Console shows member count

### Client Level
- [ ] `filterMembers()` function is called
- [ ] Console logs show filter params
- [ ] Console shows filtered count
- [ ] `setFilteredMembers()` is called
- [ ] Component re-renders with filtered data

### UI Level
- [ ] Table displays filtered members
- [ ] Member count matches filtered count
- [ ] Filter dropdowns show correct values
- [ ] Clear filters button works
- [ ] Search + filters work together

---

## 🎯 EXPECTED BEHAVIOR

### Correct Flow:
```
1. User selects filter → State updates
2. useEffect triggers → filterMembers() called
3. Filter logic executes → filteredMembers calculated
4. setFilteredMembers() → State updated
5. Component re-renders → Table shows filtered data
```

### Dashboard vs Members Page:
**Dashboard:** Shows aggregate counts (server-side)
**Members Page:** Shows filtered list (client-side)

Both should match when using same criteria!

---

## 🚨 IF FILTERS STILL NOT WORKING

### Check 1: State Management
```typescript
// Verify state is updating
console.log('Gender filter changed to:', genderFilter)
```

### Check 2: Data Structure
```typescript
// Check if gender field exists
console.log('Sample member:', members[0])
console.log('Gender value:', members[0]?.gender)
console.log('Type:', typeof members[0]?.gender)
```

### Check 3: Filter Logic
```typescript
// Add detailed logging in filterMembers()
console.log('🔍 Before gender filter:', filtered.length)
console.log('🎯 Gender filter value:', genderFilter)
if (genderFilter !== 'all') {
  console.log('🔍 Members with gender:', filtered.filter(m => m.gender))
  filtered = filtered.filter(member => {
    const match = member.gender?.toLowerCase() === genderFilter.toLowerCase()
    if (!match && member.gender) {
      console.log('❌ No match:', member.gender, 'vs', genderFilter)
    }
    return match
  })
  console.log('✅ After gender filter:', filtered.length)
}
```

---

## 📝 TESTING LOG TEMPLATE

```
Date: ___________
Tester: ___________

Filter Type: ___________
Expected Count: ___________
Actual Count: ___________
Console Output: ___________
Issue Found: ___________
```

---

**TESTING STATUS:** Ready for Manual Testing  
**NEXT STEP:** Navigate to /members and test each filter  
**REPORT ISSUES:** Document any mismatches between expected and actual counts
