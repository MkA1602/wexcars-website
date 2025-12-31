'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type PricingPlan = {
  name: string;
  price: {
    monthly: string;
    annual: string;
  };
  description: string;
  features: string[];
  cta: string;
  tag: string;
  link: string;
  highlight?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: 'Standard',
    price: {
      monthly: 'Free',
      annual: 'Free',
    },
    description: 'Perfect for first-time luxury car buyers',
    features: [
      'Access to standard inventory',
      'Basic vehicle inspection',
      'Standard customer support',
    ],
    cta: 'Get Free',
    link: '/dashboard',
    tag: 'Free Plan',
  },
  {
    name: 'Premium',
    price: {
      monthly: '$200',
      annual: '$160',
    },
    description: 'Our most popular package for enthusiasts',
    features: [
      'Access to premium inventory',
      '150-point vehicle inspection',
      '90-day comprehensive warranty',
      'Priority customer support',
    ],
    cta: 'Choose Premium',
    link: '/payment/premium',
    tag: 'Standard Plan',
    highlight: true,
  },
  {
    name: 'Exclusive',
    price: {
      monthly: '$300',
      annual: '$240',
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
    link: '/payment/exclusive',
    tag: 'Premium Plan',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 150,
    },
  },
};

// FAQ Accordion Component
function FAQAccordionGroup({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

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

interface PricingProps {
  plans?: typeof pricingPlans;
  className?: string;
}

const PricingPage = ({ plans = pricingPlans, className }: PricingProps) => {
  const [isAnnual, setIsAnnual] = React.useState(false);

  return (
    <main className="flex-grow">
      <div className={cn('relative w-full overflow-hidden', className)}>
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-primary-light/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
          <div className="bg-primary-light/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
          <h1 className="text-center text-[7rem] font-bold md:text-[10rem] text-gray-100 select-none pointer-events-none">
            Pricing
          </h1>
        </div>

        {/* Billing Toggle */}
        <div className="relative z-10 pt-12 pb-8">
          <BillingToggle
            isAnnual={isAnnual}
            onCheckedChange={setIsAnnual}
            className="mb-12"
          />
          </div>

        {/* Pricing Container */}
        <div className="relative container pt-8 md:pt-12 pb-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative z-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                variants={itemVariants}
                plan={plan}
                isAnnual={isAnnual}
              />
            ))}
          </motion.div>
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
};

interface PriceDisplayProps {
  price: {
    monthly: string;
    annual: string;
  };
  isAnnual: boolean;
  className?: string;
}

const PriceDisplay = ({ price, isAnnual, className }: PriceDisplayProps) => {
  return (
    <div className={cn('relative mb-8', className)}>
      <div
        className={cn(
          'mt-2 text-6xl font-bold',
          'from-foreground bg-gradient-to-r to-transparent bg-clip-text text-transparent',
        )}
      >
        {price.monthly === 'Free' ? (
          <span>Free</span>
        ) : (
          <>
            <span>{isAnnual ? price.annual : price.monthly}</span>
            <span className="text-4xl">/{isAnnual ? 'y' : 'm'}</span>
          </>
        )}
      </div>
    </div>
  );
};

interface PricingFeaturesProps {
  features: string[];
  className?: string;
}

const PricingFeatures = ({ features, className }: PricingFeaturesProps) => {
  return (
    <ul className={cn('relative mb-8 space-y-3', className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-center">
          <div className="bg-foreground/10 shadow-foreground/50 mr-3 rounded-full p-1 shadow-inner">
            <Check className="h-4 w-4" />
          </div>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

interface PricingCardProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  plan: PricingPlan;
  isAnnual: boolean;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ plan, isAnnual, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative flex flex-col justify-between overflow-hidden rounded-2xl p-6',
          'border-border/50 border',
          'bg-background/20 backdrop-blur-sm',
          'shadow-[inset_0_1px_30px_0_rgba(255,255,255,0.1)]',
          "before:absolute before:inset-0 before:-z-10 before:content-['']",
          'before:bg-gradient-to-br before:from-white/7 before:to-transparent',
          'before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
          "after:absolute after:inset-0 after:-z-20 after:content-['']",
          'after:bg-[radial-gradient(circle_at_75%_25%,hsl(var(--primary)/0.05),transparent_70%)]',
          'after:opacity-70',
          'hover:border-border/70 hover:shadow-lg',
          plan.highlight && 'ring-2 ring-primary-light/50',
          className,
        )}
        whileHover={{ y: -8 }}
        {...props}
      >
        <div>
          <div className="py-2">
            <div className="text-muted-foreground text-sm font-medium">
              {plan.tag}
            </div>
            <h3 className="text-2xl font-bold mt-2 mb-2">{plan.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
          </div>

          <PriceDisplay price={plan.price} isAnnual={isAnnual} />

          <PricingFeatures features={plan.features} />
        </div>

        <div className="relative">
          <Link href={plan.link} className="block">
            <Button
              className={cn(
                'after:bg-primary/80 relative w-full after:absolute after:-z-10 after:h-full after:w-full after:blur-xs',
                plan.highlight && 'bg-primary-light hover:bg-primary-dark text-white',
              )}
              variant={plan.highlight ? 'default' : 'outline'}
            >
              {plan.cta}
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  },
);

PricingCard.displayName = 'PricingCard';

interface BillingToggleProps {
  isAnnual: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const BillingToggle = ({
  isAnnual,
  onCheckedChange,
  className,
}: BillingToggleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        className,
      )}
    >
      <div className="bg-background/50 border-border/50 mt-8 flex items-center gap-4 rounded-full border p-2 backdrop-blur-sm">
        <Label htmlFor="billing-toggle">Monthly</Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="billing-toggle">
          Annual <span className="text-primary-light">(20% off)</span>
        </Label>
      </div>
    </motion.div>
  );
};

export default PricingPage;

export type { PricingPlan };

export { pricingPlans };

export { PriceDisplay, PricingFeatures, PricingCard, BillingToggle };
