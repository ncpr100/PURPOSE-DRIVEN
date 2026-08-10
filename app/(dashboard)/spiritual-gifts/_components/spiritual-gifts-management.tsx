'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Users, BarChart3, Search, Plus, Edit, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

interface SpiritualGift {
  id: string
  name: string
  description?: string
}

interface SpiritualProfileData {
  id: string
  primaryGifts: string[]
  secondaryGifts: string[]
  spiritualCalling?: string
  ministryPassions: string[]
  experienceLevel: number
  volunteerReadinessScore: number
  assessmentDate: string
}

interface Member {
  id: string
  firstName: string
  lastName: string
  email?: string
  spiritualGifts?: string[] // OLD SYSTEM - Keep for backward compatibility
  secondaryGifts?: string[] // OLD SYSTEM - Keep for backward compatibility
  spiritualProfile?: SpiritualProfileData // NEW SYSTEM - Primary source of truth
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

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function SpiritualGiftsManagement() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [profiles, setProfiles] = useState<SpiritualProfile[]>([])
  const [spiritualGifts, setSpiritualGifts] = useState<SpiritualGift[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // ============================================================================
  // FUNCIONES AUXILIARES
  // ============================================================================

  /**
   * Helper function to safely get spiritual gifts array
   * Handles both array and JSON string formats for backward compatibility
   */
  const getSafeGiftsArray = (gifts: string[] | string | undefined | null): string[] => {
    try {
      if (Array.isArray(gifts)) {
        return gifts
      } else if (typeof gifts === 'string') {
        const parsed = JSON.parse(gifts)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (e) {
      console.warn('Error parsing spiritual gifts:', e)
    }
    return []
  }

  /**
   * Get gift name by ID from the spiritual gifts catalog
   */
  const getGiftName = (giftId: string): string => {
    const gift = spiritualGifts.find((g: SpiritualGift) => g.id === giftId)
    return gift?.name || giftId
  }

  // ============================================================================
  // EFFECTS Y FETCH DATA
  // ============================================================================

  useEffect(() => {
    fetchData()
    
    // Add window focus listener for automatic refresh when returning from assessment
    const handleWindowFocus = () => {
      console.log('Window focused - refreshing spiritual gifts data...')
      fetchData()
    }
    
    window.addEventListener('focus', handleWindowFocus)
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus)
    }
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
      console.log('Fetching members from /api/members...')
      const response = await fetch('/api/members?limit=10000')
      if (response.ok) {
        const data = await response.json()
        console.log('Members fetched:', data.members?.length || data.length)
        
        // Use the same data structure as other parts of the app
        const membersArray: Member[] = data.members || data
        console.log('Members with spiritual gifts:', membersArray.filter((m: Member) => getSafeGiftsArray(m.spiritualGifts).length > 0).length)
        console.log('Members with spiritual profiles:', membersArray.filter((m: Member) => m.spiritualProfile).length)
        
        setMembers(membersArray)
      } else {
        console.error('Failed to fetch members:', response.status)
        toast.error('Error al cargar miembros')
      }
    } catch (error) {
      console.error('Network error fetching members:', error)
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
      console.error('Error fetching spiritual gifts:', error)
      toast.error('Error al cargar dones espirituales')
    }
  }

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const openAssessmentDialog = (member: Member) => {
    console.log('Opening spiritual assessment for member:', member.id, member.firstName, member.lastName)
    console.log('Redirecting to:', `/volunteers/spiritual-assessment?memberId=${member.id}&returnTo=/spiritual-gifts`)
    
    // Redirect to dedicated spiritual assessment page with returnTo parameter
    router.push(`/volunteers/spiritual-assessment?memberId=${member.id}&returnTo=/spiritual-gifts`)
  }

  const handleAssessmentSave = (profile: SpiritualProfile) => {
    console.log('handleAssessmentSave called with profile:', profile)
    toast.success('Perfil espiritual guardado exitosamente')
    
    console.log('Triggering fetchData() to refresh metrics...')
    // Refresh data to ensure metrics and profiles are updated
    fetchData().then(() => {
      console.log('fetchData() completed - UI should be refreshed')
    }).catch((error) => {
      console.error('fetchData() failed:', error)
    })
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // ============================================================================
  // FILTROS Y CÁLCULOS
  // ============================================================================

  const filteredMembers = members.filter((member: Member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  const membersWithProfiles = filteredMembers.filter((member: Member) => {
    // NEW SYSTEM - Check spiritual profile relation (primary)
    const hasNewProfile = member.spiritualProfile && 
                         member.spiritualProfile.primaryGifts && 
                         member.spiritualProfile.primaryGifts.length > 0
    
    // OLD SYSTEM - Check legacy fields (fallback)
    const hasOldGifts = getSafeGiftsArray(member.spiritualGifts).length > 0
    
    // Use NEW system if available, fallback to OLD system
    return hasNewProfile || hasOldGifts
  })

  const membersWithoutProfiles = filteredMembers.filter((member: Member) => {
    // NEW SYSTEM - Check spiritual profile relation (primary)
    const hasNewProfile = member.spiritualProfile && 
                         member.spiritualProfile.primaryGifts && 
                         member.spiritualProfile.primaryGifts.length > 0
    
    // OLD SYSTEM - Check legacy fields (fallback)
    const hasOldGifts = getSafeGiftsArray(member.spiritualGifts).length > 0
    
    // Member lacks profile if NEITHER system has data
    return !hasNewProfile && !hasOldGifts
  })

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--info))]"></div>
      </div>
    )
  }

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-[hsl(var(--info))]" />
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 h-4 w-4" />
          <Input
            placeholder="Buscar miembros..."
            value={searchTerm}
            onChange={handleSearchChange}
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
              {members.length > 0 ? (() => {
                const percentage = (membersWithProfiles.length / members.length) * 100;
                return percentage < 1 ? percentage.toFixed(1) : Math.round(percentage);
              })() : 0}%
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

        {/* Tab: All Members */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member: Member) => {
              const hasNewProfile = member.spiritualProfile && 
                                   member.spiritualProfile.primaryGifts && 
                                   member.spiritualProfile.primaryGifts.length > 0
              const hasOldGifts = getSafeGiftsArray(member.spiritualGifts).length > 0
              const hasAnyProfile = hasNewProfile || hasOldGifts

              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {member.firstName} {member.lastName}
                    </CardTitle>
                    <CardDescription>{member.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Display spiritual gifts from NEW system first, fallback to OLD system */}
                    {hasNewProfile && member.spiritualProfile ? (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Dones Primarios (Nuevo Sistema)</p>
                        <div className="flex flex-wrap gap-1">
                          {member.spiritualProfile.primaryGifts.slice(0, 3).map((giftId: string, index: number) => (
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
                    ) : hasOldGifts ? (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Dones Primarios (Sistema Anterior)</p>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const gifts = getSafeGiftsArray(member.spiritualGifts)
                            return gifts.slice(0, 3).map((giftId: string, index: number) => (
                              <Badge key={index} variant="default" className="text-xs">
                                {getGiftName(giftId)}
                              </Badge>
                            ))
                          })()}
                          {(() => {
                            const gifts = getSafeGiftsArray(member.spiritualGifts)
                            return gifts.length > 3 ? (
                              <Badge variant="outline" className="text-xs">
                                +{gifts.length - 3} más
                              </Badge>
                            ) : null
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Brain className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Sin evaluación</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {hasAnyProfile ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            toast.loading('Abriendo evaluación espiritual...')
                            openAssessmentDialog(member)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Ver Perfil
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            toast.loading('Abriendo evaluación espiritual...')
                            openAssessmentDialog(member)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Crear Evaluación
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: With Profile */}
        <TabsContent value="with-profile">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membersWithProfiles.map((member: Member) => {
              const hasNewProfile = member.spiritualProfile && 
                                   member.spiritualProfile.primaryGifts && 
                                   member.spiritualProfile.primaryGifts.length > 0

              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow border-[hsl(var(--success)/0.3)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {member.firstName} {member.lastName}
                      <Badge variant="default" className="bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]">
                        Completado
                      </Badge>
                    </CardTitle>
                    <CardDescription>{member.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Dones Espirituales</p>
                      <div className="flex flex-wrap gap-1">
                        {hasNewProfile && member.spiritualProfile ? (
                          member.spiritualProfile.primaryGifts.map((giftId: string, index: number) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {getGiftName(giftId)}
                            </Badge>
                          ))
                        ) : (
                          getSafeGiftsArray(member.spiritualGifts).map((giftId: string, index: number) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {getGiftName(giftId)}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {member.spiritualProfile?.assessmentDate && (
                      <p className="text-xs text-muted-foreground">
                        Evaluado: {new Date(member.spiritualProfile.assessmentDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        toast.loading('Abriendo evaluación espiritual...')
                        openAssessmentDialog(member)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Ver Perfil
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Without Profile */}
        <TabsContent value="without-profile">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membersWithoutProfiles.map((member: Member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow border-[hsl(var(--warning)/0.3)]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {member.firstName} {member.lastName}
                    <Badge variant="outline" className="bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]">
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
                    onClick={() => {
                      toast.loading('Abriendo evaluación espiritual...')
                      openAssessmentDialog(member)
                    }}
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