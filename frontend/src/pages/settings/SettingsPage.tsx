import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useToast } from '@/components/ui/toast'
import { useState } from 'react'
import { authStore } from '@/lib/auth'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Key, 
  Trash2, 
  Bell, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

type FormValues = z.infer<typeof schema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { notify } = useToast()
  const navigate = useNavigate()
  const { data, updateUser } = useUserProfile()
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isLoading = !data

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ 
    resolver: zodResolver(schema), 
    values: (data?.user as Partial<FormValues>) as FormValues | undefined 
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  })

  // Profile info mutation
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = { first_name: values.first_name, last_name: values.last_name }
      await updateUser.mutateAsync(payload)
      return payload
    },
    onSuccess: () => notify({ title: 'Profile updated successfully', variant: 'success' })
  })

  // Password change mutation
  const passwordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      const response = await api.post('/auth/change-password/', {
        old_password: values.current_password,
        new_password: values.new_password
      })
      return response.data
    },
    onSuccess: () => {
      notify({ title: 'Password changed successfully', variant: 'success' })
      resetPassword()
    },
    onError: (error: any) => {
      notify({ 
        title: 'Failed to change password', 
        description: error.response?.data?.error || 'Please check your current password',
        variant: 'error' 
      })
    }
  })

  // Account deletion mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/auth/user/')
    },
    onSuccess: () => {
      notify({ title: 'Account deleted successfully', variant: 'success' })
      authStore.clear()
      navigate('/', { replace: true })
    },
    onError: () => {
      notify({ title: 'Failed to delete account', variant: 'error' })
    }
  })

  // Notification preferences query
  const { data: notificationSettings } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      try {
        const response = await api.get('/notifications/settings/')
        return response.data
      } catch {
        return { email_notifications: true, push_notifications: true }
      }
    }
  })

  // Notification settings mutation
  const notificationMutation = useMutation({
    mutationFn: async (settings: { email_notifications: boolean; push_notifications: boolean }) => {
      await api.post('/notifications/settings/', settings)
      return settings
    },
    onSuccess: () => notify({ title: 'Notification settings updated', variant: 'success' })
  })

  if (isLoading && !data) return <div className="flex items-center justify-center min-h-64"><div>Loading settings…</div></div>

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your account preferences and security settings</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(v => mutation.mutate(v))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input 
                    id="first_name" 
                    {...register('first_name')}
                    className={errors.first_name ? 'border-red-500' : ''}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input 
                    id="last_name" 
                    {...register('last_name')}
                    className={errors.last_name ? 'border-red-500' : ''}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  disabled 
                  {...register('email')}
                  className="bg-slate-50 dark:bg-slate-900/40"
                />
                <p className="text-sm text-slate-500">Email cannot be changed. Contact support if needed.</p>
              </div>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {mutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Password & Security
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(v => passwordMutation.mutate(v))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current password</Label>
                <div className="relative">
                  <Input 
                    id="current_password" 
                    type={showPassword ? 'text' : 'password'}
                    {...registerPassword('current_password')}
                    className={passwordErrors.current_password ? 'border-red-500' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.current_password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {passwordErrors.current_password.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New password</Label>
                  <Input 
                    id="new_password" 
                    type="password"
                    {...registerPassword('new_password')}
                    className={passwordErrors.new_password ? 'border-red-500' : ''}
                  />
                  {passwordErrors.new_password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {passwordErrors.new_password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm new password</Label>
                  <Input 
                    id="confirm_password" 
                    type="password"
                    {...registerPassword('confirm_password')}
                    className={passwordErrors.confirm_password ? 'border-red-500' : ''}
                  />
                  {passwordErrors.confirm_password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {passwordErrors.confirm_password.message}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={passwordMutation.isPending}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50"
              >
                {passwordMutation.isPending ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email notifications</h4>
                  <p className="text-sm text-slate-600">Receive updates about your causes and donations via email</p>
                </div>
                <Button
                  variant={notificationSettings?.email_notifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => notificationMutation.mutate({
                    ...notificationSettings,
                    email_notifications: !notificationSettings?.email_notifications
                  })}
                  disabled={notificationMutation.isPending}
                >
                  {notificationSettings?.email_notifications ? (
                    <><CheckCircle className="h-4 w-4 mr-1" /> Enabled</>
                  ) : (
                    <><XCircle className="h-4 w-4 mr-1" /> Disabled</>
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Push notifications</h4>
                  <p className="text-sm text-slate-600">Get instant updates on your device</p>
                </div>
                <Button
                  variant={notificationSettings?.push_notifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => notificationMutation.mutate({
                    ...notificationSettings,
                    push_notifications: !notificationSettings?.push_notifications
                  })}
                  disabled={notificationMutation.isPending}
                >
                  {notificationSettings?.push_notifications ? (
                    <><CheckCircle className="h-4 w-4 mr-1" /> Enabled</>
                  ) : (
                    <><XCircle className="h-4 w-4 mr-1" /> Disabled</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">Delete Account</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                      Are you absolutely sure? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {deleteMutation.isPending ? 'Deleting…' : 'Yes, delete my account'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
