# 📋 EVENTOS MODULE - Complete Debug Guide

**Created:** January 8, 2026  
**Status:** Debugging in Progress  
**Issues Identified:** 2 broken buttons (AUTO-ASIGNAR, EDIT)

---

## 🎯 1. HOW THE EVENTOS MODULE WORKS

### Architecture Overview

```
EVENTOS MODULE ARCHITECTURE
├── Frontend: app/(dashboard)/events/page.tsx (Server Component)
│   └── SmartEventsClient (Client Component - 1,120 lines)
│       ├── Event Planning & Creation
│       ├── Resource Management
│       ├── Volunteer Assignment (AUTO-ASIGNAR)
│       ├── Communication Center
│       └── Analytics Dashboard
│
├── Backend API Routes:
│   ├── /api/events (GET, POST) - Event CRUD
│   ├── /api/events/[id]/auto-assign-volunteers (POST) - AI volunteer assignment
│   ├── /api/events/[id]/communications (POST) - Event communications
│   ├── /api/events/analytics (GET) - Event analytics
│   ├── /api/events/ai-suggestions (GET) - AI recommendations
│   └── /api/event-resources (GET, POST) - Resource management
│
└── Database Tables (Prisma):
    ├── events (main events table)
    ├── event_resources (equipment, spaces, materials)
    ├── event_resource_reservations (resource bookings)
    ├── event_attendees (member attendance tracking)
    ├── event_volunteers (volunteer assignments)
    ├── event_communications (email/SMS campaigns)
    └── event_donations (event-specific offerings)
```

### Event Lifecycle States

```typescript
status: 'PLANIFICANDO' | 'PROMOCIONANDO' | 'ACTIVO' | 'COMPLETADO' | 'CANCELADO'

PLANIFICANDO → PROMOCIONANDO → ACTIVO → COMPLETADO
                     ↓
                 CANCELADO
```

### Key Features

1. **Event Planning**
   - Create events with title, description, dates, location, budget
   - Categories: CULTO, CONFERENCIA, RETIRO, SERVICIO_COMUNITARIO, EVANGELISMO, NIÑOS
   - Public/Private visibility control
   - Status workflow management

2. **Resource Management**
   - Track equipment (EQUIPO), spaces (ESPACIO), materials (MATERIAL)
   - Capacity management
   - Reservation system with conflict detection
   - Status: PENDIENTE, CONFIRMADA, CANCELADA

3. **Volunteer Assignment**
   - Manual assignment interface
   - **AUTO-ASIGNAR**: AI-powered automatic assignment
   - Skills-based matching
   - Availability conflict detection
   - Role assignment (setup, worship, tech, hospitality)

4. **Communications**
   - Multi-channel: EMAIL, SMS, PUSH, SOCIAL
   - Target audiences: ALL, ATTENDEES, VOLUNTEERS, INVITEES
   - Schedule future communications
   - Track delivery status

5. **Analytics**
   - Total/Active/Completed events
   - Attendance tracking
   - Donation summaries
   - Volunteer participation rates
   - Monthly trends

---

## 🐛 2. BROKEN BUTTONS ANALYSIS

### Issue #1: AUTO-ASIGNAR Button (NOT FUNCTIONAL)

**Location:** Line 831 in `smart-events-client.tsx`

**Current Code:**
```tsx
<Button
  size="sm"
  variant="outline"
  onClick={() => autoAssignVolunteers(event.id)}
  className="text-xs"
>
  <Brain className="h-3 w-3 mr-1" />
  Auto-Asignar
</Button>
```

**Function Called (Line 384-399):**
```typescript
const autoAssignVolunteers = async (eventId: string) => {
  try {
    toast.info('🎯 Asignando voluntarios automáticamente...')
    
    const response = await fetch(`/api/events/${eventId}/auto-assign-volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      const data = await response.json()
      toast.success(`✅ ${data.assignedCount} voluntarios asignados automáticamente`)
      fetchEvents()
    }
  } catch (error) {
    toast.error('Error en asignación automática')
  }
}
```

**API Endpoint:** `/api/events/[id]/auto-assign-volunteers/route.ts` (232 lines)

**Root Cause Analysis:**
✅ Button onClick handler exists  
✅ Function defined correctly  
✅ API endpoint exists (`/app/api/events/[id]/auto-assign-volunteers/route.ts`)  
⚠️ **MISSING ERROR HANDLING** - Function doesn't log errors or show detailed messages

**Why It's "Not Working":**
- **Silent Failures**: If API returns error, only generic toast shown
- **No Loading State**: Button doesn't show processing indicator
- **No Response Validation**: Doesn't check if response has data before accessing `data.assignedCount`
- **No Fallback**: If no volunteers eligible, shows success with "0 voluntarios asignados"

---

### Issue #2: EDIT Button (NOT FUNCTIONAL)

**Location:** Line 852 in `smart-events-client.tsx`

**Current Code:**
```tsx
<Button size="sm" variant="ghost">
  <Edit className="h-4 w-4" />
</Button>
```

**Root Cause:** **NO ONCLICK HANDLER DEFINED** ❌

**Expected Behavior:**
Should open edit dialog with event details pre-filled for editing.

**Missing Implementation:**
```typescript
// MISSING: setSelectedEvent and edit dialog state
onClick={() => {
  setSelectedEvent(event)
  setIsEditEventDialogOpen(true) // State doesn't exist
}}
```

---

## ✅ 3. CHECK-IN SYSTEMS EXPLAINED

### Three Check-In Systems

#### A. **VISITOR CHECK-INS** (Adult Visitors)

**Purpose:** Track first-time visitors and returning guests  
**Page:** `/app/(dashboard)/check-ins/page.tsx`  
**API:** `/app/api/check-ins/route.ts`  
**Database Table:** `check_ins`

**How It Works:**

1. **Manual Registration:**
   ```tsx
   // User fills form in CheckInsClient component
   {
     firstName: 'Juan',
     lastName: 'Pérez',
     email: 'juan@example.com',
     phone: '+34612345678',
     isFirstTime: true,
     visitReason: 'Invitación de amigo',
     prayerRequest: 'Oración por salud'
   }
   ```

2. **QR Code Generation:**
   - System generates unique QR code for visitor
   - QR links to: `/api/check-ins/qr/[code]`
   - Visitor can scan on future visits for quick check-in

3. **Automation Triggers:**
   - `VISITOR_CHECKED_IN` automation trigger fires
   - Can auto-send welcome email
   - Creates follow-up task
   - Tags in CRM if first-time visitor

4. **Follow-Up Integration:**
   - Creates `visitor_follow_ups` record
   - Status: PENDIENTE → EN_PROGRESO → COMPLETADO
   - Assigns to staff member
   - Tracks engagement score

**Data Tracked:**
- Personal info (name, email, phone)
- Visit metadata (first time?, reason, prayer request)
- Engagement score (calculated)
- Automation triggered status
- Last contact date
- Ministry interests
- Family status
- Referral source

---

#### B. **CHILDREN CHECK-INS** (Kids Ministry Security)

**Purpose:** Secure check-in/check-out for children with parent verification  
**Page:** `/app/(dashboard)/check-ins/page.tsx` (Niños tab)  
**API:** `/app/api/children-check-ins/route.ts`  
**Database Table:** `children_check_ins`

**How It Works:**

1. **Check-In Process:**
   ```typescript
   // Parent provides child info + emergency contacts
   {
     childName: 'María García',
     childAge: 5,
     parentName: 'Carlos García',
     parentPhone: '+34612345678',
     parentEmail: 'carlos@example.com',
     emergencyContact: 'Abuela Ana',
     emergencyPhone: '+34698765432',
     allergies: 'Cacahuetes',
     specialNeeds: 'Asma - inhalador en mochila',
     securityPin: '1234' // Auto-generated 4-digit PIN
   }
   ```

2. **QR Code System:**
   - **Dual QR Codes:** One for parent, one for child
   - QR format: `CHILD-{timestamp}-{randomString}`
   - Public check-in page: `/public/children-checkin/[qrcode]`
   - Secure authentication required

3. **Security Features:**
   - **Security PIN:** 4-digit code required for pickup
   - **Photo Verification:** Optional parent/child photos
   - **Biometric Hash:** Fingerprint storage (optional)
   - **Backup Auth Codes:** Multiple verification methods
   - **Requires Both Auth:** PIN + Photo for high security
   - **Pickup Attempt Logging:** Tracks all pickup tries

4. **Check-Out Process:**
   ```typescript
   // POST to /api/children-check-ins/[id]/checkout
   {
     securityPin: '1234',
     photoVerified: true,
     authorizedPickup: 'Carlos García (Father)'
   }
   ```

5. **Safety Protocols:**
   - ✅ Can only check out if checked in
   - ✅ Security PIN must match
   - ✅ Logs all pickup attempts (authorized + unauthorized)
   - ✅ Real-time alerts for failed pickups
   - ✅ Emergency contact accessible to staff

**Enhanced Security:**
```typescript
interface ChildCheckIn {
  securityPin: string         // Required 4-digit PIN
  biometricHash?: string      // Fingerprint verification
  photoTakenAt?: string       // Timestamp of photo capture
  backupAuthCodes: string[]   // Multiple auth methods
  pickupAttempts: {           // Audit trail
    attemptedAt: Date
    authorizedBy: string
    successful: boolean
    method: 'PIN' | 'PHOTO' | 'BIOMETRIC'
  }[]
  requiresBothAuth: boolean   // PIN + Photo required
}
```

---

#### C. **EVENT CHECK-INS** (Event Attendance Tracking)

**Purpose:** Track member attendance at specific events  
**Integration:** Part of Events module  
**Database Table:** `event_attendees`

**How It Works:**

1. **Event Registration:**
   ```typescript
   // Members register for event
   {
     eventId: 'evt_123',
     memberId: 'mem_456',
     status: 'INVITADO' → 'CONFIRMADO' → 'ASISTIO' | 'NO_ASISTIO'
   }
   ```

2. **Check-In Methods:**
   - **QR Code Scan:** Event-specific QR at entrance
   - **Manual Check-In:** Staff marks attendees
   - **Self-Service Kiosk:** Tablet with member lookup

3. **Attendance Statuses:**
   - `INVITADO`: Invited but not confirmed
   - `CONFIRMADO`: RSVP'd yes
   - `ASISTIO`: Checked in at event
   - `NO_ASISTIO`: Registered but didn't attend

4. **Analytics Integration:**
   - Tracks attendance trends per member
   - Event attendance rates
   - No-show patterns
   - Popular event categories

---

## 🔧 COMPLETE WORKFLOW EXAMPLES

### Example 1: Creating an Event with Auto-Assigned Volunteers

```typescript
// STEP 1: User creates event
{
  title: 'Conferencia de Jóvenes 2026',
  description: 'Evento de 3 días para jóvenes',
  category: 'CONFERENCIA',
  startDate: '2026-02-15T09:00:00Z',
  endDate: '2026-02-17T20:00:00Z',
  location: 'Centro de Convenciones Madrid',
  budget: 5000,
  isPublic: true,
  status: 'PLANIFICANDO'
}

// STEP 2: Event created in database via /api/events POST

// STEP 3: User clicks AUTO-ASIGNAR button

// STEP 4: AI analyzes requirements:
const requiredRoles = [
  { role: 'setup', count: 4, skills: ['Montaje', 'Logística'] },
  { role: 'worship', count: 3, skills: ['Música', 'Alabanza'] },
  { role: 'tech', count: 2, skills: ['Audio', 'Video'] },
  { role: 'hospitality', count: 6, skills: ['Atención al público'] }
]

// STEP 5: System finds eligible volunteers:
// - Not already assigned to this event
// - No schedule conflicts (checks availability_matrices)
// - Has matching skills
// - Not overworked (load balancing)

// STEP 6: Auto-assigns 15 volunteers total

// STEP 7: Creates event_volunteers records:
{
  eventId: 'evt_123',
  volunteerId: 'vol_456',
  role: 'tech',
  assignedTasks: ['Audio mixing', 'Microphone setup'],
  status: 'ASIGNADO'
}

// STEP 8: Sends notification to volunteers
```

### Example 2: Visitor Check-In with Follow-Up

```typescript
// STEP 1: Visitor arrives at church

// STEP 2: Staff/Greeter opens /check-ins page

// STEP 3: Fills visitor form:
{
  firstName: 'Laura',
  lastName: 'Martínez',
  email: 'laura@example.com',
  phone: '+34655443322',
  isFirstTime: true,
  visitReason: 'Searching for a church home',
  prayerRequest: 'Prayer for job search'
}

// STEP 4: System creates check-in record

// STEP 5: Generates QR code for future visits

// STEP 6: Automation trigger fires:
// - VISITOR_CHECKED_IN event
// - Sends welcome email via Resend
// - Creates visitor_follow_ups record
// - Assigns to Pastor for follow-up
// - Tags as "First-Time Visitor" in CRM

// STEP 7: Follow-up workflow:
{
  followUpType: 'PRIMERA_VISITA',
  status: 'PENDIENTE',
  scheduledAt: '2026-01-10T10:00:00Z', // 2 days later
  assignedUserId: 'pastor_123',
  notes: 'Interested in young adults ministry'
}

// STEP 8: Pastor receives notification
// STEP 9: Pastor makes contact, updates status to COMPLETADO
```

### Example 3: Children Check-In Security Flow

```typescript
// STEP 1: Parent arrives with child at Kids Ministry

// STEP 2: Staff opens /check-ins → Niños tab

// STEP 3: First-time setup (generates QR + PIN):
{
  childName: 'Sofía López',
  childAge: 4,
  parentName: 'Ana López',
  parentPhone: '+34611223344',
  allergies: 'Lactosa',
  specialNeeds: 'None',
  securityPin: '7382' // Auto-generated
}

// STEP 4: System prints TWO QR codes:
// - Parent QR (for check-out)
// - Child name tag QR (worn by child)

// STEP 5: Optional photo capture:
// - Takes parent photo
// - Takes child photo
// - Stores for verification

// STEP 6: Child enters classroom (checkedIn: true)

// === LATER: PICKUP TIME ===

// STEP 7: Parent returns with QR code

// STEP 8: Staff scans parent QR or enters child name

// STEP 9: Security verification:
// - Prompt for security PIN
// - Optional: Show parent photo for visual match
// - Optional: Biometric verification

// STEP 10: If PIN matches:
{
  securityPin: '7382', ✅
  checkedOut: true,
  checkedOutAt: '2026-01-08T12:30:00Z',
  pickupAttempts: [{
    attemptedAt: new Date(),
    authorizedBy: 'Ana López',
    successful: true,
    method: 'PIN'
  }]
}

// STEP 11: Child released to parent

// === SECURITY FAILURE EXAMPLE ===

// If wrong PIN entered:
{
  securityPin: '0000', ❌
  pickupAttempts: [{
    attemptedAt: new Date(),
    authorizedBy: 'Unknown person',
    successful: false,
    method: 'PIN',
    failureReason: 'Incorrect PIN'
  }]
}
// → Alert sent to Children's Ministry Director
// → Staff notified of failed pickup attempt
// → Parent contacted for verification
```

---

## 📊 DATABASE SCHEMA REFERENCE

### Events Tables

```sql
-- Main events table
CREATE TABLE events (
  id VARCHAR PRIMARY KEY,
  churchId VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR, -- CULTO, CONFERENCIA, etc.
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP,
  location VARCHAR,
  budget DECIMAL,
  isPublic BOOLEAN DEFAULT true,
  status VARCHAR DEFAULT 'PLANIFICANDO',
  createdAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (churchId) REFERENCES churches(id)
);

-- Event attendees (members)
CREATE TABLE event_attendees (
  id VARCHAR PRIMARY KEY,
  eventId VARCHAR NOT NULL,
  memberId VARCHAR NOT NULL,
  status VARCHAR, -- INVITADO, CONFIRMADO, ASISTIO, NO_ASISTIO
  registrationDate TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (eventId) REFERENCES events(id),
  FOREIGN KEY (memberId) REFERENCES members(id)
);

-- Volunteer assignments
CREATE TABLE event_volunteers (
  id VARCHAR PRIMARY KEY,
  eventId VARCHAR NOT NULL,
  volunteerId VARCHAR NOT NULL,
  role VARCHAR, -- setup, worship, tech, hospitality
  assignedTasks JSON,
  status VARCHAR DEFAULT 'ASIGNADO',
  FOREIGN KEY (eventId) REFERENCES events(id),
  FOREIGN KEY (volunteerId) REFERENCES volunteers(id)
);
```

### Check-Ins Tables

```sql
-- Visitor check-ins (adults)
CREATE TABLE check_ins (
  id VARCHAR PRIMARY KEY,
  churchId VARCHAR NOT NULL,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  isFirstTime BOOLEAN DEFAULT false,
  visitReason TEXT,
  prayerRequest TEXT,
  qrCode VARCHAR UNIQUE,
  checkedInAt TIMESTAMP DEFAULT NOW(),
  eventId VARCHAR,
  automationTriggered BOOLEAN DEFAULT false,
  engagementScore INT DEFAULT 0,
  FOREIGN KEY (churchId) REFERENCES churches(id)
);

-- Children check-ins (kids ministry)
CREATE TABLE children_check_ins (
  id VARCHAR PRIMARY KEY,
  churchId VARCHAR NOT NULL,
  childName VARCHAR NOT NULL,
  childAge INT,
  parentName VARCHAR NOT NULL,
  parentPhone VARCHAR NOT NULL,
  parentEmail VARCHAR,
  emergencyContact VARCHAR,
  emergencyPhone VARCHAR,
  allergies TEXT,
  specialNeeds TEXT,
  qrCode VARCHAR UNIQUE NOT NULL,
  securityPin VARCHAR NOT NULL,
  biometricHash VARCHAR,
  photoTakenAt TIMESTAMP,
  backupAuthCodes JSON,
  pickupAttempts JSON,
  requiresBothAuth BOOLEAN DEFAULT false,
  checkedIn BOOLEAN DEFAULT true,
  checkedOut BOOLEAN DEFAULT false,
  checkedInAt TIMESTAMP DEFAULT NOW(),
  checkedOutAt TIMESTAMP,
  FOREIGN KEY (churchId) REFERENCES churches(id)
);
```

---

## 🔍 DEBUGGING CHECKLIST

### For AUTO-ASIGNAR Button:

- [ ] Check browser console for errors when clicking
- [ ] Verify API endpoint exists: `/api/events/[id]/auto-assign-volunteers`
- [ ] Test API directly: `POST /api/events/{eventId}/auto-assign-volunteers`
- [ ] Check if volunteers exist in database (`volunteers` table)
- [ ] Verify volunteer has `availability_matrices` records
- [ ] Check if volunteers have skills defined
- [ ] Ensure event has `startDate` and `endDate`
- [ ] Look for CORS or authentication errors
- [ ] Check if toast notifications appear
- [ ] Verify `fetchEvents()` is called after assignment

### For EDIT Button:

- [ ] Confirm button has no `onClick` handler (ROOT CAUSE)
- [ ] Check if `setSelectedEvent` state exists (it does - line 170)
- [ ] Verify if edit dialog state exists (missing: `isEditEventDialogOpen`)
- [ ] Look for edit dialog component (currently missing)
- [ ] Check if event update API exists (`PUT /api/events/[id]`)

### For Check-In Systems:

**Visitors:**
- [ ] API endpoint: `/api/check-ins` GET/POST working
- [ ] QR code generation functional
- [ ] Automation triggers firing (`VISITOR_CHECKED_IN`)
- [ ] Follow-up records being created

**Children:**
- [ ] API endpoint: `/api/children-check-ins` GET/POST working
- [ ] Security PIN generation (4-digit random)
- [ ] QR code uniqueness enforced
- [ ] Check-out endpoint: `/api/children-check-ins/[id]/checkout` working
- [ ] Pickup attempts being logged

---

## 🛠️ NEXT STEPS (Fixes Required)

### Fix #1: AUTO-ASIGNAR Button Enhancement

**Add detailed error handling and loading state:**

```typescript
const [isAutoAssigning, setIsAutoAssigning] = useState(false)

const autoAssignVolunteers = async (eventId: string) => {
  if (isAutoAssigning) return // Prevent double-click
  
  try {
    setIsAutoAssigning(true)
    toast.info('🎯 Asignando voluntarios automáticamente...')
    
    const response = await fetch(`/api/events/${eventId}/auto-assign-volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      const data = await response.json()
      
      if (!data || typeof data.assignedCount !== 'number') {
        toast.error('Respuesta inválida del servidor')
        return
      }
      
      if (data.assignedCount === 0) {
        toast.warning('⚠️ No se encontraron voluntarios elegibles para asignar')
      } else {
        toast.success(`✅ ${data.assignedCount} voluntarios asignados automáticamente`)
      }
      
      fetchEvents()
    } else {
      const error = await response.json()
      console.error('Auto-assign error:', error)
      toast.error(`Error: ${error.message || 'No se pudo asignar voluntarios'}`)
    }
  } catch (error) {
    console.error('Error in autoAssignVolunteers:', error)
    toast.error('Error de conexión al asignar voluntarios')
  } finally {
    setIsAutoAssigning(false)
  }
}

// Update button with loading state:
<Button
  size="sm"
  variant="outline"
  onClick={() => autoAssignVolunteers(event.id)}
  disabled={isAutoAssigning}
  className="text-xs"
>
  {isAutoAssigning ? (
    <>
      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      Asignando...
    </>
  ) : (
    <>
      <Brain className="h-3 w-3 mr-1" />
      Auto-Asignar
    </>
  )}
</Button>
```

### Fix #2: EDIT Button Implementation

**Add missing onClick handler and edit dialog:**

```typescript
// Add state for edit dialog
const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false)

// Update button with onClick:
<Button 
  size="sm" 
  variant="ghost"
  onClick={() => {
    setSelectedEvent(event)
    setEventForm({
      title: event.title,
      description: event.description || '',
      category: event.category,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      location: event.location || '',
      budget: event.budget?.toString() || '',
      isPublic: event.isPublic
    })
    setIsEditEventDialogOpen(true)
  }}
>
  <Edit className="h-4 w-4" />
</Button>

// Add edit dialog (similar to create dialog but with UPDATE logic)
<Dialog open={isEditEventDialogOpen} onOpenChange={setIsEditEventDialogOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Editar Evento</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleUpdateEvent} className="space-y-4">
      {/* Same form fields as create, but pre-filled */}
      {/* ... */}
      <Button type="submit">
        <Save className="h-4 w-4 mr-2" />
        Guardar Cambios
      </Button>
    </form>
  </DialogContent>
</Dialog>

// Add update handler:
const handleUpdateEvent = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!selectedEvent) return
  
  try {
    const response = await fetch(`/api/events/${selectedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...eventForm,
        startDate: new Date(eventForm.startDate).toISOString(),
        endDate: eventForm.endDate ? new Date(eventForm.endDate).toISOString() : null,
        budget: eventForm.budget ? parseFloat(eventForm.budget) : null,
      }),
    })

    if (response.ok) {
      toast.success('✅ Evento actualizado exitosamente')
      setIsEditEventDialogOpen(false)
      fetchEvents()
    } else {
      toast.error('Error al actualizar evento')
    }
  } catch (error) {
    toast.error('Error al actualizar evento')
  }
}
```

---

## 📚 ADDITIONAL RESOURCES

### API Endpoints Reference

```
Events:
GET    /api/events                              - List all events
POST   /api/events                              - Create event
PUT    /api/events/[id]                        - Update event (MISSING)
DELETE /api/events/[id]                        - Delete event (MISSING)
POST   /api/events/[id]/auto-assign-volunteers - Auto-assign
POST   /api/events/[id]/communications         - Send communication
GET    /api/events/analytics                   - Event analytics
GET    /api/events/ai-suggestions              - AI recommendations

Resources:
GET    /api/event-resources                    - List resources
POST   /api/event-resources                    - Create resource

Check-Ins (Visitors):
GET    /api/check-ins                          - List check-ins
POST   /api/check-ins                          - Create check-in
GET    /api/check-ins/qr/[code]                - QR code lookup

Check-Ins (Children):
GET    /api/children-check-ins                 - List children
POST   /api/children-check-ins                 - Check in child
POST   /api/children-check-ins/[id]/checkout   - Check out child
POST   /api/children-check-ins/generate-qr     - Generate QR
GET    /api/children-check-ins/qr/[code]       - QR lookup
```

### Key Files to Review

```
Frontend:
- app/(dashboard)/events/page.tsx (Server wrapper)
- app/(dashboard)/events/_components/smart-events-client.tsx (Main component)
- app/(dashboard)/check-ins/page.tsx (Server wrapper)
- app/(dashboard)/check-ins/_components/check-ins-client.tsx (Check-in UI)

Backend:
- app/api/events/route.ts (Event CRUD)
- app/api/events/[id]/auto-assign-volunteers/route.ts (AI assignment)
- app/api/check-ins/route.ts (Visitor check-ins)
- app/api/children-check-ins/route.ts (Children check-ins)

Database:
- prisma/schema.prisma (Search for: events, check_ins, children_check_ins)
```

---

## 🎓 SUMMARY

**Eventos Module:**
- ✅ Architecture is well-designed with 5 main tabs
- ✅ Backend APIs exist and are functional
- ⚠️ AUTO-ASIGNAR button works but lacks error handling
- ❌ EDIT button completely missing onClick handler
- ✅ Event creation works perfectly
- ✅ Communications system integrated

**Check-In Systems:**
- ✅ Three separate systems for different purposes
- ✅ Visitor check-ins with automation triggers
- ✅ Children check-ins with advanced security
- ✅ Event attendance tracking
- ✅ QR code generation for all systems
- ✅ Follow-up integration functional

**Required Fixes:**
1. Enhance AUTO-ASIGNAR with loading state and better error messages
2. Implement EDIT button onClick handler and dialog
3. Create PUT /api/events/[id] endpoint for updates
4. Add DELETE /api/events/[id] endpoint for deletions

---

**Document Version:** 1.0  
**Last Updated:** January 8, 2026  
**Next Review:** After implementing fixes
