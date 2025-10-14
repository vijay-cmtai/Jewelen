import Image from "next/image";
import Link from "next/link";

const interests = [
  {
    title: "Gold Collection",
    sub: "Timeless elegance",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
  },
  {
    title: "Diamond Jewelry",
    sub: "Sparkle & shine",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&q=80",
  },
  {
    title: "Engagement Rings",
    sub: "Forever starts here",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80",
  },
  {
    title: "Silver Essentials",
    sub: "Modern classics",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
  },
];

export default function Interests() {
  return (
    <section
      id="interests"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Explore Our Collections
        </h2>
        <Link
          href="/collections"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {interests.map((item) => (
          <Link
            key={item.title}
            href="/collections/essentials"
            className="group cursor-pointer"
          >
            <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              <Image
                src={item.img || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-200">{item.sub}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
