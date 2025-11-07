"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { CheckCircle, Star, Crown, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import "@/styles/pricing-animations.css"
import VariableProximity from "@/components/ui/variable-proximity"
import ScrollVelocity from "@/components/ui/scroll-velocity"
import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PriceFlow from "@/components/ui/price-flow"

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public"

const pricingPlans = [
  {
    name: "Standard",
    price: 0,
    description: "Perfect for first-time luxury car buyers",
    features: [
      "Access to standard inventory",
      "Basic vehicle inspection",
      "Standard customer support",
    ],
    popular: false,
    buttonText: "Get Free",
  },
  {
    name: "Premium",
    price: 200,
    description: "Our most popular package for enthusiasts",
    features: [
      "Access to premium inventory",
      "150-point vehicle inspection",
      "90-day comprehensive warranty",
      "Priority customer support",
    ],
    popular: true,
    buttonText: "Choose Premium",
  },
  {
    name: "Exclusive",
    price: 300,
    description: "The ultimate luxury experience",
    features: [
      "Access to exclusive & limited edition models",
      "200-point vehicle inspection with certification",
      "24/7 dedicated concierge",
      "Best available financing rates",
      "Free delivery nationwide",
      "Priority access to new arrivals",
    ],
    popular: false,
    buttonText: "Go Exclusive",
  },
]

// FAQ Accordion Component
function FAQAccordionGroup({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all hover:border-red-200 hover:shadow-xl"
        >
          <motion.button
            onClick={() => toggleAccordion(index)}
            className="flex w-full items-center justify-between p-8 text-left transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <h3 className="text-xl font-bold text-gray-900 pr-4 group-hover:text-red-600 transition-colors">
              {faq.question}
            </h3>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="px-8 pb-8"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

const pricingFAQs = [
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes, you can upgrade your plan at any time. The price difference will be prorated for the remainder of your billing cycle."
  },
  {
    question: "Is there a minimum commitment period?",
    answer: "Our Standard and Premium plans require a 3-month minimum commitment. The Exclusive plan requires a 6-month minimum commitment."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, bank transfers, and cryptocurrency payments for select plans."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time after the minimum commitment period. No refunds are provided for the current billing cycle."
  }
]

export default function PricingContent() {
  const containerRef = useRef<HTMLElement>(null!)
  return (
    <main className="flex-grow">
      {/* Hero Section with Background Image */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 hero-bg-animate">
          <img
            src={`${GITHUB_RAW_BASE}/lycan-hypersport-concept.png`}
            alt="Luxury Hypercar"
            className="w-full h-full object-cover object-center opacity-14"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-gray-900/95"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10 hero-content-animate">
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 hero-title-animate tracking-tight">
              <VariableProximity
                label="Pricing & Membership"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-white"
              />
            </h1>
            <p className="text-gray-200 max-w-2xl mx-auto text-lg md:text-xl hero-text-animate leading-relaxed">
              <VariableProximity
                label="Choose the perfect plan that suits your luxury vehicle needs. All plans include access to our exclusive collection of premium vehicles."
                fromFontVariationSettings="'wght' 400, 'slnt' 0"
                toFontVariationSettings="'wght' 600, 'slnt' -2"
                containerRef={containerRef}
                radius={50}
                falloff="linear"
                className="text-gray-200"
              />
            </p>
          </div>
          <div className="mt-8 -mx-4 py-3 bg-gradient-to-r from-red-600/20 to-red-700/20 backdrop-blur-md border-y border-red-400/30 shadow-xl overflow-hidden">
            <ScrollVelocity
              texts={[
                "Free Trial: Enjoy 3 Months on Us – Absolutely Free! No credit card required. Unlimited access. Cancel anytime."
              ]}
              velocity={50}
              className="text-white font-bold text-lg md:text-2xl"
              damping={50}
              stiffness={400}
              numCopies={3}
              velocityMapping={{ input: [0, 1000], output: [0, 3] }}
              parallaxClassName="parallax py-2"
              scrollerClassName="scroller text-red-300"
              parallaxStyle={{ margin: 0 }}
              scrollerStyle={{ fontSize: "20px" }}
            />
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.1,
                  }}
                  className={`group relative flex h-[650px] cursor-pointer flex-col overflow-hidden rounded-2xl border p-8 ${
                    plan.popular
                      ? "bg-gradient-to-br from-red-50 to-white border-2 border-red-600 ring-4 ring-red-600/20 hover:ring-red-600/40 md:scale-105"
                      : plan.name === "Exclusive"
                      ? "bg-gradient-to-br from-red-950/10 to-white border-2 border-red-900 ring-4 ring-red-900/20 hover:ring-red-900/40"
                      : "bg-white border-2 ring-2 ring-slate-200/50 hover:ring-slate-300"
                  }`}
                >
                  {/* Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 h-4 w-32 rounded-bl-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
                  )}
                  {plan.name === "Exclusive" && !plan.popular && (
                    <div className="absolute top-0 right-0 h-4 w-32 rounded-bl-2xl bg-gradient-to-r from-red-900 via-red-800 to-red-950" />
                  )}
                  {plan.name === "Standard" && (
                    <div className="absolute top-0 right-0 h-4 w-32 rounded-bl-2xl bg-gradient-to-r from-slate-600 via-slate-500 to-gray-600" />
                  )}

                  <div className="card-content relative z-10 flex h-full flex-col">
                    {/* Title */}
                    <h3 className={`mb-4 flex items-center gap-2 text-3xl font-bold ${
                      plan.popular ? "text-red-600" : plan.name === "Exclusive" ? "text-red-900" : "text-slate-800"
                    }`}>
                      {plan.name}
                      {plan.popular && (
                        <div className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                          Most Popular
                        </div>
                      )}
                      {plan.name === "Exclusive" && !plan.popular && (
                        <div className="rounded-full bg-red-900 px-2 py-1 text-xs font-bold text-white">
                          Exclusive
                        </div>
                      )}
                      {plan.name === "Standard" && (
                        <div className="rounded-full bg-slate-600 px-2 py-1 text-xs font-bold text-white">
                          Free Plan
                        </div>
                      )}
                    </h3>

                    {/* Price & Duration */}
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${
                        plan.popular ? "text-red-600" : plan.name === "Exclusive" ? "text-red-900" : "text-slate-800"
                      }`}>
                        {plan.price === 0 ? "Free" : (
                          <>
                            $<PriceFlow value={plan.price} />
                          </>
                        )}
                      </span>
                      {plan.price > 0 && (
                        <>
                          <span className="text-gray-500 mx-2">•</span>
                          <span className="text-gray-500 text-lg">/month</span>
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link href={plan.price === 0 ? "/dashboard" : `/payment/${plan.name.toLowerCase()}`} className="mb-6">
                      <button
                        type="button"
                        className={`inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-semibold transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                          plan.popular
                            ? "bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl"
                            : plan.name === "Exclusive"
                            ? "bg-gradient-to-r from-red-900 via-red-800 to-red-950 hover:from-red-950 hover:via-red-900 hover:to-red-950 text-white shadow-xl hover:shadow-2xl"
                            : "bg-gradient-to-r from-slate-700 via-slate-600 to-gray-700 hover:from-slate-800 hover:via-slate-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {plan.buttonText}
                        {plan.popular && <span className="text-lg">→</span>}
                      </button>
                    </Link>

                    {/* Description */}
                    <p className="mb-6 flex-grow text-base leading-relaxed text-gray-600">
                      {plan.description}
                    </p>

                    {/* What's Included */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-gray-600">
                        What&apos;s included:
                      </h4>
                      <ul className="space-y-3">
                        {plan.features.map((item) => (
                          <li
                            className="flex items-center gap-3 text-sm text-gray-700"
                            key={item}
                          >
                            <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                              plan.popular
                                ? "bg-red-600"
                                : plan.name === "Exclusive"
                                ? "bg-red-900"
                                : "bg-slate-600"
                            }`}>
                              <svg
                                className="h-2 w-2 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services - Hidden for now */}
      {/* 
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Extended Warranty</h3>
              <p className="text-gray-600 mb-4">
                Extend your vehicle's warranty for up to 5 years with our comprehensive coverage plans.
              </p>
              <p className="font-medium">Starting at $1,999</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Maintenance Package</h3>
              <p className="text-gray-600 mb-4">
                Pre-paid maintenance packages to keep your luxury vehicle in perfect condition.
              </p>
              <p className="font-medium">Starting at $2,499</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Concierge Service</h3>
              <p className="text-gray-600 mb-4">
                Personalized concierge service for all your vehicle needs, available 24/7.
              </p>
              <p className="font-medium">Starting at $999/year</p>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div ref={containerRef as React.RefObject<HTMLDivElement>} className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              <VariableProximity
                label="Frequently Asked Questions"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-gray-900"
              />
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQAccordionGroup faqs={pricingFAQs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-900/20 to-red-600/20 animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div ref={containerRef as React.RefObject<HTMLDivElement>}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              <VariableProximity
                label="Ready to Experience Luxury?"
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-white"
              />
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              <VariableProximity
                label="Join thousands of satisfied customers who have elevated their driving experience with WexCars."
                fromFontVariationSettings="'wght' 400, 'slnt' 0"
                toFontVariationSettings="'wght' 600, 'slnt' -2"
                containerRef={containerRef}
                radius={50}
                falloff="linear"
                className="text-gray-300"
              />
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-6 text-base">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 backdrop-blur-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-6 text-base">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
