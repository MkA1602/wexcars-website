import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="/about-hero.jpg"
          alt="About WexCars"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            About WexCars
          </h1>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At WexCars, we're revolutionizing the way people buy and sell luxury vehicles. 
            Our mission is to create a transparent, secure, and efficient marketplace that 
            brings together automotive enthusiasts and dealers worldwide.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Transparency</h3>
            <p className="text-gray-600">
              We believe in complete transparency in every transaction, building trust 
              between buyers and sellers.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously innovate to provide the best possible experience for our users, 
              leveraging cutting-edge technology.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
            <p className="text-gray-600">
              We foster a community of passionate car enthusiasts, creating connections 
              that go beyond transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'John Smith',
                role: 'CEO & Founder',
                image: '/team/ceo.jpg'
              },
              {
                name: 'Sarah Johnson',
                role: 'Chief Technology Officer',
                image: '/team/cto.jpg'
              },
              {
                name: 'Michael Chen',
                role: 'Head of Operations',
                image: '/team/operations.jpg'
              }
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg">Cars Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-lg">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-lg">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 