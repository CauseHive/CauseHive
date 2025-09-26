// Small data module used by HelpSupportPage. Keeps the data centralized and reusable.
import { Book, User, CreditCard, Plus, AlertCircle, Mail, MessageCircle, Phone, FileText, CheckCircle } from 'lucide-react';

export const supportCategories = [
  { id: 'all', label: 'All Topics', icon: Book },
  { id: 'account', label: 'Account & Profile', icon: User },
  { id: 'donations', label: 'Donations & Payments', icon: CreditCard },
  { id: 'causes', label: 'Creating Causes', icon: Plus },
  { id: 'technical', label: 'Technical Issues', icon: AlertCircle },
];

export const faqItems = [
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
    answer: 'We accept major credit cards, debit cards, and bank transfers through our secure payment processor.'
  }
];

export const contactOptions = [
  {
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    icon: Mail,
    action: 'support@causehive.com',
    color: 'bg-blue-50 text-blue-700',
    type: 'email'
  },
  {
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: MessageCircle,
    action: 'Start Chat',
    color: 'bg-green-50 text-green-700',
    type: 'chat'
  },
  {
    title: 'Phone Support',
    description: 'Call us during business hours',
    icon: Phone,
    action: '+1 (555) 123-4567',
    color: 'bg-purple-50 text-purple-700',
    type: 'phone'
  }
];

export const additionalResources = [
  {
    id: 'user-guide',
    title: 'User Guide',
    description: 'Complete guide to using CauseHive',
    icon: FileText
  },
  {
    id: 'feature-requests',
    title: 'Feature Requests',
    description: 'Suggest improvements to our platform',
    icon: CheckCircle
  }
];

const helpSupportData = {
  supportCategories,
  faqItems,
  contactOptions,
  additionalResources
};

export default helpSupportData;
