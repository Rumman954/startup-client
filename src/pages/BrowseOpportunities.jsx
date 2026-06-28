import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const WORK_TYPES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'hybrid', label: 'Hybrid' },
];

const INDUSTRIES = [
  'Technology',
  'FinTech',
  'HealthTech',
  'EdTech',
  'E-commerce',
  'SaaS',
  'AI/ML',
  'Green Tech',
  'Healthcare',
  'Finance',
  'Education',
  'Other',
];

const formatDate = (date) => new Date(date).toLocaleDateString('en-GB');

const formatLabel = (value) =>
  value ? value.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('-') : '';

const getDeadlineBadge = (deadline) => {
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: 'Exp', expired: true };
  return { label: `${days}d`, expired: false };
};

const BrowseOpportunities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [page, setPage] = useState(1);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append('search', search);
      if (selectedWorkTypes.length) params.append('workType', selectedWorkTypes.join(','));
      if (selectedIndustries.length) params.append('industry', selectedIndustries.join(','));
      const { data } = await api.get(`/api/opportunities?${params}`);
      setOpportunities(data.data);
      setPagination(data.pagination);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedWorkTypes, selectedIndustries]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const toggleWorkType = (value) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setPage(1);
  };

  const toggleIndustry = (value) => {
    setSelectedIndustries((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setPage(1);
  };

  const handleApply = (oppId) => {
    const detailsPath = `/opportunities/${oppId}`;
    if (!user) {
      navigate('/login', {
        state: {
          from: { pathname: detailsPath },
          applyPrompt: true,
        },
      });
      return;
    }
    navigate(detailsPath);
  };

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse <span className="browse-opp-title-gradient">Opportunities</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
          {pagination.total} opportunit{pagination.total === 1 ? 'y' : 'ies'} available · Find your perfect startup role
        </p>
      </div>

      <div className="browse-opp-layout">
        <aside className="browse-opp-sidebar">
          <div>
            <p className="browse-opp-filter-title">Search</p>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search roles, skills..."
                className="browse-opp-search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="browse-opp-filter-title">Work Type</p>
            <div className="space-y-2.5">
              {WORK_TYPES.map(({ value, label }) => (
                <label key={value} className="browse-opp-check">
                  <input
                    type="checkbox"
                    checked={selectedWorkTypes.includes(value)}
                    onChange={() => toggleWorkType(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="browse-opp-filter-title">Industry</p>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {INDUSTRIES.map((ind) => (
                <label key={ind} className="browse-opp-check">
                  <input
                    type="checkbox"
                    checked={selectedIndustries.includes(ind)}
                    onChange={() => toggleIndustry(ind)}
                  />
                  {ind}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingSpinner />
          ) : opportunities.length === 0 ? (
            <div className="empty-state">No opportunities found. Try adjusting your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {opportunities.map((opp) => {
                  const badge = getDeadlineBadge(opp.deadline);
                  return (
                    <article key={opp._id} className="browse-opp-card">
                      <span className={badge.expired ? 'opp-badge-expired' : 'opp-badge-days'}>
                        {badge.label}
                      </span>

                      <h3 className="font-bold text-lg text-slate-900 dark:text-white pr-12 leading-snug">
                        {opp.role_title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {opp.startup_id?.startup_name || 'Startup'}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(opp.required_skills || []).slice(0, 4).map((skill) => (
                          <span key={skill} className="opp-skill-chip">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 capitalize">
                          <FiMapPin size={13} className="text-violet-500" />
                          {opp.work_type}
                        </span>
                        <span className="inline-flex items-center gap-1 capitalize">
                          <FiClock size={13} className="text-violet-500" />
                          {formatLabel(opp.commitment_level)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiCalendar size={13} className="text-violet-500" />
                          {formatDate(opp.deadline)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApply(opp._id)}
                        className="opp-apply-btn mt-auto"
                      >
                        Apply Now
                      </button>
                    </article>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseOpportunities;
