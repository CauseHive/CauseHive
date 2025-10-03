export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions about donating, creating a cause, or need support? We're here to help you make a difference in Ghana.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📧</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-gray-600">support@causehive.com</p>
                <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
                <p className="text-gray-600">+233 24 123 4567</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM GMT</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Office Address</h3>
                <p className="text-gray-600">
                  Accra, Ghana<br />
                  East Legon, Opposite UPSA
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">How do I donate?</h3>
              <p className="text-gray-600 text-sm">Browse causes, click donate, and pay securely with mobile money or cards.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">How do I create a cause?</h3>
              <p className="text-gray-600 text-sm">Sign up, go to your dashboard, and click "Create Cause" to start your fundraiser.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Payment issues?</h3>
              <p className="text-gray-600 text-sm">Check our FAQ or contact support for mobile money and card payment help.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Technical problems?</h3>
              <p className="text-gray-600 text-sm">Clear your browser cache or try a different device. Contact us if issues persist.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <a href="/faq" className="text-emerald-600 hover:text-emerald-700 font-medium">
              View all FAQs →
            </a>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the CauseHive Community</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you're looking to support important causes or create your own fundraiser,
          we're committed to helping you make a positive impact in Ghanaian communities.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/signup" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            Create Account
          </a>
          <a href="/causes" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Browse Causes
          </a>
        </div>
      </div>
    </div>
  )
}
