import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, ShieldCheck, AlertTriangle, Search, 
  ExternalLink, CheckCircle2, XCircle, Plus, MapPin,
  Upload, Download, Edit3, Trash2, ChevronLeft, ChevronRight,
  FileJson, Check
} from 'lucide-react';
import { InstitutionInfo, OrganizationVerificationStatus, OrganizerAccount } from '../../types';
import { ALL_STATE_AND_UT_NAMES, getDistrictsByStateName } from '../../utils/locationData';
import { sanitizeInput } from '../../utils/validation';
import { ShieldAlert, User, Mail, Phone, FileText, CheckCircle, Clock } from 'lucide-react';

export const SuperAdminInstitutionManager: React.FC = () => {
  const { 
    institutions, verifyInstitution, suspendInstitution, 
    addInstitution, updateInstitution, deleteInstitution,
    importInstitutionsBatch, addToast, organizers, adminReviewOrganizer
  } = useApp();

  const [activeTab, setActiveTab] = useState<'organizers' | 'registry'>('organizers');
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [orgStatusFilter, setOrgStatusFilter] = useState<string>('all');
  const [selectedOrgForReview, setSelectedOrgForReview] = useState<OrganizerAccount | null>(null);
  const [reviewStatusChoice, setReviewStatusChoice] = useState<OrganizationVerificationStatus>('verified');
  const [reviewNotes, setReviewNotes] = useState('');

  // Search, Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<InstitutionInfo>>({
    name: '',
    shortName: '',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    city: '',
    type: 'Engineering College',
    aisheCode: '',
    website: '',
    verified: true
  });

  const availableDistricts = useMemo(() => {
    return getDistrictsByStateName(formData.state || 'Andhra Pradesh');
  }, [formData.state]);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      const matchesSearch = !searchQuery || 
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inst.district && inst.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inst.aisheCode && inst.aisheCode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesState = selectedState === 'All' || inst.state === selectedState;
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'verified' && inst.verified) || 
        (statusFilter === 'pending' && !inst.verified);

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [institutions, searchQuery, selectedState, statusFilter]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage) || 1;
  const paginatedInstitutions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInstitutions.slice(start, start + itemsPerPage);
  }, [filteredInstitutions, currentPage, itemsPerPage]);

  const handleSaveInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      addToast({ type: 'error', title: 'Missing Information', message: 'Institution name and city are required.' });
      return;
    }

    const short = formData.shortName || formData.name.split(' ').map(w => w[0]).join('').substring(0, 5).toUpperCase();

    addInstitution({
      name: sanitizeInput(formData.name),
      shortName: short,
      state: formData.state || 'Andhra Pradesh',
      district: formData.district || availableDistricts[0] || 'General District',
      city: sanitizeInput(formData.city),
      type: formData.type || 'Engineering College',
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
      aisheCode: sanitizeInput(formData.aisheCode || `C-${Math.floor(10000 + Math.random() * 90000)}`),
      website: formData.website?.trim() || undefined,
      verified: formData.verified ?? true,
      studentCount: 0,
      mentorCount: 0,
      eventsCount: 0,
      projectsCount: 0
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      shortName: '',
      state: 'Andhra Pradesh',
      district: 'Chittoor',
      city: '',
      type: 'Engineering College',
      aisheCode: '',
      website: '',
      verified: true
    });
  };

  const handleExecuteImport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        addToast({ type: 'error', title: 'Invalid Format', message: 'JSON must be an array of institution objects.' });
        return;
      }

      const importedList: InstitutionInfo[] = parsed.map((item, idx) => ({
        id: item.id || `inst-import-${Date.now()}-${idx}`,
        name: sanitizeInput(item.name || 'Unnamed Institution'),
        shortName: item.shortName || item.name?.split(' ').map((w: string) => w[0]).join('').substring(0, 5).toUpperCase() || 'INST',
        state: item.state || 'Andhra Pradesh',
        district: item.district || 'General',
        city: item.city || 'City',
        type: item.type || 'Engineering College',
        logo: item.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
        aisheCode: item.aisheCode || `AISHE-${Math.floor(10000 + Math.random() * 90000)}`,
        website: item.website || undefined,
        verified: item.verified ?? true,
        studentCount: item.studentCount || 0,
        mentorCount: item.mentorCount || 0,
        eventsCount: item.eventsCount || 0,
        projectsCount: item.projectsCount || 0
      }));

      importInstitutionsBatch(importedList);
      setShowImportModal(false);
      setImportJsonText('');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'JSON Parse Error',
        message: err.message || 'Failed to parse JSON text.'
      });
    }
  };

  const filteredOrganizers = useMemo(() => {
    return organizers.filter(org => {
      const matchesSearch = !orgSearchQuery || 
        org.institutionName.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
        org.coordinatorName.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
        org.officialEmail.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
        (org.state && org.state.toLowerCase().includes(orgSearchQuery.toLowerCase())) ||
        (org.district && org.district.toLowerCase().includes(orgSearchQuery.toLowerCase()));

      const matchesStatus = orgStatusFilter === 'all' || org.verificationStatus === orgStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [organizers, orgSearchQuery, orgStatusFilter]);

  const pendingOrgCount = organizers.filter(o => o.verificationStatus === 'submitted' || o.verificationStatus === 'under_review').length;

  const getOrgStatusBadge = (status: OrganizationVerificationStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'submitted':
      case 'under_review':
        return 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse';
      case 'additional_info_required':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'rejected':
      case 'suspended':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleOpenReviewModal = (org: OrganizerAccount, defaultStatus: OrganizationVerificationStatus = 'verified') => {
    setSelectedOrgForReview(org);
    setReviewStatusChoice(defaultStatus);
    setReviewNotes(org.verificationNotes || '');
  };

  const handleExecuteOrgReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgForReview) return;
    adminReviewOrganizer(selectedOrgForReview.id, reviewStatusChoice, reviewNotes);
    addToast({
      type: 'success',
      title: 'Verification Status Updated',
      message: `${selectedOrgForReview.institutionName} marked as ${reviewStatusChoice.replace(/_/g, ' ')}.`
    });
    setSelectedOrgForReview(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              Institutional Governance Portal
            </span>
            <span className="text-xs text-slate-400">Total Registered Organizers: {organizers.length}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            College Accreditation & Institution Directory
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {activeTab === 'registry' && (
            <>
              <button
                onClick={() => setShowImportModal(true)}
                className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import JSON</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="campus-btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Institution</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Top Tab Bar: Verification Queue vs Master Registry */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('organizers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'organizers'
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Organization Verification Queue</span>
          {pendingOrgCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'organizers' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950'
            }`}>
              {pendingOrgCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('registry')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'registry'
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>AISHE Master Directory ({institutions.length})</span>
        </button>
      </div>

      {/* TAB 1: ORGANIZER VERIFICATION REVIEWS */}
      {activeTab === 'organizers' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Filter Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orgSearchQuery}
                onChange={e => setOrgSearchQuery(e.target.value)}
                placeholder="Search college, coordinator, email, state..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Statuses' },
                { id: 'submitted', label: 'Submitted' },
                { id: 'under_review', label: 'Under Review' },
                { id: 'additional_info_required', label: 'Info Required' },
                { id: 'verified', label: 'Verified' },
                { id: 'rejected', label: 'Rejected' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setOrgStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    orgStatusFilter === st.id
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Organizers Grid */}
          {filteredOrganizers.length === 0 ? (
            <div className="p-10 bg-slate-950 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-bold text-white">No organizations found matching the filter.</p>
              <p>Check "All Statuses" or register new institutions via the registration wizard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrganizers.map(org => (
                <div
                  key={org.id}
                  className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getOrgStatusBadge(org.verificationStatus)}`}>
                            ● {org.verificationStatus.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          {org.institutionCategory && (
                            <span className="text-[10px] bg-slate-900 text-amber-300 border border-slate-800 px-2 py-0.5 rounded font-mono">
                              {org.institutionCategory}
                            </span>
                          )}
                          {org.institutionType && (
                            <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                              {org.institutionType}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white">{org.institutionName}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          <span>{org.city}, {org.district}, {org.state}</span>
                        </p>
                      </div>
                    </div>

                    {/* Coordinator Details */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Authorized Event Administrator</span>
                      </div>
                      <div className="text-white font-semibold">{org.coordinatorName} — <span className="text-slate-400 font-normal">{org.designation || 'Head of Event Coordination'}</span></div>
                      <div className="flex items-center gap-4 text-slate-300 text-[11px] flex-wrap pt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {org.officialEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {org.mobile}
                        </span>
                      </div>
                    </div>

                    {/* Reviewer Comments if present */}
                    {org.verificationNotes && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-amber-900/40 text-xs text-amber-200/90 space-y-0.5">
                        <span className="font-bold text-[10px] uppercase text-amber-400 block">Reviewer Notes:</span>
                        <p className="text-[11.5px] leading-relaxed">{org.verificationNotes}</p>
                      </div>
                    )}

                    {/* Uploaded Documents */}
                    {org.verificationDocuments && org.verificationDocuments.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Institutional Evidence:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {org.verificationDocuments.map((doc, dIdx) => (
                            <a
                              key={dIdx}
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span className="truncate max-w-[180px]">{doc.title || doc.fileName}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] text-slate-500">
                      Registered: {org.registeredAt ? new Date(org.registeredAt).toLocaleDateString() : 'Active'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {org.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => handleOpenReviewModal(org, 'verified')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenReviewModal(org, 'additional_info_required')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Request Info
                      </button>

                      {org.verificationStatus !== 'rejected' && (
                        <button
                          onClick={() => handleOpenReviewModal(org, 'rejected')}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-red-950 text-red-400 border border-red-900/40 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AISHE MASTER DIRECTORY */}
      {activeTab === 'registry' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Filter & Search Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by college name, city, district..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              {/* State / UT Selector */}
              <select
                value={selectedState}
                onChange={e => { setSelectedState(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-red-500 font-bold"
              >
                <option value="All">All States & UTs (36)</option>
                {ALL_STATE_AND_UT_NAMES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Verification Status */}
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-red-500 font-bold"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
          </div>

          {/* Results stats */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredInstitutions.length} matched institutions (Page {currentPage} of {totalPages})</span>
          </div>

          {/* Colleges Grid */}
          {paginatedInstitutions.length === 0 ? (
            <div className="p-10 bg-slate-950 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-bold text-white">No institutions match the filter criteria.</p>
              <p>Try selecting "All States" or clearing the search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedInstitutions.map(inst => (
            <div
              key={inst.id}
              className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inst.verified ? 'bg-green-950 text-green-300 border border-green-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {inst.verified ? '✓ VERIFIED ACCREDITED' : '⚠ PENDING VERIFICATION'}
                      </span>
                      {inst.aisheCode && (
                        <span className="text-[10px] text-slate-400 font-mono">AISHE: {inst.aisheCode}</span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mt-1.5">{inst.name}</h3>
                    <p className="text-xs text-slate-400">
                      📍 {inst.city}, {inst.district ? `${inst.district} Dist, ` : ''}{inst.state}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteInstitution(inst.id)}
                    className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-900">
                  <div className="p-2 bg-slate-900/80 rounded-xl">
                    <div className="font-bold text-white">{inst.studentCount || 0}</div>
                    <div className="text-[10px] text-slate-400">Students</div>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded-xl">
                    <div className="font-bold text-white">{inst.mentorCount || 0}</div>
                    <div className="text-[10px] text-slate-400">Faculty</div>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded-xl">
                    <div className="font-bold text-amber-400">{inst.eventsCount || 0}</div>
                    <div className="text-[10px] text-slate-400">Events Hosted</div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                {inst.website ? (
                  <a
                    href={inst.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span className="text-[11px] text-slate-600">No URL listed</span>}

                <div className="flex items-center gap-2">
                  {!inst.verified ? (
                    <button
                      onClick={() => verifyInstitution(inst.id)}
                      className="py-1.5 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authorize</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => suspendInstitution(inst.id)}
                      className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Suspend</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs text-slate-400 px-3 font-bold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
        </div>
      )}

      {/* Add Institution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                Add Institution to National Master Registry
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveInstitution} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Institution Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. National Institute of Technology Warangal"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">State / UT *</label>
                  <select
                    value={formData.state}
                    onChange={e => {
                      const newState = e.target.value;
                      const dists = getDistrictsByStateName(newState);
                      setFormData({ ...formData, state: newState, district: dists[0] || '' });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  >
                    {ALL_STATE_AND_UT_NAMES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">District *</label>
                  <select
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  >
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City / Campus *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Warangal"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">AISHE Code</label>
                  <input
                    type="text"
                    value={formData.aisheCode}
                    onChange={e => setFormData({ ...formData, aisheCode: e.target.value })}
                    placeholder="C-12345"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.nitw.ac.in"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Save Institution Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileJson className="w-5 h-5 text-amber-400" />
                Bulk Import Institutions (JSON Format)
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Paste a JSON array of college objects with <code>name</code>, <code>state</code>, <code>district</code>, <code>city</code>, and <code>aisheCode</code>.
            </p>

            <form onSubmit={handleExecuteImport} className="space-y-3">
              <textarea
                rows={6}
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                placeholder='[{"name": "Indian Institute of Science", "state": "Karnataka", "district": "Bengaluru Urban", "city": "Bengaluru", "aisheCode": "U-0220"}]'
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono outline-none focus:border-amber-500"
                required
              />

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Ingest Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organization Verification Review Modal */}
      {selectedOrgForReview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Review Organization Verification
              </h3>
              <button onClick={() => setSelectedOrgForReview(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-1.5 text-xs bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-white font-bold text-sm">{selectedOrgForReview.institutionName}</div>
              <p className="text-slate-300">Coordinator: <strong>{selectedOrgForReview.coordinatorName}</strong> ({selectedOrgForReview.officialEmail})</p>
              <p className="text-slate-400">Location: {selectedOrgForReview.city}, {selectedOrgForReview.district}, {selectedOrgForReview.state}</p>
            </div>

            <form onSubmit={handleExecuteOrgReview} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Verification Decision *</label>
                <select
                  value={reviewStatusChoice}
                  onChange={e => setReviewStatusChoice(e.target.value as OrganizationVerificationStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-bold"
                >
                  <option value="verified">Verified (Accredited Institution Badge)</option>
                  <option value="under_review">Under Review (Keep In Review)</option>
                  <option value="additional_info_required">Additional Information Required</option>
                  <option value="rejected">Rejected (Does Not Meet Guidelines)</option>
                  <option value="suspended">Suspended (Revoke Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Reviewer Notes / Feedback to Organizer *
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Provide constructive feedback, reasons, or specific documentation required from the coordinator..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrgForReview(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="campus-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Confirm & Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
