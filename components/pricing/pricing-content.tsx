'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PriceFlow from '@/components/ui/price-flow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowRight, Check, Star, Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
  {
    id: 'standard',
    name: 'Standard',
    icon: Star,
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: 'Perfect for first-time luxury car buyers',
    features: [
      'Access to standard inventory',
      'Basic vehicle inspection',
      'Standard customer support',
    ],
    cta: 'Get Free',
    popular: false,
    buttonLink: '/dashboard',
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Zap,
    price: {
      monthly: 200,
      yearly: 160, // 20% off
    },
    description: 'Our most popular package for enthusiasts',
    features: [
      'Access to premium inventory',
      '150-point vehicle inspection',
      '90-day comprehensive warranty',
      'Priority customer support',
    ],
    cta: 'Choose Premium',
    popular: true,
    buttonLink: '/payment/premium',
  },
  {
    id: 'exclusive',
    name: 'Exclusive',
    icon: Shield,
    price: {
      monthly: 300,
      yearly: 240, // 20% off
    },
    description: 'The ultimate luxury experience',
    features: [
      'Access to exclusive & limited edition models',
      '200-point vehicle inspection with certification',
      '24/7 dedicated concierge',
      'Best available financing rates',
      'Free delivery nationwide',
      'Priority access to new arrivals',
    ],
    cta: 'Go Exclusive',
    popular: false,
    buttonLink: '/payment/exclusive',
  },
];

// FAQ Accordion Component
function FAQAccordionGroup({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all hover:border-primary-light/30 hover:shadow-xl"
        >
          <motion.button
            onClick={() => toggleAccordion(index)}
            className="flex w-full items-center justify-between p-8 text-left transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <h3 className="text-xl font-bold text-gray-900 pr-4 group-hover:text-primary-light transition-colors">
              {faq.question}
            </h3>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
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

          {openIndex === index && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
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
        </motion.div>
      ))}
    </div>
  );
}

const pricingFAQs = [
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Yes, you can upgrade your plan at any time. The price difference will be prorated for the remainder of your billing cycle.',
  },
  {
    question: 'Is there a minimum commitment period?',
    answer: 'Our Standard and Premium plans require a 3-month minimum commitment. The Exclusive plan requires a 6-month minimum commitment.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and cryptocurrency payments for select plans.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel your subscription at any time after the minimum commitment period. No refunds are provided for the current billing cycle.',
  },
];

export default function PricingContent() {
  const [frequency, setFrequency] = useState<string>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex-grow">
      <div className="not-prose relative flex w-full flex-col gap-16 overflow-hidden px-4 py-24 text-center sm:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-primary-light/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl" />
          <div className="bg-primary-light/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
          <div className="bg-primary-light/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center space-y-2">
            <Badge
              variant="outline"
              className="border-primary-light/20 bg-primary-light/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
            >
              <Sparkles className="text-primary-light mr-1 h-3.5 w-3.5 animate-pulse" />
              Pricing Plans
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
            >
              Pick the perfect plan for your needs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground max-w-md pt-2 text-lg"
            >
              Choose the perfect plan that suits your luxury vehicle needs. All plans include access to our exclusive collection of premium vehicles.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Tabs
              defaultValue={frequency}
              onValueChange={setFrequency}
              className="bg-muted/30 inline-block rounded-full p-1 shadow-sm"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger
                  value="monthly"
                  className="data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className="data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm"
                >
                  Yearly
                  <Badge
                    variant="secondary"
                    className="bg-primary-light/10 text-primary-light hover:bg-primary-light/15 ml-2"
                  >
                    20% off
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan, index) => {
              const price = plan.price[frequency as keyof typeof plan.price];
              const isFree = price === 0;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex"
                >
                  <Card
                    className={cn(
                      'bg-secondary/20 relative h-full w-full text-left transition-all duration-300 hover:shadow-lg',
                      plan.popular
                        ? 'ring-primary-light/50 dark:shadow-primary-light/10 shadow-md ring-2'
                        : 'hover:border-primary-light/30',
                      plan.popular &&
                        'from-primary-light/[0.03] bg-gradient-to-b to-transparent',
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 right-0 left-0 mx-auto w-fit">
                        <Badge className="bg-primary-light text-white rounded-full px-4 py-1 shadow-sm">
                          <Sparkles className="mr-1 h-3.5 w-3.5" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className={cn('pb-4', plan.popular && 'pt-8')}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full',
                            plan.popular
                              ? 'bg-primary-light/10 text-primary-light'
                              : 'bg-secondary text-foreground',
                          )}
                        >
                          <plan.icon className="h-4 w-4" />
                        </div>
                        <CardTitle
                          className={cn(
                            'text-xl font-bold',
                            plan.popular && 'text-primary-light',
                          )}
                        >
                          {plan.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="mt-3 space-y-2">
                        <p className="text-sm">{plan.description}</p>
                        <div className="pt-2">
                          {isFree ? (
                            <span
                              className={cn(
                                'text-2xl font-bold',
                                plan.popular ? 'text-primary-light' : 'text-foreground',
                              )}
                            >
                              Free forever
                            </span>
                          ) : (
                            <div className="flex items-baseline">
                              <span
                                className={cn(
                                  'text-3xl font-bold',
                                  plan.popular ? 'text-primary-light' : 'text-foreground',
                                )}
                              >
                                $
                              </span>
                              <span
                                className={cn(
                                  'text-3xl font-bold',
                                  plan.popular ? 'text-primary-light' : 'text-foreground',
                                )}
                              >
                                <PriceFlow value={price} />
                              </span>
                              <span className="text-muted-foreground ml-1 text-sm">
                                /month, billed {frequency}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 pb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + featureIndex * 0.05 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded-full',
                              plan.popular
                                ? 'bg-primary-light/10 text-primary-light'
                                : 'bg-secondary text-secondary-foreground',
                            )}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span
                            className={
                              plan.popular
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }
                          >
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Link href={plan.buttonLink} className="w-full">
                        <Button
                          variant={plan.popular ? 'default' : 'outline'}
                          className={cn(
                            'w-full font-medium transition-all duration-300',
                            plan.popular
                              ? 'bg-primary-light hover:bg-primary-dark hover:shadow-primary-light/20 hover:shadow-md'
                              : 'hover:border-primary-light/30 hover:bg-primary-light/5 hover:text-primary-light',
                          )}
                        >
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardFooter>

                    {/* Subtle gradient effects */}
                    {plan.popular ? (
                      <>
                        <div className="from-primary-light/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-lg bg-gradient-to-t to-transparent" />
                        <div className="border-primary-light/20 pointer-events-none absolute inset-0 rounded-lg border" />
                      </>
                    ) : (
                      <div className="hover:border-primary-light/10 pointer-events-none absolute inset-0 rounded-lg border border-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQAccordionGroup faqs={pricingFAQs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public/lycan-hypersport-concept.png"
            alt="Luxury Hypercar"
            className="w-full h-full object-cover object-center opacity-14"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(178, 34, 34, 0.9), rgba(139, 0, 0, 0.9))',
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Experience Luxury?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Join thousands of satisfied customers who have elevated their driving experience with WexCars.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/dashboard">
              <Button className="bg-white hover:bg-gray-100 text-primary-light font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-6 text-base">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-white hover:bg-gray-100 text-primary-light font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-6 text-base">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
