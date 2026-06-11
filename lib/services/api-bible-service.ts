// API.BIBLE Service - Official Scripture API
// Documentation: https://scripture.api.bible/

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
  reference: string;
}

interface BibleVersion {
  id: string;
  name: string;
  language: string;
  languageCode: string;
}

// Versiones específicas solicitadas
export const API_BIBLE_VERSIONS: BibleVersion[] = [
  // ESPAÑOL
  {
    id: "bba9f401831a0021-01",
    name: "Nueva Biblia Latinoamericana (NBLA)",
    language: "Español",
    languageCode: "spa",
  },
  {
    id: "55424c1a9c398d36-01",
    name: "Nueva Traducción Viviente (NTV)",
    language: "Español",
    languageCode: "spa",
  },
  {
    id: "e64c36c18b707a72-01",
    name: "Nueva Biblia Viviente (NLB)",
    language: "Español",
    languageCode: "spa",
  },
  {
    id: "98768a30b89c8dd3-01",
    name: "NVI - Santa Biblia (NVI-S)",
    language: "Español",
    languageCode: "spa",
  },

  // ENGLISH
  {
    id: "f392fe278e74a5f7-01",
    name: "King James Version (KJV)",
    language: "English",
    languageCode: "eng",
  },
  {
    id: "7068119f4cd43088-01",
    name: "New Living Translation (NLT)",
    language: "English",
    languageCode: "eng",
  },
  {
    id: "a1a688575bbf5263-01",
    name: "The Message (MSG)",
    language: "English",
    languageCode: "eng",
  },
  {
    id: "12d66e4c2b38d76f-01",
    name: "Amplified Bible (AMP)",
    language: "English",
    languageCode: "eng",
  },

  // PORTUGUÊS
  {
    id: "587a1a63a8b0f5a3-01",
    name: "Nova Bíblia Viva (ONBV)",
    language: "Português",
    languageCode: "por",
  },
  {
    id: "2e34c6a7b8c9d0e1-01",
    name: "Nova Versão Internacional (PTNVI)",
    language: "Português",
    languageCode: "por",
  },
  {
    id: "f1e2d3c4b5a69788-01",
    name: "Nova Versão Transformadora (NVT)",
    language: "Português",
    languageCode: "por",
  },
  {
    id: "a9b8c7d6e5f40312-01",
    name: "Bíblia Livre Tradução (BLT)",
    language: "Português",
    languageCode: "por",
  },
];

class ApiBibleService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_API_BIBLE_KEY || "";
  private readonly API_URL = "https://api.scripture.api.bible/v1";

  constructor() {
    if (!this.API_KEY) {
      console.warn(
        "⚠️ API.BIBLE key not configured. Set NEXT_PUBLIC_API_BIBLE_KEY in .env.local",
      );
    }
  }

  /**
   * Obtener un versículo específico
   */
  async getVerse(
    reference: string,
    versionId: string,
  ): Promise<BibleVerse | null> {
    if (!this.API_KEY) {
      console.error("❌ API.BIBLE key not configured");
      return null;
    }

    try {
      const url = `${this.API_URL}/bibles/${versionId}/passages/${encodeURIComponent(reference)}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`;

      const response = await fetch(url, {
        headers: {
          "api-key": this.API_KEY,
        },
      });

      if (!response.ok) {
        console.error(
          `❌ API.BIBLE error: ${response.status} ${response.statusText}`,
        );
        return null;
      }

      const data = await response.json();
      const passage = data.data;

      // Parsear referencia (ej: "Juan 3:16")
      const refMatch = reference.match(/(.+?)\s+(\d+):(\d+)/);
      if (!refMatch) {
        console.error("❌ Invalid reference format:", reference);
        return null;
      }

      const [, book, chapter, verse] = refMatch;
      const version = API_BIBLE_VERSIONS.find((v) => v.id === versionId);

      return {
        book: book.trim(),
        chapter: parseInt(chapter),
        verse: parseInt(verse),
        text: passage.content.trim(),
        version: version?.name || versionId,
        reference: passage.reference,
      };
    } catch (error) {
      console.error("❌ Error fetching verse from API.BIBLE:", error);
      return null;
    }
  }

  /**
   * Comparar múltiples versiones de un versículo
   */
  async compareVerses(
    reference: string,
    versionIds: string[],
  ): Promise<BibleVerse[]> {
    if (!this.API_KEY || versionIds.length === 0) {
      return [];
    }

    const results = await Promise.all(
      versionIds.map(async (versionId) => {
        const verse = await this.getVerse(reference, versionId);
        return verse;
      }),
    );

    return results.filter((v): v is BibleVerse => v !== null);
  }

  /**
   * Buscar texto en la Biblia
   */
  async search(
    query: string,
    versionId: string,
    limit: number = 20,
  ): Promise<any[]> {
    if (!this.API_KEY) {
      return [];
    }

    try {
      const url = `${this.API_URL}/bibles/${versionId}/search?query=${encodeURIComponent(query)}&limit=${limit}&sort=relevance&offset=0`;

      const response = await fetch(url, {
        headers: {
          "api-key": this.API_KEY,
        },
      });

      if (!response.ok) {
        console.error(`❌ API.BIBLE search error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return data.data.verses || [];
    } catch (error) {
      console.error("❌ Error searching API.BIBLE:", error);
      return [];
    }
  }

  /**
   * Obtener referencias cruzadas (simulado - API.BIBLE no tiene endpoint directo)
   * En producción, esto debería usar una base de datos local de referencias cruzadas
   */
  async getCrossReferences(
    reference: string,
    topic?: string,
  ): Promise<string[]> {
    // Base de datos simple de referencias cruzadas comunes
    const crossRefs: Record<string, string[]> = {
      "Juan 3:16": ["Romanos 5:8", "1 Juan 4:9", "Efesios 2:8-9"],
      "Romanos 8:28": ["Génesis 50:20", "Jeremías 29:11", "Filipenses 1:6"],
      "Filipenses 4:13": ["2 Corintios 12:9", "Isaías 40:31", "Juan 15:5"],
      "Proverbios 3:5-6": ["Salmos 37:5", "Jeremías 17:7", "Santiago 1:5"],
    };

    return crossRefs[reference] || [];
  }
}

export const apiBibleService = new ApiBibleService();
