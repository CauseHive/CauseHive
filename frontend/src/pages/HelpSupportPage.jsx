import React, { useState } from 'react';
import { Search, Mail, MessageCircle, Phone, Book, FileText, AlertCircle, CheckCircle, User, CreditCard, Plus, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: '',
    message: '',
    email: ''
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const supportCategories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'account', label: 'Account & Profile', icon: User },
    { id: 'donations', label: 'Donations & Payments', icon: CreditCard },
    { id: 'causes', label: 'Creating Causes', icon: Plus },
    { id: 'technical', label: 'Technical Issues', icon: AlertCircle },
  ];

  const faqItems = [
    {
      id: 1,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to Settings > Profile to update your personal information, profile picture, and account preferences.'
    },
    {
      id: 2,
      category: 'donations',
      question: 'How do I make a donation?',
      answer: 'Browse causes, click on one you want to support, enter your donation amount, and follow the secure payment process.'
    },
    {
      id: 3,
      category: 'donations',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards, debit cards, and bank transfers through our secure payment processor Paystack.'
    },
    {
      id: 4,
      category: 'causes',
      question: 'How do I create a new cause?',
      answer: 'Click "Create Cause" in the sidebar, fill out the detailed form with your cause information, upload images, and submit for admin approval.'
    },
    {
      id: 5,
      category: 'causes',
      question: 'How long does cause approval take?',
      answer: 'Cause approval typically takes 1-3 business days. You\'ll receive an email notification once your cause is reviewed.'
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I change my password?',
      answer: 'Go to Settings > Security to change your password. You\'ll need to enter your current password first.'
    },
    {
      id: 7,
      category: 'technical',
      question: 'The website is running slowly. What should I do?',
      answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. Contact support if issues persist.'
    },
    {
      id: 8,
      category: 'donations',
      question: 'Can I get a receipt for my donation?',
      answer: 'Yes! You can download receipts from your Dashboard > Donation History or check your email for automatic receipts.'
    }
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: Mail,
      action: 'support@causehive.com',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      action: 'Start Chat',
      color: 'bg-green-50 text-green-700'
    },
    {
      title: 'Phone Support',
      description: 'Call us during business hours',
      icon: Phone,
      action: '+1 (555) 123-4567',
      color: 'bg-purple-50 text-purple-700'
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Contact button handlers
  const handleContactAction = (option) => {
    switch(option.title) {
      case 'Email Support':
        window.location.href = `mailto:${option.action}`;
        break;
      case 'Live Chat':
        // In a real app, this would open a chat widget
        alert('Opening live chat... This would integrate with a chat service like Intercom or Zendesk.');
        break;
      case 'Phone Support':
        window.location.href = `tel:${option.action}`;
        break;
      default:
        console.log('Contact action:', option);
    }
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormSubmitted(true);
      setContactForm({
        subject: '',
        category: '',
        message: '',
        email: ''
      });
      
      // Reset form submitted status after 5 seconds
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Find answers to your questions and get the help you need
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.title} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${option.color} mr-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{option.title}</h3>
                    <p className="text-sm text-neutral-600">{option.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleContactAction(option)}
                >
                  {option.action}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {supportCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Frequently Asked Questions
          </h2>
          
          {filteredFAQs.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No results found
              </h3>
              <p className="text-neutral-600">
                Try adjusting your search query or category filter
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-neutral-900 pr-4">
                      {faq.question}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {supportCategories.find(cat => cat.id === faq.category)?.label}
                    </Badge>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-primary-50 text-primary-700 mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">User Guide</h3>
                <p className="text-sm text-neutral-600">Complete guide to using CauseHive</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Download PDF Guide
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-green-50 text-green-700 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Feature Requests</h3>
                <p className="text-sm text-neutral-600">Suggest improvements to our platform</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Submit Feedback
            </Button>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="mt-12 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Still need help?
          </h2>
          {formSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-neutral-600">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="What can we help you with?"
                  />
                </div>
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
                  <option value="account">Account & Profile</option>
                  <option value="donations">Donations & Payments</option>
                  <option value="causes">Creating Causes</option>
                  <option value="technical">Technical Issues</option>
                  <option value="other">Other</option>
                </select>
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
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
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
        </Card>
      </div>
    </div>
  );
};

export default HelpSupportPage;