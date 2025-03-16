export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              This Privacy Policy explains how WexCars collects, uses, and protects your personal information when you use our platform. We are committed to ensuring that your privacy is protected and that we comply with all applicable data protection laws.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">2.1. Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Name and contact information</li>
                <li>Email address and phone number</li>
                <li>Billing and payment information</li>
                <li>Government-issued identification for verification</li>
                <li>Vehicle information for listings</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800">2.2. Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and settings</li>
                <li>Usage data and browsing history on our platform</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <div className="space-y-4">
              <p className="text-gray-600">We use your information to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Process transactions and maintain your account</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Communicate with you about your listings and bids</li>
                <li>Improve our platform and user experience</li>
                <li>Send you relevant updates and marketing communications</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Protection</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Encryption of personal data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Payment processors and financial institutions</li>
              <li>Identity verification services</li>
              <li>Legal authorities when required by law</li>
              <li>Service providers who assist in our operations</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600">Email: privacy@wexcars.com</p>
              <p className="text-gray-600">Address: 123 Auto Plaza, Car City, CC 12345</p>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
            </div>
          </section>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-gray-500">
          Last updated: January 1, 2024
        </div>
      </div>
    </div>
  )
} 