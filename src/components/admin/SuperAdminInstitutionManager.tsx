import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, ShieldCheck, AlertTriangle, Search, 
  ExternalLink, CheckCircle2, XCircle, Plus, MapPin,
  Upload, Download, Edit3, Trash2, ChevronLeft, ChevronRight,
  FileJson, Check
} from 'lucide-react';
import { InstitutionInfo } from '../../types';
import { ALL_STATE_AND_UT_NAMES, getDistrictsByStateName } from '../../utils/locationData';
import { sanitizeInput } from '../../utils/validation';

export const SuperAdminInstitutionManager: React.FC = () => {
  const { 
    institutions, verifyInstitution, suspendInstitution, 
    addInstitution, updateInstitution, deleteInstitution,
    importInstitutionsBatch, addToast 
  } = useApp();

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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              AISHE Institutional Master Registry
            </span>
            <span className="text-xs text-slate-400">Total Registered: {institutions.length}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            College & University Management Directory
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
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
        </div>
      </div>

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

    </div>
  );
};
