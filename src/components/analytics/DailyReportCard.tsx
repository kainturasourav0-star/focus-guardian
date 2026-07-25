import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { insightsApi } from '../../services/api';

export default function DailyReportCard() {
  const { isDemoMode } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 1800));
        setReport(`## 📊 Today's AI Focus Report\n\n**Focus Score:** 87% (+14% vs yesterday)\n\n**Deep Work:** 3h 42m across 4 sessions\n\n**Best Focus Period:** 9:00 AM – 11:30 AM (uninterrupted 2.5 hours)\n\n**Distractions:** 18 events — mostly Instagram (34%), YouTube (28%), Discord (18%)\n\n**Most Productive App:** VS Code (3h 10m, 78% of productive time)\n\n**Suggestions:**\n- Schedule your most complex work before noon when your focus peaks\n- Consider blocking Instagram during morning sessions\n- Your focus drops significantly after 2PM — a short 10-minute walk may help`);
      } else {
        const res = await insightsApi.get();
        setReport((res.data as string[]).join('\n\n'));
      }
    } catch {
      setReport('Failed to generate report. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-bold text-white">Daily AI Report</span>
        </div>
        <div className="flex gap-2">
          {report && (
            <Button onClick={handleExportPDF} variant="secondary" className="text-xs px-3 py-1.5 border-white/10 bg-white/3 flex items-center gap-1.5">
              <Download size={12} /> PDF
            </Button>
          )}
          <Button
            onClick={generateReport}
            disabled={loading}
            variant="primary"
            className="text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
            {loading ? 'Generating...' : report ? 'Regenerate' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950/80 rounded-xl border border-white/5 p-4 text-sm text-zinc-300 leading-relaxed space-y-2 whitespace-pre-line"
        >
          {report}
        </motion.div>
      )}

      {!report && !loading && (
        <div className="flex items-center justify-center py-8 text-zinc-600 text-sm border border-dashed border-white/5 rounded-xl">
          Click "Generate Report" for your personalized AI analysis
        </div>
      )}
    </div>
  );
}
