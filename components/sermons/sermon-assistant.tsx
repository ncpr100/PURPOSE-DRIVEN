
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Save, BookOpen, Lightbulb, Search, Book, Download, GitCompare, FileText, Printer } from 'lucide-react'
import BibleVersionComparison from './bible-version-comparison'
import { sermonDownloadService, SermonData } from '@/lib/services/sermon-download-service'
import { freeBibleService, FREE_BIBLE_VERSIONS } from '@/lib/services/free-bible-service'
import { toast } from 'sonner'

interface SermonAssistantProps {
  onSave?: (sermonData: any) => void
}



export function SermonAssistant({ onSave }: SermonAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [activeTab, setActiveTab] = useState('generator')
  const [sermonSections, setSermonSections] = useState({
    introduction: '',
    biblicalContext: '',
    mainPoints: ['', '', ''],
    conclusion: '',
    outline: ''
  })
  const [formData, setFormData] = useState({
    topic: '',
    scripture: '',
    audience: 'general',
    duration: '30',
    language: 'es',
    title: '',
    bibleVersion: 'RVR1960'
  })



  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error('Por favor ingresa un tema para el sermón')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/sermons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are included
        body: JSON.stringify({
          topic: formData.topic,
          scripture: formData.scripture,
          audience: formData.audience,
          duration: formData.duration,
          language: formData.language,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
        console.error('API Error:', errorData)
        throw new Error(errorData.message || 'Error generando el sermón')
      }

      const data = await response.json()
      if (data.content) {
        setGeneratedContent(data.content)
        
        // Parse sections for enhanced editing
        parseSermonSections(data.content)
        
        // Switch to editing tab after generation
        setActiveTab('editor')
      } else {
        throw new Error('No se recibió contenido válido')
      }
    } catch (error) {
      console.error('Error:', error)
      
      // Fallback: Generate sermon client-side if API fails
      console.log('API failed, using client-side generation fallback')
      try {
        const fallbackSermon = generateClientSideSermon({
          topic: formData.topic,
          scripture: formData.scripture,
          audience: formData.audience,
          duration: formData.duration,
          language: formData.language,
        })
        
        setGeneratedContent(fallbackSermon)
        parseSermonSections(fallbackSermon)
        setActiveTab('editor')
        
        toast.success('Sermón generado exitosamente (modo offline)')
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
        toast.error('Error generando el sermón. Por favor intenta de nuevo.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Client-side sermon generation fallback
  const generateClientSideSermon = ({ topic, scripture, audience, duration, language }: {
    topic: string;
    scripture?: string;
    audience?: string;
    duration?: string;
    language?: string;
  }) => {
    const audienceText = audience ? ` para ${audience}` : ''
    const scriptureText = scripture ? ` basado en ${scripture}` : ''
    const durationText = duration ? ` de ${duration} minutos` : ''
    
    return `# SERMÓN REFORMADO: ${topic.toUpperCase()}
${scriptureText ? `**Texto Base:** ${scripture}` : ''}
**Audiencia:** ${audience || 'Congregación general'}
**Duración:** ${duration || '30'} minutos
**Enfoque:** Teología del Pacto Reformada

---

## 1. INTRODUCCIÓN

**Ilustración de apertura:**
${scripture ? `El pasaje de ${scripture} nos enseña una verdad fundamental sobre` : 'Cuando consideramos el tema de'} ${topic.toLowerCase()}, debemos recordar que estamos viendo este asunto a través del lente de la gracia soberana de Dios. En nuestro contexto actual, muchas personas buscan ${topic.toLowerCase()} de maneras que no honran a Dios.

**Conexión con la vida cotidiana:**
${audienceText} Vivimos en un mundo que constantemente nos desafía en cuanto a ${topic.toLowerCase()}. La perspectiva bíblica nos ofrece no solo entendimiento, sino también esperanza fundada en las promesas del pacto de gracia.

**Propósito del sermón:**
Hoy examinaremos lo que las Escrituras enseñan sobre ${topic.toLowerCase()}, cómo esto se relaciona con el pacto de gracia, y cómo podemos aplicar estas verdades en nuestra vida diaria para la gloria de Dios.

---

## 2. CONTEXTO BÍBLICO Y PACTUAL

**Trasfondo histórico:**
${scripture ? `El pasaje de ${scripture} fue escrito en un contexto específico que` : 'El tema de'} ${topic.toLowerCase()} tiene raíces profundas en la revelación progresiva de Dios. Desde Génesis hasta Apocalipsis, vemos cómo Dios ha trabajado a través de sus pactos para revelar su voluntad concerniente a este tema.

**Ubicación en el pacto de gracia:**
En el marco de la teología del pacto, entendemos que ${topic.toLowerCase()} no es simplemente un concepto aislado, sino que forma parte del gran plan redentor de Dios. Cristo, como mediador del nuevo pacto, cumple perfectamente todo lo que este tema requiere.

**Conexión cristológica:**
${scripture ? `En ${scripture}, vemos` : 'En relación con'} ${topic.toLowerCase()}, Cristo se presenta como nuestro ejemplo perfecto y nuestro salvador suficiente. Él no solo nos muestra cómo vivir en esta área, sino que también nos capacita mediante su Espíritu.

---

## 3. PUNTOS PRINCIPALES

### **PUNTO 1: LA PERSPECTIVA DE DIOS SOBRE ${topic.toUpperCase()}**

**Explicación bíblica:**
Las Escrituras nos enseñan que Dios tiene un diseño perfecto para ${topic.toLowerCase()}. Su voluntad revelada en su Palabra nos muestra no solo lo que debemos hacer, sino también por qué es importante para nuestro crecimiento espiritual y su gloria.

Desde una perspectiva reformada, entendemos que nuestra comprensión de ${topic.toLowerCase()} debe estar fundamentada en la autoridad de las Escrituras (Sola Scriptura) y aplicada por la gracia de Dios (Sola Gratia).

**Aplicación práctica:**
En la vida diaria, esto significa que nuestras decisiones concernientes a ${topic.toLowerCase()} deben ser guiadas por principios bíblicos, no por la sabiduría mundana o nuestros propios sentimientos.

**Ilustración:**
Piense en un navegador GPS que nos guía por el camino correcto. De la misma manera, la Palabra de Dios actúa como nuestro GPS espiritual en el área de ${topic.toLowerCase()}.

### **PUNTO 2: NUESTRA RESPUESTA COMO PUEBLO DEL PACTO**

**Explicación bíblica:**
Como creyentes que han sido incluidos en el pacto de gracia, tenemos tanto el privilegio como la responsabilidad de responder correctamente a las enseñanzas de Dios sobre ${topic.toLowerCase()}. Esta respuesta fluye de corazones regenerados por el Espíritu Santo.

La santificación progresiva significa que crecemos gradualmente en nuestro entendimiento y aplicación de ${topic.toLowerCase()} a medida que el Espíritu Santo obra en nosotros.

**Aplicación práctica:**
Esto requiere disciplinas espirituales como la oración, el estudio bíblico, la comunión fraternal, y la obediencia práctica en las áreas donde Dios nos ha dado luz.

**Ilustración:**
Como un músculo que se fortalece con el ejercicio constante, nuestra capacidad para honrar a Dios en ${topic.toLowerCase()} se desarrolla con la práctica fiel y dependencia del Espíritu Santo.

### **PUNTO 3: LA GLORIA DE DIOS COMO META FINAL**

**Explicación bíblica:**
El propósito último de toda enseñanza bíblica, incluyendo lo que aprendemos sobre ${topic.toLowerCase()}, es la gloria de Dios (Soli Deo Gloria). Nuestra obediencia en esta área no es principalmente para nuestro beneficio, sino para demostrar la grandeza y bondad de nuestro Dios.

Cuando vivimos según los principios bíblicos relacionados con ${topic.toLowerCase()}, estamos declarando al mundo que Dios es digno de confianza y que sus caminos son perfectos.

**Aplicación práctica:**
Pregúntese: "¿Cómo puedo honrar a Dios en mi manejo de ${topic.toLowerCase()}?" Esta pregunta debe guiar nuestras decisiones y acciones en esta área.

**Ilustración:**
Como un espejo que refleja la luz del sol, nuestras vidas deben reflejar la gloria de Dios en cada aspecto, incluyendo ${topic.toLowerCase()}.

---

## 4. CONCLUSIÓN REFORMADA

**Resumen dentro del marco del pacto:**
Hemos visto que ${topic.toLowerCase()} no es un tema periférico en la vida cristiana, sino que está íntimamente conectado con el pacto de gracia y la obra redentora de Cristo. Dios ha provisto todo lo que necesitamos para vivir de manera que le agrade en esta área.

**Exaltación de la gracia soberana:**
Recordemos que cualquier progreso que hagamos en ${topic.toLowerCase()} es resultado de la gracia de Dios operando en nosotros. No dependemos de nuestras propias fuerzas, sino del poder del Espíritu Santo que habita en nosotros.

**Llamado a la fe y obediencia:**
Por tanto, comprometámonos a buscar la voluntad de Dios en ${topic.toLowerCase()} con renovada determinación. Que nuestra obediencia fluya de corazones agradecidos por lo que Cristo ha hecho por nosotros.

**Aplicación práctica de la santificación:**
Esta semana, identifique una manera específica en que puede aplicar lo que hemos aprendido sobre ${topic.toLowerCase()}. Ore pidiendo la ayuda del Espíritu Santo y busque la responsabilidad de hermanos en la fe.

**Oración pastoral final:**
*"Padre celestial, te agradecemos por tu Palabra que nos guía en todas las áreas de la vida, incluyendo ${topic.toLowerCase()}. Ayúdanos a vivir de manera que te honre y glorifique tu nombre. Que el Espíritu Santo nos capacite para ser fieles en esta área para tu gloria y el bien de otros. En el nombre de Jesús, Amén."*

---

## 5. ESQUEMA ESTRUCTURAL

**Tema Central:** ${topic}
${scripture ? `**Texto Principal:** ${scripture}` : ''}

**Puntos Principales:**
1. La Perspectiva de Dios sobre ${topic}
2. Nuestra Respuesta como Pueblo del Pacto  
3. La Gloria de Dios como Meta Final

**Aplicación Clave:** Vivir ${topic.toLowerCase()} de manera que honre a Dios y refleje nuestra identidad como pueblo del pacto de gracia.

**Enfoque Teológico:** Sola Scriptura • Sola Gratia • Sola Fide • Solus Christus • Soli Deo Gloria

---

*Este sermón ha sido estructurado según principios de Teología del Pacto Reformada${durationText ? ` para una duración aproximada${durationText}` : ''}. Se recomienda adaptar los ejemplos y aplicaciones según el contexto específico de la congregación.*`
  }

  const parseSermonSections = (content: string) => {
    // Enhanced parsing for better section detection
    const sections = {
      introduction: '',
      biblicalContext: '',
      mainPoints: ['', '', ''],
      conclusion: '',
      outline: ''
    }
    
    // Extract different sections based on common patterns
    const introMatch = content.match(/INTRODUCCIÓN[\s\S]*?(?=CONTEXTO|PUNTOS|CONCLUSIÓN|$)/i)
    if (introMatch) sections.introduction = introMatch[0].replace(/INTRODUCCIÓN\s*/i, '').trim()
    
    const contextMatch = content.match(/CONTEXTO[\s\S]*?(?=PUNTOS|CONCLUSIÓN|ESQUEMA|$)/i)
    if (contextMatch) sections.biblicalContext = contextMatch[0].replace(/CONTEXTO[^:]*:?\s*/i, '').trim()
    
    const conclusionMatch = content.match(/CONCLUSIÓN[\s\S]*?(?=ESQUEMA|$)/i)
    if (conclusionMatch) sections.conclusion = conclusionMatch[0].replace(/CONCLUSIÓN[^:]*:?\s*/i, '').trim()
    
    const outlineMatch = content.match(/ESQUEMA[\s\S]*$/i)
    if (outlineMatch) sections.outline = outlineMatch[0].replace(/ESQUEMA[^:]*:?\s*/i, '').trim()
    
    // Extract main points (enhanced)
    const pointsMatch = content.match(/PUNTOS PRINCIPALES[\s\S]*?(?=CONCLUSIÓN|ESQUEMA|$)/i)
    if (pointsMatch) {
      const pointsContent = pointsMatch[0].replace(/PUNTOS PRINCIPALES\s*/i, '')
      // Match numbered points with their content
      const pointMatches = pointsContent.match(/\d+\.\s+[^\n]+(?:\n(?!\d+\.)[^\n]*)*(?=\n\d+\.|\nCONCLUSIÓN|\nESQUEMA|$)/gi)
      if (pointMatches) {
        pointMatches.forEach((point, index) => {
          if (index < 3) {
            sections.mainPoints[index] = point.trim()
          }
        })
      }
    }
    
    setSermonSections(sections)
  }

  const reconstructSermon = () => {
    let reconstructed = ''
    
    if (sermonSections.introduction) {
      reconstructed += `INTRODUCCIÓN\n\n${sermonSections.introduction}\n\n`
    }
    
    if (sermonSections.biblicalContext) {
      reconstructed += `CONTEXTO BÍBLICO Y PACTUAL\n\n${sermonSections.biblicalContext}\n\n`
    }
    
    reconstructed += `PUNTOS PRINCIPALES\n\n`
    sermonSections.mainPoints.forEach((point, index) => {
      if (point.trim()) {
        reconstructed += `${index + 1}. ${point}\n\n`
      }
    })
    
    if (sermonSections.conclusion) {
      reconstructed += `CONCLUSIÓN REFORMADA\n\n${sermonSections.conclusion}\n\n`
    }
    
    if (sermonSections.outline) {
      reconstructed += `ESQUEMA ESTRUCTURAL\n\n${sermonSections.outline}\n`
    }
    
    return reconstructed
  }

  const updateSection = (section: string, content: string) => {
    setSermonSections(prev => ({
      ...prev,
      [section]: content
    }))
    
    // Update the main content
    setGeneratedContent(reconstructSermon())
  }

  const updateMainPoint = (index: number, content: string) => {
    const newPoints = [...sermonSections.mainPoints]
    newPoints[index] = content
    setSermonSections(prev => ({
      ...prev,
      mainPoints: newPoints
    }))
    
    // Update the main content
    setGeneratedContent(reconstructSermon())
  }

  const handleScriptureSelect = (verse: string) => {
    setFormData(prev => ({ ...prev, scripture: verse }))
  }

  const handleDownload = async (format: 'pdf' | 'word' | 'text' | 'markdown' | 'html') => {
    console.log('🚀 Download button clicked for format:', format)
    
    if (!generatedContent.trim() || !formData.title.trim()) {
      console.log('❌ Validation failed - missing content or title')
      toast.error('Por favor genera un sermón y agrega un título antes de descargar')
      return
    }

    try {
      console.log(`✅ Starting download process for ${format}...`)
      
      const sermonData: SermonData = {
        title: formData.title,
        content: generatedContent,
        date: new Date().toLocaleDateString('es-ES'),
        scripture: formData.scripture,
        topic: formData.topic,
        pastor: 'Pastor',
        church: 'Iglesia'
      }

      console.log('📄 Sermon data prepared:', { title: sermonData.title, contentLength: sermonData.content.length })

      // Simple direct download approach
      switch (format) {
        case 'pdf':
          console.log('📱 Attempting PDF download...')
          await downloadSimplePDF(sermonData)
          break
        case 'word':
          console.log('📝 Attempting Word download...')
          await downloadSimpleWord(sermonData)
          break
        case 'text':
          console.log('📄 Attempting Text download...')
          await downloadSimpleText(sermonData)
          break
        case 'markdown':
          console.log('📋 Attempting Markdown download...')
          await downloadSimpleMarkdown(sermonData)
          break
        case 'html':
          console.log('🌐 Attempting HTML download...')
          await downloadSimpleHTML(sermonData)
          break
      }

      console.log(`✅ ${format} download completed successfully`)
      toast.success(`Sermón descargado exitosamente en formato ${format.toUpperCase()}`)
      
    } catch (error) {
      console.error('❌ Download error:', error)
      toast.error(`Error descargando el sermón en formato ${format.toUpperCase()}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Simple download methods that work directly in browser
  const downloadSimpleText = (sermon: SermonData) => {
    const content = `${sermon.title}\n${'='.repeat(sermon.title.length)}\n\n${sermon.content}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSimpleHTML = (sermon: SermonData) => {
    const html = `<!DOCTYPE html><html><head><title>${sermon.title}</title></head><body><h1>${sermon.title}</h1><pre>${sermon.content}</pre></body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSimpleMarkdown = (sermon: SermonData) => {
    const md = `# ${sermon.title}\n\n${sermon.content}`
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSimpleWord = (sermon: SermonData) => {
    // Simple Word document as HTML with Word headers
    const docContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><title>${sermon.title}</title></head><body><h1>${sermon.title}</h1><p>${sermon.content.replace(/\n/g, '</p><p>')}</p></body></html>`
    const blob = new Blob([docContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_')}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSimplePDF = async (sermon: SermonData) => {
    // For now, fallback to text if jsPDF fails
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      doc.text(sermon.title, 20, 20)
      doc.text(sermon.content, 20, 40, { maxWidth: 170 })
      doc.save(`sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_')}.pdf`)
    } catch (error) {
      console.log('PDF failed, using text fallback')
      downloadSimpleText(sermon)
    }
  }

  const handlePrint = () => {
    if (!generatedContent.trim() || !formData.title.trim()) {
      toast.error('Por favor genera un sermón y agrega un título antes de imprimir')
      return
    }

    try {
      const sermonData: SermonData = {
        title: formData.title,
        content: generatedContent,
        date: new Date().toLocaleDateString('es-ES'),
        scripture: formData.scripture,
        topic: formData.topic,
        pastor: 'Pastor',
        church: 'Iglesia'
      }

      sermonDownloadService.printSermon(sermonData)
      toast.success('Ventana de impresión abierta')
      
    } catch (error) {
      console.error('Error printing sermon:', error)
      toast.error('Error abriendo ventana de impresión')
    }
  }

  const handleSave = async () => {
    console.log('💾 Save button clicked')
    
    if (!generatedContent.trim() || !formData.title.trim()) {
      console.log('❌ Save validation failed - missing content or title')
      toast.error('Por favor genera un sermón y agrega un título antes de guardar')
      return
    }

    try {
      console.log('✅ Starting save process...', formData.title)
      
      // Simple approach - try to save directly without complex authentication
      const sermonData = {
        title: formData.title,
        content: generatedContent,
        scripture: formData.scripture,
        topic: formData.topic,
        date: new Date().toISOString()
      }

      console.log('📄 Attempting to call save API...', sermonData.title)
      
      const response = await fetch('/api/sermons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sermonData),
      })

      console.log('📡 Save API response status:', response.status)

      if (response.status === 401) {
        console.log('🔒 Authentication issue detected')
        toast.error('Error de autenticación. Por favor inicia sesión de nuevo.')
        return
      }

      if (response.status === 403) {
        console.log('🚫 Permission issue detected')
        toast.error('No tienes permisos para guardar sermones.')
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
        console.error('❌ Save API error:', errorData)
        throw new Error(errorData.message || `Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Sermon saved successfully:', data.id || 'success')
      
      toast.success('Sermón guardado exitosamente')
      
      // Clear form after successful save
      setGeneratedContent('')
      setFormData({
        topic: '',
        scripture: '',
        audience: 'general',
        duration: '30',
        language: 'es',
        title: '',
        bibleVersion: 'RVR1960'
      })

      if (onSave) {
        onSave(data)
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      toast.error(`Error guardando el sermón: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Asistente de Sermones Reformado con IA - 100% Gratis
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
              <Lightbulb className="h-3 w-3 mr-1" />
              Teología del Pacto
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
              🆓 APIs Bíblicas Gratuitas
            </Badge>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
              66 Libros • 31,000+ Versículos
            </Badge>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300">
              15+ Versiones Gratuitas
            </Badge>
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
              📄 5 Formatos de Descarga
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generador IA
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Editor & Descarga
              </TabsTrigger>
              <TabsTrigger value="bible-free" className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                Herramientas Bíblicas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topic">Tema del Sermón *</Label>
                    <Input
                      id="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="Ej: La gracia soberana de Dios"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="scripture">Pasaje Bíblico</Label>
                    <div className="flex gap-2">
                      <Input
                        id="scripture"
                        value={formData.scripture}
                        onChange={(e) => setFormData(prev => ({ ...prev, scripture: e.target.value }))}
                        placeholder="Ej: Juan 3:16, 1 thessalonians 5:23-24"
                        className="flex-1"
                      />

                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="bibleVersion">Versión Bíblica</Label>
                    <Select value={formData.bibleVersion} onValueChange={(value) => setFormData(prev => ({ ...prev, bibleVersion: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {FREE_BIBLE_VERSIONS.filter((v: any) => v.language === formData.language).map((version: any) => (
                          <SelectItem key={version.id} value={version.id}>
                            {version.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="audience">Audiencia</Label>
                    <Select value={formData.audience} onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar audiencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Congregación General</SelectItem>
                        <SelectItem value="jovenes">Jóvenes</SelectItem>
                        <SelectItem value="adultos">Adultos</SelectItem>
                        <SelectItem value="nuevos-creyentes">Nuevos Creyentes</SelectItem>
                        <SelectItem value="matrimonios">Matrimonios</SelectItem>
                        <SelectItem value="liderazgo">Liderazgo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duración</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="20">20 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !formData.topic.trim()}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Generando Sermón Reformado...' : 'Generar Sermón con IA'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-6">
              {generatedContent ? (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Título del Sermón *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ingresa un título poderoso para tu sermón"
                      className="text-lg font-semibold"
                    />
                  </div>

                  <Tabs defaultValue="sections" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="sections">Edición por Secciones</TabsTrigger>
                      <TabsTrigger value="full">Texto Completo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sections" className="space-y-4">
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Introducción</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={sermonSections.introduction}
                              onChange={(e) => updateSection('introduction', e.target.value)}
                              placeholder="Captura la atención, conecta con la vida cotidiana..."
                              rows={4}
                            />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Contexto Bíblico y Pactual</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={sermonSections.biblicalContext}
                              onChange={(e) => updateSection('biblicalContext', e.target.value)}
                              placeholder="Trasfondo histórico, ubicación en el pacto de gracia..."
                              rows={5}
                            />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Puntos Principales</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {sermonSections.mainPoints.map((point, index) => (
                              <div key={index}>
                                <Label>Punto {index + 1}</Label>
                                <Textarea
                                  value={point}
                                  onChange={(e) => updateMainPoint(index, e.target.value)}
                                  placeholder={`Desarrolla tu punto principal ${index + 1}...`}
                                  rows={4}
                                />
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Conclusión Reformada</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={sermonSections.conclusion}
                              onChange={(e) => updateSection('conclusion', e.target.value)}
                              placeholder="Exalta la gracia soberana, llamado a la fe y obediencia..."
                              rows={4}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="full">
                      <div>
                        <Label>Contenido Completo</Label>
                        <Textarea
                          value={generatedContent}
                          onChange={(e) => setGeneratedContent(e.target.value)}
                          rows={20}
                          className="font-mono text-sm mt-2"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex flex-wrap gap-4">
                    <Button onClick={handleSave} size="lg">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Sermón
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDownload('pdf')} 
                        variant="outline"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                      <Button 
                        onClick={() => handleDownload('word')} 
                        variant="outline"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Word
                      </Button>
                      <Button 
                        onClick={() => handleDownload('html')} 
                        variant="outline"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar HTML
                      </Button>
                      <Button 
                        onClick={() => handleDownload('text')} 
                        variant="outline"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Texto
                      </Button>
                      <Button 
                        onClick={() => handleDownload('markdown')} 
                        variant="outline"
                        size="lg"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Descargar Markdown
                      </Button>
                      <Button 
                        onClick={handlePrint} 
                        variant="outline"
                        size="lg"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay sermón para editar</h3>
                  <p className="text-muted-foreground mb-4">
                                        Genera un sermón primero usando la pestaña &quot;Generador IA&quot;
                  </p>
                  <Button onClick={() => setActiveTab('generator')}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ir al Generador
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bible-free" className="space-y-6">
              <div className="space-y-6">
                {/* Free Bible Version Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitCompare className="h-5 w-5" />
                      Comparación de Versiones Bíblicas - 100% Gratuito
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-300">
                        🆓 100% Gratis
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                        15+ Versiones
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        Referencias Cruzadas IA
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
                        Sin Límites
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BibleVersionComparison />
                  </CardContent>
                </Card>

                {/* Feature Overview */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="py-6">
                    <div className="text-center mb-6">
                      <GitCompare className="h-12 w-12 mx-auto text-green-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-green-800">Herramientas Bíblicas Completamente Gratuitas</h3>
                      <p className="text-green-600">
                        Todo lo que necesitas para preparar sermones poderosos, sin costo alguno
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2">
                          ✅ Características Incluidas
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            <span>15+ versiones bíblicas gratuitas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            <span>Comparación lado a lado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            <span>Referencias cruzadas con IA</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            <span>Búsqueda por temas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            <span>Sin límites de uso</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            <span>66 libros bíblicos completos</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                          🔄 APIs Gratuitas
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>Bible-API.com</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>GetBible.net</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>ESV API (5000/día gratis)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>Bible Gateway público</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>Múltiples fuentes respaldo</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                          📚 Versiones Disponibles
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            <span>Reina-Valera 1960</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            <span>Nueva Versión Internacional</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            <span>Traducción en Lenguaje Actual</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            <span>King James Version</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            <span>English Standard Version</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            <span>+ 10 versiones más</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                      <div className="text-center">
                        <p className="text-sm text-green-700 mb-2">
                          <strong>🎯 RESULTADO:</strong> Herramientas 100% gratuitas que eliminan la necesidad de suscripciones premium
                        </p>
                        <p className="text-xs text-green-600">
                          Usa estas herramientas para encontrar versículos, compararlos y obtener referencias. 
                          Los resultados se copian directamente al generador de sermones.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>



          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
