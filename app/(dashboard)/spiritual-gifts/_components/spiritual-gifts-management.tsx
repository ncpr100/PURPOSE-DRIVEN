
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Users, BarChart3, Search, Plus, Eye, Edit, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Member {
  id: string
  firstName: string
  lastName: string
  email?: string
  spiritualGifts?: string[] // OLD SYSTEM - Keep for backward compatibility
  secondaryGifts?: string[] // OLD SYSTEM - Keep for backward compatibility
  spiritualProfile?: {       // NEW SYSTEM - Primary source of truth
    id: string
    primaryGifts: any[]
    secondaryGifts: any[]
    spiritualCalling?: string
    ministryPassions: any[]
    experienceLevel: number
    volunteerReadinessScore: number
    assessmentDate: string
  }
}

interface SpiritualProfile {
  id: string
  member: Member
  primaryGifts: string[]
  secondaryGifts: string[]
  spiritualCalling?: string
  ministryPassions?: string[]
  experienceLevel: number
  leadershipScore: number
  assessmentDate: string
}

export default function SpiritualGiftsManagement() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [profiles, setProfiles] = useState<SpiritualProfile[]>([])
  const [spiritualGifts, setSpiritualGifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchMembers(),
        fetchSpiritualGifts()
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      console.log('🔄 Fetching members from /api/members...')
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Members fetched:', data.length, 'members')
        console.log('🔍 Members with spiritual gifts:', data.filter((m: any) => m.spiritualGifts && m.spiritualGifts.length > 0).length)
        setMembers(data)
      } else {
        console.error('❌ Failed to fetch members:', response.status)
        toast.error('Error al cargar miembros')
      }
    } catch (error) {
      console.error('❌ Network error fetching members:', error)
      toast.error('Error al cargar miembros')
    }
  }

  const fetchSpiritualGifts = async () => {
    try {
      const response = await fetch('/api/spiritual-gifts')
      if (response.ok) {
        const data = await response.json()
        setSpiritualGifts(data.gifts || [])
      } else {
        toast.error('Error al cargar dones espirituales')
      }
    } catch (error) {
      toast.error('Error al cargar dones espirituales')
    }
  }

  const openAssessmentDialog = (member: Member) => {
    // Redirect to dedicated spiritual assessment page with returnTo parameter
    router.push(`/volunteers/spiritual-assessment?memberId=${member.id}&returnTo=/spiritual-gifts`)
  }

  const handleAssessmentSave = (profile: any) => {
    console.log('🔄 handleAssessmentSave called with profile:', profile)
    toast.success('Perfil espiritual guardado exitosamente')
    
    console.log('🔄 Triggering fetchData() to refresh metrics...')
    // Refresh data to ensure metrics and profiles are updated
    fetchData().then(() => {
      console.log('✅ fetchData() completed - UI should be refreshed')
    }).catch((error) => {
      console.error('❌ fetchData() failed:', error)
    })
    
    // If the response indicates metrics should be refreshed, trigger any necessary cache updates
    if (profile.refreshMetrics) {
      console.log('🔄 Profile has refreshMetrics flag, refreshing metrics...')
      // Additional metrics refresh logic could go here
    }
  }

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const membersWithProfiles = filteredMembers.filter(member => {
    // 🆕 NEW SYSTEM - Check spiritual profile relation (primary)
    const hasNewProfile = member.spiritualProfile && 
                         member.spiritualProfile.primaryGifts && 
                         member.spiritualProfile.primaryGifts.length > 0
    
    // 🔄 OLD SYSTEM - Check legacy fields (fallback)
    const hasOldGifts = member.spiritualGifts && member.spiritualGifts.length > 0
    
    // Debug logging for specific members
    if (member.firstName === 'Pedro' || member.firstName === 'Juan') {
      console.log(`🔍 ${member.firstName} ${member.lastName} spiritual gifts check:`, {
        newProfile: !!member.spiritualProfile,
        newPrimaryGifts: member.spiritualProfile?.primaryGifts?.length || 0,
        oldGifts: member.spiritualGifts?.length || 0,
        hasNewProfile,
        hasOldGifts
      })
    }
    
    // Use NEW system if available, fallback to OLD system
    return hasNewProfile || hasOldGifts
  })

  const membersWithoutProfiles = filteredMembers.filter(member => {
    // 🆕 NEW SYSTEM - Check spiritual profile relation (primary)
    const hasNewProfile = member.spiritualProfile && 
                         member.spiritualProfile.primaryGifts && 
                         member.spiritualProfile.primaryGifts.length > 0
    
    // 🔄 OLD SYSTEM - Check legacy fields (fallback)
    const hasOldGifts = member.spiritualGifts && member.spiritualGifts.length > 0
    
    // Member lacks profile if NEITHER system has data
    return !hasNewProfile && !hasOldGifts
  })

  const getGiftName = (giftId: string) => {
    const gift = spiritualGifts.find(g => g.id === giftId)
    return gift?.name || giftId
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Gestión de Dones Espirituales
          </h1>
          <p className="text-muted-foreground mt-2">
            Administre evaluaciones y perfiles de dones espirituales
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar miembros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Perfil Espiritual</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersWithProfiles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Evaluación</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersWithoutProfiles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Completado</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.length > 0 ? Math.round((membersWithProfiles.length / members.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos los Miembros ({filteredMembers.length})</TabsTrigger>
          <TabsTrigger value="with-profile">Con Perfil ({membersWithProfiles.length})</TabsTrigger>
          <TabsTrigger value="without-profile">Sin Evaluación ({membersWithoutProfiles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {member.firstName} {member.lastName}
                  </CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Display spiritual gifts from NEW system first, fallback to OLD system */}
                  {member.spiritualProfile && member.spiritualProfile.primaryGifts && member.spiritualProfile.primaryGifts.length > 0 ? (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Dones Primarios (Nuevo Sistema)</p>
                      <div className="flex flex-wrap gap-1">
                        {member.spiritualProfile.primaryGifts.slice(0, 3).map((giftId, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {getGiftName(giftId)}
                          </Badge>
                        ))}
                        {member.spiritualProfile.primaryGifts.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.spiritualProfile.primaryGifts.length - 3} más
                          </Badge>
                        )}
                      </div>
                      {member.spiritualProfile.spiritualCalling && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Llamado: {member.spiritualProfile.spiritualCalling.substring(0, 50)}...
                        </p>
                      )}
                    </div>
                  ) : member.spiritualGifts && member.spiritualGifts.length > 0 ? (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Dones Primarios (Sistema Anterior)</p>
                      <div className="flex flex-wrap gap-1">
                        {member.spiritualGifts.slice(0, 3).map((giftId, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {getGiftName(giftId)}
                          </Badge>
                        ))}
                        {member.spiritualGifts.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.spiritualGifts.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Brain className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Sin evaluación</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {/* Check if member has profile in EITHER system */}
                    {(member.spiritualProfile && member.spiritualProfile.primaryGifts && member.spiritualProfile.primaryGifts.length > 0) || 
                     (member.spiritualGifts && member.spiritualGifts.length > 0) ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openAssessmentDialog(member)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openAssessmentDialog(member)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Crear Evaluación
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="with-profile">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membersWithProfiles.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {member.firstName} {member.lastName}
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Completado
                    </Badge>
                  </CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Dones Espirituales</p>
                    <div className="flex flex-wrap gap-1">
                      {/* Display gifts from NEW system first, fallback to OLD system */}
                      {member.spiritualProfile && member.spiritualProfile.primaryGifts && member.spiritualProfile.primaryGifts.length > 0 ? (
                        member.spiritualProfile.primaryGifts.map((giftId, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {getGiftName(giftId)}
                          </Badge>
                        ))
                      ) : (
                        member.spiritualGifts?.map((giftId, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {getGiftName(giftId)}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Show assessment date if available from NEW system */}
                  {member.spiritualProfile?.assessmentDate && (
                    <p className="text-xs text-muted-foreground">
                      Evaluado: {new Date(member.spiritualProfile.assessmentDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => openAssessmentDialog(member)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="without-profile">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membersWithoutProfiles.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {member.firstName} {member.lastName}
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      Pendiente
                    </Badge>
                  </CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 mb-4">
                    <Brain className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No ha completado la evaluación de dones espirituales
                    </p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => openAssessmentDialog(member)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Crear Evaluación
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
