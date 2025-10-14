// A utility function to create URL-friendly slugs from product titles
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, ""); // Removes any special characters
};

// A utility function to parse string prices like "₹45,999" into numbers
const parsePrice = (priceStr: string | null | number): number | null => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return null;
  return Number(priceStr.replace(/₹/g, "").replace(/,/g, ""));
};

// This is the main structure for every product in your store
export interface Product {
  id: string;
  slug: string;
  category: "Rings" | "Necklaces" | "Earrings" | "Bracelets";
  imageUrl: string;
  images: string[]; // For product gallery on the detail page
  title: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  description: string;
}

// --- ALL RAW PRODUCT DATA FROM YOUR PAGES ---
const rawRings = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80",
    title: "Classic Solitaire Diamond Ring",
    price: "₹45,999",
    originalPrice: "₹55,999",
    rating: 5.0,
    reviews: 342,
    badge: "Bestseller",
    badgeColor: "bg-orange-500",
    description:
      "A timeless classic, this solitaire diamond ring features a brilliant-cut diamond set in a polished platinum band. Perfect for engagements or as a statement piece.",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
    title: "Vintage Rose Gold Band",
    price: "₹8,999",
    originalPrice: "₹12,999",
    rating: 4.9,
    reviews: 567,
    badge: "25% Off",
    badgeColor: "bg-red-500",
    description:
      "This vintage-inspired rose gold band features intricate milgrain detailing and a comfortable fit, perfect for stacking or wearing alone.",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
    title: "Stackable Gold Ring Set (3pc)",
    price: "₹6,499",
    originalPrice: null,
    rating: 4.8,
    reviews: 234,
    badge: "New",
    badgeColor: "bg-green-500",
    description:
      "Create your unique look with this set of three stackable gold rings. Mix and match to suit your style, each with a different texture and finish.",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&q=80",
    title: "Sapphire Halo Engagement Ring",
    price: "₹32,999",
    originalPrice: "₹38,999",
    rating: 5.0,
    reviews: 189,
    badge: "Premium",
    badgeColor: "bg-purple-500",
    description:
      "A stunning deep blue sapphire is the star of this ring, surrounded by a sparkling halo of diamonds. A true symbol of royal elegance.",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1615655114997-9d2e94e5b2f5?w=500&q=80",
    title: "Minimalist Silver Band",
    price: "₹2,499",
    originalPrice: null,
    rating: 4.7,
    reviews: 892,
    badge: "Trending",
    badgeColor: "bg-blue-500",
    description:
      "Sleek, modern, and versatile, this minimalist silver band is the perfect everyday accessory. Crafted from high-quality sterling silver.",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1611622765798-e2745b997323?w=500&q=80",
    title: "Eternity Diamond Band",
    price: "₹28,999",
    originalPrice: "₹35,999",
    rating: 4.9,
    reviews: 445,
    badge: "20% Off",
    badgeColor: "bg-red-500",
    description:
      "Symbolize your everlasting love with this beautiful eternity band, featuring a continuous line of brilliant diamonds set in white gold.",
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1590159295098-1b0fa972e6aa?w=500&q=80",
    title: "Pearl Accent Statement Ring",
    price: "₹4,999",
    originalPrice: null,
    rating: 4.6,
    reviews: 321,
    badge: "New",
    badgeColor: "bg-green-500",
    description:
      "A lustrous freshwater pearl sits at the center of this uniquely designed gold statement ring, perfect for special occasions.",
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1618120232146-93d5b68f7a5e?w=500&q=80",
    title: "Emerald Cut Cocktail Ring",
    price: "₹18,999",
    originalPrice: "₹24,999",
    rating: 4.8,
    reviews: 678,
    badge: "Bestseller",
    badgeColor: "bg-orange-500",
    description:
      "Make a bold statement with this stunning emerald-cut cocktail ring, surrounded by a halo of sparkling smaller stones. A true showstopper.",
  },
];

const rawNecklaces = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
    title: "Gold Pearl Pendant Necklace - Handmade Elegance",
    rating: 5,
    reviews: 342,
    price: 2499,
    originalPrice: 4999,
    description:
      "Handmade elegance defines this gold pearl pendant necklace. A single luminous pearl hangs from a delicate gold chain, perfect for any occasion.",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80",
    title: "Silver Chain Choker - Minimalist Design",
    rating: 5,
    reviews: 598,
    price: 1799,
    originalPrice: 3299,
    description:
      "A minimalist silver chain choker that adds a touch of modern sophistication to any outfit. Lightweight and perfect for layering.",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-5dca89b1e329?w=500&q=80",
    title: "Emerald Gemstone Pendant - Premium Collection",
    rating: 5,
    reviews: 203,
    price: 3299,
    originalPrice: 6599,
    description:
      "Featuring a vibrant, genuine emerald, this pendant from our premium collection is a timeless piece of luxury.",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1611094034293-27c9d72b5a5b?w=500&q=80",
    title: "Rose Gold Infinity Necklace - Timeless Beauty",
    rating: 4.5,
    reviews: 456,
    price: 2199,
    originalPrice: 4399,
    description:
      "A symbol of endless love, this rose gold infinity necklace is both meaningful and stylish, making it a perfect gift.",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
    title: "Diamond Solitaire Necklace - Luxury Edition",
    rating: 5,
    reviews: 189,
    price: 5999,
    originalPrice: 11999,
    description:
      "The epitome of elegance, this luxury edition solitaire necklace features a single, brilliant diamond on a fine gold chain.",
  },
  {
    id: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1616964724888-f3f820c3132d?w=500&q=80",
    title: "Personalized Name Necklace - Custom Made",
    rating: 5,
    reviews: 678,
    price: 1999,
    originalPrice: 3999,
    description:
      "Make it personal with our custom-made name necklace. Available in gold, silver, and rose gold finishes.",
  },
  {
    id: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1627888639922-b2f5a5c54d7f?w=500&q=80",
    title: "Layered Gold Necklace - Stacked Style",
    rating: 5,
    reviews: 445,
    price: 3149,
    originalPrice: 6299,
    description:
      "Achieve the perfect layered look effortlessly with this stacked gold necklace set, featuring three distinct chains.",
  },
  {
    id: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-5dca89b1e329?w=500&q=80",
    title: "Ruby Red Statement - Bold & Beautiful",
    rating: 5,
    reviews: 289,
    price: 3799,
    originalPrice: 7599,
    description:
      "Bold and beautiful, this ruby red statement necklace features multiple faceted gems that catch the light from every angle.",
  },
];

const rawEarrings = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478424-c91e5fca99e2?w=500&q=80",
    title: "Gold Pearl Stud Earrings - Classic Elegance",
    rating: 5,
    reviews: 342,
    price: 1499,
    originalPrice: 2999,
    description:
      "Classic and elegant, these gold pearl stud earrings are a must-have for any jewelry collection. Perfect for both formal and casual wear.",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1612179045781-8a5d9a5b3a8a?w=500&q=80",
    title: "Silver Hoop Earrings - Timeless Design",
    rating: 5,
    reviews: 598,
    price: 999,
    originalPrice: 1999,
    description:
      "Timeless and versatile, these sterling silver hoop earrings are lightweight and feature a secure clasp for all-day comfort.",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
    title: "Diamond Solitaire Earrings - Luxury Edition",
    rating: 5,
    reviews: 189,
    price: 4999,
    originalPrice: 9999,
    description:
      "Add a touch of sparkle to your look with these brilliant diamond solitaire stud earrings, set in 14k white gold.",
  },
  {
    id: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1627613586283-75726a792476?w=500&q=80",
    title: "Mother of Pearl Flower Studs - Dainty Floral",
    rating: 5,
    reviews: 289,
    price: 1779,
    originalPrice: 3559,
    description:
      "Delicately carved from mother of pearl, these floral stud earrings offer a touch of natural beauty and feminine charm.",
  },
];

const rawBracelets = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
    title: "Classic Gold Bangle",
    rating: 5,
    reviews: 412,
    price: 3499,
    originalPrice: 6999,
    description:
      "A timeless piece from our collection, this classic gold bangle has a high-polish finish and a sturdy build for everyday elegance.",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1631931413024-38ed4a4c372b?w=500&q=80",
    title: "Sterling Silver Charm Bracelet",
    rating: 5,
    reviews: 678,
    price: 2899,
    originalPrice: 5799,
    description:
      "A customizable sterling silver charm bracelet waiting to tell your story. Add your favorite charms to make it uniquely yours.",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1620921282050-a54056c38090?w=500&q=80",
    title: "Diamond Tennis Bracelet - 2 Carat",
    rating: 5,
    reviews: 256,
    price: 8999,
    originalPrice: 17999,
    description:
      "The ultimate in luxury, this 2-carat diamond tennis bracelet features a stunning line of brilliant-cut diamonds.",
  },
  {
    id: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80",
    title: "Infinity Symbol Bracelet - Silver Plated",
    rating: 5,
    reviews: 654,
    price: 1799,
    originalPrice: 3599,
    description:
      "Representing eternal connection, this silver-plated infinity bracelet is a beautiful and meaningful accessory.",
  },
];

// --- Combine and transform all raw data into the final 'products' array ---
export const products: Product[] = [
  ...rawRings.map((p) => ({
    id: `ring-${p.id}`,
    category: "Rings" as const,
    slug: createSlug(p.title),
    imageUrl: p.img,
    images: [
      p.img,
      "https://images.unsplash.com/photo-1611094034293-27c9d72b5a5b?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    ],
    title: p.title,
    price: parsePrice(p.price)!,
    originalPrice: parsePrice(p.originalPrice),
    rating: p.rating,
    reviews: p.reviews,
    badge: p.badge,
    badgeColor: p.badgeColor,
    description: p.description,
  })),
  ...rawNecklaces.map((p) => ({
    id: `necklace-${p.id}`,
    category: "Necklaces" as const,
    slug: createSlug(p.title),
    imageUrl: p.imageUrl,
    images: [
      p.imageUrl,
      "https://images.unsplash.com/photo-1616964724888-f3f820c3132d?w=800&q=80",
      "https://images.unsplash.com/photo-1617038220319-c6a6fcf80809?w=800&q=80",
    ],
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
  })),
  ...rawEarrings.map((p) => ({
    id: `earring-${p.id}`,
    category: "Earrings" as const,
    slug: createSlug(p.title),
    imageUrl: p.imageUrl,
    images: [
      p.imageUrl,
      "https://images.unsplash.com/photo-1627613586283-75726a792476?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141294-8318a94fb5d1?w=800&q=80",
    ],
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
  })),
  ...rawBracelets.map((p) => ({
    id: `bracelet-${p.id}`,
    category: "Bracelets" as const,
    slug: createSlug(p.title),
    imageUrl: p.imageUrl,
    images: [
      p.imageUrl,
      "https://images.unsplash.com/photo-1616421394171-45c1c1a2e3be?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    ],
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
  })),
];
