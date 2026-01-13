'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  QrCode, 
  Download, 
  Trash2, 
  Eye, 
  BarChart3,
  Search,
  Grid3x3,
  List
} from 'lucide-react'
import { toast } from 'sonner'
import AdvancedQRGenerator from '@/app/(dashboard)/_components/advanced-qr-generator'

interface QRCodeData {
  id: string
  name: string
  type: string
  config: any
  preview: string
  createdAt: string
  _count?: {
    scans: number
  }
}

export default function QRCodesClient() {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([])
  const [loading, setLoading] = useState(true)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [forms, setForms] = useState<any[]>([])

  useEffect(() => {
    fetchQRCodes()
    fetchForms()
  }, [])

  const fetchQRCodes = async () => {
    try {
      const response = await fetch('/api/qr-codes')
      if (response.ok) {
        const data = await response.json()
        setQRCodes(data.qrCodes || [])
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error)
      toast.error('Error al cargar códigos QR')
    } finally {
      setLoading(false)
    }
  }

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/form-builder')
      if (response.ok) {
        const data = await response.json()
        setForms(data.forms || [])
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
    }
  }

  const handleSaveQR = async (qrData: any) => {
    await fetchQRCodes()
    setIsGeneratorOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este código QR?')) return

    try {
      const response = await fetch(`/api/qr-codes?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setQRCodes(qrCodes.filter(qr => qr.id !== id))
        toast.success('Código QR eliminado')
      } else {
        toast.error('Error al eliminar')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const filteredQRCodes = qrCodes.filter(qr =>
    qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escaneos Totales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes.reduce((sum, qr) => sum + (qr._count?.scans || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos Diferentes</CardTitle>
            <Grid3x3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(qrCodes.map(qr => qr.type)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar códigos QR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={() => setIsGeneratorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create QR Code
        </Button>
      </div>

      {/* QR Codes Gallery */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardContent className="pt-4">
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredQRCodes.map((qr) => (
            <Card key={qr.id} className="group hover:shadow-lg transition-shadow">
              <div 
                className="aspect-square relative overflow-hidden rounded-t-lg"
                style={{
                  backgroundColor: qr.config?.bgColor || '#ffffff',
                  backgroundImage: qr.config?.pageBackground ? `url(${qr.config.pageBackground})` : 'none',
                  backgroundSize: 'cover'
                }}
              >
                {qr.preview && (
                  <img 
                    src={qr.preview} 
                    alt={qr.name} 
                    className="w-full h-full object-contain p-4"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(qr.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{qr.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {qr.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{qr._count?.scans || 0} scans</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredQRCodes.map((qr) => (
            <Card key={qr.id} className="hover:shadow transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded flex-shrink-0"
                  style={{
                    backgroundColor: qr.config?.bgColor || '#ffffff',
                    backgroundImage: qr.preview ? `url(${qr.preview})` : 'none',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{qr.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{qr.type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {qr._count?.scans || 0} escaneos
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(qr.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* QR Generator Dialog */}
      <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create QR Code</DialogTitle>
            <p className="text-sm text-muted-foreground">Generate your QR with Ease</p>
          </DialogHeader>
          <AdvancedQRGenerator 
            availableForms={forms}
            onSave={handleSaveQR}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
