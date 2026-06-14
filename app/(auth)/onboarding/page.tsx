"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, Crown, Sprout, Wheat, Network, Sparkles } from "lucide-react";
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    churchName: "", country: "", adminName: "", adminEmail: "", plan: "cosecha",
    campuses: "", members: "", needs: ""
  });
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (formData.plan === "gloria") {
        const res = await fetch("/api/onboarding/gloria-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Error");
        alert("Solicitud Gloria enviada! Nuestro equipo te contactara en 24h.");
        window.location.href = "/";
      } else {
        const res = await fetch("/api/onboarding/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Error");
        const data = await res.json();
        window.location.href = data.paddleCheckoutUrl;
      }
    } catch (error) {
      alert("Hubo un error. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  const plans = [
    { id: "semilla", name: "Semilla", price: "$49/mes", desc: "Hasta 150 miembros", color: "green", icon: Sprout },
    { id: "cosecha", name: "Cosecha", price: "$149/mes", desc: "Hasta 500 miembros", color: "blue", icon: Wheat },
    { id: "reino", name: "Reino", price: "$299/mes", desc: "Hasta 1,500 miembros", color: "purple", icon: Crown },
    { id: "red", name: "Red", price: "$94.90/igl", desc: "Para redes y denominaciones", color: "orange", icon: Network },
    { id: "gloria", name: "Gloria", price: "A cotizar", desc: "1,500+ miembros - Multi-campus", color: "yellow", icon: Sparkles },
  ];
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de Iglesia - Khesed-Tek</CardTitle>
          <CardDescription>Paso {step} de 3: {step === 1 ? "Datos de la Iglesia" : step === 2 ? "Datos del Administrador" : "Seleccion de Plan"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2"><Label>Nombre de la Iglesia</Label><Input value={formData.churchName} onChange={(e) => setFormData({...formData, churchName: e.target.value})} placeholder="Ej: Iglesia Bautista Esperanza" required /></div>
              <div className="space-y-2">
                <Label>Pais</Label>
                <Select value={formData.country} onValueChange={(v) => setFormData({...formData, country: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecciona tu pais" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AR">Argentina</SelectItem><SelectItem value="BR">Brasil</SelectItem><SelectItem value="CL">Chile</SelectItem><SelectItem value="CO">Colombia</SelectItem><SelectItem value="CR">Costa Rica</SelectItem><SelectItem value="EC">Ecuador</SelectItem><SelectItem value="SV">El Salvador</SelectItem><SelectItem value="GT">Guatemala</SelectItem><SelectItem value="MX">Mexico</SelectItem><SelectItem value="PA">Panama</SelectItem><SelectItem value="PY">Paraguay</SelectItem><SelectItem value="PE">Peru</SelectItem><SelectItem value="US">Estados Unidos</SelectItem><SelectItem value="UY">Uruguay</SelectItem><SelectItem value="VE">Venezuela</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800"><p><strong>Nota:</strong> El idioma se detectara automaticamente (BR→pt, US→en, resto→es).</p></div>
              <Button className="w-full" onClick={handleNext} disabled={!formData.churchName || !formData.country}>Siguiente</Button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-2"><Label>Nombre del Administrador</Label><Input value={formData.adminName} onChange={(e) => setFormData({...formData, adminName: e.target.value})} placeholder="Nombre completo" required /></div>
              <div className="space-y-2"><Label>Correo Electronico</Label><Input type="email" value={formData.adminEmail} onChange={(e) => setFormData({...formData, adminEmail: e.target.value})} placeholder="admin@iglesia.com" required /></div>
              <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={handleBack}>Atras</Button><Button className="flex-1" onClick={handleNext} disabled={!formData.adminName || !formData.adminEmail}>Siguiente</Button></div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <div key={plan.id} className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${formData.plan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setFormData({...formData, plan: plan.id})}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-6 w-6 text-${plan.color}-600`} />
                          <div>
                            <h3 className="font-semibold">{plan.name}</h3>
                            <p className="text-lg font-bold">{plan.price}</p>
                            <p className="text-xs text-gray-600">{plan.desc}</p>
                          </div>
                        </div>
                        {formData.plan === plan.id && <Check className="h-5 w-5 text-blue-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              {formData.plan === "gloria" && (
                <div className="space-y-3 mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold flex items-center gap-2"><Crown className="h-4 w-4" /> Informacion para Plan Gloria</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Numero de Campus/Sedes</Label><Input type="number" value={formData.campuses} onChange={(e) => setFormData({...formData, campuses: e.target.value})} placeholder="Ej: 5" /></div>
                    <div><Label>Total de Miembros Estimados</Label><Input type="number" value={formData.members} onChange={(e) => setFormData({...formData, members: e.target.value})} placeholder="Ej: 3000" /></div>
                  </div>
                  <div><Label>Necesidades Especiales (API, SSO, Multi-tenant)</Label><Textarea value={formData.needs} onChange={(e) => setFormData({...formData, needs: e.target.value})} placeholder="Describe tus requerimientos..." /></div>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={handleBack}>Atras</Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (formData.plan === "gloria" ? "Solicitar Cotizacion" : "Registrarse y Pagar")}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}