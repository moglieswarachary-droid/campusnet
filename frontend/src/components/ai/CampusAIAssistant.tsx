import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, X, Send, Bot, User, ArrowRight, 
  Users, GraduationCap, Calendar, BookOpen, ShieldCheck,
  CheckCircle2, Clock, Award, Star, Lightbulb, FileText,
  Copy, Check, RefreshCw
} from 'lucide-react';

export type AICopilotMode = 'general' | 'teammates' | 'mentors' | 'pitch' | 'research' | 'planner';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  mode?: AICopilotMode;
  scoreCard?: {
    overall: number;
    clarity: number;
    innovation: number;
    feasibility: number;
    impact: number;
    verdict: string;
  };
  sprintPhases?: {
    time: string;
    phase: string;
    deliverables: string[];
  }[];
  recommendations?: {
    type: 'student' | 'mentor' | 'event' | 'research';
    title: string;
    subtitle: string;
    detail: string;
    badge?: string;
    score?: number;
    actionTab: any;
    targetId?: string;
  }[];
}

export const CampusAIAssistant: React.FC = () => {
  const { 
    isAIModalOpen, setIsAIModalOpen, students, mentors, 
    events, projects, researchers, publications, 
    setActiveTab, addToast, setSelectedUserProfileModal 
  } = useApp();

  const [activeMode, setActiveMode] = useState<AICopilotMode>('general');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: 'Namaste! I am **CampusNet+ AI**, your interdisciplinary innovation copilot across 100+ Indian universities. Select a specialized mode or ask me anything to find teammates, match faculty guides, evaluate hackathon abstracts, or plan development sprints.',
      recommendations: [
        {
          type: 'student',
          title: 'Recruit ECE Hardware Teammates',
          subtitle: 'Pooja Iyer • Anna University',
          detail: 'Expert in ESP32, LoRaWAN, & Sensor Node PCB Design',
          badge: '96% Fit',
          actionTab: 'discover'
        },
        {
          type: 'mentor',
          title: 'Dr. Arvind Rao • IIT Bombay',
          subtitle: 'Edge AI & TensorRT Specialist',
          detail: '14 Years Experience • 2 Mentorship Slots Available',
          badge: 'Top Faculty',
          actionTab: 'mentors'
        }
      ]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isAIModalOpen) return null;

  const quickPrompts = [
    { mode: 'teammates' as AICopilotMode, label: '👥 Find ESP32 / IoT Teammate', text: 'Find me verified ECE or IoT students skilled in ESP32, LoRaWAN, and PCB design for our hackathon team.' },
    { mode: 'mentors' as AICopilotMode, label: '🎓 Match AI Faculty Mentor', text: 'Match me with a verified faculty guide specializing in Edge Computer Vision and autonomous robotics.' },
    { mode: 'pitch' as AICopilotMode, label: '💡 Review AgriTech Project Pitch', text: 'Review our abstract: AgriVision AI uses drone edge multispectral imaging to diagnose crop pests in real time with automated spray precision.' },
    { mode: 'research' as AICopilotMode, label: '📄 Summarize Drone Crop Research', text: 'Summarize key findings, datasets, and methodology of Edge TensorRT drone crop diagnostics research.' },
    { mode: 'planner' as AICopilotMode, label: '📅 Plan 36-Hour Hackathon Sprint', text: 'Generate an hour-by-hour 36-hour hackathon execution timeline from ideation to pitch demo.' }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast({ type: 'success', title: 'Copied to Clipboard', message: 'Response text copied.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'ai-reset',
        sender: 'ai',
        text: 'Chat history cleared. How can I assist your innovation journey today?',
        mode: activeMode
      }
    ]);
  };

  const processAIResponse = (userText: string, mode: AICopilotMode) => {
    const lower = userText.toLowerCase();
    let replyText = '';
    let recommendations: ChatMessage['recommendations'] = [];
    let scoreCard: ChatMessage['scoreCard'] | undefined;
    let sprintPhases: ChatMessage['sprintPhases'] | undefined;

    if (mode === 'teammates' || lower.includes('teammate') || lower.includes('student') || lower.includes('recruit') || lower.includes('ece') || lower.includes('iot') || lower.includes('developer')) {
      replyText = `### 🎯 Verified Candidate Recommendations\n\nI queried the **National Student Innovation Registry** across verified university departments. Here are top-ranked matches:`;
      
      const matchedStudents = students.filter(s => {
        return (
          lower.includes('ece') || lower.includes('iot') || lower.includes('hardware') 
            ? s.department.toLowerCase().includes('electronics') || s.skills.some(sk => ['IoT', 'ESP32', 'Robotics', 'Embedded'].some(k => sk.toLowerCase().includes(k.toLowerCase())))
            : true
        );
      }).slice(0, 3);

      recommendations = (matchedStudents.length > 0 ? matchedStudents : students.slice(0, 2)).map(s => ({
        type: 'student',
        title: `${s.name} (${s.department.split(' ')[0]})`,
        subtitle: `${s.institution} • ${s.year}`,
        detail: `Skills: ${s.skills.slice(0, 4).join(', ')} • Innovation Score: ${s.innovationScore || 780}`,
        badge: `${Math.floor(Math.random() * 8 + 92)}% Match`,
        actionTab: 'discover'
      }));
    } else if (mode === 'mentors' || lower.includes('mentor') || lower.includes('faculty') || lower.includes('guide') || lower.includes('professor')) {
      replyText = `### 🎓 Matched Faculty & Industry Guides\n\nBased on your query, here are verified mentors with active project guidance bandwidth:`;
      
      recommendations = mentors.slice(0, 2).map(m => ({
        type: 'mentor',
        title: `${m.name} (${m.institution})`,
        subtitle: `${m.specialization} • ${m.experience}`,
        detail: `Research: ${m.researchAreas.slice(0, 3).join(', ')} • ${m.mentorshipSlots || 3} Slots Available`,
        badge: `${m.availability || 'Top Guide'}`,
        actionTab: 'mentors',
        targetId: m.id
      }));
    } else if (mode === 'pitch' || lower.includes('review') || lower.includes('abstract') || lower.includes('pitch') || lower.includes('idea') || lower.includes('evaluate')) {
      replyText = `### 📊 Project Pitch Evaluation & Rubric Breakdown\n\nI evaluated your project proposal across standard **Smart India Hackathon (SIH) & National Innovation Council** criteria:\n\n* **Strengths**: Strong multi-disciplinary integration combining computer vision with edge hardware.\n* **Recommendations**: Add quantified unit economics (e.g. cost reduction per acre) and specify offline fallback when connectivity drops in rural farm clusters.`;
      
      scoreCard = {
        overall: 92,
        clarity: 95,
        innovation: 94,
        feasibility: 88,
        impact: 91,
        verdict: 'Excellent — Top Tier SIH Finalist Potential'
      };
    } else if (mode === 'planner' || lower.includes('sprint') || lower.includes('plan') || lower.includes('timeline') || lower.includes('36-hour') || lower.includes('hackathon')) {
      replyText = `### ⏱️ 36-Hour Hackathon Execution Sprint Plan\n\nHere is your team's tactical milestone roadmap optimized for 36-hour national competitions:`;
      
      sprintPhases = [
        {
          time: 'Hours 0 – 6 (Discovery & Architecture)',
          phase: 'Phase 1: Foundation',
          deliverables: ['Finalize system schema & API contracts', 'Set up GitHub Repo with CI & linting', 'Acquire sample test datasets & drone footage']
        },
        {
          time: 'Hours 6 – 18 (Core MVP Build)',
          phase: 'Phase 2: Core Engineering',
          deliverables: ['Implement TensorRT edge inference pipeline', 'Connect LoRaWAN telemetry to backend API', 'Deploy initial frontend dashboard']
        },
        {
          time: 'Hours 18 – 30 (Integration & Edge Validation)',
          phase: 'Phase 3: Integration',
          deliverables: ['End-to-end hardware loop testing', 'Simulate network latency & edge caching', 'Record 2-minute live demo backup video']
        },
        {
          time: 'Hours 30 – 36 (Pitch Deck & Grand Jury Prep)',
          phase: 'Phase 4: Presentation Polish',
          deliverables: ['Craft 10-slide high-impact pitch deck', 'Rehearse 3-minute jury pitch & Q&A defense', 'Mint verified submission on CampusNet']
        }
      ];
    } else if (mode === 'research' || lower.includes('research') || lower.includes('paper') || lower.includes('preprint') || lower.includes('publication')) {
      replyText = `### 📄 Research Preprint Summary & Insights\n\n**Title**: *Edge-Optimized Neural Networks for Real-Time Agricultural Diagnostics*\n\n* **Problem Statement**: High latency and cloud bandwidth dependencies prevent real-time drone crop diagnostics in rural agrarian sectors.\n* **Core Methodology**: Quantized INT8 MobileNet-V4 deployed on NVIDIA Jetson Orin Nano with sub-15ms frame inference.\n* **Key Finding**: Achieved 96.4% pest detection accuracy with 78% lower power consumption than traditional cloud streaming pipelines.`;
      
      recommendations = [
        {
          type: 'research',
          title: 'Explore Full Preprint in Research Hub',
          subtitle: 'IISc Bangalore • IEEE AgroTech 2026',
          detail: 'Includes downloadable 10GB open pest image dataset & Docker benchmark scripts.',
          badge: 'Open Access',
          actionTab: 'research'
        }
      ];
    } else {
      replyText = `I analyzed your request across CampusNet's national innovation network. You can explore relevant active challenges, projects, and academic resources below:`;
      recommendations = [
        {
          type: 'event',
          title: 'KEC National AI & Smart Robotics Hackathon 2026',
          subtitle: '₹5,00,000 Prize Pool • Grand Finale Live',
          detail: 'GPS Geofenced • Verifiable Certificates with NAAC/NIRF Points',
          badge: 'Trending Event',
          actionTab: 'events'
        },
        {
          type: 'student',
          title: 'Explore 1,200+ Verified Students',
          subtitle: 'Filter by Department, Year & State',
          detail: 'Connect directly with peers from NITK, IIT Bombay, and Anna University.',
          actionTab: 'discover'
        }
      ];
    }

    return { replyText, recommendations, scoreCard, sprintPhases };
  };

  const handleSend = (e?: React.FormEvent, customPrompt?: string, modeOverride?: AICopilotMode) => {
    if (e) e.preventDefault();
    const targetText = customPrompt || inputQuery;
    if (!targetText.trim()) return;

    const userText = targetText.trim();
    const effectiveMode = modeOverride || activeMode;
    const newMsgId = 'user-' + Date.now();

    setMessages(prev => [
      ...prev,
      { id: newMsgId, sender: 'user', text: userText, mode: effectiveMode }
    ]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI inference
    setTimeout(() => {
      const { replyText, recommendations, scoreCard, sprintPhases } = processAIResponse(userText, effectiveMode);
      
      const aiReply: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        mode: effectiveMode,
        recommendations,
        scoreCard,
        sprintPhases
      };

      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-campus-deep-blue/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-campus-border shadow-2xl w-full max-w-3xl flex flex-col h-[85vh] max-h-[780px] overflow-hidden">
        
        {/* Header */}
        <div className="bg-campus-deep-blue text-white px-6 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-campus-blue to-campus-bright-red flex items-center justify-center shadow-warm-md ring-2 ring-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">CampusNet+ AI Copilot</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs text-blue-200">
                National Academic & Innovation Intelligence Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsAIModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-campus-warm-white/80 px-4 py-2 border-b border-campus-border flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: 'general', label: '🌐 All Copilot', icon: Bot },
            { id: 'teammates', label: '👥 Teammate Match', icon: Users },
            { id: 'mentors', label: '🎓 Faculty Match', icon: GraduationCap },
            { id: 'pitch', label: '💡 Pitch Review', icon: Lightbulb },
            { id: 'research', label: '📄 Research Paper', icon: FileText },
            { id: 'planner', label: '📅 36h Planner', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id as AICopilotMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeMode === tab.id
                  ? 'bg-campus-blue text-white shadow-warm-sm'
                  : 'bg-white text-campus-slate-text border border-campus-border hover:border-campus-blue'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-campus-deep-blue text-white flex items-center justify-center flex-shrink-0 shadow-warm-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-campus-blue text-white rounded-2xl rounded-tr-sm p-3.5 sm:p-4 shadow-warm-sm text-xs sm:text-sm'
                  : 'bg-white text-campus-slate-text border border-campus-border rounded-2xl rounded-tl-sm p-4 shadow-warm-sm text-xs sm:text-sm'
              }`}>
                
                {/* Text Content */}
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                {/* Scorecard Component (if Pitch Mode) */}
                {msg.scoreCard && (
                  <div className="mt-3 p-3.5 bg-campus-soft-blue/70 rounded-xl border border-blue-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-campus-deep-blue uppercase tracking-wider">
                        SIH Rubric Evaluation
                      </span>
                      <span className="text-base font-black text-campus-blue">
                        {msg.scoreCard.overall}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <span className="text-campus-muted-text block">Problem Clarity</span>
                        <span className="font-bold text-campus-deep-blue">{msg.scoreCard.clarity}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <span className="text-campus-muted-text block">Novelty & Innovation</span>
                        <span className="font-bold text-campus-deep-blue">{msg.scoreCard.innovation}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <span className="text-campus-muted-text block">Tech Feasibility</span>
                        <span className="font-bold text-campus-deep-blue">{msg.scoreCard.feasibility}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <span className="text-campus-muted-text block">National Impact</span>
                        <span className="font-bold text-campus-deep-blue">{msg.scoreCard.impact}%</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-campus-blue bg-blue-100/60 p-2 rounded-lg flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-campus-red flex-shrink-0" />
                      <span>{msg.scoreCard.verdict}</span>
                    </div>
                  </div>
                )}

                {/* 36h Sprint Planner Timeline Component */}
                {msg.sprintPhases && (
                  <div className="mt-3 space-y-2">
                    {msg.sprintPhases.map((phase, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-campus-deep-blue">
                          <span>{phase.phase}</span>
                          <span className="text-[10.5px] text-campus-red font-mono">{phase.time}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-campus-muted-text text-[11px] pt-1">
                          {phase.deliverables.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-campus-muted-text">
                      Interactive Actions & Matches:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendations.map((rec, idx) => (
                        <div 
                          key={idx}
                          className="bg-white p-3 rounded-xl border border-campus-border hover:border-campus-blue transition-all space-y-2 shadow-xs group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-xs text-campus-deep-blue group-hover:text-campus-blue leading-snug">
                              {rec.title}
                            </span>
                            {rec.badge && (
                              <span className="text-[9.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded flex-shrink-0">
                                {rec.badge}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[11px] font-medium text-campus-muted-text line-clamp-1">
                            {rec.subtitle}
                          </p>
                          <p className="text-[10.5px] text-slate-500 line-clamp-2">
                            {rec.detail}
                          </p>

                          <button
                            onClick={() => {
                              setIsAIModalOpen(false);
                              setActiveTab(rec.actionTab);
                            }}
                            className="w-full mt-1 py-1.5 px-2 bg-campus-soft-blue text-campus-blue hover:bg-campus-blue hover:text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            Explore on Platform
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Toolbar */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-end pt-1 gap-2 text-campus-muted-text">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[10.5px] hover:text-campus-blue flex items-center gap-1 font-medium"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-campus-soft-blue text-campus-blue border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-warm-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-campus-deep-blue text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-campus-border shadow-warm-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-campus-blue animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 rounded-full bg-campus-red animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 rounded-full bg-campus-blue animate-bounce" />
                <span className="text-xs font-semibold text-campus-muted-text ml-2">
                  Campus AI is querying national registries...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 bg-white border-t border-campus-border flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveMode(prompt.mode);
                handleSend(undefined, prompt.text, prompt.mode);
              }}
              className="px-3 py-1.5 rounded-full bg-campus-warm-white hover:bg-campus-soft-blue text-campus-slate-text hover:text-campus-blue border border-campus-border hover:border-campus-blue text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Query Input Footer */}
        <div className="p-4 bg-white border-t border-campus-border flex-shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                activeMode === 'teammates' ? "e.g. Find 3rd year ECE student skilled in LoRaWAN..." :
                activeMode === 'mentors' ? "e.g. Match AI professor for edge robotics guidance..." :
                activeMode === 'pitch' ? "e.g. Review our smart agri drone abstract for SIH..." :
                activeMode === 'planner' ? "e.g. Generate 36-hour hackathon milestones..." :
                "Ask Campus AI anything (teammates, mentors, research, hackathons)..."
              }
              className="flex-1 bg-campus-warm-white border border-campus-border rounded-xl px-4 py-3 text-xs sm:text-sm text-campus-slate-text focus:outline-none focus:border-campus-blue focus:ring-1 focus:ring-campus-blue"
            />
            <button 
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-5 py-3 bg-campus-blue text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-campus-deep-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-warm-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CampusAIAssistant;
