import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gray-50/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <ShieldCheck className="mx-auto h-12 w-12 text-orange-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your trust and privacy are important to us.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: October 26, 2023
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sticky Navigation Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-2">
              <a
                href="#introduction"
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Introduction
              </a>
              <a
                href="#information-we-collect"
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Information We Collect
              </a>
              <a
                href="#how-we-use-information"
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                How We Use Information
              </a>
              <a
                href="#data-security"
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Data Security
              </a>
              <a
                href="#your-rights"
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Your Rights & Choices
              </a>
              <a
                href="#contact-us"
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                Contact Us
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <article className="prose prose-orange lg:col-span-3 max-w-none text-gray-600">
            <section id="introduction" className="scroll-mt-24">
              <h2>Introduction</h2>
              <p>
                Welcome to Jewelen ("we," "our," or "us"). We are committed to
                protecting your personal information and your right to privacy.
                This Privacy Policy explains what information we collect, how we
                use it, and what rights you have in relation to it. This policy
                applies to all information collected through our website and/or
                any related services, sales, marketing, or events.
              </p>
            </section>

            <section id="information-we-collect" className="scroll-mt-24">
              <h2>Information We Collect</h2>
              <p>
                We collect personal information that you voluntarily provide to
                us when you register on the website, express an interest in
                obtaining information about us or our products and services,
                when you participate in activities on the website or otherwise
                when you contact us.
              </p>
              <h3>The personal information we collect includes:</h3>
              <ul>
                <li>
                  <strong>Personal Identification Information:</strong> Name,
                  email address, postal address, phone number.
                </li>
                <li>
                  <strong>Payment Data:</strong> We collect data necessary to
                  process your payment if you make purchases, such as your
                  payment instrument number (such as a credit card number), and
                  the security code associated with your payment instrument. All
                  payment data is stored by our payment processor.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about your device, IP
                  address, browser type, and how you navigate our website.
                </li>
              </ul>
            </section>

            <section id="how-we-use-information" className="scroll-mt-24">
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect for various business purposes,
                including:
              </p>
              <ul>
                <li>
                  To fulfill and manage your orders, payments, returns, and
                  exchanges.
                </li>
                <li>
                  To send you marketing and promotional communications. You can
                  opt-out of our marketing emails at any time.
                </li>
                <li>To improve our website, products, and services.</li>
                <li>
                  To respond to your inquiries and offer customer support.
                </li>
                <li>To protect our site from fraud and ensure security.</li>
              </ul>
            </section>

            <section id="data-security" className="scroll-mt-24">
              <h2>Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational
                security measures designed to protect the security of any
                personal information we process. However, despite our safeguards
                and efforts to secure your information, no electronic
                transmission over the Internet or information storage technology
                can be guaranteed to be 100% secure.
              </p>
            </section>

            <section id="your-rights" className="scroll-mt-24">
              <h2>Your Rights & Choices</h2>
              <p>
                You have certain rights regarding your personal information.
                Depending on your location, these may include the right to:
              </p>
              <ul>
                <li>Access a copy of your personal data.</li>
                <li>Request correction or deletion of your personal data.</li>
                <li>Opt-out of marketing communications.</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the details
                below.
              </p>
            </section>

            <section id="contact-us" className="scroll-mt-24">
              <h2>Contact Us</h2>
              <p>
                If you have questions or comments about this policy, you may
                email us at{" "}
                <Link
                  href="mailto:privacy@jewelen.com"
                  className="text-orange-600 hover:underline"
                >
                  privacy@jewelen.com
                </Link>{" "}
                or by post to:
              </p>
              <address className="not-italic border-l-4 border-orange-200 pl-4">
                Jewelen Privacy Department
                <br />
                123 Sparkle Avenue
                <br />
                Gemstone City, JC 45678
                <br />
                United States
              </address>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
