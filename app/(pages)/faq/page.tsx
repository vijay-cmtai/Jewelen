// File: app/faq/page.tsx

import Link from "next/link";
import { HelpCircle, ChevronDown, Mail } from "lucide-react";

// FAQ ka saara data yahan hai. Aap ise aasani se badal sakte hain.
const faqData = [
  {
    id: "ordering",
    category: "Ordering & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other digital payment methods like Apple Pay and Google Pay. All transactions are secure and encrypted.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "If you need to modify or cancel your order, please contact us at <a href='mailto:support@jewelen.com' class='text-orange-600 underline'>support@jewelen.com</a> within 2 hours of placing the order. We process orders quickly, but we'll do our best to accommodate your request.",
      },
      {
        q: "How do I apply a discount code?",
        a: "You can apply your discount code at checkout. Simply enter the code into the 'Discount Code or Gift Card' field and click 'Apply'. Only one discount code can be used per order.",
      },
    ],
  },
  {
    id: "shipping",
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How can I track my order?",
        a: "Once your order has shipped, you will receive a confirmation email with a tracking number and a link to the carrier's website. You can also find tracking information in your account dashboard under 'My Orders'.",
      },
      {
        q: "What are your shipping costs and timelines?",
        a: "We offer free standard shipping on all orders over $50. Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for an additional fee.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping rates and times vary by destination and will be calculated at checkout. Please note that customers are responsible for any customs and import duties.",
      },
    ],
  },
  {
    id: "returns",
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day, no-hassle return policy for unworn items in their original packaging. To start a return, please visit our Returns Center or contact our support team for assistance.",
      },
      {
        q: "How long does it take to process a refund?",
        a: "Once we receive your returned item, please allow 3-5 business days for inspection and processing. After your refund is approved, it may take an additional 5-7 business days for the funds to appear on your original payment method.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:px-8 text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-orange-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Have questions? We're here to help. Find answers to common queries
            below.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Sticky Navigation Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-2">
              {faqData.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  {category.category}
                </a>
              ))}
            </nav>
          </aside>

          {/* FAQ Accordions */}
          <div className="lg:col-span-3">
            {faqData.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="scroll-mt-24 mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <details
                      key={index}
                      className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                        <h3 className="font-medium">{faq.q}</h3>
                        <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" />
                      </summary>
                      <div
                        className="mt-4 leading-relaxed text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      />
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Still have questions?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            If you can't find the answer you're looking for, our support team is
            ready to assist you.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 shadow-lg"
            >
              <Mail className="h-5 w-5" /> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
