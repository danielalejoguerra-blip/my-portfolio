import { setRequestLocale } from "next-intl/server";
import {
  Header,
  Hero,
  About,
  Skills,
  Experience,
  Education,
  Certifications,
  Blog,
  Projects,
  Contact,
  Footer,
  PageViewTracker,
} from "@/app/components/shared";
import { getPublicPersonalInfo } from "@/app/lib/personalInfo.server";
import { getPublicProjects } from "@/app/lib/projects.server";
import {
  getPublicBlog,
  getPublicCourses,
  getPublicEducation,
  getPublicExperience,
  getPublicSkills,
} from "@/app/lib/content.server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch data from backend (SSR) in parallel
  const [personalInfo, projects, skills, experience, education, courses, blogPosts] = await Promise.all([
    getPublicPersonalInfo(locale),
    getPublicProjects(20, locale),
    getPublicSkills(40, locale),
    getPublicExperience(20, locale),
    getPublicEducation(20, locale),
    getPublicCourses(20, locale),
    getPublicBlog(20, locale),
  ]);

  return (
    <>
      <PageViewTracker />
      <Header personalInfo={personalInfo} />
      <main className="flex flex-col min-h-screen bg-(--background) text-(--foreground)">
        <Hero personalInfo={personalInfo} />
      <About personalInfo={personalInfo} />
      <Skills skills={skills} />
      <Experience experiences={experience} />
      <Education educationItems={education} />
      <Certifications courses={courses} blogPosts={blogPosts} />
      <Blog posts={blogPosts} />
      <Projects projects={projects} />
      <Contact personalInfo={personalInfo} />
        <Footer personalInfo={personalInfo} />
      </main>
    </>
  );
}
