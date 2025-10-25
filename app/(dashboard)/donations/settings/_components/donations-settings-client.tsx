'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, CreditCard, DollarSign, Plus, Edit, Trash2,
  Save, RefreshCw, Eye, EyeOff, AlertCircle, CheckCircle,
  Globe, Building, Phone, Mail, MapPin, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface DonationCategory {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  churchId: string;
  sortOrder?: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description?: string | null;
  isDigital: boolean;
  isActive: boolean;
  config?: any;
  createdAt: Date;
  updatedAt: Date;
  churchId: string;
}

interface DonationsSettingsClientProps {
  churchId: string;
  userRole: string;
  initialCategories: DonationCategory[];
  initialPaymentMethods: PaymentMethod[];
}

export default function DonationsSettingsClient({
  churchId,
  userRole,
  initialCategories,
  initialPaymentMethods
}: DonationsSettingsClientProps) {
  const [categories, setCategories] = useState<DonationCategory[]>(initialCategories);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // Payment method form state
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    description: '',
    isDigital: false,
    isActive: true
  });
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Stripe configuration
  const [stripeConfig, setStripeConfig] = useState({
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
    enabled: false
  });
  const [showSecrets, setShowSecrets] = useState(false);

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/donation-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...categoryForm,
          churchId
        })
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [...prev, newCategory]);
        setCategoryForm({ name: '', description: '', isActive: true });
        setCategoryDialogOpen(false);
        toast.success('Categoría creada exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al crear categoría');
      }
    } catch (error) {
      toast.error('Error al crear categoría');
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePaymentMethod = async () => {
    if (!paymentForm.name.trim()) {
      toast.error('El nombre del método de pago es requerido');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentForm,
          churchId
        })
      });

      if (response.ok) {
        const newMethod = await response.json();
        setPaymentMethods(prev => [...prev, newMethod]);
        setPaymentForm({ name: '', description: '', isDigital: false, isActive: true });
        setPaymentDialogOpen(false);
        toast.success('Método de pago creado exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al crear método de pago');
      }
    } catch (error) {
      toast.error('Error al crear método de pago');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStripeConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/payment-gateways/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          churchId,
          config: stripeConfig
        })
      });

      if (response.ok) {
        toast.success('Configuración de Stripe guardada exitosamente');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al guardar configuración');
      }
    } catch (error) {
      toast.error('Error al guardar configuración de Stripe');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategoryStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/donation-categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId ? { ...cat, isActive } : cat
        ));
        toast.success(`Categoría ${isActive ? 'activada' : 'desactivada'}`);
      }
    } catch (error) {
      toast.error('Error al actualizar categoría');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Donaciones</h1>
        <p className="text-gray-600 mt-2">
          Administre categorías, métodos de pago y configuración de gateways
        </p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="payment-methods">Métodos de Pago</TabsTrigger>
          <TabsTrigger value="gateways">Gateways de Pago</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Categorías de Donación</CardTitle>
                  <CardDescription>
                    Organice las donaciones por categorías para mejor control
                  </CardDescription>
                </div>
                <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Categoría</DialogTitle>
                      <DialogDescription>
                        Defina una nueva categoría para clasificar las donaciones
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="categoryName">Nombre</Label>
                        <Input
                          id="categoryName"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="ej. Diezmos, Ofrendas, Misiones"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryDescription">Descripción</Label>
                        <Input
                          id="categoryDescription"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descripción opcional"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="categoryActive"
                          checked={categoryForm.isActive}
                          onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="categoryActive">Categoría activa</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateCategory} disabled={saving}>
                          {saving ? 'Guardando...' : 'Crear Categoría'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={(checked) => toggleCategoryStatus(category.id, checked)}
                      />
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay categorías configuradas. Cree la primera categoría.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Métodos de Pago</CardTitle>
                  <CardDescription>
                    Configure los métodos de pago disponibles
                  </CardDescription>
                </div>
                <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Método
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Método de Pago</DialogTitle>
                      <DialogDescription>
                        Defina un nuevo método para recibir donaciones
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="paymentName">Nombre</Label>
                        <Input
                          id="paymentName"
                          value={paymentForm.name}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="ej. Efectivo, Tarjeta de Crédito"
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentDescription">Descripción</Label>
                        <Input
                          id="paymentDescription"
                          value={paymentForm.description}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descripción opcional"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="paymentDigital"
                          checked={paymentForm.isDigital}
                          onCheckedChange={(checked) => setPaymentForm(prev => ({ ...prev, isDigital: checked }))}
                        />
                        <Label htmlFor="paymentDigital">Método digital</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="paymentActive"
                          checked={paymentForm.isActive}
                          onCheckedChange={(checked) => setPaymentForm(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="paymentActive">Método activo</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreatePaymentMethod} disabled={saving}>
                          {saving ? 'Guardando...' : 'Crear Método'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{method.name}</h4>
                        {method.isDigital && (
                          <Badge variant="outline">Digital</Badge>
                        )}
                        <Badge variant={method.isActive ? "default" : "secondary"}>
                          {method.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      {method.description && (
                        <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                      )}
                    </div>
                  </div>
                ))}
                {paymentMethods.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay métodos de pago configurados. Cree el primer método.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Gateways Tab */}
        <TabsContent value="gateways" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Stripe</CardTitle>
              <CardDescription>
                Configure la integración con Stripe para pagos online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Estas credenciales son sensibles. Manténgalas seguras y no las comparta.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stripePublic">Clave Pública de Stripe</Label>
                  <Input
                    id="stripePublic"
                    type={showSecrets ? "text" : "password"}
                    value={stripeConfig.publicKey}
                    onChange={(e) => setStripeConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <Label htmlFor="stripeSecret">Clave Secreta de Stripe</Label>
                  <Input
                    id="stripeSecret"
                    type={showSecrets ? "text" : "password"}
                    value={stripeConfig.secretKey}
                    onChange={(e) => setStripeConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                    placeholder="sk_test_..."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="stripeWebhook">Webhook Secret</Label>
                <Input
                  id="stripeWebhook"
                  type={showSecrets ? "text" : "password"}
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
                  placeholder="whsec_..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="stripeEnabled"
                    checked={stripeConfig.enabled}
                    onCheckedChange={(checked) => setStripeConfig(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="stripeEnabled">Habilitar Stripe</Label>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSecrets ? 'Ocultar' : 'Mostrar'} Claves
                </Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveStripeConfig} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}