

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import ExcelJS from 'exceljs'

export const dynamic = 'force-dynamic'

interface ImportRow {
  [key: string]: any
}

interface ImportResult {
  success: boolean
  imported: number
  updated: number
  failed: number
  errors: Array<{
    row: number
    field: string
    value: any
    error: string
  }>
}

// Standard field mappings from common church systems
const COMMON_FIELD_MAPPINGS: Record<string, string> = {
  // Names
  'first name': 'firstName',
  'firstname': 'firstName',
  'first_name': 'firstName',
  'last name': 'lastName', 
  'lastname': 'lastName',
  'last_name': 'lastName',
  'name': 'firstName', // Will need parsing
  'full name': 'firstName', // Will need parsing
  
  // Contact
  'email': 'email',
  'email address': 'email',
  'e-mail': 'email',
  'phone': 'phone',
  'phone number': 'phone',
  'mobile': 'phone',
  'cell': 'phone',
  'telephone': 'phone',
  
  // Address
  'address': 'address',
  'street address': 'address',
  'street': 'address',
  'city': 'city',
  'state': 'state',
  'zip': 'zipCode',
  'zip code': 'zipCode',
  'zipcode': 'zipCode',
  'postal code': 'zipCode',
  
  // Personal
  'birth date': 'birthDate',
  'birthdate': 'birthDate',
  'date of birth': 'birthDate',
  'dob': 'birthDate',
  'gender': 'gender',
  'sex': 'gender',
  'marital status': 'maritalStatus',
  'occupation': 'occupation',
  'job': 'occupation',
  
  // Church specific
  'membership date': 'membershipDate',
  'join date': 'membershipDate',
  'baptism date': 'baptismDate',
  'baptized': 'baptismDate',
  'notes': 'notes',
  'comments': 'notes',
}

function parseFullName(fullName: string): { firstName: string, lastName: string } {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  }
}

function normalizeFieldName(fieldName: string): string {
  return fieldName.toLowerCase().trim()
}

function mapFields(row: ImportRow): any {
  const mappedRow: any = {}
  
  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined || value === '') continue
    
    const normalizedKey = normalizeFieldName(key)
    const mappedField = COMMON_FIELD_MAPPINGS[normalizedKey] || normalizedKey
    
    // Handle special cases
    if (mappedField === 'firstName' && key.toLowerCase().includes('full') || key.toLowerCase() === 'name') {
      const { firstName, lastName } = parseFullName(String(value))
      mappedRow.firstName = firstName
      if (lastName) mappedRow.lastName = lastName
    } else if (mappedField === 'birthDate' || mappedField === 'baptismDate' || mappedField === 'membershipDate') {
      // Handle date parsing
      try {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          mappedRow[mappedField] = date.toISOString()
        }
      } catch (e) {
        // Invalid date, skip
      }
    } else if (mappedField === 'gender') {
      // Normalize gender values
      const genderValue = String(value).toLowerCase()
      if (genderValue.startsWith('m') || genderValue.startsWith('h')) {
        mappedRow[mappedField] = 'Masculino'
      } else if (genderValue.startsWith('f') || genderValue.startsWith('w')) {
        mappedRow[mappedField] = 'Femenino'
      }
    } else {
      mappedRow[mappedField] = value
    }
  }
  
  return mappedRow
}

function validateMemberData(data: any): string[] {
  const errors: string[] = []
  
  if (!data.firstName) {
    errors.push('Nombre es requerido')
  }
  
  if (!data.lastName) {
    errors.push('Apellido es requerido')
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido')
  }
  
  if (data.phone && !/^[\d\s\-\+\(\)\.]+$/.test(data.phone)) {
    errors.push('Teléfono inválido')
  }
  
  return errors
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos para importar' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const updateExisting = formData.get('updateExisting') === 'true'

    if (!file) {
      return NextResponse.json({ message: 'No se recibió archivo' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        message: 'Tipo de archivo no soportado. Use Excel (.xlsx, .xls) o CSV (.csv)' 
      }, { status: 400 })
    }

    // Validate file size (max 10MB for data files)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        message: 'El archivo debe ser menor a 10MB' 
      }, { status: 400 })
    }

    // Parse file
    const buffer = Buffer.from(await file.arrayBuffer())
    let jsonData: ImportRow[] = []

    try {
      const workbook = new ExcelJS.Workbook()
      
      if (file.type === 'text/csv' || file.type === 'application/csv') {
        // Parse CSV - ExcelJS reads from buffer
        const csvText = buffer.toString('utf8')
        await workbook.csv.readFile(csvText as any) // Use readFile with string path or buffer
      } else {
        // Parse Excel using ExcelJS - load from buffer
        await workbook.xlsx.load(buffer as any)
      }
      
      const worksheet = workbook.worksheets[0]
      
      if (!worksheet) {
        return NextResponse.json({ 
          message: 'El archivo no contiene ninguna hoja de cálculo válida' 
        }, { status: 400 })
      }
      
      // Convert worksheet to JSON
      const headers = worksheet.getRow(1).values as any[]
      
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const rowData: ImportRow = {}
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber]
            if (header) {
              rowData[header.toString()] = cell.value
            }
          })
          if (Object.keys(rowData).length > 0) {
            jsonData.push(rowData)
          }
        }
      })
    } catch (error) {
      console.error('File parsing error:', error)
      return NextResponse.json({ 
        message: 'Error al leer el archivo. Verifique que sea un archivo válido.' 
      }, { status: 400 })
    }

    if (jsonData.length === 0) {
      return NextResponse.json({ 
        message: 'El archivo está vacío o no contiene datos válidos' 
      }, { status: 400 })
    }

    if (jsonData.length > 5000) {
      return NextResponse.json({ 
        message: 'Máximo 5000 registros por importación' 
      }, { status: 400 })
    }

    // Process import — batched strategy:
    // 1. Validate all rows in memory (zero DB calls)
    // 2. ONE batch query to find all existing members by email
    // 3. db.members.createMany() for all new records (ONE DB round-trip)
    // 4. Individual updates only for the update path (less common)
    // Note: bulk automation triggers are intentionally skipped —
    //       importing a CSV should not fire 5000 welcome emails.
    const result: ImportResult = {
      success: true,
      imported: 0,
      updated: 0,
      failed: 0,
      errors: []
    }

    // Step 1 — validate and map all rows in memory
    const validRows: { index: number; mapped: any }[] = []
    for (let i = 0; i < jsonData.length; i++) {
      const rowNumber = i + 2
      const mapped = mapFields(jsonData[i])
      mapped.churchId = session.user.churchId
      mapped.isActive = true

      const validationErrors = validateMemberData(mapped)
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
          result.errors.push({ row: rowNumber, field: 'validation', value: mapped, error })
        })
        result.failed++
        continue
      }
      validRows.push({ index: i, mapped })
    }

    // Step 2 — ONE batch query to find existing members by email
    const emailsToCheck = validRows.map(r => r.mapped.email).filter(Boolean) as string[]
    const existingByEmail = new Map<string, { id: string }>()
    if (emailsToCheck.length > 0) {
      const existing = await db.members.findMany({
        where: { churchId: session.user.churchId, email: { in: emailsToCheck }, isActive: true },
        select: { id: true, email: true }
      })
      existing.forEach(m => { if (m.email) existingByEmail.set(m.email, { id: m.id }) })
    }

    // Step 3 — split into creates vs updates vs skips
    const toCreate: any[] = []
    const toUpdate: { id: string; data: any; rowNumber: number }[] = []

    for (const { index, mapped } of validRows) {
      const rowNumber = index + 2
      const existingMember = mapped.email ? existingByEmail.get(mapped.email) : undefined

      if (existingMember && !updateExisting) {
        result.errors.push({
          row: rowNumber,
          field: 'duplicate',
          value: `${mapped.firstName} ${mapped.lastName}`,
          error: 'Miembro ya existe. Active "Actualizar existentes" para sobreescribir.'
        })
        result.failed++
        continue
      }

      if (existingMember && updateExisting) {
        const { churchId, isActive, ...updateData } = mapped
        toUpdate.push({ id: existingMember.id, data: updateData, rowNumber })
      } else {
        toCreate.push({ id: nanoid(), ...mapped })
      }
    }

    // Step 4 — ONE createMany call for all new members
    if (toCreate.length > 0) {
      try {
        await db.members.createMany({ data: toCreate, skipDuplicates: true })
        result.imported = toCreate.length
      } catch (batchError) {
        console.error('Batch create failed, falling back to row-by-row:', batchError)
        // Fallback: individual creates to surface which rows fail
        for (const memberData of toCreate) {
          try {
            await db.members.create({ data: memberData })
            result.imported++
          } catch (rowError) {
            result.errors.push({
              row: -1,
              field: 'system',
              value: `${memberData.firstName} ${memberData.lastName}`,
              error: 'Error al crear registro'
            })
            result.failed++
          }
        }
      }
    }

    // Step 5 — individual updates (less common path)
    for (const { id, data, rowNumber } of toUpdate) {
      try {
        await db.members.update({ where: { id }, data })
        result.updated++
      } catch (error) {
        console.error(`Error updating row ${rowNumber}:`, error)
        result.errors.push({ row: rowNumber, field: 'system', value: data, error: 'Error al actualizar registro' })
        result.failed++
      }
    }

    // Set overall success status
    result.success = result.failed < jsonData.length

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error importing members:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

