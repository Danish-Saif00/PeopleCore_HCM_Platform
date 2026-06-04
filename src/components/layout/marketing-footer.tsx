import { Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <Logo variant="light-horizontal-short" size="sm" />
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              The all-in-one HCM platform built for modern small and mid-size teams.
            </p>
          </div>
          {[
            { title: "Product", links: ["Payroll", "Time Off", "Org Chart", "Onboarding"] },
            { title: "Company", links: ["About", "Customers", "Careers", "Blog"] },
            { title: "Legal", links: ["Terms", "Privacy", "DPA", "Security"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {col.links.map((l) => <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© 2026 PeopleCore Labs, Inc.</p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
