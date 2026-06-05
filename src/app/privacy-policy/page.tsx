"use client";
import React from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Logo } from "@/components/ui/Logo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Shield, Lock, Eye, UserCheck, Globe, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-we-collect",
      icon: <Eye size={20} className="text-[color:var(--primary)]" />,
      title: "1. Information We Collect",
      content: [
        {
          subtitle: "Account & Profile Information",
          text: "When you create an account or invite employees, we collect name, email address, job title, department, phone number, start date, and employment type. This information is required to provide core HR functionality.",
        },
        {
          subtitle: "Payroll & Financial Data",
          text: "We collect base salary, deduction details, and payroll run records. All financial data is encrypted in transit and at rest using AES-256 encryption. We do not store raw bank account or payment card information.",
        },
        {
          subtitle: "Usage & Log Data",
          text: "We automatically collect information about how you access and use PeopleCore, including IP addresses, browser type, device identifiers, pages visited, and actions performed within the platform. This data is used for security monitoring and product improvement.",
        },
        {
          subtitle: "Communications",
          text: "If you contact our support team or participate in surveys, we collect the content of those communications along with your contact details.",
        },
      ],
    },
    {
      id: "how-we-use",
      icon: <Shield size={20} className="text-[color:var(--primary)]" />,
      title: "2. How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use collected data to provide, maintain, and improve PeopleCore's features including employee management, payroll processing, time-off tracking, performance reviews, and org chart visualization.",
        },
        {
          subtitle: "Communications",
          text: "We use your email to send transactional notifications such as payslip availability, time-off approvals, onboarding task assignments, and system alerts. You may opt out of non-essential marketing communications at any time.",
        },
        {
          subtitle: "Security & Compliance",
          text: "We analyze usage patterns to detect and prevent fraud, unauthorized access, and other security incidents. We may process data to comply with applicable legal obligations.",
        },
        {
          subtitle: "Analytics & Improvements",
          text: "Aggregated and anonymized data helps us understand feature adoption and improve the platform. Individual users are never identified in analytics reports shared externally.",
        },
      ],
    },
    {
      id: "data-sharing",
      icon: <Globe size={20} className="text-[color:var(--primary)]" />,
      title: "3. Data Sharing & Disclosure",
      content: [
        {
          subtitle: "We Do Not Sell Your Data",
          text: "PeopleCore does not sell, rent, or trade personal information to third parties for their marketing purposes.",
        },
        {
          subtitle: "Service Providers",
          text: "We share data with trusted third-party service providers (cloud hosting, analytics, email delivery) who process data on our behalf under strict data processing agreements and are prohibited from using your data for their own purposes.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, court order, or government authority, or when we believe disclosure is necessary to protect the rights, property, or safety of PeopleCore, our users, or the public.",
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, user data may be transferred. We will notify affected users before data is transferred or becomes subject to a different privacy policy.",
        },
      ],
    },
    {
      id: "data-security",
      icon: <Lock size={20} className="text-[color:var(--primary)]" />,
      title: "4. Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "All data transmitted between your browser and our servers is encrypted using TLS 1.3. Data at rest is encrypted using AES-256. Session tokens are rotated on authentication and expire after 8 hours of inactivity.",
        },
        {
          subtitle: "Access Controls",
          text: "PeopleCore implements role-based access controls ensuring employees can only access data appropriate to their role. Administrative access to production systems requires multi-factor authentication and is logged for audit purposes.",
        },
        {
          subtitle: "Incident Response",
          text: "We maintain an incident response plan. In the event of a data breach affecting your personal information, we will notify affected users within 72 hours of discovery in accordance with applicable regulations.",
        },
      ],
    },
    {
      id: "your-rights",
      icon: <UserCheck size={20} className="text-[color:var(--primary)]" />,
      title: "5. Your Rights & Choices",
      content: [
        {
          subtitle: "Access & Portability",
          text: "You have the right to request a copy of the personal data we hold about you in a structured, machine-readable format. Submit requests through your account settings or by contacting privacy@peoplecore.com.",
        },
        {
          subtitle: "Correction & Deletion",
          text: "You may update profile information directly within the platform. To request deletion of your account and associated data, contact our privacy team. Note that some data may be retained for legal or legitimate business purposes.",
        },
        {
          subtitle: "Opt-Out",
          text: "You may unsubscribe from marketing communications using the unsubscribe link in any email. Transactional notifications related to your employment (payslips, approvals) cannot be disabled while your account is active.",
        },
        {
          subtitle: "GDPR & CCPA",
          text: "If you are located in the European Economic Area or California, you have additional rights including the right to object to processing, the right to restriction, and the right to lodge a complaint with a supervisory authority.",
        },
      ],
    },
    {
      id: "cookies",
      icon: <Shield size={20} className="text-[color:var(--primary)]" />,
      title: "6. Cookies & Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use session cookies to authenticate users and maintain secure sessions. These cookies are strictly necessary for the platform to function and cannot be disabled.",
        },
        {
          subtitle: "Analytics Cookies",
          text: "With your consent, we use analytics cookies to understand how the platform is used. You may decline analytics cookies without affecting your ability to use PeopleCore.",
        },
        {
          subtitle: "Managing Cookies",
          text: "You can control cookies through your browser settings. Blocking all cookies may prevent some features from working correctly. We do not use advertising or tracking pixels.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col font-sans">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4" style={{ background: "var(--muted)" }}>
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-2"
            style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
            <Shield size={14} />
            Legal &amp; Privacy
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[color:var(--foreground)] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-base text-[color:var(--muted-foreground)] leading-relaxed max-w-xl mx-auto">
            We take your privacy seriously. This policy explains what data we collect, how we use it, and your rights regarding your personal information.
          </p>
          <p className="text-xs text-[color:var(--muted-foreground)]">
            Last updated: June 1, 2025 &bull; Effective: June 1, 2025
          </p>
        </ScrollReveal>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Intro */}
          <ScrollReveal>
            <div className="pc-card p-6 border-l-4" style={{ borderLeftColor: "var(--primary)" }}>
              <p className="text-sm text-[color:var(--foreground)] leading-relaxed">
                This Privacy Policy applies to PeopleCore Demo Inc. (&quot;PeopleCore,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and governs data collection and usage in connection with our cloud HCM platform available at peoplecore.com and related subdomains. By using PeopleCore, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </ScrollReveal>

          {sections.map((section, index) => (
            <ScrollReveal key={section.id} delay={index * 40}>
              <div id={section.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--primary-soft)" }}>
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-[color:var(--foreground)]">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-5">
                  {section.content.map((item, i) => (
                    <div key={i} className="pc-card p-5 space-y-2 hover:shadow-md transition-shadow duration-200">
                      <h3 className="text-sm font-semibold text-[color:var(--foreground)]">
                        {item.subtitle}
                      </h3>
                      <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* Contact */}
          <ScrollReveal>
            <div className="pc-card p-8 text-center space-y-4"
              style={{ background: "var(--primary-soft)", border: "1px solid var(--primary)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "var(--primary)" }}>
                <Mail size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-[color:var(--foreground)]">Privacy Questions?</h3>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                If you have any questions about this Privacy Policy or our data practices, please contact our Privacy Team.
              </p>
              <a href="mailto:privacy@peoplecore.com"
                className="pc-btn pc-btn-primary inline-flex">
                privacy@peoplecore.com
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Logo variant="dark-horizontal-short" size="md" priority />
            <p className="text-[color:var(--sidebar-muted)]">
              &copy; {new Date().getFullYear()} PeopleCore Demo Inc. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy-policy" className="hover:underline text-[color:var(--sidebar-active)]">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
