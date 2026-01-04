'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Users, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Wand2,
  Save
} from 'lucide-react'
import { toast } from 'sonner'

interface Member {
  id: string
  firstName: string
  lastName: string
  email?: string
  gender?: string
  createdAt: string
}

interface GenderUpdate {
  id: string
  firstName: string
  lastName: string
  suggestedGender: string
  selectedGender: string
}

export function BulkGenderUpdateClient({ userRole }: { userRole: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [updates, setUpdates] = useState<GenderUpdate[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [processingUpdate, setProcessingUpdate] = useState(false)

  const canUpdate = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(userRole)

  const fetchMembersWithoutGender = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/members/bulk-gender-update')
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
        
        // Initialize updates array with suggested genders
        const initialUpdates = (data.members || []).map((member: Member) => ({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          suggestedGender: inferGenderFromName(member.firstName),
          selectedGender: inferGenderFromName(member.firstName)
        }))
        setUpdates(initialUpdates)
        
        toast.success(`Encontrados ${data.total} miembros sin datos de género`)
      } else {
        toast.error('Error al cargar miembros')
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      toast.error('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // Simple name-based gender inference (Spanish names)
  const inferGenderFromName = (firstName: string): string => {
    if (!firstName) return ''
    
    const name = firstName.toLowerCase().trim()
    
    // Common Spanish male names
    const maleNames = [
      'juan', 'carlos', 'josé', 'antonio', 'francisco', 'manuel', 'david', 'daniel', 
      'miguel', 'rafael', 'pedro', 'alejandro', 'fernando', 'sergio', 'pablo', 'jorge',
      'luis', 'alberto', 'ricardo', 'roberto', 'eduardo', 'andrés', 'javier', 'diego',
      'gabriel', 'adrián', 'óscar', 'gonzalo', 'mario', 'santiago', 'césar', 'ramón'
    ]
    
    // Common Spanish female names  
    const femaleNames = [
      'maría', 'ana', 'carmen', 'laura', 'elena', 'cristina', 'patricia', 'sandra',
      'monica', 'nuria', 'silvia', 'rosa', 'beatriz', 'teresa', 'pilar', 'mercedes',
      'angeles', 'isabel', 'julia', 'raquel', 'andrea', 'natalia', 'gloria', 'esperanza',
      'dolores', 'antonia', 'francisca', 'catalina', 'inmaculada', 'magdalena', 'josefa'
    ]
    
    // Check for exact matches
    if (maleNames.includes(name)) return 'masculino'
    if (femaleNames.includes(name)) return 'femenino'
    
    // Check for common endings
    if (name.endsWith('a') && !name.endsWith('ía')) {
      // Most Spanish female names end in 'a'
      return 'femenino'
    } else if (name.endsWith('o') || name.endsWith('r') || name.endsWith('n')) {
      // Most Spanish male names end in 'o', 'r', or 'n'
      return 'masculino'
    }
    
    return '' // Can't infer
  }

  const handleGenderChange = (memberId: string, gender: string) => {
    setUpdates(prev => prev.map(update => 
      update.id === memberId ? { ...update, selectedGender: gender } : update
    ))
  }

  const applyAllSuggestions = () => {
    setUpdates(prev => prev.map(update => ({
      ...update,
      selectedGender: update.suggestedGender
    })))
    toast.success('Aplicadas todas las sugerencias automáticas')
  }

  const submitUpdates = async () => {
    try {
      setProcessingUpdate(true)
      
      // Filter out updates where no gender was selected
      const validUpdates = updates
        .filter(update => update.selectedGender && ['masculino', 'femenino'].includes(update.selectedGender))
        .map(update => ({
          id: update.id,
          gender: update.selectedGender
        }))

      if (validUpdates.length === 0) {
        toast.error('No hay actualizaciones válidas para procesar')
        return
      }

      const response = await fetch('/api/members/bulk-gender-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: validUpdates })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message)
        
        // Refresh the list
        await fetchMembersWithoutGender()
        
        // Close dialog if all were processed successfully
        if (result.summary.errors === 0) {
          setIsOpen(false)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al actualizar miembros')
      }
    } catch (error) {
      console.error('Error updating members:', error)
      toast.error('Error al conectar con el servidor')
    } finally {
      setProcessingUpdate(false)
    }
  }

  const exportCSV = () => {
    if (members.length === 0) return

    const csvContent = [
      'ID,Nombre,Apellido,Email,Género Sugerido,Género Seleccionado',
      ...updates.map(update => 
        `${update.id},"${update.firstName}","${update.lastName}","${members.find(m => m.id === update.id)?.email || ''}","${update.suggestedGender}","${update.selectedGender}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miembros-sin-genero-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredUpdates = updates.filter(update => 
    searchTerm === '' || 
    `${update.firstName} ${update.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: updates.length,
    withSuggestions: updates.filter(u => u.suggestedGender).length,
    selected: updates.filter(u => u.selectedGender && ['masculino', 'femenino'].includes(u.selectedGender)).length
  }

  if (!canUpdate) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No tienes permisos para actualizar datos de miembros.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Actualización Masiva de Género
          </CardTitle>
          <CardDescription>
            Actualiza la información de género para miembros que no tienen esta información registrada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Sin Género</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.withSuggestions}</p>
                    <p className="text-sm text-muted-foreground">Con Sugerencia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.selected}</p>
                    <p className="text-sm text-muted-foreground">Seleccionados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={fetchMembersWithoutGender} disabled={loading}>
                  <Users className="mr-2 h-4 w-4" />
                  {loading ? 'Cargando...' : 'Gestionar Géneros'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Actualización Masiva de Género</DialogTitle>
                  <DialogDescription>
                    Revisa y actualiza la información de género para {stats.total} miembros
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={applyAllSuggestions}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Aplicar Todas
                    </Button>
                    <Button variant="outline" onClick={exportCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </div>

                  <div className="max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Sugerencia</TableHead>
                          <TableHead>Género</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUpdates.map((update) => (
                          <TableRow key={update.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{update.firstName} {update.lastName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {members.find(m => m.id === update.id)?.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {update.suggestedGender ? (
                                <Badge variant="secondary">
                                  {update.suggestedGender === 'masculino' ? 'Masculino' : 'Femenino'}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">Sin sugerencia</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={update.selectedGender} 
                                onValueChange={(value) => handleGenderChange(update.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">Sin especificar</SelectItem>
                                  <SelectItem value="masculino">Masculino</SelectItem>
                                  <SelectItem value="femenino">Femenino</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      {stats.selected} de {stats.total} miembros tienen género asignado
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={submitUpdates} 
                        disabled={processingUpdate || stats.selected === 0}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {processingUpdate ? 'Actualizando...' : `Actualizar ${stats.selected} Miembros`}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={exportCSV} disabled={members.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}