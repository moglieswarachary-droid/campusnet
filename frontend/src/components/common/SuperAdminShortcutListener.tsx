import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, FileCheck, X, Shield, Lock, 
  ArrowRight, KeyRound, ExternalLink 
} from 'lucide-react';

/**
 * SuperAdminShortcutListener
 * Listens for global shortcut Shift + Z to securely open the Statutory & Governance Authority Access modal.
 * Disregards events triggered when typing inside text inputs, textareas, or contentEditable nodes.
 */
export const SuperAdminShortcutListener: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenReviewer = useCallback(() => {
    setIsOpen(false);
    navigate('/reviewer/login');
  }, [navigate]);

  const handleOpenSuperAdmin = useCallback(() => {
    setIsOpen(false);
    navigate('/super-admin/login');
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently interacting with an input/textarea/editable field
      const target = e.target as HTMLElement | null;
      if (
        target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable
        )
      ) {
        return;
      }

      // Check for Shift + Z combination
      const isShiftZ = e.shiftKey && (e.key === 'Z' || e.key === 'z' || e.code === 'KeyZ');
      
      if (isShiftZ) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // When modal is open, listen for keyboard options
      if (isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsOpen(false);
        } else if (e.key === '1') {
          e.preventDefault();
          handleOpenReviewer();
        } else if (e.key === '2') {
          e.preventDefault();
          handleOpenSuperAdmin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleOpenReviewer, handleOpenSuperAdmin]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="statutory-authority-title"
    >
      <div 
        className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-red-500/30 rounded-2xl p-6 sm:p-7 shadow-[0_0_60px_rgba(220,38,38,0.25)] text-slate-200 space-y-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-950/90 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-950/50">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="statutory-authority-title" className="text-base sm:text-lg font-black text-white tracking-wide">
                  Statutory & Governance Authority Access
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40">
                  Restricted: Level 4 & 5
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dedicated secure consoles for appointed AICTE / statutory reviewers and national platform administrators. All access attempts are verified and recorded under immutable zero-trust audit policies.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close authority modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portals Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Level 4: AICTE Reviewer */}
          <button
            onClick={handleOpenReviewer}
            className="group relative flex flex-col justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-rose-500/40 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-rose-950/30"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-rose-950/70 border border-rose-500/30 flex items-center justify-center text-rose-300">
                  <FileCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-rose-500/40 group-hover:text-rose-300">
                  Press [1]
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-400 tracking-wider uppercase">Level 4 Authority</span>
                <h4 className="text-sm font-bold text-white group-hover:text-rose-200 transition-colors">
                  Platform Reviewer
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  AICTE and statutory review of institutional accreditations, hackathon guidelines, prize pool audits, and compliance.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-rose-300">
              <span>Sign In with OTP</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Level 5: Super Administrator */}
          <button
            onClick={handleOpenSuperAdmin}
            className="group relative flex flex-col justify-between p-4 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-900/50 hover:border-red-500/50 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-950/50"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-red-950 border border-red-500/40 flex items-center justify-center text-red-300">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-red-500/40 group-hover:text-red-300">
                  Press [2]
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-400 tracking-wider uppercase">Level 5 Governance</span>
                <h4 className="text-sm font-bold text-white group-hover:text-red-200 transition-colors">
                  Super Administrator
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Level-5 root platform governance, master institution management, real-time audit ledger tracking, and policy moderation.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-red-900/50 flex items-center justify-between text-xs font-semibold text-red-300 group-hover:text-red-200">
              <span>Sign In with OTP</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>

        {/* Footer info & shortcut note */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero-Trust Enforced • All sessions cryptographically verified</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
              Shift + Z
            </span>
            <span className="text-slate-500">to toggle</span>
            <span className="text-slate-600">•</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
              Esc
            </span>
            <span className="text-slate-500">to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};

