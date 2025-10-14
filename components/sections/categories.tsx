import Image from "next/image";
import Link from "next/link";

const cats = [
  [
    "Rings",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
    "/rings",
  ],
  [
    "Necklaces",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    "/necklaces",
  ],
  [
    "Earrings",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    "/earrings",
  ],
  [
    "Bracelets",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
    "/bracelets",
  ],
  [
    "Anklets",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80",
    "/anklets",
  ],
  [
    "Brooches",
    "https://images.unsplash.com/photo-1629216816424-67e28e46ba5b?w=400&q=80",
    "/brooches",
  ],
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Shop by Category
        </h2>
        <p className="text-gray-600">
          Discover our most-loved jewelry collections
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {cats.map(([label, img, href]) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col items-center"
          >
            <div className="relative h-[140px] w-full rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src={img || "/placeholder.svg"}
                alt={label}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
