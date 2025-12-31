'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Loader2, MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import dynamic from 'next/dynamic';

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public";

// Dynamically import OpenStreetMap to avoid SSR issues and chunk loading problems
const OpenStreetMap = dynamic(() => import('@/components/openstreet-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
      <div className="text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function ContactContent() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyAgreed) {
      alert('Please agree to the Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, we would send the form data to a server
      console.log('Form submitted:', formState);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setPrivacyAgreed(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow">
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 bg-gray-50">
        <style jsx>{`
          .contact-btn {
            background: linear-gradient(135deg, #b22222 0%, #8b0000 100%);
            position: relative;
            overflow: hidden;
          }
          .contact-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.3),
              transparent
            );
            transition: left 0.5s;
          }
          .contact-btn:hover::before {
            left: 100%;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .feature-item {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>
        <div className="z-10 w-full max-w-6xl">
          <div className="bg-secondary/50 overflow-hidden rounded-[40px] shadow-2xl">
            <div className="grid min-h-[700px] lg:grid-cols-2">
              {/* Left Side - Contact Info */}
              <div className="brand-side relative m-4 rounded-3xl overflow-hidden p-12 text-white">
                <img
                  src="/sign in/black-car-with-word-snoff-back.jpg"
                  alt="Luxury Car Background"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${GITHUB_RAW_BASE}/sign in/black-car-with-word-snoff-back.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-light/60 to-primary-dark/60 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-12">
                    <img
                      src="/new-white-logo-wexcars.png"
                      alt="WexCars Logo"
                      className="h-12 w-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `${GITHUB_RAW_BASE}/new-white-logo-wexcars.png`;
                      }}
                    />
                  </div>
                  <h1 className="mb-4 text-5xl md:text-6xl font-bold leading-tight">
                    Get In Touch
                  </h1>
                  <p className="mb-12 text-xl opacity-90 leading-relaxed">
                    We're here to help you find your perfect luxury vehicle.
                    Reach out to our team for personalized assistance.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        icon: <MapPin size={20} />,
                        title: 'Malmö, Sweden',
                        desc: 'European Headquarters • Postal Code: 215 52',
                      },
                      {
                        icon: <Phone size={20} />,
                        title: 'Phone Support',
                        desc: '+46737200581 • +1 (555) 987-6543',
                      },
                      {
                        icon: <Mail size={20} />,
                        title: 'Email Us',
                        desc: 'support@wexcars.com',
                      },
                      {
                        icon: <Clock size={20} />,
                        title: 'Business Hours',
                        desc: 'Mon-Fri: 9:00 AM - 7:00 PM • Sat: 10:00 AM - 5:00 PM',
                      },
                    ].map(({ icon, title, desc }, i) => (
                      <div
                        key={i}
                        className="feature-item flex items-center"
                        style={{ animationDelay: `${0.2 * (i + 1)}s` }}
                      >
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
                          {icon}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{title}</div>
                          <div className="text-sm opacity-80">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="flex flex-col justify-center p-8 md:p-12 bg-white" ref={formRef}>
                <div className="mx-auto w-full max-w-md">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8 text-center"
                  >
                    <h2 className="text-3xl font-light uppercase tracking-wider text-gray-900">
                      Contact Us
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Send us a message and we'll get back to you soon
                    </p>
                  </motion.div>

                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium uppercase text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          required
                          className="border-border bg-input block w-full rounded-lg border py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium uppercase text-gray-700"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                          className="border-border bg-input block w-full rounded-lg border py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                        />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ delay: 0.55 }}
                      >
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-medium uppercase text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          className="border-border bg-input block w-full rounded-lg border py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label
                          htmlFor="subject"
                          className="mb-2 block text-sm font-medium uppercase text-gray-700"
                        >
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formState.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          required
                          className="border-border bg-input block w-full rounded-lg border py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: 0.65 }}
                    >
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium uppercase text-gray-700"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        required
                        rows={5}
                        className="border-border bg-input block w-full rounded-lg border py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent resize-none"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-start"
                    >
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                        className="border-border text-primary-light h-4 w-4 rounded mt-1"
                        required
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="/privacy" className="text-primary-light hover:text-primary-dark">
                          Privacy Policy
                        </a>{' '}
                        and consent to WexCars processing my data.
                      </label>
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className="contact-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="ml-2">Sending...</span>
                        </>
                      ) : isSubmitted ? (
                        <>
                          <Check className="h-5 w-5" />
                          <span className="ml-2">Message Sent!</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span className="ml-2">Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our Location
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <OpenStreetMap height="500px" className="shadow-lg" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
