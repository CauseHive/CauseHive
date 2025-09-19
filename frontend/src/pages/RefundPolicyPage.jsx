import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Clock, CreditCard, HelpCircle } from 'lucide-react';

export function RefundPolicyPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Refund Policy</h1>
          <p className="text-neutral-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-amber-900">Important Notice</h3>
          <p className="text-amber-800 text-sm mt-1">
            All donations made through CauseHive are generally final and non-refundable. 
            Please read this policy carefully before making any contributions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>1. General Refund Policy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Due to the nature of charitable donations and crowdfunding, all contributions made through CauseHive
            are considered final and non-refundable once processed. This policy exists to:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Ensure funds reach intended beneficiaries quickly</li>
            <li>Maintain trust between donors and campaign creators</li>
            <li>Comply with financial regulations and tax requirements</li>
            <li>Cover transaction processing costs</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>2. Exception Circumstances</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Refunds may be considered in the following exceptional circumstances:
          </p>
          
          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-2">Fraudulent Campaigns</h4>
              <p className="text-neutral-700 text-sm">
                If a campaign is found to be fraudulent or misrepresenting its purpose,
                donors may be eligible for refunds. We actively monitor campaigns for authenticity.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-2">Technical Errors</h4>
              <p className="text-neutral-700 text-sm">
                Donations made due to technical errors on our platform (duplicate charges, incorrect amounts)
                may be refunded within 24 hours of the transaction.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-2">Unauthorized Transactions</h4>
              <p className="text-neutral-700 text-sm">
                If you believe your payment method was used without authorization,
                contact us immediately. We work with payment processors to investigate such claims.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-2">Campaign Cancellation</h4>
              <p className="text-neutral-700 text-sm">
                If a campaign creator cancels their campaign before funds are withdrawn,
                donors may receive refunds minus processing fees.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Refund Request Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            If you believe you qualify for a refund under our exception circumstances, please follow this process:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Contact Support</h4>
                <p className="text-neutral-700 text-sm">
                  Email our support team at refunds@causehive.com within 30 days of your donation
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Provide Documentation</h4>
                <p className="text-neutral-700 text-sm">
                  Include transaction ID, donation amount, campaign details, and reason for refund request
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Investigation</h4>
                <p className="text-neutral-700 text-sm">
                  We will review your request and investigate the circumstances within 5-10 business days
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm font-medium">4</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Resolution</h4>
                <p className="text-neutral-700 text-sm">
                  You will receive a response with our decision and next steps if applicable
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Processing Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            When refunds are approved, please note:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Payment processing fees (typically 2.9% + $0.30) are non-refundable</li>
            <li>Refunds will be issued to the original payment method</li>
            <li>Processing time for refunds is 5-10 business days</li>
            <li>International refunds may take longer due to banking processes</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Chargeback Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            If you initiate a chargeback with your bank or credit card company instead of contacting us first:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Your account may be suspended pending investigation</li>
            <li>You may be responsible for chargeback fees ($15-25)</li>
            <li>Future donations may be restricted</li>
            <li>We will provide transaction documentation to financial institutions</li>
          </ul>
          
          <p className="text-neutral-700">
            We encourage contacting our support team before initiating chargebacks to resolve issues amicably.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Campaign Creator Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Campaign creators have specific responsibilities regarding donated funds:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Use funds solely for stated campaign purposes</li>
            <li>Provide regular updates to donors</li>
            <li>Maintain transparency about fund usage</li>
            <li>Respond to donor inquiries promptly</li>
            <li>Complete campaigns within reasonable timeframes</li>
          </ul>
          
          <p className="text-neutral-700">
            Failure to meet these responsibilities may result in campaign suspension and potential refund obligations.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Tax Implications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            Please consider tax implications before requesting refunds:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
            <li>Donations may be tax-deductible depending on campaign type</li>
            <li>Refunded donations may affect your tax filings</li>
            <li>Consult with tax professionals for guidance</li>
            <li>CauseHive provides donation receipts for tax purposes</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>8. Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-700">
            For refund requests or questions about this policy, contact our support team:
          </p>
          
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="font-medium">CauseHive Refund Support</p>
            <p className="text-neutral-600">Email: refunds@causehive.com</p>
            <p className="text-neutral-600">Phone: +1 (555) 123-4567</p>
            <p className="text-neutral-600">Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</p>
          </div>
          
          <p className="text-neutral-700 text-sm">
            Please include your transaction ID and detailed explanation when contacting support.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default RefundPolicyPage;