import React from 'react';
import { Search, UserCheck, Heart, BarChart3, Shield, CheckCircle, ArrowRight, Play, Target, Users, DollarSign, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  const donorSteps = [
    {
      icon: Search,
      title: 'Browse Causes',
      description: 'Explore thousands of verified causes across different categories like education, healthcare, environment, and disaster relief.',
      details: ['Filter by location, cause type, or impact area', 'View detailed campaign pages with photos and updates', 'Read reviews from other donors']
    },
    {
      icon: UserCheck,
      title: 'Choose & Verify',
      description: 'Select causes that align with your values. Every campaign is pre-verified by our trust and safety team.',
      details: ['See verification badges and trust scores', 'Review campaign goals and fund usage plans', 'Check organizer credentials and history']
    },
    {
      icon: Heart,
      title: 'Make Your Donation',
      description: 'Donate securely with multiple payment options. Choose to donate once or set up recurring contributions.',
      details: ['Secure payment processing with encryption', 'Option for one-time or monthly donations', 'Immediate confirmation and receipt']
    },
    {
      icon: BarChart3,
      title: 'Track Your Impact',
      description: 'Follow your donations and see real-time updates on how your contribution is making a difference.',
      details: ['Real-time progress updates', 'Impact reports with photos and metrics', 'Communication from campaign organizers']
    }
  ];

  const organizerSteps = [
    {
      icon: Target,
      title: 'Create Your Campaign',
      description: 'Set up your cause with compelling story, clear goals, and transparent fund usage plan.',
      details: ['Easy-to-use campaign builder', 'Upload photos and videos', 'Set funding goals and timeline']
    },
    {
      icon: Shield,
      title: 'Get Verified',
      description: 'Our team reviews your campaign to ensure legitimacy and compliance with our community guidelines.',
      details: ['Identity verification process', 'Campaign content review', 'Goal and plan validation']
    },
    {
      icon: Users,
      title: 'Share & Promote',
      description: 'Launch your campaign and share it with your network using our built-in social and marketing tools.',
      details: ['Social media integration', 'Email campaign tools', 'Promotional materials and templates']
    },
    {
      icon: DollarSign,
      title: 'Receive Funds',
      description: 'Withdraw funds as your campaign progresses and keep donors updated on your impact.',
      details: ['Secure fund transfers', 'Progress reporting tools', 'Direct donor communication']
    }
  ];

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Rigorous Verification',
      description: 'Every campaign undergoes thorough verification including identity checks, goal validation, and background screening.'
    },
    {
      icon: BarChart3,
      title: 'Real-time Tracking',
      description: 'Blockchain-based transaction tracking ensures complete transparency from donation to impact.'
    },
    {
      icon: Award,
      title: 'Impact Reporting',
      description: 'Regular impact reports with photos, metrics, and outcomes keep donors informed about their contribution.'
    }
  ];

  const faqs = [
    {
      question: 'How do you verify campaigns?',
      answer: 'We have a multi-step verification process including identity verification, background checks, goal validation, and ongoing monitoring. All organizers must provide valid identification and detailed plans for fund usage.'
    },
    {
      question: 'What fees do you charge?',
      answer: 'We charge a 2.9% + $0.30 platform fee per donation to cover payment processing, platform maintenance, and verification services. This is clearly displayed before donation.'
    },
    {
      question: 'How quickly do funds reach organizers?',
      answer: 'Once a campaign is verified and donations begin, organizers can withdraw funds on a rolling basis. First withdrawals typically take 7-10 days, with subsequent withdrawals processed within 2-3 business days.'
    },
    {
      question: 'What if a campaign doesn\'t meet its goal?',
      answer: 'Campaigns keep all funds raised, even if they don\'t reach their full goal. However, organizers are still expected to use funds as described and provide impact reports to donors.'
    },
    {
      question: 'How do I know my donation is making an impact?',
      answer: 'You\'ll receive regular updates from campaign organizers including photos, progress reports, and impact metrics. You can also view real-time progress on campaign pages.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              How It Works
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Secure,
              <span className="text-yellow-300"> Transparent</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Learn how CauseHive makes charitable giving more effective and trustworthy 
              for both donors and campaign organizers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Donors Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">For Donors</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              How to Support Causes You Care About
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Making a difference is easier than ever with our streamlined donation process 
              and comprehensive impact tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {donorSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {index < donorSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent transform translate-x-4"></div>
                  )}
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="bg-primary-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
                    </div>
                    <p className="text-neutral-600 mb-4">{step.description}</p>
                    <ul className="text-sm text-neutral-500 space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/causes">
                Start Browsing Causes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Organizers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">For Organizers</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Launch Your Campaign with Confidence
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Create compelling campaigns, build trust with donors, and achieve your fundraising goals 
              with our comprehensive platform and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {organizerSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {index < organizerSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-secondary-200 to-transparent transform translate-x-4"></div>
                  )}
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-secondary-600" />
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="bg-secondary-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
                    </div>
                    <p className="text-neutral-600 mb-4">{step.description}</p>
                    <ul className="text-sm text-neutral-500 space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-secondary-600 hover:bg-secondary-700">
              <Link to="/causes/create">
                Start Your Campaign
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Trust & Safety</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Built on Trust and Transparency
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We've implemented multiple layers of security and verification to ensure 
              your donations reach their intended destinations and create real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          <div className="bg-primary-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Have Questions About Our Process?
            </h3>
            <p className="text-neutral-600 mb-6">
              Learn more about our verification procedures, security measures, and platform policies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/safety">Trust & Safety Center</Link>
              </Button>
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-600">
              Quick answers to common questions about how CauseHive works.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">{faq.question}</h3>
                <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-neutral-600 mb-4">Still have questions?</p>
            <Button asChild variant="outline">
              <Link to="/help">Visit Help Center</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of people who are already creating positive change through CauseHive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              <Link to="/causes">Find a Cause</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link to="/causes/create">Start a Campaign</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;