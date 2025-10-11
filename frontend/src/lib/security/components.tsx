/**
 * Mobile-First Security Components
 * Responsive authentication UI with enterprise security features
 */
import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Shield, Smartphone, AlertTriangle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { secureAuthStore } from './authStore'
import type { PasswordStrengthResult, MFAChallenge } from './types'

interface SecurePasswordInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  showStrength?: boolean
  className?: string
}

export function SecurePasswordInput({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Enter your password',
  required = true,
  showStrength = false,
  className = ''
}: SecurePasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState<PasswordStrengthResult>({
    score: 0,
    feedback: [],
    isValid: false
  })

  useEffect(() => {
    if (showStrength && value) {
      setStrength(checkPasswordStrength(value))
    }
  }, [value, showStrength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-gray-200'
    if (score === 1) return 'bg-red-500'
    if (score === 2) return 'bg-orange-500'
    if (score === 3) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return 'No password'
    if (score === 1) return 'Very weak'
    if (score === 2) return 'Weak'
    if (score === 3) return 'Good'
    return 'Strong'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="pr-12 transition-all duration-200 border-2 focus:border-emerald-500 focus:ring-emerald-500/20"
          autoComplete="new-password"
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Password strength:</span>
            <span className={`font-medium ${strength.score >= 3 ? 'text-emerald-600' : 'text-red-600'}`}>
              {getStrengthText(strength.score)}
            </span>
          </div>
          
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  level <= strength.score ? getStrengthColor(strength.score) : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {strength.feedback.length > 0 && (
            <ul className="text-xs text-gray-600 space-y-1">
              {strength.feedback.map((feedback, index) => (
                <li key={index} className="flex items-center gap-2">
                  <X className="w-3 h-3 text-red-500 flex-shrink-0" />
                  {feedback}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

interface MFAInputProps {
  challenge: MFAChallenge
  onVerify: (code: string) => void
  loading?: boolean
  error?: string
}

export function MFAInput({ challenge, onVerify, loading = false, error }: MFAInputProps) {
  const [code, setCode] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const expiresAt = new Date(challenge.expiresAt).getTime()
    const now = Date.now()
    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))
    setTimeRemaining(remaining)

    const interval = setInterval(() => {
      const newRemaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setTimeRemaining(newRemaining)
      
      if (newRemaining === 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [challenge.expiresAt])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) {
      onVerify(code)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getMFAIcon = () => {
    switch (challenge.type) {
      case 'totp':
        return <Smartphone className="w-5 h-5" />
      case 'sms':
        return <Smartphone className="w-5 h-5" />
      case 'email':
        return <Shield className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getMFADescription = () => {
    switch (challenge.type) {
      case 'totp':
        return 'Enter the 6-digit code from your authenticator app'
      case 'sms':
        return `Enter the code sent to ${challenge.maskedDestination}`
      case 'email':
        return `Enter the code sent to ${challenge.maskedDestination}`
      default:
        return 'Enter your verification code'
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
          {getMFAIcon()}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Two-Factor Authentication
        </h3>
        <p className="text-sm text-gray-600">
          {getMFADescription()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mfa-code" className="text-sm font-medium text-gray-700">
            Verification Code
          </Label>
          <Input
            id="mfa-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="text-center text-lg font-mono tracking-widest mt-1"
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Code expires in:</span>
          <span className={`font-mono ${timeRemaining < 60 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>

        <Button
          type="submit"
          disabled={code.length !== 6 || loading || timeRemaining === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify Code'
          )}
        </Button>
      </form>

      {timeRemaining === 0 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Request New Code
          </Button>
        </div>
      )}
    </div>
  )
}

interface SecurityStatusProps {
  className?: string
}

export function SecurityStatus({ className = '' }: SecurityStatusProps) {
  const [securityScore, setSecurityScore] = useState(0)
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    // Calculate security score based on various factors
    let score = 0
    const recs: string[] = []

    // Check if user has MFA enabled
  const user = secureAuthStore.getUser()
    if (user?.mfaEnabled) {
      score += 30
    } else {
      recs.push('Enable two-factor authentication')
    }

    // Check password age
    if (user?.lastPasswordChange) {
      const passwordAge = Date.now() - new Date(user.lastPasswordChange).getTime()
      const daysOld = passwordAge / (1000 * 60 * 60 * 24)
      if (daysOld < 90) {
        score += 20
      } else {
        recs.push('Update your password (older than 90 days)')
      }
    }

    // Check session security
    if (window.location.protocol === 'https:') {
      score += 20
    } else {
      recs.push('Use HTTPS connection')
    }

    // Check for trusted device
    const deviceId = localStorage.getItem('ch_device_id')
    if (deviceId) {
      score += 15
    }

    // Check for recent activity
    score += 15 // Base score for active session

    setSecurityScore(score)
    setRecommendations(recs)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Security Status</h3>
        <Badge 
          variant={securityScore >= 80 ? 'success' : securityScore >= 60 ? 'warning' : 'destructive'}
          className="font-medium"
        >
          {getScoreLabel(securityScore)}
        </Badge>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Security Score</span>
          <span className={`text-lg font-bold ${getScoreColor(securityScore)}`}>
            {securityScore}/100
          </span>
        </div>
        <Progress 
          value={securityScore} 
          className="h-2"
        />
      </div>

      {recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Recommendations to improve security:
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <Check className="w-4 h-4" />
          Your account security is excellent!
        </div>
      )}
    </div>
  )
}

/**
 * Helper function to check password strength
 */
function checkPasswordStrength(password: string): PasswordStrengthResult {
  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) score++
  else feedback.push('Use at least 8 characters')

  if (password.length >= 12) score++

  // Character variety
  if (/[a-z]/.test(password)) score++
  else feedback.push('Include lowercase letters')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Include uppercase letters')

  if (/[0-9]/.test(password)) score++
  else feedback.push('Include numbers')

  if (/[^A-Za-z0-9]/.test(password)) score++
  else feedback.push('Include special characters')

  // Common patterns
  if (/(.)\1{2,}/.test(password)) {
    score--
    feedback.push('Avoid repeated characters')
  }

  if (/^(password|123456|qwerty)/i.test(password)) {
    score = 0
    feedback.push('Avoid common passwords')
  }

  return {
    score: Math.max(0, Math.min(4, score)),
    feedback,
    isValid: score >= 3
  }
}