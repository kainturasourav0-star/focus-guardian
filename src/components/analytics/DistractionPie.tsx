import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DistractionPie() {
  const data = [
    { name: 'Twitter', value: 45 },
    { name: 'YouTube', value: 30 },
    { name: 'Reddit', value: 15 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#fbbf24'];

  return (
    <div className="h-[200px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-white">100</span>
        <span className="text-xs text-gray-500 uppercase">Min total</span>
      </div>
    </div>
  );
}
