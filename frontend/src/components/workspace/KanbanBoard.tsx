import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Circle, Clock, Plus, User, AlertCircle } from 'lucide-react';
import { ProjectTask } from '../../types';

export const KanbanBoard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { projects, addProjectTask, updateTaskStatus } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [assignee, setAssignee] = useState('Aarav Sharma');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const project = projects.find(p => p.id === projectId) || projects[0];

  const todoTasks = project.tasks.filter(t => t.status === 'todo');
  const inProgressTasks = project.tasks.filter(t => t.status === 'in_progress');
  const doneTasks = project.tasks.filter(t => t.status === 'done');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addProjectTask(projectId, {
      title: newTaskTitle,
      assignee,
      status: 'todo',
      priority
    });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const columns: { id: 'todo' | 'in_progress' | 'done'; title: string; tasks: ProjectTask[]; color: string }[] = [
    { id: 'todo', title: 'To Do', tasks: todoTasks, color: 'border-campus-border bg-campus-warm-white/60' },
    { id: 'in_progress', title: 'In Progress (Active Sprint)', tasks: inProgressTasks, color: 'border-blue-200 bg-blue-50/40' },
    { id: 'done', title: 'Completed & Verified', tasks: doneTasks, color: 'border-green-200 bg-green-50/40' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-campus-deep-blue">Project Milestone Taskboard</h3>
          <p className="text-xs text-campus-muted-text">Collaborative tasks distributed across the 6 team members.</p>
        </div>

        <button
          onClick={() => setIsAddingTask(true)}
          className="campus-btn-primary text-xs py-2 px-3.5 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Assign New Task
        </button>
      </div>

      {/* Add Task Quick Form */}
      {isAddingTask && (
        <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-white border border-campus-border shadow-warm-md flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Task description (e.g. Test RF amplifier gain at 868 MHz)..."
            className="flex-1 min-w-[200px] px-3.5 py-2 text-xs border border-campus-border rounded-xl focus:border-campus-blue outline-none"
            required
          />

          <select
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            className="px-3 py-2 text-xs border border-campus-border rounded-xl bg-white outline-none"
          >
            <option value="Aarav Sharma">Aarav Sharma (AI Lead)</option>
            <option value="Pooja Iyer">Pooja Iyer (ECE)</option>
            <option value="Vikramaditya">Vikramaditya (Mech)</option>
            <option value="Ananya Roy">Ananya Roy (UI/UX)</option>
            <option value="Rohan Sen">Rohan Sen (Backend)</option>
            <option value="Dr. Sneha Paul">Dr. Sneha Paul (Research)</option>
          </select>

          <select
            value={priority}
            onChange={e => setPriority(e.target.value as any)}
            className="px-3 py-2 text-xs border border-campus-border rounded-xl bg-white outline-none"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <div className="flex items-center gap-2">
            <button type="submit" className="campus-btn-red text-xs py-2 px-3 rounded-xl">Save</button>
            <button type="button" onClick={() => setIsAddingTask(false)} className="campus-btn-secondary text-xs py-2 px-3 rounded-xl">Cancel</button>
          </div>
        </form>
      )}

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.id} className={`p-4 rounded-3xl border ${col.color} space-y-3`}>
            
            <div className="flex items-center justify-between pb-2 border-b border-campus-border/60">
              <h4 className="font-bold text-xs uppercase tracking-wider text-campus-deep-blue">{col.title}</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-campus-slate-text border border-campus-border">
                {col.tasks.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {col.tasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-white border border-campus-border shadow-warm-sm hover:shadow-warm-md transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-campus-slate-text leading-snug">{task.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-campus-red' : task.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-campus-border text-xs">
                    <span className="flex items-center gap-1 text-[11px] text-campus-muted-text">
                      <User className="w-3.5 h-3.5" />
                      {task.assignee}
                    </span>

                    {/* Quick Move Trigger */}
                    <div className="flex items-center gap-1">
                      {col.id !== 'todo' && (
                        <button
                          onClick={() => updateTaskStatus(projectId, task.id, col.id === 'done' ? 'in_progress' : 'todo')}
                          className="text-[10.5px] font-bold text-campus-muted-text hover:text-campus-blue px-1.5 py-0.5 rounded hover:bg-campus-warm-white"
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button
                          onClick={() => updateTaskStatus(projectId, task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                          className="text-[10.5px] font-bold text-campus-blue hover:text-campus-deep-blue px-1.5 py-0.5 rounded hover:bg-campus-soft-blue"
                          title="Move right"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {col.tasks.length === 0 && (
                <div className="py-12 text-center text-xs text-campus-muted-text italic">
                  No tasks in this lane
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
