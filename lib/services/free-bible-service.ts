// Free Bible API Service - No subscriptions needed!
// Uses multiple free Bible APIs to provide comprehensive Bible features

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
  version: string
  reference: string
}

interface BibleBook {
  id: string
  name: string
  chapters: number
}

interface SearchResult {
  reference: string
  text: string
  version: string
}

class FreeBibleService {
  private readonly APIs = {
    // Bible.com API (Free)
    BIBLE_COM: 'https://www.bible.com/bible',
    // Bible Gateway API (Free tier)
    BIBLE_GATEWAY: 'https://www.biblegateway.com/versions',
    // Crossway ESV API (Free tier)
    ESV_API: 'https://api.esv.org/v3',
    // Bible API (Open source)
    BIBLE_API: 'https://bible-api.com',
    // GetBible API (Free)
    GET_BIBLE: 'https://getbible.net/json',
    // Bible Web Service (Free)
    BWS_API: 'https://www.biblestudytools.com/api'
  }

  private readonly VERSIONS = {
    'RVR1960': 'Reina Valera 1960',
    'RVA2015': 'Reina Valera Actualizada 2015',
    'NVI': 'Nueva Versión Internacional',
    'NTV': 'Nueva Traducción Viviente',
    'TLA': 'Traducción en Lenguaje Actual',
    'DHH': 'Dios Habla Hoy',
    'LBLA': 'La Biblia de Las Américas',
    'PDT': 'Palabra de Dios para Todos',
    'ESV': 'English Standard Version',
    'NIV': 'New International Version',
    'NASB': 'New American Standard Bible',
    'KJV': 'King James Version',
    'NLT': 'New Living Translation',
    'CSB': 'Christian Standard Bible',
    'NKJV': 'New King James Version'
  }

  // Get verse text using free Bible API
  async getVerse(reference: string, version: string = 'RVR1960'): Promise<BibleVerse | null> {
    try {
      // Try Bible-API first (completely free, no rate limits)
      const response = await fetch(`https://bible-api.com/${reference}?translation=${version.toLowerCase()}`)
      
      if (response.ok) {
        const data = await response.json()
        return {
          book: data.reference.split(' ')[0],
          chapter: parseInt(data.reference.match(/\d+/)[0]),
          verse: parseInt(data.reference.match(/:(\d+)/)?.[1] || '1'),
          text: data.text.trim(),
          version: version,
          reference: data.reference
        }
      }

      // Fallback to GetBible API
      return this.getVerseFromGetBible(reference, version)
    } catch (error) {
      console.error('Error fetching verse:', error)
      return null
    }
  }

  private async getVerseFromGetBible(reference: string, version: string): Promise<BibleVerse | null> {
    try {
      const cleanRef = reference.replace(/\s+/g, '')
      const response = await fetch(`https://getbible.net/json?passage=${cleanRef}&version=${version}`)
      
      if (response.ok) {
        const data = await response.json()
        const bookKey = Object.keys(data.book)[0]
        const chapterKey = Object.keys(data.book[bookKey].chapter)[0]
        const verse = Object.values(data.book[bookKey].chapter[chapterKey].verse)[0] as any

        return {
          book: data.book[bookKey].book_name,
          chapter: parseInt(chapterKey),
          verse: verse.verse_nr,
          text: verse.verse,
          version: version,
          reference: `${data.book[bookKey].book_name} ${chapterKey}:${verse.verse_nr}`
        }
      }
    } catch (error) {
      console.error('GetBible API error:', error)
    }
    return null
  }

  // Search verses by keyword
  async searchVerses(query: string, version: string = 'RVR1960', limit: number = 20): Promise<SearchResult[]> {
    try {
      // Use Bible-API search endpoint
      const response = await fetch(`https://bible-api.com/search/${encodeURIComponent(query)}?translation=${version.toLowerCase()}&limit=${limit}`)
      
      if (response.ok) {
        const data = await response.json()
        return data.results?.map((result: any) => ({
          reference: result.reference,
          text: result.text.trim(),
          version: version
        })) || []
      }

      // Fallback search implementation
      return this.fallbackSearch(query, version, limit)
    } catch (error) {
      console.error('Error searching verses:', error)
      return []
    }
  }

  private async fallbackSearch(query: string, version: string, limit: number): Promise<SearchResult[]> {
    // Implement a simple search using common Bible passages
    const commonPassages = [
      { ref: 'Juan 3:16', contains: ['amor', 'mundo', 'hijo', 'vida', 'eterna'] },
      { ref: 'Romanos 8:28', contains: ['bien', 'aman', 'dios', 'propósito'] },
      { ref: 'Filipenses 4:13', contains: ['todo', 'cristo', 'fortalece'] },
      { ref: 'Salmos 23:1', contains: ['pastor', 'faltará'] },
      { ref: '1 Corintios 13:4', contains: ['amor', 'paciente', 'bondadoso'] },
    ]

    const results: SearchResult[] = []
    const queryLower = query.toLowerCase()

    for (const passage of commonPassages) {
      if (passage.contains.some(keyword => queryLower.includes(keyword))) {
        const verse = await this.getVerse(passage.ref, version)
        if (verse && results.length < limit) {
          results.push({
            reference: verse.reference,
            text: verse.text,
            version: version
          })
        }
      }
    }

    return results
  }

  // Get multiple versions of the same verse
  async compareVerses(reference: string, versions: string[]): Promise<BibleVerse[]> {
    const results: BibleVerse[] = []

    for (const version of versions) {
      const verse = await this.getVerse(reference, version)
      if (verse) {
        results.push(verse)
      }
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return results
  }

  // Get cross-references for a Bible passage
  async getCrossReferences(reference: string, topic?: string): Promise<string[]> {
    // Simple cross-reference mapping based on common theological themes
    const crossRefMap: { [key: string]: string[] } = {
      // Love references
      'juan 3:16': ['Romanos 5:8', '1 Juan 4:9-10', 'Efesios 2:4-5', 'Juan 15:13'],
      'john 3:16': ['Romans 5:8', '1 John 4:9-10', 'Ephesians 2:4-5', 'John 15:13'],
      
      // Grace references  
      'efesios 2:8': ['Romanos 3:24', 'Tito 3:5', 'Romanos 11:6', '2 Timoteo 1:9'],
      'ephesians 2:8': ['Romans 3:24', 'Titus 3:5', 'Romans 11:6', '2 Timothy 1:9'],
      
      // Faith references
      'hebreos 11:1': ['Romanos 10:17', '2 Corintios 5:7', 'Marcos 11:22', 'Romanos 1:17'],
      'hebrews 11:1': ['Romans 10:17', '2 Corinthians 5:7', 'Mark 11:22', 'Romans 1:17'],
      
      // Salvation references
      'romanos 10:9': ['Juan 3:16', 'Hechos 16:31', 'Efesios 2:8-9', '1 Juan 5:13'],
      'romans 10:9': ['John 3:16', 'Acts 16:31', 'Ephesians 2:8-9', '1 John 5:13'],
      
      // Peace references
      'filipenses 4:7': ['Juan 14:27', 'Isaías 26:3', 'Romanos 5:1', 'Colosenses 3:15'],
      'philippians 4:7': ['John 14:27', 'Isaiah 26:3', 'Romans 5:1', 'Colossians 3:15'],
      
      // Strength references
      'filipenses 4:13': ['Isaías 40:31', '2 Corintios 12:9', 'Efesios 6:10', 'Salmos 28:7'],
      'philippians 4:13': ['Isaiah 40:31', '2 Corinthians 12:9', 'Ephesians 6:10', 'Psalm 28:7'],
    }

    // Normalize reference for lookup
    const normalizedRef = reference.toLowerCase().trim()
    
    // Check for direct matches
    let crossRefs = crossRefMap[normalizedRef] || []
    
    // If no direct match and topic provided, generate thematic references
    if (crossRefs.length === 0 && topic) {
      const topicLower = topic.toLowerCase()
      
      if (topicLower.includes('amor') || topicLower.includes('love')) {
        crossRefs = ['Juan 3:16', '1 Juan 4:8', 'Romanos 5:8', '1 Corintios 13:4-7']
      } else if (topicLower.includes('gracia') || topicLower.includes('grace')) {
        crossRefs = ['Efesios 2:8-9', 'Romanos 3:24', 'Tito 3:5', '2 Corintios 12:9']
      } else if (topicLower.includes('fe') || topicLower.includes('faith')) {
        crossRefs = ['Hebreos 11:1', 'Romanos 10:17', 'Efesios 2:8', 'Habacuc 2:4']
      } else if (topicLower.includes('paz') || topicLower.includes('peace')) {
        crossRefs = ['Juan 14:27', 'Filipenses 4:7', 'Isaías 26:3', 'Romanos 5:1']
      } else if (topicLower.includes('esperanza') || topicLower.includes('hope')) {
        crossRefs = ['Romanos 15:13', 'Hebreos 6:19', '1 Pedro 1:3', 'Jeremías 29:11']
      } else if (topicLower.includes('salvación') || topicLower.includes('salvation')) {
        crossRefs = ['Romanos 10:9', 'Efesios 2:8-9', 'Hechos 4:12', '2 Timoteo 3:15']
      } else {
        // Generic spiritual growth references
        crossRefs = ['2 Timoteo 3:16', 'Salmos 119:105', 'Hebreos 4:12', 'Isaías 55:11']
      }
    }
    
    // If still no references, provide some general discipleship verses
    if (crossRefs.length === 0) {
      crossRefs = ['2 Timoteo 3:16', 'Salmos 119:105', 'Mateo 28:19-20', 'Hechos 17:11']
    }
    
    return crossRefs
  }

  // Get all available books
  getBibleBooks(): BibleBook[] {
    return [
      // Antiguo Testamento
      { id: 'genesis', name: 'Génesis', chapters: 50 },
      { id: 'exodus', name: 'Éxodo', chapters: 40 },
      { id: 'leviticus', name: 'Levítico', chapters: 27 },
      { id: 'numbers', name: 'Números', chapters: 36 },
      { id: 'deuteronomy', name: 'Deuteronomio', chapters: 34 },
      { id: 'joshua', name: 'Josué', chapters: 24 },
      { id: 'judges', name: 'Jueces', chapters: 21 },
      { id: 'ruth', name: 'Rut', chapters: 4 },
      { id: '1samuel', name: '1 Samuel', chapters: 31 },
      { id: '2samuel', name: '2 Samuel', chapters: 24 },
      { id: '1kings', name: '1 Reyes', chapters: 22 },
      { id: '2kings', name: '2 Reyes', chapters: 25 },
      { id: '1chronicles', name: '1 Crónicas', chapters: 29 },
      { id: '2chronicles', name: '2 Crónicas', chapters: 36 },
      { id: 'ezra', name: 'Esdras', chapters: 10 },
      { id: 'nehemiah', name: 'Nehemías', chapters: 13 },
      { id: 'esther', name: 'Ester', chapters: 10 },
      { id: 'job', name: 'Job', chapters: 42 },
      { id: 'psalms', name: 'Salmos', chapters: 150 },
      { id: 'proverbs', name: 'Proverbios', chapters: 31 },
      { id: 'ecclesiastes', name: 'Eclesiastés', chapters: 12 },
      { id: 'song', name: 'Cantares', chapters: 8 },
      { id: 'isaiah', name: 'Isaías', chapters: 66 },
      { id: 'jeremiah', name: 'Jeremías', chapters: 52 },
      { id: 'lamentations', name: 'Lamentaciones', chapters: 5 },
      { id: 'ezekiel', name: 'Ezequiel', chapters: 48 },
      { id: 'daniel', name: 'Daniel', chapters: 12 },
      { id: 'hosea', name: 'Oseas', chapters: 14 },
      { id: 'joel', name: 'Joel', chapters: 3 },
      { id: 'amos', name: 'Amós', chapters: 9 },
      { id: 'obadiah', name: 'Abdías', chapters: 1 },
      { id: 'jonah', name: 'Jonás', chapters: 4 },
      { id: 'micah', name: 'Miqueas', chapters: 7 },
      { id: 'nahum', name: 'Nahúm', chapters: 3 },
      { id: 'habakkuk', name: 'Habacuc', chapters: 3 },
      { id: 'zephaniah', name: 'Sofonías', chapters: 3 },
      { id: 'haggai', name: 'Hageo', chapters: 2 },
      { id: 'zechariah', name: 'Zacarías', chapters: 14 },
      { id: 'malachi', name: 'Malaquías', chapters: 4 },

      // Nuevo Testamento
      { id: 'matthew', name: 'Mateo', chapters: 28 },
      { id: 'mark', name: 'Marcos', chapters: 16 },
      { id: 'luke', name: 'Lucas', chapters: 24 },
      { id: 'john', name: 'Juan', chapters: 21 },
      { id: 'acts', name: 'Hechos', chapters: 28 },
      { id: 'romans', name: 'Romanos', chapters: 16 },
      { id: '1corinthians', name: '1 Corintios', chapters: 16 },
      { id: '2corinthians', name: '2 Corintios', chapters: 13 },
      { id: 'galatians', name: 'Gálatas', chapters: 6 },
      { id: 'ephesians', name: 'Efesios', chapters: 6 },
      { id: 'philippians', name: 'Filipenses', chapters: 4 },
      { id: 'colossians', name: 'Colosenses', chapters: 4 },
      { id: '1thessalonians', name: '1 Tesalonicenses', chapters: 5 },
      { id: '2thessalonians', name: '2 Tesalonicenses', chapters: 3 },
      { id: '1timothy', name: '1 Timoteo', chapters: 6 },
      { id: '2timothy', name: '2 Timoteo', chapters: 4 },
      { id: 'titus', name: 'Tito', chapters: 3 },
      { id: 'philemon', name: 'Filemón', chapters: 1 },
      { id: 'hebrews', name: 'Hebreos', chapters: 13 },
      { id: 'james', name: 'Santiago', chapters: 5 },
      { id: '1peter', name: '1 Pedro', chapters: 5 },
      { id: '2peter', name: '2 Pedro', chapters: 3 },
      { id: '1john', name: '1 Juan', chapters: 5 },
      { id: '2john', name: '2 Juan', chapters: 1 },
      { id: '3john', name: '3 Juan', chapters: 1 },
      { id: 'jude', name: 'Judas', chapters: 1 },
      { id: 'revelation', name: 'Apocalipsis', chapters: 22 }
    ]
  }

  // Get available Bible versions
  getAvailableVersions(): { [key: string]: string } {
    return this.VERSIONS
  }

  // Parse reference string (e.g., "Juan 3:16" -> { book: "Juan", chapter: 3, verse: 16 })
  parseReference(reference: string): { book: string, chapter: number, verse?: number } | null {
    try {
      const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+))?/)
      if (!match) return null

      return {
        book: match[1].trim(),
        chapter: parseInt(match[2]),
        verse: match[3] ? parseInt(match[3]) : undefined
      }
    } catch (error) {
      console.error('Error parsing reference:', error)
      return null
    }
  }

  // Get random verse for inspiration
  async getRandomVerse(version: string = 'RVR1960'): Promise<BibleVerse | null> {
    const popularVerses = [
      'Juan 3:16', 'Romanos 8:28', 'Filipenses 4:13', 'Salmos 23:1', 
      'Proverbios 3:5-6', 'Isaías 40:31', 'Jeremías 29:11', 'Mateo 28:19-20',
      '1 Corintios 13:4-7', 'Efesios 2:8-9', 'Gálatas 2:20', 'Hebreos 11:1'
    ]
    
    const randomRef = popularVerses[Math.floor(Math.random() * popularVerses.length)]
    return this.getVerse(randomRef, version)
  }
}

// Create and export service instance
export const freeBibleService = new FreeBibleService()

// Export available versions for UI components
export const FREE_BIBLE_VERSIONS = [
  { id: 'RVR1960', name: 'Reina Valera 1960', language: 'es' },
  { id: 'RVA2015', name: 'Reina Valera Actualizada 2015', language: 'es' },
  { id: 'NVI', name: 'Nueva Versión Internacional', language: 'es' },
  { id: 'NTV', name: 'Nueva Traducción Viviente', language: 'es' },
  { id: 'TLA', name: 'Traducción en Lenguaje Actual', language: 'es' },
  { id: 'DHH', name: 'Dios Habla Hoy', language: 'es' },
  { id: 'LBLA', name: 'La Biblia de Las Américas', language: 'es' },
  { id: 'PDT', name: 'Palabra de Dios para Todos', language: 'es' },
  { id: 'ESV', name: 'English Standard Version', language: 'en' },
  { id: 'KJV', name: 'King James Version', language: 'en' },
  { id: 'NIV', name: 'New International Version', language: 'en' },
  { id: 'NKJV', name: 'New King James Version', language: 'en' },
  { id: 'NASB', name: 'New American Standard Bible', language: 'en' },
  { id: 'CSB', name: 'Christian Standard Bible', language: 'en' },
  { id: 'NET', name: 'New English Translation', language: 'en' }
]

export type { BibleVerse, BibleBook, SearchResult }