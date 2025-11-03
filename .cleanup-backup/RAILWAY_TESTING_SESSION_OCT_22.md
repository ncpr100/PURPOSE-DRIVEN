# 🧪 RAILWAY TESTING SESSION - Profile Dialog Fixes

**Date**: October 22, 2025  
**Railway URL**: https://khesed-tek-cms.up.railway.app  
**Commit**: `23789e0` - Profile Dialog migration to NEW system  
**Tester**: Ready for your testing  

---

## 🎯 TESTING OBJECTIVES

Verify that the Profile Dialog now:
1. ✅ Shows **formatted availability** instead of raw JSON
2. ✅ Shows **REAL match scores** calculated from spiritual gifts (not hardcoded 95%, 88%, 82%)
3. ✅ All volunteer tabs use **NEW spiritual profile system**
4. ✅ Assignment dialogs work without alert() blocking

---

## 🔐 LOGIN CREDENTIALS

### Super Admin Account
```
Email: soporte@khesedtek.com
Password: SuperAdmin2024!
Role: SUPER_ADMIN
```

### Tenant Account (Alternative)
```
Email: pastor@example.com
Password: pastor123
Role: PASTOR
Church: Iglesia Comunidad de Fe
```

---

## 🚀 QUICK START (5 Minutes)

### STEP 1: Login
1. Go to: https://khesed-tek-cms.up.railway.app/auth/signin
2. Enter credentials: `soporte@khesedtek.com` / `SuperAdmin2024!`
3. Click "Iniciar Sesión"
4. **Expected**: Dashboard loads successfully ✅

### STEP 2: Navigate to Volunteers
1. Click **"Voluntarios"** in sidebar
2. You should see the volunteer dashboard with 8 tabs
3. **Expected**: Dashboard displays without errors ✅

### STEP 3: Quick Profile Dialog Test
1. Click **"Gestión"** tab
2. Find any volunteer card
3. Click **"Ver Perfil"** button
4. **CRITICAL CHECKS**:
   - ❌ **FAIL** if availability shows: `{"days":[],"times":[],"frequency":"weekly"}`
   - ✅ **PASS** if availability shows: `Disponible Lunes, Martes (Mañana) - Semanal` or `No se ha registrado disponibilidad`
   - ❌ **FAIL** if recommendations show: `95% match`, `88% match`, `82% match`
   - ✅ **PASS** if recommendations show calculated scores like: `87% match`, `73% match`, etc.

**If both PASS → System is working! Continue to detailed tests.**  
**If either FAIL → Report immediately with screenshot.**

---

## 📋 DETAILED TEST SCENARIOS

### 🧪 TEST 1: Profile Dialog - Volunteer WITH Spiritual Profile

**Objective**: Verify Profile Dialog displays REAL data from NEW system

**Steps**:
1. Navigate to **Voluntarios → Gestión** tab
2. Look for volunteer with higher match score in **Recomendaciones** tab (these likely have spiritual profiles)
3. Click **"Ver Perfil"** on that volunteer
4. Profile Dialog should open

**✅ EXPECTED RESULTS**:

#### Availability Section
- [ ] Shows human-readable text like:
  - `"Disponible Lunes, Martes, Miércoles (Mañana, Tarde) - Semanal"`
  - `"Disponible Domingo (Mañana) - Semanal"`
  - `"No se ha registrado disponibilidad"` (if no data)
- [ ] **NOT** showing raw JSON: `{"days":["monday"],"times":["morning"],"frequency":"weekly"}`
- [ ] If volunteer has notes, shows below in italics
- [ ] Format is clear and user-friendly

#### Spiritual Gifts Section
- [ ] Shows **"Dones Primarios"** with blue badges (e.g., "Enseñanza", "Liderazgo")
- [ ] Shows **"Dones Secundarios"** with outline badges (e.g., "Sabiduría")
- [ ] Shows **"Llamado Espiritual"** text if available
- [ ] Shows **"Pasiones Ministeriales"** with green badges (e.g., "Enseñanza", "Discipulado")
- [ ] If no profile: Shows "No hay evaluación de dones espirituales" with button

#### Recommendations Section
- [ ] Shows **real spiritual gifts** in recommendations (e.g., "3 dones primarios identificados: Enseñanza, Liderazgo, Sabiduría")
- [ ] Match score is **calculated** (between 50-100%), **NOT** hardcoded 95%, 88%, 82%
- [ ] **"Potencial para desarrollo de liderazgo"** badge **ONLY** appears if volunteer has leadership-related gifts (Liderazgo, Administración, Sabiduría)
- [ ] **"Disponibilidad dominical confirmada"** badge **ONLY** appears if volunteer's availability matrix includes Sunday
- [ ] **"Pasiones ministeriales identificadas"** shows actual count from profile
- [ ] All recommendations are **data-driven**, not random/hardcoded

#### Assignment History
- [ ] Shows list of assignments or "No hay asignaciones registradas"

**❌ FAILURE INDICATORS**:
- Seeing `{"days":[...],"times":[...],"frequency":"..."}` instead of formatted text
- Seeing hardcoded match scores: `95% match`, `88% match`, `82% match`
- Leadership badge showing for volunteer without leadership gifts
- Sunday badge showing for volunteer not available on Sunday

---

### 🧪 TEST 2: Profile Dialog - Volunteer WITHOUT Spiritual Profile

**Objective**: Verify system handles volunteers without spiritual assessment

**Steps**:
1. Navigate to **Voluntarios → Recomendaciones** tab
2. Look for volunteer with **50% match** score (these likely don't have spiritual profiles)
3. Go to **Gestión** tab
4. Click **"Ver Perfil"** on that volunteer

**✅ EXPECTED RESULTS**:

#### Availability Section
- [ ] Shows: `"No se ha registrado disponibilidad"` if no matrix saved
- [ ] OR shows formatted availability if they have matrix but no spiritual profile

#### Spiritual Gifts Section
- [ ] Shows brain icon 🧠
- [ ] Shows message: `"No hay evaluación de dones espirituales"`
- [ ] Shows sub-message: `"El voluntario no ha completado la evaluación"`
- [ ] Shows button: **"Completar Evaluación Espiritual"**
- [ ] Clicking button navigates to spiritual assessment page

#### Recommendations Section
- [ ] Shows **yellow warning box** with lightbulb icon 💡
- [ ] Title: `"Evaluación espiritual pendiente"`
- [ ] Message: `"Complete la evaluación para obtener recomendaciones inteligentes"`
- [ ] **NO** hardcoded fake recommendations visible

**❌ FAILURE INDICATORS**:
- Showing fake recommendations for volunteer without profile
- Error messages or blank sections
- Button not working

---

### 🧪 TEST 3: Recommendations Tab - Real Match Scores

**Objective**: Verify Recommendations tab shows REAL data, not hardcoded

**Steps**:
1. Navigate to **Voluntarios → Recomendaciones** tab
2. Look at the recommendation cards displayed
3. Note the match scores and spiritual gifts shown

**✅ EXPECTED RESULTS**:

#### For Volunteers WITH Spiritual Profile:
- [ ] Match score between **65-100%** (calculated based on actual spiritual gifts)
- [ ] Shows **actual spiritual gifts** from profile:
  - Example: "Dones identificados: Enseñanza, Liderazgo, Sabiduría"
  - Example: "Pasiones: Enseñanza, Discipulado"
- [ ] **NOT** showing hardcoded text: "Ministerio de Alabanza"
- [ ] Ministry suggestions are **dynamic** based on actual gifts

#### For Volunteers WITHOUT Spiritual Profile:
- [ ] Match score is exactly **50%** (base score)
- [ ] Shows warning: "⚠️ Este voluntario no ha completado su evaluación espiritual"
- [ ] Shows message: "Complete la evaluación para obtener recomendaciones personalizadas"

#### Match Score Calculation Check:
Pick one volunteer with visible spiritual profile and manually verify:
- [ ] Formula: `50 + (primaryGifts × 10) + (secondaryGifts × 5) + (passions × 3)`
- [ ] Example: If volunteer has 2 primary gifts, 1 secondary gift, 2 passions:
  - Calculation: `50 + (2×10) + (1×5) + (2×3) = 50 + 20 + 5 + 6 = 81%`
  - Displayed score should match calculation

**❌ FAILURE INDICATORS**:
- Seeing "Ministerio de Alabanza" for all volunteers
- Match scores stuck at 95%, 88%, 82%, 70%
- Random scores that don't match spiritual profile data

---

### 🧪 TEST 4: Edit and Save Availability Matrix

**Objective**: Verify availability saves and displays correctly

**Steps**:
1. Navigate to **Miembros** (Members)
2. Click on any member
3. Go to **"Disponibilidad"** tab
4. Select some days and times:
   - Check **Lunes** (Monday) → **Mañana** (Morning)
   - Check **Martes** (Tuesday) → **Tarde** (Afternoon)
   - Check **Domingo** (Sunday) → **Mañana** (Morning)
5. Select frequency: **Semanal** (Weekly)
6. Add note: `"Prefiero servicio de 9am"`
7. Click **"Guardar Disponibilidad"** button
8. Wait for toast notification
9. Refresh the page (F5)
10. Go to **Voluntarios → Gestión** tab
11. Find the same member and click **"Ver Perfil"**

**✅ EXPECTED RESULTS**:

#### After Clicking Save:
- [ ] Green toast notification appears: `"✅ Disponibilidad guardada correctamente"`
- [ ] No errors in console
- [ ] Button returns to normal state (not stuck in loading)

#### After Page Refresh:
- [ ] Disponibilidad tab still shows checked boxes for Monday, Tuesday, Sunday
- [ ] Notes field still shows: "Prefiero servicio de 9am"
- [ ] Data persisted correctly ✅

#### In Profile Dialog:
- [ ] Availability section shows: `"Disponible Lunes, Martes, Domingo (Mañana, Tarde) - Semanal"`
- [ ] Notes appear below in italics: *"Prefiero servicio de 9am"*
- [ ] If Sunday is checked, Recommendations section shows: `"📅 Disponibilidad dominical confirmada [Excelente]"`

**❌ FAILURE INDICATORS**:
- No toast notification after save
- Data doesn't persist after refresh
- Still showing raw JSON in Profile Dialog
- Sunday badge not appearing despite Sunday being checked

---

### 🧪 TEST 5: Complete Spiritual Assessment

**Objective**: Verify spiritual assessment saves and updates Profile Dialog

**Steps**:
1. Navigate to **Miembros** (Members)
2. Click on member without spiritual assessment (you can check in Voluntarios → Recomendaciones for 50% match volunteers)
3. Go to **"Evaluación Espiritual"** tab
4. Fill out all 8 categories:
   - **Dones Primarios**: Select "Enseñanza" and "Liderazgo"
   - **Dones Secundarios**: Select "Sabiduría" and "Fe"
   - **Pasiones Ministeriales**: Select "Enseñanza" and "Discipulado"
   - **Nivel de Experiencia**: Select "Intermedio (1-3 años)"
   - **Disponibilidad General**: Enter "Fines de semana y miércoles por la noche"
   - **Llamado Espiritual**: Enter "Enseñar y formar discípulos en la fe"
   - **Motivación**: Enter "Servir a Dios y edificar su iglesia"
   - **Áreas de Crecimiento**: Select "Evangelismo" and "Oración"
5. Click **"Guardar Evaluación Espiritual"**
6. Wait for toast notification
7. Refresh page (F5)
8. Go to **Voluntarios → Gestión** tab
9. Find same member and click **"Ver Perfil"**
10. Also check **Voluntarios → Recomendaciones** tab

**✅ EXPECTED RESULTS**:

#### After Clicking Save:
- [ ] Green toast notification: `"✅ Evaluación espiritual guardada correctamente"`
- [ ] No errors in console

#### After Page Refresh:
- [ ] Evaluación Espiritual tab still shows all filled data
- [ ] Data persisted correctly ✅

#### In Profile Dialog - Spiritual Gifts Section:
- [ ] Shows **"Dones Primarios"**: "Enseñanza", "Liderazgo" (blue badges)
- [ ] Shows **"Dones Secundarios"**: "Sabiduría", "Fe" (outline badges)
- [ ] Shows **"Llamado Espiritual"**: "Enseñar y formar discípulos en la fe"
- [ ] Shows **"Pasiones Ministeriales"**: "Enseñanza", "Discipulado" (green badges)

#### In Profile Dialog - Recommendations Section:
- [ ] Shows: `"✨ 2 dones primarios identificados: Enseñanza, Liderazgo"`
- [ ] Match score approximately: `50 + (2×10) + (2×5) + (2×3) = 50 + 20 + 10 + 6 = 86%`
- [ ] Shows: `"👑 Potencial para desarrollo de liderazgo [Alto]"` (because has Liderazgo gift)
- [ ] Shows: `"🎯 2 pasiones ministeriales identificadas [Activo]"`

#### In Recommendations Tab:
- [ ] Volunteer now shows higher match score (should be ~86%)
- [ ] Shows actual spiritual gifts: "Enseñanza, Liderazgo"
- [ ] Shows ministry suggestions based on gifts (e.g., "Ministerio de Enseñanza", "Liderazgo de Grupos")

**❌ FAILURE INDICATORS**:
- Validation error even though all fields filled
- Data doesn't persist after refresh
- Profile Dialog still shows "No hay evaluación"
- Recommendations tab still shows 50% match

---

### 🧪 TEST 6: Assignment Dialog - Temporary Assignment

**Objective**: Verify temporary assignment creation works

**Steps**:
1. Navigate to **Voluntarios → Gestión** tab
2. Click **"Asignar Actividad"** on any volunteer
3. Assignment Dialog should open **without alert()**
4. Select **"Tipo de Asignación"**: **"Temporal"**
5. Fill required fields:
   - **Título**: "Servicio de Navidad 2025"
   - **Descripción**: "Apoyo en organización del evento navideño"
   - **Fecha de Inicio**: December 1, 2025
   - **Fecha de Fin**: December 31, 2025
   - **Hora de Inicio**: 09:00
   - **Hora de Fin**: 18:00
6. Click **"Crear Asignación"**

**✅ EXPECTED RESULTS**:
- [ ] Dialog opens without alert() blocking
- [ ] Date and time fields are **required** for Temporal type
- [ ] Green toast notification: `"✅ Asignación creada exitosamente"`
- [ ] Dialog closes
- [ ] Assignment appears in volunteer's profile

**❌ FAILURE INDICATORS**:
- Alert() blocks dialog from opening
- Can submit without date/time (should be required)
- No toast notification

---

### 🧪 TEST 7: Assignment Dialog - Permanent Assignment

**Objective**: Verify permanent assignment creation works

**Steps**:
1. Navigate to **Voluntarios → Gestión** tab
2. Click **"Asignar Actividad"** on any volunteer
3. Select **"Tipo de Asignación"**: **"Permanente"**
4. Fill required fields:
   - **Título**: "Líder de Grupo Pequeño"
   - **Descripción**: "Facilitar grupo de estudio bíblico semanal"
5. **Do NOT fill** date or time fields (should not be required)
6. Click **"Crear Asignación"**

**✅ EXPECTED RESULTS**:
- [ ] Date and time fields are **NOT required** for Permanente type
- [ ] Can submit successfully without dates
- [ ] Green toast notification: `"✅ Asignación creada exitosamente"`
- [ ] Dialog closes
- [ ] Assignment appears in volunteer's profile

**❌ FAILURE INDICATORS**:
- Validation error requiring dates for permanent assignment
- Alert() blocking dialog
- No toast notification

---

### 🧪 TEST 8: Consistency Check - Match Scores Across Tabs

**Objective**: Verify match scores are consistent between Recommendations tab and Profile Dialog

**Steps**:
1. Navigate to **Voluntarios → Recomendaciones** tab
2. Note the match score for a specific volunteer (e.g., "Juan Pachanga - 87% match")
3. Navigate to **Voluntarios → Gestión** tab
4. Click **"Ver Perfil"** on the same volunteer
5. Look at match score in Recommendations section

**✅ EXPECTED RESULTS**:
- [ ] Match score in **Recommendations tab** = Match score in **Profile Dialog**
- [ ] Both use same formula: `50 + (primaryGifts × 10) + (secondaryGifts × 5) + (passions × 3)`
- [ ] Primary gifts listed are identical in both places
- [ ] Ministry passions are identical in both places

**❌ FAILURE INDICATORS**:
- Different match scores in different locations
- Different spiritual gifts displayed
- Inconsistent data

---

## 🐛 DEBUGGING CHECKLIST

If you encounter issues, check these:

### Browser Console Errors
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for errors (red text)
4. Take screenshot if errors appear

**Common Errors to Watch For**:
- `Error loading availability matrix`
- `Error loading member spiritual profile`
- `Failed to fetch`
- TypeScript errors

### Network Tab
1. Press **F12** → **Network** tab
2. Reload page
3. Look for failed requests (red status codes)
4. Check these endpoints:
   - `/api/members/[id]/spiritual-profile` → Should return 200 OK
   - `/api/availability-matrix?memberId=[id]` → Should return 200 OK
   - `/api/volunteers` → Should return 200 OK

### Data Verification
Open **Console** tab and run:
```javascript
// Check if spiritual profiles are loading
console.log('Volunteer profiles loaded:', window.volunteerProfiles)
```

---

## 📊 TEST RESULTS TEMPLATE

Use this template to report results:

```
## Profile Dialog Testing Report

**Tester**: [Your Name]
**Date**: October 22, 2025
**Railway URL**: https://khesed-tek-cms.up.railway.app
**Browser**: Chrome/Firefox/Safari
**Login**: soporte@khesedtek.com

### ✅ PASSED TESTS:
- [ ] TEST 1: Profile Dialog - Volunteer WITH Profile
  - Availability: FORMATTED ✅ / RAW JSON ❌
  - Recommendations: REAL DATA ✅ / HARDCODED ❌
  - Match Score: CALCULATED ✅ / FAKE ❌
  
- [ ] TEST 2: Profile Dialog - Volunteer WITHOUT Profile
  - Shows warning message: YES ✅ / NO ❌
  - Complete Assessment button works: YES ✅ / NO ❌
  
- [ ] TEST 3: Recommendations Tab
  - Shows real match scores: YES ✅ / NO ❌
  - Shows actual spiritual gifts: YES ✅ / NO ❌
  
- [ ] TEST 4: Availability Matrix Save
  - Toast notification appears: YES ✅ / NO ❌
  - Data persists after refresh: YES ✅ / NO ❌
  
- [ ] TEST 5: Spiritual Assessment Save
  - Toast notification appears: YES ✅ / NO ❌
  - Profile Dialog updates: YES ✅ / NO ❌
  
- [ ] TEST 6: Temporary Assignment
  - Dialog opens without alert: YES ✅ / NO ❌
  - Dates required: YES ✅ / NO ❌
  
- [ ] TEST 7: Permanent Assignment
  - Dates NOT required: YES ✅ / NO ❌
  - Saves successfully: YES ✅ / NO ❌
  
- [ ] TEST 8: Consistency Check
  - Match scores match across tabs: YES ✅ / NO ❌

### ❌ FAILED TESTS:
[List any failed tests here with screenshots]

### 🐛 BUGS FOUND:
[Describe any bugs with steps to reproduce]

### 📸 SCREENSHOTS:
[Attach screenshots of key findings]

### 💡 RECOMMENDATIONS:
[Any suggestions for improvement]

### ⭐ OVERALL STATUS:
[ ] ✅ APPROVED - All tests passed, ready for production
[ ] ⚠️ CONDITIONAL - Minor issues, can be addressed later
[ ] ❌ REJECTED - Critical issues, needs immediate fix

**Notes**:
[Any additional observations]
```

---

## 🚀 NEXT ACTIONS AFTER TESTING

### If All Tests Pass ✅
1. Mark all todo items as complete
2. Update `VOLUNTEER_SYSTEM_MIGRATION_COMPLETE.md` with test results
3. Proceed to cleanup phase:
   - Delete deprecated components
   - Remove OLD API endpoints
   - Update middleware

### If Tests Fail ❌
1. Document exact failure scenario
2. Provide screenshots and console errors
3. Report to developer for investigation
4. Consider rollback if critical

---

**Ready to Start Testing!** 🎯

Begin with the **QUICK START** section to verify the critical fixes are working. Then proceed to detailed tests as time allows.

**Estimated Time**: 
- Quick Start: 5 minutes
- Detailed Tests: 30-45 minutes total
- Full Suite: 1 hour

**Priority Order**:
1. 🔥 **CRITICAL**: Quick Start (Step 3)
2. 🔥 **HIGH**: TEST 1 (Profile Dialog with profile)
3. 🔥 **HIGH**: TEST 3 (Recommendations tab)
4. ⚠️ **MEDIUM**: TEST 4 & 5 (Save functionality)
5. ⚠️ **MEDIUM**: TEST 6 & 7 (Assignments)
6. ℹ️ **LOW**: TEST 2 & 8 (Edge cases)

Good luck with testing! 🚀
