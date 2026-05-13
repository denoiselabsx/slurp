import { Hero } from "@/sections/hero";
import { Story } from "@/sections/story";
import { Menu } from "@/sections/menu";
import { Ingredients } from "@/sections/ingredients";
import { Gallery } from "@/sections/gallery";
import { Press } from "@/sections/press";
import { Visit } from "@/sections/visit";
import { Footer } from "@/sections/footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Story />
      <Menu />
      <Ingredients />
      <Gallery />
      <Press />
      <Visit />
      <Footer />
    </main>
  );
}
