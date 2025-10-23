# Family Grouping Feature - Design Specification

## 📋 USER REQUEST ANALYSIS

### Context:
User wants to add spouse and children fields to enable family grouping, similar to the Members filter design pattern. **Critical question raised**: "How do we settle the issue of head counts as members?"

### Core Challenge:
**Family vs. Member Counting Dilemma**:
- If a family has 4 people (2 adults + 2 children), should the system show:
  - **Option A**: 4 individual members (each person counted separately)
  - **Option B**: 1 family unit (grouped count)
  - **Option C**: Dual counting (4 members belonging to 1 family)

---

## 🎯 RECOMMENDED SOLUTION: DUAL-ENTITY MODEL

### Architecture Overview:
```
Member Entity (Individual)          Family Entity (Grouping)
├── ID (unique)                     ├── ID (unique)
├── Personal Info                   ├── Family Name
├── Role in Family                  ├── Head of Household (Member ID)
├── Family ID (foreign key)         ├── Address (shared)
└── Member Status                   ├── Emergency Contact (shared)
                                    └── Family Notes
```

### Key Principle:
**"Every person is a Member. Some Members belong to Families."**

This approach:
- ✅ Maintains accurate individual member counts for reports
- ✅ Enables family grouping for communication and ministry
- ✅ Preserves individual spiritual assessments, skills, availability
- ✅ Allows flexible family structures (single parents, multi-generational, etc.)

---

## 📊 PROPOSED DATA MODEL

### Database Schema Changes:

#### 1. New `Family` Table:
```prisma
model Family {
  id                String    @id @default(cuid())
  familyName        String    // e.g., "Familia Pachanga"
  headOfHouseholdId String?   // Reference to primary adult member
  address           String?
  city              String?
  state             String?
  zipCode           String?
  homePhone         String?
  emergencyContact  String?
  familyNotes       String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  churchId          String
  
  // Relations
  church            Church    @relation(fields: [churchId], references: [id], onDelete: Cascade)
  members           Member[]
  headOfHousehold   Member?   @relation("HeadOfHousehold", fields: [headOfHouseholdId], references: [id])
  
  @@index([churchId])
  @@index([headOfHouseholdId])
}
```

#### 2. Update `Member` Table:
```prisma
model Member {
  // ... existing fields ...
  
  // NEW Family-related fields
  familyId          String?
  roleInFamily      String?   // "Cabeza de Familia", "Cónyuge", "Hijo/a", "Otro"
  
  // Relations
  family            Family?   @relation(fields: [familyId], references: [id], onDelete: SetNull)
  familiesAsHead    Family[]  @relation("HeadOfHousehold")
  
  @@index([familyId])
}
```

### Role in Family Options:
- **"Cabeza de Familia"** (Head of Household)
- **"Cónyuge"** (Spouse)
- **"Hijo/a"** (Child)
- **"Padre/Madre"** (Parent - for adult children living with parents)
- **"Otro Familiar"** (Other Relative)
- **"No aplica"** (Not applicable - single member)

---

## 🎨 UI/UX DESIGN

### 1. Member Form - New "Familia" Card (Card 5):

Add between Card 2 (Address) and Card 3 (Personal Details):

```tsx
{/* Card 5: Family Information */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Users className="h-5 w-5" />
      Información Familiar
    </CardTitle>
    <CardDescription>
      Agrupación familiar y roles
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Option 1: Link to existing family */}
    <div className="space-y-2">
      <Label htmlFor="existingFamily">Familia Existente</Label>
      <Select value={formData.familyId} onValueChange={handleFamilySelect}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar familia existente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sin familia / Nueva familia</SelectItem>
          {families.map(family => (
            <SelectItem key={family.id} value={family.id}>
              {family.familyName} - {family.headOfHousehold?.firstName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Option 2: Create new family */}
    {!formData.familyId && (
      <div className="space-y-2">
        <Label htmlFor="newFamilyName">Crear Nueva Familia</Label>
        <Input
          id="newFamilyName"
          placeholder="e.g., Familia Rodríguez"
          value={formData.newFamilyName}
          onChange={(e) => setFormData(prev => ({ ...prev, newFamilyName: e.target.value }))}
        />
      </div>
    )}

    {/* Role in family */}
    <div className="space-y-2">
      <Label htmlFor="roleInFamily">Rol en la Familia</Label>
      <Select value={formData.roleInFamily} onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Cabeza de Familia">Cabeza de Familia</SelectItem>
          <SelectItem value="Cónyuge">Cónyuge</SelectItem>
          <SelectItem value="Hijo/a">Hijo/a</SelectItem>
          <SelectItem value="Padre/Madre">Padre/Madre</SelectItem>
          <SelectItem value="Otro Familiar">Otro Familiar</SelectItem>
          <SelectItem value="No aplica">No aplica</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Display family members if linked */}
    {formData.familyId && currentFamily && (
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">Miembros de la Familia:</p>
        <ul className="text-sm space-y-1">
          {currentFamily.members.map(member => (
            <li key={member.id} className="flex items-center gap-2">
              <User className="h-3 w-3" />
              {member.firstName} {member.lastName} ({member.roleInFamily})
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="flex justify-end pt-4 border-t">
      <Button onClick={handleSaveFamilyInfo} disabled={!member?.id}>
        <Save className="w-4 h-4 mr-2" />
        Guardar Información Familiar
      </Button>
    </div>
  </CardContent>
</Card>
```

### 2. Members List View - Family Grouping Toggle:

Add filter option:
```tsx
<Select value={viewMode} onValueChange={setViewMode}>
  <SelectItem value="individual">Vista Individual (Miembros)</SelectItem>
  <SelectItem value="family">Vista Familiar (Familias)</SelectItem>
</Select>
```

**Individual View** (Current behavior):
- Shows all members as separate rows
- Count: "150 miembros"

**Family View** (New):
- Groups members by family
- Expandable rows showing family members
- Count: "45 familias (150 miembros)"

### 3. Family Detail Card:

When clicking a family in Family View:
```
┌─────────────────────────────────────────┐
│ Familia Rodríguez                    [X]│
├─────────────────────────────────────────┤
│ 📍 Dirección: 123 Main St, Austin, TX  │
│ 📞 Teléfono: +1 555-0123                │
│                                         │
│ Miembros (4):                           │
│  ✓ Carlos Rodríguez (Cabeza de Familia)│
│     - Ocupación: Ingeniero              │
│     - Evaluación: ✅ Completa           │
│  ✓ María Rodríguez (Cónyuge)           │
│     - Ocupación: Maestra                │
│     - Evaluación: ✅ Completa           │
│  ✓ Ana Rodríguez (Hija) - 12 años      │
│     - Evaluación: Pendiente             │
│  ✓ Luis Rodríguez (Hijo) - 8 años      │
│     - Evaluación: Pendiente             │
│                                         │
│ [Editar Familia] [Ver Detalle]         │
└─────────────────────────────────────────┘
```

---

## 📈 MEMBER COUNTING LOGIC

### Reports Should Show BOTH Metrics:

#### Dashboard Statistics:
```
┌──────────────────────────────────────┐
│ MEMBRESÍA ACTUAL                     │
├──────────────────────────────────────┤
│ 👥 Miembros Individuales: 150       │
│ 🏠 Familias Registradas: 45         │
│ 📊 Promedio por Familia: 3.3        │
│                                      │
│ DISTRIBUCIÓN:                        │
│  - Familias (2+ miembros): 40       │
│  - Individuales: 30                  │
└──────────────────────────────────────┘
```

#### Attendance Reports:
- **Count by individuals**: "120 miembros asistieron"
- **Filter by family**: "35 familias representadas"

#### Communication Tools:
- **Email to individuals**: 150 unique emails
- **Email to families**: Send 1 email per family (45 total), addressed to head of household

---

## 🔧 IMPLEMENTATION PHASES

### Phase 1: Database Migration (1-2 hours)
1. Create `Family` table in Prisma schema
2. Add `familyId` and `roleInFamily` to `Member` table
3. Run migration: `npx prisma migrate dev --name add_family_grouping`
4. Seed test data with 2-3 sample families

### Phase 2: Backend API (2-3 hours)
1. **POST /api/families** - Create new family
2. **GET /api/families** - List all families for church
3. **GET /api/families/[id]** - Get family with all members
4. **PUT /api/families/[id]** - Update family info
5. **PUT /api/members/[id]/family** - Link member to family

### Phase 3: UI Components (3-4 hours)
1. Create "Información Familiar" Card in Member Form
2. Add family selector with autocomplete
3. Display current family members when linked
4. Add `handleSaveFamilyInfo()` handler

### Phase 4: Family View Mode (2-3 hours)
1. Add view mode toggle in Members list
2. Implement family grouping logic
3. Create expandable family rows
4. Update counts to show both metrics

### Phase 5: Reporting Updates (1-2 hours)
1. Update dashboard to show family statistics
2. Add family filter to existing reports
3. Update attendance tracking to record family presence

**Total Estimated Time**: 9-14 hours

---

## 🎯 USER STORIES

### Story 1: Register Family
**As a** church administrator  
**I want to** create a family group when registering members  
**So that** I can manage household information efficiently

**Acceptance Criteria**:
- Can create new family with name
- Can designate head of household
- Can add spouse and children to family
- Family shares address and emergency contact

### Story 2: View Family Together
**As a** church administrator  
**I want to** see all family members grouped together  
**So that** I can communicate with the entire family

**Acceptance Criteria**:
- Toggle between individual and family view
- See family card with all members listed
- View each member's role and individual details

### Story 3: Individual Assessment
**As a** ministry coordinator  
**I want to** each family member to have their own spiritual assessment  
**So that** I can match individuals (not families) to ministry roles

**Acceptance Criteria**:
- Each member has independent spiritual profile
- Each member has independent skills and availability
- Reports show individual member counts for ministry placement

### Story 4: Family Communication
**As a** church administrator  
**I want to** send one email per family instead of duplicate emails  
**So that** families don't receive multiple copies of announcements

**Acceptance Criteria**:
- Email system detects family grouping
- Sends to head of household email
- CC's spouse if they have separate email
- Shows "Sent to 45 families (150 members)"

---

## ⚠️ IMPORTANT CONSIDERATIONS

### 1. Privacy & Consent:
- Not all members want to be linked to family
- Allow "No aplica" option for singles
- Allow "Ocultar familia" option for sensitive situations (divorce, abuse)

### 2. Complex Family Structures:
- Blended families (step-parents, step-children)
- Multi-generational homes (grandparents, aunts, uncles)
- Roommates (not family, but same address)
- **Solution**: Make family grouping **optional** and **flexible**

### 3. Historical Data:
- Existing members don't have family links
- Don't force retroactive family creation
- Allow gradual migration as data is updated

### 4. Member Independence:
- Moving out: Child becomes head of new family
- Marriage: Two individuals merge into one family
- Divorce: One family splits into two
- **Solution**: Allow easy re-linking without data loss

---

## 📊 ALTERNATIVE APPROACHES (NOT RECOMMENDED)

### ❌ Option A: Spouse/Children Fields Only
**Structure**:
```
Member:
  - spouseName: String
  - children: String[] (just names)
```

**Problems**:
- Spouse and children aren't full members
- Can't track their spiritual assessments
- Can't assign them to ministries
- Violates normalized database design
- Counting: 1 member + text fields (not trackable)

### ❌ Option B: Single Family Record with Array
**Structure**:
```
Family:
  - members: [{name, role, age}]
```

**Problems**:
- Can't query individual members
- Can't track individual spiritual profiles
- Can't have member appear in multiple contexts
- Counting: 1 family record, unclear member count

### ✅ Option C: Dual-Entity Model (RECOMMENDED)
**Structure**: Separate `Family` and `Member` tables with foreign key relationship

**Benefits**:
- Clear individual member counting
- Optional family grouping
- Preserves individual data integrity
- Flexible for complex family structures
- Industry standard pattern

---

## 🚀 NEXT STEPS

### Decision Required from User:

**QUESTION 1**: Do you want to implement the full dual-entity model (Family + Member tables)?
- **Yes** → Proceed with Phase 1 (Database Migration)
- **No** → Discuss simpler alternative

**QUESTION 2**: How should member counting work in your church context?
- **Option A**: Count every individual (children = members)
- **Option B**: Count adults only (children = dependents)
- **Option C**: Count baptized only (children = visitors until baptized)

**QUESTION 3**: What family roles are relevant for your church?
- Use standard roles (Head, Spouse, Child, Other)?
- Add custom roles (e.g., "Líder Familiar", "Miembro Joven")?

**QUESTION 4**: Should family grouping be:
- **Required** for all members (must select family or "single")
- **Optional** (can leave blank)
- **Gradual** (add as data is updated)

### Recommended Immediate Action:

1. **Deploy current UI improvements** (icon changes, title change)
2. **Review this design document**
3. **Schedule planning session** to decide on family model
4. **Create mockups** for family grouping UI
5. **Get user feedback** before starting implementation

This is a **significant feature** that affects:
- Database schema
- API structure  
- UI/UX across multiple pages
- Reports and statistics
- Communication workflows

**Estimate**: 2-3 days of development + 1-2 days of testing

---

## 📝 CONCLUSION

The family grouping feature is architecturally complex but highly valuable. The **dual-entity model** (separate Family and Member tables) is the recommended approach because it:

1. ✅ **Maintains accurate individual member counts**
2. ✅ **Enables flexible family grouping**
3. ✅ **Preserves data integrity**
4. ✅ **Supports complex family structures**
5. ✅ **Follows industry best practices**

**Key Principle**: "Every person is a Member. Some Members belong to Families."

This approach answers your question: **"How do we settle the issue of head counts as members?"**

**Answer**: Count individuals for membership statistics, but GROUP by family for communication and ministry outreach. Reports show BOTH metrics: "45 familias (150 miembros)".

---

**Ready to proceed?** Please review this design and provide feedback on:
1. Does this approach solve your use case?
2. Which counting method aligns with your church policy?
3. Should we proceed with full implementation or start with a simpler prototype?
