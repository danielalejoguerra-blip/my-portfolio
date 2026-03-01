import { setRequestLocale } from "next-intl/server";
import {
  Header,
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
import { getPublicPersonalInfo } from "@/app/lib/personalInfo.server";
import { getPublicProjects } from "@/app/lib/projects.server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch data from backend (SSR) in parallel
  const [personalInfo, projects] = await Promise.all([
    getPublicPersonalInfo(),
    getPublicProjects(),
  ]);

  return (
    <>
      <Header personalInfo={personalInfo} />
      <main className="flex flex-col min-h-screen bg-(--background) text-(--foreground)">
        <Hero personalInfo={personalInfo} />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Certifications />
      <Projects projects={projects} />
      <Contact personalInfo={personalInfo} />
        <Footer personalInfo={personalInfo} />
      </main>
    </>
  );
}
