import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | WexCars - Luxury Car Experience",
  description:
    "Read the Terms of Service for WexCars, outlining the rules and guidelines for using our luxury car services.",
}

export default function TermsPage() {
  return (
    <main className="flex-grow py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to WexCars. These Terms of Service govern your use of our website, products, and services. By
              accessing or using WexCars, you agree to be bound by these Terms. If you disagree with any part of the
              terms, you may not access our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Our Services</h2>
            <p>
              Our services are designed to provide you with access to luxury and exotic vehicles for purchase, lease,
              or rental. You must be at least 18 years old and possess a valid driver's license to use our services.
              You agree to provide accurate, current, and complete information during the registration process and to
              update such information to keep it accurate, current, and complete.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Vehicle Reservations and Purchases</h2>
            <p>
              All vehicle reservations and purchases are subject to availability and confirmation. Prices displayed on
              our website are subject to change without notice. A reservation is only confirmed upon receipt of a
              confirmation email from WexCars and, where applicable, payment of a deposit or full payment.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment Terms</h2>
            <p>
              Payment methods accepted include credit cards, bank transfers, and other methods as specified at the
              time of transaction. All payments must be made in the currency specified. You agree to pay all charges
              at the prices then in effect for your purchases and any applicable shipping fees, and you authorize
              WexCars to charge your chosen payment provider for any such amounts.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Cancellation and Refund Policy</h2>
            <p>
              Cancellation and refund policies vary depending on the service or product. For vehicle reservations,
              cancellations made more than 48 hours before the scheduled pickup time may be eligible for a full
              refund. Cancellations made less than 48 hours before the scheduled pickup time may be subject to a
              cancellation fee. Please refer to the specific terms provided at the time of booking.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              The content, organization, graphics, design, compilation, and other matters related to the WexCars
              website are protected under applicable copyrights, trademarks, and other proprietary rights. Copying,
              redistribution, use, or publication by you of any such content or any part of the website is prohibited
              without express written permission from WexCars.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              WexCars shall not be liable for any direct, indirect, incidental, special, consequential, or punitive
              damages resulting from your access to or use of, or inability to access or use, the services or any
              content provided on or through the services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of [Jurisdiction], without
              regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms
              will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
              revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p className="mt-2">
              Email: support@wexcars.com
              <br />
              Phone: +1 (555) 123-4567
              <br />
              Address: 215 52 Malmo. Sweden
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
