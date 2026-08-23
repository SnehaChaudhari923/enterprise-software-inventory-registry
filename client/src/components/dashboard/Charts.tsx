import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { DistributionItem } from '../../types/index.js';

interface StatusChartProps {
  data: DistributionItem[];
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  Active: '#10b981', // emerald
  'Under Maintenance': '#f59e0b', // amber
  Deprecated: '#ef4444', // red
  Planned: '#0ea5e9', // sky
};

const CRITICALITY_COLORS: Record<string, string> = {
  Critical: '#dc2626',
  High: '#f97316',
  Medium: '#6366f1',
  Low: '#64748b',
};

const DOMAIN_COLORS = [
  '#0284c7',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#10b981',
  '#14b8a6',
  '#64748b',
];

export const StatusDistributionChart: React.FC<StatusChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />;
  }

  const chartData = data.map((d) => ({
    name: d.name,
    value: Number(d.value ?? d.count ?? 0),
  })).filter((d) => d.value > 0);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value: number) => [`${value} Systems`, 'Count']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '0.75rem',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={STATUS_COLORS[entry.name] || '#94a3b8'}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TechnologyDistributionChart: React.FC<{ data: DistributionItem[]; isLoading?: boolean }> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />;
  }

  const chartData = data.map((d) => ({
    name: d.name,
    count: Number(d.count ?? d.value ?? 0),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            interval={0}
            angle={-20}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
          <Tooltip
            formatter={(value: number) => [`${value} Systems`, 'Frequency']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '0.75rem',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DomainDistributionChart: React.FC<{ data: DistributionItem[]; isLoading?: boolean }> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />;
  }

  const chartData = data.map((d) => ({
    name: d.name,
    count: Number(d.count ?? d.value ?? 0),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
            width={90}
          />
          <Tooltip
            formatter={(value: number) => [`${value} Systems`, 'Total Systems']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '0.75rem',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`domain-cell-${index}`} fill={DOMAIN_COLORS[index % DOMAIN_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CriticalityDistributionChart: React.FC<{ data: DistributionItem[]; isLoading?: boolean }> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />;
  }

  const chartData = data.map((d) => ({
    name: d.name,
    value: Number(d.value ?? d.count ?? 0),
  })).filter((d) => d.value > 0);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value: number) => [`${value} Systems`, 'Criticality Count']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '0.75rem',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry) => (
              <Cell
                key={`crit-cell-${entry.name}`}
                fill={CRITICALITY_COLORS[entry.name] || '#64748b'}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
