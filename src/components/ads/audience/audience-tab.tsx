"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { DonutChart, DonutSlice } from "@/components/ui/chart";

type AudienceTabProps = {
  traffic: Array<{ label: string; value: number; percent: number }>;
  composition: DonutSlice[];
  demographics: Array<{
    country: string;
    age: string;
    gender: string;
    cpc: number;
    revenue: number;
    purchases: number;
  }>;
};

export default function AudienceTab({
  traffic,
  composition,
  demographics,
}: AudienceTabProps) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-4">Publisher Performance</h4>
          <div className="h-64">
            <DonutChart
              data={composition}
              centerLabel="100%"
              centerSubLabel="Commition"
            />
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-4">Traffic</h4>
          <div className="space-y-3">
            {traffic.map((t) => (
              <div key={t.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  <span>{t.label}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat(undefined, {
                    notation: "compact",
                  }).format(t.value)}{" "}
                  ({t.percent}%)
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <h4 className="text-lg font-semibold mb-2">Demographics</h4>
        <Card className="p-0">
          <div className="grid grid-cols-12 px-4 py-3 text-sm text-muted-foreground border-b">
            <div className="col-span-3">Country</div>
            <div className="col-span-2">Age</div>
            <div className="col-span-2">Gender</div>
            <div className="col-span-2">CPC</div>
            <div className="col-span-2">Revenue</div>
            <div className="col-span-1 text-right">Purchases</div>
          </div>
          <div className="divide-y">
            {demographics.map((d) => (
              <div
                key={`${d.country}-${d.age}-${d.gender}`}
                className="grid grid-cols-12 px-4 py-3"
              >
                <div className="col-span-3">{d.country}</div>
                <div className="col-span-2">{d.age}</div>
                <div className="col-span-2">{d.gender}</div>
                <div className="col-span-2">${d.cpc.toFixed(2)}</div>
                <div className="col-span-2">${d.revenue.toLocaleString()}</div>
                <div className="col-span-1 text-right">
                  {d.purchases.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
