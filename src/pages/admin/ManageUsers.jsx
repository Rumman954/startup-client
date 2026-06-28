import { useEffect, useState } from 'react';
import { FiBriefcase, FiX } from 'react-icons/fi';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PREMIUM_PLANS } from '../../lib/premiumPlans';

const formatPlan = (plan) => {
  if (plan === 'pro_plus') return 'Pro+';
  if (!plan) return 'Free';
  return PREMIUM_PLANS[plan]?.name || plan;
};

const statusClass = (status) => {
  if (status === 'accepted' || status === 'approved' || status === 'completed') return 'status-accepted';
  if (status === 'rejected' || status === 'removed' || status === 'failed') return 'status-rejected';
  return 'status-pending';
};

const DetailRow = ({ label, value }) => (
  <div>
    <dt>{label}</dt>
    <dd>{value ?? '—'}</dd>
  </div>
);

const UserDetailModal = ({ userId, onClose, onBlockToggle }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/admin/users/${userId}`)
      .then((res) => setDetail(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const user = detail?.user;

  const handleBlock = async (block) => {
    try {
      await api.patch(`/api/admin/users/${userId}/${block ? 'block' : 'unblock'}`);
      toast.success(block ? 'User blocked' : 'User unblocked');
      const { data } = await api.get(`/api/admin/users/${userId}`);
      setDetail(data.data);
      onBlockToggle?.();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="admin-tx-modal-backdrop" onClick={onClose}>
      <div className="admin-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-tx-modal-header">
          <h2>User Details</h2>
          <button type="button" onClick={onClose} className="admin-tx-modal-close" aria-label="Close">
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : !user ? (
          <p className="text-slate-500 py-8 text-center">Could not load user details.</p>
        ) : (
          <div className="admin-user-detail-body">
            <section className="admin-detail-section">
              <h3>Profile</h3>
              <div className="admin-user-profile-head">
                {user.image ? (
                  <img src={user.image} alt="" className="admin-user-avatar" />
                ) : (
                  <div className="admin-user-avatar admin-user-avatar-fallback">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="admin-user-name">{user.name}</p>
                  <p className="admin-user-email">{user.email}</p>
                  <div className="admin-user-badges">
                    <span className="founder-badge-violet capitalize">{user.role}</span>
                    <span className={user.isBlocked ? 'status-rejected' : 'status-accepted'}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                    {user.isPremium && (
                      <span className="founder-badge-amber">{formatPlan(user.premiumPlan)} Premium</span>
                    )}
                  </div>
                </div>
              </div>
              <dl className="admin-tx-detail-grid">
                <DetailRow label="Bio" value={user.bio || '—'} />
                <DetailRow
                  label="Skills"
                  value={user.skills?.length ? user.skills.join(', ') : '—'}
                />
                <DetailRow label="Premium Plan" value={formatPlan(user.premiumPlan)} />
                <DetailRow label="Billing" value={user.premiumBilling ? user.premiumBilling : '—'} />
                <DetailRow
                  label="Premium Expires"
                  value={user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleString() : '—'}
                />
                <DetailRow label="Joined" value={new Date(user.createdAt).toLocaleString()} />
              </dl>
              {user.role !== 'admin' && (
                <button
                  type="button"
                  onClick={() => handleBlock(!user.isBlocked)}
                  className={user.isBlocked ? 'admin-action-btn admin-action-unblock' : 'admin-action-btn admin-action-block'}
                >
                  {user.isBlocked ? 'Unblock User' : 'Block User'}
                </button>
              )}
            </section>

            {detail.payments?.length > 0 && (
              <section className="admin-detail-section">
                <h3>Payments ({detail.payments.length})</h3>
                <div className="admin-nested-list">
                  {detail.payments.map((p) => (
                    <div key={p._id} className="admin-nested-card">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        ${Number(p.amount).toFixed(2)} · {formatPlan(p.plan)}
                      </p>
                      <p className="text-sm text-slate-500 capitalize">
                        {p.billing_interval || '—'} · {p.payment_status}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(p.paid_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {user.role === 'founder' && (
              <>
                <section className="admin-detail-section">
                  <h3>Startup / Company</h3>
                  {detail.startup ? (
                    <dl className="admin-tx-detail-grid">
                      <DetailRow label="Company Name" value={detail.startup.startup_name} />
                      <DetailRow label="Industry" value={detail.startup.industry} />
                      <DetailRow label="Funding Stage" value={detail.startup.funding_stage} />
                      <DetailRow label="Team Size Needed" value={detail.startup.team_size_needed} />
                      <DetailRow label="Status" value={
                        <span className={`${statusClass(detail.startup.status)} capitalize`}>
                          {detail.startup.status}
                        </span>
                      } />
                      <DetailRow label="Description" value={detail.startup.description} />
                      <DetailRow label="Created" value={new Date(detail.startup.createdAt).toLocaleString()} />
                    </dl>
                  ) : (
                    <p className="admin-empty-note">No startup profile created yet.</p>
                  )}
                </section>

                <section className="admin-detail-section">
                  <h3>
                    <FiBriefcase className="inline mr-2" size={18} />
                    Hiring / Opportunities ({detail.opportunities?.length || 0})
                  </h3>
                  {!detail.opportunities?.length ? (
                    <p className="admin-empty-note">No opportunities posted.</p>
                  ) : (
                    <div className="admin-nested-list">
                      {detail.opportunities.map((opp) => (
                        <div key={opp._id} className="admin-nested-card">
                          <p className="font-bold text-slate-900 dark:text-white">{opp.role_title}</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {opp.startup_id?.startup_name || detail.startup?.startup_name || 'Startup'}
                          </p>
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
                                Applicants
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
                                  </div>
                                  <div className="text-right">
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
              </>
            )}

            {user.role === 'collaborator' && (
              <section className="admin-detail-section">
                <h3>Applications Submitted ({detail.applicationsSubmitted?.length || 0})</h3>
                {!detail.applicationsSubmitted?.length ? (
                  <p className="admin-empty-note">No applications submitted yet.</p>
                ) : (
                  <div className="admin-nested-list">
                    {detail.applicationsSubmitted.map((app) => (
                      <div key={app._id} className="admin-nested-card">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {app.opportunity?.role_title || 'Role removed'}
                        </p>
                        <p className="text-sm text-violet-600 dark:text-violet-400 mt-0.5">
                          {app.opportunity?.startup_id?.startup_name || '—'}
                        </p>
                        <dl className="admin-opp-mini-grid">
                          <div><dt>Work Type</dt><dd className="capitalize">{app.opportunity?.work_type || '—'}</dd></div>
                          <div><dt>Commitment</dt><dd className="capitalize">{app.opportunity?.commitment_level || '—'}</dd></div>
                          <div><dt>Status</dt><dd><span className={`${statusClass(app.status)} capitalize`}>{app.status}</span></dd></div>
                          <div><dt>Applied</dt><dd>{new Date(app.applied_at).toLocaleDateString()}</dd></div>
                          <div><dt>Portfolio</dt><dd>{app.portfolio_link ? <a href={app.portfolio_link} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline break-all">{app.portfolio_link}</a> : '—'}</dd></div>
                        </dl>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                          <span className="font-semibold text-slate-500">Motivation: </span>
                          {app.motivation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/api/admin/users')
      .then((res) => setUsers(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = roleFilter === 'all'
    ? users
    : users.filter((u) => u.role === roleFilter);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Manage <span className="browse-opp-title-gradient">Users</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Click a user to view full profile, company, and hiring details
        </p>
      </div>

      <div className="admin-filter-tabs mb-6">
        {['all', 'founder', 'collaborator', 'admin'].map((role) => (
          <button
            key={role}
            type="button"
            className={roleFilter === role ? 'admin-filter-tab active' : 'admin-filter-tab'}
            onClick={() => setRoleFilter(role)}
          >
            {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : (
        <div className="premium-table-wrap">
          <table className="premium-table admin-tx-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Premium</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user._id}
                  className="admin-tx-row"
                  onClick={() => setSelectedId(user._id)}
                >
                  <td className="font-semibold text-slate-900 dark:text-white">{user.name}</td>
                  <td className="text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="capitalize text-slate-700 dark:text-slate-300">{user.role}</td>
                  <td>
                    {user.isPremium ? (
                      <span className="founder-badge-amber">{formatPlan(user.premiumPlan)}</span>
                    ) : (
                      <span className="text-slate-400 text-sm">Free</span>
                    )}
                  </td>
                  <td>
                    <span className={user.isBlocked ? 'status-rejected' : 'status-accepted'}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedId && (
        <UserDetailModal
          userId={selectedId}
          onClose={() => setSelectedId(null)}
          onBlockToggle={fetchUsers}
        />
      )}
    </div>
  );
};

export default ManageUsers;
