import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { MetricCard } from "../components/MetricCard";
import { SectionCard } from "../components/SectionCard";
import { AppShell } from "../layouts/AppShell";

type DashboardData = {
  metrics: {
    active_workers: string;
    daily_bookings: string;
    revenue: string;
    cancellation_rate: string | null;
  };
  workers: Array<{
    id: string;
    full_name: string;
    mobile: string;
    verification_status: string;
    availability_status: string;
    experience_years: number;
  }>;
  complaints: Array<{
    id: string;
    subject: string;
    status: string;
    created_at: string;
  }>;
  wageRanges: Array<{
    id: string;
    name: string;
    min_hourly: string;
    max_hourly: string;
    min_half_day: string;
    max_half_day: string;
    min_full_day: string;
    max_full_day: string;
  }>;
};

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiClient.get("/admin/dashboard").then((response) => setData(response.data));
  }, []);

  if (!data) {
    return <div className="loading">Loading admin workspace...</div>;
  }

  return (
    <AppShell>
      <section className="hero">
        <span className="eyebrow">Marketplace health</span>
        <h1>Keep worker supply, trust, and bookings in balance.</h1>
        <p>Verify workers quickly, keep wage bands healthy, and catch complaints before they escalate.</p>
      </section>

      <section className="metrics-grid" id="overview">
        <MetricCard label="Active workers" value={data.metrics.active_workers} helper="Workers online now" />
        <MetricCard label="Bookings today" value={data.metrics.daily_bookings} helper="Daily marketplace demand" />
        <MetricCard label="Revenue" value={`₹${data.metrics.revenue}`} helper="Paid volume" />
        <MetricCard
          label="Cancellation rate"
          value={`${Number(data.metrics.cancellation_rate || 0).toFixed(2)}%`}
          helper="Lower is healthier"
        />
      </section>

      <div className="dashboard-grid">
        <SectionCard title="Worker verification" subtitle="Approve genuine workers and pause suspicious profiles.">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Availability</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {data.workers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.full_name}</td>
                  <td>{worker.mobile}</td>
                  <td>{worker.verification_status}</td>
                  <td>{worker.availability_status}</td>
                  <td>{worker.experience_years} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="Wage controls" subtitle="Category guardrails keep pricing fair and consistent.">
          <div className="wage-grid" id="wages">
            {data.wageRanges.map((range) => (
              <article key={range.id} className="wage-card">
                <h3>{range.name}</h3>
                <p>Hourly: ₹{range.min_hourly} - ₹{range.max_hourly}</p>
                <p>Half day: ₹{range.min_half_day} - ₹{range.max_half_day}</p>
                <p>Full day: ₹{range.min_full_day} - ₹{range.max_full_day}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent complaints" subtitle="Watch safety and trust signals closely." >
        <div className="complaints" id="complaints">
          {data.complaints.map((complaint) => (
            <article key={complaint.id} className="complaint-card">
              <strong>{complaint.subject}</strong>
              <span>{complaint.status}</span>
              <p>{new Date(complaint.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
