import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';
import { MarketingNav } from '@/components/layout/MarketingNav';
import { Logo } from '@/components/ui/Logo';

export const metadata: Metadata = {
  title: 'A Practical Guide to Better Employee Onboarding',
  description: 'Five practical steps HR teams can use to build a consistent employee onboarding experience.',
};

const steps = [
  {
    title: 'Start before the first day',
    body: 'Send a clear welcome note, confirm the schedule, and prepare access before the employee arrives. Removing first-day uncertainty lets the new hire focus on people and context instead of logistics.',
  },
  {
    title: 'Give every task an owner and due date',
    body: 'A checklist is useful only when responsibility is explicit. Assign each task to the employee, HR, IT, or the manager, then calculate deadlines from the employee start date.',
  },
  {
    title: 'Make the manager visible early',
    body: 'Managers should explain priorities, success measures, and team norms during the first week. A short daily check-in is often more valuable than a long orientation meeting.',
  },
  {
    title: 'Connect tasks to meaningful outcomes',
    body: 'Instead of asking a new hire to simply read documents, explain why each task matters and what completion unlocks. Context turns onboarding from administration into learning.',
  },
  {
    title: 'Review progress at 30, 60, and 90 days',
    body: 'Use milestone conversations to identify blockers, clarify expectations, and improve the onboarding template for the next hire. The process should become better with every employee.',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />

      <main>
        <header className="border-b border-[color:var(--border)] px-4 pb-16 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[color:var(--primary)]">
              People Operations
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              A practical guide to better employee onboarding
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              Build a repeatable onboarding experience that gives every new hire clarity, connection, and momentum from day one.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-[color:var(--muted-foreground)]">
              <span className="flex items-center gap-2"><CalendarDays size={16} /> June 8, 2026</span>
              <span className="flex items-center gap-2"><Clock3 size={16} /> 6 minute read</span>
              <span>PeopleCore Editorial Team</span>
            </div>
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--primary-soft)] p-6">
            <p className="text-lg font-semibold">The goal of onboarding is not to complete paperwork.</p>
            <p className="mt-2 leading-7 text-[color:var(--muted-foreground)]">
              It is to help a new employee understand how to contribute, who to work with, and where to find support.
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {steps.map((step, index) => (
              <section key={step.title}>
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)] font-bold text-[color:var(--primary-foreground)]">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                    <p className="mt-3 leading-8 text-[color:var(--muted-foreground)]">{step.body}</p>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section className="mt-14 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-7">
            <h2 className="text-2xl font-bold">A simple onboarding checklist</h2>
            <ul className="mt-5 grid gap-3">
              {[
                'Prepare accounts, equipment, and the first-week schedule.',
                'Assign employee, manager, HR, and IT tasks.',
                'Schedule role expectations and team introduction meetings.',
                'Track completion and follow up on overdue tasks.',
                'Collect feedback after the first 30 days.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[color:var(--muted-foreground)]">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[color:var(--success)]" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 rounded-2xl bg-[color:var(--sidebar)] p-8 text-[color:var(--sidebar-foreground)]">
            <p className="text-sm font-semibold uppercase tracking-widest text-[color:var(--sidebar-active)]">Put it into practice</p>
            <h2 className="mt-3 text-2xl font-bold">Create a consistent onboarding flow with PeopleCore.</h2>
            <p className="mt-3 leading-7 text-[color:var(--sidebar-muted)]">
              Build reusable templates, assign tasks, and track progress from one workspace.
            </p>
            <Link href="/signup" className="pc-btn pc-btn-primary mt-6 inline-flex items-center gap-2">
              Start Free Trial <ArrowRight size={16} />
            </Link>
          </section>
        </article>
      </main>

      <footer className="border-t border-[color:var(--border)] bg-[color:var(--card)] px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" aria-label="PeopleCore home" className="relative">
            <Logo variant="light-horizontal-short" size="sm" className="theme-logo-light" />
            <Logo variant="dark-horizontal-short" size="sm" className="theme-logo-dark" />
          </Link>
          <p className="text-xs text-[color:var(--muted-foreground)]">PeopleCore demo blog · Practical guidance for modern HR teams</p>
        </div>
      </footer>
    </div>
  );
}
