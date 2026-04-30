import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'Compare', path: '/compare' },
    { name: 'Plots', path: '/plots' }
  ];

  return (
    <nav className="glass-card p-6 mb-8 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex justify-center gap-6">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              location.pathname === link.path
                ? 'bg-blue-600 text-white shadow-2xl'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}