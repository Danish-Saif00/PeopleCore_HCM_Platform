"use client";
import React, { useEffect, useRef } from "react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import Link from "next/link";
import {
  Check,
  DollarSign,
  Calendar,
  GitBranch,
  Clipboard,
  Star,
  Users,
  BarChart3,
  Clock,
  ChevronDown,
  ArrowRight,
  Play,
  TrendingUp,
  Globe,
  MessageCircle,
  Code2,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/* ─── Hero Particle Canvas ─────────────────────────────────────── */
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.4 + 0.6,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const now = Date.now() / 1000;
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += 0.018;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(19,138,91,${alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

/* ─── Main ──────────────────────────────────────────────────────── */
export default function Home() {
  const features = [
    {
      title: "Payroll",
      description:
        "Run error-free payroll processing, generate slips, and deduct taxes automatically in seconds.",
      icon: <DollarSign size={22} className="text-[color:var(--primary)]" />,
    },
    {
      title: "Time Off",
      description:
        "Streamlined approval request workflows from employees to managers with automated balances.",
      icon: <Calendar size={22} className="text-[color:var(--primary)]" />,
    },
    {
      title: "Org Chart",
      description:
        "Visualize company structure with a collapsible D3 tree including full pan, zoom and export.",
      icon: <GitBranch size={22} className="text-[color:var(--primary)]" />,
    },
    {
      title: "Onboarding",
      description:
        "Prepare templates and checklists for your new hires. Keep track of progress seamlessly.",
      icon: <Clipboard size={22} className="text-[color:var(--primary)]" />,
    },
    // {
    //   title: "Performance Reviews",
    //   description:
    //     "Create review cycles, rating sliders, goals, and provide actionable feedback to your team.",
    //   icon: <BarChart3 size={22} className="text-[color:var(--primary)]" />,
    // },
    // {
    //   title: "Real-time Notifications",
    //   description:
    //     "Instant in-app and email notifications for every HR event — approvals, payslips, and reviews.",
    //   icon: <Zap size={22} className="text-[color:var(--primary)]" />,
    // },
    // {
    //   title: "Role-gated Access",
    //   description:
    //     "Five permission levels ensure every team member sees exactly what they need — nothing more.",
    //   icon: <Shield size={22} className="text-[color:var(--primary)]" />,
    // },
    // {
    //   title: "People Analytics",
    //   description:
    //     "Track headcount growth, payroll costs, department distributions, and workforce trends over time.",
    //   icon: <TrendingUp size={22} className="text-[color:var(--primary)]" />,
    // },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$4",
      description: "Perfect for small teams getting started with HR.",
      features: [
        "Up to 25 employees",
        "Basic Directory",
        "D3 Org Chart",
        "Self-service Employee Access",
        "Email support",
      ],
      cta: "Start with Starter",
      softBg: "var(--muted)",
    },
    {
      name: "Growth",
      price: "$8",
      description: "Everything you need to run HR operations end-to-end.",
      features: [
        "Everything in Starter",
        "Unlimited employees",
        "Unlimited Payroll Runs",
        "Time-off Approval Flow",
        "Performance Reviews",
        "Digital Onboarding",
        "Priority support",
      ],
      cta: "Start Free Trial",
      primary: true,
      softBg: "var(--primary-soft)",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Advanced controls and dedicated support for large orgs.",
      features: [
        "Everything in Growth",
        "Custom Role-gated Permissions",
        "Dedicated Customer Manager",
        "API Access",
        "SSO / SAML",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      softBg: "var(--success-soft)",
    },
  ];

  const stats = [
    {
      value: "2,400+",
      label: "Companies Onboarded",
      icon: <Users size={20} />,
    },
    { value: "98.9%", label: "Uptime SLA", icon: <Clock size={20} /> },
    {
      value: "$1.2B+",
      label: "Payroll Processed",
      icon: <DollarSign size={20} />,
    },
    { value: "4.9★", label: "Average Rating", icon: <Star size={20} /> },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Set up your company",
      description:
        "Create your company workspace, invite your HR team, and configure departments and roles in under 5 minutes.",
    },
    {
      step: "02",
      title: "Invite your employees",
      description:
        "Send invite links, assign roles and managers. Employees self-complete their profiles and get instant access.",
    },
    {
      step: "03",
      title: "Run your operations",
      description:
        "Process payroll, approve time-off, assign onboarding checklists, and run performance reviews — all in one place.",
    },
    {
      step: "04",
      title: "Grow with insights",
      description:
        "Monitor team growth, payroll trends, and review completion rates through role-specific dashboards.",
    },
  ];

  const faqs = [
    {
      q: "How quickly can I get started?",
      a: "You can have your first employees added and payroll configured within 30 minutes. Our setup wizard guides you through every step.",
    },
    {
      q: "Is my data safe?",
      a: "This demo uses local seeded data and a mocked backend. Production security and compliance controls would require a separate implementation and audit.",
    },
    {
      q: "Can I migrate from my existing HR system?",
      a: "Absolutely. PeopleCore provides CSV import tools for employee records, payroll history, and time-off balances. Our onboarding team will guide you through migration.",
    },
    {
      q: "Does PeopleCore handle multi-country payroll?",
      a: "Currently PeopleCore supports single-country payroll with configurable tax and deduction rules. Multi-country support is on our roadmap for Q4 2025.",
    },
    {
      q: "What happens to my data if I cancel?",
      a: "You have 30 days after cancellation to export all your data. After that period, data is securely deleted from our servers in accordance with our data retention policy.",
    },
    {
      q: "Do you offer a free trial?",
      a: "Yes — all new accounts receive a 14-day free trial of the Growth plan with no credit card required. No limits during the trial.",
    },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col font-sans marketing-page-bg">
      <MarketingNav />

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-24 px-4 hero-animated-bg"
        style={{ overflow: "clip" }}
      >
        {/* Animated canvas particles — behind everything */}
        <HeroParticles />

        {/* Animated gradient orbs */}
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-orb hero-orb-3" aria-hidden="true" />

        {/* Dot grid overlay */}
        <div className="hero-grid-overlay" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* LEFT — text column */}
            <ScrollReveal className="lg:col-span-7 text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium hero-badge">
                <span className="hero-badge-dot" />
                Trusted by 2,400+ HR teams worldwide
              </div>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-[color:var(--foreground)] leading-[1.1] tracking-tight">
                HR That{" "}
                <span className="hero-gradient-text">Actually Works</span>
              </h1>
              <p className="text-lg sm:text-xl text-[color:var(--muted-foreground)] leading-relaxed max-w-lg">
                PeopleCore is the unified cloud HCM platform for small to
                mid-size companies. Manage employees, payroll, time off,
                reviews, and org charts in one gorgeous interface.
              </p>

              {/* Bullet points */}
              <div className="space-y-2.5">
                {[
                  "Set up in under 30 minutes — no IT required",
                  "End-to-end payroll with automated tax deductions",
                  "5 role-gated permission levels out of the box",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--primary-soft)" }}
                    >
                      <Check
                        size={11}
                        className="text-[color:var(--primary)]"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-sm font-medium text-[color:var(--foreground)]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/signup"
                  className="pc-btn pc-btn-primary pc-btn-lg hero-cta-btn group"
                >
                  Start Free Trial
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/login"
                  className="pc-btn pc-btn-secondary pc-btn-lg group"
                >
                  <Play size={14} className="text-[color:var(--primary)]" />
                  See a Demo
                </Link>
              </div>

              <p className="text-xs text-[color:var(--muted-foreground)]">
                No credit card required &bull; 14-day free trial &bull; Cancel
                anytime
              </p>
            </ScrollReveal>

            {/* RIGHT — dashboard image column */}
            <ScrollReveal delay={120} className="lg:col-span-5 relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-[color:var(--primary)] to-emerald-400 opacity-15 blur-2xl animate-pulse-slow" />
              <div className="relative pc-card overflow-hidden p-2 bg-white/80 backdrop-blur-md shadow-2xl border-[color:var(--border)] hero-dashboard-card">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
                  alt="PeopleCore HCM Dashboard View"
                  className="w-full rounded-lg object-cover shadow-sm aspect-[4/3]"
                />
              </div>
              {/* Floating stat badges — outside overflow-hidden so they aren't clipped */}
              <div className="hero-float-badge hero-float-badge-tl">
                <Users size={12} className="text-[color:var(--primary)]" />
                <span>148 Employees</span>
              </div>
              <div className="hero-float-badge hero-float-badge-br">
                <Check size={12} className="text-[color:var(--success)]" />
                <span>Payroll Complete</span>
              </div>
            </ScrollReveal>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-16">
            <button
              aria-label="Scroll to features"
              className="hero-scroll-indicator"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Social Proof Stats ─────────────────────────────────── */}
      <section
        className="py-12 border-y border-[color:var(--border)]"
        style={{ background: "var(--card)" }}
      >
        <ScrollReveal className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2 group stat-item"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[color:var(--primary)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: "var(--primary-soft)" }}
                >
                  {stat.icon}
                </div>
                <span className="text-2xl font-extrabold text-[color:var(--foreground)] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-[color:var(--muted-foreground)] font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Features Section ───────────────────────────────────── */}
      <section
        id="features"
        className="py-24 px-4"
        style={{ background: "var(--muted)" }}
      >
        <ScrollReveal className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--primary-soft)",
                color: "var(--primary)",
              }}
            >
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--foreground)]">
              Everything You Need in One Place
            </h2>
            <p className="text-[color:var(--muted-foreground)] max-w-lg mx-auto text-base">
              Eliminate disjointed tools. Run your entire company HR operations
              under a single beautifully designed system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 60}>
                <div className="pc-card p-6 space-y-4 feature-card group h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[color:var(--primary-soft)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                    {f.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors duration-200">
                      {f.title}
                    </h3>
                    <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[color:var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Learn more <ArrowRight size={11} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 px-4 border-y border-[color:var(--border)]"
      >
        <ScrollReveal className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--primary-soft)",
                color: "var(--primary)",
              }}
            >
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--foreground)]">
              Up and Running in Minutes
            </h2>
            <p className="text-[color:var(--muted-foreground)] max-w-md mx-auto">
              No lengthy implementations. No consultants required. PeopleCore
              gets you operational fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 80}>
                <div className="relative flex flex-col gap-4 group how-it-works-card">
                  {/* Connector line */}
                  {i < howItWorks.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-7 left-full w-8 h-px z-10"
                      style={{ background: "var(--border)" }}
                    />
                  )}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    {step.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Split Section – Built for Collaboration ─────────────── */}
      <section className="py-24 px-4" style={{ background: "var(--muted)" }}>
        <ScrollReveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--primary-soft)",
                color: "var(--primary)",
              }}
            >
              Collaboration
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[color:var(--foreground)]">
              Built for Modern Collaboration
            </h2>
            <p className="text-base text-[color:var(--muted-foreground)] leading-relaxed">
              PeopleCore is built to keep teams aligned. Managers receive
              instant notifications for pending leave requests, employees get
              email-mocked events for ready payslips, and HR can launch and
              review custom cycle templates without leaving the platform.
            </p>
            <div className="space-y-3 pt-2">
              {[
                "Manager and Employee dashboards sync automatically",
                "Performance reviews with rating sliders and objective settings",
                "Checklist widgets for active task lists and team progress",
                "Real-time notification feed across all roles",
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: "var(--success-soft)" }}
                  >
                    <Check
                      size={13}
                      className="text-[color:var(--success)]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="text-sm font-medium text-[color:var(--foreground)]">
                    {text}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/signup"
              className="pc-btn pc-btn-primary inline-flex gap-2 group"
            >
              Start Collaborating
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-600 opacity-15 blur-2xl" />
            <div className="relative pc-card overflow-hidden p-2 bg-white/80 backdrop-blur-md shadow-2xl border-[color:var(--border)] collab-image-card">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
                alt="Collaboration Mockup"
                className="w-full rounded-lg object-cover shadow-sm aspect-[4/3]"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Pricing Section ─────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-24 px-4 border-t border-[color:var(--border)]"
      >
        <ScrollReveal className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--primary-soft)",
                color: "var(--primary)",
              }}
            >
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--foreground)]">
              Predictable, Transparent Pricing
            </h2>
            <p className="text-[color:var(--muted-foreground)] max-w-md mx-auto">
              No hidden platform fees. Pay only for active seats. Upgrade or
              downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((tier, i) => (
              <ScrollReveal key={tier.name} delay={i * 80}>
                <div
                  className={`pricing-card-new flex flex-col h-full ${tier.primary ? "pricing-card-featured" : ""}`}
                >
                  {tier.primary && (
                    <div className="pricing-popular-badge">Most Popular</div>
                  )}
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-lg font-bold">{tier.name}</h3>
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: tier.primary
                            ? "rgba(255,255,255,0.75)"
                            : "var(--muted-foreground)",
                        }}
                      >
                        {tier.description}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">
                        {tier.price}
                      </span>
                      {tier.price !== "Custom" && (
                        <span
                          className="text-xs"
                          style={{
                            color: tier.primary
                              ? "rgba(255,255,255,0.7)"
                              : "var(--muted-foreground)",
                          }}
                        >
                          /user/mo
                        </span>
                      )}
                    </div>
                    <ul
                      className="space-y-2.5 pt-4 text-sm border-t"
                      style={{
                        borderColor: tier.primary
                          ? "rgba(255,255,255,0.2)"
                          : "var(--border)",
                      }}
                    >
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <Check
                            size={14}
                            className={
                              tier.primary
                                ? "text-white flex-shrink-0"
                                : "text-[color:var(--primary)] flex-shrink-0"
                            }
                            strokeWidth={2.5}
                          />
                          <span
                            style={{
                              color: tier.primary
                                ? "rgba(255,255,255,0.9)"
                                : "var(--muted-foreground)",
                            }}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-8">
                    <Link
                      href={tier.price === "Custom" ? "/login" : "/signup"}
                      className={`pc-btn w-full ${tier.primary ? "pricing-cta-light" : "pc-btn-primary"}`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section
        id="customers"
        className="py-24 border-t border-[color:var(--border)] px-4"
        style={{ background: "var(--card)" }}
      >
        <ScrollReveal className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--primary-soft)",
                color: "var(--primary)",
              }}
            >
              Customers
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--foreground)]">
              Loved by HR Leaders
            </h2>
            <p className="text-[color:var(--muted-foreground)]">
              See how modern teams scale operations with PeopleCore.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "PeopleCore completely transformed our monthly payroll. It takes 2 minutes now instead of a full day.",
                author: "Sarah Jenkins",
                role: "HR Director at TechUp",
                avatarUrl:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
                rating: 5,
              },
              {
                quote:
                  "The D3 org chart is stunning. It helps new hires visualize their reporting lines and team members instantly.",
                author: "Marcus Chen",
                role: "VP of People at Scalebox",
                avatarUrl:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                rating: 5,
              },
              {
                quote:
                  "Onboarding flows are highly customizable. Managers can complete quarterly reviews with full visibility.",
                author: "Elena Rostova",
                role: "Head of Operations at NovaCorp",
                avatarUrl:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
                rating: 5,
              },
            ].map((t, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className="pc-card p-6 flex flex-col justify-between h-full testimonial-card group">
                  <div>
                    <div className="flex gap-1 text-[color:var(--warning)] mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed text-[color:var(--foreground)]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-5 border-t border-[color:var(--border)] mt-5 flex items-center gap-3">
                    <img
                      src={t.avatarUrl}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[color:var(--border)] transition-all duration-300 group-hover:ring-[color:var(--primary)]"
                    />
                    <div>
                      <p className="font-semibold text-sm">{t.author}</p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="py-24 px-4 border-t border-[color:var(--border)]"
      >
        <ScrollReveal className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--primary-soft)",
                color: "var(--primary)",
              }}
            >
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--foreground)]">
              Frequently Asked Questions
            </h2>
            <p className="text-[color:var(--muted-foreground)]">
              Have more questions? Reach out to our team at
              support@peoplecore.com
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <details className="pc-card p-5 faq-item group">
                  <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                    <span className="font-semibold text-sm text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors duration-200">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-[color:var(--muted-foreground)] flex-shrink-0 faq-chevron transition-transform duration-300"
                    />
                  </summary>
                  <p className="mt-3 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-[color:var(--border)] cta-banner-section">
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-base text-white/80 leading-relaxed">
            Join 2,400+ companies that trust PeopleCore to manage their most
            important asset — their people.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="pc-btn pc-btn-lg cta-banner-btn group"
            >
              Start Free Trial
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/login"
              className="pc-btn pc-btn-lg cta-banner-btn-secondary"
            >
              See a Demo
            </Link>
          </div>
          <p className="text-xs text-white/60">
            No credit card required &bull; 14-day free trial &bull; Cancel
            anytime
          </p>
        </ScrollReveal>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-auto py-12 bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)]">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="space-y-4">
              <Logo variant="dark-horizontal-short" size="md" priority />
              <p className="text-xs text-[color:var(--sidebar-muted)] leading-relaxed">
                The unified cloud HCM platform for modern companies. Beautiful,
                powerful, and built for your team.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--sidebar-muted)]">
                Product
              </p>
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#pricing", label: "Pricing" },
                { href: "#customers", label: "Customers" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-xs text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)] hover:translate-x-0.5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--sidebar-muted)]">
                Company
              </p>
              {[
                { href: "#customers", label: "Customers" },
                { href: "/blog", label: "Blog" },
                { href: "/signup", label: "Get Started" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-xs text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)] hover:translate-x-0.5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--sidebar-muted)]">
                Legal
              </p>
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-xs text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)] hover:translate-x-0.5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--sidebar-muted)]">Support</p>
              <Link href="#faq" className="block text-xs text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)]">FAQ</Link>
              <Link href="/login" className="block text-xs text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)]">Help Center</Link>
              <Link href="/signup" className="block text-xs text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)]">Contact Support</Link>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[color:var(--sidebar-muted)]">
            <p>
              &copy; {new Date().getFullYear()} PeopleCore Demo Inc. All rights
              reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/blog" aria-label="PeopleCore community"><Globe size={16} /></Link>
              <Link href="/blog" aria-label="PeopleCore updates"><MessageCircle size={16} /></Link>
              <Link href="/blog" aria-label="PeopleCore developer news"><Code2 size={16} /></Link>
              <Link
                href="/privacy-policy"
                className="hover:text-[color:var(--sidebar-foreground)] hover:underline transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[color:var(--sidebar-foreground)] hover:underline transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
