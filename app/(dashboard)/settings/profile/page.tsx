'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Image as ImageIcon, Trash2, Save, Building2, Camera, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChurchProfilePage() {
  const { data: session } = useSession() || {}
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [churchData, setChurchData] = useState({
    name: '',
    address: '',
    country: 'Colombia',
    phone: '',
    email: '',
    website: '',
    description: '',
    logo: ''
  })

  useEffect(() => {
    const loadChurchData = async () => {
      if (!session?.user?.churchId) return
      try {
        const response = await fetch('/api/church/profile')
        if (response.ok) {
          const data = await response.json()
          setChurchData({
            name: data.church?.name || '',
            address: data.church?.address || '',
            country: data.church?.country || 'Colombia',
            phone: data.church?.phone || '',
            email: data.church?.email || '',
            website: data.church?.website || '',
            description: data.church?.description || '',
            logo: data.church?.logo || ''
          })
        }
      } catch (error) {
        console.error('Error loading church data:', error)
      }
    }
    loadChurchData()
  }, [session])

  const handleInputChange = (field: string, value: string) => {
    setChurchData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Por favor selecciona un archivo de imagen'); return }
    if (file.size > 2 * 1024 * 1024) { toast.error('El archivo debe ser menor a 2MB'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'church-logo')
      const response = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        handleInputChange('logo', data.url)
        toast.success('Logo subido exitosamente')
      } else {
        toast.error('Error al subir el logo')
      }
    } catch (error) {
      toast.error('Error al subir el logo')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveLogo = () => {
    handleInputChange('logo', '')
    toast.success('Logo removido')
  }

  const handleSave = async () => {
    if (!churchData.name.trim()) { toast.error('El nombre de la iglesia es requerido'); return }
    setSaving(true)
    try {
      const response = await fetch('/api/church/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churchData)
      })
      if (response.ok) {
        toast.success('Perfil de la iglesia actualizado exitosamente')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al actualizar')
      }
    } catch (error) {
      toast.error('Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--info))]" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Perfil de la Iglesia</h1>
      </div>

      {/* Banner → Tema y Marca */}
      <Card className="border-[hsl(var(--brand-gold)/0.35)] bg-[hsl(var(--brand-gold)/0.06)]">
        <CardContent className="flex items-center justify-between py-4 px-5">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-[hsl(var(--brand-gold-bright))]" />
            <div>
              <p className="text-sm font-medium">¿Quieres personalizar colores, fuentes y diseño visual?</p>
              <p className="text-xs text-muted-foreground">Todo eso está en Tema y Marca — incluyendo los datos de tu iglesia</p>
            </div>
          </div>
          <Link href="/settings/theme">
            <Button variant="outline" size="sm" className="border-[hsl(var(--brand-gold)/0.4)] shrink-0">
              Ir a Tema y Marca
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Logo de la Iglesia
              </CardTitle>
              <CardDescription>Sube el logo oficial de tu iglesia (máx. 2MB)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
                  {churchData.logo ? (
                    <>
                      <img src={churchData.logo} alt="Church Logo" className="w-full h-full object-cover rounded-lg" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6"
                        onClick={handleRemoveLogo}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/70 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Sin logo</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <Input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="logo-upload" disabled={loading} />
                <Button onClick={() => document.getElementById('logo-upload')?.click()} variant="outline" disabled={loading} className="w-full">
                  {loading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[hsl(var(--info))] mr-2" />Subiendo...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" />Subir Logo</>
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Formatos soportados: JPG, PNG, GIF<br />Tamaño máximo: 2MB
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Church Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Iglesia</CardTitle>
              <CardDescription>Actualiza la información básica de tu iglesia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre de la Iglesia *</Label>
                  <Input id="name" value={churchData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ej: Iglesia Central" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={churchData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="contacto@iglesia.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" value={churchData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input id="website" value={churchData.website} onChange={(e) => handleInputChange('website', e.target.value)} placeholder="https://www.iglesia.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={churchData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Calle Principal 123, Ciudad" />
              </div>
              <div>
                <Label htmlFor="country">País</Label>
                <Select value={churchData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger id="country"><SelectValue placeholder="Seleccionar país" /></SelectTrigger>
                  <SelectContent>
                    {['Colombia','México','Brasil','Argentina','Chile','Perú','Venezuela','Ecuador',
                      'Guatemala','Honduras','El Salvador','Nicaragua','Costa Rica','Panamá',
                      'Uruguay','Paraguay','Bolivia','República Dominicana','Cuba','Puerto Rico',
                      'Estados Unidos','España','Otro'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Seleccionar el país activa los métodos de pago disponibles en tu región.
                </p>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" value={churchData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Breve descripción de la iglesia..." rows={3} />
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSave} disabled={saving || !churchData.name.trim()}>
                  {saving ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Guardando...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" />Guardar Cambios</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
