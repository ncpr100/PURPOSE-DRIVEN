'use client'

import { useEffect, useState } from 'react'

export default function GenderDiagnosticPage() {
  const [members, setMembers] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, masculino: 0, femenino: 0, other: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch('/api/members')
        const data = await response.json()
        setMembers(data)
        
        // Calculate stats
        const masculino = data.filter((m: any) => m.gender?.toLowerCase() === 'masculino').length
        const femenino = data.filter((m: any) => m.gender?.toLowerCase() === 'femenino').length
        const other = data.filter((m: any) => m.gender && m.gender?.toLowerCase() !== 'masculino' && m.gender?.toLowerCase() !== 'femenino').length
        
        setStats({
          total: data.length,
          masculino,
          femenino,
          other
        })
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMembers()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Gender Statistics Diagnostic</h1>
      
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="p-6 border rounded-lg">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Members</div>
        </div>
        <div className="p-6 border rounded-lg bg-green-50">
          <div className="text-2xl font-bold">{stats.masculino}</div>
          <div className="text-sm text-muted-foreground">Masculino</div>
        </div>
        <div className="p-6 border rounded-lg bg-pink-50">
          <div className="text-2xl font-bold">{stats.femenino}</div>
          <div className="text-sm text-muted-foreground">Femenino</div>
        </div>
        <div className="p-6 border rounded-lg bg-gray-50">
          <div className="text-2xl font-bold">{stats.other}</div>
          <div className="text-sm text-muted-foreground">Other/Null</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Sample Members (first 10)</h2>
      <div className="space-y-2">
        {members.slice(0, 10).map((member, index) => (
          <div key={member.id} className="p-4 border rounded">
            <div className="font-medium">{index + 1}. {member.firstName} {member.lastName}</div>
            <div className="text-sm text-gray-600">
              gender = "<span className="font-mono bg-yellow-100 px-1">{member.gender}</span>" 
              (type: {typeof member.gender})
            </div>
            <div className="text-sm text-gray-600">
              toLowerCase() = "<span className="font-mono bg-blue-100 px-1">{member.gender?.toLowerCase()}</span>"
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">Expected Results:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ Total Members: 999</li>
          <li>✅ Masculino: 495</li>
          <li>✅ Femenino: 504</li>
          <li>✅ Other/Null: 0</li>
        </ul>
      </div>
    </div>
  )
}
