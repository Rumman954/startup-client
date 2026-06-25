import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SF</span>
              </div>
              <span className="font-bold text-xl text-white">StartupForge</span>
            </div>
            <p className="text-sm text-slate-400">
              Building the future together. Connect founders with talented collaborators.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/startups" className="hover:text-indigo-400 transition-colors">Browse Startups</Link></li>
              <li><Link to="/opportunities" className="hover:text-indigo-400 transition-colors">Opportunities</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FiMail /> support@startupforge.com</li>
              <li className="flex items-center gap-2"><FiPhone /> +1 (555) 123-4567</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors"><FiGithub size={22} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors"><FiTwitter size={22} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors"><FiLinkedin size={22} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} StartupForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
