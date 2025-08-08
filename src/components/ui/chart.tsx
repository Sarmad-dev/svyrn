"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { cn } from "@/lib/utils";

type ChartContainerProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

export function ChartContainer({
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div className={cn("w-full h-64", className)} {...props}>
      {children}
    </div>
  );
}

export type SpendingDatum = {
  day: string;
  amount: number;
};

type SpendingBarChartProps = {
  data: SpendingDatum[];
  barColor?: string;
  grid?: boolean;
};

export function SpendingBarChart({
  data,
  barColor = "#4dabf7",
  grid = true,
}: SpendingBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          width={28}
        />
        <Tooltip
          cursor={{ fill: "rgba(77,171,247,0.15)" }}
          formatter={(v: number) => [`$${(v as number).toFixed(2)}`, "Spent"]}
        />
        <Bar dataKey="amount" fill={barColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------- Dual Line chart (Performance) ----------
export type MonthlySeries = {
  month: string;
  seriesA: number;
  seriesB: number;
};

type DualLineChartProps = {
  data: MonthlySeries[];
  colorA?: string;
  colorB?: string;
};

export function DualLineChart({
  data,
  colorA = "#4dabf7",
  colorB = "#df4fa0",
}: DualLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={28} />
        <Tooltip
          formatter={(v: number) => [`$${(v as number).toFixed(2)}`, "Value"]}
        />
        <Line
          type="monotone"
          dataKey="seriesA"
          stroke={colorA}
          strokeWidth={3}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="seriesB"
          stroke={colorB}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ---------- Donut chart ----------
export type DonutSlice = { name: string; value: number; color?: string };

type DonutChartProps = {
  data: DonutSlice[];
  centerLabel?: string;
  centerSubLabel?: string;
};

export function DonutChart({
  data,
  centerLabel,
  centerSubLabel,
}: DonutChartProps) {
  const COLORS = data.map((d) => d.color ?? "#4dabf7");
  const total = data.reduce((acc, d) => acc + d.value, 0);
  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerSubLabel) && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          {centerLabel && (
            <div className="text-xl font-semibold">{centerLabel}</div>
          )}
          {centerSubLabel && (
            <div className="text-sm text-muted-foreground">
              {centerSubLabel}
            </div>
          )}
        </div>
      )}
      <div className="sr-only">Total {total}</div>
    </div>
  );
}
