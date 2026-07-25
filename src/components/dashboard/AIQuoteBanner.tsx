import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus is not about saying yes, it's about saying no to distractions.", author: "Steve Jobs" },
  { text: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  { text: "You have to be burning with an idea, or a problem, or a wrong that you want to right.", author: "Steve Jobs" },
  { text: "The successful warrior is the average person, with laser-like focus.", author: "Bruce Lee" },
  { text: "Concentration is the secret of strength in politics, war, business, and in all management of human affairs.", author: "Ralph Waldo Emerson" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "Work is hard. Distractions are plentiful. And time is short.", author: "Adam Hochschild" },
];

export default function AIQuoteBanner() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % QUOTES.length);
    }, 12000);
    return () => clearInterval(id);
  }, []);

  const quote = QUOTES[idx];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/10 px-6 py-4"
      style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(34,211,238,0.04) 100%)' }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
      <div className="flex gap-3 items-start relative z-10">
        <Quote className="h-4 w-4 text-purple-400/60 shrink-0 mt-0.5" />
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-zinc-300 text-sm font-medium leading-relaxed italic">"{quote.text}"</p>
            <p className="text-zinc-500 text-[11px] font-bold mt-1">— {quote.author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Dots */}
      <div className="flex gap-1 mt-3 justify-end">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === idx ? 'w-4 bg-purple-400' : 'w-1 bg-zinc-700'}`}
          />
        ))}
      </div>
    </div>
  );
}
