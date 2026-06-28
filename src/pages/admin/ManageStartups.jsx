import { useEffect, useState } from 'react';
import { FiBriefcase, FiX } from 'react-icons/fi';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PREMIUM_PLANS } from '../../lib/premiumPlans';

const statusClass = (status) => {
  if (status === 'approved' || status === 'accepted' || status === 'completed') return 'status-accepted';
  if (status === 'removed' || status === 'rejected' || status === 'failed') return 'status-rejected';
  return 'status-pending';
};

const formatPlan = (plan) => {
  if (plan === 'pro_plus') return 'Pro+';
  if (!plan) return 'Free';
  return PREMIUM_PLANS[plan]?.name || plan;
};

const DetailRow = ({ label, value }) => (
  <div>
    <dt>{label}</dt>
    <dd>{value ?? '—'}</dd>
  </div>
);

const StartupDetailModal = ({ startupId, onClose, onStatusChange }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = () => {
    setLoading(true);
    api.get(`/api/admin/startups/${startupId}`)
      .then((res) => setDetail(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDetail(); }, [startupId]);

  const startup = detail?.startup;
  const founder = detail?.founder;

  const updateStatus = async (action) => {
    try {
      await api.patch(`/api/admin/startups/${startupId}/${action}`);
      toast.success(`Startup ${action === 'approve' ? 'approved' : 'removed'}`);
      loadDetail();
      onStatusChange?.();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="admin-tx-modal-backdrop" onClick={onClose}>
      <div className="admin-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-tx-modal-header">
          <h2>Startup Details</h2>
          <button type="button" onClick={onClose} className="admin-tx-modal-close" aria-label="Close">
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : !startup ? (
          <p className="text-slate-500 py-8 text-center px-8">Could not load startup details.</p>
        ) : (
          <div className="admin-user-detail-body">
            <section className="admin-detail-section">
              <h3>Company Profile</h3>
              <div className="admin-user-profile-head">
                <img
                  src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}`}
                  alt=""
                  className="admin-user-avatar object-contain bg-white"
                />
                <div>
                  <p className="admin-user-name">{startup.startup_name}</p>
                  <p className="admin-user-email">{startup.industry}</p>
                  <div className="admin-user-badges">
                    <span className={`capitalize ${statusClass(startup.status)}`}>{startup.status}</span>
                    <span className="founder-badge-muted">{detail.stats?.totalOpportunities || 0} roles</span>
                    <span className="founder-badge-muted">{detail.stats?.totalApplications || 0} applications</span>
                  </div>
                </div>
              </div>
              <dl className="admin-tx-detail-grid">
                <DetailRow label="Description" value={startup.description} />
                <DetailRow label="Funding Stage" value={startup.funding_stage} />
                <DetailRow label="Team Size Needed" value={startup.team_size_needed} />
                <DetailRow label="Created" value={new Date(startup.createdAt).toLocaleString()} />
                <DetailRow label="Last Updated" value={new Date(startup.updatedAt).toLocaleString()} />
              </dl>
              <div className="flex flex-wrap gap-2 mt-4">
                {startup.status !== 'approved' && (
                  <button type="button" onClick={() => updateStatus('approve')} className="founder-submit-btn !w-auto text-sm py-2 px-5">
                    Approve
                  </button>
                )}
                {startup.status !== 'removed' && (
                  <button type="button" onClick={() => updateStatus('remove')} className="btn-danger text-sm py-2 px-5">
                    Remove
                  </button>
                )}
              </div>
            </section>

            <section className="admin-detail-section">
              <h3>Founder Details</h3>
              {founder ? (
                <>
                  <div className="admin-user-profile-head">
                    {founder.image ? (
                      <img src={founder.image} alt="" className="admin-user-avatar" />
                    ) : (
                      <div className="admin-user-avatar admin-user-avatar-fallback">
                        {founder.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="admin-user-name">{founder.name}</p>
                      <p className="admin-user-email">{founder.email}</p>
                      <div className="admin-user-badges">
                        <span className={founder.isBlocked ? 'status-rejected' : 'status-accepted'}>
                          {founder.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                        {founder.isPremium && (
                          <span className="founder-badge-amber">{formatPlan(founder.premiumPlan)} Premium</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <dl className="admin-tx-detail-grid">
                    <DetailRow label="Bio" value={founder.bio || '—'} />
                    <DetailRow label="Skills" value={founder.skills?.length ? founder.skills.join(', ') : '—'} />
                    <DetailRow label="Premium Plan" value={formatPlan(founder.premiumPlan)} />
                    <DetailRow label="Billing" value={founder.premiumBilling || '—'} />
                    <DetailRow label="Joined" value={new Date(founder.createdAt).toLocaleString()} />
                  </dl>
                </>
              ) : (
                <p className="admin-empty-note">Founder account not found ({startup.founder_email}).</p>
              )}
            </section>

            {detail.payments?.length > 0 && (
              <section className="admin-detail-section">
                <h3>Founder Payments ({detail.payments.length})</h3>
                <div className="admin-nested-list">
                  {detail.payments.map((p) => (
                    <div key={p._id} className="admin-nested-card">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        ${Number(p.amount).toFixed(2)} · {formatPlan(p.plan)}
                      </p>
                      <p className="text-sm text-slate-500 capitalize">
                        {p.billing_interval || '—'} · {p.payment_status}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(p.paid_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="admin-detail-section">
              <h3>
                <FiBriefcase className="inline mr-2" size={18} />
                Hiring / Opportunities ({detail.opportunities?.length || 0})
              </h3>
              {!detail.opportunities?.length ? (
                <p className="admin-empty-note">No hiring posts yet.</p>
              ) : (
                <div className="admin-nested-list">
                  {detail.opportunities.map((opp) => (
                    <div key={opp._id} className="admin-nested-card">
                      <p className="font-bold text-slate-900 dark:text-white">{opp.role_title}</p>
                      <dl className="admin-opp-mini-grid">
                        <div><dt>Skills</dt><dd>{opp.required_skills?.join(', ') || '—'}</dd></div>
                        <div><dt>Work Type</dt><dd className="capitalize">{opp.work_type}</dd></div>
                        <div><dt>Commitment</dt><dd className="capitalize">{opp.commitment_level}</dd></div>
                        <div><dt>Deadline</dt><dd>{new Date(opp.deadline).toLocaleDateString()}</dd></div>
                        <div><dt>Posted</dt><dd>{new Date(opp.createdAt).toLocaleDateString()}</dd></div>
                        <div><dt>Applications</dt><dd>{opp.applications?.length || 0}</dd></div>
                      </dl>
                      {opp.applications?.length > 0 && (
                        <div className="admin-applications-sublist">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                            Collaborator Applications
                          </p>
                          {opp.applications.map((app) => (
                            <div key={app._id} className="admin-application-row">
                              <div>
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                  {app.applicant?.name}
                                </p>
                                <p className="text-xs text-slate-500">{app.applicant?.email}</p>
                                {app.applicant?.skills?.length > 0 && (
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    Skills: {app.applicant.skills.join(', ')}
                                  </p>
                                )}
                                {app.motivation && (
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{app.motivation}</p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <span className={`${statusClass(app.status)} capitalize text-xs`}>
                                  {app.status}
                                </span>
                                <p className="text-xs text-slate-400 mt-1">
                                  {new Date(app.applied_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const ManageStartups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchStartups = () => {
    setLoading(true);
    api.get('/api/admin/startups')
      .then((res) => setStartups(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStartups(); }, []);

  const updateStatus = async (id, action, e) => {
    e?.stopPropagation();
    try {
      await api.patch(`/api/admin/startups/${id}/${action}`);
      toast.success(`Startup ${action === 'approve' ? 'approved' : 'removed'}`);
      fetchStartups();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = statusFilter === 'all'
    ? startups
    : startups.filter((s) => s.status === statusFilter);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Manage <span className="browse-opp-title-gradient">Startups</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Click a startup to view company, founder, and hiring details
        </p>
      </div>

      <div className="admin-filter-tabs mb-6">
        {['all', 'pending', 'approved', 'removed'].map((status) => (
          <button
            key={status}
            type="button"
            className={statusFilter === status ? 'admin-filter-tab active' : 'admin-filter-tab'}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No startups found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((startup) => (
            <div
              key={startup._id}
              role="button"
              tabIndex={0}
              className="founder-startup-card admin-startup-card flex flex-col md:flex-row md:justify-between md:items-center gap-4 cursor-pointer"
              onClick={() => setSelectedId(startup._id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedId(startup._id)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}`}
                  alt=""
                  className="w-14 h-14 rounded-xl object-contain bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{startup.startup_name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {startup.industry} · {startup.founder_email}
                  </p>
                  <span className={`inline-block mt-2 capitalize ${statusClass(startup.status)}`}>
                    {startup.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setSelectedId(startup._id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/10"
                >
                  View Details
                </button>
                {startup.status !== 'approved' && (
                  <button type="button" onClick={(e) => updateStatus(startup._id, 'approve', e)} className="founder-submit-btn !w-auto text-sm py-2 px-5">
                    Approve
                  </button>
                )}
                {startup.status !== 'removed' && (
                  <button type="button" onClick={(e) => updateStatus(startup._id, 'remove', e)} className="btn-danger text-sm py-1.5 px-4">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedId && (
        <StartupDetailModal
          startupId={selectedId}
          onClose={() => setSelectedId(null)}
          onStatusChange={fetchStartups}
        />
      )}
    </div>
  );
};

export default ManageStartups;
