import React, { useState } from 'react';
import { Search, Mail, MessageCircle, Phone, Book, FileText, AlertCircle, CheckCircle, User, CreditCard, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { supportCategories, faqItems, contactOptions, additionalResources } from '../data/help-support-data';

// --- Sub-components for better structure ---

const ActionCard = ({ icon: Icon, title, description, actionText, actionType, color, onAction }) => (
  <Card className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
    <div>
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-600">{description}</p>
        </div>
      </div>
    </div>
    <Button variant="outline" className="w-full mt-auto" onClick={() => onAction(actionType, actionText)}>
      {actionText}
    </Button>
  </Card>
);

const FaqItem = ({ question, answer, categoryLabel }) => (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-medium text-neutral-900 pr-4">
        {question}
      </h3>
      <Badge variant="secondary" className="text-xs flex-shrink-0">
        {categoryLabel}
      </Badge>
    </div>
    <p className="text-neutral-600 leading-relaxed">
      {answer}
    </p>
  </Card>
);

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // use the centralized data imported from src/data/help-support-data.js
  // imported variables: supportCategories, faqItems, contactOptions, additionalResources

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <Button variant="outline" className="w-full">
                  {option.action}
                </Button>
              </Card>
            );
          })}
          {contactOptions.map((option) => (
            <ActionCard
              key={option.title}
              {...option}
              onAction={(type, value) => {
                if (type === 'email') window.location.href = `mailto:${value}`;
                if (type === 'phone') window.location.href = `tel:${value}`;
                // Add other actions like opening a chat widget
                if (type === 'chat') alert('Live chat is not yet implemented.');
              }}
            />
          ))}
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
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="What can we help you with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Select a category</option>
                  <option value="account">Account & Profile</option>
                  <option value="donations">Donations & Payments</option>
                  <option value="causes">Creating Causes</option>
                  <option value="technical">Technical Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Please describe your issue or question in detail..."
              />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupportPage;