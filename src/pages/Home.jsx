import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, oRes] = await Promise.all([
          api.get('/api/startups/featured'),
          api.get('/api/opportunities/featured'),
        ]);
        setStartups(sRes.data.data);
        setOpportunities(oRes.data.data);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen message="Loading StartupForge..." />;

  return (
    <div>
      <section className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Build Your Dream Startup Team
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl">
              StartupForge connects visionary founders with talented developers, designers, and marketers ready to build the next big thing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/opportunities" className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
                Browse Opportunities <FiArrowRight />
              </Link>
              <Link to="/register" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Startups</h2>
            <p className="section-subtitle">Discover innovative startups looking for team members</p>
          </div>
          {startups.length === 0 ? (
            <p className="text-center text-slate-500">No startups yet. Be the first founder!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup, i) => (
                <motion.div key={startup._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card h-full flex flex-col">
                  <div className="h-48 bg-slate-100 flex items-center justify-center p-4">
                    <img src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}&size=128`} alt={startup.startup_name} className="w-24 h-24 object-contain rounded-xl" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900">{startup.startup_name}</h3>
                    <p className="text-sm text-slate-500 mt-1">By {startup.founder_email.split('@')[0]}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full w-fit">{startup.industry}</span>
                    <p className="text-sm text-slate-600 mt-3 flex-1 line-clamp-2">{startup.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-slate-500 flex items-center gap-1"><FiUsers size={14} /> Team: {startup.team_size_needed || 5}</span>
                      <Link to={`/startups/${startup._id}`} className="text-indigo-600 text-sm font-semibold hover:underline">View Details</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/startups" className="btn-secondary">View All Startups</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Opportunities</h2>
            <p className="section-subtitle">Latest roles open for talented collaborators</p>
          </div>
          {opportunities.length === 0 ? (
            <p className="text-center text-slate-500">No opportunities posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div key={opp._id} className="card h-full flex flex-col p-6">
                  <h3 className="font-bold text-lg text-slate-900">{opp.role_title}</h3>
                  <p className="text-sm text-indigo-600 font-medium mt-1">{opp.startup_id?.startup_name || 'Startup'}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(opp.required_skills || []).slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">{skill}</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-auto pt-4">
                    Deadline: {new Date(opp.deadline).toLocaleDateString()}
                  </p>
                  <Link to={`/opportunities/${opp._id}`} className="mt-3 text-indigo-600 text-sm font-semibold hover:underline">Apply Now →</Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/opportunities" className="btn-primary">Browse All Opportunities</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Join StartupForge</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiBriefcase, title: 'Find Your Match', desc: 'Browse startups and opportunities that align with your skills and passion.' },
              { icon: FiUsers, title: 'Build Great Teams', desc: 'Founders can recruit top talent and grow their startup with the right people.' },
              { icon: FiTrendingUp, title: 'Grow Together', desc: 'Join a community of innovators building the next generation of startups.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-indigo-600" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Startup Statistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Active Startups' },
              { num: '1,200+', label: 'Opportunities Posted' },
              { num: '3,000+', label: 'Collaborators' },
              { num: '850+', label: 'Teams Formed' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-4xl font-bold">{num}</div>
                <div className="text-indigo-200 mt-2 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
