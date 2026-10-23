// Google Material Symbols (Rounded). The font is loaded in app/layout.tsx.
// Icons are decorative by default; pass `label` when the icon carries meaning on its own.
export function Icon({
  name,
  fill = false,
  size,
  label,
  className = "",
  style,
}: {
  name: string;
  fill?: boolean;
  size?: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`z-ms${fill ? " z-fill" : ""}${className ? ` ${className}` : ""}`}
      style={size ? { fontSize: size, ...style } : style}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {name}
    </span>
  );
}
