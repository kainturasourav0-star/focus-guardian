import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Deep work is the ability to focus without distraction.", author: "Cal Newport" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "The successful warrior is the average person, with laser-like focus.", author: "Bruce Lee" },
  { text: "Starve your distractions, feed your focus.", author: "Unknown" },
  { text: "What you focus on grows.", author: "Esther Hicks" },
  { text: "Always remember, your focus determines your reality.", author: "George Lucas" },
  { text: "Success demands singleness of purpose.", author: "Vince Lombardi" },
  { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
];

export default function MotivationalQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-24 w-full max-w-md mx-auto text-center flex flex-col justify-center relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <p className="text-lg italic text-gray-300 font-serif mb-2">"{quotes[index].text}"</p>
          <p className="text-sm font-medium text-purple-400">— {quotes[index].author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
