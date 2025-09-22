import { Progress } from '../components/ui/progress';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Users, Target, Zap, CheckCircle, Star, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-neutral-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-white rounded-full p-1 shadow-sm border border-neutral-200 mb-6">
              <Badge variant="secondary" className="rounded-full py-1 px-3">
                <Shield className="h-4 w-4 mr-2 text-primary-600" />
                Trusted by 50,000+ donors
              </Badge>
              <span className="text-sm font-medium text-neutral-700 pr-2">Verified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Make a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                meaningful
              </span>{' '}
              difference today
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-2xl">
              Join thousands of changemakers supporting causes they care about. 
              Every donation is tracked, verified, and makes a real impact in communities worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg">
                <Link to="/register">
                  Start Making a Difference
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/causes">
                  <Play className="mr-2 h-5 w-5" />
                  Explore Causes
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-secondary-600" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-secondary-600" />
                <span>Impact Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-secondary-600" />
                <span>Transparent Reporting</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle>Clean Water for Villages</CardTitle>
                    <p className="text-sm text-neutral-500">Verified by Impact Partners</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Progress value={84} />
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 font-medium">$8,420 raised</span>
                    <span className="text-neutral-500">of $10,000</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Donate Now
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-neutral-500">
                <span>842 donors</span>
                <span>12 days left</span>
              </CardFooter>
            </Card>
            
            {/* Floating Trust Elements */}
            <div className="absolute -top-4 -right-4">
              <Badge variant="secondary" className="shadow-lg border border-neutral-100">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 w-6 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-neutral-700">+50 donors today</span>
                </div>
              </Badge>
            </div>
            
            <div className="absolute -bottom-4 -left-4">
              <Badge variant="secondary" className="shadow-lg border border-neutral-100">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-accent-500 fill-current" />
                  <span className="text-xs font-medium text-neutral-700">4.9/5 Trust Rating</span>
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Impact Metrics Component
function ImpactMetrics() {
  const [animatedValues, setAnimatedValues] = useState({
    totalRaised: 0,
    causesSupported: 0,
    donorsHelping: 0,
    countriesReached: 0
  });

  const finalValues = useMemo(() => ({
    totalRaised: 2400000,
    causesSupported: 1250,
    donorsHelping: 48000,
    countriesReached: 85
  }), []);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        totalRaised: Math.floor(finalValues.totalRaised * easeOutQuart),
        causesSupported: Math.floor(finalValues.causesSupported * easeOutQuart),
        donorsHelping: Math.floor(finalValues.donorsHelping * easeOutQuart),
        countriesReached: Math.floor(finalValues.countriesReached * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues(finalValues);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [finalValues]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return num >= 10000 ? `${Math.floor(num / 1000)}K` : num.toLocaleString();
    }
    return num.toString();
  };

  const metrics = [
    {
      value: formatNumber(animatedValues.totalRaised),
      label: 'Total Raised',
      subtitle: 'Verified donations',
      icon: Target,
      color: 'text-primary-600'
    },
    {
      value: animatedValues.causesSupported.toLocaleString(),
      label: 'Causes Supported',
      subtitle: 'Active campaigns',
      icon: Heart,
      color: 'text-secondary-600'
    },
    {
      value: animatedValues.donorsHelping.toLocaleString(),
      label: 'Donors Helping',
      subtitle: 'Trusted community',
      icon: Users,
      color: 'text-accent-600'
    },
    {
      value: animatedValues.countriesReached.toString(),
      label: 'Countries Reached',
      subtitle: 'Global impact',
      icon: Zap,
      color: 'text-primary-600'
    }
  ];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Real Impact, Real Numbers
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Every donation is tracked and verified. See the collective impact of our caring community.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl flex items-center justify-center">
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-neutral-700 mb-1">
                  {metric.label}
                </div>
                <div className="text-xs text-neutral-500">
                  {metric.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Causes Component
function FeaturedCauses() {
  const causes = [
    {
      id: 1,
      title: "Emergency Relief for Flood Victims",
      organization: "Global Relief Foundation",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
      raised: 15240,
      goal: 25000,
      category: "Disaster Relief",
      urgent: true
    },
    {
      id: 2,
      title: "Clean Water Wells for Rural Schools",
      organization: "Water for All Initiative",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      raised: 8420,
      goal: 12000,
      category: "Environment",
      urgent: false
    },
    {
      id: 3,
      title: "Educational Support for Children",
      organization: "Hope & Learning Center",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
      raised: 6750,
      goal: 10000,
      category: "Education",
      urgent: false
    },
    {
      id: 4,
      title: "Medical Supplies for Remote Clinics",
      organization: "Health Bridge International",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
      raised: 21500,
      goal: 30000,
      category: "Health",
      urgent: true
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900">Featured Causes</h2>
          <p className="text-lg text-neutral-600 mt-2">Projects that need your immediate attention.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {causes.map((cause) => (
            <Card key={cause.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <CardHeader className="p-0 relative">
                <img src={cause.image} alt={cause.title} className="w-full h-48 object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge variant={cause.urgent ? "destructive" : "secondary"}>{cause.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 h-14">{cause.title}</h3>
                <p className="text-sm text-neutral-500">by {cause.organization}</p>
                <div className="space-y-2">
                  <Progress value={(cause.raised / cause.goal) * 100} />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-neutral-800">${cause.raised.toLocaleString()} raised</span>
                    <span className="text-neutral-500">of ${cause.goal.toLocaleString()}</span>
                  </div>
                </div>
                <Button asChild className="w-full group-hover:bg-primary-700 transition-colors">
                  <Link to={`/causes/${cause.id}`} className="w-full">
                    View Cause
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/causes">Explore All Causes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Testimonials Component
function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Teacher & Monthly Donor",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5fc?w=64&h=64&fit=crop&crop=face",
      content: "CauseHive made it so easy to support education projects. I can see exactly how my donations help students get the books and supplies they need. The transparency is incredible.",
      rating: 5,
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Small Business Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      content: "As someone who values accountability, I love that every donation is tracked. I've supported 8 different causes and received updates on each one. This is how charity should work.",
      rating: 5,
    },
    {
      id: 3,
      name: "Dr. Amara Okafor",
      role: "Healthcare Professional",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face",
      content: "The medical relief campaigns I've supported through CauseHive have made real differences. Getting photos and reports from the field shows the genuine impact of our contributions.",
      rating: 5,
    }
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900">Trusted by Changemakers</h2>
          <p className="text-lg text-neutral-600 mt-2">Real stories from donors making a difference.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col">
              <CardContent className="p-6 flex-grow">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} />
                  ))}
                </div>
                <p className="text-neutral-700 italic">"{testimonial.content}"</p>
              </CardContent>
              <CardFooter className="p-6 bg-neutral-100">
                <div className="flex items-center">
                  <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Component
function HowItWorks() {
  const steps = [
    {
      icon: Target,
      title: "Discover Causes",
      description: "Browse vetted campaigns with full transparency.",
    },
    {
      icon: Shield,
      title: "Donate Securely",
      description: "Your donations are tracked and sent directly to the cause.",
    },
    {
      icon: CheckCircle,
      title: "See Your Impact",
      description: "Receive updates and reports on the projects you support.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900">How It Works</h2>
          <p className="text-lg text-neutral-600 mt-2">A simple, transparent, and effective way to give.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div key={index} className="p-8">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <step.icon className="h-10 w-10 text-primary-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/register">Start Donating</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Call To Action Component
function CallToAction() {
  return (
    <section className="py-20 bg-primary-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg text-primary-200 mb-8 max-w-2xl mx-auto">
          Join a community of givers and start supporting causes that matter to you. Your journey to creating a better world starts here.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/causes">Explore Causes</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary-600" asChild>
            <Link to="/register">Become a Fundraiser</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// FAQ Component
function Faq() {
  const faqs = [
    {
      question: "Is my donation secure?",
      answer: "Yes, all donations are processed through a secure payment gateway. We use industry-standard encryption to protect your financial information."
    },
    {
      question: "What percentage of my donation goes to the cause?",
      answer: "We are committed to transparency. 100% of your donation goes directly to the cause. We cover our operational costs through separate funding."
    },
    {
      question: "Can I get a tax receipt for my donation?",
      answer: "Yes, you will receive a tax-deductible receipt for every donation you make to a registered non-profit organization through our platform."
    },
    {
      question: "How do you verify the causes?",
      answer: "Our team conducts a thorough vetting process for every cause listed on our platform. This includes checking their legal status, financial health, and impact reports."
    }
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{faq.question}</h3>
              <p className="text-neutral-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <ImpactMetrics />
        <FeaturedCauses />
        <Testimonials />
        <HowItWorks />
        <CallToAction />
        <Faq />
      </main>
    </div>
  );
}