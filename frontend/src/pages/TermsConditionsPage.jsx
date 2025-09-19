import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function TermsConditionsPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Terms & Conditions</h1>
          <p className="text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            By accessing and using CauseHive, you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Use License</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Permission is granted to temporarily download one copy of CauseHive materials for personal, non-commercial transitory viewing only.
          </p>
          <p className="text-neutral-700">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on CauseHive</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. User Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            You are responsible for safeguarding the password and for all activities that occur under your account.
          </p>
          <p className="text-neutral-700">
            You may not use as a username the name of another person or entity or that is not lawfully available for use.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Donations and Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            All donations made through CauseHive are final and non-refundable unless specifically stated otherwise.
            By making a donation, you confirm that you are the authorized holder of the payment method.
          </p>
          <p className="text-neutral-700">
            CauseHive may charge transaction fees for processing donations. These fees will be clearly disclosed before completing any transaction.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Campaign Creation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Users creating campaigns must ensure all information provided is accurate and truthful.
            Fraudulent campaigns or misrepresentation of causes will result in immediate account termination.
          </p>
          <p className="text-neutral-700">
            CauseHive reserves the right to review and approve campaigns before they go live.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Prohibited Uses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">You may not use our service:</p>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material.
            You are responsible for the content that you post to the service.
          </p>
          <p className="text-neutral-700">
            By posting content to CauseHive, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Termination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms.
          </p>
          <p className="text-neutral-700">
            Upon termination, your right to use the service will cease immediately. If you wish to terminate your account,
            you may simply discontinue using the service.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law,
            this Company excludes all representations, warranties, conditions and terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Governing Law</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which CauseHive operates,
            without regard to its conflict of law provisions.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>11. Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            If you have any questions about these Terms & Conditions, please contact us at:
          </p>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="font-medium">CauseHive Support</p>
            <p className="text-neutral-600">Email: legal@causehive.com</p>
            <p className="text-neutral-600">Phone: +1 (555) 123-4567</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default TermsConditionsPage;