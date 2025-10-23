'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus } from 'lucide-react'

interface SkillsSelectorProps {
  memberName: string
  existingSkills?: string[]
  onSkillsChange: (skills: string[]) => void
}

const SKILL_CATEGORIES = [
  { id: 'Technical', name: '🔧 Técnicas' },
  { id: 'Creative', name: '🎨 Creativas' },
  { id: 'Administrative', name: '📋 Administrativas' },
  { id: 'Professional', name: '💼 Profesionales' },
  { id: 'Trades', name: '🛠️ Oficios' }
] as const

const PREDEFINED_SKILLS: Record<string, string[]> = {
  'Technical': [
    'Electricista',
    'Plomero',
    'Carpintero',
    'Mecánico',
    'IT/Computación',
    'Redes',
    'Programación',
    'Base de Datos'
  ],
  'Creative': [
    'Diseño Gráfico',
    'Fotografía',
    'Video',
    'Edición de Audio',
    'Música',
    'Arte',
    'Manualidades',
    'Escritura Creativa'
  ],
  'Administrative': [
    'Contabilidad',
    'Secretarial',
    'Recursos Humanos',
    'Gestión de Proyectos',
    'Organización de Eventos',
    'Atención al Cliente',
    'Recaudación de Fondos'
  ],
  'Professional': [
    'Médico',
    'Enfermería',
    'Dentista',
    'Abogado',
    'Maestro',
    'Consejero',
    'Terapeuta',
    'Nutricionista'
  ],
  'Trades': [
    'Construcción',
    'Pintura',
    'Jardinería',
    'Limpieza',
    'Cocina',
    'Repostería',
    'Costura',
    'Mecánica Automotriz'
  ]
}

export function SkillsSelector({ memberName, existingSkills = [], onSkillsChange }: SkillsSelectorProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(existingSkills)
  const [customSkill, setCustomSkill] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sync with parent's existing skills, but don't trigger onSkillsChange
  useEffect(() => {
    setSelectedSkills(existingSkills)
  }, [existingSkills])

  // Prevent server-side rendering to avoid hydration errors
  if (!isMounted) {
    return <div className="p-4 text-center text-muted-foreground">Cargando...</div>
  }

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill]
      setSelectedSkills(newSkills)
      onSkillsChange(newSkills) // Only call when user adds a skill
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const newSkills = selectedSkills.filter(s => s !== skillToRemove)
    setSelectedSkills(newSkills)
    onSkillsChange(newSkills) // Only call when user removes a skill
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim())
      setCustomSkill('')
    }
  }

  const handleSelectSkill = (skill: string) => {
    addSkill(skill)
  }

  // Prevent hydration mismatch by not rendering until client-side mount
  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Habilidades de {memberName}</CardTitle>
          <CardDescription>
            Selecciona habilidades de las categorías o agrega habilidades personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-muted-foreground">Cargando...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habilidades de {memberName}</CardTitle>
        <CardDescription>
          Selecciona habilidades de las categorías o agrega habilidades personalizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predefined Skills Dropdown */}
        <div className="space-y-3">
          <Label>Seleccionar de categorías predefinidas</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría..." />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory && (
              <Select onValueChange={handleSelectSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una habilidad..." />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_SKILLS[selectedCategory as keyof typeof PREDEFINED_SKILLS].map((skill) => (
                    <SelectItem 
                      key={skill} 
                      value={skill}
                      disabled={selectedSkills.includes(skill)}
                    >
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Custom Skill Input */}
        <div className="space-y-3">
          <Label>O agrega una habilidad personalizada</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Ej: Fotografía, Cocina, Traducción..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddCustomSkill()
                }
              }}
            />
            <Button 
              type="button" 
              onClick={handleAddCustomSkill}
              disabled={!customSkill.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>
        </div>

        {/* Selected Skills Display */}
        {selectedSkills.length > 0 && (
          <div className="space-y-3">
            <Label>Habilidades registradas ({selectedSkills.length})</Label>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary"
                  className="text-sm py-1.5 px-3"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {selectedSkills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No se han registrado habilidades</p>
            <p className="text-sm mt-1">Selecciona de las categorías o agrega una personalizada</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
