import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useDonationCart } from '../contexts/DonationCartContext';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  donorName: z.string(),
  donorEmail: z.string().email(),
  isAnonymous: z.boolean(),
  paymentMethod: z.enum(['mobile_money', 'credit_card']),
  mobileNumber: z.string().optional(),
  comments: z.string().optional(),
}).refine(data => !data.isAnonymous ? (data.donorName && data.donorName.trim().length >= 2) : true, {
  message: "Full name must be at least 2 characters for non-anonymous donations.",
  path: ["donorName"],
}).refine(data => !data.isAnonymous ? (data.donorEmail && data.donorEmail.trim().length > 0) : true, {
  message: "Email is required for non-anonymous donations.",
  path: ["donorEmail"],
}).refine(data => data.paymentMethod === 'mobile_money' ? (data.mobileNumber && /^(0[235][0-9]{8}|\+233[235][0-9]{8})$/.test(data.mobileNumber.replace(/\s+/g, ''))) : true, {
  message: "Please enter a valid Ghana mobile number (e.g., 024 123 4567 or +233 24 123 4567).",
  path: ["mobileNumber"],
}).refine(data => data.paymentMethod === 'credit_card', {
  message: "Credit card payments are currently being set up. Please use Mobile Money for now.",
  path: ["paymentMethod"],
});

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useDonationCart();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: user?.name || '',
      donorEmail: user?.email || '',
      isAnonymous: false,
      paymentMethod: 'mobile_money',
      mobileNumber: user?.phone || '',
      comments: '',
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (formData) => {
      const donationPromises = items.map(item => 
        apiService.donate({
          email: formData.isAnonymous ? 'anonymous@causehive.com' : formData.donorEmail,
          cause_id: item.causeId,
          donation_amount: item.amount,
        })
      );
      return Promise.all(donationPromises);
    },
    onSuccess: (results) => {
      clearCart();
      navigate('/donation/success', { state: { totalAmount, transactions: results.length } });
    },
  });

  const onSubmit = (values) => mutate(values);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/cart')}><ArrowLeft className="h-5 w-5 mr-2" /> Back to Cart</Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Donor Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="isAnonymous" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Make this donation anonymously</FormLabel></FormItem>
                  )} />
                  {!form.watch('isAnonymous') && (
                    <div className="space-y-4">
                      <FormField control={form.control} name="donorName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="donorEmail" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                      <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="mobile_money" /></FormControl><FormLabel>Mobile Money</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="credit_card" /></FormControl><FormLabel>Credit/Debit Card</FormLabel></FormItem>
                    </RadioGroup>
                  )} />
                  {form.watch('paymentMethod') === 'mobile_money' && (
                    <div className="mt-4 pl-6 border-l-2">
                      <FormField control={form.control} name="mobileNumber" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" placeholder="024 123 4567" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Additional Comments (Optional)</CardTitle></CardHeader>
                <CardContent><FormField control={form.control} name="comments" render={({ field }) => (<FormItem><FormControl><Textarea placeholder="Any message..." {...field} /></FormControl></FormItem>)} /></CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader><CardTitle>Donation Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (<div key={item.causeId} className="flex justify-between"><p className="truncate">{item.causeName}</p><p>GH₵{item.amount.toFixed(2)}</p></div>))}
                  <div className="border-t pt-3 font-bold flex justify-between"><span>Total</span><span>GH₵{totalAmount.toFixed(2)}</span></div>
                  <Button type="submit" className="w-full gap-2" size="lg" disabled={isPending}>{isPending ? 'Processing...' : <><Lock className="h-4 w-4" /> Complete Donation</>}</Button>
                  {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error.message}</AlertDescription></Alert>}
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
    </div>
  );
}

export default CheckoutPage;