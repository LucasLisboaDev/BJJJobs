export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-h-screen bg-grouped ${className}`}>
      {children}
    </div>
  );
}

export function PageCol({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`page-col animate-pop-in ${className}`}>{children}</div>;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-footnote font-semibold text-label-secondary uppercase tracking-wider mb-2">
      {children}
    </div>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display font-bold text-[30px] leading-tight tracking-tight text-label mb-4">
      {children}
    </h1>
  );
}
