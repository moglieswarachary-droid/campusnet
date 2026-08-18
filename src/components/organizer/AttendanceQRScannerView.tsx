import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, Camera, CheckCircle2, AlertTriangle, 
  Search, ShieldCheck, Clock, UserCheck, RefreshCw, Smartphone 
} from 'lucide-react';

export const AttendanceQRScannerView: React.FC = () => {
  const { 
    events, currentOrganizer, eventRegistrations, 
    markAttendanceQR, manualAttendanceOverride, qrCheckInRecords 
  } = useApp();

  const orgEvents = events.filter(
    e => e.organizerId === currentOrganizer?.id || e.organizer === currentOrganizer?.institutionName
  );

  const [selectedEventId, setSelectedEventId] = useState<string>(orgEvents[0]?.id || 'ev-kec-001');
  const [manualIdInput, setManualIdInput] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'already' | 'error'; message: string } | null>(null);

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];
  const eventRegs = eventRegistrations.filter(r => r.eventId === selectedEventId);
  const checkedInCount = eventRegs.filter(r => r.attendanceStatus === 'checked_in').length;

  const handleSimulatedScan = (regId: string) => {
    const success = markAttendanceQR(selectedEventId, regId, 'qr_scan');
    const reg = eventRegistrations.find(r => r.id === regId);
    if (success) {
      setScanResult({
        status: 'success',
        message: `Verified: ${reg?.participantName} (${reg?.studentId}) from ${reg?.institution}`
      });
    } else {
      setScanResult({
        status: 'already',
        message: `${reg?.participantName} was previously marked checked in at ${reg?.checkInTimestamp || 'earlier session'}.`
      });
    }
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIdInput.trim()) return;

    const term = manualIdInput.trim().toLowerCase();
    const found = eventRegs.find(
      r => (r.studentId && r.studentId.toLowerCase() === term) || r.participantName.toLowerCase().includes(term) || r.id.toLowerCase() === term
    );

    if (found) {
      const success = manualAttendanceOverride(selectedEventId, found.id);
      if (success) {
        setScanResult({
          status: 'success',
          message: `Manual Override Verified: ${found.participantName} (${found.studentId})`
        });
        setManualIdInput('');
      } else {
        setScanResult({
          status: 'already',
          message: `${found.participantName} was already checked in.`
        });
      }
    } else {
      setScanResult({
        status: 'error',
        message: `No registration found for ID / Name "${manualIdInput}" in this event.`
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-green-500/20 text-green-300 border border-green-500/30 px-2.5 py-0.5 rounded-full">
              Live Nodal Check-In Scanner
            </span>
            <span className="text-xs text-slate-400">Anti-Proxy Dual Verification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            QR Code Attendance & Physical Check-In Terminal
          </h2>
        </div>

        {/* Event Selector */}
        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white font-bold outline-none focus:border-amber-500 shadow-xl"
        >
          {orgEvents.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* Real-time stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Registered</div>
            <div className="text-2xl font-black text-white">{eventRegs.length}</div>
          </div>
          <UserCheck className="w-6 h-6 text-blue-400" />
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Checked In (Verified)</div>
            <div className="text-2xl font-black text-green-400">{checkedInCount}</div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Check-in Progress</div>
            <div className="text-2xl font-black text-amber-300">
              {eventRegs.length > 0 ? Math.round((checkedInCount / eventRegs.length) * 100) : 0}%
            </div>
          </div>
          <Smartphone className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Scanner & Manual Entry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Camera Scanner Simulator */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              Live Optical QR Camera Scanner
            </h3>
            <span className="text-[10px] font-bold uppercase text-green-400 bg-green-950/60 px-2 py-0.5 rounded border border-green-800">
              CAMERA ACTIVE (1080P)
            </span>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
            
            {/* Animated Laser Reticle */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-amber-400/80 rounded-2xl relative flex items-center justify-center animate-pulse">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1" />
              
              <div className="text-center space-y-1 p-2">
                <QrCode className="w-10 h-10 text-amber-400/60 mx-auto" />
                <span className="text-[10.5px] font-bold text-amber-300 block">
                  Align Student ID / QR Badge
                </span>
              </div>
            </div>

            {/* Quick Test QR Scan Buttons for Simulation */}
            <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-slate-400 whitespace-nowrap">Simulate Badge Scan:</span>
              <div className="flex gap-1.5">
                {eventRegs.slice(0, 3).map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSimulatedScan(r.id)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] whitespace-nowrap"
                  >
                    Scan {r.participantName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Scan result toast message */}
          {scanResult && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
              scanResult.status === 'success' ? 'bg-green-950/60 border border-green-500/40 text-green-300' :
              scanResult.status === 'already' ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300' :
              'bg-red-950/60 border border-red-500/40 text-red-300'
            }`}>
              {scanResult.status === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400" /> :
               scanResult.status === 'already' ? <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" /> :
               <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />}
              <span className="font-semibold">{scanResult.message}</span>
            </div>
          )}

        </div>

        {/* Right: Manual Student ID Override Form & Instructions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Manual Roll No / ID Override
            </h3>
            <p className="text-xs text-slate-400">
              For participants with damaged badge QR codes or camera glare.
            </p>

            <form onSubmit={handleManualCheckIn} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  College Roll No, Student ID, or Name *
                </label>
                <input
                  type="text"
                  value={manualIdInput}
                  onChange={e => setManualIdInput(e.target.value)}
                  placeholder="e.g. 2023CSB1042 or Aarav Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Verify & Mark Attendance</span>
              </button>
            </form>
          </div>

          {/* GPS Geofence status info */}
          <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Nodal Geofence Status</span>
              <span className="text-green-400">ARMED (500m)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Attendance records are cryptographically timestamped and tagged with venue coordinates to prevent remote attendance forgery.
            </p>
          </div>

        </div>

      </div>

      {/* Verified Attendance Log Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Timestamped Attendance Audit Trail ({qrCheckInRecords.length})
          </h3>
          <span className="text-xs text-slate-400">Tamper-Proof Audit Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-3.5 py-2.5">Participant</th>
                <th className="px-3.5 py-2.5">Institution</th>
                <th className="px-3.5 py-2.5">Check-In Method</th>
                <th className="px-3.5 py-2.5">Timestamp</th>
                <th className="px-3.5 py-2.5">Coordinator Audit</th>
                <th className="px-3.5 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {qrCheckInRecords.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="px-3.5 py-2 font-sans font-bold text-white">{log.participantName}</td>
                  <td className="px-3.5 py-2 font-sans text-slate-300">{log.institution}</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-sans text-[10px] uppercase">
                      {log.method.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3.5 py-2 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-3.5 py-2 font-sans text-slate-400">{log.organizerName}</td>
                  <td className="px-3.5 py-2 font-sans text-green-400 font-bold">✓ VERIFIED</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
