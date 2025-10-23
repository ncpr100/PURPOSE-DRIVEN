
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
import { Member } from '@prisma/client'
import { Save, X, User, Heart, Calendar, Brain, Home, UserCircle, Church, ArrowLeft } from 'lucide-react'
import { MemberSpiritualAssessment } from './member-spiritual-assessment'
import { AvailabilityMatrix } from './availability-matrix'
import { SkillsSelector } from './skills-selector'
import toast from 'react-hot-toast'

interface EnhancedMemberFormProps {
  member?: Member | null
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
    // Enhanced CRM fields
    emergencyContact: member?.emergencyContact || '',
    transportationOwned: member?.transportationOwned || false,
    childcareAvailable: member?.childcareAvailable || false,
    skillsMatrix: member?.skillsMatrix && Array.isArray(member.skillsMatrix) ? (member.skillsMatrix as string[]) : [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Update form data when member prop changes
  useEffect(() => {
    if (member) {
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
        emergencyContact: member.emergencyContact || '',
        transportationOwned: member.transportationOwned || false,
        childcareAvailable: member.childcareAvailable || false,
        skillsMatrix: member.skillsMatrix && Array.isArray(member.skillsMatrix) ? (member.skillsMatrix as string[]) : [],
      })
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
        if (formData.emergencyContact) cleanData.emergencyContact = formData.emergencyContact
        
        // Add dates only if they have valid values
        if (formData.birthDate) cleanData.birthDate = new Date(formData.birthDate)
        if (formData.baptismDate) cleanData.baptismDate = new Date(formData.baptismDate)
        if (formData.membershipDate) cleanData.membershipDate = new Date(formData.membershipDate)
        
        onSave(cleanData)
        toast.success('Miembro creado exitosamente')
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

    const data = {
      birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      occupation: formData.occupation,
    }

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        toast.success('Detalles personales guardados')
        setHasUnsavedChanges(false)
      } else {
        toast.error('Error al guardar detalles')
      }
    } catch (error) {
      toast.error('Error al guardar detalles personales')
    }
  }

  const handleSaveChurchInfo = async () => {
    if (!member?.id) {
      toast.error('Primero debe crear el miembro')
      return
    }

    const data = {
      baptismDate: formData.baptismDate ? new Date(formData.baptismDate) : null,
      membershipDate: formData.membershipDate ? new Date(formData.membershipDate) : null,
      emergencyContact: formData.emergencyContact,
      notes: formData.notes,
    }

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        toast.success('Información de iglesia guardada')
        setHasUnsavedChanges(false)
      } else {
        toast.error('Error al guardar')
      }
    } catch (error) {
      toast.error('Error al guardar información de iglesia')
    }
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
          <div className="border-l h-8" />
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6" />
              {member ? 'Información de Miembros' : 'Nuevo Miembro'}
            </h2>
            <p className="text-muted-foreground">
              Complete la información del miembro con evaluación espiritual y disponibilidad
            </p>
          </div>
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
                  <Label htmlFor="email">Email</Label>
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
                <Button onClick={handleSavePersonalInfo} disabled={isLoading}>
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
                <Button onClick={handleSaveAddress} disabled={isLoading || !member?.id}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Dirección
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
                      setFormData(prev => ({ ...prev, occupation: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSavePersonalDetails} disabled={isLoading || !member?.id}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Detalles Personales
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

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Nombre y teléfono de contacto de emergencia"
                  value={formData.emergencyContact}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                />
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
                <Button onClick={handleSaveChurchInfo} disabled={isLoading || !member?.id}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Información de Iglesia
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
    </div>
  )
}
