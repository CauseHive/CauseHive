import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';

// Zod schema for validation
const formSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  password2: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
}).refine(data => data.password === data.password2, {
  message: "Passwords do not match.",
  path: ["password2"], // path of error
});

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password2: '',
      acceptTerms: false,
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (userData) => register(userData),
    onSuccess: () => {
      navigate('/dashboard');
    },
  });

  const onSubmit = (values) => {
    mutate(values);
  };

  return (
    <div className="app-background">
      <div className="app-background-overlay min-h-screen flex">
        {/* Left Side - Hero */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary-600 to-accent-600 items-center justify-center p-8">
           {/* Content from original file */}
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6 content-container p-8">
            <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                    <img src="/favicon.ico" alt="CauseHive Logo" className="h-12 w-12 rounded-xl" />
                    <span className="ml-3 text-2xl font-bold text-neutral-900">CauseHive</span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Create your account</h2>
                <p className="text-neutral-600">Join our community of changemakers</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Registration Failed</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="first_name" render={({ field }) => (
                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="last_name" render={({ field }) => (
                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" {...field} />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-5 w-5 text-neutral-400" /> : <Eye className="h-5 w-5 text-neutral-400" />}
                        </button>
                    </div></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="password2" render={({ field }) => (
                    <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><div className="relative">
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" {...field} />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-neutral-400" /> : <Eye className="h-5 w-5 text-neutral-400" />}
                        </button>
                    </div></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="acceptTerms" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Accept terms and conditions</FormLabel>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">
                                You agree to our <Link to="/terms" className="text-primary-600">Terms</Link> and <Link to="/privacy" className="text-primary-600">Privacy Policy</Link>.
                            </p>
                        </div>
                    </FormItem>
                )} />

                <Button type="submit" disabled={isPending} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 text-lg font-semibold">
                  {isPending ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <p className="text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
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
      </div>
    </div>
  );
}
