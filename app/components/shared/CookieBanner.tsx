"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Cookie, Shield, X } from "lucide-react";

const COOKIE_KEY = "dg-cookie-consent";

type ConsentValue = "accepted" | "rejected";

export default function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState<boolean>(false);

  const checkConsent = useCallback(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage not available (SSR guard)
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(checkConsent, 300);
    return () => clearTimeout(id);
  }, [checkConsent]);

  const handleConsent = (value: ConsentValue) => {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          role="dialog"
          aria-live="polite"
          aria-label={t("title")}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-(--border) bg-(--card) shadow-2xl shadow-black/20 backdrop-blur-sm overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-linear-to-r from-(--gradient-start) via-(--primary) to-(--accent)" />

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="shrink-0 p-2.5 rounded-xl bg-(--secondary) text-(--primary)">
                  <Cookie className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-sm font-semibold text-(--foreground)">
                      {t("title")}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-(--secondary) text-(--muted-foreground) text-xs">
                      <Shield className="w-3 h-3" />
                      GDPR
                    </span>
                  </div>
                  <p className="text-xs text-(--muted-foreground) leading-relaxed">
                    {t("description")}
                  </p>
                </div>

                {/* Dismiss (reject shortcut) */}
                <button
                  onClick={() => handleConsent("rejected")}
                  className="shrink-0 p-1.5 rounded-lg text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--secondary) transition-colors"
                  aria-label={t("reject")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => handleConsent("rejected")}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-(--border) bg-transparent text-(--muted-foreground) hover:bg-(--secondary) hover:text-(--foreground) transition-all duration-200"
                >
                  {t("reject")}
                </button>
                <button
                  onClick={() => handleConsent("accepted")}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-linear-to-r from-(--gradient-start) to-(--accent) text-white hover:opacity-90 transition-all duration-200 shadow-sm"
                >
                  {t("accept")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
