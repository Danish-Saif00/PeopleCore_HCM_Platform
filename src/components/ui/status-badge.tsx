import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "info" | "muted";

const TONES: Record<Tone, string> = {
  default: "bg-primary-soft text-primary border-primary/20",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning-foreground border-warning/30",
  danger: "bg-danger-soft text-danger border-danger/20",
  info: "bg-info-soft text-info border-info/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ tone = "default", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", TONES[tone], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-primary": tone === "default",
        "bg-success": tone === "success",
        "bg-warning": tone === "warning",
        "bg-danger": tone === "danger",
        "bg-info": tone === "info",
        "bg-muted-foreground": tone === "muted",
      })} />
      {children}
    </span>
  );
}

export function toneForTimeOff(s: "pending" | "approved" | "rejected"): Tone {
  return s === "approved" ? "success" : s === "rejected" ? "danger" : "warning";
}
export function toneForPayroll(s: string): Tone {
  return s === "completed" ? "success" : s === "failed" ? "danger" : s === "processing" ? "info" : "warning";
}
