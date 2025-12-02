'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Eye, 
  Calendar, 
  Users, 
  FileText, 
  Download,
  Search,
  Filter,
  ExternalLink,
  QrCode,
  Mail,
  Phone
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface FormSubmission {
  id: string
  formId: string
  data: any
  ipAddress: string
  userAgent: string
  createdAt: string
  form?: {
    id: string
    name: string
    slug: string
  }
}

interface VisitorSubmission {
  id: string
  formId: string
  data: any
  ipAddress: string
  userAgent: string
  createdAt: string
  form?: {
    id: string
    name: string
    slug: string
  }
}

interface CustomFormSubmission {
  id: string
  formId: string
  data: any
  ipAddress: string
  userAgent: string
  createdAt: string
  form?: {
    id: string
    title: string
    slug: string
  }
}

interface FormSubmissionsClientProps {
  userRole: string
  churchId: string
}

export function FormSubmissionsClient({ userRole, churchId }: FormSubmissionsClientProps) {
  const [visitorSubmissions, setVisitorSubmissions] = useState<VisitorSubmission[]>([])
  const [customSubmissions, setCustomSubmissions] = useState<CustomFormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('visitor')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      // Fetch visitor form submissions
      const visitorResponse = await fetch('/api/visitor-submissions')
      if (visitorResponse.ok) {
        const visitorData = await visitorResponse.json()
        setVisitorSubmissions(visitorData)
      }

      // Fetch custom form submissions
      const customResponse = await fetch('/api/custom-form-submissions')
      if (customResponse.ok) {
        const customData = await customResponse.json()
        setCustomSubmissions(customData)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Error al cargar las submissions')
    } finally {
      setLoading(false)
    }
  }

  const filteredVisitorSubmissions = visitorSubmissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase()
    const data = submission.data
    return (
      data.firstName?.toLowerCase().includes(searchLower) ||
      data.lastName?.toLowerCase().includes(searchLower) ||
      data.email?.toLowerCase().includes(searchLower) ||
      submission.form?.name?.toLowerCase().includes(searchLower)
    )
  })

  const filteredCustomSubmissions = customSubmissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase()
    const data = submission.data
    return (
      data.firstName?.toLowerCase().includes(searchLower) ||
      data.lastName?.toLowerCase().includes(searchLower) ||
      data.email?.toLowerCase().includes(searchLower) ||
      submission.form?.title?.toLowerCase().includes(searchLower)
    )
  })

  const exportSubmissions = (type: 'visitor' | 'custom') => {
    const data = type === 'visitor' ? filteredVisitorSubmissions : filteredCustomSubmissions
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Fecha,Formulario,Nombre,Email,Teléfono,Via,IP\n"
      + data.map(submission => {
          const formData = submission.data
          return [
            format(new Date(submission.createdAt), 'dd/MM/yyyy HH:mm', { locale: es }),
            type === 'visitor' ? submission.form?.name : submission.form?.title,
            `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
            formData.email || '',
            formData.phone || '',
            formData.submittedVia || '',
            submission.ipAddress
          ].map(field => `"${field}"`).join(',')
        }).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${type}-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Archivo CSV descargado')
  }

  const renderSubmissionDetails = (submission: any) => {
    const data = submission.data
    return (
      <ScrollArea className="max-h-[500px]">
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
              <p className="text-sm">{`${data.firstName || ''} ${data.lastName || ''}`.trim() || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{data.email || 'No especificado'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{data.phone || 'No especificado'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Enviado Via</label>
              <div className="flex items-center gap-2">
                {data.submittedVia?.includes('QR') ? (
                  <QrCode className="h-4 w-4 text-blue-500" />
                ) : (
                  <ExternalLink className="h-4 w-4 text-green-500" />
                )}
                <p className="text-sm">{data.submittedVia || 'Directo'}</p>
              </div>
            </div>
          </div>

          {/* All Form Data */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Todos los Datos del Formulario</label>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="col-span-2">
                    {Array.isArray(value) ? value.join(', ') : String(value || 'N/A')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">IP Address</label>
              <p className="text-xs font-mono">{submission.ipAddress}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fecha de Envío</label>
              <p className="text-xs">{format(new Date(submission.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: es })}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">User Agent</label>
              <p className="text-xs text-muted-foreground break-all">{submission.userAgent}</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Submissions de Formularios</h1>
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Submissions de Formularios</h1>
          <p className="text-muted-foreground">
            Ver todos los datos enviados a través de formularios personalizados
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Formularios de Visitantes</p>
                <p className="text-2xl font-bold">{visitorSubmissions.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Formularios Personalizados</p>
                <p className="text-2xl font-bold">{customSubmissions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{visitorSubmissions.length + customSubmissions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o formulario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Submissions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="visitor">
            Formularios de Visitantes ({filteredVisitorSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="custom">
            Formularios Personalizados ({filteredCustomSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visitor" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => exportSubmissions('visitor')} 
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Formulario</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Via</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitorSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(submission.createdAt), 'dd/MM HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>{submission.form?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {`${submission.data.firstName || ''} ${submission.data.lastName || ''}`.trim() || 'N/A'}
                    </TableCell>
                    <TableCell>{submission.data.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={submission.data.submittedVia?.includes('QR') ? 'default' : 'secondary'}>
                        {submission.data.submittedVia?.includes('QR') ? 'QR Code' : 'Directo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Detalles de Submission - {submission.form?.name}
                            </DialogTitle>
                          </DialogHeader>
                          {renderSubmissionDetails(submission)}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              onClick={() => exportSubmissions('custom')} 
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Formulario</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Via</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(submission.createdAt), 'dd/MM HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>{submission.form?.title || 'N/A'}</TableCell>
                    <TableCell>
                      {`${submission.data.firstName || ''} ${submission.data.lastName || ''}`.trim() || 'N/A'}
                    </TableCell>
                    <TableCell>{submission.data.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={submission.data.submittedVia?.includes('QR') ? 'default' : 'secondary'}>
                        {submission.data.submittedVia?.includes('QR') ? 'QR Code' : 'Directo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Detalles de Submission - {submission.form?.title}
                            </DialogTitle>
                          </DialogHeader>
                          {renderSubmissionDetails(submission)}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredVisitorSubmissions.length === 0 && filteredCustomSubmissions.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay submissions</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No se encontraron resultados para tu búsqueda.' : 'Aún no se han enviado formularios.'}
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}