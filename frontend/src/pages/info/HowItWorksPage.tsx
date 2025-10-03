import { HeartHandshake } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Wave Accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-8">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M0,200 Q400,150 800,200 T1200,250 V600 H0 Z" fill="url(#howItWorksWave1)" />
            <defs>
              <linearGradient id="howItWorksWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-6">
          <svg className="absolute top-40 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path d="M0,400 Q600,350 1200,400 V600 H0 Z" fill="url(#howItWorksWave2)" />
            <defs>
              <linearGradient id="howItWorksWave2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl mb-8 shadow-lg">
              <HeartHandshake className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-800 to-emerald-600 bg-clip-text text-transparent mb-6">
              How CauseHive Works
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Making charitable giving in Ghana simple, secure, and impactful. Join thousands of Ghanaians
              who are creating positive change in their communities.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="pb-20 px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Causes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse vetted charitable initiatives across Ghana. From education projects in rural communities
                  to healthcare support in urban areas, find causes that resonate with your values and the
                  needs of Ghanaian communities.
                </p>
              </div>

              <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-3xl">💳</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Donate Securely</h3>
                <p className="text-gray-600 leading-relaxed">
                  Give with confidence using trusted payment methods including MTN Mobile Money, Vodafone Cash,
                  AirtelTigo Money, and major debit/credit cards. All transactions are secured with bank-level
                  encryption and processed through licensed payment providers.
                </p>
              </div>

              <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 md:col-span-2 lg:col-span-1">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Your Impact</h3>
                <p className="text-gray-600 leading-relaxed">
                  See exactly how your contributions are making a difference. Receive real-time updates on
                  project progress, view photos and stories from the field, and track how your donations
                  are transforming lives across Ghana.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="pb-20 px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CauseHive for Ghanaian Giving?</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We're not just another crowdfunding platform. We're Ghana's dedicated solution for transparent,
                  secure, and impactful charitable giving.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🇬🇭</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Local Focus</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Dedicated to addressing Ghana's unique challenges and opportunities, from rural development
                      to urban innovation. Every cause is carefully vetted to ensure it serves genuine Ghanaian needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Organizations</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Every cause undergoes thorough verification to ensure transparency and accountability in
                      charitable giving. We maintain the highest standards of due diligence and reporting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Money First</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Seamless integration with Ghana's most popular mobile money platforms for instant,
                      fee-free donations. No bank account required - just your mobile phone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Updates</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Stay connected with SMS notifications and app updates about the causes you care about most.
                      See your impact grow in real-time with detailed progress reports and stories.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-24 px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-12 text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join the growing community of Ghanaian philanthropists who are building a better future for all.
                Your donation, no matter the size, can transform lives and communities across Ghana.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/causes"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <HeartHandshake className="w-5 h-5 mr-2" />
                  Explore Causes
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-emerald-700 transition-all duration-200"
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
