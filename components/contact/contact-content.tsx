'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Earth from '@/components/ui/globe';
import { Label } from '@/components/ui/label';
import { Check, Loader2, MapPin, Phone, Mail, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

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
      <section className="bg-background relative w-full overflow-hidden py-16 md:py-24">
        <div
          className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: `radial-gradient(circle at center, #b22222, transparent 70%)`,
          }}
        />
        <div
          className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px]"
          style={{
            background: `radial-gradient(circle at center, #8b0000, transparent 70%)`,
          }}
        />

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="border-border/40 bg-secondary/20 mx-auto max-w-5xl overflow-hidden rounded-[28px] border shadow-xl backdrop-blur-sm">
            <div className="grid md:grid-cols-2">
              <div className="relative p-6 md:p-10" ref={formRef}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative flex w-full gap-2"
                >
                  <h2 className="from-foreground to-foreground/80 mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                    Contact
                  </h2>
                  <span className="text-primary-light w-full text-4xl font-bold tracking-tight italic md:text-5xl">
                    Us
                  </span>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="name">Full Name <span className="text-primary">*</span></Label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="email">Email <span className="text-primary">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="subject">Subject <span className="text-primary">*</span></Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    <Label htmlFor="message">Message <span className="text-primary">*</span></Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Please provide details about your inquiry..."
                      required
                      className="h-40 resize-none"
                    />
                  </motion.div>

                  <motion.div
                    className="flex items-start space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="h-4 w-4 text-primary border-gray-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{' '}
                      and consent to WexCars processing my data for the purpose of contacting me.
                    </label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className="w-full bg-gradient-to-b from-primary-light to-primary-dark text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] hover:from-primary-dark hover:to-primary-darker"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </span>
                      ) : isSubmitted ? (
                        <span className="flex items-center justify-center">
                          <Check className="mr-2 h-4 w-4" />
                          Message Sent!
                        </span>
                      ) : (
                        <span>Send Message</span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative my-8 flex items-center justify-center overflow-hidden pr-8"
              >
                <div className="flex flex-col items-center justify-center overflow-hidden">
                  <article className="relative mx-auto h-[350px] min-h-60 max-w-[450px] overflow-hidden rounded-3xl border bg-gradient-to-b from-primary-light to-primary-light/5 p-6 text-3xl tracking-tight text-white md:h-[450px] md:min-h-80 md:p-8 md:text-4xl md:leading-[1.05] lg:text-5xl">
                    <div className="relative z-20">
                      <h3 className="mb-4 font-bold">Get In Touch</h3>
                      <div className="space-y-4 text-lg md:text-xl lg:text-2xl">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Malmö, Sweden</p>
                            <p className="text-sm opacity-80">European Headquarters</p>
                            <p className="text-xs opacity-60">Postal Code: 215 52</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm">+46737200581</p>
                            <p className="text-sm">+1 (555) 987-6543</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 mt-1 flex-shrink-0" />
                          <p className="text-sm">support@wexcars.com</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 mt-1 flex-shrink-0" />
                          <div className="text-sm">
                            <p>Mon-Fri: 9:00 AM - 7:00 PM</p>
                            <p>Sat: 10:00 AM - 5:00 PM</p>
                            <p>Sun: Closed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
                      <Earth
                        scale={1.1}
                        baseColor={[178/255, 34/255, 34/255]}
                        markerColor={[139/255, 0, 0]}
                        glowColor={[178/255, 34/255, 34/255]}
                      />
                    </div>
                  </article>
                </div>
              </motion.div>
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
