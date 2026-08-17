import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Video, VideoOff, Mic, MicOff, ScreenShare, PhoneOff, 
  ShieldCheck, Users, MessageSquare, Sparkles, Wifi, 
  Maximize2, Lock, Volume2
} from 'lucide-react';

export const VideoCallModal: React.FC = () => {
  const { 
    videoMeeting, toggleMeetingCam, toggleMeetingMic, 
    toggleMeetingScreenShare, endVideoMeeting, currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'roster' | 'chat'>('roster');
  const [chatInput, setChatInput] = useState('');
  const [inCallMessages, setInCallMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Dr. Arvind Rao (Mentor)', text: 'Can everyone see the TensorRT INT8 calibration graphs?', time: '16:32' },
    { sender: 'Aarav Sharma', text: 'Yes Dr. Rao, FPS latency is holding steady at 23.8ms.', time: '16:33' }
  ]);

  if (!videoMeeting.isActive) return null;

  const handleSendInCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setInCallMessages(prev => [
      ...prev,
      {
        sender: currentUser.name,
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-campus-deep-blue/90 backdrop-blur-xl flex flex-col p-4 sm:p-6 text-white animate-in fade-in">
      
      {/* Top Bar: Authorization verification & Meeting Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-campus-red text-white flex items-center justify-center shadow-glow-red">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-white">{videoMeeting.teamName} — Live Workspace Review</h2>
              <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-400/30">
                <Lock className="w-3 h-3" />
                Server Authorized
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Meeting ID: <span className="font-mono text-amber-300">{videoMeeting.meetingId}</span> • E2E Encrypted WebRTC Session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-400 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <Wifi className="w-3.5 h-3.5" />
            <span>HD Quality (38ms)</span>
          </div>

          <button
            onClick={endVideoMeeting}
            className="px-4 py-2 bg-campus-red hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-glow-red transition-all"
          >
            <PhoneOff className="w-4 h-4" />
            Leave Meeting
          </button>
        </div>
      </div>

      {/* Main Video Meeting Stage & Side Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 py-4 min-h-0">
        
        {/* Left / Center: Video Participants Grid */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-4 overflow-y-auto">
          
          {videoMeeting.isScreenSharing ? (
            /* Screen Share Simulation View */
            <div className="relative flex-1 bg-slate-900 rounded-3xl border border-white/20 p-4 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 border border-white/10 flex items-center gap-2">
                <ScreenShare className="w-4 h-4" />
                <span>Dr. Arvind Rao is sharing: TensorRT_Inference_Benchmark.pdf</span>
              </div>

              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Interactive Edge Model Architecture</h3>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">
                    Live telemetry stream from NVIDIA Jetson Orin Nano connected via USB-C Debugger.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-left text-xs text-green-300 max-w-lg mx-auto">
                    <div>[INF] TensorRT Engine INT8 Layer Graph Loaded</div>
                    <div>[INF] Batch size 1: Average Latency = 23.82ms</div>
                    <div>[INF] Optical flow sync with ROS2 /uav/odometry: OK</div>
                    <div>[INF] Nozzle micro-controller heartbeat: 100% OK</div>
                  </div>
                </div>
              </div>

              {/* Floating mini user camera */}
              <div className="absolute bottom-4 right-4 w-40 h-28 rounded-2xl bg-campus-deep-blue border-2 border-campus-red overflow-hidden shadow-warm-xl">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  You ({currentUser.name.split(' ')[0]})
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Participant Video Tiles Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
              {videoMeeting.participants.map(p => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border flex flex-col justify-between p-3.5 transition-all ${
                    p.isSpeaking ? 'border-campus-bright-red ring-2 ring-campus-bright-red/50' : 'border-white/15'
                  }`}
                >
                  {/* Participant Video Simulation Background */}
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded-full text-white backdrop-blur-sm border border-white/10">
                      {p.role}
                    </span>
                    
                    {p.isSpeaking && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-black/60 px-2 py-0.5 rounded-full">
                        <Volume2 className="w-3 h-3 animate-pulse" />
                        Speaking
                      </span>
                    )}
                  </div>

                  {/* Bottom Info */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white drop-shadow truncate">
                      {p.name}
                    </span>
                    
                    {p.isMuted && (
                      <span className="p-1 rounded-lg bg-campus-red/80 text-white">
                        <MicOff className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Control Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-center gap-3 sm:gap-4">
            
            {/* Cam Toggle */}
            <button
              onClick={toggleMeetingCam}
              className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                videoMeeting.isCamOn 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-campus-red text-white shadow-glow-red'
              }`}
              title="Toggle Camera"
            >
              {videoMeeting.isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              <span className="hidden sm:inline">{videoMeeting.isCamOn ? 'Cam On' : 'Cam Off'}</span>
            </button>

            {/* Mic Toggle */}
            <button
              onClick={toggleMeetingMic}
              className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                videoMeeting.isMicOn 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-campus-red text-white shadow-glow-red'
              }`}
              title="Toggle Microphone"
            >
              {videoMeeting.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              <span className="hidden sm:inline">{videoMeeting.isMicOn ? 'Mic On' : 'Muted'}</span>
            </button>

            {/* Screen Share */}
            <button
              onClick={toggleMeetingScreenShare}
              className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                videoMeeting.isScreenSharing 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Share Screen"
            >
              <ScreenShare className="w-5 h-5" />
              <span className="hidden sm:inline">{videoMeeting.isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
            </button>

            {/* Leave Call */}
            <button
              onClick={endVideoMeeting}
              className="p-3 bg-campus-red hover:bg-red-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-glow-red transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">End Meeting</span>
            </button>
          </div>

        </div>

        {/* Right Side: Participant Roster & In-Meeting Chat */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 flex flex-col overflow-hidden">
          
          {/* Side Tabs */}
          <div className="flex items-center border-b border-white/15">
            <button
              onClick={() => setActiveTab('roster')}
              className={`flex-1 py-3 text-xs font-bold text-center transition-colors ${
                activeTab === 'roster' 
                  ? 'text-amber-300 border-b-2 border-amber-300 bg-white/5' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 inline mr-1" />
              Team Roster ({videoMeeting.participants.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-xs font-bold text-center transition-colors ${
                activeTab === 'chat' 
                  ? 'text-amber-300 border-b-2 border-amber-300 bg-white/5' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
              In-Meeting Chat
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto min-h-0 space-y-3">
            {activeTab === 'roster' ? (
              <div className="space-y-2.5">
                {videoMeeting.participants.map(p => (
                  <div key={p.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/20" />
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-[10.5px] text-gray-400">{p.role}</div>
                      </div>
                    </div>
                    {p.isSpeaking && (
                      <span className="text-[10px] text-green-400 font-bold bg-green-950 px-1.5 py-0.5 rounded">
                        Live
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 flex flex-col justify-between h-full">
                <div className="space-y-2.5 overflow-y-auto">
                  {inCallMessages.map((msg, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-[10.5px] text-amber-300 font-bold">
                        <span>{msg.sender}</span>
                        <span className="text-gray-400 font-normal">{msg.time}</span>
                      </div>
                      <p className="text-gray-200 text-[11.5px] leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendInCallMessage} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Send meeting note..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none"
                  />
                  <button type="submit" className="p-2 bg-campus-blue text-white rounded-xl text-xs font-bold">
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
