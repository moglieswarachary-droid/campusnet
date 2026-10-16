import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, MapPin, Users, Award, ArrowRight, 
  ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';

export const HackathonsSection: React.FC = () => {
  const { events, setActiveTab, setSelectedEventId } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-campus-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="campus-badge-govt">
                <ShieldAlert className="w-3.5 h-3.5" />
                Verified Competitions & Hackathons
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-campus-deep-blue">
              National & University Innovation Challenges
            </h2>
            <p className="text-sm text-campus-muted-text mt-1 max-w-xl">
              Distinguishing Government Challenges, University Fests, and Research Symposiums with verified GPS attendance & QR certification.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('events')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-campus-blue hover:text-campus-deep-blue"
          >
            View All {events.length} Hackathons
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map(event => (
            <div 
              key={event.id}
              className="bg-white rounded-3xl border border-campus-border shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Event Image Banner */}
              <div className="h-44 relative overflow-hidden bg-campus-deep-blue">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Event Type Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                    event.organizerType === 'government'
                      ? 'bg-green-600 text-white'
                      : event.organizerType === 'research'
                      ? 'bg-purple-600 text-white'
                      : 'bg-campus-blue text-white'
                  }`}>
                    {event.eventType}
                  </span>
                  
                  <span className="text-[11px] font-bold bg-white/90 text-campus-slate-text px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {event.mode}
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <div className="text-xs text-amber-300 font-semibold">{event.organizer}</div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-campus-deep-blue group-hover:text-campus-blue transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-xs text-campus-muted-text mt-2 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-campus-border text-xs text-campus-slate-text">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-campus-blue flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-campus-red flex-shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5 font-semibold text-campus-muted-text">
                      <Users className="w-4 h-4 text-campus-blue" />
                      {event.registeredTeamsCount} Teams Registered
                    </span>
                    <span className="font-bold text-campus-red bg-red-50 px-2 py-0.5 rounded-lg">
                      {event.prizes[0]?.amount}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setActiveTab('events');
                    }}
                    className="w-full campus-btn-primary text-xs py-2.5 rounded-xl"
                  >
                    View Details & Attendance Portal
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
