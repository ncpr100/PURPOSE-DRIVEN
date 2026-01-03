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
import { isValidCUID, analyzeCUID, CUID_PATTERN } from '@/lib/validations/cuid'
import type { MaritalStatusFilter } from '@/types/member-filters'

interface MembersClientProps {
  userRole: string
  churchId: string
}

export function MembersClient({ userRole, churchId }: MembersClientProps) {
  // DIAGNOSTIC: Log component mount
  useEffect(() => {
    console.log('🎯 MEMBERS CLIENT COMPONENT MOUNTED!', {
      userRole,
      churchId,
      timestamp: new Date().toISOString()
    })
    return () => {
      console.log('❌ MEMBERS CLIENT COMPONENT UNMOUNTED')
    }
  }, [])
  
  const [members, setMembers] = useState<any[]>([])
  const [filteredMembers, setFilteredMembers] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [qualificationSettings, setQualificationSettings] = useState<any>(null)
  const [totalMemberCount, setTotalMemberCount] = useState(0) // Track total count from API
  const [filterCounts, setFilterCounts] = useState<any>(null) // Track filtered counts
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
    console.log('🚀 MembersClient component mounted')
    console.log('🚀 Initial state - isLoading:', isLoading, 'members.length:', members.length)
    fetchMembers()
    fetchFilterCounts()
    fetchVolunteers()
    fetchQualificationSettings()
  }, [])

  // Re-fetch data when filters change (server-side filtering)
  useEffect(() => {
    console.log('🔄 Filters changed, re-fetching data from server')
    setIsLoading(true)
    Promise.all([
      fetchMembers(),
      fetchFilterCounts()
    ]).finally(() => {
      setIsLoading(false)
    })
  }, [searchTerm, genderFilter, ageFilter, maritalStatusFilter, activeSmartList])

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log('📊 State update - members:', members.length, 'filteredMembers:', filteredMembers.length)
  }, [members, filteredMembers])

  const fetchMembers = async () => {
    try {
      console.log('🔍 Starting fetchMembers...')
      console.log('🔍 About to call /api/members with credentials and filters')
      
      // Build URL with current filter parameters for server-side filtering
      const params = new URLSearchParams()
      if (searchTerm) params.set('q', searchTerm)
      if (genderFilter !== 'all') params.set('gender', genderFilter)
      if (ageFilter !== 'all') params.set('ageFilter', ageFilter)
      if (maritalStatusFilter !== 'all') params.set('maritalStatus', maritalStatusFilter)
      if (activeSmartList !== 'all') params.set('smartList', activeSmartList)
      params.set('limit', '2000') // Get all members for now
      
      const url = `/api/members?${params.toString()}`
      console.log('🔍 Fetching URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('📡 Members API response status:', response.status)
      console.log('📡 Members API response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Members API response data structure:', {
          hasMembers: !!data.members,
          membersLength: data.members?.length,
          hasPagination: !!data.pagination,
          totalFromPagination: data.pagination?.total,
          dataKeys: Object.keys(data)
        })
        console.log('📊 First member sample:', data.members?.[0])
        console.log('📊 Raw data:', data)
        
        // API returns { members: [...], pagination: {...} }
        const membersArray = data.members || data
        const totalCount = data.pagination?.total || membersArray.length
        console.log('🎯 Setting members state with:', membersArray.length, 'members')
        console.log('📊 Total count from API:', totalCount)
        setMembers(membersArray)
        setTotalMemberCount(totalCount) // Store total count for display
        
        // Since server-side filtering is now active, set filtered members to the same data
        setFilteredMembers(membersArray)
        console.log('✅ Members state updated successfully')
      } else {
        console.error('❌ Members API failed with status:', response.status)
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        
        if (response.status === 401) {
          console.error('🚨 AUTHENTICATION ERROR: Session may have expired')
        }
      }
    } catch (error) {
      console.error('💥 Error in fetchMembers:', error.message)
      console.error('💥 Full error:', error)
    } finally {
      console.log('🏁 Setting isLoading to false')
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
      console.log('🔍 [DEBUG] Fetching recommendations for memberId:', member.id)
      const response = await fetch(`/api/volunteer-matching?memberId=${member.id}`)
      console.log('🔍 [DEBUG] Recommendations API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('🔍 [DEBUG] Recommendations API response data:', data)
        setVolunteerRecommendations(data.recommendations || [])
        console.log('🎯 [DEBUG] Volunteer recommendations set:', data.recommendations)
        console.log('🎯 [DEBUG] Recommendations length:', (data.recommendations || []).length)
      } else {
        console.error('❌ [DEBUG] Recommendations API failed with status:', response.status)
        const errorText = await response.text()
        console.error('❌ [DEBUG] Error response:', errorText)
      }
    } catch (error) {
      console.error('❌ [DEBUG] Error fetching volunteer recommendations:', error)
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

      // Remove phone if empty to avoid validation issues
      if (!volunteerData.phone || volunteerData.phone === '') {
        delete (volunteerData as any).phone
      }

      // Remove email if empty to avoid validation issues  
      if (!volunteerData.email || volunteerData.email === '') {
        delete (volunteerData as any).email
      }

      // Check if memberId is valid using standardized CUID validation
      const cuidAnalysis = analyzeCUID(volunteerData.memberId || '')
      console.log('🔍 [DEBUG] CUID validation using standardized utility:')
      console.log('🔍 [DEBUG] memberId:', volunteerData.memberId)
      console.log('🔍 [DEBUG] CUID analysis:', cuidAnalysis)
      console.log('🔍 [DEBUG] isValidCUID result:', isValidCUID(volunteerData.memberId || ''))
      console.log('🔍 [DEBUG] Supports: Legacy (23 chars) + Current (25 chars) CUIDs')
      
      // The member ID should now pass validation for both legacy and current formats

      // Fix email format if it has issues
      if (volunteerData.email && volunteerData.email.includes('.@')) {
        volunteerData.email = volunteerData.email.replace('.@', '@')
        console.log('🔧 [DEBUG] Fixed email format:', volunteerData.email)
      }

      // Test validation locally before sending to API
      console.log('🔍 [DEBUG] Testing field validations:')
      console.log('🔍 [DEBUG] firstName regex test:', /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(volunteerData.firstName))
      console.log('🔍 [DEBUG] lastName regex test:', /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(volunteerData.lastName))
      console.log('🔍 [DEBUG] email format test:', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(volunteerData.email))
      console.log('🔍 [DEBUG] phone format test:', /^\+?[\d\s\-()]+$/.test(volunteerData.phone))
      console.log('🔍 [DEBUG] memberId format:', volunteerData.memberId)
      console.log('🔍 [DEBUG] memberId length:', volunteerData.memberId?.length)

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
        console.log('✅ [DEBUG] Refreshing volunteers list...')
        await fetchVolunteers() // Make sure this completes
        console.log('✅ [DEBUG] Current volunteers after refresh:', volunteers.length)
        setIsVolunteerRecruitOpen(false)
        setSelectedMemberForVolunteer(null)
        toast.success('¡Miembro reclutado como voluntario exitosamente!')
        
        // Force a re-render of the members list
        await fetchMembers()
        console.log('✅ [DEBUG] Members list refreshed')
      } else {
        const errorData = await response.json()
        console.error('❌ [DEBUG] Error response:', errorData)
        console.error('❌ [DEBUG] Validation errors:', errorData.errors)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((error: any, index: number) => {
            console.error(`❌ [DEBUG] Validation Error ${index + 1}:`, {
              field: error.field,
              message: error.message,
              value: volunteerData[error.field as keyof typeof volunteerData]
            })
          })
        }
        toast.error(errorData.message || 'Error al reclutar voluntario')
      }
    } catch (error) {
      console.error('💥 [DEBUG] Exception in handleCreateVolunteerFromMember:', error)
      toast.error('Error al reclutar voluntario')
    }
  }

  // Server-side filtering is now handled in fetchMembers() through API parameters
  // No client-side filtering function needed

  const fetchFilterCounts = async () => {
    try {
      // Build URL with current filter parameters
      const params = new URLSearchParams()
      if (searchTerm) params.set('q', searchTerm)
      if (genderFilter !== 'all') params.set('gender', genderFilter)
      if (ageFilter !== 'all') params.set('ageFilter', ageFilter)
      if (maritalStatusFilter !== 'all') params.set('maritalStatus', maritalStatusFilter)
      if (activeSmartList !== 'all') params.set('smartList', activeSmartList)
      
      const url = `/api/members/counts?${params.toString()}`
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setFilterCounts(data.counts)
        console.log('📊 Filter counts updated:', data.counts)
      }
    } catch (error) {
      console.error('💥 Error fetching filter counts:', error)
    }
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

  // Calculate Smart List Counts
  const calculateSmartListCounts = () => {
    const counts = {
      'new-members': 0,
      'inactive-members': 0,
      'leadership-ready': 0,
      'birthdays': 0,
      'anniversaries': 0,
      'ministry-leaders': 0,
      'visitors-becoming-members': 0,
      'prayer-needed': 0
    }

    members.forEach(member => {
      // New members (30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      if (new Date(member.membershipDate || member.createdAt) >= thirtyDaysAgo) {
        counts['new-members']++
      }

      // Inactive members
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      if (!member.isActive || new Date(member.updatedAt) <= sixMonthsAgo) {
        counts['inactive-members']++
      }

      // Birthday this month
      if (member.birthDate) {
        const currentMonth = new Date().getMonth()
        if (new Date(member.birthDate).getMonth() === currentMonth) {
          counts['birthdays']++
        }
      }

      // Membership anniversary this month
      if (member.membershipDate) {
        const currentMonth = new Date().getMonth()
        if (new Date(member.membershipDate).getMonth() === currentMonth) {
          counts['anniversaries']++
        }
      }

      // Ministry leaders
      if (member.ministryId || (member.spiritualGifts && Array.isArray(member.spiritualGifts) && member.spiritualGifts.length > 0)) {
        counts['ministry-leaders']++
      }

      // Visitors becoming members (last 90 days)
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
      if (member.membershipDate && new Date(member.membershipDate) >= ninetyDaysAgo && !member.baptismDate) {
        counts['visitors-becoming-members']++
      }

      // Prayer needed
      if (member.notes && member.notes.toLowerCase().includes('oración')) {
        counts['prayer-needed']++
      }

      // Leadership ready (can be enhanced with more criteria)
      if (member.isActive && member.leadershipReadiness && member.leadershipReadiness > 70) {
        counts['leadership-ready']++
      }
    })

    return counts
  }

  // Smart List Definitions
  const smartListCounts = calculateSmartListCounts()
  const smartLists = [
    { id: 'all', name: 'Todos los Miembros', icon: Users, count: totalMemberCount },
    { id: 'new-members', name: 'Nuevos Miembros (30d)', icon: UserCheck, count: smartListCounts['new-members'] },
    { id: 'inactive-members', name: 'Miembros Inactivos', icon: UserX, count: smartListCounts['inactive-members'] },
    { id: 'volunteer-candidates', name: 'Candidatos Voluntarios', icon: UserPlus, count: members.filter(m => !getMemberVolunteerStatus(m.id)).length },
    { id: 'active-volunteers', name: 'Son Voluntarios', icon: Target, count: volunteers.filter(v => v.memberId).length },
    { id: 'leadership-ready', name: 'Listos para Liderazgo', icon: Crown, count: smartListCounts['leadership-ready'] },
    { id: 'birthdays', name: 'Cumpleaños este Mes', icon: Calendar, count: smartListCounts['birthdays'] },
    { id: 'anniversaries', name: 'Aniversarios de Membresía', icon: Gift, count: smartListCounts['anniversaries'] },
    { id: 'ministry-leaders', name: 'Líderes de Ministerio', icon: Star, count: smartListCounts['ministry-leaders'] },
    { id: 'visitors-becoming-members', name: 'Visitantes → Miembros', icon: TrendingUp, count: smartListCounts['visitors-becoming-members'] },
    { id: 'prayer-needed', name: 'Necesitan Oración', icon: Heart, count: smartListCounts['prayer-needed'] }
  ]

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

        {/* Real-time Filter Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{filterCounts?.totalCount || filteredMembers.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {activeSmartList === 'all' && !searchTerm && genderFilter === 'all' && ageFilter === 'all' && maritalStatusFilter === 'all' ? 'Total Miembros' : 'Resultados Filtrados'}
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
                    {filterCounts?.genderCounts?.masculino || filteredMembers.filter(m => {
                      const gender = m.gender?.toLowerCase()
                      return gender === 'masculino' || gender === 'male' || gender === 'm'
                    }).length}
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
                    {filterCounts?.genderCounts?.femenino || filteredMembers.filter(m => {
                      const gender = m.gender?.toLowerCase()
                      return gender === 'femenino' || gender === 'female' || gender === 'f'
                    }).length}
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
                {smartLists.find(l => l.id === activeSmartList)?.name || 'Lista de Miembros'} ({activeSmartList === 'all' ? totalMemberCount : filteredMembers.length})
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
                <div className="text-sm text-gray-500 mt-2">
                  Debugging: isLoading={isLoading.toString()}, members.length={members.length}, filteredMembers.length={filteredMembers.length}
                </div>
              </div>
            ) : filteredMembers.length === 0 && members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No se pudieron cargar los miembros</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Debug: members={members.length}, filtered={filteredMembers.length}, 
                  activeFilter={activeSmartList}, searchTerm=&quot;{searchTerm}&quot;
                </p>
                <Button 
                  onClick={() => {
                    console.log('🔄 Manual refresh triggered')
                    fetchMembers()
                  }} 
                  className="mt-4"
                >
                  Recargar Miembros
                </Button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay miembros en esta lista filtrada</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {activeSmartList !== 'all' ? 'Prueba con otra lista inteligente' : 'Revisa los filtros aplicados'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Total miembros: {members.length}, Filtrados: {filteredMembers.length}
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
