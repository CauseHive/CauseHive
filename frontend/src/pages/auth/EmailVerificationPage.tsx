import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/lib/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function EmailVerificationPage() {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!uidb64 || !token) throw new Error('Invalid verification link')
      return authService.verifyEmail(uidb64, token)
    },
    onSuccess: () => {
      setStatus('success')
    },
    onError: () => {
      setStatus('error')
    }
  })

  useEffect(() => {
    if (uidb64 && token) {
      verifyMutation.mutate()
    } else {
      setStatus('error')
    }
  }, [uidb64, token, verifyMutation])

  const handleResendVerification = () => {
    // This would require user email - redirect to login instead
    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'verifying' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-500" />
              <p>Verifying your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <div className="space-y-2">
                <h3 className="font-semibold text-green-700">Email Verified Successfully!</h3>
                <p className="text-sm text-slate-600">
                  Your email has been verified. You can now sign in to your account.
                </p>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full">
                Continue to Sign In
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <div className="space-y-2">
                <h3 className="font-semibold text-red-700">Verification Failed</h3>
                <p className="text-sm text-slate-600">
                  This verification link is invalid or has expired.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleResendVerification} variant="outline" className="w-full">
                  Go to Sign In
                </Button>
                <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
                  Return to Home
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}