import { Metadata } from 'next'
import PlatformFormViewer from './_components/platform-form-viewer'

export const metadata: Metadata = {
  title: 'Formulario | Khesed-tek',
  description: 'Formulario de contacto',
}

export default function PlatformFormPage({ params }: { params: { slug: string } }) {
  return <PlatformFormViewer slug={params.slug} />
}
