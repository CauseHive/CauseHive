import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function PrivacyPolicyPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
          <p className="text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We collect information you provide directly to us, such as when you create an account, make a donation,
            create a campaign, or contact us for support.
          </p>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900">Personal Information may include:</h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Name, email address, and phone number</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Profile information and photos</li>
              <li>Campaign descriptions and updates</li>
              <li>Communication preferences</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900">Automatically Collected Information:</h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process donations and transactions</li>
            <li>Communicate with you about your account and campaigns</li>
            <li>Send you technical notices and security alerts</li>
            <li>Provide customer support</li>
            <li>Monitor and analyze usage trends</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Information Sharing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
            except as described in this policy.
          </p>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900">We may share your information with:</h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Service providers who assist in our operations</li>
              <li>Payment processors for transaction handling</li>
              <li>Legal authorities when required by law</li>
              <li>Other users when you create public campaigns</li>
              <li>Third parties with your explicit consent</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Data Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We implement appropriate technical and organizational measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900">Security measures include:</h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure payment processing through certified providers</li>
              <li>Employee training on data protection</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Cookies and Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We use cookies and similar tracking technologies to enhance your experience on our platform.
            Cookies help us remember your preferences and improve our services.
          </p>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900">Types of cookies we use:</h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Essential cookies for site functionality</li>
              <li>Analytics cookies to understand usage patterns</li>
              <li>Preference cookies to remember your settings</li>
              <li>Marketing cookies for relevant content</li>
            </ul>
          </div>
          
          <p className="text-neutral-700">
            You can control cookie preferences through your browser settings, though this may affect site functionality.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Your Rights and Choices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your personal information</li>
            <li>Portability of your data</li>
            <li>Restriction of processing</li>
            <li>Objection to processing</li>
            <li>Withdrawal of consent</li>
          </ul>
          
          <p className="text-neutral-700">
            To exercise these rights, please contact us using the information provided below.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We retain your personal information for as long as necessary to provide our services and fulfill
            the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900">Retention periods:</h4>
            <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
              <li>Account information: Until account deletion</li>
              <li>Transaction records: 7 years for legal compliance</li>
              <li>Campaign data: Until campaign completion + 3 years</li>
              <li>Support communications: 2 years</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. International Transfers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place to protect your data during international transfers.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Our services are not intended for children under 13 years of age. We do not knowingly collect
            personal information from children under 13. If we become aware of such collection,
            we will delete the information immediately.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Updates to This Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new policy on this page and updating the "Last updated" date.
          </p>
          
          <p className="text-neutral-700">
            We encourage you to review this policy periodically for any changes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>11. Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="font-medium">CauseHive Privacy Team</p>
            <p className="text-neutral-600">Email: privacy@causehive.com</p>
            <p className="text-neutral-600">Phone: +1 (555) 123-4567</p>
            <p className="text-neutral-600">Address: 123 Cause Street, Impact City, IC 12345</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;