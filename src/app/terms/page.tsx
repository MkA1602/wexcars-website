export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-12">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using WexCars, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password, including restricting access to your computer and/or account.
            </p>
          </section>

          {/* Buying and Selling */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Buying and Selling</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                3.1. All listings must be accurate and truthful representations of the vehicles being sold.
              </p>
              <p className="text-gray-600">
                3.2. Buyers must have sufficient funds to complete transactions they initiate.
              </p>
              <p className="text-gray-600">
                3.3. WexCars charges a 5% buyer's premium and a 3% seller's fee on successful transactions.
              </p>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                4.1. Fraudulent listings or misrepresentation of vehicles
              </p>
              <p className="text-gray-600">
                4.2. Manipulation of the bidding process
              </p>
              <p className="text-gray-600">
                4.3. Harassment or abuse of other users
              </p>
              <p className="text-gray-600">
                4.4. Unauthorized access to other user accounts
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The platform, including all content, features, and functionality, is owned by WexCars and is protected by international copyright, trademark, and other intellectual property rights laws.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              WexCars shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the platform.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to terminate or suspend your account and access to the platform immediately, without prior notice or liability, for any reason whatsoever.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify or replace these terms at any time. Changes will be effective immediately upon posting to the platform. Your continued use of the platform following the posting of any changes constitutes acceptance of those changes.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600">Email: legal@wexcars.com</p>
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