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

const PREDEFINED_SKILLS = {
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

  useEffect(() => {
    setSelectedSkills(existingSkills)
  }, [existingSkills])

  useEffect(() => {
    onSkillsChange(selectedSkills)
  }, [selectedSkills, onSkillsChange])

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove))
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
                {Object.keys(PREDEFINED_SKILLS).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'Technical' && '🔧 Técnicas'}
                    {category === 'Creative' && '🎨 Creativas'}
                    {category === 'Administrative' && '📋 Administrativas'}
                    {category === 'Professional' && '💼 Profesionales'}
                    {category === 'Trades' && '🛠️ Oficios'}
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
