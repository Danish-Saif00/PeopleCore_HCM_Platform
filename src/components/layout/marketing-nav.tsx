import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export function MarketingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Logo variant="light-horizontal-short" size="sm" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#customers" className="hover:text-foreground">Customers</a>
          <a href="#blog" className="hover:text-foreground">Blog</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
          <Button asChild size="sm"><Link to="/signup">Start Free Trial</Link></Button>
        </div>
      </div>
    </header>
  );
}
