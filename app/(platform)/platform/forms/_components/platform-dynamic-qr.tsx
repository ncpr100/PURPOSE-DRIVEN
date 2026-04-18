'use client'

/**
 * Platform Dynamic QR Manager
 * - Create standalone QR codes pointing to a short /qr/[shortCode] URL
 * - Update destination without reprinting
 * - View scan analytics per QR
 * - Download individual QR image
 * - Bulk create from URL list → download ZIP
 */

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  QrCode,
  Plus,
  Download,
  Edit3,
  BarChart3,
  Link2,
  Target,
  CreditCard,
  Calendar,
  FileText,
  Globe,
  Copy,
  RefreshCw,
  Archive,
  Layers,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type DestinationType = 'url' | 'form' | 'payment' | 'event' | 'survey'

interface DynamicQRCode {
  id:              string
  shortCode:       string
  name:            string
  destinationType: DestinationType
  destinationUrl:  string
  isActive:        boolean
  scanCount:       number
  lastScannedAt:   string | null
  notes:           string | null
  createdAt:       string
  config:          Record<string, any>
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const TYPE_META: Record<DestinationType, { label: string; icon: React.ElementType; color: string }> = {
  url:     { label: 'Enlace web',        icon: Globe,       color: 'text-[hsl(var(--info))] bg-[hsl(var(--info)/0.15)]' },
  form:    { label: 'Formulario',         icon: FileText,    color: 'text-[hsl(var(--lavender))] bg-[hsl(var(--lavender)/0.15)]' },
  payment: { label: 'Pago',              icon: CreditCard,  color: 'text-[hsl(var(--success))] bg-[hsl(var(--success)/0.15)]' },
  event:   { label: 'Evento',            icon: Calendar,    color: 'text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.15)]' },
  survey:  { label: 'Encuesta',          icon: Target,      color: 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.12)]' },
}

async function generateQRDataUrl(url: string, size = 300): Promise<string> {
  return QRCode.toDataURL(url, {
    width:         size,
    margin:        2,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#ffffff' },
  })
}

function qrPublicUrl(shortCode: string): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXTAUTH_URL || 'https://khesed-tek-cms-org.vercel.app'
  return `${origin}/api/qr/${shortCode}`
}

// ─────────────────────────────────────────────
// QR preview canvas helper
// ─────────────────────────────────────────────
function QRPreview({ url, size = 128 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    generateQRDataUrl(url, size).then(setDataUrl).catch(() => setDataUrl(''))
  }, [url, size])

  if (!dataUrl) return <div className="rounded bg-muted/50 animate-pulse" style={{ width: size, height: size }} />
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} alt="QR" width={size} height={size} className="rounded border" />
  )
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export function PlatformDynamicQR() {
  const [items, setItems]         = useState<DynamicQRCode[]>([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)

  // Create dialog state
  const [createOpen, setCreateOpen]           = useState(false)
  const [createName, setCreateName]           = useState('')
  const [createType, setCreateType]           = useState<DestinationType>('url')
  const [createUrl, setCreateUrl]             = useState('')
  const [createNotes, setCreateNotes]         = useState('')
  const [createLoading, setCreateLoading]     = useState(false)

  // Edit destination dialog
  const [editItem, setEditItem]               = useState<DynamicQRCode | null>(null)
  const [editUrl, setEditUrl]                 = useState('')
  const [editLoading, setEditLoading]         = useState(false)

  // Detail / analytics dialog
  const [detailItem, setDetailItem]           = useState<DynamicQRCode | null>(null)
  const [detailQRUrl, setDetailQRUrl]         = useState('')

  // Bulk dialog
  const [bulkOpen, setBulkOpen]               = useState(false)
  const [bulkText, setBulkText]               = useState('')
  const [bulkType, setBulkType]               = useState<DestinationType>('url')
  const [bulkLoading, setBulkLoading]         = useState(false)

  const LIMIT = 20

  // ─── fetch ───────────────────────────────────
  const fetchItems = async (p = page) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/platform/dynamic-qr?page=${p}&limit=${LIMIT}`)
      if (!res.ok) throw new Error('Error al cargar')
      const { data, meta } = await res.json()
      setItems(data)
      setTotal(meta.total)
    } catch {
      toast.error('Error cargando códigos QR')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [page]) // eslint-disable-line

  // ─── create ──────────────────────────────────
  const handleCreate = async () => {
    if (!createName.trim())   { toast.error('El nombre es requerido'); return }
    if (!createUrl.trim())    { toast.error('La URL de destino es requerida'); return }
    try { new URL(createUrl) } catch { toast.error('URL inválida'); return }

    setCreateLoading(true)
    try {
      const res = await fetch('/api/platform/dynamic-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:            createName.trim(),
          destinationType: createType,
          destinationUrl:  createUrl.trim(),
          notes:           createNotes.trim(),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Error al crear')
        return
      }
      toast.success('Código QR creado')
      setCreateOpen(false)
      setCreateName(''); setCreateUrl(''); setCreateNotes('')
      fetchItems(1); setPage(1)
    } finally {
      setCreateLoading(false)
    }
  }

  // ─── update destination ───────────────────────
  const handleUpdateUrl = async () => {
    if (!editItem) return
    if (!editUrl.trim()) { toast.error('La URL no puede estar vacía'); return }
    try { new URL(editUrl) } catch { toast.error('URL inválida'); return }

    setEditLoading(true)
    try {
      const res = await fetch('/api/platform/dynamic-qr', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editItem.id, destinationUrl: editUrl.trim() }),
      })
      if (!res.ok) { toast.error('Error al actualizar'); return }
      toast.success('Destino actualizado — sin reimprimir el QR')
      setEditItem(null)
      fetchItems()
    } finally {
      setEditLoading(false)
    }
  }

  // ─── toggle active ────────────────────────────
  const handleToggleActive = async (item: DynamicQRCode) => {
    await fetch('/api/platform/dynamic-qr', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
    })
    fetchItems()
  }

  // ─── download single QR ───────────────────────
  const handleDownload = async (item: DynamicQRCode) => {
    const dataUrl = await generateQRDataUrl(qrPublicUrl(item.shortCode), 600)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `qr-${item.shortCode}-${item.name.replace(/\s+/g, '-')}.png`
    a.click()
  }

  // ─── copy link ────────────────────────────────
  const handleCopyLink = (item: DynamicQRCode) => {
    navigator.clipboard.writeText(qrPublicUrl(item.shortCode))
    toast.success('Enlace copiado')
  }

  // ─── open detail ─────────────────────────────
  const handleOpenDetail = async (item: DynamicQRCode) => {
    setDetailItem(item)
    const url = await generateQRDataUrl(qrPublicUrl(item.shortCode), 300)
    setDetailQRUrl(url)
  }

  // ─── bulk create ─────────────────────────────
  const handleBulkCreate = async () => {
    const lines = bulkText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    if (lines.length === 0) { toast.error('Agrega al menos una URL'); return }

    // Validate all
    for (const line of lines) {
      try { new URL(line) } catch {
        toast.error(`URL inválida: ${line.slice(0, 40)}`)
        return
      }
    }

    setBulkLoading(true)
    const results: { name: string; shortCode: string; dataUrl: string }[] = []

    try {
      for (let i = 0; i < lines.length; i++) {
        const url = lines[i]
        const res = await fetch('/api/platform/dynamic-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:            `Bulk QR ${i + 1}`,
            destinationType: bulkType,
            destinationUrl:  url,
          }),
        })
        if (res.ok) {
          const { data } = await res.json()
          const dataUrl = await generateQRDataUrl(qrPublicUrl(data.shortCode), 400)
          results.push({ name: data.name, shortCode: data.shortCode, dataUrl })
        }
      }

      if (results.length === 0) {
        toast.error('No se crearon códigos')
        return
      }

      // Build ZIP-like bundle via individual downloads (no JSZip dependency needed)
      // Offer each as a data URL download back-to-back
      for (const r of results) {
        const a = document.createElement('a')
        a.href = r.dataUrl
        a.download = `qr-${r.shortCode}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        await new Promise((resolve) => setTimeout(resolve, 150))
      }

      toast.success(`${results.length} QR generados y descargados`)
      setBulkOpen(false)
      setBulkText('')
      fetchItems(1); setPage(1)
    } finally {
      setBulkLoading(false)
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">QR Códigos Dinámicos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cambia el destino sin reimprimir. Cada QR apunta a un código corto permanente.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            <Layers className="h-4 w-4 mr-2" />
            Crear en masa
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo QR
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(TYPE_META) as [DestinationType, typeof TYPE_META[DestinationType]][]).map(
          ([type, meta]) => {
            const Icon = meta.icon
            const count = items.filter((i) => i.destinationType === type).length
            return (
              <Card key={type} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${meta.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{meta.label}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                </div>
              </Card>
            )
          }
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground text-sm">Cargando…</div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <QrCode className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">Sin códigos QR dinámicos</p>
              <Button className="mt-4" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primero
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QR</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Destino actual</TableHead>
                  <TableHead className="text-right">Escaneos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const meta = TYPE_META[item.destinationType] || TYPE_META.url
                  const Icon = meta.icon
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <button onClick={() => handleOpenDetail(item)} title="Ver detalles">
                          <QRPreview url={qrPublicUrl(item.shortCode)} size={48} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{item.shortCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${meta.color} border-0`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-xs text-muted-foreground truncate">{item.destinationUrl}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold">{item.scanCount.toLocaleString()}</span>
                        {item.lastScannedAt && (
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.lastScannedAt), 'dd MMM', { locale: es })}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={() => handleToggleActive(item)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyLink(item)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copiar enlace</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => { setEditItem(item); setEditUrl(item.destinationUrl) }}
                                >
                                  <RefreshCw className="h-4 w-4 text-[hsl(var(--info))]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Cambiar destino</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(item)}>
                                  <Download className="h-4 w-4 text-[hsl(var(--success))]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Descargar QR</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDetail(item)}>
                                  <BarChart3 className="h-4 w-4 text-[hsl(var(--lavender))]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Ver detalles</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{total} códigos QR en total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Anterior
            </Button>
            <span className="px-3 py-1">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* ── Create dialog ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-[hsl(var(--info))]" />
              Nuevo Código QR Dinámico
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nombre *</Label>
              <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Ej: Banner Conferencia 2026" className="mt-1" />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={createType} onValueChange={(v) => setCreateType(v as DestinationType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(TYPE_META) as [DestinationType, typeof TYPE_META[DestinationType]][]).map(([value, meta]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <meta.icon className="h-4 w-4" />
                        {meta.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>URL de destino *</Label>
              <Input
                value={createUrl}
                onChange={(e) => setCreateUrl(e.target.value)}
                placeholder="https://tu-sitio.com/evento"
                type="url"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Puedes cambiar este enlace en cualquier momento sin reimprimir el QR.
              </p>
            </div>
            <div>
              <Label>Notas (opcional)</Label>
              <Textarea value={createNotes} onChange={(e) => setCreateNotes(e.target.value)} placeholder="Dónde se usará este QR, campaña, etc." rows={2} className="mt-1" />
            </div>

            {createUrl && (() => { try { new URL(createUrl); return true } catch { return false } })() && (
              <div className="flex justify-center py-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Vista previa QR (URL temporal)</p>
                  <QRPreview url={createUrl} size={160} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createLoading || !createName.trim() || !createUrl.trim()}>
              {createLoading ? 'Creando…' : 'Crear QR'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit destination dialog ── */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-[hsl(var(--info))]" />
              Cambiar destino del QR
            </DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium">{editItem.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{editItem.shortCode}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cambiar el destino NO requiere reimprimir el código QR.
                </p>
              </div>
              <div>
                <Label>Nueva URL de destino</Label>
                <Input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  type="url"
                  placeholder="https://nuevo-destino.com"
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancelar</Button>
            <Button onClick={handleUpdateUrl} disabled={editLoading}>
              {editLoading ? 'Actualizando…' : 'Actualizar destino'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Detail / analytics dialog ── */}
      <Dialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[hsl(var(--lavender))]" />
              Detalles del Código QR
            </DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-5 py-2">
              <div className="flex gap-5 items-start">
                {detailQRUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={detailQRUrl} alt="QR" width={120} height={120} className="rounded border shadow-sm shrink-0" />
                ) : (
                  <div className="w-[120px] h-[120px] bg-muted/50 rounded animate-pulse shrink-0" />
                )}
                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <p className="font-semibold">{detailItem.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{detailItem.shortCode}</p>
                  </div>
                  <Badge className={`text-xs ${TYPE_META[detailItem.destinationType]?.color} border-0`}>
                    {TYPE_META[detailItem.destinationType]?.label}
                  </Badge>
                  <div className="bg-muted rounded p-2">
                    <p className="text-xs font-medium">Total escaneos</p>
                    <p className="text-3xl font-bold text-[hsl(var(--lavender))]">{detailItem.scanCount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destino</span>
                  <span className="text-right max-w-[200px] truncate font-mono text-xs">{detailItem.destinationUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enlace público</span>
                  <button
                    className="text-[hsl(var(--info))] text-xs hover:underline"
                    onClick={() => { navigator.clipboard.writeText(qrPublicUrl(detailItem.shortCode)); toast.success('Copiado') }}
                  >
                    {qrPublicUrl(detailItem.shortCode).replace(/^https?:\/\//, '')}
                  </button>
                </div>
                {detailItem.lastScannedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Último escaneo</span>
                    <span>{format(new Date(detailItem.lastScannedAt), "dd 'de' MMMM, HH:mm", { locale: es })}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creado</span>
                  <span>{format(new Date(detailItem.createdAt), "dd MMM yyyy", { locale: es })}</span>
                </div>
                {detailItem.notes && (
                  <div>
                    <span className="text-muted-foreground">Notas</span>
                    <p className="text-xs mt-1 bg-muted p-2 rounded">{detailItem.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleDownload(detailItem)}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PNG
                </Button>
                <Button variant="outline" onClick={() => handleCopyLink(detailItem)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Bulk create dialog ── */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[hsl(var(--info))]" />
              Crear QR en Masa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Tipo para todos</Label>
              <Select value={bulkType} onValueChange={(v) => setBulkType(v as DestinationType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(TYPE_META) as [DestinationType, typeof TYPE_META[DestinationType]][]).map(([value, meta]) => (
                    <SelectItem key={value} value={value}>{meta.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>URLs de destino (una por línea) *</Label>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`https://sitio.com/evento-1\nhttps://sitio.com/evento-2\nhttps://sitio.com/evento-3`}
                rows={6}
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {bulkText.split('\n').filter((l) => l.trim()).length} URL(s) procesadas
              </p>
            </div>
            <div className="p-3 bg-[hsl(var(--info)/0.10)] rounded-lg text-xs text-[hsl(var(--info))]">
              Khesed-Tek generará un código QR dinámico para cada URL y los descargará 
              automáticamente.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleBulkCreate}
              disabled={bulkLoading || !bulkText.trim()}
            >
              {bulkLoading ? 'Generando…' : `Generar ${bulkText.split('\n').filter((l) => l.trim()).length} QR(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
