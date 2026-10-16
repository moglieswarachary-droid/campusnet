import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CheckSquare, Plus, Clock, CheckCircle2, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  project: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export const ResearcherMilestonesView: React.FC = () => {
  const { addToast } = useApp();
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't-1',
      title: 'Run neuromorphic event simulator benchmarks on RISC-V FPGA testbed',
      project: 'SERB-CRG-2025-081',
      assignee: 'Kavya Ramanathan (PhD Fellow)',
      dueDate: 'Oct 24, 2026',
      priority: 'High',
      completed: false
    },
    {
      id: 't-2',
      title: 'Submit Reviewer 2 response letter for IEEE Transactions manuscript',
      project: 'ACM/IEEE Journal',
      assignee: 'Kavya Ramanathan & Dr. Arvind Rao',
      dueDate: 'Oct 28, 2026',
      priority: 'High',
      completed: false
    },
    {
      id: 't-3',
      title: 'Upload aerial drone multi-spectral dataset annotations to Zenodo repository',
      project: 'NAEV-26 Benchmark',
      assignee: 'Aarav Sharma (RA)',
      dueDate: 'Nov 02, 2026',
      priority: 'Medium',
      completed: false
    },
    {
      id: 't-4',
      title: 'Quarterly financial utilization report preparation for SERB CRG grant',
      project: 'SERB-CRG-2025-081',
      assignee: 'IISc CDS Finance Cell',
      dueDate: 'Nov 05, 2026',
      priority: 'Medium',
      completed: true
    }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    addToast({ type: 'info', message: 'Task status updated.' });
  };

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <CheckSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
                Tasks & Milestone Deliverables
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-[#E9A23B] border border-amber-200">
                {tasks.filter(t => !t.completed).length} Remaining
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Track doctoral thesis timelines, journal revisions, grant milestone deliverables, and lab experiment deadlines
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              task.completed
                ? 'bg-[#F4F6FA]/60 border-slate-200/60 opacity-70'
                : 'bg-white border-slate-200/90 shadow-2xs hover:border-purple-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {task.completed && <CheckCircle2 className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9.5px] font-black uppercase px-2 py-0.2 rounded ${
                    task.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{task.project}</span>
                </div>

                <h4 className={`text-xs sm:text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-[#182442]'}`}>
                  {task.title}
                </h4>

                <p className="text-[11px] text-slate-500">
                  Assignee: <strong>{task.assignee}</strong> • Due: <strong className="text-[#6954C8]">{task.dueDate}</strong>
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-400 shrink-0">
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
