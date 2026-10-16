import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MessageSquare, Send, User, Search, Paperclip, Video } from 'lucide-react';

export const ResearcherMessagesView: React.FC = () => {
  const { addToast, startVideoMeeting } = useApp();
  const [activePartner, setActivePartner] = useState('Dr. Arvind Rao');
  const [inputText, setInputText] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      name: 'Dr. Arvind Rao',
      institution: 'IIT Bombay',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'Let us schedule a quick sync for the FPGA testbed results tomorrow.',
      time: '10:30 AM',
      unread: 1,
      messages: [
        { sender: 'Dr. Arvind Rao', text: 'Kavya, did the preliminary TensorRT benchmarks on the Jetson Orin finish?', time: '10:15 AM' },
        { sender: 'You', text: 'Yes, Dr. Rao! We observed a 3.4x speedup with INT8 quantization without accuracy degradation on the NAEV-26 dataset.', time: '10:25 AM' },
        { sender: 'Dr. Arvind Rao', text: 'Excellent. Let us schedule a quick sync for the FPGA testbed results tomorrow.', time: '10:30 AM' }
      ]
    },
    {
      id: 'conv-2',
      name: 'Aarav Sharma (RA)',
      institution: 'NIT Karnataka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      lastMessage: 'I pushed the latest ROS 2 telemetry node scripts to the shared repository.',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { sender: 'You', text: 'Aarav, please ensure the ROS 2 message definitions are backwards compatible with Humble.', time: 'Yesterday 2:10 PM' },
        { sender: 'Aarav Sharma (RA)', text: 'I pushed the latest ROS 2 telemetry node scripts to the shared repository.', time: 'Yesterday 4:45 PM' }
      ]
    }
  ]);

  const activeConv = conversations.find(c => c.name === activePartner) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'You',
      text: inputText.trim(),
      time: 'Just now'
    };

    setConversations(prev => prev.map(c => {
      if (c.name === activePartner) {
        return {
          ...c,
          lastMessage: inputText.trim(),
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
              Research Messages & Directives
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Encrypted academic communication with co-authors, faculty research advisors, and laboratory assistants
            </p>
          </div>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
        
        {/* Left Contacts List */}
        <div className="border-r border-slate-200/90 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-[#F4F6FA]/50">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Research Collaborators</h4>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActivePartner(conv.name)}
                className={`w-full text-left p-4 transition-all flex items-start gap-3 ${
                  activePartner === conv.name ? 'bg-purple-50/70 border-l-4 border-[#6954C8]' : 'hover:bg-slate-50'
                }`}
              >
                <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#182442]">
                    <span className="truncate">{conv.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{conv.institution}</p>
                  <p className="text-xs text-slate-600 truncate mt-1">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className="md:col-span-2 flex flex-col justify-between bg-[#F4F6FA]/30">
          
          {/* Active Partner Header */}
          <div className="p-4 bg-white border-b border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeConv.avatar} alt={activeConv.name} className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h3 className="text-xs font-bold text-[#182442]">{activeConv.name}</h3>
                <p className="text-[10px] text-slate-400">{activeConv.institution}</p>
              </div>
            </div>

            <button
              onClick={() => startVideoMeeting(activeConv.id)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6954C8] text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Launch Sync</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {activeConv.messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-0.5">{m.sender} • {m.time}</span>
                <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                  m.sender === 'You'
                    ? 'bg-[#6954C8] text-white rounded-tr-xs shadow-2xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200/90 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${activeConv.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#6954C8] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
