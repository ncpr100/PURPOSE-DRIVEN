// Sermon Download Service - Export sermons in multiple formats
import { jsPDF } from 'jspdf'

interface SermonData {
  title: string
  content: string
  scripture?: string
  topic?: string
  date?: string
  pastor?: string
  church?: string
}

class SermonDownloadService {
  
  // Download as PDF
  downloadAsPDF(sermon: SermonData): void {
    try {
      console.log('Starting PDF generation for:', sermon.title)
      
      // Check if jsPDF is available
      if (typeof window === 'undefined') {
        throw new Error('PDF generation is not available in server environment')
      }

      const doc = new jsPDF()
      console.log('jsPDF instance created successfully')
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const maxWidth = pageWidth - 2 * margin
      let yPosition = margin

      // Title
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      const titleLines = doc.splitTextToSize(sermon.title, maxWidth)
      doc.text(titleLines, margin, yPosition)
      yPosition += titleLines.length * 10 + 10

      // Metadata
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      
      if (sermon.scripture) {
        doc.text(`Pasaje Bíblico: ${sermon.scripture}`, margin, yPosition)
        yPosition += 8
      }
      
      if (sermon.topic) {
        doc.text(`Tema: ${sermon.topic}`, margin, yPosition)
        yPosition += 8
      }
      
      if (sermon.date) {
        doc.text(`Fecha: ${sermon.date}`, margin, yPosition)
        yPosition += 8
      }
      
      if (sermon.pastor) {
        doc.text(`Pastor: ${sermon.pastor}`, margin, yPosition)
        yPosition += 8
      }

      yPosition += 10

      // Content
      doc.setFontSize(11)
      const contentLines = doc.splitTextToSize(sermon.content, maxWidth)
      
      for (let i = 0; i < contentLines.length; i++) {
        if (yPosition > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(contentLines[i], margin, yPosition)
        yPosition += 6
      }

      // Download
      const filename = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      console.log('Saving PDF as:', filename)
      doc.save(filename)
      console.log('PDF download initiated successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error(`Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Download as Word Document (DOCX)
  downloadAsWord(sermon: SermonData): void {
    try {
      // Create Word document content
      let content = `${sermon.title}\n\n`
      
      if (sermon.scripture) content += `Pasaje Bíblico: ${sermon.scripture}\n`
      if (sermon.topic) content += `Tema: ${sermon.topic}\n`
      if (sermon.date) content += `Fecha: ${sermon.date}\n`
      if (sermon.pastor) content += `Pastor: ${sermon.pastor}\n`
      if (sermon.church) content += `Iglesia: ${sermon.church}\n`
      
      content += '\n' + sermon.content

      // Convert to blob and download
      const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating Word document:', error)
      throw new Error('Error al generar documento Word')
    }
  }

  // Download as Plain Text
  downloadAsText(sermon: SermonData): void {
    try {
      console.log('Starting text download for:', sermon.title)
      
      // Check if we're in browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error('Text download is not available in server environment')
      }

      let content = `${sermon.title}\n${'='.repeat(sermon.title.length)}\n\n`
      
      if (sermon.scripture) content += `Pasaje Bíblico: ${sermon.scripture}\n`
      if (sermon.topic) content += `Tema: ${sermon.topic}\n`
      if (sermon.date) content += `Fecha: ${sermon.date}\n`
      if (sermon.pastor) content += `Pastor: ${sermon.pastor}\n`
      if (sermon.church) content += `Iglesia: ${sermon.church}\n`
      
      content += '\n' + sermon.content

      console.log('Creating blob for text download')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      
      console.log('Triggering text download')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log('Text download completed successfully')
    } catch (error) {
      console.error('Error generating text file:', error)
      throw new Error(`Error al generar archivo de texto: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Download as Markdown
  downloadAsMarkdown(sermon: SermonData): void {
    try {
      let content = `# ${sermon.title}\n\n`
      
      if (sermon.scripture) content += `**Pasaje Bíblico:** ${sermon.scripture}\n\n`
      if (sermon.topic) content += `**Tema:** ${sermon.topic}\n\n`
      if (sermon.date) content += `**Fecha:** ${sermon.date}\n\n`
      if (sermon.pastor) content += `**Pastor:** ${sermon.pastor}\n\n`
      if (sermon.church) content += `**Iglesia:** ${sermon.church}\n\n`
      
      content += '---\n\n' + sermon.content

      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating markdown file:', error)
      throw new Error('Error al generar archivo Markdown')
    }
  }

  // Download as HTML
  downloadAsHTML(sermon: SermonData): void {
    try {
      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sermon.title}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .metadata {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .metadata p {
            margin: 5px 0;
            font-weight: bold;
        }
        .content {
            text-align: justify;
            font-size: 16px;
        }
        .content p {
            margin: 15px 0;
        }
        @media print {
            body { margin: 0; padding: 15px; }
        }
    </style>
</head>
<body>
    <h1>${sermon.title}</h1>
    
    <div class="metadata">
        ${sermon.scripture ? `<p><strong>Pasaje Bíblico:</strong> ${sermon.scripture}</p>` : ''}
        ${sermon.topic ? `<p><strong>Tema:</strong> ${sermon.topic}</p>` : ''}
        ${sermon.date ? `<p><strong>Fecha:</strong> ${sermon.date}</p>` : ''}
        ${sermon.pastor ? `<p><strong>Pastor:</strong> ${sermon.pastor}</p>` : ''}
        ${sermon.church ? `<p><strong>Iglesia:</strong> ${sermon.church}</p>` : ''}
    </div>
    
    <div class="content">
        ${sermon.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
    </div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating HTML file:', error)
      throw new Error('Error al generar archivo HTML')
    }
  }

  // Print sermon
  printSermon(sermon: SermonData): void {
    try {
      const printContent = `
        <style>
          body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; }
          h1 { text-align: center; color: #2c3e50; }
          .metadata { margin: 20px 0; padding: 10px; background: #f5f5f5; }
          .content { line-height: 1.8; text-align: justify; }
        </style>
        <h1>${sermon.title}</h1>
        <div class="metadata">
          ${sermon.scripture ? `<p><strong>Pasaje Bíblico:</strong> ${sermon.scripture}</p>` : ''}
          ${sermon.topic ? `<p><strong>Tema:</strong> ${sermon.topic}</p>` : ''}
          ${sermon.date ? `<p><strong>Fecha:</strong> ${sermon.date}</p>` : ''}
          ${sermon.pastor ? `<p><strong>Pastor:</strong> ${sermon.pastor}</p>` : ''}
        </div>
        <div class="content">${sermon.content.replace(/\n/g, '<br>')}</div>
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
    } catch (error) {
      console.error('Error printing sermon:', error)
      throw new Error('Error al imprimir sermón')
    }
  }

  // Get all available download formats
  getAvailableFormats(): Array<{id: string, name: string, icon: string, description: string}> {
    return [
      {
        id: 'pdf',
        name: 'PDF',
        icon: '📄',
        description: 'Formato PDF para compartir y archivar'
      },
      {
        id: 'word',
        name: 'Word',
        icon: '📝',
        description: 'Documento Word para editar'
      },
      {
        id: 'text',
        name: 'Texto',
        icon: '📋',
        description: 'Archivo de texto plano'
      },
      {
        id: 'markdown',
        name: 'Markdown',
        icon: '📓',
        description: 'Formato Markdown para blogs'
      },
      {
        id: 'html',
        name: 'HTML',
        icon: '🌐',
        description: 'Página web para publicar online'
      }
    ]
  }
}

export const sermonDownloadService = new SermonDownloadService()
export type { SermonData }