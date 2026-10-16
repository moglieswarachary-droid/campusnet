import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen, Calendar, Clock, CheckCircle2, AlertTriangle,
  GraduationCap, FileText, Download, ExternalLink, RefreshCw,
  Award, ShieldCheck, ChevronRight, Filter, Info, MapPin,
  UserCheck, AlertCircle, Sparkles, BookMarked
} from 'lucide-react';

export const StudentAcademicsView: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'timetable' | 'attendance' | 'assignments' | 'exams' | 'grades'>('timetable');
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Mon');

  // Timetable dataset
  const weeklyTimetable: Record<string, Array<{ time: string; course: string; code: string; room: string; faculty: string; type: 'Lecture' | 'Lab' | 'Tutorial' }>> = {
    Mon: [
      { time: '09:00 - 10:00 AM', course: 'Deep Learning & Neural Architectures', code: 'CS401', room: 'LH-302', faculty: 'Dr. Arvind Rao', type: 'Lecture' },
      { time: '10:15 - 11:15 AM', course: 'Distributed Systems & Cloud Computing', code: 'CS405', room: 'LH-201', faculty: 'Prof. Sudhir Sen', type: 'Lecture' },
      { time: '11:30 - 01:00 PM', course: 'Computer Vision & Robotics Lab', code: 'CS408L', room: 'Robotics Lab 2', faculty: 'Dr. Radhika Sen', type: 'Lab' },
      { time: '02:00 - 03:00 PM', course: 'Algorithm Design & Complexity', code: 'CS403', room: 'LH-104', faculty: 'Dr. K. Rajeshwar', type: 'Lecture' },
      { time: '03:15 - 04:15 PM', course: 'Capstone Project Colloquium', code: 'CS499', room: 'Seminar Hall A', faculty: 'Faculty Committee', type: 'Tutorial' }
    ],
    Tue: [
      { time: '09:00 - 10:00 AM', course: 'Embedded Firmware & RTOS', code: 'CS412', room: 'LH-105', faculty: 'Dr. Priya Sundaram', type: 'Lecture' },
      { time: '10:15 - 11:15 AM', course: 'Deep Learning & Neural Architectures', code: 'CS401', room: 'LH-302', faculty: 'Dr. Arvind Rao', type: 'Lecture' },
      { time: '11:30 - 12:30 PM', course: 'Natural Language Processing', code: 'CS415', room: 'LH-204', faculty: 'Dr. Meera Iyer', type: 'Lecture' },
      { time: '02:00 - 04:00 PM', course: 'Deep Learning Practical Lab', code: 'CS401L', room: 'GPU Lab 4', faculty: 'Dr. Arvind Rao', type: 'Lab' }
    ],
    Wed: [
      { time: '09:00 - 10:00 AM', course: 'Distributed Systems & Cloud Computing', code: 'CS405', room: 'LH-201', faculty: 'Prof. Sudhir Sen', type: 'Lecture' },
      { time: '10:15 - 11:15 AM', course: 'Algorithm Design & Complexity', code: 'CS403', room: 'LH-104', faculty: 'Dr. K. Rajeshwar', type: 'Lecture' },
      { time: '11:30 - 01:00 PM', course: 'Embedded Systems Testing Lab', code: 'CS412L', room: 'IoT Lab 1', faculty: 'Dr. Priya Sundaram', type: 'Lab' },
      { time: '02:00 - 03:00 PM', course: 'Open Innovation Mentorship Sprint', code: 'CS498', room: 'Incubation Center', faculty: 'Industry Mentors', type: 'Tutorial' }
    ],
    Thu: [
      { time: '09:00 - 10:00 AM', course: 'Natural Language Processing', code: 'CS415', room: 'LH-204', faculty: 'Dr. Meera Iyer', type: 'Lecture' },
      { time: '10:15 - 11:15 AM', course: 'Deep Learning & Neural Architectures', code: 'CS401', room: 'LH-302', faculty: 'Dr. Arvind Rao', type: 'Lecture' },
      { time: '11:30 - 12:30 PM', course: 'Distributed Systems & Cloud Computing', code: 'CS405', room: 'LH-201', faculty: 'Prof. Sudhir Sen', type: 'Lecture' },
      { time: '02:00 - 04:00 PM', course: 'Autonomous Systems Flight Lab', code: 'CS420L', room: 'Outdoor Arena', faculty: 'Dr. Radhika Sen', type: 'Lab' }
    ],
    Fri: [
      { time: '09:00 - 10:00 AM', course: 'Algorithm Design & Complexity', code: 'CS403', room: 'LH-104', faculty: 'Dr. K. Rajeshwar', type: 'Lecture' },
      { time: '10:15 - 11:15 AM', course: 'Embedded Firmware & RTOS', code: 'CS412', room: 'LH-105', faculty: 'Dr. Priya Sundaram', type: 'Lecture' },
      { time: '11:30 - 12:30 PM', course: 'Tech Ethics & Research Methodology', code: 'HU401', room: 'LH-101', faculty: 'Prof. Ananya Roy', type: 'Lecture' },
      { time: '02:00 - 04:30 PM', course: 'Hackathon & Innovation Lab Work', code: 'INNOV-4', room: 'Makerspace A', faculty: 'Project Leads', type: 'Lab' }
    ]
  };

  // Subject-wise Attendance dataset
  const attendanceList = [
    { code: 'CS401', subject: 'Deep Learning & Neural Architectures', attended: 38, total: 42, minRequired: 75, faculty: 'Dr. Arvind Rao' },
    { code: 'CS405', subject: 'Distributed Systems & Cloud Computing', attended: 35, total: 40, minRequired: 75, faculty: 'Prof. Sudhir Sen' },
    { code: 'CS403', subject: 'Algorithm Design & Complexity', attended: 36, total: 39, minRequired: 75, faculty: 'Dr. K. Rajeshwar' },
    { code: 'CS412', subject: 'Embedded Firmware & RTOS', attended: 29, total: 38, minRequired: 75, faculty: 'Dr. Priya Sundaram' },
    { code: 'CS408L', subject: 'Computer Vision & Robotics Lab', attended: 18, total: 18, minRequired: 75, faculty: 'Dr. Radhika Sen' },
    { code: 'CS415', subject: 'Natural Language Processing', attended: 32, total: 36, minRequired: 75, faculty: 'Dr. Meera Iyer' },
  ];

  // Calculate overall attendance
  const totalAttended = attendanceList.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = attendanceList.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = Math.round((totalAttended / totalClasses) * 100);

  // Assignments dataset
  const assignmentsList = [
    {
      id: 'asg-01',
      title: 'ResNet-50 Custom Convolutional Layer Backprop',
      course: 'CS401 • Deep Learning',
      dueDate: 'April 22, 2026',
      status: 'Pending',
      maxMarks: 50,
      priority: 'High',
      link: 'https://classroom.campusnet-demo.in/cs401/a3'
    },
    {
      id: 'asg-02',
      title: 'Raft Consensus Protocol Leader Election Implementation',
      course: 'CS405 • Distributed Systems',
      dueDate: 'April 26, 2026',
      status: 'In Progress',
      maxMarks: 100,
      priority: 'Medium',
      link: 'https://classroom.campusnet-demo.in/cs405/a2'
    },
    {
      id: 'asg-03',
      title: 'RTOS Task Preemption & Priority Inversion Analysis',
      course: 'CS412 • Embedded Firmware',
      dueDate: 'April 29, 2026',
      status: 'Pending',
      maxMarks: 40,
      priority: 'Medium',
      link: 'https://classroom.campusnet-demo.in/cs412/a4'
    },
    {
      id: 'asg-04',
      title: 'Graph Traversal & Maximum Flow Network Sim',
      course: 'CS403 • Algorithms',
      dueDate: 'April 14, 2026',
      status: 'Submitted',
      maxMarks: 50,
      score: '48/50',
      priority: 'Low',
      link: 'https://classroom.campusnet-demo.in/cs403/a1'
    }
  ];

  // Examination schedule
  const examSchedule = [
    { code: 'CS401', course: 'Deep Learning & Neural Architectures', date: 'May 12, 2026', time: '09:30 AM - 12:30 PM', room: 'Exam Hall B-1', seat: 'Row 3, Seat 14' },
    { code: 'CS405', course: 'Distributed Systems & Cloud Computing', date: 'May 15, 2026', time: '09:30 AM - 12:30 PM', room: 'Exam Hall B-2', seat: 'Row 2, Seat 08' },
    { code: 'CS403', course: 'Algorithm Design & Complexity', date: 'May 18, 2026', time: '09:30 AM - 12:30 PM', room: 'Exam Hall A-1', seat: 'Row 5, Seat 22' },
    { code: 'CS412', course: 'Embedded Firmware & RTOS', date: 'May 21, 2026', time: '09:30 AM - 12:30 PM', room: 'Exam Hall C-1', seat: 'Row 1, Seat 05' },
    { code: 'CS415', course: 'Natural Language Processing', date: 'May 25, 2026', time: '09:30 AM - 12:30 PM', room: 'Exam Hall B-3', seat: 'Row 4, Seat 19' },
  ];

  // Semester GPA history
  const semesterHistory = [
    { sem: 'Sem 1', sgpa: 8.65, credits: 24, status: 'Passed' },
    { sem: 'Sem 2', sgpa: 8.80, credits: 24, status: 'Passed' },
    { sem: 'Sem 3', sgpa: 8.55, credits: 26, status: 'Passed' },
    { sem: 'Sem 4', sgpa: 8.90, credits: 26, status: 'Passed' },
    { sem: 'Sem 5', sgpa: 8.70, credits: 24, status: 'Passed' },
    { sem: 'Sem 6 (Current)', sgpa: 8.78, credits: 22, status: 'In Progress' },
  ];

  const handleSyncSIS = () => {
    addToast({
      type: 'success',
      message: 'Synchronized with CampusNet SIS Academic Gateway. Timetable & attendance verified.'
    });
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-campus-blue flex items-center justify-center shrink-0 border border-blue-200/70 shadow-2xs">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-campus-deep-blue">
                Academic Success Center
              </h1>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                SIS Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              B.Tech Computer Science & Engineering (Year 3, Semester 6) • Roll No: {(currentUser as any)?.rollNumber || '22CS1048'}
            </p>
          </div>
        </div>

        {/* Sync Status Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncSIS}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-campus-blue" />
            <span>Sync SIS Portal</span>
          </button>
          <a
            href="https://lms.campusnet-demo.in"
            target="_blank"
            rel="noopener noreferrer"
            className="campus-btn-primary text-xs py-2 px-3.5 rounded-xl shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Institutional LMS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Institutional Integration Boundary Banner */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-campus-blue shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-campus-deep-blue">
              Official Academic Integration Boundary: CampusNet SIS Bridge v2.4
            </p>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Attendance records and course registrations reflect verified institutional registrar data. All official grade sheet revisions require physical controller approval.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shrink-0 hidden sm:inline-block">
          Sync: Active (08:30 AM)
        </span>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Overall CGPA
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-campus-deep-blue">8.72</span>
            <span className="text-xs font-bold text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">First Class with Distinction</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Total Attendance
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-black ${overallPercentage >= 75 ? 'text-emerald-700' : 'text-amber-600'}`}>
              {overallPercentage}%
            </span>
            <span className="text-xs font-bold text-slate-400">({totalAttended}/{totalClasses})</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-1">Safe (&gt;75% threshold)</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Pending Submissions
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-campus-blue">
              {assignmentsList.filter(a => a.status !== 'Submitted').length}
            </span>
            <span className="text-xs font-bold text-slate-400">Assignments</span>
          </div>
          <p className="text-[10px] text-amber-600 font-bold mt-1">Next due in 6 days</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Total Credits Earned
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-campus-deep-blue">124</span>
            <span className="text-xs font-bold text-slate-400">/ 160</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-1">22 credits in progress</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: 'timetable', label: 'Class Timetable', icon: Calendar },
          { key: 'attendance', label: 'Subject Attendance', icon: UserCheck },
          { key: 'assignments', label: 'Assignments & Deadlines', icon: FileText },
          { key: 'exams', label: 'Exam Schedule', icon: AlertCircle },
          { key: 'grades', label: 'Grades & CGPA History', icon: Award },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-campus-blue text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex items-center gap-2">
            {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const).map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : 'Friday'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {weeklyTimetable[selectedDay].map((slot, index) => (
              <div key={index} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-28 text-xs font-bold text-slate-500 flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-campus-blue" />
                    <span>{slot.time}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {slot.code}
                      </span>
                      <h4 className="text-sm font-bold text-campus-deep-blue">{slot.course}</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        slot.type === 'Lab' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {slot.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {slot.room}
                      </span>
                      <span>Faculty: <strong>{slot.faculty}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href="https://lms.campusnet-demo.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <BookMarked className="w-3.5 h-3.5 text-slate-400" />
                    <span>Course Materials</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-campus-deep-blue">Biometric & Classroom Attendance Roster</h3>
                <p className="text-[11px] text-slate-500">Minimum mandatory attendance requirement is 75% per course as per university ordinance.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Healthy Standing
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {attendanceList.map(item => {
                const pct = Math.round((item.attended / item.total) * 100);
                const isWarning = pct < 75;
                const isClose = pct >= 75 && pct < 80;

                return (
                  <div key={item.code} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                        <h4 className="text-sm font-bold text-campus-deep-blue">{item.subject}</h4>
                      </div>
                      <p className="text-xs text-slate-500">Faculty Instructor: {item.faculty}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Classes Attended</span>
                        <span className="text-sm font-extrabold text-slate-800">{item.attended} / {item.total}</span>
                      </div>

                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className={isWarning ? 'text-red-600' : isClose ? 'text-amber-600' : 'text-emerald-700'}>
                            {pct}%
                          </span>
                          <span className="text-[10px] text-slate-400">Min 75%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isWarning ? 'bg-red-500' : isClose ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="w-24 text-right">
                        {isWarning ? (
                          <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Shortage Warning
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Eligible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignmentsList.map(asg => (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">{asg.course}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      asg.status === 'Submitted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : asg.priority === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {asg.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-campus-deep-blue mt-2">{asg.title}</h4>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Due: <strong>{asg.dueDate}</strong>
                    </span>
                    <span>Max Marks: {asg.maxMarks}</span>
                    {asg.score && (
                      <span className="font-bold text-emerald-700">Graded: {asg.score}</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Submission via CampusNet LMS</span>
                  <button
                    onClick={() => addToast({ type: 'info', message: `Redirecting to upload portal for ${asg.title}` })}
                    className="campus-btn-primary text-xs py-1.5 px-3 rounded-xl"
                  >
                    {asg.status === 'Submitted' ? 'Review Submission' : 'Upload Submission'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXAMS */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70">
            <h3 className="text-sm font-bold text-campus-deep-blue">Semester 6 End-Term Examination Schedule</h3>
            <p className="text-[11px] text-slate-500">Carry your university photo identity card and verified digital hall ticket to all sessions.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {examSchedule.map((exam, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {exam.code}
                    </span>
                    <h4 className="text-sm font-bold text-campus-deep-blue">{exam.course}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-campus-blue">{exam.date}</span>
                    <span>{exam.time}</span>
                    <span>Venue: <strong>{exam.room}</strong></span>
                    <span>Seating: <strong>{exam.seat}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => addToast({ type: 'success', message: `Hall ticket downloaded for ${exam.code}` })}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5 text-campus-blue" />
                  <span>Hall Ticket</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GRADES & CGPA */}
      {activeTab === 'grades' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-campus-deep-blue">Academic Grade History & Credit Ledger</h3>
                <p className="text-[11px] text-slate-500">Official grades confirmed by the Controller of Examinations.</p>
              </div>
              <span className="text-xs font-black text-campus-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Cumulative CGPA: 8.72
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5 pl-6">Semester</th>
                    <th className="p-3.5">SGPA</th>
                    <th className="p-3.5">Credits Completed</th>
                    <th className="p-3.5">Academic Status</th>
                    <th className="p-3.5 pr-6 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {semesterHistory.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 pl-6 font-bold text-campus-deep-blue">{s.sem}</td>
                      <td className="p-3.5 font-extrabold text-slate-800">{s.sgpa}</td>
                      <td className="p-3.5 text-slate-600">{s.credits} Credits</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          s.status === 'Passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <span className="text-[11px] text-slate-400 font-mono">
                          REG-{2023 + idx}-VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Authorized Institutional Learning Resources */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Authorized Institutional Learning Resources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://swayam.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-campus-blue hover:bg-blue-50/40 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-campus-blue">NPTEL / SWAYAM MOOCs</p>
              <p className="text-[10px] text-slate-500">Credit transfer approved courses</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-campus-blue" />
          </a>

          <a
            href="https://ieeexplore.ieee.org"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-campus-blue hover:bg-blue-50/40 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-campus-blue">IEEE Xplore Digital Library</p>
              <p className="text-[10px] text-slate-500">Institutional campus IP access</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-campus-blue" />
          </a>

          <a
            href="https://ndl.iitkgp.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-campus-blue hover:bg-blue-50/40 transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-campus-blue">National Digital Library</p>
              <p className="text-[10px] text-slate-500">Government research repository</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-campus-blue" />
          </a>
        </div>
      </div>

    </div>
  );
};
