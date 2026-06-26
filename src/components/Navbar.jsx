import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiPhone, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const SERVICE_COLUMNS = [
  {
    title: 'Consulting & Design',
    items: [
      'Web Design',
      'Software Design',
      'Game Design',
      'Application Design',
      'User Experience & Interface Design',
      'IT Strategy & Infrastructure',
      'Application Modernization',
      'Customer Experience Transformation',
    ],
  },
  {
    title: 'Engineering & Development',
    items: [
      'Software Services',
      'Application Services',
      'Gaming Services',
      'AR, VR, MR & Metaverse',
      'Blockchain',
      'Internet of Things (IoT)',
    ],
  },
  {
    title: 'Managed Services',
    items: [
      'Software Management',
      'Application Management',
      'QA Management',
      'IT Infrastructure Management',
    ],
  },
  {
    title: 'BPO Services',
    items: [
      'Customer Support',
      'Lead Generation',
      'Contact Center',
      'eCommerce Support',
      'Technical Support',
      'Virtual Assistant',
      'Content Moderation',
      'Security Management',
      'AI & Automation',
      'Data & Analytics',
      'Cloud Services',
      'Cybersecurity',
      'Quality Engineering & Testing',
    ],
  },
];

const ABOUT_SECTIONS = [
  {
    title: 'Our Mission',
    description:
      'To empower founders and talented professionals to connect, collaborate, and build impactful startups — bridging human creativity with technology to turn bold ideas into reality.',
  },
  {
    title: 'Our Vision',
    description:
      'A world where every innovative startup idea has access to the right team, tools, and global network — making team building seamless, inclusive, and accessible for founders everywhere.',
  },
  {
    title: 'Our Achievements',
    items: [
      '500+ Active Startups Registered',
      '1,200+ Opportunities Posted',
      '3,000+ Collaborators Onboarded',
      'Teams Built Across 50+ Countries',
      'Trusted by Founders & Innovators Worldwide',
      'Award-Winning Startup Collaboration Platform',
    ],
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-orange-500 dark:text-orange-400'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <nav className="relative bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-10 max-w-[180px] md:max-w-[200px]" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setMegaMenu('about')}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  megaMenu === 'about'
                    ? 'text-orange-500 dark:text-orange-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-expanded={megaMenu === 'about'}
                aria-haspopup="true"
              >
                About
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${megaMenu === 'about' ? 'rotate-180' : ''}`}
                />
              </button>
              {megaMenu === 'about' && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-white/10 rotate-45 -mt-1.5 z-[60]"
                  aria-hidden
                />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setMegaMenu('services')}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  megaMenu === 'services'
                    ? 'text-orange-500 dark:text-orange-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-expanded={megaMenu === 'services'}
                aria-haspopup="true"
              >
                Services
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${megaMenu === 'services' ? 'rotate-180' : ''}`}
                />
              </button>
              {megaMenu === 'services' && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-white/10 rotate-45 -mt-1.5 z-[60]"
                  aria-hidden
                />
              )}
            </div>

            <NavLink to="/startups" className={navLinkClass}>Startups</NavLink>
            <NavLink to="/opportunities" className={navLinkClass}>Opportunities</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <button onClick={handleLogout} className="ml-2 flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-600">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href="tel:+8801605357646" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              <FiPhone className="text-orange-500" />
              <span className="hidden xl:inline">+8801605357646</span>
            </a>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-colors"
            >
              Let&apos;s Talk
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-slate-700 dark:text-white" onClick={() => setOpen(!open)}>
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {megaMenu && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full z-50 pt-1"
          onMouseLeave={() => setMegaMenu(null)}
        >
          <div className="fixed inset-0 top-16 bg-black/40 backdrop-blur-[2px] -z-10" aria-hidden />
          <div className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {megaMenu === 'services' ? (
                <div className="grid grid-cols-4 gap-8 xl:gap-12">
                  {SERVICE_COLUMNS.map((column) => (
                    <div key={column.title}>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
                        {column.title}
                      </h3>
                      <ul className="space-y-2.5">
                        {column.items.map((item) => (
                          <li key={item}>
                            <Link
                              to="/register"
                              className="text-sm text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors leading-snug block"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
                  {ABOUT_SECTIONS.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
                        {section.title}
                      </h3>
                      {section.description ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {section.description}
                        </p>
                      ) : (
                        <ul className="space-y-2.5">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              className="text-sm text-slate-500 dark:text-slate-400 leading-snug flex gap-2"
                            >
                              <span className="text-orange-500 mt-1 shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1a] px-4 py-3 space-y-1">
          <div>
            <button
              type="button"
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              About
              <FiChevronDown
                size={16}
                className={`transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileAboutOpen && (
              <div className="mt-1 mb-2 space-y-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 p-4">
                {ABOUT_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">{section.title}</p>
                    {section.description ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{section.description}</p>
                    ) : (
                      <ul className="space-y-1.5 pl-1">
                        {section.items.map((item) => (
                          <li key={item} className="text-sm text-slate-500 dark:text-slate-400 flex gap-2">
                            <span className="text-orange-500 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              Services
              <FiChevronDown
                size={16}
                className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileServicesOpen && (
              <div className="mt-1 mb-2 space-y-4 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 p-4">
                {SERVICE_COLUMNS.map((column) => (
                  <div key={column.title}>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">{column.title}</p>
                    <ul className="space-y-1.5 pl-1">
                      {column.items.map((item) => (
                        <li key={item}>
                          <Link
                            to="/register"
                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-orange-500"
                            onClick={() => {
                              setOpen(false);
                              setMobileServicesOpen(false);
                            }}
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/startups" className={navLinkClass} onClick={() => setOpen(false)}>Startups</NavLink>
          <NavLink to="/opportunities" className={navLinkClass} onClick={() => setOpen(false)}>Opportunities</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>Profile</NavLink>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 dark:text-red-400 font-medium">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>Login</NavLink>
              <Link to="/register" className="block btn-primary text-center mt-2" onClick={() => setOpen(false)}>Let&apos;s Talk</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
