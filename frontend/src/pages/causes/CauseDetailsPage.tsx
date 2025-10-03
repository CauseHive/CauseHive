import { useParams } from 'react-router-dom'
import { useCause } from '@/hooks/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HeartHandshake, Users, MapPin, Target, Award, Clock, Share2, ExternalLink } from 'lucide-react'
import type { CauseDetailResponse } from '@/lib/services/causes.service'

// Mock cause data for demonstration
const mockCauseData: Record<string, CauseDetailResponse> = {
  '1': {
    id: '1',
    title: 'Rural School Library Project',
    description: `Building educational futures in Northern Ghana with a comprehensive library for over 200 students. This project aims to create a modern learning environment that will serve the Tamale community for generations to come.

Our goals include:
• Establishing a 500-square-meter library facility
• Stocking 5,000+ books covering all subjects
• Installing modern computer workstations with internet access
• Creating dedicated study spaces for students
• Training local teachers in library management

This initiative directly addresses the critical shortage of educational resources in rural Northern Ghana, where many schools lack basic learning materials. By creating this library, we're not just building a physical space – we're investing in the future of an entire community.`,
    target_amount: 12000,
    current_amount: 8500,
    progress_percentage: 71,
    status: 'live',
    category: {
      id: '1',
      name: 'Education',
      description: 'Educational projects and initiatives'
    },
    creator: {
      id: '1',
      full_name: 'Ghana Education Initiative',
      profile_picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
    deadline: '2024-06-15T23:59:59Z',
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    gallery: [],
    donation_count: 127,
    is_featured: true,
    tags: ['education', 'library', 'rural'],
    updates: [
      {
        id: '1',
        title: 'Foundation Work Completed',
        description: 'The foundation for the library building has been successfully laid. Local masons have completed the groundwork and the site is ready for construction to begin.',
        created_at: '2024-02-01T14:30:00Z'
      },
      {
        id: '2',
        title: 'Community Meeting Held',
        description: 'Met with local community leaders and parents to discuss the project timeline and gather input on book selections and facility design.',
        created_at: '2024-02-15T10:00:00Z'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Community Health Clinic',
    description: `Establishing a modern health clinic in rural Eastern Region to serve 500+ families. This comprehensive healthcare facility will provide essential medical services to communities that currently lack access to basic healthcare.

The clinic will include:
• General consultation rooms
• Maternity and pediatric care facilities
• Basic laboratory services
• Pharmacy with essential medications
• Emergency response capabilities
• Health education programs

This project addresses the critical healthcare gap in rural Eastern Ghana, where many communities travel hours to reach the nearest medical facility. By bringing healthcare directly to these communities, we're saving lives and improving health outcomes.`,
    target_amount: 25000,
    current_amount: 18750,
    progress_percentage: 75,
    status: 'live',
    category: {
      id: '2',
      name: 'Healthcare',
      description: 'Healthcare and medical projects'
    },
    creator: {
      id: '2',
      full_name: 'Eastern Health Alliance',
      profile_picture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    },
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-25T09:15:00Z',
    deadline: '2024-08-10T23:59:59Z',
    featured_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    gallery: [],
    donation_count: 89,
    is_featured: false,
    tags: ['healthcare', 'clinic', 'rural'],
    updates: [
      {
        id: '3',
        title: 'Land Acquisition Complete',
        description: 'Successfully acquired the land for the clinic construction. The site is located in the heart of the community for maximum accessibility.',
        created_at: '2024-01-25T09:15:00Z'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Clean Water Initiative',
    description: `Installing borehole wells and water purification systems for three villages in the Volta Region. This project will provide clean, safe drinking water to over 2,000 community members who currently rely on contaminated water sources.

Project components:
• Drilling and equipping 5 borehole wells
• Installing solar-powered water pumps
• Setting up water purification systems
• Building community water collection points
• Implementing water quality monitoring
• Community education on water hygiene

Clean water is fundamental to health, education, and economic development. This project will dramatically improve the quality of life for entire communities.`,
    target_amount: 15000,
    current_amount: 9200,
    progress_percentage: 61,
    status: 'live',
    category: {
      id: '3',
      name: 'Water & Sanitation',
      description: 'Water and sanitation projects'
    },
    creator: {
      id: '3',
      full_name: 'Volta Water Project',
      profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-20T11:45:00Z',
    deadline: '2024-05-08T23:59:59Z',
    featured_image: 'https://images.unsplash.com/photo-1541544537156-7627a7ce10c6?w=800&h=400&fit=crop',
    gallery: [],
    donation_count: 156,
    is_featured: true,
    tags: ['water', 'sanitation', 'rural'],
    updates: [
      {
        id: '4',
        title: 'Geological Survey Complete',
        description: 'Completed geological survey of the target areas. Identified optimal locations for borehole drilling with high water yield potential.',
        created_at: '2024-01-20T11:45:00Z'
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Women\'s Entrepreneurship Program',
    description: `Empowering 50 women in Accra with skills training and startup capital for sustainable businesses. This comprehensive program combines business education, mentorship, and financial support to help women launch and grow successful enterprises.

Program features:
• 6-month intensive business training
• One-on-one mentorship with successful entrepreneurs
• Startup capital grants up to ₵5,000 each
• Access to shared workspace facilities
• Marketing and sales training
• Financial literacy education

By investing in women entrepreneurs, we're not just creating businesses – we're building economic independence and community leadership.`,
    target_amount: 8000,
    current_amount: 6400,
    progress_percentage: 80,
    status: 'live',
    category: {
      id: '4',
      name: 'Economic Development',
      description: 'Economic development and entrepreneurship'
    },
    creator: {
      id: '2',
      full_name: 'Women\'s Economic Empowerment Network',
      profile_picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face'
    },
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-02-01T13:20:00Z',
    deadline: '2024-04-12T23:59:59Z',
    featured_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    gallery: [],
    donation_count: 73,
    is_featured: false,
    tags: ['women', 'entrepreneurship', 'training'],
    updates: [
      {
        id: '5',
        title: 'First Cohort Selected',
        description: 'Completed the application and selection process for the first cohort of 50 women entrepreneurs. Diverse group representing various industries and backgrounds.',
        created_at: '2024-02-01T13:20:00Z'
      }
    ]
  },
  '5': {
    id: '5',
    title: 'Youth Sports Complex',
    description: `Building a modern sports facility for underprivileged youth in Tema to promote healthy lifestyles. This comprehensive sports complex will provide recreational opportunities and develop athletic talent in the community.

Facility features:
• Full-size soccer field with artificial turf
• Basketball and volleyball courts
• Indoor gymnasium for year-round activities
• Fitness center with modern equipment
• Changing rooms and showers
• Coaching programs and youth development

Physical activity is essential for youth development. This facility will keep young people engaged in positive activities while developing their physical and leadership skills.`,
    target_amount: 30000,
    current_amount: 15600,
    progress_percentage: 52,
    status: 'live',
    category: {
      id: '5',
      name: 'Youth Development',
      description: 'Youth development and sports programs'
    },
    creator: {
      id: '3',
      full_name: 'Tema Youth Sports Foundation',
      profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-18T15:30:00Z',
    deadline: '2024-09-05T23:59:59Z',
    featured_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
    gallery: [],
    donation_count: 203,
    is_featured: true,
    tags: ['youth', 'sports', 'development'],
    updates: [
      {
        id: '6',
        title: 'Architectural Plans Finalized',
        description: 'Completed detailed architectural plans for the sports complex. The design incorporates sustainable materials and energy-efficient systems.',
        created_at: '2024-01-18T15:30:00Z'
      }
    ]
  },
  '6': {
    id: '6',
    title: 'Agricultural Training Center',
    description: `Creating a training facility to teach modern farming techniques to 100+ farmers in Ashanti Region. This center will revolutionize agricultural practices and improve food security in the region.

Center features:
• Modern classroom facilities
• Demonstration farms with various crops
• Irrigation system training
• Equipment maintenance workshops
• Seed bank and storage facilities
• Market linkage programs

Sustainable agriculture is key to Ghana's food security and economic development. This training center will equip farmers with the knowledge and skills needed for modern, profitable farming.`,
    target_amount: 18000,
    current_amount: 11200,
    progress_percentage: 62,
    status: 'live',
    category: {
      id: '6',
      name: 'Agriculture',
      description: 'Agricultural development and training'
    },
    creator: {
      id: '4',
      full_name: 'Ashanti Agricultural Development Institute',
      profile_picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    created_at: '2024-01-03T13:10:00Z',
    updated_at: '2024-01-22T10:15:00Z',
    deadline: '2024-07-03T23:59:59Z',
    featured_image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=400&fit=crop',
    gallery: [],
    donation_count: 94,
    is_featured: false,
    tags: ['agriculture', 'training', 'farming'],
    updates: [
      {
        id: '7',
        title: 'Pilot Program Launched',
        description: 'Successfully launched a pilot training program with 25 farmers. Initial results show significant improvements in crop yields and farming techniques.',
        created_at: '2024-01-22T10:15:00Z'
      }
    ]
  }
}

export function CauseDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useCause(id!)

  // Use mock data if API fails or no data, or if it's a mock cause ID
  const causeData = data || mockCauseData[id as keyof typeof mockCauseData]

  if (isLoading && !causeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError && !causeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <ExternalLink className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Cause Not Found</h2>
            <p className="text-gray-600 mb-6">The cause you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!causeData) return null

  const progress = causeData.progress_percentage || 0
  const daysLeft = causeData.deadline ? Math.ceil((new Date(causeData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-emerald-50 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  {causeData.category?.name}
                </Badge>
                {causeData.is_featured && (
                  <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {causeData.title}
              </h1>
              <p className="text-xl text-emerald-100 leading-relaxed">
                {causeData.description.split('\n')[0]}
              </p>
              <div className="flex items-center gap-6 text-emerald-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Ghana</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{causeData.donation_count || 0} donors</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={causeData.featured_image}
                alt={causeData.title}
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    ₵{causeData.current_amount?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    of ₵{causeData.target_amount?.toLocaleString() || 0} raised
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Funding Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-emerald-600">
                    ₵{causeData.current_amount?.toLocaleString() || 0}
                  </span>
                  <span className="text-gray-600">
                    of ₵{causeData.target_amount?.toLocaleString() || 0}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progress.toFixed(1)}% funded</span>
                  {daysLeft !== null && daysLeft > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {daysLeft} days left
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  {causeData.description.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            {causeData.updates && causeData.updates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {causeData.updates.map((update: CauseDetailResponse['updates'][0]) => (
                    <div key={update.id} className="border-l-4 border-emerald-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{update.title}</h4>
                      <p className="text-gray-600 mt-1">{update.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(update.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donate Card */}
            <Card className="border-2 border-emerald-200">
              <CardContent className="p-6">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold mb-4">
                  <HeartHandshake className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Secure payment via mobile money
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            {causeData.creator && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={causeData.creator.profile_picture}
                      alt={causeData.creator.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{causeData.creator.full_name}</h4>
                      <p className="text-sm text-gray-600">Project creator and organizer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="default">{causeData.category?.name}</Badge>
                </div>
                <hr className="my-3 border-gray-200" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {causeData.status === 'live' ? 'Active' : causeData.status}
                  </Badge>
                </div>
                <hr className="my-3 border-gray-200" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Started</span>
                  <span className="text-sm">
                    {new Date(causeData.created_at).toLocaleDateString()}
                  </span>
                </div>
                {causeData.deadline && (
                  <>
                    <hr className="my-3 border-gray-200" />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline</span>
                      <span className="text-sm">
                        {new Date(causeData.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardContent className="p-6">
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share This Cause
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
