import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { authStore } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AuthDebugPanel() {
  const [testResults, setTestResults] = useState<Record<string, unknown>>({})
  const [isVisible, setIsVisible] = useState(false)
  
  const { data: causesTest } = useQuery({
    queryKey: ['debug-causes'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/causes/', { params: { page_size: 3 } })
        return { success: true, data, error: null }
      } catch (error: unknown) {
        return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
    enabled: isVisible
  })

  // Only show in development
  if (import.meta.env.PROD) return null

  const testAuth = async () => {
    const results: Record<string, unknown> = {}
    
    // Test token presence
    results.hasAccessToken = !!authStore.getAccessToken()
    results.hasRefreshToken = !!authStore.getRefreshToken()
    results.isAuthenticated = authStore.isAuthenticated()
    results.user = authStore.getUser()
    
    // Test API endpoints (using actual backend endpoints from API documentation)
    try {
      const userResponse = await api.get('/user/details/')
      results.userDetailsEndpoint = { success: true, data: userResponse.data }
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { status?: number } }
      results.userDetailsEndpoint = { success: false, error: err.message || 'Unknown error', status: err.response?.status }
    }
    
    try {
      const profileResponse = await api.get('/user/profile/')
      results.userProfileEndpoint = { success: true, data: profileResponse.data }
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { status?: number } }
      results.userProfileEndpoint = { success: false, error: err.message || 'Unknown error', status: err.response?.status }
    }
    
    try {
      const googleResponse = await api.get('/user/google/url/')
      results.googleOAuthUrl = { success: true, data: googleResponse.data }
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { status?: number } }
      results.googleOAuthUrl = { success: false, error: err.message || 'Unknown error', status: err.response?.status }
    }
    
    setTestResults(results)
  }

  const clearAuth = () => {
    authStore.clear()
    setTestResults({})
    window.location.reload()
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
        >
          Debug Auth
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Auth Debug Panel</CardTitle>
            <Button 
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex gap-2">
            <Button onClick={testAuth} size="sm" className="text-xs">Test Auth</Button>
            <Button onClick={clearAuth} size="sm" variant="destructive" className="text-xs">Clear Auth</Button>
          </div>
          
          {causesTest && (
            <div>
              <strong>Causes API:</strong>
              <Badge variant={causesTest.success ? 'default' : 'destructive'}>
                {causesTest.success ? `${causesTest.data?.count || 0} causes` : 'Failed'}
              </Badge>
            </div>
          )}
          
          {Object.entries(testResults).map(([key, value]) => (
            <div key={key} className="border-t pt-1">
              <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>
              <div className="text-xs text-slate-600 break-all">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}