
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CreditCard, Smartphone, Building, Loader2 } from 'lucide-react'

interface Church {
  id: string
  name: string
  description?: string | null
  logo?: string | null
}

interface Category {
  id: string
  name: string
  description?: string | null
}

interface Campaign {
  id: string
  title: string
  description?: string | null
  goalAmount?: number | null
  currentAmount: number
  currency: string
  slug?: string | null
  coverImage?: string | null
  categoryId?: string | null
}

interface PublicDonationFormProps {
  church: Church
  categories: Category[]
  campaigns: Campaign[]
  preselectedCampaign?: Campaign | null
}

export function PublicDonationForm({ 
  church, 
  categories, 
  campaigns, 
  preselectedCampaign 
}: PublicDonationFormProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'amount' | 'details' | 'payment'>('amount')
  
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    categoryId: preselectedCampaign?.categoryId || (categories[0]?.id || 'general'),
    campaignId: preselectedCampaign?.id || 'general',
    notes: '',
    gatewayType: 'pse' // Default to PSE
  })

  // Predefined amounts in COP
  const predefinedAmounts = [
    { value: 10000, label: '$10.000' },
    { value: 25000, label: '$25.000' },
    { value: 50000, label: '$50.000' },
    { value: 100000, label: '$100.000' },
    { value: 250000, label: '$250.000' },
    { value: 500000, label: '$500.000' }
  ]

  const paymentMethods = [
    {
      id: 'pse',
      name: 'PSE - Pagos Seguros en Línea',
      description: 'Paga con cualquier banco colombiano',
      icon: Building,
      popular: true
    },
    {
      id: 'nequi',
      name: 'Nequi',
      description: 'Pago desde tu cuenta Nequi',
      icon: Smartphone,
      popular: true
    }
  ]

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString(),
      customAmount: ''
    }))
  }

  const handleCustomAmountChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      customAmount: value,
      amount: value
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const validateStep = () => {
    switch (step) {
      case 'amount':
        const amount = parseFloat(formData.amount)
        if (!amount || amount < 1000) {
          toast.error('El monto mínimo es $1.000 COP')
          return false
        }
        if (amount > 20000000) {
          toast.error('El monto máximo es $20.000.000 COP')
          return false
        }
        return true

      case 'details':
        if (!formData.donorName.trim()) {
          toast.error('El nombre es requerido')
          return false
        }
        
        // email validation with specific pattern
        if (!formData.donorEmail.trim()) {
          toast.error('El email es requerido')
          return false
        }
        // Email pattern validation for security
        const emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValidationPattern.test(formData.donorEmail.trim())) {
          toast.error('El email no es válido')
          return false
        }
        
        // phone validation with specific pattern (if provided)
        if (formData.donorPhone.trim()) {
          // phone pattern validation for security
          const phoneValidationPattern = /^[\+]?[\d\s\-\(\)]+$/;
          if (!phoneValidationPattern.test(formData.donorPhone.trim())) {
            toast.error('El teléfono no es válido')
            return false
          }
        }
        
        if (!formData.categoryId) {
          toast.error('Debe seleccionar una categoría')
          return false
        }
        return true

      case 'payment':
        if (!formData.gatewayType) {
          toast.error('Debe seleccionar un método de pago')
          return false
        }
        return true

      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep()) {
      if (step === 'amount') setStep('details')
      else if (step === 'details') setStep('payment')
    }
  }

  const prevStep = () => {
    if (step === 'payment') setStep('details')
    else if (step === 'details') setStep('amount')
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        currency: 'COP',
        donorName: formData.donorName.trim(),
        donorEmail: formData.donorEmail.trim(),
        donorPhone: formData.donorPhone.trim() || undefined,
        churchId: church.id,
        categoryId: formData.categoryId,
        campaignId: formData.campaignId || undefined,
        gatewayType: formData.gatewayType,
        notes: formData.notes.trim() || undefined,
        returnUrl: `${window.location.origin}/donate/thank-you?church=${church.id}`
      }

      const response = await fetch('/api/online-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        if (result.redirectUrl) {
          // Redirect to payment gateway
          toast.success('Redirigiendo al portal de pagos...')
          window.location.href = result.redirectUrl
        } else {
          toast.success('Pago iniciado correctamente')
        }
      } else {
        throw new Error(result.error || 'Error procesando la donación')
      }

    } catch (error: any) {
      console.error('Donation Error:', error)
      toast.error(error.message || 'Error procesando la donación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center ${step === 'amount' ? 'text-[hsl(var(--info))]' : 'text-muted-foreground/70'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'amount' ? 'bg-[hsl(var(--info))] text-white' : 'bg-muted'
          }`}>
            1
          </div>
          <span className="ml-2 text-sm">Monto</span>
        </div>
        <div className="w-8 h-1 bg-muted">
          <div className={`h-full transition-all ${
            ['details', 'payment'].includes(step) ? 'bg-[hsl(var(--info))] w-full' : 'bg-muted w-0'
          }`}></div>
        </div>
        <div className={`flex items-center ${step === 'details' ? 'text-[hsl(var(--info))]' : 'text-muted-foreground/70'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'details' ? 'bg-[hsl(var(--info))] text-white' : 
            step === 'payment' ? 'bg-[hsl(var(--info))] text-white' : 'bg-muted'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm">Detalles</span>
        </div>
        <div className="w-8 h-1 bg-muted">
          <div className={`h-full transition-all ${
            step === 'payment' ? 'bg-[hsl(var(--info))] w-full' : 'bg-muted w-0'
          }`}></div>
        </div>
        <div className={`flex items-center ${step === 'payment' ? 'text-[hsl(var(--info))]' : 'text-muted-foreground/70'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'payment' ? 'bg-[hsl(var(--info))] text-white' : 'bg-muted'
          }`}>
            3
          </div>
          <span className="ml-2 text-sm">Pago</span>
        </div>
      </div>

      {/* Step 1: Amount */}
      {step === 'amount' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Selecciona el monto</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {predefinedAmounts.map((preset) => (
                <Button
                  key={preset.value}
                  variant={formData.amount === preset.value.toString() ? "default" : "outline"}
                  onClick={() => handleAmountSelect(preset.value)}
                  className="h-12"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            <div>
              <Label htmlFor="custom-amount">Monto personalizado (COP)</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Ingresa el monto"
                value={formData.customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min="1000"
                max="20000000"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Monto mínimo: $1.000 - Monto máximo: $20.000.000
              </p>
            </div>
          </div>

          {formData.amount && (
            <div className="bg-[hsl(var(--info)/0.10)] border border-[hsl(var(--info)/0.3)] rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm text-[hsl(var(--info))]">Monto de la donación</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(parseFloat(formData.amount))}
                </p>
              </div>
            </div>
          )}

          <Button 
            onClick={nextStep} 
            className="w-full"
            disabled={!formData.amount || parseFloat(formData.amount) < 1000}
          >
            Continuar
          </Button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 'details' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Información del donante</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="donor-name">Nombre completo *</Label>
                <Input
                  id="donor-name"
                  value={formData.donorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                  placeholder="Tu nombre completo"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="donor-email">Email *</Label>
                <Input
                  id="donor-email"
                  type="email"
                  value={formData.donorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
                  placeholder="tu@email.com"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recibirás el recibo de donación por email
                </p>
              </div>

              <div>
                <Label htmlFor="donor-phone">Teléfono (opcional)</Label>
                <Input
                  id="donor-phone"
                  value={formData.donorPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorPhone: e.target.value }))}
                  placeholder="+57 300 123 4567"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Destino de la donación</h4>
            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground">{category.description}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {campaigns.length > 0 && (
              <div className="mt-4">
                <Label htmlFor="campaign">Campaña (opcional)</Label>
                <Select
                  value={formData.campaignId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, campaignId: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona una campaña" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Donación general</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        <div>
                          <div className="font-medium">{campaign.title}</div>
                          {campaign.goalAmount && (
                            <div className="text-sm text-muted-foreground">
                              Meta: {formatCurrency(campaign.goalAmount)}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="mt-4">
              <Label htmlFor="notes">Mensaje (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Mensaje o dedicatoria..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={prevStep} variant="outline" className="flex-1">
              Atrás
            </Button>
            <Button onClick={nextStep} className="flex-1">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 'payment' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Método de pago</h3>
            
            {/* https Security Notice */}
            <div className="mb-4 p-3 bg-[hsl(var(--success)/0.10)] border border-[hsl(var(--success)/0.3)] rounded-lg">
              <p className="text-sm text-[hsl(var(--success))]">
                🔒 <strong>Pago seguro:</strong> Tu información está protegida con cifrado https y tecnología de seguridad de nivel bancario.
              </p>
            </div>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card 
                  key={method.id}
                  className={`cursor-pointer transition-all ${
                    formData.gatewayType === method.id 
                      ? 'ring-2 ring-[hsl(var(--info)/0.4)] bg-[hsl(var(--info)/0.10)]' 
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, gatewayType: method.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <method.icon className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.gatewayType === method.id 
                            ? 'border-[hsl(var(--info))] bg-[hsl(var(--info)/0.10)]0' 
                            : 'border-border'
                        }`}>
                          {formData.gatewayType === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de donación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Donante:</span>
                <span className="font-medium">{formData.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{formData.donorEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Categoría:</span>
                <span className="font-medium">
                  {categories.find(c => c.id === formData.categoryId)?.name}
                </span>
              </div>
              {formData.campaignId && (
                <div className="flex justify-between">
                  <span>Campaña:</span>
                  <span className="font-medium">
                    {campaigns.find(c => c.id === formData.campaignId)?.title}
                  </span>
                </div>
              )}
              <div className="border-t pt-2 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(parseFloat(formData.amount))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={prevStep} variant="outline" className="flex-1">
              Atrás
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Donar Ahora'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
