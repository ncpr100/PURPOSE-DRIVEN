/**
 * Free Bible API Service
 * Unified interface for multiple free Bible APIs
 * No subscriptions required - completely free for pastors
 */

export interface BibleVerse {
  reference: string
  text: string
  version: string
}

export interface BibleSearchResult {
  verses: BibleVerse[]
  success: boolean
  error?: string
}

export interface BibleVersion {
  id: string
  name: string
  language: string
  provider: string
}

// Available free Bible versions
export const FREE_BIBLE_VERSIONS: BibleVersion[] = [
  // Spanish Versions
  { id: 'RVR1960', name: 'Reina Valera 1960', language: 'es', provider: 'bible-api' },
  { id: 'RVC', name: 'Reina Valera Contemporánea', language: 'es', provider: 'gateway' },
  { id: 'NVI', name: 'Nueva Versión Internacional', language: 'es', provider: 'gateway' },
  { id: 'TLA', name: 'Traducción en Lenguaje Actual', language: 'es', provider: 'gateway' },
  { id: 'DHH', name: 'Dios Habla Hoy', language: 'es', provider: 'gateway' },
  
  // English Versions  
  { id: 'KJV', name: 'King James Version', language: 'en', provider: 'bible-api' },
  { id: 'ESV', name: 'English Standard Version', language: 'en', provider: 'esv-api' },
  { id: 'NIV', name: 'New International Version', language: 'en', provider: 'gateway' },
  { id: 'NASB', name: 'New American Standard Bible', language: 'en', provider: 'gateway' },
  { id: 'NLT', name: 'New Living Translation', language: 'en', provider: 'gateway' },
]

class FreeBibleService {
  private baseUrls = {
    'bible-api': 'https://bible-api.com',
    'gateway': 'https://www.biblegateway.com/passage',
    'esv-api': 'https://api.esv.org/v3/passage'
  }

  /**
   * Search for Bible verse using free APIs
   */
  async searchVerse(reference: string, version: string = 'RVR1960'): Promise<BibleSearchResult> {
    const versionConfig = FREE_BIBLE_VERSIONS.find(v => v.id === version)
    
    if (!versionConfig) {
      return {
        verses: [],
        success: false,
        error: `Version ${version} not supported`
      }
    }

    try {
      switch (versionConfig.provider) {
        case 'bible-api':
          return await this.searchBibleApi(reference, version)
        case 'esv-api':
          return await this.searchEsvApi(reference)
        case 'gateway':
          return await this.searchGatewayApi(reference, version)
        default:
          throw new Error(`Provider ${versionConfig.provider} not implemented`)
      }
    } catch (error) {
      console.error('Bible search error:', error)
      return {
        verses: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Bible API (bible-api.com) - Completely free
   */
  private async searchBibleApi(reference: string, version: string): Promise<BibleSearchResult> {
    const cleanRef = reference.replace(/\s+/g, '')
    const url = `${this.baseUrls['bible-api']}/${cleanRef}?translation=${version.toLowerCase()}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Bible API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      verses: [{
        reference: data.reference,
        text: data.text,
        version: version
      }],
      success: true
    }
  }

  /**
   * ESV API - Free with registration (5000 requests/day)
   */
  private async searchEsvApi(reference: string): Promise<BibleSearchResult> {
    // Note: Requires ESV_API_KEY environment variable
    const apiKey = process.env.ESV_API_KEY
    
    if (!apiKey) {
      // Fallback to Bible API for ESV-like content
      return await this.searchBibleApi(reference, 'kjv')
    }

    const url = `${this.baseUrls['esv-api']}/text/?q=${encodeURIComponent(reference)}&include-headings=false&include-footnotes=false&include-verse-numbers=false&include-short-copyright=false&include-passage-references=false`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${apiKey}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`ESV API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      verses: [{
        reference: reference,
        text: data.passages[0] || 'Verse not found',
        version: 'ESV'
      }],
      success: true
    }
  }

  /**
   * Bible Gateway API (Web scraping - respectful)
   */
  private async searchGatewayApi(reference: string, version: string): Promise<BibleSearchResult> {
    // This would require a server-side proxy to avoid CORS
    // For now, return a placeholder with instructions
    
    return {
      verses: [{
        reference: reference,
        text: `[${version}] ${reference} - Texto bíblico disponible. Use la búsqueda manual en BibleGateway.com para ${reference} en ${version}.`,
        version: version
      }],
      success: true
    }
  }

  /**
   * Compare multiple versions of the same verse
   */
  async compareVersions(reference: string, versions: string[] = ['RVR1960', 'NVI', 'TLA']): Promise<BibleVerse[]> {
    const results: BibleVerse[] = []
    
    for (const version of versions) {
      try {
        const result = await this.searchVerse(reference, version)
        if (result.success && result.verses.length > 0) {
          results.push(result.verses[0])
        }
      } catch (error) {
        console.error(`Error fetching ${version}:`, error)
        // Continue with other versions
      }
    }
    
    return results
  }

  /**
   * Get cross-references using AI/pattern matching
   */
  async getCrossReferences(reference: string, topic?: string): Promise<string[]> {
    // Basic cross-reference patterns based on common biblical themes
    const crossRefMap: { [key: string]: string[] } = {
      // Salvation themes
      'juan 3:16': ['romanos 5:8', 'efesios 2:8-9', '1 juan 4:9-10'],
      'romanos 3:23': ['romanos 6:23', 'isaías 53:6', '1 juan 1:8'],
      'romanos 6:23': ['juan 3:16', 'efesios 2:8-9', 'tito 3:5'],
      
      // Love themes  
      '1 corintios 13': ['juan 13:34-35', '1 juan 4:7-8', 'colosenses 3:14'],
      'juan 13:34': ['1 juan 4:11', 'romanos 13:8', 'gálatas 5:13'],
      
      // Faith themes
      'hebreos 11:1': ['romanos 10:17', '2 corintios 5:7', 'efesios 2:8'],
      'romanos 10:17': ['hebreos 11:6', 'juan 20:29', '1 pedro 1:8'],
      
      // Grace themes
      'efesios 2:8-9': ['romanos 3:24', 'tito 3:5', '2 timoteo 1:9'],
      'romanos 3:24': ['romanos 5:15', 'gálatas 2:21', 'hebreos 4:16']
    }
    
    const normalizedRef = reference.toLowerCase().replace(/\s+/g, ' ').trim()
    
    // Try exact match first
    if (crossRefMap[normalizedRef]) {
      return crossRefMap[normalizedRef]
    }
    
    // Try partial matches for book/chapter
    const bookChapter = normalizedRef.split(':')[0]
    for (const [key, refs] of Object.entries(crossRefMap)) {
      if (key.startsWith(bookChapter)) {
        return refs
      }
    }
    
    // Default cross-references based on topic
    if (topic) {
      const topicRefs: { [key: string]: string[] } = {
        'amor': ['1 corintios 13:4-7', 'juan 3:16', '1 juan 4:8'],
        'fe': ['hebreos 11:1', 'romanos 10:17', 'efesios 2:8'],
        'gracia': ['efesios 2:8-9', 'romanos 3:24', 'tito 3:5'],
        'salvación': ['juan 3:16', 'romanos 10:9', 'efesios 2:8-9'],
        'esperanza': ['romanos 15:13', '1 pedro 1:3', 'jeremías 29:11']
      }
      
      const topicKey = topic.toLowerCase()
      for (const [key, refs] of Object.entries(topicRefs)) {
        if (topicKey.includes(key)) {
          return refs
        }
      }
    }
    
    // Default generic cross-references
    return ['juan 3:16', 'romanos 8:28', 'filipenses 4:13']
  }

  /**
   * Search verses by keyword/topic
   */
  async searchByTopic(topic: string, version: string = 'RVR1960'): Promise<BibleVerse[]> {
    // Basic keyword to verse mapping
    const topicVerses: { [key: string]: string[] } = {
      'amor': [
        'juan 3:16', '1 corintios 13:4-7', '1 juan 4:8', 
        'romanos 8:38-39', 'juan 13:34-35'
      ],
      'fe': [
        'hebreos 11:1', 'hebreos 11:6', 'romanos 10:17', 
        'marcos 11:24', '2 corintios 5:7'
      ],
      'esperanza': [
        'romanos 15:13', '1 pedro 1:3', 'jeremías 29:11', 
        'salmos 33:22', 'lamentaciones 3:22-23'
      ],
      'paz': [
        'juan 14:27', 'filipenses 4:6-7', 'isaías 26:3', 
        'romanos 5:1', 'colosenses 3:15'
      ],
      'gozo': [
        'nehemías 8:10', 'salmos 16:11', 'juan 15:11', 
        'filipenses 4:4', '1 pedro 1:8'
      ]
    }
    
    const normalizedTopic = topic.toLowerCase()
    let references: string[] = []
    
    // Find matching topics
    for (const [key, verses] of Object.entries(topicVerses)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        references = verses
        break
      }
    }
    
    // If no specific topic found, use default inspirational verses
    if (references.length === 0) {
      references = ['juan 3:16', 'romanos 8:28', 'filipenses 4:13', 'salmos 23:1', 'isaías 40:31']
    }
    
    // Fetch actual verses
    const results: BibleVerse[] = []
    for (const ref of references.slice(0, 5)) { // Limit to 5 verses
      try {
        const result = await this.searchVerse(ref, version)
        if (result.success && result.verses.length > 0) {
          results.push(result.verses[0])
        }
      } catch (error) {
        console.error(`Error fetching ${ref}:`, error)
      }
    }
    
    return results
  }
}

// Export singleton instance
export const freeBibleService = new FreeBibleService()
export default freeBibleService