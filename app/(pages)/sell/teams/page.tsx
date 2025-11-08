import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

// Team members ka data, aap ise API se bhi la sakte hain
const teamMembers = [
  {
    id: 1,
    name: "Ananya Sharma",
    role: "Founder & Lead Designer",
    bio: "Ananya's passion for timeless elegance is the heart of Jewelen. She combines traditional craftsmanship with modern aesthetics.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    socials: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 2,
    name: "Rohan Verma",
    role: "Head of Operations",
    bio: "Rohan ensures that every piece of jewelry reaches you perfectly. He oversees everything from sourcing to delivery.",
    imageUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop",
    socials: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: 3,
    name: "Priya Singh",
    role: "Marketing Director",
    bio: "Priya tells the story of our brand. She connects with our community through creative campaigns and collaborations.",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop",
    socials: {
      linkedin: "#",
      twitter: "#",
    },
  },
];

export default function OurTeamPage() {
  return (
    <main className="bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Meet Our Creative Force
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            The passionate individuals behind every exquisite piece of jewelry
            at Jewelen.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-40 h-40 mx-auto">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-orange-600 font-medium mt-1">
                  {member.role}
                </p>
                <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  href={member.socials.twitter}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link
                  href={member.socials.linkedin}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Linkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
