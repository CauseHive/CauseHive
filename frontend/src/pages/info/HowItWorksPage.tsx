export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How CauseHive Works</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Making charitable giving in Ghana simple, secure, and impactful. Join thousands of Ghanaians
          who are creating positive change in their communities.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Discover Causes</h3>
          <p className="text-gray-600">
            Browse vetted charitable initiatives across Ghana. From education projects in rural communities
            to healthcare support in urban areas, find causes that resonate with your values and the
            needs of Ghanaian communities.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Donate Securely</h3>
          <p className="text-gray-600">
            Give with confidence using trusted payment methods including MTN Mobile Money, Vodafone Cash,
            AirtelTigo Money, and major debit/credit cards. All transactions are secured with bank-level
            encryption and processed through licensed payment providers.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Track Your Impact</h3>
          <p className="text-gray-600">
            See exactly how your contributions are making a difference. Receive real-time updates on
            project progress, view photos and stories from the field, and track how your donations
            are transforming lives across Ghana.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose CauseHive for Ghanaian Giving?</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🇬🇭 Local Focus</h3>
            <p className="text-gray-600">Dedicated to addressing Ghana's unique challenges and opportunities, from rural development to urban innovation.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🔒 Verified Organizations</h3>
            <p className="text-gray-600">Every cause undergoes thorough verification to ensure transparency and accountability in charitable giving.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">💰 Mobile Money First</h3>
            <p className="text-gray-600">Seamless integration with Ghana's most popular mobile money platforms for instant, fee-free donations.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">📱 Real-Time Updates</h3>
            <p className="text-gray-600">Stay connected with SMS notifications and app updates about the causes you care about most.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
        <p className="text-gray-600 mb-6">
          Join the growing community of Ghanaian philanthropists who are building a better future for all.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/causes" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            Explore Causes
          </a>
          <a href="/signup" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Create Account
          </a>
        </div>
      </div>
    </div>
  )
}
