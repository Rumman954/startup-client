import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiZap } from 'react-icons/fi';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { showErrorToast, showSuccessToast } from '../../lib/premiumToast';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PREMIUM_PLANS } from '../../lib/premiumPlans';

const EMPTY_FORM = {
  role_title: '',
  required_skills: '',
  work_type: '',
  commitment_level: '',
  deadline: '',
};

const mapOpportunityToForm = (opp) => ({
  role_title: opp.role_title || '',
  required_skills: Array.isArray(opp.required_skills)
    ? opp.required_skills.join(', ')
    : opp.required_skills || '',
  work_type: opp.work_type || '',
  commitment_level: opp.commitment_level || '',
  deadline: opp.deadline ? opp.deadline.slice(0, 10) : '',
});

const AddOpportunity = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [slotsUsed, setSlotsUsed] = useState(0);
  const [slotLimit, setSlotLimit] = useState(3);
  const [premiumPlan, setPremiumPlan] = useState(user?.premiumPlan || '');
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [lockedForm, setLockedForm] = useState(null);
  const [startupStatus, setStartupStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchUser();
        const { data } = await api.get('/api/users/founder/stats');
        const used = data.data?.totalOpportunities || 0;
        const limit = data.data?.isUnlimited
          ? Infinity
          : (data.data?.opportunityLimit ?? 3);
        const plan = data.data?.premiumPlan || '';
        setSlotsUsed(used);
        setSlotLimit(limit);
        setPremiumPlan(plan);

        if (used >= limit) {
          const mine = await api.get('/api/opportunities/founder/mine');
          const latest = mine.data.data?.[0];
          if (latest) setLockedForm(mapOpportunityToForm(latest));
        }

        const startupRes = await api.get('/api/startups/founder/mine');
        setStartupStatus(startupRes.data.data?.status || null);
      } catch {
        /* ignore */
      } finally {
        setPageLoading(false);
      }
    };

    load();
  }, [fetchUser]);

  useEffect(() => {
    if (user?.premiumPlan !== undefined) {
      setPremiumPlan(user.premiumPlan || '');
    }
  }, [user?.premiumPlan]);

  const limitLabel = slotLimit === Infinity
    ? 'Unlimited'
    : `${Math.min(slotsUsed, slotLimit)}/${slotLimit}`;
  const atLimit = slotsUsed >= slotLimit;
  const premiumRequired = atLimit;
  const displayForm = premiumRequired ? (lockedForm || EMPTY_FORM) : form;
  const planName = PREMIUM_PLANS[premiumPlan]?.name;
  const hasPaidPlan = Boolean(premiumPlan);
  const upgradeMessage = premiumPlan === 'pro'
    ? 'Upgrade to Pro+ for unlimited postings.'
    : premiumPlan === 'plus'
      ? 'Upgrade to Pro or Pro+ for more postings.'
      : `You've used all ${slotLimit} free opportunity slots. Upgrade to post more.`;

  const activePlanMessage = premiumPlan === 'pro_plus'
    ? 'Unlimited opportunity postings — no restrictions.'
    : premiumPlan === 'pro'
      ? 'Pro plan active — up to 25 opportunity postings.'
      : 'Plus plan active — up to 10 opportunity postings.';
  const canUpgrade = premiumPlan === 'plus' || premiumPlan === 'pro';
  const showActivePlanBanner = hasPaidPlan && !premiumRequired;
  const showUpgradeUpsell = canUpgrade && !premiumRequired;
  const startupPending = startupStatus && startupStatus !== 'approved';

  const handleGoPremium = () => navigate('/premium');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (startupPending) {
      toast.error('Your startup must be approved before posting opportunities.');
      return;
    }

    if (premiumRequired) {
      showErrorToast('Plan limit reached', upgradeMessage);
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/opportunities', {
        ...form,
        required_skills: form.required_skills.split(',').map((s) => s.trim()).filter(Boolean),
      });

      const nextSlots = slotsUsed + 1;
      setSlotsUsed(nextSlots);
      showSuccessToast('Opportunity posted!', 'Your role is now live on StartUp Labs.');

      if (nextSlots >= slotLimit) {
        setLockedForm({ ...form });
      } else {
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      if (err.message.includes('Premium') || err.message.includes('limit')) {
        showErrorToast('Plan limit reached', 'Choose a plan to post more opportunities.');
        handleGoPremium();
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingSpinner />;

  return (
    <div className="founder-dashboard-page">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Add Opportunity
        </h1>
        <p className="text-orange-500 font-medium mt-2 text-sm sm:text-base">
          Post a role for your startup.
          {slotLimit === Infinity
            ? ` (${slotsUsed} posted · ${planName || 'Pro+'} plan)`
            : hasPaidPlan
              ? ` (${planName} plan · ${limitLabel} slots used)`
              : ` (${limitLabel} free slots used)`}
        </p>
      </div>

      {startupPending && (
        <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-5 py-4">
          <p className="font-bold text-amber-800 dark:text-amber-300">Startup pending approval</p>
          <p className="text-sm text-amber-700 dark:text-amber-200/90 mt-1">
            An admin must approve your startup before you can publish opportunities publicly.
          </p>
        </div>
      )}

      {showActivePlanBanner && (
        <div className="founder-premium-active-banner mb-6">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <FiZap className="text-violet-600 dark:text-violet-400" size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-violet-700 dark:text-violet-300 text-[15px]">
                {planName} Premium Active
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                {activePlanMessage}
              </p>
            </div>
          </div>
          {showUpgradeUpsell && (
            <button
              type="button"
              onClick={handleGoPremium}
              className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      )}

      {premiumRequired && (
        <div className="founder-premium-inline-banner mb-6">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <FiZap className="text-orange-500" size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-orange-600 dark:text-orange-400 text-[15px]">
                {premiumPlan ? 'Plan Limit Reached' : 'Premium Required'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                {upgradeMessage}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoPremium}
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      <div className="founder-form-wrap !justify-start">
        <div className="founder-form-card max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={premiumRequired ? 'founder-form-fields-locked space-y-6' : 'space-y-6'}>
              <div>
                <label className="founder-form-label">
                  Role Title <span className="text-red-500">*</span>
                </label>
                <input
                  readOnly={premiumRequired}
                  disabled={premiumRequired}
                  tabIndex={premiumRequired ? -1 : 0}
                  className="founder-form-input"
                  placeholder="e.g. Senior React Developer"
                  value={displayForm.role_title}
                  onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                />
              </div>

              <div>
                <label className="founder-form-label">
                  Required Skills <span className="text-red-500">*</span>
                  <span className="font-normal text-slate-500"> (comma-separated)</span>
                </label>
                <input
                  readOnly={premiumRequired}
                  disabled={premiumRequired}
                  tabIndex={premiumRequired ? -1 : 0}
                  className="founder-form-input"
                  placeholder="e.g. React, TypeScript, Node.js"
                  value={displayForm.required_skills}
                  onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="founder-form-label">
                    Work Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={premiumRequired}
                    tabIndex={premiumRequired ? -1 : 0}
                    className="founder-form-input founder-form-select"
                    value={displayForm.work_type}
                    onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="founder-form-label">
                    Commitment Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={premiumRequired}
                    tabIndex={premiumRequired ? -1 : 0}
                    className="founder-form-input founder-form-select"
                    value={displayForm.commitment_level}
                    onChange={(e) => setForm({ ...form, commitment_level: e.target.value })}
                  >
                    <option value="">Select level</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="founder-form-label">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  readOnly={premiumRequired}
                  disabled={premiumRequired}
                  tabIndex={premiumRequired ? -1 : 0}
                  className="founder-form-input"
                  placeholder="dd/mm/yyyy"
                  value={displayForm.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || premiumRequired || startupPending}
              className={`founder-submit-btn ${premiumRequired ? 'founder-submit-btn-locked' : ''}`}
            >
              <FiPlus size={18} />
              {loading ? 'Posting...' : 'Post Opportunity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOpportunity;
