import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, Trophy, Medal, Star, ShieldCheck, 
  CheckCircle2, Plus, Download, ArrowRight 
} from 'lucide-react';
import { OrganizerTab } from './OrganizerLayout';

interface Props {
  setActiveSection: (section: OrganizerTab) => void;
}

export const WinnerManagementView: React.FC<Props> = ({ setActiveSection }) => {
  const { 
    events, currentOrganizer, projectSubmissions, 
    eventWinners, finalizeEventWinners, certificates 
  } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(orgEvents[0]?.id || 'ev-kec-001');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const submissions = projectSubmissions.filter(s => s.eventId === selectedEventId);
  const winners = eventWinners.filter(w => w.eventId === selectedEventId);

  // Ranked submissions by score
  const rankedSubmissions = [...submissions].sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));

  const handleFinalizeTopRankings = () => {
    if (rankedSubmissions.length < 2) return;

    const winnerEntries = [
      {
        eventId: selectedEventId,
        submissionId: rankedSubmissions[0].id,
        teamId: rankedSubmissions[0].teamId,
        teamName: rankedSubmissions[0].teamName,
        projectTitle: rankedSubmissions[0].projectTitle,
        members: [
          { name: 'Aarav Sharma', college: 'NITK Surathkal', role: 'AI Lead' },
          { name: 'Pooja Iyer', college: 'Anna University', role: 'Hardware Lead' },
          { name: 'Vikramaditya Deshmukh', college: 'VJTI Mumbai', role: 'Robotics Lead' }
        ],
        category: 'Winner' as const,
        prizeAmount: currentEvent.prizes[0]?.amount || '₹1,50,000',
        finalRank: 1,
        score: rankedSubmissions[0].finalScore || 94.5
      },
      {
        eventId: selectedEventId,
        submissionId: rankedSubmissions[1].id,
        teamId: rankedSubmissions[1].teamId,
        teamName: rankedSubmissions[1].teamName,
        projectTitle: rankedSubmissions[1].projectTitle,
        members: [
          { name: 'Rahul Verma', college: 'Kuppam Engineering College', role: 'Lead Developer' }
        ],
        category: 'Runner-Up' as const,
        prizeAmount: currentEvent.prizes[1]?.amount || '₹75,000',
        finalRank: 2,
        score: rankedSubmissions[1].finalScore || 88.0
      }
    ];

    finalizeEventWinners(selectedEventId, winnerEntries);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              Jury Leaderboard & Awards
            </span>
            <span className="text-xs text-slate-400">Merit Certificate Binding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Winner Management & Final Rankings
          </h2>
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

      {/* Official Winners Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {winners.map((win, idx) => (
          <div
            key={win.id}
            className={`p-6 rounded-3xl border shadow-xl space-y-3 relative overflow-hidden ${
              win.category === 'Winner'
                ? 'bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border-amber-500/50'
                : 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {win.category === 'Winner' ? (
                  <Trophy className="w-6 h-6 text-amber-400" />
                ) : (
                  <Medal className="w-6 h-6 text-slate-300" />
                )}
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                    {win.category === 'Winner' ? '1st Place Champion' : '2nd Place Runner-Up'}
                  </span>
                  <h4 className="text-lg font-black text-white">{win.teamName}</h4>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-green-400">{win.prizeAmount}</div>
                <div className="text-[10px] text-slate-400">Award Amount</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-semibold">{win.projectTitle}</p>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
              <span className="text-amber-300 font-mono font-bold">Score: {win.score}/100</span>
              <button
                onClick={() => setActiveSection('certificates')}
                className="text-amber-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <span>View Certificate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ranked Submissions Leaderboard Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Full Competition Leaderboard ({rankedSubmissions.length})</h3>
            <p className="text-xs text-slate-400">Ranked dynamically by weighted jury scores</p>
          </div>

          <button
            onClick={handleFinalizeTopRankings}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Finalize Top Winners</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Team & Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Jury Score</th>
                <th className="px-4 py-3 text-right">Award Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankedSubmissions.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-black text-amber-400 text-sm">
                    #{idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{sub.teamName}</div>
                    <div className="text-[11px] text-slate-400">{sub.projectTitle}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 text-slate-300 border border-slate-800">
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-green-400">
                    {sub.finalScore ? `${sub.finalScore.toFixed(1)}/100` : 'Evaluating'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-amber-300 text-xs">
                      {idx === 0 ? '🏆 Winner' : idx === 1 ? '🥈 Runner-Up' : 'Merit Finalist'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
