"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Printer, ExternalLink, Cookie } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function CookieClientPage() {
  useEffect(() => {
    // Client-side code can go here
  }, [])

  return (
    <main className="flex-grow py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb navigation */}
        <nav className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-light transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Cookie Policy</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header section with actions */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-light/10 rounded-full flex items-center justify-center">
                  <Cookie className="h-6 w-6 text-primary-light" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
                  <p className="text-gray-500">
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>

            {/* Table of contents */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  <a href="#what-are-cookies" className="hover:text-primary-light transition-colors">
                    What Are Cookies
                  </a>
                </li>
                <li>
                  <a href="#types-of-cookies" className="hover:text-primary-light transition-colors">
                    Types of Cookies We Use
                  </a>
                </li>
                <li>
                  <a href="#cookie-purposes" className="hover:text-primary-light transition-colors">
                    How We Use Cookies
                  </a>
                </li>
                <li>
                  <a href="#third-party" className="hover:text-primary-light transition-colors">
                    Third-Party Cookies
                  </a>
                </li>
                <li>
                  <a href="#cookie-management" className="hover:text-primary-light transition-colors">
                    Managing Your Cookie Preferences
                  </a>
                </li>
                <li>
                  <a href="#policy-updates" className="hover:text-primary-light transition-colors">
                    Updates to This Policy
                  </a>
                </li>
                <li>
                  <a href="#contact-us" className="hover:text-primary-light transition-colors">
                    Contact Us
                  </a>
                </li>
              </ol>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none">
              <p>
                At WexCars, we use cookies and similar technologies to enhance your browsing experience, personalize
                content and ads, analyze our traffic, and understand where our visitors are coming from. This Cookie
                Policy explains how we use cookies, your choices regarding cookies, and more information about them.
              </p>
              <p>
                By continuing to use our website, you consent to our use of cookies in accordance with this Cookie
                Policy.
              </p>

              {/* What Are Cookies */}
              <h2 id="what-are-cookies" className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
                1. What Are Cookies
              </h2>
              <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you
                visit websites. They are widely used to make websites work more efficiently and provide information to
                the website owners. Cookies enhance user experience by:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Remembering your preferences and settings</li>
                <li>Helping you navigate between pages efficiently</li>
                <li>Enabling websites to remember your device and preferences</li>
                <li>Improving overall user experience</li>
              </ul>

              {/* Types of Cookies */}
              <h2 id="types-of-cookies" className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
                2. Types of Cookies We Use
              </h2>

              <Tabs defaultValue="essential" className="mt-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="essential">Essential</TabsTrigger>
                  <TabsTrigger value="functional">Functional</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="marketing">Marketing</TabsTrigger>
                </TabsList>
                <TabsContent value="essential" className="p-6 bg-gray-50 rounded-lg mt-4">
                  <h3 className="font-bold text-lg mb-2">Essential Cookies</h3>
                  <p className="mb-4">
                    These cookies are necessary for the website to function properly. They enable basic functions like
                    page navigation, secure areas access, and shopping cart features. The website cannot function
                    properly without these cookies.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-700 mb-2">
                      <div>Cookie Name</div>
                      <div>Purpose</div>
                      <div>Duration</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>session_id</div>
                      <div>Maintains user session</div>
                      <div>Session</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>csrf_token</div>
                      <div>Security - prevents cross-site request forgery</div>
                      <div>Session</div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="functional" className="p-6 bg-gray-50 rounded-lg mt-4">
                  <h3 className="font-bold text-lg mb-2">Functional Cookies</h3>
                  <p className="mb-4">
                    These cookies enable enhanced functionality and personalization. They may be set by us or by third
                    parties whose services we have added to our pages. If you disable these cookies, some or all of
                    these services may not function properly.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-700 mb-2">
                      <div>Cookie Name</div>
                      <div>Purpose</div>
                      <div>Duration</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>language_preference</div>
                      <div>Remembers user language preference</div>
                      <div>1 year</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>recently_viewed</div>
                      <div>Tracks recently viewed vehicles</div>
                      <div>30 days</div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="p-6 bg-gray-50 rounded-lg mt-4">
                  <h3 className="font-bold text-lg mb-2">Analytics Cookies</h3>
                  <p className="mb-4">
                    These cookies help us understand how visitors interact with our website by collecting and
                    reporting information anonymously. They help us improve our website and services.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-700 mb-2">
                      <div>Cookie Name</div>
                      <div>Purpose</div>
                      <div>Duration</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>_ga</div>
                      <div>Google Analytics - Distinguishes users</div>
                      <div>2 years</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>_gid</div>
                      <div>Google Analytics - Identifies user session</div>
                      <div>24 hours</div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="marketing" className="p-6 bg-gray-50 rounded-lg mt-4">
                  <h3 className="font-bold text-lg mb-2">Marketing Cookies</h3>
                  <p className="mb-4">
                    These cookies track your browsing habits to enable us to show advertising which is more likely to
                    be of interest to you. They are also used to limit the number of times you see an advertisement
                    and help measure the effectiveness of advertising campaigns.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-700 mb-2">
                      <div>Cookie Name</div>
                      <div>Purpose</div>
                      <div>Duration</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>_fbp</div>
                      <div>Facebook Pixel - Tracks conversions</div>
                      <div>3 months</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 py-2">
                      <div>ads_prefs</div>
                      <div>Stores user ad preferences</div>
                      <div>1 year</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* How We Use Cookies */}
              <h2 id="cookie-purposes" className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
                3. How We Use Cookies
              </h2>
              <p>We use cookies for various purposes, including:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>
                  <strong>Authentication and Security:</strong> To identify you when you log in and provide secure
                  browsing experience.
                </li>
                <li>
                  <strong>Preferences:</strong> To remember information about how you prefer the website to behave and
                  look.
                </li>
                <li>
                  <strong>Analytics and Performance:</strong> To understand how visitors interact with our website,
                  which pages are most popular, and identify any issues with our website.
                </li>
                <li>
                  <strong>Advertising:</strong> To make advertising more relevant to you and your interests, and
                  measure the effectiveness of advertising campaigns.
                </li>
              </ul>

              {/* Third-Party Cookies */}
              <h2 id="third-party" className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
                4. Third-Party Cookies
              </h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage
                statistics, deliver advertisements, and so on. These cookies may be placed when you visit our website
                or when you click on a link from our website. They include cookies from the following third parties:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink size={16} className="text-primary-light" />
                    <h3 className="font-bold">Google Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Used to track website usage and user behavior to help us improve our website.
                  </p>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light text-sm hover:underline mt-2 inline-block"
                  >
                    Privacy Policy
                  </a>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink size={16} className="text-primary-light" />
                    <h3 className="font-bold">Facebook Pixel</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Used to track conversions from Facebook ads and optimize advertising campaigns.
                  </p>
                  <a
                    href="https://www.facebook.com/policy.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light text-sm hover:underline mt-2 inline-block"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>

              {/* Managing Cookies */}
              <h2 id="cookie-management" className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
                5. Managing Your Cookie Preferences
              </h2>
              <p>
                Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse
                cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to
                browser, and from version to version.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <h3 className="font-bold mb-4">How to manage cookies in your browser:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Google Chrome</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                      <li>Click the three dots in the top right corner</li>
                      <li>Select "Settings"</li>
                      <li>Click on "Privacy and security"</li>
                      <li>Click on "Cookies and other site data"</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Mozilla Firefox</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                      <li>Click the three lines in the top right corner</li>
                      <li>Select "Options" (Windows) or "Preferences" (Mac)</li>
                      <li>Select "Privacy & Security"</li>
                      <li>Navigate to the "Cookies and Site Data" section</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Safari</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                      <li>Click "Safari" in the top menu</li>
                      <li>Select "Preferences"</li>
                      <li>Click on the "Privacy" tab</li>
                      <li>Find the "Cookies and website data" section</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Microsoft Edge</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                      <li>Click the three dots in the top right corner</li>
                      <li>Select "Settings"</li>
                      <li>Click on "Cookies and site permissions"</li>
                      <li>Click on "Manage and delete cookies and site data"</li>
                    </ol>
                  </div>
                </div>
              </div>
              <p className="mt-4">
                Please note that restricting cookies may impact your experience on our website and may limit your
                ability to use certain features.
              </p>

              {/* Updates to Policy */}
              <h2 id="policy-updates" className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
                6. Updates to This Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or
                our business practices. Any changes will be posted on this page with an updated revision date. If we
                make significant changes to this policy, we may notify you by email or by placing a prominent notice
                on our website.
              </p>

              {/* Contact Us */}
              <h2 id="contact-us" className="text-2xl font-bold mt-8 mb-4 scroll-mt-24">
                7. Contact Us
              </h2>
              <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us at:</p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="mb-1">
                  <strong>Email:</strong> support@wexcars.com
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p>
                  <strong>Address:</strong> 215 52<br />
                  Malmo<br />
                  Sweden
                </p>
              </div>
            </div>

            {/* Back to top button */}
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-200">
              <Link href="/" className="text-primary-light hover:underline flex items-center gap-1">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="text-primary-light hover:underline"
              >
                Back to Top
              </a>
            </div>
          </div>

          {/* Cookie consent management */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Manage Your Cookie Preferences</h2>
            <p className="text-gray-600 mb-6">
              You can adjust your cookie preferences at any time. Please note that disabling certain cookies may
              impact the functionality of our website.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-bold">Essential Cookies</h3>
                  <p className="text-sm text-gray-600">Required for the website to function properly</p>
                </div>
                <div className="bg-gray-200 px-3 py-1 rounded text-sm">Always Active</div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-bold">Functional Cookies</h3>
                  <p className="text-sm text-gray-600">Enable enhanced functionality and personalization</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-light"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-bold">Analytics Cookies</h3>
                  <p className="text-sm text-gray-600">Help us improve our website by collecting anonymous data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-light"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-bold">Marketing Cookies</h3>
                  <p className="text-sm text-gray-600">Used to deliver relevant ads and marketing campaigns</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-light"></div>
                </label>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-primary-light hover:bg-primary-dark text-white">Save Preferences</Button>
              <Button variant="outline" className="border-gray-300">
                Accept All
              </Button>
              <Button variant="outline" className="border-gray-300">
                Reject All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
