import Image from "next/image";
import { Gift, Heart, Sparkles } from "lucide-react";

const giftCategories = [
  {
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    title: "Gifts for Her",
    desc: "Elegant necklaces & delicate earrings",
    price: "Starting at ₹999",
    color: "from-pink-500 to-rose-500",
  },
  {
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    title: "Gifts for Him",
    desc: "Bold bracelets & statement rings",
    price: "Starting at ₹1,499",
    color: "from-blue-500 to-cyan-500",
  },
  {
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    title: "Anniversary Gifts",
    desc: "Diamond rings & matching sets",
    price: "Starting at ₹9,999",
    color: "from-purple-500 to-pink-500",
  },
  {
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    title: "Birthday Specials",
    desc: "Personalized pendants & charms",
    price: "Starting at ₹799",
    color: "from-yellow-500 to-orange-500",
  },
  {
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    title: "Wedding Gifts",
    desc: "Bridal sets & traditional jewelry",
    price: "Starting at ₹14,999",
    color: "from-red-500 to-pink-500",
  },
  {
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
    title: "Luxury Collection",
    desc: "Premium gemstones & rare designs",
    price: "Starting at ₹24,999",
    color: "from-indigo-500 to-purple-500",
  },
];

const occasions = [
  { icon: "🎂", label: "Birthday" },
  { icon: "💍", label: "Wedding" },
  { icon: "💝", label: "Anniversary" },
  { icon: "🎓", label: "Graduation" },
  { icon: "🎉", label: "Celebration" },
  { icon: "❤️", label: "Just Because" },
];

export default function GiftsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
          <Gift className="h-4 w-4" />
          <span>Perfect Gift Guide</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Thoughtful Jewelry Gifts
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Curated collections for every occasion—from elegant necklaces to
          stunning rings, find the perfect piece to make someone smile.
        </p>
      </div>

      {/* Occasions Quick Select */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Shop by Occasion
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {occasions.map((occasion) => (
            <button
              key={occasion.label}
              className="flex flex-col items-center gap-2 px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-500 transition-all hover:shadow-lg min-w-[120px]"
            >
              <span className="text-3xl">{occasion.icon}</span>
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {occasion.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Gift Categories Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Gift Collections
          </h2>
          <button className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View all
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftCategories.map((category, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                {/* Image with Overlay */}
                <div className="relative h-[320px]">
                  <Image
                    src={category.img}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <Sparkles className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-200 mb-3 line-clamp-1">
                      {category.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {category.price}
                      </span>
                      <button className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gift Guide Banner */}
      <div className="mt-16 relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 p-8 lg:p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Not sure what to gift?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Take our quick quiz to discover the perfect jewelry piece based on
            their style, personality, and your budget.
          </p>
          <button className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Start Gift Quiz
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 backdrop-blur-sm hidden lg:block" />
      </div>
    </main>
  );
}
