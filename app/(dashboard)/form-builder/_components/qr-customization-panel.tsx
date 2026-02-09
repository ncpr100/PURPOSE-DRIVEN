'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QrCode, Palette, ImageIcon, Upload, X, Download, Copy, Loader2, Settings, AlertTriangle } from 'lucide-react'
import type { QRConfig } from './form-types'

interface QRCustomizationPanelProps {
  qrConfig: QRConfig
  setQRConfig: React.Dispatch<React.SetStateAction<QRConfig>>
  qrCodeUrl: string
  isGenerating: boolean
  onGenerate: () => void
  onCopyUrl: () => void
  onImageUpload: (file: File, type: 'qr-logo' | 'qr-background') => void
  formUrl: string
  formTitle: string
}

export default function QRCustomizationPanel({
  qrConfig,
  setQRConfig,
  qrCodeUrl,
  isGenerating,
  onGenerate,
  onCopyUrl,
  onImageUpload,
  formUrl,
  formTitle
}: QRCustomizationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-purple-600" />
          Personalización Avanzada del QR
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="colors">Colores</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          {/* BASIC TAB */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tamaño (px)</Label>
                <Input
                  type="number"
                  min="200"
                  max="800"
                  value={qrConfig.size}
                  onChange={(e) => setQRConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Margen</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={qrConfig.margin}
                  onChange={(e) => setQRConfig(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estilo de Puntos</Label>
                <Select
                  value={qrConfig.dotType}
                  onValueChange={(value: any) => setQRConfig(prev => ({ ...prev, dotType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Cuadrado Clásico</SelectItem>
                    <SelectItem value="rounded">Redondeado Moderno</SelectItem>
                    <SelectItem value="dots">Puntos Circulares</SelectItem>
                    <SelectItem value="classy">Elegante (Diamante)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estilo de Esquinas</Label>
                <Select
                  value={qrConfig.cornerType}
                  onValueChange={(value: any) => setQRConfig(prev => ({ ...prev, cornerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Cuadrado</SelectItem>
                    <SelectItem value="rounded">Redondeado</SelectItem>
                    <SelectItem value="circle">Círculo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* COLORS TAB */}
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-blue-600" />
                  Fondo del QR
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={qrConfig.backgroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={qrConfig.backgroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gray-800" />
                  Color Principal QR
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={qrConfig.foregroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={qrConfig.foregroundColor}
                    onChange={(e) => setQRConfig(prev => ({ ...prev, foregroundColor: e.target.value }))}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Usar Gradiente</Label>
                <input
                  type="checkbox"
                  checked={qrConfig.useGradient}
                  onChange={(e) => setQRConfig(prev => ({ ...prev, useGradient: e.target.checked }))}
                  className="w-4 h-4"
                />
              </div>

              {qrConfig.useGradient && (
                <>
                  <div>
                    <Label>Tipo de Gradiente</Label>
                    <Select
                      value={qrConfig.gradientType}
                      onValueChange={(value: any) => setQRConfig(prev => ({ ...prev, gradientType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Lineal</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {qrConfig.gradientColors.map((color, index) => (
                      <div key={index}>
                        <Label>Color {index + 1}</Label>
                        <Input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...qrConfig.gradientColors]
                            newColors[index] = e.target.value
                            setQRConfig(prev => ({ ...prev, gradientColors: newColors }))
                          }}
                          className="h-10"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Color Borde Esquinas</Label>
                <Input
                  type="color"
                  value={qrConfig.eyeBorderColor}
                  onChange={(e) => setQRConfig(prev => ({ ...prev, eyeBorderColor: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div>
                <Label>Color Centro Esquinas</Label>
                <Input
                  type="color"
                  value={qrConfig.eyeColor}
                  onChange={(e) => setQRConfig(prev => ({ ...prev, eyeColor: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>
          </TabsContent>

          {/* LOGO TAB */}
          <TabsContent value="logo" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <Label htmlFor="qr-logo-upload" className="cursor-pointer">
                <div className="text-sm text-gray-600 mb-2">
                  {qrConfig.logoImage ? 'Logo cargado - Haz clic para cambiar' : 'Arrastra o haz clic para subir logo'}
                </div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Logo
                </Button>
              </Label>
              <input
                id="qr-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onImageUpload(file, 'qr-logo')
                }}
              />
              {qrConfig.logoImage && (
                <div className="mt-3">
                  <img src={qrConfig.logoImage} alt="Logo" className="max-w-[100px] mx-auto rounded" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQRConfig(prev => ({ ...prev, logoImage: undefined }))}
                    className="mt-2 text-red-600"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>

            {qrConfig.logoImage && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tamaño Logo (%)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="30"
                      value={qrConfig.logoSize}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))}
                    />
                    {qrConfig.logoSize > 25 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        &gt;25% puede afectar el escaneo
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Opacidad Logo (%)</Label>
                    <Input
                      type="number"
                      min="50"
                      max="100"
                      value={qrConfig.logoOpacity}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, logoOpacity: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Forma del Logo</Label>
                    <Select
                      value={qrConfig.logoShape}
                      onValueChange={(value: any) => setQRConfig(prev => ({ ...prev, logoShape: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Círculo</SelectItem>
                        <SelectItem value="square">Cuadrado</SelectItem>
                        <SelectItem value="rounded">Cuadrado Redondeado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Margen (px)</Label>
                    <Input
                      type="number"
                      min="5"
                      max="25"
                      value={qrConfig.logoMargin}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, logoMargin: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Fondo del Logo
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={qrConfig.logoBackgroundColor}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, logoBackgroundColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={qrConfig.logoBackgroundOpacity}
                      onChange={(e) => setQRConfig(prev => ({ ...prev, logoBackgroundOpacity: parseInt(e.target.value) }))}
                      placeholder="Opacidad %"
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* ADVANCED TAB */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <Label htmlFor="qr-background-upload" className="cursor-pointer">
                <div className="text-sm text-gray-600 mb-2">
                  {qrConfig.backgroundImage ? 'Fondo cargado' : 'Subir imagen de fondo'}
                </div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Fondo
                </Button>
              </Label>
              <input
                id="qr-background-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onImageUpload(file, 'qr-background')
                }}
              />
              {qrConfig.backgroundImage && (
                <div className="mt-3">
                  <img src={qrConfig.backgroundImage} alt="Fondo" className="max-w-[150px] mx-auto rounded" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQRConfig(prev => ({ ...prev, backgroundImage: undefined, useBackgroundImage: false }))}
                    className="mt-2 text-red-600"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>

            {qrConfig.backgroundImage && (
              <div>
                <Label>Opacidad del Fondo (%)</Label>
                <Input
                  type="number"
                  min="10"
                  max="100"
                  value={qrConfig.backgroundOpacity}
                  onChange={(e) => setQRConfig(prev => ({ ...prev, backgroundOpacity: parseInt(e.target.value) }))}
                />
              </div>
            )}

            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Tip Profesional:</strong> Usa opacidad baja (20-40%) para fondos de marca sin comprometer el escaneo del QR.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        {/* QR GENERATION CONTROLS */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={onGenerate} disabled={isGenerating} className="col-span-2">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <QrCode className="h-4 w-4 mr-2" />}
            Generar QR Personalizado
          </Button>
          <Button onClick={onCopyUrl} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copiar URL
          </Button>
          {qrCodeUrl && (
            <Button
              onClick={() => {
                const link = document.createElement('a')
                link.download = `qr-${formTitle.toLowerCase().replace(/\s+/g, '-')}.png`
                link.href = qrCodeUrl
                link.click()
              }}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          )}
        </div>

        {/* QR PREVIEW */}
        {qrCodeUrl && (
          <div className="flex justify-center p-6 bg-gray-50 rounded-lg mt-4">
            <img src={qrCodeUrl} alt="QR Code" className="border-4 border-white rounded-lg shadow-lg" style={{ width: `${Math.min(qrConfig.size, 300)}px` }} />
          </div>
        )}

        <Alert className="mt-4">
          <AlertDescription>
            <strong>URL del formulario:</strong><br />
            <code className="text-xs break-all">{formUrl}</code>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
