import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';

const BrowseOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [workType, setWorkType] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append('search', search);
      if (workType) params.append('workType', workType);
      if (industry) params.append('industry', industry);
      const { data } = await api.get(`/api/opportunities?${params}`);
      setOpportunities(data.data);
      setPagination(data.pagination);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOpportunities(); }, [page, workType, industry]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOpportunities();
  };

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="Opportunities"
        title="Browse Opportunities"
        subtitle="Find your next role in an exciting startup and join a team building something meaningful."
      />

      <div className="card p-6 sm:p-8 mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Search by role or skills..." className="input-field md:col-span-2" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input-field" value={workType} onChange={(e) => { setWorkType(e.target.value); setPage(1); }}>
            <option value="">All Work Types</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
          <select className="input-field" value={industry} onChange={(e) => { setIndustry(e.target.value); setPage(1); }}>
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="E-commerce">E-commerce</option>
          </select>
          <button type="submit" className="btn-primary md:col-span-4 w-full md:w-auto md:justify-self-start">Search</button>
        </form>
      </div>

      {loading ? <LoadingSpinner /> : opportunities.length === 0 ? (
        <div className="empty-state">No opportunities found. Try adjusting your filters.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp._id} className="card h-full flex flex-col p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{opp.role_title}</h3>
                <p className="text-sm text-orange-500 font-semibold mt-1">{opp.startup_id?.startup_name}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(opp.required_skills || []).map((s) => (
                    <span key={s} className="skill-chip">{s}</span>
                  ))}
                </div>
                <div className="mt-3 text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="capitalize">Work: {opp.work_type}</p>
                  <p className="capitalize">Commitment: {opp.commitment_level}</p>
                  <p>Deadline: {new Date(opp.deadline).toLocaleDateString()}</p>
                </div>
                <Link to={`/opportunities/${opp._id}`} className="mt-auto pt-4 link-accent">View Details →</Link>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="pagination-btn">Previous</button>
              <span className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400">Page {page} of {pagination.totalPages}</span>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="pagination-btn">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseOpportunities;
