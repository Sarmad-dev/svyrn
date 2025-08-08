"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  sublabel?: string;
  change?: { value: number; direction: "up" | "down" };
  icon?: React.ReactNode;
  className?: string;
};

export function MetricCard({
  label,
  value,
  sublabel,
  change,
  icon,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{value}</span>
            {typeof change !== "undefined" && (
              <span
                className={cn(
                  "text-xs font-medium",
                  change?.direction === "up"
                    ? "text-emerald-600"
                    : "text-rose-600"
                )}
              >
                {change?.direction === "up" ? "▲" : "▼"}{" "}
                {Math.abs(change?.value).toFixed(1)}%
              </span>
            )}
          </div>
          {sublabel && (
            <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </Card>
  );
}
