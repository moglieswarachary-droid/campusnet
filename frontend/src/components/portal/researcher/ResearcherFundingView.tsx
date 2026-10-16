import React from 'react';
import { Coins, Search, ExternalLink, Calendar, Award, CheckCircle2, DollarSign } from 'lucide-react';

export const ResearcherFundingView: React.FC = () => {
  const grants = [
    {
      id: 'g-1',
      agency: 'Science and Engineering Research Board (SERB)',
      scheme: 'Core Research Grant (CRG)',
      amount: 'Up to ₹60,00,000 for 3 years',
      eligibility: 'PhD holders, Regular faculty & recognized doctoral scholars with PI support',
      deadline: 'November 30, 2026',
      status: 'Open for Application',
      link: 'https://serbonline.in'
    },
    {
      id: 'g-2',
      agency: 'Department of Science and Technology (DST)',
      scheme: 'National Quantum Mission (NQM) Exploratory Call',
      amount: 'Up to ₹1,20,00,000 for Consortia',
      eligibility: 'Thematic research groups in Quantum computing, communication, and metrology',
      deadline: 'December 15, 2026',
      status: 'Call Open',
      link: 'https://dst.gov.in'
    },
    {
      id: 'g-3',
      agency: 'European Commission (Horizon Europe)',
      scheme: 'Marie Skłodowska-Curie Actions (MSCA) Postdoctoral Fellowships',
      amount: '€5,080/month + Mobility allowance',
      eligibility: 'Doctoral researchers moving within or into Europe for advanced research',
      deadline: 'January 20, 2027',
      status: 'Upcoming Cycle',
      link: 'https://marie-sklodowska-curie-actions.ec.europa.eu'
    }
  ];

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6954C8] flex items-center justify-center shrink-0 border border-purple-200/70 shadow-2xs">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#182442]">
              Research Grants & International Funding
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              National competitive research grants, travel awards, and international postdoctoral fellowships
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {grants.map(grant => (
          <div
            key={grant.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-[#E9A23B] border border-amber-200">
                  {grant.agency}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#182442] mt-1.5">{grant.scheme}</h3>
                <p className="text-sm font-black text-[#13877B] mt-0.5">{grant.amount}</p>
              </div>

              <a
                href={grant.link}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#6954C8] hover:bg-[#5642B5] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 self-start"
              >
                <span>Official Scheme Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-600 bg-[#F4F6FA] p-3 rounded-xl border border-slate-200/60">
              Eligibility: <strong>{grant.eligibility}</strong>
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Status: <strong className="text-emerald-700">{grant.status}</strong></span>
              <span className="font-bold text-[#182442]">Submission Due: {grant.deadline}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
