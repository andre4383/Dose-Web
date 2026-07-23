import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
};

export function StatCard({ icon, label, value, suffix }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          {value}
          {suffix && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {suffix}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
