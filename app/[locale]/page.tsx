import { setRequestLocale } from "next-intl/server";
import {
  Hero,
  About,
  Skills,
  Experience,
  Education,
  Certifications,
  Projects,
  Contact,
  Footer,
} from "@/app/components/shared";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Certifications />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
