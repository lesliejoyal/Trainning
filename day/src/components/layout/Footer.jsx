import React from 'react';
import { Link } from 'react-router-dom';

const AdibasLogo = ({ className = '' }) => (
  <svg className={className} width="60" height="42" viewBox="0 0 100 70" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    {/* 3-stripe mountain logo */}
    <polygon points="18,70 0,38 10,32 28,64" />
    <polygon points="50,70 14,8  24,2  60,64" />
    <polygon points="82,70 36,8  46,2  92,64" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto text-black text-sm">
      {/* Newsletter Banner */}
      <div className="bg-yellow-400 py-14 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Join adiClub & Get 15% Off</h2>
        <p className="font-bold text-gray-700 mb-6">Sign up for free and get exclusive access to members-only deals.</p>
        <Link
          to="/register"
          className="bg-black text-white font-black uppercase tracking-wider py-4 px-10 inline-flex items-center gap-3 hover:bg-gray-800 transition-colors text-sm"
        >
          Sign Up For Free <span>→</span>
        </Link>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-black uppercase tracking-wider mb-4 text-xs">Sport</h3>
          <ul className="space-y-3">
            {['Football', 'Cricket', 'Running', 'Basketball', 'Tennis'].map(s => (
              <li key={s}>
                <Link to={`/shop?category=${s}`} className="text-gray-600 hover:text-black hover:underline font-medium">{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-black uppercase tracking-wider mb-4 text-xs">Support</h3>
          <ul className="space-y-3">
            {[['Help', '/contact'], ['Returns & Exchanges', '/orders'], ['Order Tracker', '/orders'], ['Size Guide', '/shop'], ['Store Locator', '/contact']].map(([label, path]) => (
              <li key={label}>
                <Link to={path} className="text-gray-600 hover:text-black hover:underline font-medium">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-black uppercase tracking-wider mb-4 text-xs">Company</h3>
          <ul className="space-y-3">
            {[['About Us', '/about'], ['Careers', '/about'], ['Sustainability', '/about'], ['Press', '/about'], ['Contact', '/contact']].map(([label, path]) => (
              <li key={label}>
                <Link to={path} className="text-gray-600 hover:text-black hover:underline font-medium">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-black uppercase tracking-wider mb-4 text-xs">Follow Adibas</h3>
          <div className="flex gap-3 mb-6">
            {['f', 'X', 'in', 'yt'].map(icon => (
              <a
                key={icon}
                href="#"
                className="w-9 h-9 bg-black text-white flex items-center justify-center font-black text-xs hover:bg-gray-700 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
          <div className="mt-4">
            <AdibasLogo className="text-black" />
            <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
              India's leading sportswear brand. Built for champions.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#111] text-[#888] py-5 text-xs text-center px-4">
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          {['Privacy Policy', 'Terms & Conditions', 'Cookie Settings', 'Accessibility'].map((item) => (
            <Link key={item} to="/about" className="hover:text-white hover:underline transition-colors">
              {item}
            </Link>
          ))}
        </div>
        <p>© {new Date().getFullYear()} Adibas India Marketing Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
