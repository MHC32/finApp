import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';

/**
 * Composant Footer - Pied de page de l'application
 * 
 * Features:
 * - Copyright et version
 * - Liens utiles
 * - Support Light/Dark
 * - Responsive
 * 
 * @example
 * <Footer />
 */
const Footer = forwardRef(({
  showLinks = true,
  showVersion = true,
  className = ''
}, ref) => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'À propos', href: '#about' },
    { label: 'Confidentialité', href: '#privacy' },
    { label: 'Conditions', href: '#terms' },
    { label: 'Support', href: '#support' }
  ];

  return (
    <footer
      ref={ref}
      className={`
        bg-white dark:bg-gray-900
        border-t border-gray-200 dark:border-gray-800
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} FinApp Haiti</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Fait avec <Heart className="w-4 h-4 text-red-500 fill-current" /> en Haïti 🇭🇹
            </span>
          </div>

          {/* Liens */}
          {showLinks && (
            <div className="flex items-center gap-4 text-sm">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Version */}
          {showVersion && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              v1.0.0
            </div>
          )}
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

Footer.propTypes = {
  showLinks: PropTypes.bool,
  showVersion: PropTypes.bool,
  className: PropTypes.string
};

export default Footer;