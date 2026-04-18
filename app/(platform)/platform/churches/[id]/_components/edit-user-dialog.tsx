'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { User, Mail, Phone, Shield, Lock, RotateCcw } from 'lucide-react'

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    member?: {
      phone?: string
    }
  }
  onSuccess: () => void
}

export default function EditUserDialog({ isOpen, onClose, user, onSuccess }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.member?.phone || '',
    role: user.role,
    isActive: user.isActive
  })
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  // Auto-generate secure random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
    const length = 12
    let password = 'Temp-'
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handlePasswordResetToggle = () => {
    if (!showPasswordReset) {
      // Generate random password automatically when enabling password reset
      const randomPassword = generateRandomPassword()
      setNewPassword(randomPassword)
      setShowPasswordReset(true)
      toast.success('Contraseña temporal generada automáticamente')
    } else {
      // Cancel password reset
      setShowPasswordReset(false)
      setNewPassword('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔧 EDIT USER: Submitting edit for user ID:', user.id)
      console.log('   API URL:', `/api/platform/users/${user.id}`)
      console.log('   User data:', user)
      
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive
      }

      // Add password reset if requested
      if (showPasswordReset && newPassword) {
        if (newPassword.length < 8) {
          toast.error('La contraseña debe tener al menos 8 caracteres')
          setLoading(false)
          return
        }
        payload.resetPassword = true
        payload.newPassword = newPassword
      }

      console.log('   Payload:', payload)

      const response = await fetch(`/api/platform/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('   Response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('   Error response:', error)
        throw new Error(error.error || 'Error al actualizar usuario')
      }

      const result = await response.json()
      console.log('   Success result:', result)

      toast.success(
        showPasswordReset 
          ? '✅ Usuario actualizado. Contraseña temporal enviada por email.'
          : 'Usuario actualizado exitosamente'
      )
      
      onSuccess()
      onClose()
      
      // Reset form
      setShowPasswordReset(false)
      setNewPassword('')

    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Error al actualizar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/platform/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !formData.isActive
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al cambiar estado')
      }

      setFormData(prev => ({ ...prev, isActive: !prev.isActive }))
      toast.success(
        formData.isActive 
          ? 'Usuario desactivado exitosamente'
          : 'Usuario activado exitosamente'
      )
      
      onSuccess()

    } catch (error: any) {
      console.error('Error toggling status:', error)
      toast.error(error.message || 'Error al cambiar estado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[hsl(var(--info))]" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription>
            Actualiza la información del usuario y gestiona su acceso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10"
                placeholder="Juan Pérez"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="pl-10"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70 z-10" />
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN_IGLESIA">Administrador de Iglesia</SelectItem>
                  <SelectItem value="PASTOR">Pastor</SelectItem>
                  <SelectItem value="LIDER">Líder</SelectItem>
                  <SelectItem value="MIEMBRO">Miembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4 text-[hsl(var(--warning))]" />
                Restablecer Contraseña
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePasswordResetToggle}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {showPasswordReset ? 'Cancelar' : 'Restablecer'}
              </Button>
            </div>

            {showPasswordReset && (
              <div className="space-y-2 bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg">
                <Label htmlFor="newPassword">Nueva Contraseña Temporal (Generada Automáticamente)</Label>
                <Input
                  id="newPassword"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  className="font-mono"
                />
                <p className="text-xs text-[hsl(var(--warning))] flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Esta contraseña se enviará automáticamente por email al guardar
                </p>
                <p className="text-xs text-[hsl(var(--warning))]">
                  El usuario deberá cambiar esta contraseña en su próximo inicio de sesión
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant={formData.isActive ? "destructive" : "default"}
              onClick={handleToggleStatus}
              disabled={loading}
            >
              {formData.isActive ? 'Desactivar Usuario' : 'Activar Usuario'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
