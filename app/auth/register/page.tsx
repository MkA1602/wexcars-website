'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Car,
  ShieldCheck,
  Globe,
  Award,
  User,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { SignUpPageWrapper } from '@/components/auth/sign-up-page-wrapper';
import RateLimitHandler from '@/components/auth/rate-limit-handler';

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public";

function RegisterPageContent() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError(null);
    setSuccessMessage(null);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error, success } = await signUp(formData.email, formData.password, formData.fullName);

      if (error) {
        setServerError(error.message);
      } else if (success) {
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setTimeout(() => {
          router.push('/auth/email-confirmation');
        }, 2000);
      }
    } catch (error: any) {
      setServerError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 bg-gray-50">
      <style jsx>{`
        .signup-btn {
          background: linear-gradient(135deg, #b22222 0%, #8b0000 100%);
          position: relative;
          overflow: hidden;
        }
        .signup-btn::before {
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
        .signup-btn:hover::before {
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
              {/* Left Side */}
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
                  Start Your Journey
                </h1>
                <p className="mb-12 text-xl opacity-90 leading-relaxed">
                  Join the exclusive community of luxury car enthusiasts and
                  discover your perfect vehicle today
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Car size={20} />,
                      title: 'Exclusive Access',
                      desc: 'Browse our curated collection of luxury vehicles',
                    },
                    {
                      icon: <ShieldCheck size={20} />,
                      title: 'Verified Listings',
                      desc: 'Every vehicle undergoes rigorous inspection',
                    },
                    {
                      icon: <Globe size={20} />,
                      title: 'Worldwide Delivery',
                      desc: 'We ship to destinations across the globe',
                    },
                    {
                      icon: <Award size={20} />,
                      title: 'Premium Support',
                      desc: 'Dedicated concierge service for all members',
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

            {/* Right Side */}
            <div className="flex flex-col justify-center p-8 md:p-12 bg-white">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-light uppercase tracking-wider text-gray-900">
                    Create account
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Join WexCars and unlock exclusive access
                  </p>
                </div>

                {serverError && (
                  <div className="mb-6">
                    <RateLimitHandler 
                      error={serverError} 
                      onRetry={() => setServerError(null)}
                    />
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium uppercase text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={`border-border bg-input block w-full rounded-lg border py-3 pr-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${errors.fullName ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium uppercase text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`border-border bg-input block w-full rounded-lg border py-3 pr-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium uppercase text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`border-border bg-input block w-full rounded-lg border py-3 pr-12 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Must be 8+ characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium uppercase text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`border-border bg-input block w-full rounded-lg border py-3 pr-12 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex items-start">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="border-border text-primary-light h-4 w-4 rounded mt-1"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-light hover:text-primary-dark">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary-light hover:text-primary-dark">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-xs text-red-600">{errors.terms}</p>
                  )}

                  <button
                    type="submit"
                    className="signup-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Creating account...</span>
                      </>
                    ) : (
                      'Create your account'
                    )}
                  </button>

                  <div className="relative text-center text-sm text-stone-500">
                    <div className="absolute inset-0 flex items-center">
                      <div className="border-border w-full border-t"></div>
                    </div>
                    <span className="relative px-2 bg-white">Or continue with</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="border-border bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm shadow-sm transition-colors"
                    >
                      <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        className="h-5 w-5"
                        alt="Google"
                      />
                      <span className="ml-2">Google</span>
                    </button>
                    <button
                      type="button"
                      className="border-border bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm shadow-sm transition-colors"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="ml-2">Apple</span>
                    </button>
                  </div>
                </form>

                <div className="text-muted-foreground mt-8 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-primary-light hover:text-primary-dark font-medium">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <SignUpPageWrapper>
      <RegisterPageContent />
    </SignUpPageWrapper>
  );
}
