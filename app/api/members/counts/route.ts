import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const { searchParams } = new URL(request.url)
    
    // Extract filter parameters
    const q = searchParams.get('q') || ''
    const gender = searchParams.get('gender') || 'all'
    const ageFilter = searchParams.get('ageFilter') || 'all'
    const maritalStatus = searchParams.get('maritalStatus') || 'all'
    const smartList = searchParams.get('smartList') || 'all'

    // Base query - get all active members for this church
    let members = await db.members.findMany({
      where: {
        churchId,
        isActive: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        birthDate: true,
        maritalStatus: true,
        membershipDate: true,
        isActive: true,
        ministryId: true,
        spiritualGifts: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Apply search filter
    if (q.trim()) {
      const searchTerm = q.toLowerCase()
      members = members.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm) ||
        member.email?.toLowerCase().includes(searchTerm) ||
        member.phone?.includes(searchTerm)
      )
    }

    // Apply gender filter
    if (gender !== 'all') {
      members = members.filter(member => {
        const memberGender = member.gender?.toLowerCase()
        if (gender === 'masculino') {
          return memberGender === 'masculino' || memberGender === 'male' || memberGender === 'm'
        } else if (gender === 'femenino') {
          return memberGender === 'femenino' || memberGender === 'female' || memberGender === 'f'
        }
        return false
      })
    }

    // Apply age filter
    if (ageFilter !== 'all') {
      members = members.filter(member => {
        if (!member.birthDate) return false
        
        const today = new Date()
        const birthDate = new Date(member.birthDate)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        
        switch (ageFilter) {
          case '0-17': return age >= 0 && age <= 17
          case '18-25': return age >= 18 && age <= 25
          case '26-35': return age >= 26 && age <= 35
          case '36-50': return age >= 36 && age <= 50
          case '51+': return age >= 51
          default: return false
        }
      })
    }

    // Apply marital status filter
    if (maritalStatus !== 'all') {
      if (maritalStatus === 'family-group') {
        // Show only members whose last name appears multiple times (families)
        const lastNameCounts = members.reduce((acc, member) => {
          acc[member.lastName] = (acc[member.lastName] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        members = members.filter(member => lastNameCounts[member.lastName] > 1)
      } else {
        // Regular marital status filter
        const statusFilter = maritalStatus.toLowerCase()
        members = members.filter(member => {
          const memberStatus = member.maritalStatus?.toLowerCase()
          if (statusFilter === 'soltero') {
            return memberStatus === 'soltero' || memberStatus === 'single'
          } else if (statusFilter === 'casado') {
            return memberStatus === 'casado' || memberStatus === 'married'
          } else if (statusFilter === 'divorciado') {
            return memberStatus === 'divorciado' || memberStatus === 'divorced'
          } else if (statusFilter === 'viudo') {
            return memberStatus === 'viudo' || memberStatus === 'widowed'
          }
          return memberStatus === statusFilter
        })
      }
    }

    // Apply smart list filter
    if (smartList !== 'all') {
      switch (smartList) {
        case 'new-members':
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          members = members.filter(member => 
            new Date(member.membershipDate || member.createdAt) >= thirtyDaysAgo
          )
          break
          
        case 'inactive-members':
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
          members = members.filter(member => 
            !member.isActive || new Date(member.updatedAt) <= sixMonthsAgo
          )
          break
          
        case 'birthdays':
          const currentMonth = new Date().getMonth()
          members = members.filter(member => 
            member.birthDate && new Date(member.birthDate).getMonth() === currentMonth
          )
          break
          
        case 'anniversaries':
          const currentMonth2 = new Date().getMonth()
          members = members.filter(member => 
            member.membershipDate && new Date(member.membershipDate).getMonth() === currentMonth2
          )
          break
          
        case 'ministry-leaders':
          members = members.filter(member => 
            member.ministryId || (member.spiritualGifts && Array.isArray(member.spiritualGifts) && member.spiritualGifts.length > 0)
          )
          break
          
        case 'prayer-needed':
          members = members.filter(member => 
            member.notes && member.notes.toLowerCase().includes('oración')
          )
          break
          
        default:
          // No additional filtering for other smart lists in count endpoint
          break
      }
    }

    // Calculate different count metrics
    const counts = {
      totalCount: members.length,
      genderCounts: {
        masculino: members.filter(m => {
          const gender = m.gender?.toLowerCase()
          return gender === 'masculino' || gender === 'male' || gender === 'm'
        }).length,
        femenino: members.filter(m => {
          const gender = m.gender?.toLowerCase()
          return gender === 'femenino' || gender === 'female' || gender === 'f'
        }).length,
        sinEspecificar: members.filter(m => {
          const gender = m.gender?.toLowerCase()
          return !gender || gender === 'null' || gender === ''
        }).length
      },
      ageCounts: {
        '0-17': members.filter(m => {
          if (!m.birthDate) return false
          const today = new Date()
          const birthDate = new Date(m.birthDate)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          return age >= 0 && age <= 17
        }).length,
        '18-25': members.filter(m => {
          if (!m.birthDate) return false
          const today = new Date()
          const birthDate = new Date(m.birthDate)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          return age >= 18 && age <= 25
        }).length,
        '26-35': members.filter(m => {
          if (!m.birthDate) return false
          const today = new Date()
          const birthDate = new Date(m.birthDate)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          return age >= 26 && age <= 35
        }).length,
        '36-50': members.filter(m => {
          if (!m.birthDate) return false
          const today = new Date()
          const birthDate = new Date(m.birthDate)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          return age >= 36 && age <= 50
        }).length,
        '51+': members.filter(m => {
          if (!m.birthDate) return false
          const today = new Date()
          const birthDate = new Date(m.birthDate)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
          return age >= 51
        }).length,
        sinEspecificar: members.filter(m => !m.birthDate).length
      },
      maritalStatusCounts: {
        soltero: members.filter(m => {
          const status = m.maritalStatus?.toLowerCase()
          return status === 'soltero' || status === 'single'
        }).length,
        casado: members.filter(m => {
          const status = m.maritalStatus?.toLowerCase()
          return status === 'casado' || status === 'married'
        }).length,
        divorciado: members.filter(m => {
          const status = m.maritalStatus?.toLowerCase()
          return status === 'divorciado' || status === 'divorced'
        }).length,
        viudo: members.filter(m => {
          const status = m.maritalStatus?.toLowerCase()
          return status === 'viudo' || status === 'widowed'
        }).length,
        sinEspecificar: members.filter(m => {
          const status = m.maritalStatus?.toLowerCase()
          return !status || status === 'null' || status === ''
        }).length
      }
    }

    return NextResponse.json({
      counts,
      filters: {
        q,
        gender,
        ageFilter,
        maritalStatus,
        smartList
      },
      success: true
    })

  } catch (error) {
    console.error('Error in /api/members/counts:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}