import Hero from "@/components/Hero";
import About from "@/app/about/page";
import Contact from "@/app/contact/page";
import DashboardPreview from "@/app/home/page";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <About />
      <DashboardPreview />
      <Contact />
    </main>
  );
}
