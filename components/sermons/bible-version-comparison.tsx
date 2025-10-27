"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Copy, BookOpen, Zap, Eye, EyeOff } from 'lucide-react'
import { freeBibleService, BibleVerse, FREE_BIBLE_VERSIONS } from '@/lib/bible-service'
import { toast } from 'sonner'

interface ComparisonResult {
  reference: string
  verses: BibleVerse[]
  crossReferences: string[]
  loading: boolean
  error?: string
}

export default function BibleVersionComparison() {
  const [searchReference, setSearchReference] = useState('')
  const [selectedVersions, setSelectedVersions] = useState<string[]>(['RVR1960', 'NVI', 'TLA'])
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [crossReferences, setCrossReferences] = useState<string[]>([])
  const [showDifferences, setShowDifferences] = useState(true)
  const [topic, setTopic] = useState('')

  // Available languages for filtering
  const languages = [...new Set(FREE_BIBLE_VERSIONS.map(v => v.language))]
  const [selectedLanguage, setSelectedLanguage] = useState('es')

  // Filter versions by selected language
  const filteredVersions = FREE_BIBLE_VERSIONS.filter(v => v.language === selectedLanguage)

  /**
   * Search and compare Bible versions
   */
  const handleSearch = async () => {
    if (!searchReference.trim()) {
      toast.error('Por favor ingresa una referencia bíblica')
      return
    }

    if (selectedVersions.length === 0) {
      toast.error('Selecciona al menos una versión para comparar')
      return
    }

    setComparisonResult({
      reference: searchReference,
      verses: [],
      crossReferences: [],
      loading: true
    })

    try {
      // Get verses from selected versions
      const verses = await freeBibleService.compareVersions(searchReference, selectedVersions)
      
      // Get cross-references
      const crossRefs = await freeBibleService.getCrossReferences(searchReference, topic)
      
      setComparisonResult({
        reference: searchReference,
        verses,
        crossReferences: crossRefs,
        loading: false
      })

      setCrossReferences(crossRefs)
      
      if (verses.length === 0) {
        toast.warning('No se encontraron versículos para esta referencia')
      } else {
        toast.success(`Se encontraron ${verses.length} versiones`)
      }
      
    } catch (error) {
      console.error('Search error:', error)
      setComparisonResult({
        reference: searchReference,
        verses: [],
        crossReferences: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      })
      toast.error('Error al buscar el versículo')
    }
  }

  /**
   * Add/remove version from comparison
   */
  const toggleVersion = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(v => v !== versionId)
      } else {
        return [...prev, versionId]
      }
    })
  }

  /**
   * Copy verse text to clipboard
   */
  const copyVerse = (verse: BibleVerse) => {
    const text = `${verse.reference} (${verse.version})\n${verse.text}`
    navigator.clipboard.writeText(text)
    toast.success('Versículo copiado al portapapeles')
  }

  /**
   * Highlight differences between versions (simplified)
   */
  const highlightDifferences = (text: string, allTexts: string[]): React.ReactNode => {
    if (!showDifferences || allTexts.length < 2) {
      return text
    }

    // Simple word-based difference highlighting
    const words = text.split(' ')
    const otherWords = allTexts.filter(t => t !== text).flatMap(t => t.split(' '))
    
    return (
      <span>
        {words.map((word, index) => {
          const isUnique = !otherWords.some(otherword => 
            otherword.toLowerCase().replace(/[^\w]/g, '') === word.toLowerCase().replace(/[^\w]/g, '')
          )
          
          return (
            <span
              key={index}
              className={isUnique ? 'bg-yellow-200 px-1 rounded' : ''}
              title={isUnique ? 'Palabra única en esta versión' : undefined}
            >
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </span>
    )
  }

  /**
   * Search cross-reference
   */
  const searchCrossReference = (reference: string) => {
    setSearchReference(reference)
    handleSearch()
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Comparación de Versiones Bíblicas
          </CardTitle>
          <CardDescription>
            Compara diferentes versiones de la Biblia y encuentra referencias cruzadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reference Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Referencia Bíblica</Label>
              <Input
                id="reference"
                placeholder="ej: Juan 3:16, Romanos 8:28"
                value={searchReference}
                onChange={(e) => setSearchReference(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Tema (opcional)</Label>
              <Input
                id="topic"
                placeholder="ej: amor, fe, esperanza"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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

          {/* Version Selection */}
          <div className="space-y-2">
            <Label>Versiones a Comparar</Label>
            <div className="flex flex-wrap gap-2">
              {filteredVersions.map((version) => (
                <Badge
                  key={version.id}
                  variant={selectedVersions.includes(version.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleVersion(version.id)}
                >
                  {version.name}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedVersions.length} versiones seleccionadas
            </p>
          </div>

          {/* Search Button */}
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={comparisonResult?.loading}>
              <Search className="h-4 w-4 mr-2" />
              {comparisonResult?.loading ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDifferences(!showDifferences)}
            >
              {showDifferences ? (
                <><EyeOff className="h-4 w-4 mr-2" /> Ocultar Diferencias</>
              ) : (
                <><Eye className="h-4 w-4 mr-2" /> Mostrar Diferencias</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {comparisonResult && (
        <Tabs defaultValue="comparison" className="space-y-4">
          <TabsList>
            <TabsTrigger value="comparison">
              Comparación ({comparisonResult.verses.length})
            </TabsTrigger>
            <TabsTrigger value="crossrefs">
              Referencias Cruzadas ({comparisonResult.crossReferences.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            {comparisonResult.loading ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p>Buscando versículos...</p>
                  </div>
                </CardContent>
              </Card>
            ) : comparisonResult.error ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-red-600">
                    <p>Error: {comparisonResult.error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : comparisonResult.verses.length > 0 ? (
              <div className="grid gap-4">
                {comparisonResult.verses.map((verse, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {verse.version} - {verse.reference}
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyVerse(verse)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-base leading-relaxed">
                        {showDifferences ? 
                          highlightDifferences(
                            verse.text, 
                            comparisonResult.verses.map(v => v.text)
                          ) : 
                          verse.text
                        }
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <p>No se encontraron versículos para "{comparisonResult.reference}"</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="crossrefs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Referencias Cruzadas
                </CardTitle>
                <CardDescription>
                  Versículos relacionados con {comparisonResult.reference}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {crossReferences.map((ref, index) => (
                      <div key={index}>
                        <Button
                          variant="ghost"
                          className="justify-start w-full text-left"
                          onClick={() => searchCrossReference(ref)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          {ref}
                        </Button>
                        {index < crossReferences.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-medium text-foreground">Instrucciones de uso:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Ingresa una referencia bíblica (ej: "Juan 3:16", "1 Corintios 13:4-7")</li>
              <li>Selecciona las versiones que deseas comparar haciendo clic en las etiquetas</li>
              <li>Opcionalmente añade un tema para obtener referencias cruzadas más precisas</li>
              <li>Las diferencias entre versiones se resaltan en amarillo cuando está activado</li>
              <li>Haz clic en las referencias cruzadas para buscarlas automáticamente</li>
              <li>Usa el botón "Copiar" para copiar cualquier versículo al portapapeles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}