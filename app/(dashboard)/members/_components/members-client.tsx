'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EnhancedMemberForm } from '@/components/members/enhanced-member-form'
import { MemberImportDialog } from '@/components/members/member-import-dialog'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  Download,
  Upload,
  Filter,
  Mail,
  Calendar,
  Gift,
  UserCheck,
  UserX,
  UserCircle,
  Clock,
  Heart,
  ChevronDown,
  FileText,
  Send,
  CheckCircle2,
  Star,
  MapPin,
  TrendingUp,
  UserPlus,
  Crown,
  PlayCircle,
  Target
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { MemberInfoBadges } from './member-info-badges'
import type { MaritalStatusFilter } from '@/types/member-filters'

interface MembersClientProps {
  userRole: string
  churchId: string
}

export function MembersClient({ userRole, churchId }: MembersClientProps) {
  const [members, setMembers] = useState<any[]>([])
  const [filteredMembers, setFilteredMembers] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [qualificationSettings, setQualificationSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [ageFilter, setAgeFilter] = useState('all')
  const [maritalStatusFilter, setMaritalStatusFilter] = useState<MaritalStatusFilter>('all')
  
  // Smart Lists & Bulk Actions State
  const [activeSmartList, setActiveSmartList] = useState('all')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Volunteer Integration State
  const [isVolunteerRecruitOpen, setIsVolunteerRecruitOpen] = useState(false)
  const [selectedMemberForVolunteer, setSelectedMemberForVolunteer] = useState<any | null>(null)
  const [volunteerRecommendations, setVolunteerRecommendations] = useState<any[]>([])
  const [showLeadershipTrack, setShowLeadershipTrack] = useState(false)

  useEffect(() => {
    fetchMembers()
    fetchVolunteers()
    fetchQualificationSettings()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [members, searchTerm, genderFilter, ageFilter, maritalStatusFilter, activeSmartList])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/volunteers')
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data)
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error)
    }
  }

  const fetchQualificationSettings = async () => {
    try {
      const response = await fetch('/api/qualification-settings')
      if (response.ok) {
        const data = await response.json()
        setQualificationSettings(data)
      }
    } catch (error) {
      console.error('Error fetching qualification settings:', error)
      // Use default settings if API fails
      setQualificationSettings({
        leadershipMinMembershipDays: 365,
        volunteerMinMembershipDays: 0,
        leadershipMinSpiritualScore: 70,
        volunteerMinSpiritualScore: 0
      })
    }
  }

  // Helper function to check if member is already a volunteer
  const getMemberVolunteerStatus = (memberId: string) => {
    return volunteers.find(v => v.memberId === memberId)
  }

  // Handle volunteer recruitment for a member
  const handleVolunteerRecruitment = async (member: any) => {
    console.log('🎯 [DEBUG] handleVolunteerRecruitment called with member:', member)
    setSelectedMemberForVolunteer(member)
    console.log('🎯 [DEBUG] selectedMemberForVolunteer set to:', member)
    
    // Fetch volunteer recommendations for this member
    try {
      const response = await fetch(`/api/volunteer-matching?memberId=${member.id}`)
      if (response.ok) {
        const data = await response.json()
        setVolunteerRecommendations(data.recommendations || [])
        console.log('🎯 [DEBUG] Volunteer recommendations:', data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching volunteer recommendations:', error)
    }
    
    setIsVolunteerRecruitOpen(true)
    console.log('🎯 [DEBUG] Volunteer recruitment dialog opened')
  }

  // Handle creating volunteer from member
  const handleCreateVolunteerFromMember = async (ministryId: string) => {
    console.log('🔥 [DEBUG] handleCreateVolunteerFromMember called with ministryId:', ministryId)
    console.log('🔥 [DEBUG] selectedMemberForVolunteer:', selectedMemberForVolunteer)
    
    if (!selectedMemberForVolunteer) {
      console.log('❌ [DEBUG] No selected member for volunteer!')
      return
    }

    try {
      const volunteerData = {
        memberId: selectedMemberForVolunteer.id,
        firstName: selectedMemberForVolunteer.firstName?.trim() || '',
        lastName: selectedMemberForVolunteer.lastName?.trim() || '',
        email: selectedMemberForVolunteer.email?.trim() || '',
        phone: selectedMemberForVolunteer.phone?.trim() || '',
        skills: [],
        availability: {
          days: [],
          times: [],
          frequency: 'weekly' as const
        },
        ministryId: ministryId === 'no-ministry' ? 'no-ministry' : ministryId,
      }

      // Fix email format if it has issues
      if (volunteerData.email && volunteerData.email.includes('.@')) {
        volunteerData.email = volunteerData.email.replace('.@', '@')
        console.log('🔧 [DEBUG] Fixed email format:', volunteerData.email)
      }

      console.log('🚀 [DEBUG] Creating volunteer with data:', volunteerData)
      console.log('🚀 [DEBUG] Raw member data for comparison:', {
        id: selectedMemberForVolunteer.id,
        firstName: selectedMemberForVolunteer.firstName,
        lastName: selectedMemberForVolunteer.lastName,
        email: selectedMemberForVolunteer.email,
        phone: selectedMemberForVolunteer.phone
      })

      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerData),
      })

      console.log('📡 [DEBUG] API response status:', response.status)
      console.log('📡 [DEBUG] API response ok:', response.ok)

      if (response.ok) {
        console.log('✅ [DEBUG] Volunteer created successfully!')
        fetchVolunteers()
        setIsVolunteerRecruitOpen(false)
        setSelectedMemberForVolunteer(null)
        toast.success('¡Miembro reclutado como voluntario exitosamente!')
      } else {
        const errorData = await response.json()
        console.error('❌ [DEBUG] Error response:', errorData)
        console.error('❌ [DEBUG] Validation errors:', errorData.errors)
        toast.error(errorData.message || 'Error al reclutar voluntario')
      }
    } catch (error) {
      console.error('💥 [DEBUG] Exception in handleCreateVolunteerFromMember:', error)
      toast.error('Error al reclutar voluntario')
    }
  }

  const filterMembers = () => {
    console.log('🔍 filterMembers called')
    console.log('📊 Total members:', members.length)
    console.log('🎯 Active filters:', { 
      searchTerm, 
      genderFilter, 
      ageFilter, 
      maritalStatusFilter, 
      activeSmartList 
    })
    
    let filtered = members

    // Apply Smart List Filters First
    switch (activeSmartList) {
      case 'new-members':
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        filtered = filtered.filter(member => 
          new Date(member.membershipDate || member.createdAt) >= thirtyDaysAgo
        )
        break
        
      case 'inactive-members':
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        filtered = filtered.filter(member => 
          !member.isActive || new Date(member.updatedAt) <= sixMonthsAgo
        )
        break
        
      case 'birthdays':
        const today = new Date()
        const currentMonth = today.getMonth()
        filtered = filtered.filter(member => 
          member.birthDate && new Date(member.birthDate).getMonth() === currentMonth
        )
        break
        
      case 'anniversaries':
        const currentMonth2 = new Date().getMonth()
        filtered = filtered.filter(member => 
          member.membershipDate && new Date(member.membershipDate).getMonth() === currentMonth2
        )
        break
        
      case 'ministry-leaders':
        filtered = filtered.filter(member => 
          member.ministryId || (member.spiritualGifts && Array.isArray(member.spiritualGifts) && member.spiritualGifts.length > 0)
        )
        break
        
      case 'visitors-becoming-members':
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
        filtered = filtered.filter(member => 
          member.membershipDate && new Date(member.membershipDate) >= ninetyDaysAgo && !member.baptismDate
        )
        break
        
      case 'prayer-needed':
        filtered = filtered.filter(member => 
          member.notes && member.notes.toLowerCase().includes('oración')
        )
        break
        
      case 'volunteer-candidates':
        // Show members who are eligible to be volunteers using custom criteria
        const volunteerMinDays = qualificationSettings?.volunteerMinMembershipDays || 0
        const volunteerMinSpiritualScore = qualificationSettings?.volunteerMinSpiritualScore || 0
        const requireActiveStatus = qualificationSettings?.volunteerRequireActiveStatus || true
        const requireSpiritualAssessment = qualificationSettings?.volunteerRequireSpiritualAssessment || false
        
        filtered = filtered.filter(member => {
          // Must not already be a volunteer
          if (getMemberVolunteerStatus(member.id)) return false
          
          // Check active status if required
          if (requireActiveStatus && !member.isActive) return false
          
          // Check membership duration
          if (member.membershipDate) {
            const membershipDuration = Date.now() - new Date(member.membershipDate).getTime()
            const daysSinceMembership = membershipDuration / (24 * 60 * 60 * 1000)
            if (daysSinceMembership < volunteerMinDays) return false
          }
          
          // Additional checks would include spiritual assessment requirements
          // TODO: Check for completed spiritual assessment if required
          
          return true
        })
        break
        
      case 'active-volunteers':
        // Show members who ARE volunteers
        filtered = filtered.filter(member => getMemberVolunteerStatus(member.id))
        break
        
      case 'leadership-ready':
        // Show members ready for leadership using custom criteria
        const leadershipMinDays = qualificationSettings?.leadershipMinMembershipDays || 365
        const leadershipMinSpiritualScore = qualificationSettings?.leadershipMinSpiritualScore || 70
        const requireVolunteerExp = qualificationSettings?.leadershipRequireVolunteerExp || false
        const requireTraining = qualificationSettings?.leadershipRequireTraining || false
        
        filtered = filtered.filter(member => {
          // Basic criteria
          if (!member.isActive || !member.membershipDate) return false
          
          // Check membership duration
          const membershipDuration = Date.now() - new Date(member.membershipDate).getTime()
          const daysSinceMembership = membershipDuration / (24 * 60 * 60 * 1000)
          if (daysSinceMembership < leadershipMinDays) return false
          
          // Check volunteer experience if required
          if (requireVolunteerExp && !getMemberVolunteerStatus(member.id)) return false
          
          // Additional checks would include spiritual assessment scores
          // TODO: Integrate with member spiritual profiles for scoring
          
          return true
        })
        break
        
      case 'all':
      default:
        // No additional filtering
        break
    }

    // Apply Search Filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.includes(searchTerm)
      )
    }

    // Apply Gender Filter (case-insensitive)
    if (genderFilter !== 'all') {
      filtered = filtered.filter(member => member.gender?.toLowerCase() === genderFilter.toLowerCase())
    }

    // Apply Age Filter
    if (ageFilter !== 'all') {
      filtered = filtered.filter(member => {
        if (!member.birthDate) return false
        const age = new Date().getFullYear() - new Date(member.birthDate).getFullYear()
        switch (ageFilter) {
          case '0-17': return age >= 0 && age <= 17
          case '18-25': return age >= 18 && age <= 25
          case '26-35': return age >= 26 && age <= 35
          case '36-50': return age >= 36 && age <= 50
          case '51+': return age >= 51
          default: return true
        }
      })
    }

    // Apply Marital Status Filter (case-insensitive to handle mixed case data) + Family Filter
    if (maritalStatusFilter !== 'all') {
      if (maritalStatusFilter === 'family-group') {
        // Show only members whose last name appears multiple times (families)
        const lastNameCounts = filtered.reduce((acc, member) => {
          acc[member.lastName] = (acc[member.lastName] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        filtered = filtered.filter(member => lastNameCounts[member.lastName] > 1)
      } else {
        // Regular marital status filter
        filtered = filtered.filter(member => member.maritalStatus?.toLowerCase() === maritalStatusFilter.toLowerCase())
      }
    }

    console.log('✅ Filtered result:', filtered.length, 'members')
    setFilteredMembers(filtered)
  }

  const handleSaveMember = async (memberData: any) => {
    try {
      const url = editingMember ? `/api/members/${editingMember.id}` : '/api/members'
      const method = editingMember ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        const savedMember = await response.json()
        
        // CRITICAL: Update editingMember with saved data BEFORE fetchMembers
        // This ensures the form gets the new member.id immediately
        if (!editingMember) {
          // Creating new member - update with full saved member data (including ID)
          console.log('[CREATE] New member saved with ID:', savedMember.id)
          setEditingMember(savedMember)
        } else {
          // Editing existing member - update with latest data
          console.log('[UPDATE] Member updated:', savedMember.id)
          setEditingMember(savedMember)
        }
        
        // Refresh member list in background
        await fetchMembers()
        
        // Dialog stays open - user must click "Guardar y Cerrar" to close
      } else {
        const error = await response.json()
        alert(error.message || 'Error al guardar el miembro')
      }
    } catch (error) {
      console.error('Error saving member:', error)
      alert('Error al guardar el miembro')
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
      return
    }

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMembers()
      } else {
        alert('Error al eliminar el miembro')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Error al eliminar el miembro')
    }
  }

  const handleEdit = (member: any) => {
    setEditingMember(member)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingMember(null)
    setIsFormOpen(true)
  }

  // Bulk Actions Handlers
  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId])
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map(member => member.id))
    } else {
      setSelectedMembers([])
    }
  }

  const handleBulkEmail = () => {
    const selectedMemberEmails = members
      .filter(member => selectedMembers.includes(member.id) && member.email)
      .map(member => member.email)
      .join(',')
    
    if (selectedMemberEmails) {
      window.location.href = `mailto:${selectedMemberEmails}`
    }
  }

  const handleBulkExport = () => {
    const selectedMemberData = members
      .filter(member => selectedMembers.includes(member.id))
      .map(member => ({
        Nombre: `${member.firstName} ${member.lastName}`,
        Email: member.email || '',
        Teléfono: member.phone || '',
        Género: member.gender || '',
        Estado: member.isActive ? 'Activo' : 'Inactivo',
        'Fecha Membresía': member.membershipDate ? formatDate(member.membershipDate) : '',
        'Fecha Bautismo': member.baptismDate ? formatDate(member.baptismDate) : ''
      }))

    // Helper function to escape CSV values (handles commas, quotes, newlines)
    const escapeCSVValue = (value: any): string => {
      const stringValue = String(value)
      // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    // Build CSV with proper escaping and UTF-8 BOM for Excel compatibility
    const headers = Object.keys(selectedMemberData[0]).map(escapeCSVValue).join(',')
    const rows = selectedMemberData.map(row => 
      Object.values(row).map(escapeCSVValue).join(',')
    )
    
    // Add UTF-8 BOM (\uFEFF) for proper Spanish character display in Excel
    const csv = '\uFEFF' + [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `miembros_${activeSmartList}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleBulkStatusUpdate = async (status: boolean) => {
    try {
      const updatePromises = selectedMembers.map(memberId => 
        fetch(`/api/members/${memberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: status })
        })
      )

      await Promise.all(updatePromises)
      await fetchMembers()
      setSelectedMembers([])
    } catch (error) {
      console.error('Error updating members:', error)
    }
  }

  const clearSelection = () => {
    setSelectedMembers([])
    setShowBulkActions(false)
  }

  // Smart List Definitions
  const smartLists = [
    { id: 'all', name: 'Todos los Miembros', icon: Users, count: members.length },
    { id: 'new-members', name: 'Nuevos Miembros (30d)', icon: UserCheck, count: 0 },
    { id: 'inactive-members', name: 'Miembros Inactivos', icon: UserX, count: 0 },
    { id: 'volunteer-candidates', name: 'Candidatos Voluntarios', icon: UserPlus, count: members.filter(m => !getMemberVolunteerStatus(m.id)).length },
    { id: 'active-volunteers', name: 'Son Voluntarios', icon: Target, count: volunteers.filter(v => v.memberId).length },
    { id: 'leadership-ready', name: 'Listos para Liderazgo', icon: Crown, count: 0 },
    { id: 'birthdays', name: 'Cumpleaños este Mes', icon: Calendar, count: 0 },
    { id: 'anniversaries', name: 'Aniversarios de Membresía', icon: Gift, count: 0 },
    { id: 'ministry-leaders', name: 'Líderes de Ministerio', icon: Star, count: 0 },
    { id: 'visitors-becoming-members', name: 'Visitantes → Miembros', icon: TrendingUp, count: 0 },
    { id: 'prayer-needed', name: 'Necesitan Oración', icon: Heart, count: 0 }
  ]

  // Calculate Smart List Counts
  useEffect(() => {
    // This would normally be calculated in the filtering logic or backend
    // For now, we'll keep it simple
  }, [members])

  const canEdit = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(userRole)
  const canDelete = ['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(userRole)

  if (isFormOpen) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserCircle className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">
                Información de Miembros
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete la información del miembro con evaluación espiritual y disponibilidad
            </p>
          </div>
        </div>
        <EnhancedMemberForm
          member={editingMember}
          onSave={handleSaveMember}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingMember(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Miembros CRM</h1>
          <p className="text-muted-foreground">
            Sistema avanzado de gestión pastoral con listas inteligentes
          </p>
        </div>
        <div className="flex gap-2">
          {selectedMembers.length > 0 && (
            <Button variant="outline" onClick={clearSelection}>
              Limpiar ({selectedMembers.length})
            </Button>
          )}
          {canEdit && (
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar Miembros
            </Button>
          )}
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Miembro
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedMembers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedMembers.length} miembro{selectedMembers.length > 1 ? 's' : ''} seleccionado{selectedMembers.length > 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Estado
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate(true)}>
                      Activar Miembros
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate(false)}>
                      Desactivar Miembros
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Lists & Content */}
      <Tabs value={activeSmartList} onValueChange={setActiveSmartList} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-muted/50">
            {smartLists.map((list) => {
              const IconComponent = list.icon
              return (
                <TabsTrigger key={list.id} value={list.id} className="text-xs">
                  <IconComponent className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{list.name}</span>
                  <span className="sm:hidden">{list.name.split(' ')[0]}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-48">
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los géneros</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Edad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las edades</SelectItem>
                    <SelectItem value="0-17">0-17 años</SelectItem>
                    <SelectItem value="18-25">18-25 años</SelectItem>
                    <SelectItem value="26-35">26-35 años</SelectItem>
                    <SelectItem value="36-50">36-50 años</SelectItem>
                    <SelectItem value="51+">51+ años</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select 
                  value={maritalStatusFilter} 
                  onValueChange={(value) => setMaritalStatusFilter(value as MaritalStatusFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los Miembros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="soltero">Soltero/a</SelectItem>
                    <SelectItem value="casado">Casado/a</SelectItem>
                    <SelectItem value="divorciado">Divorciado/a</SelectItem>
                    <SelectItem value="viudo">Viudo/a</SelectItem>
                    <SelectItem value="family-group">Familias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredMembers.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {activeSmartList !== 'all' ? 'En Lista' : 'Total Miembros'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  M
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredMembers.filter(m => m.gender?.toLowerCase() === 'masculino').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Hombres</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  F
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredMembers.filter(m => m.gender?.toLowerCase() === 'femenino').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Mujeres</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {selectedMembers.length}
                </div>
                <div>
                  <p className="text-2xl font-bold">{selectedMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Seleccionados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Members Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {smartLists.find(l => l.id === activeSmartList)?.name || 'Lista de Miembros'} ({filteredMembers.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleSelectAll(selectedMembers.length !== filteredMembers.length)}>
                  {selectedMembers.length === filteredMembers.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Cargando miembros...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay miembros en esta lista</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {activeSmartList !== 'all' ? 'Prueba con otra lista inteligente' : 'Agrega tu primer miembro'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Información</TableHead>
                      <TableHead>Fechas</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedMembers.includes(member.id)}
                            onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {member.firstName} {member.lastName}
                            </p>
                            {member.occupation && (
                              <p className="text-sm text-muted-foreground">
                                {member.occupation}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {member.email && (
                              <p className="text-sm">{member.email}</p>
                            )}
                            {member.phone && (
                              <p className="text-sm text-muted-foreground">{member.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <MemberInfoBadges
                            member={{
                              gender: member.gender,
                              maritalStatus: member.maritalStatus,
                              ministryId: member.ministryId
                            }}
                            activeMaritalStatusFilter={maritalStatusFilter}
                            isVolunteer={!!getMemberVolunteerStatus(member.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {member.membershipDate && (
                              <p>Membresía: {formatDate(member.membershipDate)}</p>
                            )}
                            {member.baptismDate && (
                              <p className="text-muted-foreground">
                                Bautismo: {formatDate(member.baptismDate)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.isActive ? "default" : "secondary"}>
                            {member.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Volunteer Actions */}
                            {!getMemberVolunteerStatus(member.id) && canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVolunteerRecruitment(member)}
                                title="Reclutar como Voluntario"
                              >
                                <UserPlus className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {getMemberVolunteerStatus(member.id) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open('/volunteers', '_blank')}
                                title="Ver Perfil de Voluntario"
                              >
                                <Target className="h-4 w-4 text-blue-600" />
                              </Button>
                            )}
                            {/* Leadership Development Action */}
                            {member.isActive && member.membershipDate && canEdit &&
                             new Date(member.membershipDate) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.info('Función de desarrollo de liderazgo próximamente')}
                                title="Considerar para Liderazgo"
                              >
                                <Crown className="h-4 w-4 text-yellow-600" />
                              </Button>
                            )}
                            {/* Existing Actions */}
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(member)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Import Dialog */}
      <MemberImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImportComplete={fetchMembers}
      />

      {/* Volunteer Recruitment Dialog */}
      <Dialog open={isVolunteerRecruitOpen} onOpenChange={setIsVolunteerRecruitOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              Reclutar Voluntario
            </DialogTitle>
            <DialogDescription>
              Convierte a {selectedMemberForVolunteer?.firstName} {selectedMemberForVolunteer?.lastName} en voluntario
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Member Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Información del Miembro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Nombre:</Label>
                    <p>{selectedMemberForVolunteer?.firstName} {selectedMemberForVolunteer?.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email:</Label>
                    <p>{selectedMemberForVolunteer?.email || 'No disponible'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Teléfono:</Label>
                    <p>{selectedMemberForVolunteer?.phone || 'No disponible'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Membresía:</Label>
                    <p>{selectedMemberForVolunteer?.membershipDate ? formatDate(selectedMemberForVolunteer.membershipDate) : 'No disponible'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            {volunteerRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recomendaciones de IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {volunteerRecommendations.slice(0, 3).map((rec: any, index: number) => (
                    <div key={index} className="p-2 border rounded flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{rec.ministryName || 'Ministerio General'}</p>
                        <p className="text-xs text-muted-foreground">Compatibilidad: {rec.matchScore}%</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleCreateVolunteerFromMember(rec.ministryId)}
                      >
                        Reclutar
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="default"
                onClick={() => {
                  console.log('🔘 [DEBUG] Volunteer button clicked!')
                  console.log('🔘 [DEBUG] Selected member:', selectedMemberForVolunteer)
                  handleCreateVolunteerFromMember('no-ministry')
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Reclutar como Voluntario General
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsVolunteerRecruitOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
