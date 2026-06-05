"use client";
import React from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Logo } from "@/components/ui/Logo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FileText, AlertCircle, Scale, CreditCard, Ban, Globe } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      icon: <FileText size={20} className="text-[color:var(--primary)]" />,
      title: "1. Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: 'By accessing or using PeopleCore ("Service"), you agree to be bound by these Terms and Conditions ("Terms") and our Privacy Policy. If you disagree with any part of these Terms, you do not have permission to access the Service.',
        },
        {
          subtitle: "Account Eligibility",
          text: "You must be at least 18 years old and have the legal authority to enter into these Terms on behalf of yourself or the organization you represent. By using PeopleCore, you represent and warrant that you meet these requirements.",
        },
        {
          subtitle: "Changes to Terms",
          text: "We reserve the right to modify these Terms at any time. We will provide at least 30 days' notice before material changes take effect by emailing the account administrator or posting a prominent notice within the platform. Continued use after the effective date constitutes acceptance of the revised Terms.",
        },
      ],
    },
    {
      id: "use-of-service",
      icon: <Scale size={20} className="text-[color:var(--primary)]" />,
      title: "2. Use of Service",
      content: [
        {
          subtitle: "License Grant",
          text: "Subject to these Terms, PeopleCore grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business operations during the subscription term.",
        },
        {
          subtitle: "Permitted Use",
          text: "You may use PeopleCore solely for lawful purposes and in accordance with these Terms. The Service is intended for HR management operations including employee record management, payroll processing, time-off tracking, performance reviews, and organizational planning.",
        },
        {
          subtitle: "Account Responsibilities",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account. PeopleCore is not liable for any loss resulting from unauthorized use of your account.",
        },
        {
          subtitle: "Data Accuracy",
          text: "You are responsible for ensuring that all data entered into the platform is accurate and complies with applicable employment laws and regulations in your jurisdiction. PeopleCore does not provide legal, accounting, or tax advice.",
        },
      ],
    },
    {
      id: "prohibited",
      icon: <Ban size={20} className="text-[color:var(--primary)]" />,
      title: "3. Prohibited Activities",
      content: [
        {
          subtitle: "Unauthorized Access",
          text: "You may not attempt to gain unauthorized access to any portion of the Service, other user accounts, or computer systems connected to PeopleCore. Probing, scanning, or testing the vulnerability of the system without written permission is strictly prohibited.",
        },
        {
          subtitle: "Data Misuse",
          text: "You may not use PeopleCore to collect, store, or process data in violation of applicable privacy laws. You may not use the Service to discriminate unlawfully, harass employees, or engage in any activity that violates applicable employment law.",
        },
        {
          subtitle: "Reverse Engineering",
          text: "You may not reverse engineer, decompile, disassemble, or attempt to derive the source code of any part of the Service. You may not copy, modify, distribute, or create derivative works based on the Service without express written consent.",
        },
        {
          subtitle: "Competitive Intelligence",
          text: "You may not use the Service to develop a competing product or service, or to benchmark against a competing product or service without PeopleCore's prior written consent.",
        },
      ],
    },
    {
      id: "billing",
      icon: <CreditCard size={20} className="text-[color:var(--primary)]" />,
      title: "4. Billing & Subscriptions",
      content: [
        {
          subtitle: "Subscription Plans",
          text: "PeopleCore offers Starter, Growth, and Enterprise subscription plans billed per active user per month. Pricing is as displayed on the pricing page at the time of subscription. Enterprise pricing is negotiated individually.",
        },
        {
          subtitle: "Free Trial",
          text: "New accounts may receive a 14-day free trial with access to Growth plan features. No credit card is required to start a trial. At the end of the trial, you must select a paid plan to continue using the Service.",
        },
        {
          subtitle: "Billing Cycle",
          text: "Subscriptions are billed monthly or annually in advance. Annual plans receive a discount as displayed on the pricing page. All charges are non-refundable except as expressly set forth in these Terms.",
        },
        {
          subtitle: "Cancellation",
          text: "You may cancel your subscription at any time from account settings. Cancellation takes effect at the end of the current billing period. You will retain access to the Service until the end of the paid period. We do not provide prorated refunds for unused portions of a subscription period.",
        },
      ],
    },
    {
      id: "intellectual-property",
      icon: <AlertCircle size={20} className="text-[color:var(--primary)]" />,
      title: "5. Intellectual Property",
      content: [
        {
          subtitle: "Our Property",
          text: "The Service and its original content, features, and functionality are and will remain the exclusive property of PeopleCore Demo Inc. and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without prior written consent.",
        },
        {
          subtitle: "Your Data",
          text: 'You retain all rights to the data you input into PeopleCore ("Customer Data"). By using the Service, you grant PeopleCore a limited license to process your Customer Data solely to provide the Service as described in our Privacy Policy.',
        },
        {
          subtitle: "Feedback",
          text: "Any feedback, suggestions, or ideas you provide regarding the Service may be used by PeopleCore without restriction or compensation. We are not obligated to implement any feedback.",
        },
      ],
    },
    {
      id: "liability",
      icon: <Globe size={20} className="text-[color:var(--primary)]" />,
      title: "6. Limitation of Liability",
      content: [
        {
          subtitle: "Disclaimer of Warranties",
          text: 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.',
        },
        {
          subtitle: "Limitation of Damages",
          text: "To the maximum extent permitted by applicable law, PeopleCore shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with these Terms or the use of the Service.",
        },
        {
          subtitle: "Liability Cap",
          text: "PeopleCore's total liability to you for all claims arising out of or related to these Terms or the Service shall not exceed the amount paid by you to PeopleCore in the 12 months preceding the claim.",
        },
        {
          subtitle: "Indemnification",
          text: "You agree to indemnify and hold harmless PeopleCore and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.",
        },
      ],
    },
    {
      id: "termination",
      icon: <Ban size={20} className="text-[color:var(--primary)]" />,
      title: "7. Termination",
      content: [
        {
          subtitle: "Termination by You",
          text: "You may terminate your account at any time by canceling your subscription through account settings or contacting our support team. Termination does not entitle you to a refund of prepaid fees.",
        },
        {
          subtitle: "Termination by Us",
          text: "We reserve the right to suspend or terminate your account immediately, without prior notice, if you violate these Terms, engage in fraudulent activity, or if required by law. We may also terminate accounts for extended non-payment.",
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, your license to use the Service immediately ceases. We will provide 30 days to export your Customer Data before deletion, unless termination was due to a breach of these Terms. We are not liable for data loss following account termination.",
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
            <Scale size={14} />
            Legal Documents
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[color:var(--foreground)] tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-base text-[color:var(--muted-foreground)] leading-relaxed max-w-xl mx-auto">
            Please read these Terms carefully before using PeopleCore. They govern your use of our platform and the agreement between you and PeopleCore Demo Inc.
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
            <div className="pc-card p-6 border-l-4" style={{ borderLeftColor: "var(--warning)" }}>
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-[color:var(--warning)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[color:var(--foreground)] leading-relaxed">
                  <strong>Important:</strong> These Terms constitute a legally binding agreement. By creating an account or using PeopleCore, you agree to these Terms. If you are using PeopleCore on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
              </div>
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

          {/* Governing law */}
          <ScrollReveal>
            <div className="pc-card p-6 space-y-3">
              <h3 className="font-bold text-[color:var(--foreground)]">Governing Law</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the American Arbitration Association rules.
              </p>
            </div>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal>
            <div className="pc-card p-8 text-center space-y-4"
              style={{ background: "var(--primary-soft)", border: "1px solid var(--primary)" }}>
              <h3 className="font-bold text-[color:var(--foreground)]">Questions About These Terms?</h3>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                If you have questions about these Terms, please contact our Legal Team.
              </p>
              <a href="mailto:legal@peoplecore.com"
                className="pc-btn pc-btn-primary inline-flex">
                legal@peoplecore.com
              </a>
              <p className="text-xs text-[color:var(--muted-foreground)]">
                Also see our{" "}
                <Link href="/privacy-policy" className="text-[color:var(--primary)] hover:underline">
                  Privacy Policy
                </Link>
              </p>
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
            <Link href="/terms" className="hover:underline text-[color:var(--sidebar-active)]">Terms</Link>
            <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
