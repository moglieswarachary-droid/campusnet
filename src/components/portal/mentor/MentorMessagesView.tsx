import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  MessageSquare, Search, Send, ShieldCheck, Clock, Video,
  CheckCheck, Users, ArrowRight
} from 'lucide-react';
import { LetterAvatar } from '../../common/LetterAvatar';

export const MentorMessagesView: React.FC = () => {
  const { teams, startVideoMeeting, addToast } = useApp();

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-01');
  const [inputMessage, setInputMessage] = useState('');

  const [threads, setThreads] = useState([
    {
      id: 'thread-01',
      participant: {
        name: 'Aarav Sharma (Lead, Team AgriVision)',
        role: 'Autonomous Micro-Drones • SIH 2026',
        avatar: '',
        online: true
      },
      lastMessage: 'Dr. Rao, we have added the hardware watchdog timer logic to the flight controller.',
      timestamp: '11:15 AM',
      unread: 1,
      messages: [
        { id: 'm1', sender: 'them', text: 'Dr. Rao, we tested the optical flow sensor under outdoor midday sunlight.', time: '10:50 AM' },
        { id: 'm2', sender: 'me', text: 'Did you notice any tracking loss or exposure saturation on the down-facing camera?', time: '11:02 AM' },
        { id: 'm3', sender: 'them', text: 'Dr. Rao, we have added the hardware watchdog timer logic to the flight controller.', time: '11:15 AM' }
      ]
    },
    {
      id: 'thread-02',
      participant: {
        name: 'Sneha Patel (Team MedEdge)',
        role: 'Wearable ECG DSP Lead',
        avatar: '',
        online: false
      },
      lastMessage: 'Fixed-point CMSIS FIR filter benchmarks ready for review.',
      timestamp: 'Yesterday',
      unread: 0,
      messages: [
        { id: 'm4', sender: 'them', text: 'Fixed-point CMSIS FIR filter benchmarks ready for review.', time: 'Yesterday' }
      ]
    },
    {
      id: 'thread-03',
      participant: {
        name: 'Karthik Raja (Team Consensus)',
        role: 'Byzantine Fault Tolerance Lead',
        avatar: '',
        online: true
      },
      lastMessage: 'Paper draft Section 4 revised with IEEE style bibliography.',
      timestamp: 'April 14',
      unread: 0,
      messages: [
        { id: 'm5', sender: 'them', text: 'Paper draft Section 4 revised with IEEE style bibliography.', time: 'April 14' }
      ]
    }
  ]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: inputMessage.trim(),
      time: 'Just now'
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: newMsg.text,
          timestamp: 'Just now',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    setInputMessage('');
    addToast({ type: 'info', message: 'Directive sent to student mentee.' });
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F9488] flex items-center justify-center shrink-0 border border-teal-200/70 shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#12243A]">
              Faculty Advisory Messages
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct communication channels with guided student leads and capstone teams
            </p>
          </div>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
        {/* Left: Threads Directory (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200/90 flex flex-col">
          <div className="p-3.5 border-b border-slate-200 bg-[#F3F6FA]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mentees or teams..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {threads.map(t => {
              const isActive = t.id === activeThreadId;

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                    isActive ? 'bg-teal-50/80 border-l-4 border-[#0F9488]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <LetterAvatar
                      name={t.participant.name}
                      size="md"
                      className="w-10 h-10 rounded-xl ring-1 ring-slate-200"
                    />
                    {t.participant.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{t.participant.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{t.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.lastMessage}</p>
                    <span className="text-[9.5px] text-slate-400 truncate block mt-0.5">{t.participant.role}</span>
                  </div>

                  {t.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#0F9488] text-white text-[9px] font-black flex items-center justify-center shrink-0">
                      {t.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Conversation (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between">
          
          {/* Active Thread Header */}
          <div className="p-4 border-b border-slate-200 bg-[#F3F6FA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LetterAvatar
                name={activeThread.participant.name}
                size="md"
                className="w-9 h-9 rounded-xl ring-1 ring-slate-200"
              />
              <div>
                <h3 className="text-xs font-bold text-[#12243A]">{activeThread.participant.name}</h3>
                <p className="text-[10px] text-slate-500">{activeThread.participant.role}</p>
              </div>
            </div>

            <button
              onClick={() => startVideoMeeting('meeting-chat')}
              className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 transition-colors"
              title="Launch Video Call"
            >
              <Video className="w-4 h-4 text-[#0F9488]" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/20">
            {activeThread.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'me'
                      ? 'bg-[#0F9488] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9.5px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                  {msg.time}
                  {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-[#0F9488]" />}
                </span>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={`Message ${activeThread.participant.name}...`}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#0F9488]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#0F9488] hover:bg-[#0D7E73] text-white shadow-xs shrink-0"
              title="Send Directive"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};
