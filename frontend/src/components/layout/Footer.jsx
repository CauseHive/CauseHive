import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Shield, Lock, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';


const footerLinks = {
  discover: [
    { label: 'Browse Causes', href: '/causes' },
    { label: 'Success Stories', href: '/stories' },
    { label: 'Impact Reports', href: '/impact' },
    { label: 'Featured Campaigns', href: '/featured' },
  ],
  support: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Help Center', href: '/help' },
    { label: 'Safety & Trust', href: '/safety' },
    { label: 'Contact Us', href: '/contact' },
  ],
  create: [
    { label: 'Start a Cause', href: '/causes/create' },
    { label: 'Fundraising Tips', href: '/tips' },
    { label: 'Creator Resources', href: '/resources' },
    { label: 'Marketing Tools', href: '/marketing' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Mission', href: '/mission' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refund' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/causehive', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/causehive', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/causehive', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/causehive', label: 'LinkedIn' },
];

const trustIndicators = [
  { 
    icon: Shield, 
    title: 'Verified & Secure',
    description: 'All campaigns are verified and payments are secured with industry-standard encryption'
  },
  { 
    icon: Lock, 
    title: 'Data Protection',
    description: 'Your personal information is protected with the highest security standards'
  },
  { 
    icon: Award, 
    title: 'Transparency First',
    description: 'Track every donation and see exactly how your contributions make an impact'
  },
];

export function Footer({ className }) {
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className={cn(
      "bg-white border-t border-neutral-200 mt-auto",
      className
    )}>
      {/* Trust Indicators Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div key={index} className="flex items-start space-x-3 text-center md:text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 mx-auto md:mx-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {indicator.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {indicator.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/favicon.ico" 
                alt="CauseHive Logo" 
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-xl font-bold text-primary-700">CauseHive</span>
            </Link>
            
            <p className="text-neutral-600 mb-6 max-w-sm">
              Empowering change-makers worldwide to create positive impact through 
              trusted, transparent fundraising campaigns.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-neutral-900">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" className="btn-primary">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-neutral-500">
                Get updates on featured causes and platform news.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Discover</h4>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Create</h4>
            <ul className="space-y-2">
              {footerLinks.create.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Email Support</p>
                <p className="text-sm text-neutral-600">support@causehive.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Phone Support</p>
                <p className="text-sm text-neutral-600">1-800-CAUSEHIVE</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900">Headquarters</p>
                <p className="text-sm text-neutral-600">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-neutral-200 bg-neutral-50">
        <div className="container mx-auto px-4 py-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-neutral-600">
              © {new Date().getFullYear()} CauseHive. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600 mr-2">Follow us:</span>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-primary-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-4 text-sm">
              {footerLinks.legal.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-neutral-300">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;