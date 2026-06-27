import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiAward,
  FiGlobe,
  FiHeart,
  FiShare2,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

const TEAM_FACES = Array.from({ length: 12 }, (_, i) => `/career-hero/hero-${i + 1}.jfif`);

const WHY_JOIN = [
  { icon: FiZap, title: 'Real Ownership', desc: 'Your work. Your call. Real ownership from day one.' },
  { icon: FiTrendingUp, title: 'Leadership Growth', desc: 'Grow faster through trust, training, and mobility.' },
  { icon: FiGlobe, title: 'Global Impact', desc: 'Launch products that reach real users worldwide.' },
  { icon: FiUsers, title: 'Collective Strength', desc: 'Work with teams that support, challenge, and sharpen.' },
  { icon: FiShare2, title: 'Connected Culture', desc: 'Celebrate, connect, and grow beyond everyday work.' },
  { icon: FiAward, title: 'Proven Legacy', desc: 'Join a trusted company with a name you can proudly own.' },
];

const BENEFITS_ROW1 = [
  {
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=360&fit=crop',
    title: 'Work-Life Balance',
    desc: 'Enjoy fair leave, paid holidays, vacations, and time to truly recharge.',
  },
  {
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=360&fit=crop',
    title: 'Competitive Salary & Rewards',
    desc: 'Get competitive pay, meaningful benefits, and bonuses that recognize your impact.',
  },
  {
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=360&fit=crop',
    title: 'Family Health Support',
    desc: 'Protect your loved ones with health coverage that supports real peace of mind.',
  },
];

const BENEFITS_ROW2 = [
  {
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=360&fit=crop',
    title: 'Continuous Learning',
    desc: 'Build new skills through training, mentorship, certifications, and growth-focused support.',
  },
  {
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=360&fit=crop',
    title: 'Open Work Culture',
    desc: 'Work in a culture where ideas move freely, voices matter, and teams collaborate openly.',
  },
  {
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=360&fit=crop',
    title: 'Performance Appreciation',
    desc: 'Feel valued through regular appreciation, recognition, and support for your best work.',
  },
];

const CareerCulture = () => (
  <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
    {/* Hero — Riseup Labs style: photo grid + white fade + centered text */}
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 pb-14 sm:pb-16">
      <div className="px-8 sm:px-10 lg:px-12">
        <div className="max-w-7xl mx-auto relative">
          <div aria-hidden className="relative overflow-hidden">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-1.5 brightness-[0.65] saturate-[0.7]">
              {TEAM_FACES.slice(0, 8).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-full aspect-[4/5] md:aspect-square object-cover object-top"
                />
              ))}
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-1.5 mt-1 md:mt-1.5 brightness-[0.65] saturate-[0.7]">
              <div className="hidden md:block md:col-span-2" />
              {TEAM_FACES.slice(8, 12).map((src, i) => (
                <img
                  key={i + 8}
                  src={src}
                  alt=""
                  className="w-full aspect-[4/5] md:aspect-square object-cover object-top"
                />
              ))}
              <div className="hidden md:block md:col-span-2" />
            </div>
            <div className="absolute inset-0 bg-slate-900/45 dark:bg-slate-900/65 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/75 to-white dark:from-slate-900/15 dark:via-slate-900/80 dark:to-slate-900 pointer-events-none" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28 px-4">
            <p className="text-lg sm:text-xl md:text-2xl font-bold mb-6 tracking-tight">
              <span className="text-orange-500">Career</span>
              <span className="text-slate-900 dark:text-white"> & </span>
              <span className="text-sky-700 dark:text-sky-400">Culture</span>
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Do You Love Building Things That Reach Millions?
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Whether you write code, design experiences, manage operations, or imagine what comes next —
              there&apos;s a role at StartUp Labs where your skills will matter.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/opportunities"
                className="inline-flex items-center gap-3 bg-slate-900 text-white font-semibold pl-6 pr-2 py-2.5 rounded-full hover:bg-slate-800 transition-colors"
              >
                Join Us
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                  <FiArrowRight className="text-slate-900" />
                </span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-800 to-orange-500 text-white font-semibold pl-6 pr-2 py-2.5 rounded-full hover:opacity-95 transition-opacity shadow-md shadow-orange-500/20"
              >
                Explore Life at StartUp Labs
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                  <FiArrowRight className="text-orange-500" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Community banner */}
    <section className="px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center">
        <div className="flex-1 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-6">
            <span className="text-slate-900 dark:text-white">Connect With the </span>
            <span className="text-orange-500">StartUp Labs </span>
            <span className="text-sky-600 dark:text-sky-400">Career </span>
            <span className="text-slate-900 dark:text-white">Community</span>
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-semibold text-green-600">
              Glassdoor ★★★★★
            </div>
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300">
              Review us on Google
            </div>
            <div className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm font-medium">
              Connect on LinkedIn
            </div>
          </div>
        </div>
        <div className="w-full md:w-[45%] h-56 md:h-72 relative">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop"
            alt="StartUp Labs team"
            className="absolute inset-0 w-full h-full object-cover md:rounded-l-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 dark:from-slate-800/80 to-transparent md:block hidden" />
        </div>
      </div>
    </section>

    {/* Why People Join Us */}
    <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-sky-50/80 to-white dark:from-slate-800/30 dark:to-slate-900">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-tight">
            <span className="text-orange-500">Why People </span>
            <span className="text-sky-700 dark:text-sky-400">Join Us</span>
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
            Six Reasons Our Team Stays – and Grows.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Because a great career isn&apos;t something that happens to you — it&apos;s something you build.
            Here&apos;s how we help.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY_JOIN.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 cursor-default transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 hover:bg-orange-50/50 dark:hover:bg-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-orange-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                <Icon className="text-orange-600 dark:text-orange-400 transition-colors duration-300 group-hover:text-white" size={18} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 transition-colors duration-300 group-hover:text-orange-500 dark:group-hover:text-orange-400">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          We Take Care of Our People.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-12 leading-relaxed">
          Happy people build better things. These are the benefits we offer — not to check a box, but because
          we actually believe a good life outside of work makes you better inside of it.
        </p>

        {[BENEFITS_ROW1, BENEFITS_ROW2].map((row, rowIdx) => (
          <div key={rowIdx} className={`grid md:grid-cols-3 gap-8 ${rowIdx > 0 ? 'mt-12' : ''}`}>
            {row.map(({ img, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <img
                  src={img}
                  alt={title}
                  className="w-full h-52 object-cover rounded-lg mb-4 group-hover:opacity-95 transition-opacity"
                />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>

    {/* Life at StartUp Labs */}
    <section className="px-4 py-16 bg-slate-100 dark:bg-slate-800/40 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        <span className="text-orange-500">Life at </span>
        <span className="text-sky-700 dark:text-sky-400">StartUp Labs</span>
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto text-base">
        Ready to build the future with us? Explore open roles and join our growing team.
      </p>
      <Link to="/opportunities" className="btn-primary inline-block mt-8">
        View Open Jobs <FiHeart className="inline ml-1 -mt-0.5" />
      </Link>
    </section>
  </div>
);

export default CareerCulture;
