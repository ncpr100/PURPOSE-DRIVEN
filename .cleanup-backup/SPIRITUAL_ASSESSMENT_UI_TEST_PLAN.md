# Quick Test Plan - Updated Spiritual Assessment UI

## Context
Fixed issue where "Dones Espirituales" tab was showing OLD assessment UI. Now redirects to enhanced assessment page with 8 categories and mandatory field validation.

## Quick Test Steps (5 minutes)

### Test #1: Navigate to Dones Espirituales
1. Open app in browser
2. Navigate to **"Dones Espirituales"** tab (sidebar or main menu)
3. ✅ **VERIFY:** Page loads with member cards grid
4. ✅ **VERIFY:** Stats cards show total members, with/without profiles, completion %

### Test #2: Create New Assessment
1. Find a member card with **"Sin evaluación"** status
2. Click **"Crear Evaluación"** button
3. ✅ **VERIFY:** Redirects to `/volunteers/spiritual-assessment?memberId=X&returnTo=/spiritual-gifts`
4. ✅ **VERIFY:** Page shows "Evaluación Espiritual" header
5. ✅ **VERIFY:** Back button says **"Volver a Dones Espirituales"** (not "Volver a Voluntarios")
6. ✅ **VERIFY:** 8 category sections visible:
   - Artístico
   - Comunicación
   - Equilibrar
   - Liderazgo
   - Ministerial
   - Relacional
   - Servicio
   - Técnico

### Test #3: Fill Assessment Form
1. Select at least 1 primary gift (red star) from any category
2. Select at least 1 secondary gift (yellow star) from any category
3. Select at least 1 ministry passion checkbox
4. Select experience level (Novato/Intermedio/Avanzado)
5. Scroll to bottom fields
6. ✅ **VERIFY:** "Llamado Espiritual" field has red asterisk (*)
7. ✅ **VERIFY:** "Motivación para Servir" field has red asterisk (*)
8. Leave both fields empty
9. Click **"Guardar Evaluación"**
10. ✅ **VERIFY:** Validation errors show for mandatory fields

### Test #4: Save Assessment Successfully
1. Fill in "Llamado Espiritual" text (e.g., "Servir en la iglesia")
2. Fill in "Motivación para Servir" text (e.g., "Amor por Dios")
3. Click **"Guardar Evaluación"**
4. ✅ **VERIFY:** Green toast notification: "Evaluación espiritual guardada exitosamente"
5. ✅ **VERIFY:** After ~2 seconds, redirects back to `/spiritual-gifts`
6. ✅ **VERIFY:** Member card now shows "Completado" badge (green)
7. ✅ **VERIFY:** Member card shows gift badges
8. ✅ **VERIFY:** Stats updated (e.g., "Con Perfil Espiritual" count increased)

### Test #5: Edit Existing Assessment
1. Find the member you just created assessment for
2. ✅ **VERIFY:** Card now shows **"Editar"** button instead of "Crear Evaluación"
3. Click **"Editar"** button
4. ✅ **VERIFY:** Redirects to assessment page with existing data pre-filled
5. ✅ **VERIFY:** Previous selections visible (primary gifts, secondary gifts, etc.)
6. Make a change (e.g., add another gift)
7. Click **"Guardar Evaluación"**
8. ✅ **VERIFY:** Saves successfully and redirects back
9. ✅ **VERIFY:** Changes reflected in member card

### Test #6: Tab Filtering
1. Click **"Con Perfil"** tab
2. ✅ **VERIFY:** Shows only members with completed assessments
3. ✅ **VERIFY:** All cards have green border and "Completado" badge
4. Click **"Sin Evaluación"** tab
5. ✅ **VERIFY:** Shows only members without assessments
6. ✅ **VERIFY:** All cards have orange border and "Pendiente" badge
7. Click **"Todos los Miembros"** tab
8. ✅ **VERIFY:** Shows all members (mixed)

### Test #7: Search Functionality
1. Type a member name in search box
2. ✅ **VERIFY:** Cards filter in real-time
3. Clear search
4. ✅ **VERIFY:** All members visible again

### Test #8: Cross-Check from Voluntarios Tab
1. Navigate to **"Voluntarios"** tab
2. Find a member without assessment
3. Click member to open profile
4. Click **"Completar Evaluación Espiritual"** button
5. ✅ **VERIFY:** Redirects to same assessment page
6. ✅ **VERIFY:** Back button says **"Volver a Voluntarios"** (NOT "Volver a Dones Espirituales")
7. Complete and save assessment
8. ✅ **VERIFY:** Redirects back to `/volunteers` (not `/spiritual-gifts`)

### Test #9: Database Verification (Optional)
If you have access to database console:

```sql
-- Check saved assessment
SELECT 
  m.firstName, 
  m.lastName, 
  msp.primaryGifts, 
  msp.secondaryGifts,
  msp.spiritualCalling, 
  msp.servingMotivation,
  msp.experienceLevel,
  msp.ministryPassions
FROM "Member" m
JOIN "MemberSpiritualProfile" msp ON m.id = msp.memberId
WHERE m.firstName = 'Juan' AND m.lastName = 'PACHANGA';
```

Expected output:
- `primaryGifts`: Array of gift IDs (e.g., `["LIDERAZGO_VISIONARIO", "COMUNICACION_ENSENANZA"]`)
- `secondaryGifts`: Array of gift IDs
- `spiritualCalling`: Text you entered
- `servingMotivation`: Text you entered
- `experienceLevel`: 3, 6, or 9 (NOVATO, INTERMEDIO, AVANZADO)
- `ministryPassions`: Array of passion IDs

## Expected Results Summary

✅ **BEFORE (OLD UI):**
- Dialog opens with old assessment form
- Missing 8-category structure
- Optional fields not validated
- Poor UX in cramped dialog

✅ **AFTER (NEW UI):**
- Redirects to full-page assessment
- 8 categories with icons and descriptions
- Mandatory fields validated
- Better UX with more space
- Proper navigation (returnTo support)
- Consistent experience across entry points

## Common Issues & Solutions

### Issue: "Crear Evaluación" button doesn't redirect
**Check:** Browser console for JavaScript errors  
**Solution:** Hard refresh (Ctrl+Shift+R) to clear cache

### Issue: Assessment doesn't save
**Check:** Network tab for failed API calls  
**Solution:** Verify `/api/members/[id]/spiritual-profile` endpoint is working

### Issue: Back button goes to wrong page
**Check:** URL in browser address bar for `returnTo` parameter  
**Solution:** Ensure clicking from Dones Espirituales includes `&returnTo=/spiritual-gifts`

### Issue: Member card doesn't update after save
**Check:** Console logs for `fetchData()` call  
**Solution:** May need to manually refresh page (this is expected, automatic refresh happens via API)

## Success Criteria

✅ All member cards show "Crear Evaluación" or "Editar" buttons  
✅ Clicking button redirects to `/volunteers/spiritual-assessment`  
✅ Assessment page shows 8 categories  
✅ Mandatory fields validated (red asterisk visible)  
✅ Save redirects back to Dones Espirituales  
✅ Member cards update with "Completado" badge  
✅ Stats cards reflect accurate counts  
✅ Navigation from Voluntarios tab returns to Voluntarios  

---

**Estimated Testing Time:** 5-10 minutes  
**Status:** Ready for Testing  
**Priority:** HIGH (User-reported issue)
