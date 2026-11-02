interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

/** The one section heading style (font, size, colour, spacing) used by every section on the site. */
export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`mb-10 max-w-2xl sm:mb-12 ${alignment}`}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold leading-tight text-base-content sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-base-content/70 sm:text-lg">{subtitle}</p>}
    </div>
  );
}
