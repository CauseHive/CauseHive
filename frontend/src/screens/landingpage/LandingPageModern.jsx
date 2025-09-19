import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';
import { ArrowRight, Heart, Users, Globe } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { AccessibleHeading, ScreenReaderOnly } from '../../components/common/AccessibilityUtils';
import NewHeroImage1 from './assets/New_Hero_Section_Image1.png';
import HeroImage2 from './assets/Hero_Section_Image2.png';
import Section3Image1 from './assets/Section_3_image1.png';
import Section3Image2 from './assets/Section_3_image2.png';
import Section3Image3 from './assets/Section_3_image3.png';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';
import Section8 from './Section8';
import Section9 from './Section9';
import Section10 from './Section10';

/**
 * Modern Landing Page Component
 * Refactored with shadcn/ui components and enterprise-grade design
 */
const LandingPage = () => {
  return (
    <>
      <SEO
        title="CauseHive - Empowering Communities Through Crowdfunding"
        description="Join CauseHive to support meaningful causes, create fundraising campaigns, and make a positive impact in your community. Transparent, secure, and community-driven crowdfunding platform."
        keywords="crowdfunding, fundraising, charity, donations, causes, community, social impact, nonprofit, fundraiser, campaign"
        type="website"
        url="https://causehive.com"
        image="https://causehive.com/images/hero-banner.jpg"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Modern Navigation */}
        <nav 
          className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link 
                to="/" 
                className="text-2xl font-display font-bold text-causehive-primary"
                aria-label="CauseHive homepage"
              >
              CauseHive.
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-foreground hover:text-causehive-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                to="/causelistpage" 
                className="text-foreground hover:text-causehive-primary transition-colors font-medium flex items-center gap-1"
              >
                Services
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link 
                to="/signup" 
                className="text-foreground hover:text-causehive-primary transition-colors font-medium flex items-center gap-1"
              >
                Join us
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link 
                to="#contact" 
                className="text-foreground hover:text-causehive-primary transition-colors font-medium"
              >
                Contact us
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/sign-in">Log in</Link>
              </Button>
              <Button variant="donate" asChild>
                <Link to="/causelistpage">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                  Seeking Financial Aid for{' '}
                  <span className="text-causehive-primary">Medical Emergencies</span>{' '}
                  or <span className="text-causehive-secondary">Social Causes</span>?
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Join thousands of changemakers making a real difference in communities worldwide. 
                  Every donation creates ripples of positive impact.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="request" asChild>
                  <Link to="/causes/create">
                    <Users className="h-5 w-5 mr-2" />
                    REQUEST DONATION
                  </Link>
                </Button>
                <Button size="xl" variant="donate" asChild>
                  <Link to="/causelistpage">
                    <Heart className="h-5 w-5 mr-2" />
                    DONATE AND HELP
                  </Link>
                </Button>
              </div>

              {/* Impact Stats */}
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-causehive-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Lives Changed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-causehive-secondary">$50K+</div>
                  <div className="text-sm text-muted-foreground">Funds Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-causehive-accent">25+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>

              <h2 className="text-xl font-display font-semibold text-causehive-dark flex items-center gap-2">
                <Globe className="h-5 w-5 text-causehive-primary" />
                Change lives and communities
              </h2>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={NewHeroImage1} 
                  alt="Volunteers making a difference in their community" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating impact card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-causehive-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-causehive-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Real Impact</div>
                    <div className="text-sm text-muted-foreground">Every dollar matters</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Why Choose CauseHive?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building bridges between those who need help and those ready to help
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <img 
                src={Section3Image1} 
                alt="Transparent fundraising process" 
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
              <h3 className="text-xl font-display font-semibold text-foreground">
                Transparent Process
              </h3>
              <p className="text-muted-foreground">
                Track every donation and see exactly how your contribution makes a difference
              </p>
            </div>

            <div className="text-center space-y-4">
              <img 
                src={Section3Image2} 
                alt="Global community of supporters" 
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
              <h3 className="text-xl font-display font-semibold text-foreground">
                Global Community
              </h3>
              <p className="text-muted-foreground">
                Join thousands of supporters worldwide making positive changes together
              </p>
            </div>

            <div className="text-center space-y-4">
              <img 
                src={Section3Image3} 
                alt="Secure and reliable platform" 
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
              <h3 className="text-xl font-display font-semibold text-foreground">
                Secure & Reliable
              </h3>
              <p className="text-muted-foreground">
                Bank-grade security ensures your donations reach the right people safely
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
    </div>
    </>
  );
};

export default LandingPage;