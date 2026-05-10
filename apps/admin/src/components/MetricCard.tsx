type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <h3>{value}</h3>
      {helper ? <span>{helper}</span> : null}
    </article>
  );
}
