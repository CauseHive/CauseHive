export default function FaqPage() {
  const faqs = [
    {
      question: "How do I donate to a cause on CauseHive?",
      answer: "Donating is simple! Browse causes that interest you, click the 'Donate' button, choose your amount, and complete payment using MTN Mobile Money, Vodafone Cash, AirtelTigo Money, or your debit/credit card. All transactions are secured with bank-level encryption."
    },
    {
      question: "Are donations on CauseHive secure?",
      answer: "Absolutely. We partner with licensed payment processors and use industry-standard security measures. Your payment information is never stored on our servers, and all transactions are protected by SSL encryption. We also verify all causes before they go live on our platform."
    },
    {
      question: "Can I donate using mobile money in Ghana?",
      answer: "Yes! CauseHive fully supports Ghana's major mobile money platforms: MTN Mobile Money, Vodafone Cash, and AirtelTigo Money. No bank account is required - you can donate instantly using just your phone number."
    },
    {
      question: "How do I know my donation will reach the intended cause?",
      answer: "Every cause on CauseHive undergoes thorough verification. We check organization registration, track record, and project feasibility. You can also track your donation's impact through real-time updates, photos, and progress reports from the field."
    },
    {
      question: "Can I create my own cause or fundraiser?",
      answer: "Yes! Any registered user can create a cause. Simply sign up for an account, go to 'Create Cause' in your dashboard, and provide details about your initiative. All causes are reviewed before going live to ensure they meet our standards for transparency and impact."
    },
    {
      question: "How do cause owners withdraw funds?",
      answer: "Verified cause owners can request withdrawals through their dashboard once their project meets minimum funding thresholds. Funds are transferred securely to registered bank accounts or mobile money wallets, with full documentation provided for accountability."
    },
    {
      question: "What types of causes can I support on CauseHive?",
      answer: "CauseHive supports diverse initiatives across Ghana including education, healthcare, agriculture, community development, environmental conservation, and social welfare projects. We focus on causes that create measurable positive impact in Ghanaian communities."
    },
    {
      question: "Is there a minimum donation amount?",
      answer: "No minimum donation amount exists. Every contribution, no matter how small, helps build momentum for important causes. Many donors choose amounts that feel meaningful to them, from ₵5 to thousands of cedis."
    },
    {
      question: "How can I track the impact of my donation?",
      answer: "You'll receive email updates and can log into your dashboard to see progress reports, photos, and stories from the causes you've supported. Many organizations provide detailed breakdowns of how funds are used and the difference they're making."
    },
    {
      question: "What if I need to change or cancel my donation?",
      answer: "Contact us immediately if you need to modify a pending donation. Completed donations cannot be refunded but can often be redirected to other causes if the original project is no longer active. We recommend reviewing causes carefully before donating."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about donating, creating causes, and making an impact in Ghana.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for? We're here to help.
        </p>
        <a href="/contact" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-block">
          Contact Support
        </a>
      </div>
    </div>
  )
}
