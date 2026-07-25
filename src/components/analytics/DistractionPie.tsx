import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { analyticsApi } from '../../services/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export default function DistractionPie() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalMin, setTotalMin] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsApi.topApps();
        const apps = res.data;
        const distractionApps = apps.filter((app: any) => app.classification === 'DISTRACTION');
        
        const formatted = distractionApps.map((app: any) => ({
          name: app.app_name,
          value: app.minutes,
        }));
        
        setData(formatted);
        setTotalMin(distractionApps.reduce((sum: number, app: any) => sum + app.value, 0));
      } catch (err) {
        console.error('Failed to fetch distraction data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#fbbf24'];

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
        <span className="text-3xl mb-2">🎉</span>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">No distractions today!</p>
        <p className="text-zinc-650 text-[10px] mt-1 font-medium">Keep up the excellent focus.</p>
      </div>
    );
  }

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
        <span className="text-2xl font-bold text-white">{totalMin}</span>
        <span className="text-xs text-gray-500 uppercase">Min total</span>
      </div>
    </div>
  );
}
