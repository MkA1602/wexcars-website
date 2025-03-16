import Link from 'next/link'
import { MapPin, Clock, Briefcase } from 'lucide-react'

const positions = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "We are looking for an experienced Full Stack Developer to join our engineering team and help build the future of automotive e-commerce."
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    description: "Join us as a Product Manager to help shape and drive the product vision for our automotive marketplace platform."
  },
  {
    id: 3,
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "We are seeking a talented UX/UI Designer to create beautiful and intuitive user experiences for our web and mobile platforms."
  },
  {
    id: 4,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "Full-time",
    description: "Drive our marketing strategy and help grow our brand presence in the automotive marketplace."
  }
]

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Help us revolutionize the automotive marketplace industry. We are looking for 
            passionate individuals who want to make a difference.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Competitive Benefits</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Comprehensive health insurance</li>
                <li>• 401(k) matching</li>
                <li>• Generous PTO policy</li>
                <li>• Flexible work arrangements</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Opportunities</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Professional development budget</li>
                <li>• Mentorship programs</li>
                <li>• Career advancement paths</li>
                <li>• Learning & development resources</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Great Culture</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Inclusive environment</li>
                <li>• Regular team events</li>
                <li>• Remote-friendly</li>
                <li>• Work-life balance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Open Positions</h2>
          <div className="grid gap-6">
            {positions.map((position) => (
              <div
                key={position.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                    <p className="text-gray-600 mt-1">{position.description}</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center text-gray-500">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {position.department}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {position.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {position.type}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/careers/${position.id}`}
                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Do not See the Right Position?</h2>
          <p className="text-lg text-gray-300 mb-8">
            We are always looking for talented individuals to join our team. Send us your resume 
            and we will keep you in mind for future opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
} 