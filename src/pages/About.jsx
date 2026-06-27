import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCode, FiEdit3, FiSettings, FiShield, FiTrendingUp, FiZap } from 'react-icons/fi';
import ContactModal from '../components/ContactModal';
import ReviewMarquee from '../components/ReviewMarquee';
import { BUILT_SECTION, CORE_VALUES, CUSTOMER_REVIEWS, HOW_WE_DO_IT, MISSION_VISION, MISSION_VISION_INTRO } from '../data/aboutSections';

const VALUE_ICONS = [FiTrendingUp, FiCode, FiShield, FiZap];

const HOW_WE_DO_IT_ICONS = {
  design: FiEdit3,
  build: FiCode,
  sustain: FiSettings,
};

const ValueBlock = ({ icon: Icon, title, description, className = '' }) => (
  <div className={`py-8 sm:py-10 ${className}`}>
    <div className="flex items-start gap-3.5 mb-4">
      <Icon className="text-orange-500 shrink-0 mt-1" size={24} />
      <h3 className="core-values-heading text-slate-900 dark:text-white">{title}</h3>
    </div>
    <p className="core-values-body text-slate-600 dark:text-slate-400 pl-9 sm:pl-10">
      {description}
    </p>
  </div>
);

const About = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
  <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
    {/* Hero — Riseup Labs style: two columns, text left + image right */}
    <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 bg-gradient-to-br from-[#fff0f0] via-[#fff8f5] to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg sm:text-xl font-bold mb-5 tracking-tight">
              <span className="text-orange-500">About </span>
              <span className="text-sky-600 dark:text-sky-400">Us</span>
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] font-bold text-slate-900 dark:text-white leading-[1.2] mb-6">
              Building Startup Teams That Win Since 2024
            </h1>
            <p className="text-slate-800 dark:text-slate-300 text-[15px] sm:text-base leading-[1.75] mb-9 max-w-xl">
              Meet StartUp Labs, a founder-first collaboration platform, connects startups with
              skilled professionals and delivers hiring, teamwork, and growth solutions that help
              ventures innovate faster, scale smarter, and grow sustainably.
            </p>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#2e203c] via-violet-900 to-[#e85d2c] hover:opacity-95 text-white font-semibold text-base sm:text-[17px] px-9 py-3.5 rounded-full transition-opacity shadow-md shadow-orange-500/15 mb-10"
            >
              Let&apos;s Build the Future
            </button>

            <div className="inline-flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-slate-700 px-4 sm:px-5 py-3 sm:py-3.5">
              <div className="w-14 sm:w-16 h-14 sm:h-16 shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src="/about/fifa.png"
                  alt="Industry excellence award"
                  className="h-full w-full object-contain scale-[1.55] origin-center"
                />
              </div>
              <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                <div className="shrink-0">
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] leading-none mb-1.5">
                    Recognized On
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                    StartUp
                    <span className="text-orange-500">.</span>
                    Labs
                  </p>
                </div>
                <div className="flex flex-col items-start pl-3 sm:pl-4 border-l border-slate-200 dark:border-slate-600 shrink-0">
                  <span className="flex gap-0.5 text-[#e53935] text-base sm:text-lg leading-none tracking-tight" aria-hidden>
                    ★★★★★
                  </span>
                  <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] mt-1.5 leading-none">
                    500+ Startups
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10 dark:shadow-black/30 border border-slate-100 dark:border-slate-700/50">
              <img
                src="/about/ict-sector-work.webp"
                alt="StartUp Labs team collaborating in the ICT sector"
                className="w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[420px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[2.75rem] font-bold text-slate-900 dark:text-white leading-[1.2] mb-5 sm:mb-6 max-w-4xl">
            {MISSION_VISION_INTRO.title}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-[1.75] max-w-4xl">
            {MISSION_VISION_INTRO.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 xl:gap-16">
          {MISSION_VISION.map((section, i) => (
            <motion.article
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="overflow-hidden mb-6 sm:mb-7">
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-5">
                {section.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-[15px] sm:text-base leading-[1.75]">
                {section.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-20 lg:py-24 bg-[#0a1120]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.15] mb-8 sm:mb-10">
              <span className="block text-white">{BUILT_SECTION.line1}</span>
              <span className="block bg-gradient-to-r from-orange-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                {BUILT_SECTION.line2}
              </span>
            </h2>
            <div className="space-y-5 sm:space-y-6 mb-9 sm:mb-10 max-w-2xl">
              {BUILT_SECTION.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-slate-300 text-[15px] sm:text-base leading-[1.75]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="inline-flex w-fit items-center justify-center bg-white hover:bg-orange-50 text-orange-500 hover:text-orange-600 font-semibold text-base sm:text-[17px] px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-orange-500/25"
            >
              {BUILT_SECTION.cta}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full min-h-[480px] sm:min-h-[540px] lg:min-h-0"
          >
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden w-full h-full min-h-[480px] sm:min-h-[540px] lg:min-h-[640px] xl:min-h-[700px]">
              <img
                src={BUILT_SECTION.image}
                alt={BUILT_SECTION.imageAlt}
                className="w-full h-full min-h-[480px] sm:min-h-[540px] lg:min-h-[640px] xl:min-h-[700px] object-fill object-center"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="core-values-copy px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-screen-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="core-values-title text-slate-900 dark:text-white text-center mb-12 sm:mb-14 lg:mb-16"
        >
          {CORE_VALUES.title}
        </motion.h2>

        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] gap-10 xl:gap-14 items-stretch">
          <div className="flex flex-col justify-center">
            <ValueBlock
              icon={VALUE_ICONS[0]}
              title={CORE_VALUES.left[0].title}
              description={CORE_VALUES.left[0].description}
              className="pb-8"
            />
            <div className="border-t border-slate-200 dark:border-slate-700" />
            <ValueBlock
              icon={VALUE_ICONS[1]}
              title={CORE_VALUES.left[1].title}
              description={CORE_VALUES.left[1].description}
              className="pt-8"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center px-2"
          >
            <div className="rounded-2xl overflow-hidden w-full max-w-[420px] xl:max-w-[480px] shadow-lg shadow-slate-900/10">
              <img
                src={CORE_VALUES.image}
                alt={CORE_VALUES.imageAlt}
                className="w-full aspect-[4/3] object-cover object-center"
              />
            </div>
          </motion.div>

          <div className="flex flex-col justify-center">
            <ValueBlock
              icon={VALUE_ICONS[2]}
              title={CORE_VALUES.right[0].title}
              description={CORE_VALUES.right[0].description}
              className="pb-8"
            />
            <div className="border-t border-slate-200 dark:border-slate-700" />
            <ValueBlock
              icon={VALUE_ICONS[3]}
              title={CORE_VALUES.right[1].title}
              description={CORE_VALUES.right[1].description}
              className="pt-8"
            />
          </div>
        </div>

        <div className="lg:hidden space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-md"
          >
            <img
              src={CORE_VALUES.image}
              alt={CORE_VALUES.imageAlt}
              className="w-full aspect-[4/3] object-cover object-center"
            />
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[...CORE_VALUES.left, ...CORE_VALUES.right].map((value, i) => (
              <ValueBlock
                key={value.title}
                icon={VALUE_ICONS[i]}
                title={value.title}
                description={value.description}
                className="py-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-slate-900 dark:text-white mb-4">
            {HOW_WE_DO_IT.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            {HOW_WE_DO_IT.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {HOW_WE_DO_IT.steps.map((step, i) => {
            const Icon = HOW_WE_DO_IT_ICONS[step.id];
            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-none px-6 sm:px-8 py-10 sm:py-12 text-center transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 dark:hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/15"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 group-hover:bg-orange-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-orange-500/25 group-hover:shadow-lg group-hover:shadow-orange-500/35 group-hover:scale-110 transition-all duration-300">
                  <Icon className="text-white" size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>

    <section id="reviews" className="py-14 sm:py-16 lg:py-20 bg-slate-50 dark:bg-slate-800/40 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 sm:mb-12 px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {CUSTOMER_REVIEWS.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          {CUSTOMER_REVIEWS.subtitle}
        </p>
      </motion.div>

        <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-slate-50 dark:from-slate-800/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-slate-50 dark:from-slate-800/40 to-transparent z-10" />

        <ReviewMarquee items={CUSTOMER_REVIEWS.items} />
      </div>
    </section>

    <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      <div className="max-w-3xl mx-auto text-center rounded-2xl bg-slate-900 dark:bg-slate-800 px-8 py-12 sm:py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Ready to Join StartUp Labs?
        </h2>
        <p className="text-slate-300 mb-8 leading-relaxed">
          Whether you are launching a startup or looking for your next opportunity, we are here to help.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Get Started <FiArrowRight />
          </Link>
          <Link
            to="/startups"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-colors border border-white/20"
          >
            Browse Startups
          </Link>
        </div>
      </div>
    </section>

    <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
  </div>
  );
};

export default About;
