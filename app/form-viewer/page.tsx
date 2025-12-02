import { Metadata } from 'next'
import FormViewer from './_components/form-viewer'

export const metadata: Metadata = {
  title: 'Formulario | Khesed-tek',
  description: 'Formulario personalizado'
}

export default function FormViewerPage() {
  return <FormViewer />
}