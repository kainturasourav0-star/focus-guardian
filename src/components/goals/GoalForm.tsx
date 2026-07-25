import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Goal } from '../../types';

interface Props {
  onSubmit: (goal: Partial<Goal>) => void;
  onCancel: () => void;
}

export default function GoalForm({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('study');
  const [targetHours, setTargetHours] = useState(10);
  
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  const [deadline, setDeadline] = useState(defaultDate.toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      type: type as any,
      target_hours: Number(targetHours),
      deadline: new Date(deadline).toISOString(),
      current_hours: 0,
      completed: false
    });
  };

  const inputClass = "w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Goal Title</label>
        <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g., Learn React" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option value="study">Study</option>
            <option value="coding">Coding</option>
            <option value="reading">Reading</option>
            <option value="focus_hours">Focus Hours</option>
            <option value="weekly_target">Weekly Target</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Target Hours</label>
          <input required type="number" min="1" step="0.5" value={targetHours} onChange={(e) => setTargetHours(e.target.value as any)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
        <input required type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Create Goal</Button>
      </div>
    </form>
  );
}
