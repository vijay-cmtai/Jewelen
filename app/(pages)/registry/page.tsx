import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

// Mock data for the product, just like it would come from an API
const product = {
  name: "The Aurelia Solitaire Ring",
  category: "Engagement Rings",
  price: 749.99,
  rating: 4.5,
  reviewCount: 128,
  images: [
    "https://images.unsplash.com/photo-1611389944111-46b359f48ddc?q=80&w=2127&auto=format&fit=crop", // Main image
    "https://images.unsplash.com/photo-1598556138402-a07a11985a69?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605346452589-9a2e635e982c?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599330293282-140a3b2b005f?q=80&w=2127&auto=format&fit=crop",
  ],
  shortDescription:
    "A timeless masterpiece, the Aurelia Solitaire Ring features a brilliant-cut center stone set in a classic 18k white gold band. The epitome of elegance and grace.",
  sizes: ["5", "6", "7", "8", "9"],
  details: {
    description: `
      <p>Celebrate your love story with the breathtaking Aurelia Solitaire Ring. Designed to capture hearts, this exquisite piece showcases a dazzling, ethically-sourced diamond that sparkles from every angle. The slender, polished band is crafted from lustrous 18k white gold, providing a comfortable and secure fit.</p>
      <p>Perfect for proposals or as a significant anniversary gift, the Aurelia ring is a symbol of enduring love and commitment. Its minimalist yet striking design ensures it will be cherished for generations to come.</p>
    `,
    specifications: [
      "Metal: 18k White Gold",
      "Center Stone: 1.0 Carat Lab-Grown Diamond",
      "Clarity: VS1",
      "Color: G",
      "Band Width: 2mm",
      "Certification: GIA Certified",
    ],
  },
};

const relatedProducts = [
  // ... we can add related product data here
  {
    id: 1,
    name: "Eternity Band",
    price: 499.0,
    image:
      "https://images.unsplash.com/photo-1620950346239-8c91d3f57782?q=80&w=1964&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Sapphire Earrings",
    price: 620.0,
    image:
      "https://images.unsplash.com/photo-1610494133989-b3b3a650f688?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Pearl Necklace",
    price: 350.0,
    image:
      "https://images.unsplash.com/photo-1595438788078-18e384240a6a?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Gold Bracelet",
    price: 550.0,
    image:
      "https://images.unsplash.com/photo-1611652022417-a546735a3979?q=80&w=1974&auto=format&fit=crop",
  },
];

export default function ProductDetailPage() {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <Link
                  href="/rings"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  Rings
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="ml-2 font-medium text-gray-800">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product main section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            <img
              src={product.images[0]}
              alt="Main product image"
              className="w-full h-auto object-cover rounded-lg shadow-sm"
            />
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`rounded-lg overflow-hidden border-2 ${
                    index === 0 ? "border-orange-500" : "border-transparent"
                  } hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-4 md:mt-0">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl tracking-tight text-gray-900">
                ${product.price}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-3 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      product.rating > rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <a
                href="#reviews"
                className="ml-3 text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                {product.reviewCount} reviews
              </a>
            </div>

            <p className="mt-6 text-gray-600 space-y-6">
              {product.shortDescription}
            </p>

            <form className="mt-8">
              {/* Size selection */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a
                    href="#"
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                  >
                    Size guide
                  </a>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-4">
                  {product.sizes.map((size) => (
                    <label
                      key={size}
                      className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="size-choice"
                        value={size}
                        className="sr-only"
                      />
                      <span>{size}</span>
                      <span
                        className="pointer-events-none absolute -inset-px rounded-md"
                        aria-hidden="true"
                      ></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-600 py-3 px-8 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to bag
                </button>
                <button
                  type="button"
                  className="flex w-full sm:w-auto items-center justify-center rounded-md border border-gray-300 py-3 px-8 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Heart className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Product details section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Description</h3>
            <div
              className="mt-4 prose prose-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.details.description }}
            />
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900">Specifications</h3>
            <ul className="mt-4 list-disc list-inside space-y-2 text-gray-600">
              {product.details.specifications.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Customers also liked
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href="#">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                        ></span>
                        {item.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
