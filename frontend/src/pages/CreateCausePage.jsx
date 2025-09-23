import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Upload, Save, AlertCircle } from 'lucide-react';
import apiService from '../services';
import { useToast } from '../components/Toast/ToastProvider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

// Zod schema for cause creation validation
const formSchema = z.object({
  name: z.string()
    .min(3, "Cause name must be at least 3 characters long")
    .max(200, "Cause name must not exceed 200 characters"),
  description: z.string()
    .min(50, "Description must be at least 50 characters to help people understand your cause")
    .max(2000, "Description must not exceed 2000 characters"),
  target_amount: z.number()
    .min(10, "Target amount must be at least ₵10")
    .max(1000000, "Target amount must not exceed ₵1,000,000"),
  category: z.string()
    .min(1, "Please select a category for your cause"),
  cover_image: z.any()
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Image must be smaller than 5MB")
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), "Only JPG, JPEG, and PNG files are allowed")
});

const CreateCausePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [imagePreview, setImagePreview] = useState(null);

  // Initialize react-hook-form with validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      target_amount: 0,
      category: '',
      cover_image: null
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });

  // Create cause mutation
  const createCauseMutation = useMutation({
    mutationFn: (causeData) => apiService.createCause(causeData),
    onSuccess: () => {
      toast.success('Cause created successfully! It will be reviewed before going live.');
      queryClient.invalidateQueries({ queryKey: ['user-causes'] }); // Refresh user's causes list
      navigate('/my-causes');
    },
    onError: (error) => {
      console.error('Error creating cause:', error);
      toast.error('Failed to create cause. Please try again.');
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue('cover_image', file, { shouldValidate: true });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('cover_image', null);
      setImagePreview(null);
    }
  };

  const onSubmit = async (values) => {
    const userId = apiService.getStoredUserId();
    if (!userId) {
      toast.error('You must be logged in to create a cause');
      navigate('/login');
      return;
    }

    const causeData = {
      name: values.name,
      description: values.description,
      target_amount: values.target_amount,
      organizer_id: userId,
      category: values.category,
      cover_image: values.cover_image
    };

    createCauseMutation.mutate(causeData);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-causes')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to My Causes
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Cause</h1>
          <p className="text-gray-600">Share your cause with the community and start making a difference.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Cause Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cause Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a compelling name for your cause"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id.toString()}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Amount */}
              <FormField
                control={form.control}
                name="target_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount (₵) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your fundraising goal"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell people why your cause matters. Share your story, explain how donations will be used, and inspire others to support you."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cover Image */}
              <div>
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="cover_image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                      <input
                        id="cover_image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  
                  {imagePreview && (
                    <div className="relative w-full max-w-sm">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          form.setValue('cover_image', null);
                          document.getElementById('cover_image').value = '';
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createCauseMutation.isPending}
                  className="flex-1"
                >
                  {createCauseMutation.isPending ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Creating Cause...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Cause
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Review Process</h3>
              <p className="text-sm text-blue-700">
                All new causes undergo a review process to ensure they meet our community guidelines. 
                You'll be notified once your cause is approved and live on the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCausePage;