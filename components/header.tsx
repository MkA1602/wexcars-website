'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public';

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Our Collections', href: '/collections' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// TextRoll component for animated text effect
const STAGGER = 0.035;

const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogoError = () => {
    console.error('Logo failed to load, trying fallback');
    setLogoError(true);
  };

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    scrolled: {
      backdropFilter: 'blur(20px)',
      backgroundColor:
        theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: 'auto' },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      variants={headerVariants}
      initial="initial"
      animate={isScrolled ? 'scrolled' : 'animate'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        backgroundColor: isScrolled
          ? theme === 'dark'
            ? 'rgba(0, 0, 0, 0.8)'
            : 'rgba(255, 255, 255, 0.8)'
          : 'transparent',
        boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Link
              prefetch={false}
              href="/"
              className="flex items-center space-x-2"
            >
              {!logoError ? (
                <div className="relative h-8 w-24 md:h-10 md:w-32 flex-shrink-0">
                  <Image
                    src={`${GITHUB_RAW_BASE}/new-red-logo-wexcars.png`}
                    alt="WexCars Logo"
                    width={120}
                    height={28}
                    className="h-full w-auto object-contain"
                    priority
                    onError={handleLogoError}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-light to-primary-dark">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              )}
              {logoError && (
                <span className="bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-xl font-bold text-transparent">
                  WexCars
                </span>
              )}
            </Link>
          </motion.div>

          <nav className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => {
              // Apply TextRoll effect only to: Our Collections, Pricing, About, Contact
              const shouldUseTextRoll = ['Our Collections', 'Pricing', 'About', 'Contact'].includes(item.name);
              
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasDropdown && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    prefetch={false}
                    href={item.href}
                    className="text-foreground flex items-center space-x-1 font-medium transition-colors duration-200 hover:text-primary-light"
                  >
                    {shouldUseTextRoll ? (
                      <div className="relative flex items-start">
                        <TextRoll
                          center
                          className="text-base font-medium leading-normal"
                        >
                          {item.name}
                        </TextRoll>
                      </div>
                    ) : (
                      <span>{item.name}</span>
                    )}
                    {item.hasDropdown && (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </Link>

                {item.hasDropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        className="border-border bg-background/95 absolute top-full left-0 mt-2 w-64 overflow-hidden rounded-xl border shadow-xl backdrop-blur-lg"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            prefetch={false}
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="hover:bg-muted block px-4 py-3 transition-colors duration-200"
                          >
                            <div className="text-foreground font-medium">
                              {dropdownItem.name}
                            </div>
                            {dropdownItem.description && (
                              <div className="text-muted-foreground text-sm">
                                {dropdownItem.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
            })}
          </nav>

          <div className="hidden items-center space-x-4 lg:flex">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border border-gray-300 py-2 px-4 w-44 lg:w-64 focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 top-0 h-full rounded-full bg-primary-light hover:bg-primary-dark text-white px-4 text-sm font-medium"
              >
                Search
              </motion.button>
            </form>

            <Link
              prefetch={false}
              href="/sign-in"
              className="text-foreground font-medium transition-colors duration-200 hover:text-primary-light"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                prefetch={false}
                href="/sign-up"
                className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-primary-light to-primary-dark px-6 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg"
              >
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.button
            className="hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="overflow-hidden lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="border-border bg-background/95 mt-4 space-y-2 rounded-xl border py-4 shadow-xl backdrop-blur-lg">
                {navItems.map((item) => (
                  <Link
                    prefetch={false}
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:bg-muted block px-4 py-3 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-border px-4 py-2">
                  <form onSubmit={handleSearch} className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-gray-300 py-2 px-4 pr-20 focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
                      />
                      <button
                        type="submit"
                        className="absolute right-0 top-0 h-full rounded-full bg-primary-light hover:bg-primary-dark text-white px-4 text-sm font-medium"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
                <div className="space-y-2 px-4 py-2">
                  <Link
                    prefetch={false}
                    href="/sign-in"
                    className="text-foreground hover:bg-muted block w-full rounded-lg py-2.5 text-center font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    prefetch={false}
                    href="/sign-up"
                    className="block w-full rounded-lg bg-gradient-to-r from-primary-light to-primary-dark py-2.5 text-center font-medium text-white transition-all duration-200 hover:shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
