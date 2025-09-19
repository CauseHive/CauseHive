import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Cookie, Settings, Eye, BarChart3, Target } from 'lucide-react';

export function CookiePolicyPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Cookie Policy</h1>
          <p className="text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cookie className="h-5 w-5" />
            <span>What Are Cookies?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Cookies are small text files that are placed on your device when you visit our website.
            They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How Cookies Work</h4>
            <p className="text-blue-800 text-sm">
              When you visit CauseHive, our servers send cookies to your browser. These cookies are stored on your device
              and sent back to our servers on subsequent visits, allowing us to recognize you and customize your experience.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Types of Cookies We Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Settings className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-neutral-900">Essential Cookies</h4>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Always Active</span>
              </div>
              <p className="text-neutral-700 text-sm mb-3">
                These cookies are necessary for the website to function properly. They enable core functionality
                such as security, network management, and accessibility.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium text-neutral-900 text-sm">Examples:</h5>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm ml-4">
                  <li>Authentication and login status</li>
                  <li>Security tokens and CSRF protection</li>
                  <li>Load balancing and server routing</li>
                  <li>Shopping cart contents</li>
                </ul>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-neutral-900">Analytics Cookies</h4>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Can be Disabled</span>
              </div>
              <p className="text-neutral-700 text-sm mb-3">
                These cookies help us understand how visitors interact with our website by collecting
                and reporting information anonymously.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium text-neutral-900 text-sm">What we track:</h5>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm ml-4">
                  <li>Page views and popular content</li>
                  <li>Time spent on pages</li>
                  <li>User journey and navigation patterns</li>
                  <li>Device and browser information</li>
                  <li>Error tracking and performance metrics</li>
                </ul>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Eye className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-neutral-900">Functional Cookies</h4>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Can be Disabled</span>
              </div>
              <p className="text-neutral-700 text-sm mb-3">
                These cookies allow the website to remember choices you make and provide enhanced,
                more personal features.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium text-neutral-900 text-sm">Features enabled:</h5>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm ml-4">
                  <li>Language and region preferences</li>
                  <li>Display settings and themes</li>
                  <li>Personalized content recommendations</li>
                  <li>Form auto-fill information</li>
                  <li>Chat widget preferences</li>
                </ul>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-neutral-900">Marketing Cookies</h4>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Can be Disabled</span>
              </div>
              <p className="text-neutral-700 text-sm mb-3">
                These cookies track your online activity to help advertisers deliver more relevant advertising
                or to limit how many times you see an ad.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium text-neutral-900 text-sm">Used for:</h5>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm ml-4">
                  <li>Targeted advertising campaigns</li>
                  <li>Social media integration</li>
                  <li>Email marketing optimization</li>
                  <li>Conversion tracking</li>
                  <li>Retargeting campaigns</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Third-Party Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Some cookies on our site are set by third-party services that appear on our pages.
            These companies have their own privacy and cookie policies.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Google Analytics</h4>
              <p className="text-neutral-700 text-sm mb-2">
                Helps us understand website usage and improve our services.
              </p>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm underline"
              >
                View Google's Privacy Policy
              </a>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Stripe (Payment Processing)</h4>
              <p className="text-neutral-700 text-sm mb-2">
                Enables secure payment processing and fraud prevention.
              </p>
              <a 
                href="https://stripe.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm underline"
              >
                View Stripe's Privacy Policy
              </a>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Social Media Platforms</h4>
              <p className="text-neutral-700 text-sm mb-2">
                Enable sharing and social media integration features.
              </p>
              <p className="text-neutral-600 text-xs">
                Facebook, Twitter, LinkedIn privacy policies apply
              </p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Customer Support</h4>
              <p className="text-neutral-700 text-sm mb-2">
                Powers our help desk and live chat functionality.
              </p>
              <p className="text-neutral-600 text-xs">
                Intercom, Zendesk policies may apply
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cookie Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Cookies have different lifespans depending on their purpose:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-neutral-900">Session Cookies</h4>
                <p className="text-neutral-700 text-sm">
                  Deleted when you close your browser. Used for temporary functionality like shopping cart contents.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-neutral-900">Persistent Cookies</h4>
                <p className="text-neutral-700 text-sm">
                  Remain on your device for a set period (typically 30 days to 2 years) or until manually deleted.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Managing Your Cookie Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            You have several options for managing cookies on our website:
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Cookie Consent Banner</h4>
              <p className="text-blue-800 text-sm">
                When you first visit our site, you'll see a cookie consent banner where you can accept all cookies
                or customize your preferences for different cookie categories.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Browser Settings</h4>
              <p className="text-green-800 text-sm mb-2">
                Most browsers allow you to control cookies through their settings:
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-800 text-sm ml-4">
                <li>Block all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Delete cookies when browser closes</li>
                <li>Notify when cookies are set</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Opt-Out Tools</h4>
              <p className="text-purple-800 text-sm">
                You can opt out of certain advertising cookies using industry opt-out tools like
                the Digital Advertising Alliance's WebChoices tool or Google's Ads Settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impact of Disabling Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            While you can disable cookies, doing so may affect your experience on our website:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Essential Features May Break</h4>
                <p className="text-neutral-700 text-sm">
                  Login, donation processing, and security features may not work properly
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xs">⚠</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Reduced Personalization</h4>
                <p className="text-neutral-700 text-sm">
                  You'll need to reset preferences on each visit and won't see personalized content
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs">i</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Analytics Impact</h4>
                <p className="text-neutral-700 text-sm">
                  We won't be able to improve our services based on usage patterns
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Updates to This Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational,
            legal, or regulatory reasons. We will notify you of any changes by posting the new policy on this page.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
          </p>
          
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="font-medium">CauseHive Privacy Team</p>
            <p className="text-neutral-600">Email: privacy@causehive.com</p>
            <p className="text-neutral-600">Phone: +1 (555) 123-4567</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default CookiePolicyPage;