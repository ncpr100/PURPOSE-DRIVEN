'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthTestPage() {
  const { data: session, status } = useSession()
  const [apiResult, setApiResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing authentication API...')
      const response = await fetch('/api/auth-test', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('🧪 Auth test response status:', response.status)
      const data = await response.json()
      console.log('🧪 Auth test response data:', data)
      
      setApiResult({
        status: response.status,
        data
      })
    } catch (error) {
      console.error('🧪 Auth test error:', error)
      setApiResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testMembersAPI = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing members API...')
      const response = await fetch('/api/members', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('🧪 Members API response status:', response.status)
      const data = await response.json()
      console.log('🧪 Members API response data:', data)
      
      setApiResult({
        status: response.status,
        data
      })
    } catch (error) {
      console.error('🧪 Members API error:', error)
      setApiResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testSimpleMembersAPI = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing simple members API...')
      const response = await fetch('/api/simple-members', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('🧪 Simple Members API response status:', response.status)
      const data = await response.json()
      console.log('🧪 Simple Members API response data:', data)
      
      setApiResult({
        status: response.status,
        data
      })
    } catch (error) {
      console.error('🧪 Simple Members API error:', error)
      setApiResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Client Session Status</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                status,
                hasSession: !!session,
                userId: session?.user?.id,
                userEmail: session?.user?.email,
                churchId: session?.user?.churchId,
                role: session?.user?.role
              }, null, 2)}
            </pre>
          </div>
          
          <div className="space-x-2">
            <Button 
              onClick={testAuth} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Auth API'}
            </Button>
            
            <Button 
              onClick={testMembersAPI} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Members API'}
            </Button>
            
            <Button 
              onClick={testSimpleMembersAPI} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Simple Members API'}
            </Button>
          </div>
          
          {apiResult && (
            <div>
              <h3 className="font-semibold mb-2">API Test Result</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(apiResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}