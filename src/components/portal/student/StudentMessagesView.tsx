import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  MessageSquare, Search, Send, User, ShieldCheck, Clock,
  Video, Phone, Paperclip, MoreVertical, Sparkles, CheckCheck
} from 'lucide-react';

export const StudentMessagesView: React.FC = () => {
  const {
    currentUser, mentors, teams, startVideoMeeting, addToast,
    setIsDirectMessagingOpen, setActiveMessagingPartner
  } = useApp();

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-01');
  const [inputMessage, setInputMessage] = useState('');

  // Sample threads connected with real mentors & teammates
  const [threads, setThreads] = useState([
    {
      id: 'thread-01',
      participant: {
        name: 'Dr. Arvind Rao',
        role: 'Faculty Mentor • IIT Bombay',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        online: true
      },
      lastMessage: 'Let us review the TensorRT benchmarks during Thursday office hours.',
      timestamp: '10:45 AM',
      unread: 1,
      messages: [
        { id: 'm1', sender: 'them', text: 'Hi, did you run the field latency benchmarks on Jetson Orin Nano?', time: '10:30 AM' },
        { id: 'm2', sender: 'me', text: 'Yes Dr. Rao, we achieved 14.2ms inference time per frame with INT8 quantization on the YOLOv8 model.', time: '10:40 AM' },
        { id: 'm3', sender: 'them', text: 'Let us review the TensorRT benchmarks during Thursday office hours.', time: '10:45 AM' },
      ]
    },
    {
      id: 'thread-02',
      participant: {
        name: 'Team AgriVision (SIH 2026)',
        role: '6 Members • Capstone Sprint',
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
        online: true
      },
      lastMessage: 'Hardware team has assembled the dual-nozzle spray assembly.',
      timestamp: 'Yesterday',
      unread: 0,
      messages: [
        { id: 'm4', sender: 'them', text: 'Hardware team has assembled the dual-nozzle spray assembly.', time: 'Yesterday' },
        { id: 'm5', sender: 'me', text: 'Awesome. I will push the PID controller firmware update today.', time: 'Yesterday' }
      ]
    },
    {
      id: 'thread-03',
      participant: {
        name: 'Prof. Sudhir Sen',
        role: 'Distinguished Fellow • IISc',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        online: false
      },
      lastMessage: 'Good paper draft. Please check Section 4 bibliography.',
      timestamp: 'April 11',
      unread: 0,
      messages: [
        { id: 'm6', sender: 'them', text: 'Good paper draft. Please check Section 4 bibliography.', time: 'April 11' }
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
    addToast({ type: 'info', message: 'Message sent via encrypted student channel.' });
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-campus-blue flex items-center justify-center shrink-0 border border-blue-200/70 shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-campus-deep-blue">
              Messages & Team Collaboration
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Encrypted messaging with faculty mentors, peer project collaborators, and team workspaces
            </p>
          </div>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left: Threads Directory (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200/90 flex flex-col">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-campus-blue"
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
                    isActive ? 'bg-blue-50/80 border-l-4 border-campus-blue' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={t.participant.avatar}
                      alt={t.participant.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
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
                    <span className="w-4 h-4 rounded-full bg-campus-blue text-white text-[9px] font-black flex items-center justify-center shrink-0">
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
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeThread.participant.avatar}
                alt={activeThread.participant.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-campus-deep-blue">{activeThread.participant.name}</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[10px] text-slate-500">{activeThread.participant.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startVideoMeeting('meeting-chat')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 transition-colors"
                title="Start Video Meeting"
              >
                <Video className="w-4 h-4 text-campus-blue" />
              </button>
            </div>
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
                      ? 'bg-campus-blue text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9.5px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                  {msg.time}
                  {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-campus-blue" />}
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
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-campus-blue"
            />
            <button
              type="submit"
              className="campus-btn-primary p-2.5 rounded-xl shadow-xs shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};
