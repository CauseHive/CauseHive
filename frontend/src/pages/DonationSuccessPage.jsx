import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Heart, Download, Share2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function DonationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get donation data from navigation state
  const donationData = location.state?.donationData;
  const transactionId = location.state?.transactionId;

  // Redirect if no donation data
  React.useEffect(() => {
    if (!donationData || !transactionId) {
      navigate('/causes');
    }
  }, [donationData, transactionId, navigate]);

  if (!donationData || !transactionId) {
    return null;
  }

  const handleDownloadReceipt = () => {
    // Generate and download receipt PDF
    const receiptData = {
      transactionId,
      donationData,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    
    // Create receipt content
    const receiptContent = `
CAUSEHIVE DONATION RECEIPT
========================

Transaction ID: ${transactionId}
Date: ${receiptData.date}
Time: ${receiptData.time}

DONATION DETAILS:
================
Total Amount: GH₵${donationData.totalAmount.toFixed(2)}
Payment Method: ${donationData.paymentMethod || 'Card'}

CAUSES SUPPORTED:
================
${donationData.items?.map(item => 
  `• ${item.causeName}: GH₵${item.amount.toFixed(2)}`
).join('\n') || `Single donation: GH₵${donationData.totalAmount.toFixed(2)}`}

DONOR INFORMATION:
=================
Name: ${donationData.donorName || 'Anonymous'}
Email: ${donationData.donorEmail || 'Not provided'}

Thank you for your generous donation!
Your contribution makes a real difference.

For questions or support, contact us at:
Email: support@causehive.com
Phone: +1 (555) 123-4567

CauseHive - Making a Difference Together
www.causehive.com
    `;

    // Create and download the receipt file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CauseHive_Receipt_${transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just made a donation!',
        text: `I donated GH₵${donationData.totalAmount.toFixed(2)} to support important causes on CauseHive.`,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I just donated GH₵${donationData.totalAmount.toFixed(2)} to support important causes on CauseHive! ${window.location.origin}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share text copied to clipboard!');
      });
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Thank You for Your Donation!
          </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Your generosity makes a real difference. We've sent a confirmation email with your receipt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-neutral-700">Transaction ID</label>
                  <p className="text-neutral-900 font-mono">{transactionId}</p>
                </div>
                <div>
                  <label className="font-medium text-neutral-700">Date</label>
                  <p className="text-neutral-900">{new Date().toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <label className="font-medium text-neutral-700">Payment Method</label>
                  <p className="text-neutral-900 capitalize">
                    {donationData.paymentMethod.replace('_', ' ')}
                    {donationData.paymentDetails && (
                      <span className="text-neutral-600 ml-1">
                        ({donationData.paymentDetails.provider?.toUpperCase()})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-neutral-700">Total Amount</label>
                  <p className="text-neutral-900 font-semibold text-lg">
                    GH₵{donationData.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {!donationData.isAnonymous && donationData.donor && (
                <div className="border-t pt-4">
                  <label className="font-medium text-neutral-700 block mb-2">Donor Information</label>
                  <div className="text-sm space-y-1">
                    <p><strong>Name:</strong> {donationData.donor.name}</p>
                    <p><strong>Email:</strong> {donationData.donor.email}</p>
                    {donationData.donor.phone && (
                      <p><strong>Phone:</strong> {donationData.donor.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {donationData.comments && (
                <div className="border-t pt-4">
                  <label className="font-medium text-neutral-700 block mb-2">Your Message</label>
                  <p className="text-sm text-neutral-600 italic">"{donationData.comments}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donated Causes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Causes You Supported
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donationData.items.map((item) => (
                  <div key={item.causeId} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">
                        {/* Find cause name from original items - this would typically come from API */}
                        Cause #{item.causeId}
                      </h4>
                      <p className="text-sm text-neutral-600">Donation amount</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">GH₵{item.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleDownloadReceipt}
                variant="outline" 
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                Download Receipt
              </Button>

              <Button 
                onClick={handleShare}
                variant="outline" 
                className="w-full gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Your Impact
              </Button>

              <Link to="/causes">
                <Button className="w-full gap-2">
                  <Heart className="h-4 w-4" />
                  Donate to More Causes
                </Button>
              </Link>

              <Link to="/dashboard">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowRight className="h-4 w-4" />
                  View My Donations
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Impact Message */}
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Heart className="h-8 w-8 text-primary-600 mx-auto" />
                <h3 className="font-semibold text-primary-900">Your Impact Matters</h3>
                <p className="text-sm text-primary-700">
                  Your donation of GH₵{donationData.totalAmount.toFixed(2)} will help create 
                  positive change in our communities. Thank you for being part of the solution!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What Happens Next */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <h4 className="font-medium">Verification</h4>
              <p className="text-sm text-neutral-600">
                We'll verify your donation and notify the cause organizers within 24 hours.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <h4 className="font-medium">Fund Transfer</h4>
              <p className="text-sm text-neutral-600">
                Funds will be transferred to the cause organizers to begin making an impact.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <h4 className="font-medium">Impact Updates</h4>
              <p className="text-sm text-neutral-600">
                You'll receive updates on how your donation is being used to create change.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default DonationSuccessPage;