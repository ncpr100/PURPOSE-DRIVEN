'use client'

import { Badge } from '@/components/ui/badge'
import { Star, UserPlus } from 'lucide-react'

/**
 * Centralized component for rendering member information badges
 * Handles filter state vs. member attribute logic in one place
 */

type MaritalStatusFilter = 'all' | 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'family-group'

interface MemberInfoBadgesProps {
  member: {
    gender?: string
    maritalStatus?: string
    ministryId?: string
  }
  activeMaritalStatusFilter: MaritalStatusFilter
  isVolunteer: boolean
}

export function MemberInfoBadges({ 
  member, 
  activeMaritalStatusFilter,
  isVolunteer 
}: MemberInfoBadgesProps) {
  return (
    <div className="space-y-1">
      {/* Gender Badge - Always shows member's actual gender */}
      {member.gender && (
        <Badge variant="secondary" className="text-xs">
          {member.gender}
        </Badge>
      )}

      {/* Marital Status / Family Filter Badge - Shows active filter or member data */}
      {/* NOTE: When family filter is active, display "Familias" badge instead of marital status */}
      {/* This prevents confusion about what filter is being applied */}
      {activeMaritalStatusFilter === 'family-group' ? (
        <Badge variant="outline" className="text-xs ml-1 bg-purple-100 text-purple-700 border-purple-300">
          Familias
        </Badge>
      ) : member.maritalStatus && (
        <Badge variant="outline" className="text-xs ml-1">
          {member.maritalStatus}
        </Badge>
      )}

      {/* Ministry Leader Badge */}
      {member.ministryId && (
        <Badge variant="default" className="text-xs ml-1">
          <Star className="h-3 w-3 mr-1" />
          Líder
        </Badge>
      )}

      {/* Volunteer Badge */}
      {isVolunteer && (
        <Badge variant="default" className="text-xs ml-1 bg-green-600">
          <UserPlus className="h-3 w-3 mr-1" />
          Voluntario
        </Badge>
      )}
    </div>
  )
}
