import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Send, Paperclip, MessageSquare, ShieldCheck, 
  GraduationCap, Sparkles, Check, CheckCheck, Smile 
} from 'lucide-react';
import { User, Mentor, Researcher, DirectMessage } from '../../types';

export const DirectMessagingModal: React.FC = () => {
  const { 
    isDirectMessagingOpen, setIsDirectMessagingOpen, 
    activeMessagingPartner, setActiveMessagingPartner, 
    directMessages, sendDirectMessage, currentUser, 
    students, mentors, researchers 
  } = useApp();

  const [messageText, setMessageText] = useState('');

  if (!isDirectMessagingOpen) return null;

  // Potential conversation partners
  const contactList: (User | Mentor | Researcher)[] = [
    ...mentors,
    ...students.filter(s => s.id !== currentUser.id),
    ...researchers
  ];

  const currentPartner = activeMessagingPartner || contactList[0];

  // Messages between current user and active partner
  const conversationMessages = directMessages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === currentPartner.id) ||
         (m.senderId === currentPartner.id && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendDirectMessage(currentPartner.id, currentPartner.name, messageText);
    setMessageText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[620px] shadow-warm-xl border border-campus-border overflow-hidden flex flex-col md:flex-row my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left: Contacts List */}
        <div className="w-full md:w-72 border-r border-campus-border flex flex-col bg-slate-50">
          <div className="p-4 border-b border-campus-border flex items-center justify-between">
            <h3 className="font-black text-sm text-campus-deep-blue flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-campus-blue" />
              CampusNet Messages
            </h3>
            <span className="text-[10px] font-bold bg-campus-soft-blue text-campus-blue px-2 py-0.5 rounded-full">
              Encrypted
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-campus-border/60">
            {contactList.map(contact => {
              const isSelected = contact.id === currentPartner.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => setActiveMessagingPartner(contact)}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                    isSelected ? 'bg-white shadow-warm-sm border-l-4 border-campus-blue' : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-campus-border"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-campus-slate-text truncate">{contact.name}</h4>
                    </div>
                    <p className="text-[10.5px] text-campus-muted-text truncate mt-0.5">
                      {'title' in contact ? contact.title : 'institution' in contact ? contact.institution : 'Student'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-campus-border flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img
                src={currentPartner.avatar}
                alt={currentPartner.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-campus-border"
              />
              <div>
                <h4 className="text-sm font-bold text-campus-deep-blue flex items-center gap-1.5">
                  {currentPartner.name}
                  {'verifiedMentor' in currentPartner && currentPartner.verifiedMentor && (
                    <span className="campus-badge-verified text-[9px] py-0.5 px-1.5">
                      ✓ Mentor
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-campus-muted-text truncate max-w-xs">
                  {'institution' in currentPartner ? currentPartner.institution : 'CampusNet Peer'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDirectMessagingOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-campus-muted-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-campus-warm-white/40">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <div className="w-12 h-12 rounded-full bg-campus-soft-blue text-campus-blue flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h5 className="text-xs font-bold text-campus-deep-blue">Start a Conversation</h5>
                <p className="text-[11px] text-campus-muted-text max-w-xs mx-auto">
                  Send a project collaboration request or ask academic mentoring questions on CampusNet.
                </p>
              </div>
            ) : (
              conversationMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-campus-border"
                      />
                    )}

                    <div
                      className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                        isMe
                          ? 'bg-campus-deep-blue text-white rounded-br-none shadow-warm-sm'
                          : 'bg-white text-campus-slate-text border border-campus-border rounded-bl-none shadow-warm-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`text-[9px] flex items-center justify-end gap-1 ${isMe ? 'text-blue-200' : 'text-campus-muted-text'}`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-campus-border bg-white flex items-center gap-2">
            <input
              type="text"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder={`Message ${currentPartner.name.split(' ')[0]}...`}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-campus-warm-white rounded-xl border border-campus-border focus:border-campus-blue outline-none"
            />
            <button
              type="submit"
              className="campus-btn-primary p-2.5 rounded-xl shadow-warm-sm"
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
