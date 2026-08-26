import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ServiceCard from "@/components/common/ServiceCard";
import ErrorState from "@/components/common/ErrorState";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { listServices, toggleService } from "@/services/services";
import { formatINR } from "@/services/api";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Freelance AI Lead Manager" },
      { name: "description", content: "Your service catalogue with INR pricing and delivery timelines." },
      { property: "og:title", content: "Services — Freelance AI Lead Manager" },
      {
        property: "og:description",
        content: "Your service catalogue with INR pricing and delivery timelines.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [state, setState] = useState("loading");
  const [rows, setRows] = useState([]);

  const load = () => {
    setState("loading");
    listServices()
      .then((data) => {
        setRows(data);
        setState("done");
      })
      .catch(() => setState("error"));
  };

  useEffect(load, []);

  const onToggle = (id) => {
    toggleService(id).then(setRows);
  };

  const activeCount = rows.filter((s) => s.active).length;

  if (state === "loading") return <CardSkeleton count={6} />;
  if (state === "error") return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description={`${activeCount} of ${rows.length} services offered · from ${formatINR(
          Math.min(...rows.map((s) => s.price)),
        )}`}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((service) => (
          <ServiceCard key={service.id} service={service} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}
