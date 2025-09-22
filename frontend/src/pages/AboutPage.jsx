import React from 'react';
import { Heart, Users, Globe, Award, Target, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const stats = [
    { label: 'Causes Supported', value: '50,000+', icon: Heart },
    { label: 'Donors Worldwide', value: '2.5M+', icon: Users },
    { label: 'Countries Reached', value: '120+', icon: Globe },
    { label: 'Funds Raised', value: '$500M+', icon: Award },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every donation is tracked and every campaign is verified. We believe in complete transparency about where your money goes and how it makes an impact.'
    },
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We are driven by empathy and the belief that everyone deserves a chance to improve their life and help others in need.'
    },
    {
      icon: Target,
      title: 'Impact',
      description: 'We measure success by the real-world impact we create. Every campaign must demonstrate clear, measurable outcomes.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We foster a global community of givers and changemakers who support each other in creating positive change.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve our platform using the latest technology to make giving more effective and accessible.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'We connect causes and donors across borders, enabling worldwide collaboration for local and global challenges.'
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Former nonprofit executive with 15+ years in charitable sector leadership.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5fc?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO',
      bio: 'Tech veteran who previously built payment systems at major fintech companies.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Trust & Safety',
      bio: 'Expert in fraud prevention and regulatory compliance in the nonprofit space.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'David Kim',
      role: 'Head of Impact',
      bio: 'Social impact measurement specialist with PhD in Development Economics.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              About CauseHive
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connecting Hearts,
              <span className="text-yellow-300"> Creating Change</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              We're building the world's most trusted platform for charitable giving, 
              where every donation creates measurable impact and brings communities together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link to="/causes/create">Start a Cause</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Link to="/causes">Browse Causes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 mb-2">{stat.value}</div>
                  <div className="text-neutral-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-neutral-600 leading-relaxed">
              To democratize charitable giving by creating a transparent, secure, and efficient platform 
              that connects donors with verified causes, ensuring every contribution creates maximum impact 
              in communities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">Why We Started CauseHive</h3>
              <p className="text-neutral-600 mb-6">
                After witnessing countless instances of charitable fraud and inefficient fund distribution, 
                our founders knew there had to be a better way. Traditional charity platforms often lack 
                transparency, making it difficult for donors to track their impact.
              </p>
              <p className="text-neutral-600 mb-6">
                We built CauseHive to solve these problems by implementing blockchain-based tracking, 
                rigorous verification processes, and real-time impact reporting. Every donation is traceable, 
                every cause is verified, and every outcome is measured.
              </p>
              <Button asChild className="mt-4">
                <Link to="/how-it-works">
                  Learn How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              These principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{value.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We're a diverse team of technologists, nonprofit veterans, and social impact experts 
              united by a shared mission to make charitable giving more effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-neutral-600">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Whether you're looking to support a cause, start your own campaign, or join our team, 
            there are many ways to be part of the CauseHive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              <Link to="/register">Join as a Donor</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link to="/careers">View Careers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;