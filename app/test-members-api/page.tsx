// Simple test page to verify members API functionality
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function MembersApiTest() {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState({
    sessionInfo: null,
    apiResponse: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    const testMembersAPI = async () => {
      try {
        console.log('🧪 Starting Members API Test');
        console.log('🔐 Session:', session);
        
        setTestResults(prev => ({
          ...prev,
          sessionInfo: {
            user: session?.user?.email,
            role: session?.user?.role,
            churchId: session?.user?.churchId,
            authenticated: !!session?.user
          }
        }));

        if (!session?.user) {
          setTestResults(prev => ({
            ...prev,
            error: 'No authenticated session',
            loading: false
          }));
          return;
        }

        console.log('📡 Calling /api/members...');
        const response = await fetch('/api/members', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('📊 API Response Status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Response Data:', data);
          
          setTestResults(prev => ({
            ...prev,
            apiResponse: {
              status: response.status,
              dataStructure: {
                hasMembers: !!data.members,
                membersCount: data.members?.length || 0,
                hasPagination: !!data.pagination,
                totalFromPagination: data.pagination?.total || 0
              },
              sampleMember: data.members?.[0] || null,
              fullResponse: data
            },
            loading: false
          }));
        } else {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
          
          setTestResults(prev => ({
            ...prev,
            error: `API Error ${response.status}: ${errorText}`,
            loading: false
          }));
        }
      } catch (error) {
        console.error('💥 Test Error:', error);
        setTestResults(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    };

    if (session !== undefined) {
      testMembersAPI();
    }
  }, [session]);

  if (testResults.loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Members API Test</h1>
        <div>Testing API connection...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Members API Test Results</h1>
      
      <div className="space-y-6">
        {/* Session Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Session Information</h2>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {JSON.stringify(testResults.sessionInfo, null, 2)}
          </pre>
        </div>

        {/* API Response */}
        {testResults.apiResponse && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">API Response ✅</h2>
            <div className="space-y-2">
              <div><strong>Status:</strong> {testResults.apiResponse.status}</div>
              <div><strong>Members Found:</strong> {testResults.apiResponse.dataStructure.membersCount}</div>
              <div><strong>Total (Pagination):</strong> {testResults.apiResponse.dataStructure.totalFromPagination}</div>
              <div><strong>Has Members Array:</strong> {testResults.apiResponse.dataStructure.hasMembers ? 'Yes' : 'No'}</div>
              <div><strong>Has Pagination:</strong> {testResults.apiResponse.dataStructure.hasPagination ? 'Yes' : 'No'}</div>
            </div>
            
            {testResults.apiResponse.sampleMember && (
              <div className="mt-4">
                <h3 className="font-semibold">Sample Member:</h3>
                <pre className="bg-white p-2 rounded text-sm mt-2">
                  {JSON.stringify(testResults.apiResponse.sampleMember, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {testResults.error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error ❌</h2>
            <div className="text-red-700">{testResults.error}</div>
          </div>
        )}

        {/* Full Response */}
        {testResults.apiResponse && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Full API Response</h2>
            <pre className="bg-white p-2 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(testResults.apiResponse.fullResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}