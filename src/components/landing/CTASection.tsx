import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowRight, LayoutGrid, Building2, ShieldCheck } from 'lucide-react';
import { WorkspaceSelectionModal } from './WorkspaceSelectionModal';

export const CTASection: React.FC = () => {
  const { setActiveTab } = useApp();
  const navigate = useNavigate();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>National Innovation Ecosystem</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to Connect, Learn, and Build Together?
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Join students, faculty guides, and research scholars across higher education institutions in India.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsWorkspaceModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
            <span>Choose Your Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('discover');
              navigate('/discover');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            Explore National Directory
          </button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
          <span>450+ Accredited Institutions</span>
          <span>•</span>
          <span>Dual GPS/QR Attendance</span>
          <span>•</span>
          <span>Verifiable Credentials</span>
        </div>

      </div>

      <WorkspaceSelectionModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
      />
    </section>
  );
};
