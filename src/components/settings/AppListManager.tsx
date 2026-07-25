import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

interface Props {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  label: string;
  placeholder: string;
  colorTheme?: 'red' | 'green';
}

export default function AppListManager({ items, onAdd, onRemove, label, placeholder, colorTheme = 'red' }: Props) {
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !items.includes(input.trim())) {
      onAdd(input.trim());
      setInput('');
    }
  };

  const badgeColor = colorTheme === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20';

  return (
    <GlassCard className="p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
      
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-gray-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
        <Button type="submit" variant="secondary" className="px-3">
          <Plus className="h-5 w-5" />
        </Button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 max-h-[300px]">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div key={item} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium ${badgeColor}`}>
              {item}
              <button 
                onClick={() => onRemove(item)}
                className="hover:bg-white/20 rounded p-0.5 ml-1 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-500 italic w-full text-center py-4">No items added.</p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
