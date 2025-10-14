// This file will be the single source of truth for all blog posts.

export interface BlogPost {
  slug: string;
  title: string;
  tag: string;
  hero: string; // Main image for the post
  author: string;
  authorImg: string;
  publishedDate: string;
  readTime: string;
  excerpt: string; // Short summary for the blog list page
  intro: string; // Longer intro for the detail page
  body: string[]; // Main content paragraphs
  related: Array<{ slug: string; img: string; title: string; tag: string }>;
}

export const posts: BlogPost[] = [
  {
    slug: "15-birthday-jewelry-ideas",
    title: "15 Birthday Jewelry Ideas for One-of-a-Kind People",
    tag: "Gift Ideas",
    hero: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=600&fit=crop&q=80",
    author: "Elena Gilbert",
    authorImg: "https://i.pravatar.cc/150?u=elena",
    publishedDate: "October 26, 2023",
    readTime: "5 min read",
    excerpt:
      "Make their big day brighter with personalised necklaces, rings, and bracelets.",
    intro:
      "Make their big day brighter with personalised necklaces, rings, and bracelets—handcrafted by independent makers with a story to tell. Find a gift as unique as they are.",
    body: [
      "From minimal name necklaces that whisper their identity to delicate birthstone rings that celebrate their birth month, these picks feel thoughtful without being fussy. The key is personalization; it transforms a beautiful piece of jewelry into a cherished keepsake.",
      "Consider the metals they wear every day. Do they lean towards the warmth of gold, the cool elegance of silver, or the romantic blush of rose gold? Matching the metal shows you've paid attention to their personal style, making the gift feel even more special.",
    ],
    related: [
      {
        slug: "12-back-to-school-jewelry-picks",
        img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop",
        title: "12 Back-to-School Picks for a Memorable First Day",
        tag: "Shopping Guide",
      },
      {
        slug: "how-to-choose-birthstone-jewelry",
        img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=400&fit=crop",
        title: "How to Choose the Perfect Birthstone Jewelry",
        tag: "Guide",
      },
    ],
  },
  {
    slug: "12-back-to-school-jewelry-picks",
    title: "12 Back-to-School Picks for a Memorable First Day",
    tag: "Shopping Guide",
    hero: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=600&fit=crop&q=80",
    author: "Damon Salvatore",
    authorImg: "https://i.pravatar.cc/150?u=damon",
    publishedDate: "September 15, 2023",
    readTime: "4 min read",
    excerpt:
      "From charm bracelets to custom name pendants—great gifts to start the year.",
    intro:
      "Charm bracelets, custom name pendants, and lucky talismans to mark a fresh start and bring a little sparkle to the school hallways.",
    body: [
      "Layer simple, delicate necklaces for a confident everyday look that isn't distracting. A small initial pendant or a tiny gemstone can be a perfect conversation starter.",
      "For students who are always on the go, choose hypoallergenic metals like sterling silver or gold-filled pieces, and ensure clasps are sturdy for long-lasting wear through classes and after-school activities.",
    ],
    related: [
      {
        slug: "15-birthday-jewelry-ideas",
        img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
        title: "15 Birthday Jewelry Ideas for One-of-a-Kind People",
        tag: "Gift Ideas",
      },
      {
        slug: "11-crafts-that-make-shopping-special",
        img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
        title: "11 Crafts That Make Shopping Special",
        tag: "Inspiration",
      },
    ],
  },
  {
    slug: "11-crafts-that-make-shopping-special",
    title: "11 Crafts That Make Shopping on Jewelen Special",
    tag: "Inspiration",
    hero: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=600&fit=crop&q=80",
    author: "Caroline Forbes",
    authorImg: "https://i.pravatar.cc/150?u=caroline",
    publishedDate: "August 02, 2023",
    readTime: "6 min read",
    excerpt:
      "Discover the artistry behind handcrafted pieces and learn how they're made.",
    intro:
      "Discover the artistry behind handcrafted pieces and learn how our independent makers pour their heart and soul into every creation.",
    body: [
      "From the ancient art of metal-smithing to the delicate precision of bead weaving, every technique used by our artisans tells a unique story of tradition and innovation.",
      "When you buy handmade, you are not just acquiring a beautiful object; you are supporting a small studio, promoting ethical production, and investing in timeless design that transcends fleeting trends.",
    ],
    related: [
      {
        slug: "15-birthday-jewelry-ideas",
        img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
        title: "15 Birthday Jewelry Ideas",
        tag: "Gift Ideas",
      },
      {
        slug: "how-to-choose-birthstone-jewelry",
        img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=400&fit=crop",
        title: "How to Choose Birthstone Jewelry",
        tag: "Guide",
      },
    ],
  },
  // Add more posts here...
];
