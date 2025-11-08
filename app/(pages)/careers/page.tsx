import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Users,
  HandHeart,
  ArrowRight,
  MapPin,
  Briefcase,
} from "lucide-react";

// Job openings ka data (ise aap CMS ya API se la sakte hain)
const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "Mumbai, IN",
    type: "Full-time",
  },
  {
    id: 4,
    title: "Customer Happiness Specialist",
    department: "Support",
    location: "Remote",
    type: "Part-time",
  },
];

// Company values ka data
const companyValues = [
  {
    icon: Sparkles,
    title: "Champion Creativity",
    description:
      "We celebrate artistic expression and empower our team to think outside the box.",
  },
  {
    icon: HandHeart,
    title: "Support Artisans",
    description:
      "Our work directly impacts and empowers independent jewelry makers across the globe.",
  },
  {
    icon: Users,
    title: "Grow Together",
    description:
      "We foster a collaborative environment where learning and personal growth are paramount.",
  },
];

export default function CareersPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            alt="A collaborative team working together"
            fill
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 sm:py-32 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Join Our Mission
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Become a part of a passionate team dedicated to celebrating
            craftsmanship and empowering artisans worldwide.
          </p>
          <div className="mt-10">
            <Link
              href="#open-roles"
              className="inline-block rounded-md bg-orange-600 px-8 py-3 text-base font-medium text-white hover:bg-orange-700 transition-transform hover:scale-105"
            >
              View Open Roles
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Life at Jewelen
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              We're more than a marketplace; we're a community.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
            {companyValues.map((value) => (
              <div key={value.title} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                  <value.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section
        id="open-roles"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Open Positions
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Find where you fit in. We're excited to meet you.
          </p>
        </div>
        <div className="mx-auto max-w-4xl space-y-6">
          {jobOpenings.map((job) => (
            <Link
              key={job.id}
              href={`/careers/${job.id}`}
              className="group block bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">
                    {job.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{job.department}</p>
                </div>
                <div className="mt-3 sm:mt-0 flex flex-col sm:items-end gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>{job.type}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA for Future Roles */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Don't See Your Role?
          </h2>
          <p className="mt-3 text-gray-600">
            We're always looking for talented and passionate individuals. If you
            believe you'd be a great fit for our team, we'd love to hear from
            you.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800 shadow-lg"
            >
              Get in Touch <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
