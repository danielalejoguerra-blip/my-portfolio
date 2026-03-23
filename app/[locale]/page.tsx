import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import {
  Header,
  Hero,
  About,
  Skills,
  PageViewTracker,
} from "@/app/components/shared";

const Experience = dynamic(() => import("@/app/components/shared/Experience"));
const Education = dynamic(() => import("@/app/components/shared/Education"));
const Certifications = dynamic(() => import("@/app/components/shared/Certifications"));
const Blog = dynamic(() => import("@/app/components/shared/Blog"));
const Projects = dynamic(() => import("@/app/components/shared/Projects"));
const Contact = dynamic(() => import("@/app/components/shared/Contact"));
const Footer = dynamic(() => import("@/app/components/shared/Footer"));
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
