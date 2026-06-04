'use client';
import React from 'react';
import { MarketingNav } from '@/components/layout/MarketingNav';
import Link from 'next/link';
import { Check, DollarSign, Calendar, GitBranch, Clipboard, Star } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function Home() {
  const features = [
    {
      title: 'Automated Payroll',
      description: 'Run error-free payroll processing, generate slips, and deduct taxes automatically in seconds.',
      icon: <DollarSign size={24} className="text-[color:var(--primary)]" />,
    },
    {
      title: 'Time Off & Leave',
      description: 'Streamlined approval request workflows from employees to managers with automated balances.',
      icon: <Calendar size={24} className="text-[color:var(--primary)]" />,
    },
    {
      title: 'Interactive Org Chart',
      description: 'Visualize company structure with a collapsible D3 tree including full pan, zoom and export.',
      icon: <GitBranch size={24} className="text-[color:var(--primary)]" />,
    },
    {
      title: 'Digital Onboarding',
      description: 'Prepare templates and checklists for your new hires. Keep track of progress seamlessly.',
      icon: <Clipboard size={24} className="text-[color:var(--primary)]" />,
    },
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$4',
      features: ['Basic Directory', 'D3 Org Chart', 'Self-service Employee Access'],
      cta: 'Start with Starter',
      softBg: 'var(--muted)',
    },
    {
      name: 'Growth',
      price: '$8',
      features: ['Everything in Starter', 'Unlimited Payroll Runs', 'Time-off Approval Flow', 'Performance Reviews Checklist'],
      cta: 'Start Free Trial',
      primary: true,
      softBg: 'var(--primary-soft)',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Everything in Growth', 'Custom Role-gated Permissions', 'Dedicated Customer Manager', 'API Access'],
      cta: 'Contact Sales',
      softBg: 'var(--success-soft)',
    },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col font-sans marketing-page-bg">
      <MarketingNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[color:var(--foreground)] leading-tight tracking-tight">
              HR Operations That <span style={{ color: 'var(--primary)' }}>Actually Work</span>
            </h1>
            <p className="text-lg sm:text-xl text-[color:var(--muted-foreground)] leading-relaxed">
              PeopleCore is the unified cloud HCM platform for small to mid-size companies. Manage employees, payroll, time off, reviews, and org charts in one gorgeous interface.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/signup" className="pc-btn pc-btn-primary pc-btn-lg">
                Start Free Trial
              </Link>
              <Link href="/login" className="pc-btn pc-btn-secondary pc-btn-lg">
                View Live Demo
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[color:var(--primary)] to-emerald-400 opacity-20 blur-xl"></div>
            <div className="relative pc-card overflow-hidden p-2 bg-white/70 backdrop-blur-md shadow-2xl border-[color:var(--border)]">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
                alt="PeopleCore HCM Dashboard View"
                className="w-full rounded-lg object-cover shadow-sm aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-t border-b border-[color:var(--border)] px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Everything You Need in One Place</h2>
            <p className="text-[color:var(--muted-foreground)] max-w-md mx-auto">
              Eliminate disjointed tools. Run your company operations under a single design system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="pc-card p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[color:var(--primary-soft)]">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-base">{f.title}</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Section with Workflow Image */}
      <section className="py-20 px-4 bg-[color:var(--muted)]/50 border-b border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Built for Modern Collaboration</h2>
            <p className="text-base text-[color:var(--muted-foreground)] leading-relaxed">
              PeopleCore is built to keep teams aligned. Managers receive instant notifications for pending leave requests, employees get email-mocked events for ready payslips, and HR can launch and review custom cycle templates without leaving the platform.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Manager and Employee dashboards sync automatically',
                'Performance reviews rating sliders and objective settings',
                'Checklist widgets for active task lists and team progress',
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={16} className="text-[color:var(--success)] flex-shrink-0" />
                  <span className="text-sm font-medium text-[color:var(--foreground)]">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-600 opacity-20 blur-xl"></div>
            <div className="relative pc-card overflow-hidden p-2 bg-white/70 backdrop-blur-md shadow-2xl border-[color:var(--border)]">
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
                alt="Collaboration Mockup"
                className="w-full rounded-lg object-cover shadow-sm aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Predictive, Transparent Pricing</h2>
            <p className="text-[color:var(--muted-foreground)] max-w-md mx-auto">
              No hidden platform fees. Pay only for active seats.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className="pc-card p-8 flex flex-col justify-between"
                style={{
                  borderColor: tier.primary ? 'var(--primary)' : undefined,
                  boxShadow: tier.primary ? 'var(--shadow-lg)' : undefined,
                }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                    {tier.primary && (
                      <span className="pc-badge pc-badge-primary">Popular</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{tier.price}</span>
                    {tier.price !== 'Custom' && (
                      <span className="text-xs text-[color:var(--muted-foreground)]">/user/mo</span>
                    )}
                  </div>
                  <ul className="space-y-2.5 pt-4 text-sm text-[color:var(--muted-foreground)] border-t border-[color:var(--border)]">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check size={14} className="text-[color:var(--primary)] flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-8">
                  <Link
                    href={tier.price === 'Custom' ? '/login' : '/signup'}
                    className={`pc-btn w-full ${tier.primary ? 'pc-btn-primary' : 'pc-btn-secondary'}`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="customers" className="py-20 bg-white border-t border-[color:var(--border)] px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Loved by HR Leaders</h2>
            <p className="text-[color:var(--muted-foreground)]">
              See how modern teams scale operations with PeopleCore.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'PeopleCore completely transformed our monthly payroll. It takes 2 minutes now instead of a full day.',
                author: 'Sarah Jenkins',
                role: 'HR Director at TechUp',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
              },
              {
                quote: 'The D3 org chart is stunning. It helps new hires visual their reporting lines and team members instantly.',
                author: 'Marcus Chen',
                role: 'VP of People at Scalebox',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
              },
              {
                quote: 'Onboarding flows are highly customizable. Managers can complete quarterly reviews with full visibility.',
                author: 'Elena Rostova',
                role: 'Head of Operations at NovaCorp',
                avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
              },
            ].map((t, idx) => (
              <div key={idx} className="pc-card p-6 flex flex-col justify-between">
                <div className="flex gap-1 text-[color:var(--warning)] mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-[color:var(--foreground)] flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-[color:var(--border)] mt-4 flex items-center gap-3">
                  <img
                    src={t.avatarUrl}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{t.author}</p>
                    <p className="text-xs text-[color:var(--muted-foreground)]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Logo variant="dark-horizontal-long" size="sm" />
            <p>&copy; {new Date().getFullYear()} PeopleCore Demo Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#features" className="hover:underline">Features</Link>
            <Link href="#pricing" className="hover:underline">Pricing</Link>
            <Link href="/login" className="hover:underline">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
