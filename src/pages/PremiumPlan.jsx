import { FiCheck, FiStar, FiZap } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { startPremiumCheckout } from '../lib/payments';
import {
  PLAN_ORDER,
  PREMIUM_PLANS,
  formatPlanPrice,
  getPlanPrice,
  getPlanRank,
  getYearlySavings,
} from '../lib/premiumPlans';

const PremiumPlan = () => {
  const { user } = useAuth();
  const [billing, setBilling] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState('');

  const currentRank = getPlanRank(user?.premiumPlan);

  const handleUpgrade = async (planId) => {
    const selectedRank = getPlanRank(planId);
    if (selectedRank <= currentRank && user?.isPremium) {
      toast.success('You already have this plan or higher');
      return;
    }

    setLoadingPlan(planId);
    try {
      await startPremiumCheckout({ plan: planId, billing });
    } catch (err) {
      toast.error(err.message || 'Could not start checkout');
      setLoadingPlan('');
    }
  };

  const getButtonLabel = (planId) => {
    const rank = getPlanRank(planId);
    if (user?.premiumPlan === planId) return 'Current Plan';
    if (rank < currentRank && user?.isPremium) return 'Included';
    if (loadingPlan === planId) return 'Opening checkout...';
    return `Get ${PREMIUM_PLANS[planId].name}`;
  };

  return (
    <div className="premium-plan-page">
      <div className="premium-plan-inner premium-plan-inner-wide">
        <div className="premium-plan-badge">
          <FiStar size={14} />
          Premium Plans
        </div>

        <h1 className="premium-plan-title">
          Unlock <span className="premium-plan-title-accent">Premium</span>
        </h1>
        <p className="premium-plan-subtitle">
          Choose Plus, Pro, or Pro+ — monthly or yearly billing.
        </p>

        <div className="premium-billing-toggle">
          <button
            type="button"
            className={billing === 'monthly' ? 'premium-billing-btn active' : 'premium-billing-btn'}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={billing === 'yearly' ? 'premium-billing-btn active' : 'premium-billing-btn'}
            onClick={() => setBilling('yearly')}
          >
            Yearly
            <span className="premium-billing-save">Save up to 17%</span>
          </button>
        </div>

        <div className="premium-plans-grid">
          {PLAN_ORDER.map((planId) => {
            const plan = PREMIUM_PLANS[planId];
            const price = getPlanPrice(planId, billing);
            const { whole, cents } = formatPlanPrice(price);
            const rank = getPlanRank(planId);
            const isCurrent = user?.premiumPlan === planId;
            const isDisabled = (rank <= currentRank && user?.isPremium) || loadingPlan !== '';

            return (
              <div
                key={planId}
                className={`premium-plan-card premium-plan-card-tier ${plan.popular ? 'premium-plan-card-popular' : ''} ${isCurrent ? 'premium-plan-card-current' : ''}`}
              >
                {plan.popular && <span className="premium-plan-popular-badge">Most Popular</span>}

                <div className="premium-plan-tier-header">
                  <h2>{plan.name}</h2>
                  <p>{plan.tagline}</p>
                </div>

                <div className="premium-plan-price">
                  <span className="premium-plan-price-main">${whole}</span>
                  <span className="premium-plan-price-cents">.{cents}</span>
                </div>
                <p className="premium-plan-terms">
                  per {billing === 'yearly' ? 'year' : 'month'}
                  {billing === 'yearly' && (
                    <span className="premium-plan-savings"> · Save {getYearlySavings(planId)}%</span>
                  )}
                </p>

                <ul className="premium-plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="premium-plan-check">
                        <FiCheck size={14} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleUpgrade(planId)}
                  disabled={isDisabled}
                  className={`premium-plan-cta ${isCurrent ? 'premium-plan-cta-current' : ''}`}
                >
                  <FiZap size={18} />
                  {getButtonLabel(planId)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumPlan;
