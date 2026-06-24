"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Send, CheckCircle } from "lucide-react";
import PublicNav from "@/components/public-nav";
import { useLanguage } from "@/components/language-provider";

export default function ContactContent() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();

      if (res.ok) {
        setSent(true);
        setEmail("");
        setMessage("");
      } else {
        setError(data.error || t("contact.error"));
      }
    } catch {
      setError(t("contact.error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-grouped">
      <PublicNav />

      <div className="page-col max-w-lg">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-caption-1 font-semibold text-brand bg-brand-light px-3 py-1 rounded-capsule mb-4">
            <Mail className="w-3.5 h-3.5" />
            {t("contact.badge")}
          </span>
          <h1 className="text-title-1 mb-3">{t("contact.title")}</h1>
          <p className="text-subheadline text-label-secondary leading-relaxed">{t("contact.subtitle")}</p>
        </div>

        <div className="ios-card-lg p-6">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-brand mx-auto mb-4" />
              <h2 className="text-headline font-semibold mb-2">{t("contact.successTitle")}</h2>
              <p className="text-subheadline text-label-secondary mb-6">{t("contact.successSub")}</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="btn-secondary text-sm !py-2 !px-4"
              >
                {t("contact.sendAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="alert-error">{error}</div>}

              <div>
                <label htmlFor="contact-email" className="field-label">
                  {t("contact.emailLabel")}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="ios-field w-full"
                  placeholder={t("contact.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="field-label">
                  {t("contact.messageLabel")}
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  className="ios-field w-full resize-none"
                  placeholder={t("contact.messagePlaceholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {sending ? t("contact.sending") : t("contact.send")}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-separator/30 max-w-3xl mx-auto mt-12">
        <div className="text-caption-1 text-label-tertiary">© {new Date().getFullYear()} JiuJitsuJobs</div>
        <div className="flex gap-4 text-caption-1 text-label-tertiary">
          <Link href="/about" className="hover:text-label-secondary">
            {t("nav.aboutUs")}
          </Link>
          <Link href="/privacy">{t("footer.privacy")}</Link>
          <Link href="/terms">{t("footer.terms")}</Link>
          <Link href="/contact">{t("footer.contact")}</Link>
        </div>
      </footer>
    </div>
  );
}
