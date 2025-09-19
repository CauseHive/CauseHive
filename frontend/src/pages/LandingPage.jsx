import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Users, Target, Zap, CheckCircle, Star, Play, Quote } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

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
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-neutral-200 mb-6">
              <Shield className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Trusted by 50,000+ donors</span>
              <Badge variant="secondary" className="text-xs">Verified</Badge>
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
              <Button 
                asChild
                size="lg" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold"
              >
                <Link to="/register">
                  Start Making a Difference
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-2 border-primary-200 text-primary-700 hover:bg-primary-50 px-8 py-4 text-lg font-semibold"
              >
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutral-100">
              {/* Sample Cause Card */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Clean Water for Villages</h3>
                    <p className="text-sm text-neutral-500">Verified by Impact Partners</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">$8,420 raised</span>
                    <span className="text-neutral-600">of $10,000 goal</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full w-4/5"></div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>842 donors</span>
                    <span>12 days left</span>
                  </div>
                </div>
                
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold">
                  Donate Now
                </Button>
              </div>
            </div>
            
            {/* Floating Trust Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-neutral-100">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-6 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-xs font-medium text-neutral-700">+50 donors today</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-neutral-100">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-accent-500 fill-current" />
                <span className="text-xs font-medium text-neutral-700">4.9/5 Trust Rating</span>
              </div>
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
      description: "Providing immediate shelter, food, and medical aid to families affected by severe flooding.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
      raised: 15240,
      goal: 25000,
      donors: 312,
      daysLeft: 8,
      verified: true,
      urgent: true
    },
    {
      id: 2,
      title: "Clean Water Wells for Rural Schools",
      organization: "Water for All Initiative",
      description: "Building sustainable water systems to provide clean drinking water for 500+ students.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      raised: 8420,
      goal: 12000,
      donors: 156,
      daysLeft: 23,
      verified: true,
      urgent: false
    },
    {
      id: 3,
      title: "Educational Support for Underprivileged Children",
      organization: "Hope & Learning Center",
      description: "Providing school supplies, books, and learning resources for children in underserved communities.",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
      raised: 6750,
      goal: 10000,
      donors: 89,
      daysLeft: 15,
      verified: true,
      urgent: false
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Featured Causes
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            Support verified causes making real impact around the world. Every donation is tracked and goes directly to those in need.
          </p>
          <Link to="/causes">
            <Button variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50">
              View All Causes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause) => {
            const progressPercentage = (cause.raised / cause.goal) * 100;
            
            return (
              <div key={cause.id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {cause.verified && (
                      <Badge className="bg-secondary-100 text-secondary-700 border-secondary-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {cause.urgent && (
                      <Badge className="bg-accent-100 text-accent-700 border-accent-200">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-neutral-900 text-lg mb-2 line-clamp-2">
                      {cause.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-2">{cause.organization}</p>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {cause.description}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-neutral-900">
                        ${cause.raised.toLocaleString()} raised
                      </span>
                      <span className="text-neutral-600">
                        of ${cause.goal.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-neutral-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>{cause.donors} donors</span>
                      <span>{cause.daysLeft} days left</span>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Now
                  </Button>
                </div>
              </div>
            );
          })}
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
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Small Business Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      content: "As someone who values accountability, I love that every donation is tracked. I've supported 8 different causes and received updates on each one. This is how charity should work.",
      rating: 5,
      location: "Austin, TX"
    },
    {
      id: 3,
      name: "Dr. Amara Okafor",
      role: "Healthcare Professional",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face",
      content: "The medical relief campaigns I've supported through CauseHive have made real differences. Getting photos and reports from the field shows the genuine impact of our contributions.",
      rating: 5,
      location: "Chicago, IL"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Trusted by Thousands of Changemakers
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Real stories from donors who have experienced the joy of making a meaningful difference through our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
              {/* Rating */}
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent-500 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <div className="mb-6">
                <Quote className="h-8 w-8 text-primary-200 mb-3" />
                <p className="text-neutral-700 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Profile */}
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full border-2 border-white shadow-sm mr-4"></div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  <p className="text-xs text-neutral-400">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicator */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-sm border border-neutral-200">
            <Shield className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-neutral-700">4.9/5 average rating from 12,000+ verified donors</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// How It Works Component
function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Discover Verified Causes",
      description: "Browse through carefully vetted campaigns with complete transparency about goals, progress, and impact.",
      icon: Target,
      color: "primary"
    },
    {
      step: 2,
      title: "Donate with Confidence",
      description: "Make secure donations knowing every dollar is tracked and 100% goes directly to the cause you support.",
      icon: Shield,
      color: "secondary"
    },
    {
      step: 3,
      title: "Track Your Impact",
      description: "Receive regular updates with photos, reports, and data showing exactly how your contribution is making a difference.",
      icon: Heart,
      color: "accent"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Making a difference has never been easier. Our simple, transparent process ensures your donations create maximum impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const colorMap = {
              primary: 'text-primary-600 bg-primary-100',
              secondary: 'text-secondary-600 bg-secondary-100',
              accent: 'text-accent-600 bg-accent-100'
            };

            return (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {!isLast && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neutral-200 to-transparent transform -translate-x-4 z-0"></div>
                )}

                {/* Step card */}
                <div className="relative bg-white rounded-2xl p-8 text-center border border-neutral-100 hover:shadow-lg transition-shadow z-10">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full text-lg font-bold text-neutral-700 mb-6">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`h-16 w-16 ${colorMap[step.color]} rounded-2xl flex items-center justify-center`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold">
            <Link to="/register">
              Start Making a Difference
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-neutral-500 mt-4">Join 48,000+ donors creating positive change worldwide</p>
        </div>
      </div>
    </section>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ImpactMetrics />
      <FeaturedCauses />
      <Testimonials />
      <HowItWorks />
    </div>
  );
}