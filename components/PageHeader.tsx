interface Props {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}
export function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <header className="page-header">
      <div className="page-header-in">
        <div className="s-label">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
    </header>
  );
}
