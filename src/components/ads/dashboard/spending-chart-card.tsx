"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  SpendingBarChart,
  SpendingDatum,
} from "@/components/ui/chart";

type SpendingChartCardProps = {
  title?: string;
  subtitle?: string;
  data: SpendingDatum[];
};

export function SpendingChartCard({
  title = "Total Spent",
  subtitle = "Spending",
  data,
}: SpendingChartCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4dabf7]" />
            {subtitle}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Last 30 days</div>
      </div>
      <ChartContainer className="h-56">
        <SpendingBarChart data={data} />
      </ChartContainer>
    </Card>
  );
}
