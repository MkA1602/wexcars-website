'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { SignInPageWrapper } from '@/components/auth/sign-in-page-wrapper';

// GitHub Raw URL base for reliable image serving
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/MkA1602/wexcars-website/main/public";

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState('/dashboard');
  const router = useRouter();
  const { signIn } = useAuth();

  // Get the redirect path from URL on client side only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirectTo");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, []);

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('wexcars-user-email');
    const isRemembered = localStorage.getItem('wexcars-remember-me');
    
    if (rememberedEmail && isRemembered === 'true') {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError, success } = await signIn(email, password, rememberMe);

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      } else if (success) {
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 bg-gray-50">
      <style jsx>{`
        .login-btn {
          background: linear-gradient(135deg, #b22222 0%, #8b0000 100%);
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
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
        .login-btn:hover::before {
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
                  Drive Luxury, Live Excellence
                </h1>
                <p className="mb-12 text-xl opacity-90 leading-relaxed">
                  Join thousands of luxury car enthusiasts who trust WexCars to
                  deliver the finest automotive experiences
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Car size={20} />,
                      title: 'Premium Vehicle Collection',
                      desc: 'Access to exclusive luxury and supercar inventory',
                    },
                    {
                      icon: <ShieldCheck size={20} />,
                      title: 'Comprehensive Inspections',
                      desc: '200-point vehicle inspection with certification',
                    },
                    {
                      icon: <Globe size={20} />,
                      title: 'Global Shipping',
                      desc: 'Worldwide delivery for your luxury vehicle',
                    },
                    {
                      icon: <Award size={20} />,
                      title: 'Expert Concierge Service',
                      desc: '24/7 dedicated support for your needs',
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
                    Welcome back
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Sign in to continue your luxury car journey
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-border bg-input block w-full rounded-lg border py-3 pr-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-border bg-input block w-full rounded-lg border py-3 pr-12 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                        placeholder="Enter your password"
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
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-muted-foreground flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="border-border text-primary-light h-4 w-4 rounded mr-2"
                      />
                      <span>Remember me</span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-primary-light hover:text-primary-dark text-sm"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="login-btn relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Signing in...</span>
                      </>
                    ) : (
                      'Sign in to your account'
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
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/register" className="text-primary-light hover:text-primary-dark font-medium">
                    Sign up for free
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

export default function LoginPage() {
  return (
    <SignInPageWrapper>
      <LoginPageContent />
    </SignInPageWrapper>
  );
}
