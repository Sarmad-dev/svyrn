"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  DualLineChart,
  DonutChart,
  DonutSlice,
  MonthlySeries,
} from "@/components/ui/chart";

type PerformanceTabProps = {
  trend: MonthlySeries[];
  publisherStats: DonutSlice[];
  topPerformers: Array<{ _id: string; title: string; image: string }>;
};

export default function PerformanceTab({
  trend,
  publisherStats,
  topPerformers,
}: PerformanceTabProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">Performance</h3>
        <Card className="p-4">
          <div className="h-64">
            <DualLineChart data={trend} />
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-4">Publisher Performance</h4>
          <div className="h-64">
            <DonutChart
              data={publisherStats}
              centerLabel="$5,268.16"
              centerSubLabel="Total Profit"
            />
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-4">Top Performance</h4>
          <div className="grid grid-cols-3 gap-3">
            {topPerformers.map((p) => (
              <div key={p._id} className="rounded-xl overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-28 object-cover"
                />
                <div className="px-3 py-2 text-sm font-medium text-center">
                  {p.title}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
