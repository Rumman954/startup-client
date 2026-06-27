import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 mt-auto border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo className="h-12 max-w-[220px]" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Building the future together. Connect founders with talented collaborators at StartUp Labs.
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link to="/startups" className="hover:text-orange-500 transition-colors">Browse Startups</Link></li>
              <li><Link to="/career-culture" className="hover:text-orange-500 transition-colors">Career & Culture</Link></li>
              <li><Link to="/opportunities" className="hover:text-orange-500 transition-colors">Jobs</Link></li>
              <li><Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FiMail /> support@startuplabs.com</li>
              <li className="flex items-center gap-2"><FiPhone /> +8801605357646</li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/Rumman954"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-orange-500 transition-colors"
              >
                <FiGithub size={22} />
              </a>
              <a
                href="https://x.com/MdAbuTalhaRumm1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-orange-500 transition-colors"
              >
                <FiTwitter size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/md-abu-talha-rumman/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-orange-500 transition-colors"
              >
                <FiLinkedin size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} StartUp Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
