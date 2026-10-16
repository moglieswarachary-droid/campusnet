import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, MessageSquareCode, Bot, CheckCircle2 } from 'lucide-react';

export const CampusAIPromotion: React.FC = () => {
  const { setIsAIModalOpen } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-campus-warm-white border-t border-campus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-campus-border shadow-warm-xl p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-campus-soft-blue text-campus-blue text-xs font-bold border border-blue-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Intelligent Academic Copilot
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-campus-deep-blue leading-tight">
                Meet <span className="text-campus-red">Campus AI</span>: Your 24/7 Innovation Navigator
              </h2>

              <p className="text-sm sm:text-base text-campus-slate-text/80 leading-relaxed">
                Need to find a Mechanical student with ANSYS simulation skills from VJTI? Or a verified mentor specializing in edge computer vision? Ask Campus AI to search authorized CampusNet databases while respecting privacy.
              </p>

              <div className="space-y-2.5 text-xs text-campus-slate-text">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-campus-green flex-shrink-0" />
                  Natural language student & department discovery
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-campus-green flex-shrink-0" />
                  Multidimensional mentor fit recommendation
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-campus-green flex-shrink-0" />
                  Hackathon roadmap & research milestone planning
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="campus-btn-primary text-sm px-7 py-3 rounded-xl shadow-warm-md"
                >
                  <Bot className="w-4 h-4" />
                  Launch Campus AI Assistant
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Prompt Preview Bubble */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-2xl bg-campus-warm-white border border-campus-border text-xs space-y-2">
                <div className="flex items-center gap-2 text-campus-muted-text font-bold uppercase text-[10.5px]">
                  <span>User Query Example:</span>
                </div>
                <p className="text-campus-deep-blue font-semibold">
                  "I need two students with ECE & PCB skills for an AI agriculture drone project."
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-campus-deep-blue text-white shadow-warm-md text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Campus AI Match Result:</span>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  Found <strong>Pooja Iyer</strong> (CEG Anna University, ECE 3rd Year) with verified LoRaWAN & ESP32 telemetry hardware skills. Recommended fit: 94%.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
