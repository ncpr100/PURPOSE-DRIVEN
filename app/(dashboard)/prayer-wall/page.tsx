'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PrayerWallStats } from './_components/prayer-wall-stats'
import { PrayerWallActions } from './_components/prayer-wall-actions'
import { FormsList } from './_components/forms-list'
import { QRCodesList } from './_components/qr-codes-list'
import { PrayerRequestsList } from './_components/prayer-requests-list'
import { ApprovalsList } from './_components/approvals-list'
import { TestimoniesList } from './_components/testimonies-list'
import {
  PrayerForm,
  QRCodeData,
  DashboardStats,
} from '@/types/prayer-wall'

export default function PrayerWallPage() {
  const [activeTab, setActiveTab] = useState('requests')
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalContacts: 0,
    formsCount: 0,
    qrCodesCount: 0,
    testimoniesCount: 0,
    pendingTestimonies: 0,
    approvedTestimonies: 0,
  })
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false)
  const [isQrBuilderOpen, setIsQrBuilderOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<Partial<PrayerForm> | null>(
    null
  )
  const [editingQrCode, setEditingQrCode] = useState<Partial<QRCodeData> | null>(
    null
  )
  const [forms, setForms] = useState<PrayerForm[]>([])
  const { data: session } = useSession()

  const fetchStats = async () => {
    if (!session) return
    try {
      const response = await fetch('/api/prayer-analytics')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        toast.error('Error al cargar estadísticas.')
      }
    } catch (error) {
      toast.error('Error de red al cargar estadísticas.')
    }
  }

  const fetchForms = async () => {
    if (!session) return
    try {
      const response = await fetch('/api/prayer-forms')
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      }
    } catch (error) {
      // Handle error silently for this fetch
    }
  }

  useEffect(() => {
    fetchStats()
    fetchForms()
  }, [session])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Muro de Oración</h1>
        <p className="text-muted-foreground">
          Gestiona peticiones, formularios, testimonios y más.
        </p>
      </header>

      <PrayerWallStats stats={stats} onTabChange={handleTabChange} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="requests">Peticiones</TabsTrigger>
            <TabsTrigger value="approvals">Aprobaciones</TabsTrigger>
            <TabsTrigger value="forms">Formularios</TabsTrigger>
            <TabsTrigger value="qrcodes">Códigos QR</TabsTrigger>
            <TabsTrigger value="testimonies">Testimonios</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>
          <PrayerWallActions
            activeTab={activeTab}
            isFormBuilderOpen={isFormBuilderOpen}
            setIsFormBuilderOpen={setIsFormBuilderOpen}
            isQrBuilderOpen={isQrBuilderOpen}
            setIsQrBuilderOpen={setIsQrBuilderOpen}
            editingForm={editingForm}
            setEditingForm={setEditingForm}
            editingQrCode={editingQrCode}
            setEditingQrCode={setEditingQrCode}
            refetchForms={fetchForms}
            refetchQrCodes={() => {
              /* refetch QR codes logic */
            }}
            forms={forms}
          />
        </div>

        <TabsContent value="requests">
          <PrayerRequestsList />
        </TabsContent>
        <TabsContent value="approvals">
          <ApprovalsList />
        </TabsContent>
        <TabsContent value="forms">
          <FormsList
            setEditingForm={(form) => {
              setEditingForm(form)
              setIsFormBuilderOpen(true)
            }}
            setIsFormBuilderOpen={setIsFormBuilderOpen}
          />
        </TabsContent>
        <TabsContent value="qrcodes">
          <QRCodesList
            setEditingQrCode={(qr) => {
              setEditingQrCode(qr)
              setIsQrBuilderOpen(true)
            }}
            setIsQrBuilderOpen={setIsQrBuilderOpen}
          />
        </TabsContent>
        <TabsContent value="testimonies">
          <TestimoniesList />
        </TabsContent>
        <TabsContent value="analytics">
          {/* Analytics component will go here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

