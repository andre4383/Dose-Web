type Props = {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
};

export function StatCard({ icon, label, value, suffix }: Props) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-3 sm:p-4 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-semibold leading-none">
        {value}
        {suffix && (
          <span className="ml-1 text-xs sm:text-sm font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}
