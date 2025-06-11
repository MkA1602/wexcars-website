import type { Car } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface CarHeroProps {
  car: Car
}

export default function CarHero({ car }: CarHeroProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={car.image || "/placeholder.svg?height=600&width=1200&query=luxury+car"}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 luxury-overlay"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-white car-hero-content">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic mb-6 leading-tight hero-text-shadow">
              {car.brand} {car.name}
            </h1>
            <p className="text-white/90 mb-8 max-w-md text-lg leading-relaxed">
              Experience the thrill of driving one of the world's most prestigious sports cars, combining cutting-edge
              technology with timeless design.
            </p>
            
            {/* Specifications Cards */}
            <div className="flex flex-wrap gap-4">
              <div className="glass-card car-spec-card px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-sm text-white/80">Engine</div>
                <div className="font-semibold text-white">{car.specifications?.engine || "N/A"}</div>
              </div>
              <div className="glass-card car-spec-card px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-sm text-white/80">Power</div>
                <div className="font-semibold text-white">{car.specifications?.power || "N/A"}</div>
              </div>
              <div className="glass-card car-spec-card px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="text-sm text-white/80">0-60 mph</div>
                <div className="font-semibold text-white">
                  {car.specifications?.acceleration?.replace("0-60 mph in ", "") || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="md:w-1/2 relative car-hero-image">
            <div className="relative group">
              <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-2xl luxury-shadow bg-gradient-to-br from-primary-light/20 to-primary-dark/20 backdrop-blur-sm border border-white/20">
                <img
                  src={car.image || "/placeholder.svg?height=450&width=650&query=luxury+car"}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Price Badge */}
                {car.price && (
                  <div className="absolute top-4 right-4 glass-card text-white px-4 py-2 rounded-full font-bold text-lg luxury-shadow animate-fade-in">
                    {formatCurrency(car.price)}
                  </div>
                )}
                
                {/* Year Badge */}
                {car.year && (
                  <div className="absolute bottom-4 left-4 glass-card text-white px-4 py-2 rounded-full font-semibold animate-fade-in">
                    {car.year}
                  </div>
                )}

                {/* Category Badge */}
                {car.category && (
                  <div className="absolute top-4 left-4 glass-card text-white px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
                    {car.category}
                  </div>
                )}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-light/20 to-primary-dark/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
