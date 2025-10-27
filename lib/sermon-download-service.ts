/**
 * Sermon Download Service
 * Supports PDF, DOCX, HTML, and TXT formats
 * Free export functionality for pastors
 */

import { jsPDF } from 'jspdf'

export interface SermonContent {
  title: string
  date: string
  scripture: string
  introduction: string
  context: string
  points: {
    title: string
    content: string
    scripture?: string
  }[]
  conclusion: string
  author: string
  church?: string
}

export type DownloadFormat = 'pdf' | 'docx' | 'html' | 'txt'

class SermonDownloadService {
  
  /**
   * Download sermon in specified format
   */
  async downloadSermon(sermon: SermonContent, format: DownloadFormat): Promise<void> {
    try {
      switch (format) {
        case 'pdf':
          await this.downloadAsPDF(sermon)
          break
        case 'docx':
          await this.downloadAsWord(sermon)
          break
        case 'html':
          await this.downloadAsHTML(sermon)
          break
        case 'txt':
          await this.downloadAsText(sermon)
          break
        default:
          throw new Error(`Formato ${format} no soportado`)
      }
    } catch (error) {
      console.error('Download error:', error)
      throw error
    }
  }

  /**
   * Generate PDF using jsPDF
   */
  private async downloadAsPDF(sermon: SermonContent): Promise<void> {
    const doc = new jsPDF()
    let yPosition = 20
    const lineHeight = 8
    const pageHeight = doc.internal.pageSize.height
    const margin = 20
    const maxWidth = doc.internal.pageSize.width - (margin * 2)

    // Helper function to add text with automatic page breaks
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      
      const lines = doc.splitTextToSize(text, maxWidth)
      
      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      }
      yPosition += lineHeight / 2 // Extra spacing
    }

    // Title
    addText(sermon.title, 18, true)
    yPosition += 5

    // Metadata
    addText(`Fecha: ${sermon.date}`, 10)
    addText(`Texto Bíblico: ${sermon.scripture}`, 10)
    addText(`Predicador: ${sermon.author}`, 10)
    if (sermon.church) {
      addText(`Iglesia: ${sermon.church}`, 10)
    }
    yPosition += 10

    // Introduction
    addText('INTRODUCCIÓN', 14, true)
    addText(sermon.introduction)
    yPosition += 5

    // Context
    addText('CONTEXTO BÍBLICO', 14, true)
    addText(sermon.context)
    yPosition += 5

    // Points
    addText('DESARROLLO DEL SERMÓN', 14, true)
    sermon.points.forEach((point, index) => {
      addText(`${index + 1}. ${point.title}`, 12, true)
      addText(point.content)
      if (point.scripture) {
        addText(`Texto de apoyo: ${point.scripture}`, 10)
      }
      yPosition += 3
    })

    // Conclusion
    addText('CONCLUSIÓN', 14, true)
    addText(sermon.conclusion)

    // Footer
    yPosition += 10
    addText('---', 10)
    addText(`Generado por Khesed-tek CMS - ${new Date().toLocaleDateString()}`, 8)

    // Download
    const filename = `sermon-${sermon.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
    doc.save(filename)
  }

  /**
   * Generate DOCX (simplified HTML-based approach)
   */
  private async downloadAsWord(sermon: SermonContent): Promise<void> {
    // Create HTML content formatted for Word import
    const htmlContent = this.generateHTML(sermon, true)
    
    // Create blob and download
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon-${sermon.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.docx`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Generate HTML download
   */
  private async downloadAsHTML(sermon: SermonContent): Promise<void> {
    const htmlContent = this.generateHTML(sermon)
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon-${sermon.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Generate TXT download
   */
  private async downloadAsText(sermon: SermonContent): Promise<void> {
    let content = ''
    content += `${sermon.title}\n`
    content += `${'='.repeat(sermon.title.length)}\n\n`
    content += `Fecha: ${sermon.date}\n`
    content += `Texto Bíblico: ${sermon.scripture}\n`
    content += `Predicador: ${sermon.author}\n`
    if (sermon.church) {
      content += `Iglesia: ${sermon.church}\n`
    }
    content += '\n'
    
    content += 'INTRODUCCIÓN\n'
    content += '-'.repeat(12) + '\n'
    content += `${sermon.introduction}\n\n`
    
    content += 'CONTEXTO BÍBLICO\n'
    content += '-'.repeat(16) + '\n'
    content += `${sermon.context}\n\n`
    
    content += 'DESARROLLO DEL SERMÓN\n'
    content += '-'.repeat(21) + '\n'
    sermon.points.forEach((point, index) => {
      content += `${index + 1}. ${point.title}\n`
      content += `${point.content}\n`
      if (point.scripture) {
        content += `   Texto de apoyo: ${point.scripture}\n`
      }
      content += '\n'
    })
    
    content += 'CONCLUSIÓN\n'
    content += '-'.repeat(10) + '\n'
    content += `${sermon.conclusion}\n\n`
    
    content += '---\n'
    content += `Generado por Khesed-tek CMS - ${new Date().toLocaleDateString()}\n`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sermon-${sermon.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Generate HTML content
   */
  private generateHTML(sermon: SermonContent, forWord: boolean = false): string {
    const styles = forWord ? `
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; }
        h2 { color: #34495e; margin-top: 30px; }
        .metadata { background: #ecf0f1; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .point { margin: 20px 0; padding: 15px; border-left: 4px solid #3498db; }
        .scripture { font-style: italic; color: #7f8c8d; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #95a5a6; }
      </style>
    ` : `
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.8; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px 20px;
          background: #fafafa;
          color: #333;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 { 
          color: #2c3e50; 
          text-align: center; 
          border-bottom: 3px solid #3498db;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        h2 { 
          color: #34495e; 
          margin: 30px 0 15px 0;
          padding: 10px 0;
          border-bottom: 1px solid #bdc3c7;
        }
        .metadata { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .metadata p { margin: 5px 0; }
        .point { 
          margin: 25px 0; 
          padding: 20px; 
          border-left: 5px solid #3498db;
          background: #f8f9fa;
          border-radius: 0 5px 5px 0;
        }
        .point h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .scripture { 
          font-style: italic; 
          color: #8e44ad;
          background: #f4f1fc;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        .footer { 
          text-align: center; 
          margin-top: 50px; 
          padding-top: 20px;
          border-top: 1px solid #bdc3c7;
          font-size: 14px; 
          color: #7f8c8d;
        }
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
        }
      </style>
    `

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sermon.title}</title>
    ${styles}
</head>
<body>
    <div class="container">
        <h1>${sermon.title}</h1>
        
        <div class="metadata">
            <p><strong>Fecha:</strong> ${sermon.date}</p>
            <p><strong>Texto Bíblico:</strong> ${sermon.scripture}</p>
            <p><strong>Predicador:</strong> ${sermon.author}</p>
            ${sermon.church ? `<p><strong>Iglesia:</strong> ${sermon.church}</p>` : ''}
        </div>

        <h2>Introducción</h2>
        <p>${sermon.introduction.replace(/\n/g, '</p><p>')}</p>

        <h2>Contexto Bíblico</h2>
        <p>${sermon.context.replace(/\n/g, '</p><p>')}</p>

        <h2>Desarrollo del Sermón</h2>
        ${sermon.points.map((point, index) => `
            <div class="point">
                <h3>${index + 1}. ${point.title}</h3>
                <p>${point.content.replace(/\n/g, '</p><p>')}</p>
                ${point.scripture ? `<div class="scripture">Texto de apoyo: ${point.scripture}</div>` : ''}
            </div>
        `).join('')}

        <h2>Conclusión</h2>
        <p>${sermon.conclusion.replace(/\n/g, '</p><p>')}</p>

        <div class="footer">
            <p>Generado por Khesed-tek Church Management System</p>
            <p>${new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * Validate sermon content before download
   */
  validateSermonContent(sermon: SermonContent): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!sermon.title || sermon.title.trim().length === 0) {
      errors.push('El título del sermón es requerido')
    }
    
    if (!sermon.scripture || sermon.scripture.trim().length === 0) {
      errors.push('El texto bíblico es requerido')
    }
    
    if (!sermon.introduction || sermon.introduction.trim().length === 0) {
      errors.push('La introducción es requerida')
    }
    
    if (!sermon.context || sermon.context.trim().length === 0) {
      errors.push('El contexto bíblico es requerido')
    }
    
    if (!sermon.points || sermon.points.length === 0) {
      errors.push('Al menos un punto de desarrollo es requerido')
    } else {
      sermon.points.forEach((point, index) => {
        if (!point.title || point.title.trim().length === 0) {
          errors.push(`El título del punto ${index + 1} es requerido`)
        }
        if (!point.content || point.content.trim().length === 0) {
          errors.push(`El contenido del punto ${index + 1} es requerido`)
        }
      })
    }
    
    if (!sermon.conclusion || sermon.conclusion.trim().length === 0) {
      errors.push('La conclusión es requerida')
    }
    
    if (!sermon.author || sermon.author.trim().length === 0) {
      errors.push('El nombre del predicador es requerido')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Get download formats with descriptions
   */
  getAvailableFormats(): { format: DownloadFormat; name: string; description: string }[] {
    return [
      {
        format: 'pdf',
        name: 'PDF',
        description: 'Formato profesional para impresión y archivo'
      },
      {
        format: 'docx',
        name: 'Word (DOCX)',
        description: 'Editable en Microsoft Word y Google Docs'
      },
      {
        format: 'html',
        name: 'HTML',
        description: 'Para compartir en web o visualizar en navegador'
      },
      {
        format: 'txt',
        name: 'Texto Plano',
        description: 'Formato simple compatible con cualquier editor'
      }
    ]
  }
}

// Export singleton instance
export const sermonDownloadService = new SermonDownloadService()
export default sermonDownloadService