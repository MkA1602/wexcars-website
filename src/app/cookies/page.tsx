export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience.
          </p>
        </div>
      </div>

      {/* Cookie Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and helping with our marketing efforts.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Essential Cookies</h3>
                <p className="text-gray-600">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and shopping cart functionality. The website cannot function properly without these cookies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Performance Cookies</h3>
                <p className="text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's structure and content.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Functionality Cookies</h3>
                <p className="text-gray-600">
                  These cookies allow the website to remember choices you make (such as your language preference or login details) and provide enhanced features. They may also be used to provide services you have requested.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Marketing Cookies</h3>
                <p className="text-gray-600">
                  These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share information with other organizations or advertisers.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To remember your preferences and settings</li>
              <li>To improve site navigation and user experience</li>
              <li>To analyze site usage and improve our services</li>
              <li>To personalize your experience</li>
              <li>To provide secure and safe transactions</li>
              <li>To help with our marketing efforts</li>
            </ul>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience and functionality of our website. To manage your cookie settings, you can:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Adjust your browser settings to accept or reject cookies</li>
              <li>Delete cookies manually through your browser settings</li>
              <li>Enable "private" or "incognito" browsing mode</li>
              <li>Use browser extensions to control tracking cookies</li>
            </ul>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              Some of our pages may contain content from other sites, like YouTube or social media, which may set their own cookies. We do not control the settings of these cookies, so we suggest checking the third-party websites for more information about their cookies and how to manage them.
            </p>
          </section>

          {/* Updates to Cookie Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to Cookie Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will become effective when we post the revised policy on our website.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600">Email: privacy@wexcars.com</p>
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