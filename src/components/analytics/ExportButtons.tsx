import React from 'react';
import { Download, FileJson } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExportData {
  label: string;
  value: any;
}

interface Props {
  data?: ExportData[];
}

const MOCK_CSV_DATA = [
  ['Date', 'Focus Score', 'Deep Work (min)', 'Distractions', 'Sessions'],
  ['2026-07-19', '78', '180', '12', '3'],
  ['2026-07-20', '85', '240', '8', '4'],
  ['2026-07-21', '91', '310', '5', '5'],
  ['2026-07-22', '72', '160', '15', '2'],
  ['2026-07-23', '88', '290', '7', '4'],
  ['2026-07-24', '83', '220', '11', '3'],
  ['2026-07-25', '87', '222', '18', '4'],
];

export default function ExportButtons({ data }: Props) {
  const handleCSV = () => {
    const csv = MOCK_CSV_DATA.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-guardian-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleJSON = () => {
    const rows = MOCK_CSV_DATA.slice(1).map((row) => ({
      date: row[0],
      focusScore: parseInt(row[1]),
      deepWorkMinutes: parseInt(row[2]),
      distractions: parseInt(row[3]),
      sessions: parseInt(row[4]),
    }));
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-guardian-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleCSV}
        variant="secondary"
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 border-white/10 bg-white/3 hover:bg-white/8"
      >
        <Download size={12} className="text-emerald-400" /> CSV
      </Button>
      <Button
        onClick={handleJSON}
        variant="secondary"
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 border-white/10 bg-white/3 hover:bg-white/8"
      >
        <FileJson size={12} className="text-blue-400" /> JSON
      </Button>
    </div>
  );
}
