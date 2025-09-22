import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle, Building2, Users, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help within 24 hours',
      contact: 'support@causehive.com',
      action: 'mailto:support@causehive.com',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Mon-Fri, 9AM-6PM EST',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Available during business hours',
      contact: 'Start a conversation',
      action: '#',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const departments = [
    {
      icon: Users,
      title: 'General Support',
      description: 'Questions about using the platform',
      email: 'support@causehive.com'
    },
    {
      icon: Building2,
      title: 'Business Partnerships',
      description: 'Corporate partnerships and collaborations',
      email: 'partnerships@causehive.com'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Report fraud or safety concerns',
      email: 'safety@causehive.com'
    }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        company: ''
      });
      
      // Reset after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactMethod = (method) => {
    if (method.title === 'Live Chat') {
      alert('Opening live chat... This would integrate with a chat service like Intercom.');
    } else {
      window.location.href = method.action;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Have questions? Need support? Want to partner with us? 
              We're here to help and would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card 
                  key={index} 
                  className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleContactMethod(method)}
                >
                  <div className={`w-16 h-16 rounded-full ${method.color} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{method.title}</h3>
                  <p className="text-neutral-600 mb-4">{method.description}</p>
                  <p className="text-primary-600 font-medium">{method.contact}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Send us a Message</h2>
              
              {submitted ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-neutral-600">
                    We'll get back to you within 24 hours.
                  </p>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={contactForm.company}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={contactForm.category}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnerships">Business Partnerships</option>
                        <option value="press">Press & Media</option>
                        <option value="safety">Trust & Safety</option>
                        <option value="careers">Careers</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Company Info & Departments */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Other Ways to Reach Us</h2>
              
              {/* Departments */}
              <div className="space-y-6 mb-8">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  return (
                    <Card key={index} className="p-6">
                      <div className="flex items-start">
                        <div className="bg-primary-100 rounded-lg p-3 mr-4">
                          <Icon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1">{dept.title}</h3>
                          <p className="text-neutral-600 text-sm mb-2">{dept.description}</p>
                          <a 
                            href={`mailto:${dept.email}`}
                            className="text-primary-600 text-sm hover:underline"
                          >
                            {dept.email}
                          </a>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Office Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Our Office</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-neutral-400 mr-3" />
                    <div>
                      <p className="text-neutral-900">123 Innovation Drive</p>
                      <p className="text-neutral-600">San Francisco, CA 94107</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-neutral-400 mr-3" />
                    <div>
                      <p className="text-neutral-900">Business Hours</p>
                      <p className="text-neutral-600">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              Before You Contact Us
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
              Check out our help center for quick answers to common questions.
            </p>
            <Button asChild variant="outline">
              <a href="/help">Visit Help Center</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;