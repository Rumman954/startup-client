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
import { FaFacebookF } from 'react-icons/fa';

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
    img: '/benefits/benefit-1.jpg?v=2',
    title: 'Work-Life Balance',
    desc: 'Enjoy fair leave, paid holidays, vacations, and time to truly recharge.',
  },
  {
    img: '/benefits/benefit-2.jpg',
    title: 'Competitive Salary & Rewards',
    desc: 'Get competitive pay, meaningful benefits, and bonuses that recognize your impact.',
  },
  {
    img: '/benefits/benefit-3.webp?v=2',
    title: 'Family Health Support',
    desc: 'Protect your loved ones with health coverage that supports real peace of mind.',
  },
];

const BENEFITS_ROW2 = [
  {
    img: '/benefits/benefit-4.jpg',
    title: 'Continuous Learning',
    desc: 'Build new skills through training, mentorship, certifications, and growth-focused support.',
  },
  {
    img: '/benefits/benefit-5.jpg',
    title: 'Open Work Culture',
    desc: 'Work in a culture where ideas move freely, voices matter, and teams collaborate openly.',
  },
  {
    img: '/benefits/benefit-6.jpg',
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

    {/* Community banner — near full-width with small side gaps */}
    <section className="px-3 sm:px-4 lg:px-5 py-10 sm:py-12 lg:py-14">
      <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 shadow-sm dark:shadow-none grid md:grid-cols-2 items-stretch">
        <div className="p-10 md:py-12 md:pl-12 md:pr-4 lg:p-14 lg:pr-6 flex flex-col justify-center bg-white dark:bg-transparent">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.12] tracking-tight mb-8">
            <span className="block text-slate-900 dark:text-white">Connect With the</span>
            <span className="block">
              <span className="text-orange-500">S</span>
              <span className="text-[#b45309] dark:text-[#d97706]">tartUp </span>
              <span className="text-[#8b7ab8] dark:text-[#a78bfa]">Labs </span>
              <span className="text-sky-600 dark:text-sky-400">Career</span>
            </span>
            <span className="block text-slate-900 dark:text-white">Community</span>
          </h2>
          <div className="flex flex-wrap items-stretch gap-4 sm:gap-5">
            <a
              href="https://www.facebook.com/mdabutalha.rumman"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 min-w-[8.5rem] sm:min-w-[9.5rem] px-5 py-3.5 bg-[#1877F2] rounded-lg min-h-[4.75rem] hover:opacity-95 transition-opacity"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[11px] sm:text-xs font-medium text-white/90 leading-none ml-9 sm:ml-10">
                  Follow us on
                </span>
                <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shrink-0">
                  <FaFacebookF className="text-[#1877F2] text-base sm:text-lg" aria-hidden />
                </span>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                  Facebook
                </span>
                </div>
              </div>
            </a>

            <a
              href="https://www.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-[2px] rounded-lg bg-gradient-to-r from-[#4285F4] via-[#FBBC05] to-[#34A853] hover:opacity-95 transition-opacity"
            >
              <div className="flex flex-col items-center justify-center gap-1 min-w-[8.5rem] sm:min-w-[9.5rem] px-5 py-3.5 bg-white dark:bg-slate-800 rounded-[6px] text-center min-h-[4.75rem]">
                <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">
                  Review us on
                </span>
                <span className="text-base sm:text-lg font-semibold tracking-tight leading-tight">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/md-abu-talha-rumman/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 min-w-[8.5rem] sm:min-w-[9.5rem] px-5 py-3.5 bg-[#0A66C2] rounded-lg text-center min-h-[4.75rem] hover:opacity-95 transition-opacity"
            >
              <span className="text-[11px] sm:text-xs font-medium text-white/90 leading-none">
                Connect with us on
              </span>
              <span className="text-base sm:text-lg font-bold text-white leading-tight">
                Linked
                <span className="inline-flex items-center justify-center bg-white text-[#0A66C2] text-sm font-bold px-1 rounded-sm ml-0.5">
                  in
                </span>
              </span>
            </a>
          </div>
        </div>
        <div className="w-full relative min-h-[17rem] sm:min-h-[20rem] md:min-h-[22rem] lg:min-h-[26rem]">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop"
            alt="StartUp Labs team"
            className="absolute inset-0 w-full h-full object-cover object-center dark:brightness-100"
          />
          <div className="absolute inset-0 hidden md:block bg-[linear-gradient(to_right,rgba(255,255,255,1)_0%,rgba(255,255,255,0.75)_8%,rgba(255,255,255,0.25)_22%,transparent_38%)] dark:bg-[linear-gradient(to_right,rgba(30,41,59,0.95)_0%,rgba(30,41,59,0.5)_18%,rgba(30,41,59,0.12)_35%,transparent_50%)]" />
        </div>
      </div>
    </section>

    {/* Why People Join Us */}
    <section className="px-3 sm:px-4 lg:px-5 py-12 sm:py-14 lg:py-16 bg-white dark:bg-slate-900">
      <div className="w-full grid lg:grid-cols-[1fr_1.55fr] gap-8 lg:gap-12 xl:gap-14 items-center">
        <div className="why-join-copy max-w-lg lg:max-w-xl pl-10 md:pl-12 lg:pl-14">
          <p className="text-2xl sm:text-[1.65rem] lg:text-[1.75rem] font-bold mb-5 tracking-tight leading-snug">
            <span className="text-orange-500">Why People </span>
            <span className="text-sky-700 dark:text-sky-400">Join Us</span>
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-[3.15rem] font-extrabold text-slate-900 dark:text-white leading-[1.12] tracking-tight mb-7">
            Six Reasons Our Team Stays – and Grows.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg sm:text-xl font-medium">
            Because a great career isn&apos;t something that happens to you — it&apos;s something you build.
            Here&apos;s how we help.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pr-10 md:pr-12 lg:pr-14">
          {WHY_JOIN.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl p-6 sm:p-7 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 cursor-default transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 hover:bg-orange-50/60 dark:hover:bg-slate-800"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFD8C4] dark:bg-orange-400/30 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-orange-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                <Icon className="text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-white" size={22} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2.5 leading-snug transition-colors duration-300 group-hover:text-orange-500 dark:group-hover:text-orange-400">
                {title}
              </h3>
              <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-300">
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
              >
                <div className="group relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-52 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {desc}
                </p>
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
