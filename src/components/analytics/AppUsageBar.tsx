import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsApi } from '../../services/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export default function AppUsageBar() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsApi.topApps();
        const apps = res.data;
        const formatted = apps.map((app: any) => ({
          name: app.app_name,
          value: app.minutes,
          type: app.classification,
        }));
        setData(formatted);
      } catch (err) {
        console.error('Failed to fetch app usage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getColor = (type: string) => {
    if (type === 'PRODUCTIVE') return '#22c55e';
    if (type === 'DISTRACTION') return '#ef4444';
    return '#eab308';
  };

  if (loading) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[200px] w-full flex flex-col items-center justify-center text-center">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">No activity recorded yet</p>
      </div>
    );
  }

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
          <Bar dataKey="value" name="Minutes" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
