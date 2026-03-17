import { Metadata } from 'next'
import PlatformFormViewer from './_components/platform-form-viewer'

export const metadata: Metadata = {
  title: 'Formulario | Khesed-tek',
  description: 'Formulario de contacto',
}

export default async function PlatformFormPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <PlatformFormViewer slug={params.slug} />
}
