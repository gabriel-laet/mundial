"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GoalsByTournament {
  year: number;
  hostCountry: string;
  goals: number;
}

export function GoalsChart({ data }: { data: GoalsByTournament[] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelFormatter={(year) => {
              const item = data.find((d) => d.year === year);
              return `${year} - ${item?.hostCountry || ""}`;
            }}
            formatter={(value) => [`${value} goals`, "Total Goals"]}
          />
          <Bar dataKey="goals" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.year}
                fill={
                  index === data.length - 1
                    ? "var(--color-accent)"
                    : "var(--color-primary)"
                }
                fillOpacity={0.4 + (index / data.length) * 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
