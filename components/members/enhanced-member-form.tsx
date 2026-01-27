
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { members } from '@prisma/client'
import { Save, X, User, Heart, Calendar, Brain, Home, UserCircle, Church, ArrowLeft } from 'lucide-react'
import { MemberSpiritualAssessment } from './member-spiritual-assessment'
import { AvailabilityMatrix } from './availability-matrix'
import { SkillsSelector } from './skills-selector'
import toast from 'react-hot-toast'

// Helper function to parse emergency contact field into structured data
function parseEmergencyContactField(emergencyContact: string | null | undefined, field: 'name' | 'phone' | 'address' | 'relationship'): string {
  if (!emergencyContact) return ''
  
  // Try to parse structured format: "Name | Phone | Address | Relationship"
  const parts = emergencyContact.split(' | ')
  
  switch (field) {
    case 'name':
      return parts[0] || ''
    case 'phone':
      return parts[1] || ''
    case 'address':
      return parts[2] || ''
    case 'relationship':
      return parts[3] || ''
    default:
      return ''
  }
}

// Helper function to combine emergency contact fields into single field
function combineEmergencyContactFields(name: string, phone: string, address: string, relationship: string): string {
  const parts = [name, phone, address, relationship].filter(part => part.trim() !== '')
  return parts.join(' | ')
}

interface EnhancedMemberFormProps {
  member?: members | null
  onSave: (memberData: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function EnhancedMemberForm({ member, onSave, onCancel, isLoading }: EnhancedMemberFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  
  // Helper function to safely format dates
  const formatDateForInput = (date: any): string => {
    if (!date) return ''
    try {
      if (typeof date === 'string') {
        return date.split('T')[0]
      }
      return new Date(date).toISOString().split('T')[0]
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }
  
  const [formData, setFormData] = useState({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    email: member?.email || '',
    phone: member?.phone || '',
    address: member?.address || '',
    city: member?.city || '',
    state: member?.state || '',
    zipCode: member?.zipCode || '',
    birthDate: formatDateForInput(member?.birthDate),
    baptismDate: formatDateForInput(member?.baptismDate),
    membershipDate: formatDateForInput(member?.membershipDate),
    maritalStatus: member?.maritalStatus || '',
    gender: member?.gender || '',
    occupation: member?.occupation || '',
    notes: member?.notes || '',
    // Enhanced CRM fields - Emergency Contact Details (parsed from single field)
    emergencyContactName: parseEmergencyContactField(member?.emergencyContact, 'name'),
    emergencyContactAddress: parseEmergencyContactField(member?.emergencyContact, 'address'),
    emergencyContactPhone: parseEmergencyContactField(member?.emergencyContact, 'phone'),
    emergencyContactRelationship: parseEmergencyContactField(member?.emergencyContact, 'relationship'),
    transportationOwned: member?.transportationOwned || false,
    childcareAvailable: member?.childcareAvailable || false,
    skillsMatrix: member?.skillsMatrix && Array.isArray(member.skillsMatrix) ? (member.skillsMatrix as string[]) : [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Update form data when member prop changes
  useEffect(() => {
    if (member) {
      console.log('[EnhancedMemberForm] member prop updated:', { id: member.id, name: `${member.firstName} ${member.lastName}` })
      setFormData({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        city: member.city || '',
        state: member.state || '',
        zipCode: member.zipCode || '',
        birthDate: formatDateForInput(member.birthDate),
        baptismDate: formatDateForInput(member.baptismDate),
        membershipDate: formatDateForInput(member.membershipDate),
        maritalStatus: member.maritalStatus || '',
        gender: member.gender || '',
        occupation: member.occupation || '',
        notes: member.notes || '',
        emergencyContactName: parseEmergencyContactField(member.emergencyContact, 'name'),
        emergencyContactAddress: parseEmergencyContactField(member.emergencyContact, 'address'),
        emergencyContactPhone: parseEmergencyContactField(member.emergencyContact, 'phone'),
        emergencyContactRelationship: parseEmergencyContactField(member.emergencyContact, 'relationship'),
        transportationOwned: member.transportationOwned || false,
        childcareAvailable: member.childcareAvailable || false,
        skillsMatrix: member.skillsMatrix && Array.isArray(member.skillsMatrix) ? (member.skillsMatrix as string[]) : [],
      })
    } else {
      console.log('[EnhancedMemberForm] member prop is null - new member mode')
    }
  }, [member])

  // Mark form as having unsaved changes when data changes
  // Skip on initial mount to avoid triggering on load
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    setHasUnsavedChanges(true)
  }, [formData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSpiritualAssessmentSave = (profile: any) => {
    toast.success('Evaluación espiritual guardada')
    setHasUnsavedChanges(false)
  }

  const handleAvailabilityMatrixSave = (matrix: any) => {
    toast.success('Disponibilidad guardada')
    setHasUnsavedChanges(false)
  }

  const handleSkillsSave = async () => {
    if (!member?.id) {
      toast.error('Primero debe guardar la información básica del miembro')
      return
    }

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillsMatrix: formData.skillsMatrix })
      })

      if (response.ok) {
        toast.success('Habilidades guardadas exitosamente')
        setHasUnsavedChanges(false)
      } else {
        toast.error('Error al guardar habilidades')
      }
    } catch (error) {
      console.error('Error saving skills:', error)
      toast.error('Error al guardar habilidades')
    }
  }

  // Individual save handlers for Basic Info sections
  const handleSavePersonalInfo = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrija los errores en el formulario')
      return
    }

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    }

    try {
      if (member?.id) {
        const response = await fetch(`/api/members/${member.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (response.ok) {
          toast.success('Información personal guardada')
          setHasUnsavedChanges(false)
        } else {
          toast.error('Error al guardar')
        }
      } else {
        // Creating new member - only send non-empty values
        const cleanData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
        }
        
        // Add optional fields only if they have values
        if (formData.email) cleanData.email = formData.email
        if (formData.phone) cleanData.phone = formData.phone
        if (formData.address) cleanData.address = formData.address
        if (formData.city) cleanData.city = formData.city
        if (formData.state) cleanData.state = formData.state
        if (formData.zipCode) cleanData.zipCode = formData.zipCode
        if (formData.gender) cleanData.gender = formData.gender
        if (formData.maritalStatus) cleanData.maritalStatus = formData.maritalStatus
        if (formData.occupation) cleanData.occupation = formData.occupation
        if (formData.notes) cleanData.notes = formData.notes
        
        // Combine emergency contact fields into single field
        const combinedEmergencyContact = combineEmergencyContactFields(
          formData.emergencyContactName,
          formData.emergencyContactPhone,
          formData.emergencyContactAddress,
          formData.emergencyContactRelationship
        )
        if (combinedEmergencyContact) cleanData.emergencyContact = combinedEmergencyContact
        
        // Add dates only if they have valid values
        if (formData.birthDate) cleanData.birthDate = new Date(formData.birthDate)
        if (formData.baptismDate) cleanData.baptismDate = new Date(formData.baptismDate)
        if (formData.membershipDate) cleanData.membershipDate = new Date(formData.membershipDate)
        
        // CRITICAL: Await onSave so parent updates editingMember state before continuing
        await onSave(cleanData)
        toast.success('Miembro creado exitosamente. Puede agregar dirección y detalles.')
        // Note: Cards 2-4 buttons will enable once member prop updates with new ID
      }
    } catch (error) {
      console.error('Error saving personal info:', error)
      toast.error('Error al guardar información personal')
    }
  }

  const handleSaveAddress = async () => {
    if (!member?.id) {
      toast.error('Primero debe crear el miembro')
      return
    }

    const data = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    }

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        toast.success('Dirección guardada')
        setHasUnsavedChanges(false)
      } else {
        toast.error('Error al guardar dirección')
      }
    } catch (error) {
      toast.error('Error al guardar dirección')
    }
  }

  const handleSavePersonalDetails = async () => {
    if (!member?.id) {
      toast.error('Primero debe crear el miembro')
      return
    }

    console.log('[handleSavePersonalDetails] Starting save process...')
    console.log('[handleSavePersonalDetails] Member ID:', member.id)
    console.log('[handleSavePersonalDetails] Member name:', member.firstName, member.lastName)
    console.log('[handleSavePersonalDetails] Form data to save:', {
      birthDate: formData.birthDate,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      occupation: formData.occupation
    })

    const data = {
      birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      occupation: formData.occupation,
    }

    console.log('[handleSavePersonalDetails] Processed data for API:', data)

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      console.log('[handleSavePersonalDetails] Response status:', response.status)
      
      if (response.ok) {
        const savedData = await response.json()
        console.log('[handleSavePersonalDetails] Saved successfully:', savedData)
        toast.success('Detalles personales guardados')
        setHasUnsavedChanges(false)
        
        // CRITICAL: Trigger parent refresh
        if (onSave) {
          await onSave(savedData)
        }
      } else {
        const error = await response.json()
        console.error('[handleSavePersonalDetails] Save failed:', error)
        toast.error('Error al guardar detalles')
      }
    } catch (error) {
      console.error('[handleSavePersonalDetails] Exception:', error)
      toast.error('Error al guardar detalles personales')
    }
  }

  const handleSaveChurchInfo = async () => {
    if (!member?.id) {
      toast.error('Primero debe crear el miembro')
      return
    }

    const combinedEmergencyContact = combineEmergencyContactFields(
      formData.emergencyContactName,
      formData.emergencyContactPhone,
      formData.emergencyContactAddress,
      formData.emergencyContactRelationship
    )

    console.log('[handleSaveChurchInfo] Saving to member ID:', member.id, 'Data:', {
      baptismDate: formData.baptismDate,
      membershipDate: formData.membershipDate,
      emergencyContact: combinedEmergencyContact,
      notes: formData.notes
    })

    const data = {
      baptismDate: formData.baptismDate ? new Date(formData.baptismDate) : null,
      membershipDate: formData.membershipDate ? new Date(formData.membershipDate) : null,
      emergencyContact: combinedEmergencyContact,
      notes: formData.notes,
    }

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      console.log('[handleSaveChurchInfo] Response status:', response.status)
      
      if (response.ok) {
        const savedData = await response.json()
        console.log('[handleSaveChurchInfo] Saved successfully:', savedData)
        toast.success('Información de iglesia guardada')
        setHasUnsavedChanges(false)
        
        // CRITICAL: Trigger parent refresh
        if (onSave) {
          await onSave(savedData)
        }
      } else {
        const error = await response.json()
        console.error('[handleSaveChurchInfo] Save failed:', error)
        toast.error('Error al guardar')
      }
    } catch (error) {
      console.error('[handleSaveChurchInfo] Exception:', error)
      toast.error('Error al guardar información de iglesia')
    }
  }

  // Global "Guardar y Cerrar" handler - saves ALL data and closes dialog
  const handleSaveAndClose = async () => {
    console.log('[handleSaveAndClose] Called with member:', member?.id, member?.firstName, member?.lastName)
    console.log('[handleSaveAndClose] hasUnsavedChanges:', hasUnsavedChanges)
    console.log('[handleSaveAndClose] activeTab:', activeTab)
    
    // If no member created yet, create it first
    if (!member?.id) {
      const personalData: Record<string, any> = {}
      if (formData.firstName) personalData.firstName = formData.firstName
      if (formData.lastName) personalData.lastName = formData.lastName
      if (formData.email) personalData.email = formData.email
      if (formData.phone) personalData.phone = formData.phone
      
      if (!personalData.firstName || !personalData.lastName) {
        toast.error('Debe ingresar nombre y apellido antes de guardar')
        return
      }
      
      await handleSavePersonalInfo()
      // After creating member, onSave will update editingMember with new ID
      // But we need to wait for that to complete before continuing
      // Since we don't have access to the new member here, just show message
      toast.success('Miembro creado. Puede cerrar o continuar editando.')
      return
    }

    // If member exists and has unsaved changes, save everything in active tab
    if (hasUnsavedChanges) {
      // Based on active tab, save the appropriate section
      if (activeTab === 'basic') {
        // Save all 4 Cards if we're on basic tab
        const promises = []
        
        // Card 1: Personal Info (only if it changed)
        promises.push(
          fetch(`/api/members/${member.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
            })
          })
        )
        
        // Card 2: Address
        promises.push(
          fetch(`/api/members/${member.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            })
          })
        )
        
        // Card 3: Personal Details
        console.log('[handleSaveAndClose] Adding Card 3 save to promises with data:', {
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          occupation: formData.occupation,
        })
        
        promises.push(
          fetch(`/api/members/${member.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
              gender: formData.gender,
              maritalStatus: formData.maritalStatus,
              occupation: formData.occupation,
            })
          })
        )
        
        // Card 4: Church Info
        promises.push(
          fetch(`/api/members/${member.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              baptismDate: formData.baptismDate ? new Date(formData.baptismDate) : null,
              membershipDate: formData.membershipDate ? new Date(formData.membershipDate) : null,
              emergencyContact: combineEmergencyContactFields(
                formData.emergencyContactName,
                formData.emergencyContactPhone,
                formData.emergencyContactAddress,
                formData.emergencyContactRelationship
              ),
              notes: formData.notes,
            })
          })
        )
        
        try {
          await Promise.all(promises)
          toast.success('Todos los cambios guardados exitosamente')
          setHasUnsavedChanges(false)
        } catch (error) {
          toast.error('Error al guardar algunos cambios')
          return // Don't close if save failed
        }
      }
    }

    // Close dialog
    onCancel()
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Miembros
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600">
              Cambios sin guardar
            </Badge>
          )}
          {member?.spiritualGiftsStructured && (
            <Badge variant="secondary" className="text-green-700">
              <Heart className="h-3 w-3 mr-1" />
              Evaluación completa
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="spiritual" className="relative">
            Evaluación Espiritual
            {member?.spiritualGiftsStructured && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </TabsTrigger>
          <TabsTrigger value="skills" className="relative">
            Habilidades
            {member?.skillsMatrix && Array.isArray(member.skillsMatrix) && (member.skillsMatrix as any[]).length > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
            )}
          </TabsTrigger>
          <TabsTrigger value="availability">
            Disponibilidad
            {member?.availabilityScore && member.availabilityScore > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          {/* Card 1: Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Nombre, correo y teléfono del miembro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, firstName: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, lastName: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, phone: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSavePersonalInfo} disabled={isLoading} variant="default">
                  <Save className="w-4 h-4 mr-2" />
                  {member ? 'Guardar Información Personal' : 'Crear Miembro'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Dirección
              </CardTitle>
              <CardDescription>
                Ubicación residencial del miembro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, address: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, city: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    autoComplete="off"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado/Provincia</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, state: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    autoComplete="off"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Código Postal</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, zipCode: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => {
                    console.log('[Guardar Dirección] Clicked. member.id:', member?.id, 'isLoading:', isLoading)
                    handleSaveAddress()
                  }} 
                  disabled={isLoading || !member?.id} 
                  variant="default"
                  className={member?.id ? '' : 'opacity-50 cursor-not-allowed'}
                  title={!member?.id ? 'Primero debe crear el miembro' : 'Guardar dirección'}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Dirección
                  {!member?.id && <span className="ml-2 text-xs">(esperando ID)</span>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Detalles Personales
              </CardTitle>
              <CardDescription>
                Fecha de nacimiento, género, estado civil y ocupación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, birthDate: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, gender: value }))
                      setHasUnsavedChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                      <SelectItem value="no-especificar">Prefiero no especificar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Estado Civil</Label>
                  <Select 
                    value={formData.maritalStatus} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, maritalStatus: value }))
                      setHasUnsavedChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado civil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soltero">Soltero(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viudo">Viudo(a)</SelectItem>
                      <SelectItem value="union-libre">Unión Libre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Ocupación</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => {
                      console.log('[Card3] Occupation changed from:', formData.occupation, 'to:', e.target.value)
                      setFormData(prev => ({ ...prev, occupation: e.target.value }))
                      setHasUnsavedChanges(true)
                      console.log('[Card3] hasUnsavedChanges set to true')
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={handleSavePersonalDetails} 
                  disabled={isLoading || !member?.id} 
                  variant="default"
                  className={member?.id ? '' : 'opacity-50 cursor-not-allowed'}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Detalles Personales
                  {!member?.id && <span className="ml-2 text-xs">(esperando ID)</span>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Church Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-5 w-5" />
                Información de Iglesia
              </CardTitle>
              <CardDescription>
                Fechas importantes, contacto de emergencia y notas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baptismDate">Fecha de Bautismo</Label>
                  <Input
                    id="baptismDate"
                    type="date"
                    value={formData.baptismDate}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, baptismDate: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="membershipDate">Fecha de Membresía</Label>
                  <Input
                    id="membershipDate"
                    type="date"
                    value={formData.membershipDate}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, membershipDate: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Nombre del Contacto de Emergencia</Label>
                  <Input
                    id="emergencyContactName"
                    placeholder="Nombre completo del contacto"
                    value={formData.emergencyContactName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    autoComplete="off"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Teléfono del Contacto de Emergencia</Label>
                  <Input
                    id="emergencyContactPhone"
                    placeholder="Número de teléfono"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    autoComplete="off"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactAddress">Dirección del Contacto de Emergencia</Label>
                  <Input
                    id="emergencyContactAddress"
                    placeholder="Dirección completa"
                    value={formData.emergencyContactAddress}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, emergencyContactAddress: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    autoComplete="off"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relación con el Miembro</Label>
                  <Input
                    id="emergencyContactRelationship"
                    placeholder="Ej: Esposo/a, Padre/Madre, Hermano/a, Amigo/a"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    autoComplete="off"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, notes: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={handleSaveChurchInfo} 
                  disabled={isLoading || !member?.id} 
                  variant="default"
                  className={member?.id ? '' : 'opacity-50 cursor-not-allowed'}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Información de Iglesia
                  {!member?.id && <span className="ml-2 text-xs">(esperando ID)</span>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spiritual Assessment Tab */}
        <TabsContent value="spiritual">
          {member?.id ? (
            <MemberSpiritualAssessment 
              memberId={member.id}
              memberName={`${formData.firstName} ${formData.lastName}`}
              onAssessmentComplete={handleSpiritualAssessmentSave}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Primero guarde la información básica</h3>
                <p className="text-muted-foreground">
                  La evaluación espiritual estará disponible después de crear el miembro
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          {member?.id ? (
            <Card>
              <CardContent className="pt-6">
                {activeTab === 'skills' ? (
                  <>
                    <SkillsSelector
                      memberName={`${formData.firstName} ${formData.lastName}`}
                      existingSkills={member?.skillsMatrix && Array.isArray(member.skillsMatrix) ? (member.skillsMatrix as string[]) : []}
                      onSkillsChange={(skills) => {
                        setFormData(prev => ({ ...prev, skillsMatrix: skills }))
                        setHasUnsavedChanges(true)
                      }}
                    />
                    <div className="flex justify-end mt-6 pt-6 border-t">
                      <Button onClick={handleSkillsSave} disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Habilidades
                      </Button>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Primero guarde la información básica</h3>
                <p className="text-muted-foreground">
                  Las habilidades estarán disponibles después de crear el miembro
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Availability Matrix Tab */}
        <TabsContent value="availability">
          {member?.id ? (
            <AvailabilityMatrix
              memberId={member.id}
              memberName={`${formData.firstName} ${formData.lastName}`}
              onSave={handleAvailabilityMatrixSave}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Primero guarde la información básica</h3>
                <p className="text-muted-foreground">
                  La matriz de disponibilidad estará disponible después de crear el miembro
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Global Save and Close Button */}
      <div className="sticky bottom-0 bg-background border-t pt-4 pb-2 mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {hasUnsavedChanges 
              ? '⚠️ Hay cambios sin guardar en esta sección' 
              : '✓ Todos los cambios guardados'}
          </p>
          <Button 
            onClick={handleSaveAndClose}
            size="lg"
            className="min-w-[200px]"
            variant="default"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {hasUnsavedChanges ? 'Guardar Todo y Cerrar' : 'Cerrar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
