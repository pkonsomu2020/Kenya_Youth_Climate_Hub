import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ title, subtitle, eyebrow, className, ...props }, ref) => (
    <div ref={ref} className={cn("max-w-3xl", className)} {...props}>
      {eyebrow ? (
        <p className="section-eyebrow">{eyebrow}</p>
      ) : null}
      <h2 className="section-heading">{title}</h2>
      {subtitle ? <p className="section-copy">{subtitle}</p> : null}
    </div>
  ),
);
SectionHeading.displayName = "SectionHeading";

export { SectionHeading };
