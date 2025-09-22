import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';

// Zod schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (credentials) => login(credentials.email, credentials.password),
    onSuccess: () => {
      const intendedPath = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      navigate(intendedPath);
    },
  });

  const onSubmit = (values) => {
    mutate(values);
  };

  return (
    <div className="app-background">
      <div className="app-background-overlay min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 content-container p-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <img src="/favicon.ico" alt="CauseHive Logo" className="h-12 w-12 rounded-xl" />
                <span className="ml-3 text-2xl font-bold text-neutral-900">CauseHive</span>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back</h2>
              <p className="text-neutral-600">Sign in to continue making a difference</p>
            </div>

            {/* Login Form using shadcn/ui */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Login Failed</AlertTitle>
                    <AlertDescription>
                      {error.message || "Please check your credentials and try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                           <Input type="email" placeholder="Enter your email" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Enter your password" 
                            {...field} 
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Forgot your password?
                  </Link>
                </div>

                <Button type="submit" disabled={isPending} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 text-lg font-semibold">
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign up for free
                </Link>
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-neutral-200">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-neutral-600">Secure & Trusted Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image/Content */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-secondary-600 items-center justify-center p-8">
           {/* Content from original file */}
        </div>
      </div>
    </div>
  );
}
