"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Linkedin, Github, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section, Card, Button } from "@/app/components/ui";
import type { PersonalInfo } from "@/types";

interface ContactProps {
  personalInfo?: PersonalInfo | null;
}

export default function Contact({ personalInfo }: ContactProps) {
  const t = useTranslations("contact");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" });
    alert(t("form.success"));
  };

  const socialLinks = personalInfo?.social_links || {};
  const emailAddress = personalInfo?.email || "danielalejoguerra@gmail.com";
  const locationValue = personalInfo?.location || "Sogamoso, Boyacá - Colombia";
  const linkedinUrl = socialLinks.linkedin || "https://linkedin.com/in/daniel-guerra-197551301";
  const linkedinDisplay = linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com/, "");
  const githubUrl = socialLinks.github || "https://github.com/DanielWar01";
  const githubDisplay = `@${githubUrl.split("/").pop() || "DanielWar01"}`;

  const contactInfo = [
    {
      icon: Mail,
      label: t("info.email"),
      value: emailAddress,
      href: `mailto:${emailAddress}`,
    },
    {
      icon: MapPin,
      label: t("info.location"),
      value: locationValue,
      href: null,
    },
    {
      icon: Linkedin,
      label: t("info.linkedin"),
      value: linkedinDisplay,
      href: linkedinUrl,
    },
    {
      icon: Github,
      label: t("info.github"),
      value: githubDisplay,
      href: githubUrl,
    },
  ];

  return (
    <Section
      id="contact"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">
              {t("connect")}
            </h3>
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
              {t("connectDescription")}
            </p>
          </div>

          <div className="space-y-4">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="p-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors duration-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {item.label}
                      </p>
                      <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--card)] border border-[var(--card-border)]">
                    <div className="p-3 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {item.label}
                      </p>
                      <p className="font-medium text-[var(--foreground)]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card hover={false} className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-[var(--primary)]" />
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                {t("sendMessage")}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  {t("form.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-[var(--radius)] bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
                  placeholder={t("form.namePlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  {t("form.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-[var(--radius)] bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
                  placeholder={t("form.emailPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  {t("form.message")}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-[var(--radius)] bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all resize-none"
                  placeholder={t("form.messagePlaceholder")}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("form.sending")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    {t("form.send")}
                  </span>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
