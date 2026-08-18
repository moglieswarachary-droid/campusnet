import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, X, Send, Bot, User, ArrowRight, 
  Users, GraduationCap, Calendar, BookOpen, ShieldCheck 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: {
    type: 'student' | 'mentor' | 'event' | 'research';
    title: string;
    subtitle: string;
    detail: string;
    actionTab: any;
  }[];
}

export const CampusAIAssistant: React.FC = () => {
  const { isAIModalOpen, setIsAIModalOpen, students, mentors, events, setActiveTab } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: 'Hello! I am Campus AI, your interdisciplinary innovation copilot. Ask me to find teammates across engineering departments, match verified faculty mentors, or plan hackathon milestones.',
      recommendations: [
        {
          type: 'student',
          title: 'Recruit ECE Hardware Teammates',
          subtitle: 'Pooja Iyer (Anna University)',
          detail: 'Expert in ESP32, LoRaWAN, & Sensor Node PCB Design',
          actionTab: 'discover'
        },
        {
          type: 'mentor',
          title: 'Dr. Arvind Rao (IIT Bombay)',
          subtitle: '96% Project Match Fit',
          detail: 'Edge Computer Vision & TensorRT UAV deployment',
          actionTab: 'mentors'
        }
      ]
    }
  ]);

  if (!isAIModalOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    const newMsgId = 'user-' + Date.now();
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: newMsgId, sender: 'user', text: userText }
    ];
    setMessages(newMessages);
    setInputQuery('');

    // Intelligent AI query response parsing
    setTimeout(() => {
      let aiReply: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: '',
        recommendations: []
      };

      const lower = userText.toLowerCase();

      if (lower.includes('ece') || lower.includes('hardware') || lower.includes('teammate') || lower.includes('student')) {
        aiReply.text = 'I searched authorized CampusNet student registries across affiliated universities and found eligible verified candidates with matching hardware skills:';
        aiReply.recommendations = [
          {
            type: 'student',
            title: 'Pooja Iyer (Hardware Lead)',
            subtitle: 'CEG Anna University • LoRaWAN & ESP32 PCB',
            detail: 'Verified Student • Innovation Score: 790. Ready for inter-collegiate SIH team.',
            actionTab: 'discover'
          },
          {
            type: 'student',
            title: 'Vikramaditya Deshmukh (Mechatronics)',
            subtitle: 'VJTI Mumbai • ANSYS & Structural FEA',
            detail: 'Verified Student • Robotics & Drone Airframe Lead.',
            actionTab: 'discover'
          }
        ];
      } else if (lower.includes('mentor') || lower.includes('faculty') || lower.includes('guide')) {
        aiReply.text = 'Here are verified faculty guides with open project mentorship capacity on CampusNet:';
        aiReply.recommendations = [
          {
            type: 'mentor',
            title: 'Dr. Arvind Rao (IIT Bombay)',
            subtitle: 'Computer Vision & Edge Systems • 2 Slots Available',
            detail: '14 Years Experience. Guided 38 teams in Edge AI and TensorRT inference.',
            actionTab: 'mentors'
          },
          {
            type: 'mentor',
            title: 'Dr. Priya Sundaram (IISc)',
            subtitle: 'Autonomous Systems & Drone Guidance • 1 Slot Available',
            detail: 'Autonomous UAVs, PX4 Flight Controllers & ROS2 Navigation.',
            actionTab: 'mentors'
          }
        ];
      } else if (lower.includes('event') || lower.includes('hackathon') || lower.includes('sih')) {
        aiReply.text = 'Here are top verified national challenges with active registration windows:';
        aiReply.recommendations = [
          {
            type: 'event',
            title: 'Smart India Hackathon 2026 (SIH)',
            subtitle: 'Ministry of Education & AICTE • Hardware Prototype Track',
            detail: 'National Grand Finale. ₹1,00,000 prize pool per problem statement.',
            actionTab: 'events'
          },
          {
            type: 'event',
            title: 'IIT Bombay National Techfest 2026',
            subtitle: 'IIT Bombay • Robosub & Autonomous Challenge',
            detail: 'Annual Innovation Conclave. Seed funding and incubation support.',
            actionTab: 'events'
          }
        ];
      } else {
        aiReply.text = `I have indexed your query: "${userText}". Here are recommended opportunities across the CampusNet network:`;
        aiReply.recommendations = [
          {
            type: 'student',
            title: 'Inter-Departmental Matching',
            subtitle: 'Browse 150+ colleges',
            detail: 'Find students with complementary engineering & design skills.',
            actionTab: 'discover'
          },
          {
            type: 'research',
            title: 'PhD Research Preprints',
            subtitle: 'IISc & IIT Delhi Labs',
            detail: 'Explore open datasets and co-author publications.',
            actionTab: 'research'
          }
        ];
      }

      setMessages(prev => [...prev, aiReply]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full h-[620px] shadow-warm-xl border border-campus-border flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-campus-deep-blue text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Campus AI Assistant</h3>
                <span className="text-[10px] font-bold bg-amber-400 text-campus-deep-blue px-2 py-0.5 rounded-full">
                  Privacy-Guarded
                </span>
              </div>
              <p className="text-xs text-blue-200">Interdisciplinary matchmaking & research navigator</p>
            </div>
          </div>

          <button
            onClick={() => setIsAIModalOpen(false)}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                msg.sender === 'ai' ? 'bg-campus-deep-blue text-amber-300' : 'bg-campus-red text-white'
              }`}>
                {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-lg space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-campus-blue text-white rounded-tr-none'
                    : 'bg-campus-warm-white text-campus-slate-text border border-campus-border rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                </div>

                {/* Recommendations Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="w-full space-y-2 pt-1">
                    {msg.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setActiveTab(rec.actionTab);
                          setIsAIModalOpen(false);
                        }}
                        className="p-3 rounded-2xl bg-white border border-campus-border hover:border-campus-blue shadow-warm-sm hover:shadow-warm-md transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-campus-deep-blue flex items-center gap-1.5">
                            {rec.type === 'student' && <Users className="w-3.5 h-3.5 text-campus-blue" />}
                            {rec.type === 'mentor' && <GraduationCap className="w-3.5 h-3.5 text-campus-red" />}
                            {rec.type === 'event' && <Calendar className="w-3.5 h-3.5 text-green-600" />}
                            <span>{rec.title}</span>
                          </div>
                          <div className="text-[11px] text-campus-blue font-semibold mt-0.5">{rec.subtitle}</div>
                          <div className="text-[11px] text-campus-muted-text mt-0.5 line-clamp-1">{rec.detail}</div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-campus-blue flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-campus-warm-white border-t border-campus-border flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <span className="font-bold text-campus-muted-text whitespace-nowrap">Suggested:</span>
          <button
            onClick={() => setInputQuery('I need two students with ECE skills for an AI agriculture project')}
            className="px-2.5 py-1 rounded-lg bg-white border border-campus-border hover:border-campus-blue text-campus-slate-text whitespace-nowrap"
          >
            Find ECE students for drone project
          </button>
          <button
            onClick={() => setInputQuery('Find verified mentors with computer vision research experience')}
            className="px-2.5 py-1 rounded-lg bg-white border border-campus-border hover:border-campus-blue text-campus-slate-text whitespace-nowrap"
          >
            Find Computer Vision mentors
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-campus-border flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask Campus AI (e.g. Find me a mechanical CAD student)..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-campus-deep-blue hover:bg-campus-blue text-white shadow-warm-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
