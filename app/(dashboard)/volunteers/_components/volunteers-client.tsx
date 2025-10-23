

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPlus, Search, Users, Calendar, Phone, Mail, MapPin, Brain, Sparkles, Zap, BarChart3, Crown, PlayCircle, Target, Activity, CheckCircle, Star, Eye, Lightbulb, User } from 'lucide-react'
import { toast } from 'sonner'
import { SmartSchedulingDashboard } from '@/components/volunteers/smart-scheduling-dashboard'
import { IntelligentSchedulingEngine } from '@/components/volunteers/intelligent-scheduling-engine'
import { WorkloadAnalyticsDashboard } from '@/components/volunteers/workload-analytics-dashboard'
import { RecruitmentPipelineDashboard } from '@/components/volunteers/recruitment-pipeline-dashboard'
import { LeadershipDevelopmentDashboard } from '@/components/volunteers/leadership-development-dashboard'
import { OnboardingWorkflowsDashboard } from '@/components/volunteers/onboarding-workflows-dashboard'

interface Volunteer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  skills?: string
  availability?: string
  ministry?: { name: string }
  member?: { id: string; firstName: string; lastName: string }
  assignments: any[]
  isActive: boolean
}

interface Ministry {
  id: string
  name: string
}

interface VolunteersClientProps {
  userRole: string
  churchId: string
}

export function VolunteersClient({ userRole, churchId }: VolunteersClientProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [spiritualGifts, setSpiritualGifts] = useState<any[]>([])
  const [memberSpiritualProfile, setMemberSpiritualProfile] = useState<any>(null)
  const [volunteerProfiles, setVolunteerProfiles] = useState<Map<string, any>>(new Map())
  const [memberAvailabilityMatrix, setMemberAvailabilityMatrix] = useState<any>(null)

  // Debug: Monitor dialog state changes
  useEffect(() => {
    console.log('🔍 isAssignDialogOpen changed to:', isAssignDialogOpen)
  }, [isAssignDialogOpen])

  useEffect(() => {
    console.log('🔍 isProfileDialogOpen changed to:', isProfileDialogOpen)
  }, [isProfileDialogOpen])

  useEffect(() => {
    console.log('🔍 selectedVolunteer changed to:', selectedVolunteer?.firstName, selectedVolunteer?.lastName)
  }, [selectedVolunteer])

  // Handler functions for buttons
  const handleOpenAssignDialog = (volunteer: Volunteer) => {
    console.log('📋 Opening assignment dialog for:', volunteer.firstName, volunteer.lastName)
    setSelectedVolunteer(volunteer)
    setIsAssignDialogOpen(true)
  }

  const handleOpenProfileDialog = (volunteer: Volunteer) => {
    console.log('👤 Opening profile dialog for:', volunteer.firstName, volunteer.lastName)
    const memberId = volunteer.member?.id
    if (!memberId) {
      toast.error('Este voluntario no tiene un miembro vinculado')
      return
    }
    setSelectedVolunteer(volunteer)
    setIsProfileDialogOpen(true)
    fetchMemberSpiritualProfile(memberId)
    fetchMemberAvailabilityMatrix(memberId)
  }

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    ministryId: 'no-ministry'
  })

  const [assignmentData, setAssignmentData] = useState({
    title: '',
    description: '',
    assignmentType: 'temporary', // 'temporary' or 'permanent'
    date: '',
    endDate: '', // For temporary assignments
    startTime: '',
    endTime: '',
    notes: ''
  })

  useEffect(() => {
    fetchVolunteers()
    fetchMinistries()
    fetchSpiritualGifts()
  }, [])

  // Fetch spiritual profiles for all volunteers (for recommendations)
  useEffect(() => {
    if (volunteers.length > 0) {
      fetchAllSpiritualProfiles()
    }
  }, [volunteers.length])

  const fetchAllSpiritualProfiles = async () => {
    console.log('🔄 Fetching spiritual profiles for all volunteers...')
    const profiles = new Map()
    
    for (const volunteer of volunteers) {
      // Skip volunteers without a linked member
      // Note: API includes member relation, so we check volunteer.member
      const memberId = volunteer.member?.id
      
      if (!memberId) {
        console.warn(`⚠️ Volunteer ${volunteer.firstName} ${volunteer.lastName} has no linked member`)
        continue
      }
      
      try {
        const response = await fetch(`/api/members/${memberId}/spiritual-profile`)
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            profiles.set(volunteer.id, data.profile)
          }
        }
      } catch (error) {
        console.error(`Error loading profile for ${volunteer.firstName}:`, error)
      }
    }
    
    console.log('✅ Loaded spiritual profiles for', profiles.size, 'volunteers')
    setVolunteerProfiles(profiles)
  }

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/volunteers')
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data)
      } else {
        toast.error('Error al cargar voluntarios')
      }
    } catch (error) {
      toast.error('Error al cargar voluntarios')
    } finally {
      setLoading(false)
    }
  }

  const fetchMinistries = async () => {
    try {
      const response = await fetch('/api/ministries')
      if (response.ok) {
        const data = await response.json()
        setMinistries(data)
      }
    } catch (error) {
      console.error('Error fetching ministries:', error)
    }
  }

  const fetchSpiritualGifts = async () => {
    try {
      const response = await fetch('/api/spiritual-gifts')
      if (response.ok) {
        const data = await response.json()
        setSpiritualGifts(data.gifts || [])
      } else {
        console.error('Error loading spiritual gifts')
      }
    } catch (error) {
      console.error('Error loading spiritual gifts:', error)
    }
  }

  const fetchMemberSpiritualProfile = async (memberId: string) => {
    try {
      console.log('🔄 Fetching spiritual profile for member:', memberId)
      const response = await fetch(`/api/members/${memberId}/spiritual-profile`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Spiritual profile loaded:', data.profile)
        setMemberSpiritualProfile(data.profile)
      } else {
        console.log('ℹ️ No spiritual profile found')
        setMemberSpiritualProfile(null)
      }
    } catch (error) {
      console.error('❌ Error loading member spiritual profile:', error)
      setMemberSpiritualProfile(null)
    }
  }

  const fetchMemberAvailabilityMatrix = async (memberId: string) => {
    try {
      console.log('🔄 Fetching availability matrix for member:', memberId)
      const response = await fetch(`/api/availability-matrix?memberId=${memberId}`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Availability matrix loaded:', data.matrix)
        setMemberAvailabilityMatrix(data.matrix)
      } else {
        console.log('ℹ️ No availability matrix found')
        setMemberAvailabilityMatrix(null)
      }
    } catch (error) {
      console.error('❌ Error loading availability matrix:', error)
      setMemberAvailabilityMatrix(null)
    }
  }

  // Helper function to format availability matrix display
  const formatAvailabilityDisplay = (matrix: any) => {
    if (!matrix || !matrix.recurringAvailability || Object.keys(matrix.recurringAvailability).length === 0) {
      return 'No se ha registrado disponibilidad'
    }

    const dayNames: { [key: string]: string } = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }

    const timeNames: { [key: string]: string } = {
      morning: 'Mañana (6:00 - 12:00)',
      afternoon: 'Tarde (12:00 - 18:00)',
      evening: 'Noche (18:00 - 22:00)'
    }

    // Extract days and times from recurringAvailability object
    const availableDays: string[] = []
    const timeSlots = new Set<string>()
    
    Object.entries(matrix.recurringAvailability).forEach(([day, times]: [string, any]) => {
      if (times && typeof times === 'object') {
        const hasTimes = Object.values(times).some(val => val === true)
        if (hasTimes) {
          availableDays.push(dayNames[day] || day)
          Object.entries(times).forEach(([time, available]) => {
            if (available) {
              timeSlots.add(timeNames[time] || time)
            }
          })
        }
      }
    })

    if (availableDays.length === 0) {
      return 'No se ha registrado disponibilidad'
    }

    let display = `Disponible ${availableDays.join(', ')}`
    if (timeSlots.size > 0) {
      display += ` - ${Array.from(timeSlots).join(', ')}`
    }
    
    return display
  }

  const handleCreateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName) {
      toast.error('Nombre y apellido son requeridos')
      return
    }

    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
          availability: formData.availability || null,
          ministryId: formData.ministryId === 'no-ministry' ? null : formData.ministryId
        }),
      })

      if (response.ok) {
        toast.success('Voluntario creado exitosamente')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          skills: '',
          availability: '',
          ministryId: 'no-ministry'
        })
        setIsCreateDialogOpen(false)
        fetchVolunteers()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al crear voluntario')
      }
    } catch (error) {
      toast.error('Error al crear voluntario')
    }
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation based on assignment type
    if (!selectedVolunteer || !assignmentData.title) {
      toast.error('El título de la asignación es requerido')
      return
    }

    if (assignmentData.assignmentType === 'temporary') {
      if (!assignmentData.date || !assignmentData.startTime || !assignmentData.endTime) {
        toast.error('Para asignaciones temporales, la fecha y horarios son requeridos')
        return
      }
    }

    try {
      const response = await fetch('/api/volunteer-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assignmentData,
          volunteerId: selectedVolunteer.id
        }),
      })

      if (response.ok) {
        const isPermanent = assignmentData.assignmentType === 'permanent'
        toast.success(
          isPermanent 
            ? 'Asignación permanente creada exitosamente' 
            : 'Asignación temporal creada exitosamente'
        )
        setAssignmentData({
          title: '',
          description: '',
          assignmentType: 'temporary',
          date: '',
          endDate: '',
          startTime: '',
          endTime: '',
          notes: ''
        })
        setIsAssignDialogOpen(false)
        setSelectedVolunteer(null)
        fetchVolunteers()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al crear asignación')
      }
    } catch (error) {
      toast.error('Error al crear asignación')
    }
  }

  const filteredVolunteers = volunteers.filter(volunteer =>
    `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.ministry?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Sistema de Voluntarios Inteligente
          </h1>
          <p className="text-muted-foreground">
            Gestión completa con IA: Reclutamiento, Programación, y Desarrollo de Liderazgo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-4 w-4 mr-2" />
            IA Activa
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="recruitment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="recruitment" className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Reclutamiento
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Recomendaciones
          </TabsTrigger>
          <TabsTrigger value="leadership" className="flex items-center gap-1">
            <Crown className="h-4 w-4" />
            Liderazgo
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center gap-1">
            <PlayCircle className="h-4 w-4" />
            Onboarding
          </TabsTrigger>
          <TabsTrigger value="intelligent" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Motor IA
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="volunteers">Gestión</TabsTrigger>
        </TabsList>

        {/* Phase 3: Recruitment Pipeline Dashboard */}
        <TabsContent value="recruitment">
          <RecruitmentPipelineDashboard churchId={churchId} userRole={userRole} />
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                Sistema de Recomendaciones Inteligente
              </h2>
              <p className="text-muted-foreground">
                Sugerencias personalizadas basadas en habilidades, disponibilidad y dones espirituales
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.filter(v => v.isActive).map((volunteer) => {
                const profile = volunteerProfiles.get(volunteer.id)
                const skillsArray = volunteer.skills ? JSON.parse(volunteer.skills) : []
                
                // Calculate REAL match score based on spiritual profile
                let matchScore = 50 // Base score
                if (profile) {
                  const primaryGifts = profile.primaryGifts || []
                  const secondaryGifts = profile.secondaryGifts || []
                  const ministryPassions = profile.ministryPassions || []
                  
                  matchScore = 50 + (primaryGifts.length * 10) + (secondaryGifts.length * 5) + (ministryPassions.length * 3)
                  matchScore = Math.min(matchScore, 99) // Cap at 99%
                }
                
                // Get primary gift categories for display
                const primaryGiftNames = profile?.primaryGifts?.slice(0, 2).map((giftId: string) => {
                  // Extract category from gift ID (e.g., "MUSICA" from "musica-instrumento")
                  const categoryId = giftId.split('-')[0]
                  return categoryId.charAt(0).toUpperCase() + categoryId.slice(1).toLowerCase()
                }) || []
                
                // Determine leadership potential
                const hasLeadershipGifts = profile?.primaryGifts?.some((giftId: string) => 
                  giftId.includes('liderazgo') || giftId.includes('vision')
                ) || false
                
                // Determine availability status (mock for now - would need actual availability data)
                const isAvailableWeekend = true // Would check actual availability matrix
                
                return (
                  <Card key={volunteer.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-400">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {volunteer.firstName} {volunteer.lastName}
                        </CardTitle>
                        <Badge variant="secondary" className={
                          matchScore >= 80 ? "bg-green-100 text-green-800" :
                          matchScore >= 60 ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }>
                          {matchScore}% match
                        </Badge>
                      </div>
                      <CardDescription>
                        {volunteer.ministry?.name || 'Sin ministerio asignado'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Show Spiritual Gifts if available */}
                      {profile && (profile.primaryGifts?.length > 0 || profile.secondaryGifts?.length > 0) ? (
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Dones Espirituales</h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.primaryGifts?.slice(0, 3).map((giftId: string, index: number) => (
                              <Badge key={index} variant="default" className="text-xs">
                                {giftId.split('-').pop()?.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                            {profile.primaryGifts?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{profile.primaryGifts.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : skillsArray.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Habilidades Destacadas</h4>
                          <div className="flex flex-wrap gap-1">
                            {skillsArray.slice(0, 3).map((skill: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs border-yellow-400 text-yellow-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <p className="text-xs text-amber-800">
                            <strong>Nota:</strong> Este voluntario no ha completado su evaluación espiritual. 
                            Recomendamos completarla para mejores recomendaciones.
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Recomendaciones</h4>
                        <div className="space-y-2">
                          {profile && primaryGiftNames.length > 0 ? (
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-green-500" />
                              <span>Ideal para Ministerio de {primaryGiftNames[0]}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Target className="h-4 w-4" />
                              <span>Completar evaluación para recomendaciones</span>
                            </div>
                          )}
                          {isAvailableWeekend && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>Disponible fines de semana</span>
                            </div>
                          )}
                          {hasLeadershipGifts && (
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="h-4 w-4 text-purple-500" />
                              <span>Alto potencial de liderazgo</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          type="button"
                          onClick={() => handleOpenAssignDialog(volunteer)}
                        >
                          <Activity className="h-4 w-4 mr-1" />
                          Asignar Actividad
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault()
                            console.log('Ver Perfil clicked for:', volunteer.firstName, volunteer.lastName)
                            handleOpenProfileDialog(volunteer)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {volunteers.filter(v => v.isActive).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Lightbulb className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay voluntarios activos</h3>
                  <p className="text-gray-600">
                    {volunteers.length === 0 ? 'Agrega voluntarios para generar recomendaciones personalizadas' : 'Los voluntarios existentes no están marcados como activos'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Phase 3: Leadership Development Dashboard */}
        <TabsContent value="leadership">
          <LeadershipDevelopmentDashboard churchId={churchId} userRole={userRole} />
        </TabsContent>

        {/* Phase 3: Onboarding Workflows Dashboard */}
        <TabsContent value="onboarding">
          <OnboardingWorkflowsDashboard churchId={churchId} userRole={userRole} />
        </TabsContent>

        {/* Smart Dashboard Tab */}
        <TabsContent value="dashboard">
          <SmartSchedulingDashboard churchId={churchId} userRole={userRole} />
        </TabsContent>

        {/* Phase 2: Intelligent Scheduling Engine */}
        <TabsContent value="intelligent">
          <IntelligentSchedulingEngine churchId={churchId} userRole={userRole} />
        </TabsContent>

        {/* Phase 2: Workload Analytics Dashboard */}
        <TabsContent value="analytics">
          <WorkloadAnalyticsDashboard churchId={churchId} userRole={userRole} />
        </TabsContent>

        {/* Traditional Volunteers Management Tab */}
        <TabsContent value="volunteers" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Gestión de Voluntarios</h2>
              <p className="text-muted-foreground">Administra los voluntarios de tu iglesia</p>
            </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Voluntario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Voluntario</DialogTitle>
              <DialogDescription>
                Agrega un nuevo voluntario a tu iglesia
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateVolunteer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ministryId">Ministerio</Label>
                <Select value={formData.ministryId} onValueChange={(value) => setFormData(prev => ({ ...prev, ministryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ministerio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-ministry">Sin ministerio</SelectItem>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry.id} value={ministry.id}>
                        {ministry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades (separadas por comas)</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="Música, Sonido, Niños, etc."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Voluntario</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar voluntarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voluntarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers.filter(v => v.isActive).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignaciones Activas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {volunteers.reduce((acc, v) => acc + v.assignments.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ministerios Activos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(volunteers.filter(v => v.ministry).map(v => v.ministry!.name)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                {volunteer.firstName} {volunteer.lastName}
              </CardTitle>
              <CardDescription>
                {volunteer.ministry?.name || 'Sin ministerio asignado'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {volunteer.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{volunteer.email}</span>
                </div>
              )}
              
              {volunteer.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{volunteer.phone}</span>
                </div>
              )}

              {volunteer.skills && (
                <div className="flex flex-wrap gap-1">
                  {JSON.parse(volunteer.skills).slice(0, 3).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge variant={volunteer.assignments.length > 0 ? "default" : "secondary"}>
                  {volunteer.assignments.length} asignaciones
                </Badge>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={() => handleOpenAssignDialog(volunteer)}
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Asignar Actividad
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="flex-1"
                  type="button"
                  onClick={() => handleOpenProfileDialog(volunteer)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron voluntarios</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer voluntario'}
            </p>
          </CardContent>
        </Card>
      )}
      </TabsContent>


      </Tabs>

      {/* Assignment Dialog - Moved outside Tabs so it works from all tabs */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Asignación</DialogTitle>
            <DialogDescription>
              Asignar tarea a {selectedVolunteer?.firstName} {selectedVolunteer?.lastName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            {/* Assignment Type Selector */}
            <div className="space-y-2 border-b pb-4">
              <Label htmlFor="assignmentType" className="text-base font-semibold">Tipo de Asignación *</Label>
              <Select
                value={assignmentData.assignmentType}
                onValueChange={(value) => setAssignmentData(prev => ({ ...prev, assignmentType: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temporary">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Temporal</div>
                        <div className="text-xs text-muted-foreground">Para eventos o días específicos</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="permanent">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="font-medium">Permanente</div>
                        <div className="text-xs text-muted-foreground">Rol continuo sin fecha de finalización</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {assignmentData.assignmentType === 'permanent' && (
                <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-sm text-purple-900">
                    <strong>Nota:</strong> Las asignaciones permanentes no tienen fecha de finalización. 
                    El voluntario puede tener múltiples asignaciones temporales además de su rol permanente.
                  </p>
                </div>
              )}
              {assignmentData.assignmentType === 'temporary' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-900">
                    <strong>Nota:</strong> Las asignaciones temporales requieren fecha y horario específicos.
                    Recibirás notificación cuando la asignación esté próxima a finalizar.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título de la Asignación *</Label>
              <Input
                id="title"
                placeholder={assignmentData.assignmentType === 'permanent' ? 'Ej: Líder de Alabanza' : 'Ej: Ayuda en Evento de Navidad'}
                value={assignmentData.title}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe las responsabilidades y expectativas..."
                value={assignmentData.description}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Conditional fields based on assignment type */}
            {assignmentData.assignmentType === 'temporary' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha de Inicio *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={assignmentData.date}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Finalización (Opcional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={assignmentData.endDate}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de Inicio *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={assignmentData.startTime}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de Finalización *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={assignmentData.endTime}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {assignmentData.assignmentType === 'permanent' && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900">Rol Permanente</h4>
                </div>
                <p className="text-sm text-purple-700">
                  Este voluntario será asignado de manera continua. No se requiere fecha o horario específico.
                  Puedes agregar asignaciones temporales adicionales en cualquier momento.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={assignmentData.notes}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Asignación</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Perfil Completo de {selectedVolunteer?.firstName} {selectedVolunteer?.lastName}
            </DialogTitle>
            <DialogDescription>
              Información detallada del voluntario y recomendaciones
            </DialogDescription>
          </DialogHeader>
          
          {selectedVolunteer && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Información Personal</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedVolunteer.firstName} {selectedVolunteer.lastName}</span>
                    </div>
                    {selectedVolunteer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedVolunteer.email}</span>
                      </div>
                    )}
                    {selectedVolunteer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedVolunteer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ministerio</Label>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-sm">
                      {selectedVolunteer.ministry?.name || 'Sin ministerio asignado'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Skills and Availability */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Habilidades</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedVolunteer.skills ? 
                      JSON.parse(selectedVolunteer.skills).map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      )) : 
                      <span className="text-sm text-muted-foreground">No se han registrado habilidades</span>
                    }
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Disponibilidad</Label>
                  <div className="mt-2">
                    {memberAvailabilityMatrix ? (
                      <div className="space-y-2">
                        <p className="text-sm">{formatAvailabilityDisplay(memberAvailabilityMatrix)}</p>
                        {memberAvailabilityMatrix.notes && (
                          <p className="text-xs text-muted-foreground italic">{memberAvailabilityMatrix.notes}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No se ha registrado disponibilidad</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Spiritual Gifts */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Dones Espirituales</Label>
                  <div className="mt-2">
                    {memberSpiritualProfile ? (
                      <div className="space-y-3">
                        {/* Primary Gifts */}
                        {memberSpiritualProfile.primaryGifts && memberSpiritualProfile.primaryGifts.length > 0 && (
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Dones Primarios</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {memberSpiritualProfile.primaryGifts.map((giftId: string, index: number) => {
                                const gift = spiritualGifts.find(g => g.id === giftId)
                                return (
                                  <Badge key={index} variant="default" className="text-xs bg-blue-100 text-blue-800">
                                    {gift?.name || giftId}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Secondary Gifts */}
                        {memberSpiritualProfile.secondaryGifts && memberSpiritualProfile.secondaryGifts.length > 0 && (
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Dones Secundarios</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {memberSpiritualProfile.secondaryGifts.map((giftId: string, index: number) => {
                                const gift = spiritualGifts.find(g => g.id === giftId)
                                return (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {gift?.name || giftId}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Spiritual Calling */}
                        {memberSpiritualProfile.spiritualCalling && (
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Llamado Espiritual</Label>
                            <p className="text-sm mt-1">{memberSpiritualProfile.spiritualCalling}</p>
                          </div>
                        )}

                        {/* Ministry Passions */}
                        {memberSpiritualProfile.ministryPassions && memberSpiritualProfile.ministryPassions.length > 0 && (
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Pasiones Ministeriales</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {memberSpiritualProfile.ministryPassions.map((passion: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {passion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Brain className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No hay evaluación de dones espirituales</p>
                        <p className="text-xs text-muted-foreground mt-1">El voluntario no ha completado la evaluación</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            window.location.href = `/volunteers/spiritual-assessment?volunteerId=${selectedVolunteer.id}&memberId=${selectedVolunteer.id}`
                          }}
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Completar Evaluación Espiritual
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignment History */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Historial de Asignaciones ({selectedVolunteer.assignments.length})
                </Label>
                <div className="mt-2">
                  {selectedVolunteer.assignments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedVolunteer.assignments.slice(0, 3).map((assignment: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Asignación {index + 1}</span>
                          <Badge variant="outline" className="ml-auto text-xs">Activa</Badge>
                        </div>
                      ))}
                      {selectedVolunteer.assignments.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{selectedVolunteer.assignments.length - 3} asignaciones más
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay asignaciones registradas</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Recomendaciones Inteligentes</Label>
                <div className="mt-2 space-y-2">
                  {memberSpiritualProfile ? (
                    <>
                      {/* Calculate real match score based on spiritual profile */}
                      {(() => {
                        const primaryGifts = memberSpiritualProfile.primaryGifts || []
                        const secondaryGifts = memberSpiritualProfile.secondaryGifts || []
                        const ministryPassions = memberSpiritualProfile.ministryPassions || []
                        const hasLeadershipGifts = primaryGifts.some((giftId: string) => 
                          ['leadership', 'administration', 'wisdom', 'teaching'].includes(giftId)
                        )
                        
                        const matchScore = Math.min(100, 50 + (primaryGifts.length * 10) + (secondaryGifts.length * 5) + (ministryPassions.length * 3))
                        
                        return (
                          <>
                            {primaryGifts.length > 0 && (
                              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                <span>
                                  {primaryGifts.length === 1 ? 'Don primario identificado' : `${primaryGifts.length} dones primarios identificados`}
                                  {primaryGifts.length > 0 && `: ${primaryGifts.map((id: string) => spiritualGifts.find(g => g.id === id)?.name || id).join(', ')}`}
                                </span>
                                <Badge variant="outline" className="ml-auto text-xs bg-blue-100 text-blue-700">{matchScore}% match</Badge>
                              </div>
                            )}
                            
                            {hasLeadershipGifts && (
                              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded text-sm">
                                <Crown className="h-4 w-4 text-purple-500" />
                                <span>Potencial para desarrollo de liderazgo</span>
                                <Badge variant="outline" className="ml-auto text-xs bg-purple-100 text-purple-700">Alto</Badge>
                              </div>
                            )}
                            
                            {memberAvailabilityMatrix && memberAvailabilityMatrix.days?.includes('sunday') && (
                              <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-sm">
                                <Calendar className="h-4 w-4 text-green-500" />
                                <span>Disponibilidad dominical confirmada</span>
                                <Badge variant="outline" className="ml-auto text-xs bg-green-100 text-green-700">Excelente</Badge>
                              </div>
                            )}
                            
                            {ministryPassions.length > 0 && (
                              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded text-sm">
                                <Target className="h-4 w-4 text-amber-500" />
                                <span>
                                  {ministryPassions.length === 1 ? 'Pasión ministerial identificada' : `${ministryPassions.length} pasiones ministeriales identificadas`}
                                </span>
                                <Badge variant="outline" className="ml-auto text-xs bg-amber-100 text-amber-700">Activo</Badge>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-800">Evaluación espiritual pendiente</p>
                        <p className="text-xs text-yellow-700 mt-1">Complete la evaluación para obtener recomendaciones inteligentes</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  setIsProfileDialogOpen(false)
                  setIsAssignDialogOpen(true)
                }}>
                  <Activity className="h-4 w-4 mr-1" />
                  Crear Asignación
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

