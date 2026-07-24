type Props = {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
};

export function StatCard({ icon, label, value, suffix }: Props) {
  return (
    <div className="rounded-3xl bg-card border border-border/50 p-4 sm:p-5 flex flex-col gap-3 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p
        className="text-3xl sm:text-4xl font-semibold leading-none tracking-tight"
        style={{ fontFamily: 'var(--font-fraunces), serif' }}
      >
        {value}
        {suffix && (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground tracking-normal">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}
