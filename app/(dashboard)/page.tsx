import {
  Hero,
  About,
  Skills,
  Experience,
  Projects,
  Contact,
  Footer,
} from "@/app/components/shared";

export default function PortfolioPage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}

