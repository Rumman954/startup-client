import { useEffect, useState } from 'react';
import { FiExternalLink, FiLinkedin, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PARTNER_LOGOS = [
  { name: 'Samsung', src: '/contact/partners/samsung.png' },
  { name: 'Apple', src: '/contact/partners/apple.jfif' },
  { name: 'Netflix', src: '/contact/partners/netflix.png' },
  { name: 'UNICEF', src: '/contact/partners/unicef.png' },
  { name: 'Ubisoft', src: '/contact/partners/ubisoft.jfif' },
  { name: 'WHO', src: '/contact/partners/who.jpg' },
  { name: 'BBC', src: '/contact/partners/bbc.jfif' },
  { name: 'Gameloft', src: '/contact/partners/gameloft.png' },
  { name: 'bKash', src: '/contact/partners/bkash.webp' },
  { name: 'Bioscope', src: '/contact/partners/bioscope.png' },
  { name: 'Chorki', src: '/contact/partners/chorki.png' },
  { name: 'Programming Hero', src: '/contact/partners/programming-hero.png' },
];

const BUDGET_OPTIONS = [
  'Under $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000 – $100,000',
  'Above $100,000',
];

const TIMELINE_OPTIONS = [
  'Immediately',
  'Within 2 weeks',
  'Within 1 month',
  'Within 3 months',
  'Flexible',
];

const getNextMeetingTime = () => {
  const meeting = new Date();
  meeting.setDate(meeting.getDate() + 1);
  meeting.setHours(10, 30, 0, 0);

  return meeting.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const ContactModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    budget: '',
    timeline: '',
    requirements: '',
  });

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.budget || !form.timeline || !form.requirements) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const meetingTime = getNextMeetingTime();

    toast.success(
      (t) => (
        <div className="text-sm leading-relaxed">
          <p className="font-semibold text-slate-900 mb-1">Meeting Scheduled!</p>
          <p className="text-slate-600">
            Your meeting is confirmed for{' '}
            <span className="font-semibold text-orange-500">{meetingTime}</span>
          </p>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="mt-2 text-xs font-semibold text-orange-500 hover:text-orange-600"
          >
            Dismiss
          </button>
        </div>
      ),
      { duration: 8000 }
    );

    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      budget: '',
      timeline: '',
      requirements: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close contact form"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        <div className="grid lg:grid-cols-[1fr_1.15fr]">
          <div className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Contact Us Now
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
              Start a conversation with our team to solve complex challenges and move forward with
              confidence.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              {PARTNER_LOGOS.map((logo) => (
                <div
                  key={logo.name}
                  className="h-14 sm:h-16 lg:h-[4.5rem] flex items-center justify-center rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-2 sm:px-3"
                >
                  <img
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    className="max-h-9 sm:max-h-11 lg:max-h-12 w-auto max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 items-start">
              <img
                src="/contact/talha.jpeg"
                alt="Md Abu Talha Rumman"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0"
              />
              <div>
                <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed mb-4">
                  &ldquo;Welcome! My team and I personally ensure every project gets world-class
                  attention, backed by experience you can trust.&rdquo;
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-900 dark:text-white">Md Abu Talha Rumman</p>
                  <a
                    href="https://www.linkedin.com/in/md-abu-talha-rumman/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700"
                    aria-label="LinkedIn profile"
                  >
                    <FiLinkedin size={16} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/md-abu-talha-rumman/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600"
                    aria-label="Open profile"
                  >
                    <FiExternalLink size={14} />
                  </a>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">CEO, StartUp Labs</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 bg-slate-50/80 dark:bg-slate-800/40">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Your name<span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your Full Name"
                    className="input-field mt-1.5"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email<span className="text-red-500">*</span>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="Your Email Address"
                    className="input-field mt-1.5"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Mobile phone<span className="text-red-500">*</span>
                </span>
                <div className="flex mt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 shrink-0">
                    🇧🇩 +880
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="Phone number"
                    className="input-field rounded-l-none flex-1"
                    required
                  />
                </div>
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Company name</span>
                  <input
                    type="text"
                    value={form.company}
                    onChange={update('company')}
                    placeholder="Company Name"
                    className="input-field mt-1.5"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Company website</span>
                  <input
                    type="url"
                    value={form.website}
                    onChange={update('website')}
                    placeholder="Company Website"
                    className="input-field mt-1.5"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  What is your estimated budget for this project?<span className="text-red-500">*</span>
                </span>
                <select
                  value={form.budget}
                  onChange={update('budget')}
                  className="input-field mt-1.5"
                  required
                >
                  <option value="">Select your range</option>
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  What is your target timeline for kick-off?<span className="text-red-500">*</span>
                </span>
                <select
                  value={form.timeline}
                  onChange={update('timeline')}
                  className="input-field mt-1.5"
                  required
                >
                  <option value="">Select your timeline</option>
                  {TIMELINE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Briefly describe your requirements<span className="text-red-500">*</span>
                </span>
                <textarea
                  value={form.requirements}
                  onChange={update('requirements')}
                  placeholder="Start typing here"
                  rows={4}
                  className="input-field mt-1.5 resize-y min-h-[100px]"
                  required
                />
              </label>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-6 rounded-full transition-colors shadow-md shadow-orange-500/20"
              >
                Submit &amp; Schedule a Meeting
              </button>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                By proceeding, you agree to our{' '}
                <a href="/register" className="text-orange-500 hover:underline inline-flex items-center gap-0.5">
                  Privacy Policy <FiExternalLink size={10} />
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
