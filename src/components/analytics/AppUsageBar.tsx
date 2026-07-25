import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AppUsageBar() {
  const data = [
    { name: 'VS Code', value: 180, type: 'PRODUCTIVE' },
    { name: 'Chrome', value: 120, type: 'NEUTRAL' },
    { name: 'Terminal', value: 90, type: 'PRODUCTIVE' },
    { name: 'Discord', value: 45, type: 'DISTRACTION' },
    { name: 'Spotify', value: 30, type: 'NEUTRAL' },
  ];

  const getColor = (type: string) => {
    if (type === 'PRODUCTIVE') return '#22c55e';
    if (type === 'DISTRACTION') return '#ef4444';
    return '#eab308';
  };

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={80} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
