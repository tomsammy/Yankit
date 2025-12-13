import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/Header/Logo';

const Footer = () => {
  const footerLinks = {
    legal: [{
      name: "Terms of Service",
      path: "/terms"
    }, {
      name: "Privacy Policy",
      path: "/privacy"
    }, {
      name: "Cookie Policy",
      path: "/cookies"
    }],
    company: [{
      name: "About Us",
      path: "/about"
    }, {
      name: "Careers",
      path: "/careers"
    }, {
      name: "Press",
      path: "/press"
    }],
    support: [{
      name: "Help Center",
      path: "/support"
    }, {
      name: "Contact Us",
      path: "/support"
    }]
  };
  return <footer className="bg-gradient-to-tr from-primary via-blue-600 to-purple-700 text-white py-12 md:py-16 shadow-inner-top">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo isFooter={true} />
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-4"></p>
            
          </div>

          {/* Navigation Links */}
          {Object.keys(footerLinks).map(key => <div key={key} className="md:col-span-1">
              <h3 className="font-semibold text-lg mb-4 text-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <ul className="space-y-2">
                {footerLinks[key].map(link => <li key={link.name}>
                    <Link to={link.path} className="text-blue-100 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>)}
              </ul>
            </div>)}
        </div>

        <div className="border-t border-blue-500/50 mt-10 pt-8 text-center text-blue-200 text-xs">
          <span className="font-vernaccia-bold">© Yankit Proprietary Ltd. ABN: 57 688 896 620. ACN: 689 896 620.</span>
        </div>
      </div>
    </footer>;
};
export default Footer;