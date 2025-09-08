import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | WexCars - Luxury Car Experience",
  description: "Learn about how WexCars collects, uses, and protects your personal information in our Privacy Policy.",
}

export default function PrivacyPage() {
  return (
    <main className="flex-grow py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              At WexCars, we respect your privacy and are committed to protecting your personal data. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
              or use our services. Please read this Privacy Policy carefully. If you do not agree with the terms of
              this Privacy Policy, please do not access the site.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <p>We may collect several types of information from and about users of our website, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, postal address, phone number, driver's
                license information, payment information, and other identifiers by which you may be contacted online
                or offline.
              </li>
              <li>
                <strong>Usage Information:</strong> Information about your internet connection, the equipment you use
                to access our website, and usage details.
              </li>
              <li>
                <strong>Transaction Information:</strong> Details about purchases, inquiries, or other transactions
                you make through our services.
              </li>
              <li>
                <strong>Communication Information:</strong> Records and copies of your correspondence if you contact
                us.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Collect Information</h2>
            <p>We collect information from you when you:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Register on our website or create an account</li>
              <li>Make a reservation, purchase, or inquiry</li>
              <li>Subscribe to our newsletter or marketing communications</li>
              <li>Participate in surveys, promotions, or contests</li>
              <li>Browse our website (through cookies and similar technologies)</li>
              <li>Contact our customer service team</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Use Your Information</h2>
            <p>We may use the information we collect about you for various purposes, including to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, such as updates to our terms or privacy policy</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send marketing communications, if you have opted in to receive them</li>
              <li>Personalize your experience on our website</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues or fraudulent activities</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Disclosure of Your Information</h2>
            <p>We may disclose personal information that we collect or you provide:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To our subsidiaries and affiliates</li>
              <li>
                To contractors, service providers, and other third parties we use to support our business and who are
                bound by contractual obligations to keep personal information confidential
              </li>
              <li>To fulfill the purpose for which you provide it</li>
              <li>With your consent</li>
              <li>To comply with any court order, law, or legal process</li>
              <li>
                To enforce our Terms of Service and other agreements, including for billing and collection purposes
              </li>
              <li>
                If we believe disclosure is necessary to protect the rights, property, or safety of WexCars, our
                customers, or others
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Security</h2>
            <p>
              We have implemented measures designed to secure your personal information from accidental loss and from
              unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on
              secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.
            </p>
            <p className="mt-4">
              Unfortunately, the transmission of information via the internet is not completely secure. Although we do
              our best to protect your personal information, we cannot guarantee the security of your personal
              information transmitted to our website. Any transmission of personal information is at your own risk.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children under 18. If you are a parent or guardian and you are aware that your child
              has provided us with personal information, please contact us so that we can take necessary actions.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Changes to Our Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You
              are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="mb-1">
                <strong>Email:</strong> support@wexcars.com
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Address:</strong> 215 52 Malmo. Sweden
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
