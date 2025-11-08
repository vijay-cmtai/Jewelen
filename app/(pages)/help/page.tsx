import Link from "next/link";
import {
  LifeBuoy,
  Search,
  Truck,
  Package,
  CreditCard,
  User,
  ChevronDown,
} from "lucide-react";

// Help categories ka data
const helpCategories = [
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Track your order, shipping timelines, and delivery info.",
    href: "/help/shipping",
  },
  {
    icon: Package,
    title: "Orders & Returns",
    description:
      "Manage your orders, initiate a return, or check refund status.",
    href: "/help/returns",
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description: "Accepted payment methods, invoices, and billing questions.",
    href: "/help/payments",
  },
  {
    icon: User,
    title: "Account & Security",
    description: "Manage your profile, password, and privacy settings.",
    href: "/help/account",
  },
];

// FAQ data
const faqData = [
  {
    question: "How can I track my order?",
    answer:
      "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also find tracking information in your account dashboard under 'My Orders'.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for unused items in their original packaging. To start a return, please visit the 'Orders & Returns' section in your account or contact our support team.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other digital wallets like Apple Pay and Google Pay.",
  },
  {
    question: "How do I change my shipping address?",
    answer:
      "If your order has not yet shipped, you can update the shipping address from your account dashboard. If the order is already in transit, please contact our support team immediately for assistance.",
  },
];

export default function HelpPage() {
  return (
    <main className="bg-gray-50/70">
      {/* Hero Section with Search */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:px-8 text-center">
          <LifeBuoy className="mx-auto h-12 w-12 text-orange-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to your questions, fast.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="block w-full rounded-full border-gray-300 py-4 pl-12 pr-4 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Search for answers..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group block text-center bg-white p-8 rounded-2xl border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <category.icon className="mx-auto h-10 w-10 text-orange-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details
                key={index}
                className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden"
                open={index === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                  <h3 className="font-medium">{faq.question}</h3>
                  <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" />
                </summary>
                <p className="mt-4 leading-relaxed text-gray-700">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center bg-orange-50 p-12 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Still need help?</h2>
          <p className="mt-3 text-gray-600">
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 shadow-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
