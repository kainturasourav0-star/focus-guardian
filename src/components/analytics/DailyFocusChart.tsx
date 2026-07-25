import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DailyFocusChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for weekly API call
    const mockData = [
      { name: 'Mon', focus: 120, distraction: 40 },
      { name: 'Tue', focus: 150, distraction: 30 },
      { name: 'Wed', focus: 180, distraction: 20 },
      { name: 'Thu', focus: 90, distraction: 60 },
      { name: 'Fri', focus: 200, distraction: 25 },
      { name: 'Sat', focus: 60, distraction: 80 },
      { name: 'Sun', focus: 45, distraction: 90 },
    ];
    setData(mockData);
  }, []);

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorDistraction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="focus" name="Focus (min)" fill="url(#colorFocus)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="distraction" name="Distraction (min)" fill="url(#colorDistraction)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
