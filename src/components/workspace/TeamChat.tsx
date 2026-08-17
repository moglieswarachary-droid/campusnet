import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Paperclip, FileText, Image, ShieldCheck, Sparkles } from 'lucide-react';

export const TeamChat: React.FC<{ teamId: string }> = ({ teamId }) => {
  const { chatMessages, sendChatMessage, currentUser } = useApp();
  const [inputText, setInputText] = useState('');

  const teamMessages = chatMessages.filter(m => m.teamId === teamId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(teamId, inputText);
    setInputText('');
  };

  const handleSimulateAttachment = () => {
    sendChatMessage(teamId, 'Shared schematic update:', {
      name: 'ESP32_LoRa_PCB_Schematic_v2.pdf',
      size: '2.4 MB',
      type: 'PDF'
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-campus-border shadow-warm-md flex flex-col h-[560px] overflow-hidden">
      
      {/* Chat Top Banner */}
      <div className="px-6 py-4 border-b border-campus-border bg-campus-warm-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-campus-deep-blue">Private Team & Mentor Channel</h3>
            <span className="campus-badge-verified text-[10px] py-0.5 px-2">
              Encrypted
            </span>
          </div>
          <p className="text-xs text-campus-muted-text mt-0.5">
            Only confirmed 6 team members and assigned mentor have read/write access.
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {teamMessages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          const isMentor = msg.senderRole === 'mentor';
          
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-campus-border mt-0.5 flex-shrink-0"
              />

              <div className={`max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-campus-slate-text">{msg.senderName}</span>
                  {isMentor && (
                    <span className="text-[10px] font-bold bg-red-100 text-campus-red px-1.5 py-0.2 rounded">
                      Mentor
                    </span>
                  )}
                  <span className="text-[10px] text-campus-muted-text">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-warm-sm ${
                    isMe
                      ? 'bg-campus-blue text-white rounded-tr-none'
                      : isMentor
                      ? 'bg-red-50/90 text-campus-slate-text border border-red-200 rounded-tl-none font-medium'
                      : 'bg-campus-warm-white text-campus-slate-text border border-campus-border rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Attachment Card */}
                  {msg.fileAttachment && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white text-campus-slate-text border border-campus-border flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-campus-red" />
                        <span className="font-bold text-xs truncate max-w-[180px]">{msg.fileAttachment.name}</span>
                      </div>
                      <span className="text-[10px] text-campus-muted-text font-semibold">{msg.fileAttachment.size}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-campus-border bg-white flex items-center gap-3">
        <button
          type="button"
          onClick={handleSimulateAttachment}
          className="p-2 rounded-xl text-campus-muted-text hover:text-campus-blue hover:bg-campus-warm-white transition-colors"
          title="Attach PDF / CAD / Code"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Type message to team & mentor..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue focus:ring-1 focus:ring-campus-blue outline-none"
        />

        <button
          type="submit"
          className="p-2.5 rounded-xl bg-campus-blue hover:bg-campus-deep-blue text-white shadow-warm-sm transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
