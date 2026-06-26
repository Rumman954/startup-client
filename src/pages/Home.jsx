import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

const HERO_SLIDES = [
  {
    src: '/hero-technology.png',
    alt: 'Human and robotic hand collaboration',
    align: 'left',
    title: 'StartUp Labs',
    subtitle: 'Startup Team Building & Digital Collaboration',
    tagline: 'Building Tomorrow\'s Teams Today',
    description:
      'Where human creativity meets technology. Founders recruit developers, designers, and marketers to build the next generation of startups together.',
    primaryCta: { label: 'Opportunities', to: '/opportunities' },
    secondaryCta: { label: 'Startups', to: '/startups' },
  },
  {
    src: '/hero-world.png',
    alt: 'Global technology network',
    align: 'right',
    title: 'StartUp Labs',
    subtitle: 'Global Innovation & Digital Connectivity',
    tagline: 'Connecting Founders Across the World',
    description:
      'Join a worldwide network of innovators. StartUp Labs bridges talented collaborators and visionary founders across borders to launch bold ideas.',
    primaryCta: { label: 'Join the Network', to: '/register' },
    secondaryCta: { label: 'Browse Startups', to: '/startups' },
  },
];

const Home = () => {
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);
  const heroTimerRef = useRef(null);

  const nextHeroSlide = useCallback(() => {
    setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const startHeroTimer = useCallback(() => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(nextHeroSlide, 5000);
  }, [nextHeroSlide]);

  useEffect(() => {
    startHeroTimer();
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, [startHeroTimer]);

  const handleHeroClick = () => {
    nextHeroSlide();
    startHeroTimer();
  };

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

  if (loading) return <LoadingSpinner fullScreen message="Loading StartUp Labs..." />;

  const slide = HERO_SLIDES[heroSlide];
  const isRight = slide.align === 'right';

  return (
    <div>
      {/* Hero with sliding background images */}
      <section className="relative overflow-hidden min-h-[560px] sm:min-h-[580px] md:min-h-[610px] lg:min-h-[630px]">
        {/* Clickable slideshow background */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleHeroClick}
          onKeyDown={(e) => e.key === 'Enter' && handleHeroClick()}
          className="absolute inset-0 cursor-pointer outline-none"
          aria-label="Click to change hero image"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlide}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${HERO_SLIDES[heroSlide].src}')` }}
            />
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <motion.div
          key={`overlay-${heroSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 pointer-events-none ${
            isRight
              ? 'bg-gradient-to-l from-[#0a0f1a]/95 via-[#0a0f1a]/85 to-[#0a0f1a]/25'
              : 'bg-gradient-to-r from-[#0a0f1a]/95 via-[#0a0f1a]/85 to-[#0a0f1a]/25'
          }`}
        />
        <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />

        {/* Slide indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 pointer-events-none">
          {HERO_SLIDES.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === heroSlide ? 'bg-orange-500 scale-110' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10 pointer-events-none flex ${
            isRight ? 'justify-end' : 'justify-start'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlide}
              initial={{ opacity: 0, x: isRight ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRight ? -50 : 50 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className={`pointer-events-auto text-left ${
                isRight
                  ? 'ml-auto w-full sm:w-[85%] md:w-[68%] lg:w-[52%] xl:w-[46%] max-w-4xl'
                  : 'mr-auto w-full sm:w-[88%] md:w-[72%] lg:w-[55%] xl:w-[48%] max-w-3xl'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
                StartUp <span className="text-orange-400">Labs</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-400 mb-2">
                {slide.subtitle}
              </p>
              <p className="text-base font-semibold text-slate-200 mb-4">
                {slide.tagline}
              </p>
              <p className="text-slate-300 leading-relaxed mb-6 text-base md:text-lg max-w-none">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4 justify-start">
                <Link
                  to={slide.primaryCta.to}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full transition-colors shadow-lg text-sm md:text-base"
                >
                  {slide.primaryCta.label}
                </Link>
                <Link
                  to={slide.secondaryCta.to}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full transition-colors shadow-lg text-sm md:text-base"
                >
                  {slide.secondaryCta.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Startups</h2>
            <p className="section-subtitle">Discover innovative startups looking for team members</p>
          </div>
          {startups.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400">No startups yet. Be the first founder!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup, i) => (
                <motion.div
                  key={startup._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card h-full flex flex-col"
                >
                  <div className="h-48 bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center p-4">
                    <img
                      src={startup.logo || `https://ui-avatars.com/api/?name=${startup.startup_name}&size=128`}
                      alt={startup.startup_name}
                      className="w-24 h-24 object-contain rounded-xl"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{startup.startup_name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">By {startup.founder_email.split('@')[0]}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full w-fit">
                      {startup.industry}
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 flex-1 line-clamp-2">{startup.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <FiUsers size={14} /> Team: {startup.team_size_needed || 5}
                      </span>
                      <Link to={`/startups/${startup._id}`} className="text-orange-500 text-sm font-semibold hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/startups" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-8 rounded-full transition-colors">
              View All Startups
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Opportunities</h2>
            <p className="section-subtitle">Latest roles open for talented collaborators</p>
          </div>
          {opportunities.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400">No opportunities posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div key={opp._id} className="card h-full flex flex-col p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{opp.role_title}</h3>
                  <p className="text-sm text-orange-500 font-medium mt-1">{opp.startup_id?.startup_name || 'Startup'}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(opp.required_skills || []).slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded">{skill}</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-auto pt-4">
                    Deadline: {new Date(opp.deadline).toLocaleDateString()}
                  </p>
                  <Link to={`/opportunities/${opp._id}`} className="mt-3 text-orange-500 text-sm font-semibold hover:underline">
                    Apply Now →
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/opportunities" className="btn-primary">Browse All Opportunities</Link>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Join StartUp Labs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiBriefcase, title: 'Find Your Match', desc: 'Browse startups and opportunities that align with your skills and passion.' },
              { icon: FiUsers, title: 'Build Great Teams', desc: 'Founders can recruit top talent and grow their startup with the right people.' },
              { icon: FiTrendingUp, title: 'Grow Together', desc: 'Join a community of innovators building the next generation of startups.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group text-center p-6 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 cursor-default transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 hover:bg-orange-50/50 dark:hover:bg-slate-800"
              >
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-orange-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                  <Icon className="text-orange-500 transition-colors duration-300 group-hover:text-white" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-orange-500 dark:group-hover:text-orange-400">
                  {title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics - dark section */}
      {/* Statistics */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-slate-50 dark:from-[#0a0f1a] dark:via-slate-900 dark:to-[#0a0f1a] text-slate-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Startup Statistics</h2>
            <p className="text-orange-500 dark:text-orange-400 mt-2">Our growing community at a glance</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Active Startups' },
              { num: '1,200+', label: 'Opportunities Posted' },
              { num: '3,000+', label: 'Collaborators' },
              { num: '850+', label: 'Teams Formed' },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="p-6 rounded-xl border border-orange-100 bg-white shadow-sm hover:shadow-md hover:border-orange-200 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:shadow-lg dark:hover:shadow-orange-500/5 transition-all"
              >
                <div className="text-4xl font-bold text-orange-500 dark:text-orange-400">{num}</div>
                <div className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
