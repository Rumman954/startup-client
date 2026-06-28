import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import Logo from './Logo';

const socialLinks = [
  { href: 'https://github.com/Rumman954', icon: FiGithub, label: 'GitHub' },
  { href: 'https://x.com/MdAbuTalhaRumm1', icon: FiTwitter, label: 'X (Twitter)' },
  { href: 'https://www.linkedin.com/in/md-abu-talha-rumman/', icon: FiLinkedin, label: 'LinkedIn' },
];

const Footer = () => {
  return (
    <footer className="premium-footer mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          <div className="md:col-span-1">
            <div className="mb-5">
              <Logo className="h-12 max-w-[220px]" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Building the future together. Connect founders with talented collaborators at StartUp Labs.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-5 tracking-tight">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                ['Home', '/'],
                ['About', '/about'],
                ['Browse Startups', '/startups'],
                ['Career & Culture', '/career-culture'],
                ['Jobs', '/opportunities'],
                ['Login', '/login'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-orange-400 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-5 tracking-tight">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5 hover:text-orange-400 transition-colors">
                <FiMail className="text-orange-500 shrink-0" /> support@startuplabs.com
              </li>
              <li className="flex items-center gap-2.5 hover:text-orange-400 transition-colors">
                <FiPhone className="text-orange-500 shrink-0" /> +8801605357646
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-5 tracking-tight">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-orange-500 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} StartUp Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
