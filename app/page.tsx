import Hero from "@/components/sections/hero"
import Discover from "@/components/sections/discover"
import Categories from "@/components/sections/categories"
import DealsCarousel from "@/components/sections/deals-carousel"
import Interests from "@/components/sections/interests"
import EditorsPicks from "@/components/sections/editors-picks"
import BlogSection from "@/components/sections/blog"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Discover />
      <Categories />
      <DealsCarousel />
      <EditorsPicks />
      <Interests />
      <BlogSection />
    </main>
  )
}
