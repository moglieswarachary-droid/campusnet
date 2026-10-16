import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, Plus, Trash2, Users, Award, 
  KeyRound, ShieldCheck, Scale, BarChart2, Star 
} from 'lucide-react';
import { EvaluationCriterion, JudgeAccount } from '../../types';

export const JudgingManagementView: React.FC = () => {
  const { 
    events, currentOrganizer, evaluationCriteria, 
    addEvaluationCriterion, deleteEvaluationCriterion, 
    judges, addJudgeAccount, projectSubmissions, evaluationScores 
  } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(orgEvents[0]?.id || 'ev-kec-001');

  // Criteria form
  const [critName, setCritName] = useState('');
  const [critDesc, setCritDesc] = useState('');
  const [critMax, setCritMax] = useState(25);
  const [critWeight, setCritWeight] = useState(25);

  // Judge form
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgeInstitution, setJudgeInstitution] = useState('');
  const [judgeDesignation, setJudgeDesignation] = useState('');

  const eventCriteria = evaluationCriteria.filter(c => c.eventId === selectedEventId);
  const eventJudges = judges.filter(j => j.assignedEventId === selectedEventId);

  const totalWeight = eventCriteria.reduce((acc, c) => acc + c.weightagePercent, 0);

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!critName.trim()) return;

    addEvaluationCriterion({
      eventId: selectedEventId,
      name: critName.trim(),
      description: critDesc.trim(),
      maxScore: critMax,
      weightagePercent: critWeight
    });

    setCritName('');
    setCritDesc('');
  };

  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeName.trim() || !judgeEmail.trim()) return;

    addJudgeAccount({
      name: judgeName.trim(),
      email: judgeEmail.trim(),
      institution: judgeInstitution.trim() || 'Jury Panel',
      designation: judgeDesignation.trim() || 'External Evaluator',
      assignedEventId: selectedEventId,
      assignedSubmissionIds: projectSubmissions.filter(s => s.eventId === selectedEventId).map(s => s.id)
    });

    setJudgeName('');
    setJudgeEmail('');
    setJudgeInstitution('');
    setJudgeDesignation('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Judging Rubrics & Jury Management
          </h2>
          <p className="text-xs text-slate-400">
            Define multi-criteria weighted scoring rubrics, invite academic/industry judges, and review evaluations.
          </p>
        </div>

        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white font-bold outline-none focus:border-amber-500 shadow-xl self-start sm:self-auto"
        >
          {orgEvents.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* Grid: Criteria Management & Judge Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Evaluation Criteria Rubric */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              1. Weighted Criteria Rubrics
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              totalWeight === 100 ? 'bg-green-950 text-green-300 border border-green-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              Total: {totalWeight}% / 100%
            </span>
          </div>

          {/* Existing criteria list */}
          <div className="space-y-2">
            {eventCriteria.map(crit => (
              <div key={crit.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-white">{crit.name}</div>
                  <div className="text-[10.5px] text-slate-400">{crit.description}</div>
                  <div className="text-[10px] text-amber-400">Max Marks: {crit.maxScore} • Weight: {crit.weightagePercent}%</div>
                </div>

                <button
                  onClick={() => deleteEvaluationCriterion(crit.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Criteria Form */}
          <form onSubmit={handleAddCriterion} className="pt-3 border-t border-slate-800 space-y-3 text-xs">
            <div className="font-bold text-slate-300">Add New Evaluation Criterion</div>
            
            <input
              type="text"
              value={critName}
              onChange={e => setCritName(e.target.value)}
              placeholder="e.g. Technical Feasibility & Edge Performance"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />

            <input
              type="text"
              value={critDesc}
              onChange={e => setCritDesc(e.target.value)}
              placeholder="Description & scoring guidelines for judges..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Max Score</label>
                <input
                  type="number"
                  value={critMax}
                  onChange={e => setCritMax(parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Weightage (%)</label>
                <input
                  type="number"
                  value={critWeight}
                  onChange={e => setCritWeight(parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              + Add Criterion to Rubric
            </button>
          </form>
        </div>

        {/* Right: Assigned Judges & Access Keys */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              2. Jury Accounts & Access Keys
            </h3>
            <span className="text-[10px] text-slate-400">{eventJudges.length} Judges Assigned</span>
          </div>

          <div className="space-y-2">
            {eventJudges.map(judge => (
              <div key={judge.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-white">{judge.name}</div>
                  <div className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    KEY: {judge.accessKey}
                  </div>
                </div>
                <div className="text-[10.5px] text-slate-400">
                  {judge.designation} • {judge.institution} ({judge.email})
                </div>
                <div className="text-[10px] text-slate-500">
                  Assigned Submissions: {judge.assignedSubmissionIds.length} projects
                </div>
              </div>
            ))}
          </div>

          {/* Add Judge Form */}
          <form onSubmit={handleAddJudge} className="pt-3 border-t border-slate-800 space-y-3 text-xs">
            <div className="font-bold text-slate-300">Invite External / Faculty Judge</div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={judgeName}
                onChange={e => setJudgeName(e.target.value)}
                placeholder="Judge Name (e.g. Dr. Arvind Rao)"
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
              <input
                type="email"
                value={judgeEmail}
                onChange={e => setJudgeEmail(e.target.value)}
                placeholder="Official Email"
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={judgeInstitution}
                onChange={e => setJudgeInstitution(e.target.value)}
                placeholder="Institution (e.g. IIT Bombay)"
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={judgeDesignation}
                onChange={e => setJudgeDesignation(e.target.value)}
                placeholder="Designation / Domain"
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              + Create Judge Key & Assign
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
