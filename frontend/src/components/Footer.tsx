import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="glass-card border-t border-white/5 text-slate-400 py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3 uppercase tracking-widest">About Us</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Whether you're reconnecting with old friends, staying in touch
              with family members across the globe, or fostering new
              relationships with like-minded individuals.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3 uppercase tracking-widest">Quick Links</h2>
            <ul className="list-none text-sm space-y-2">
              <li className="m-0 p-0 block">
                <a href="/#features" className="text-slate-500 hover:text-blue-400 transition-colors">Features</a>
              </li>
              <li className="m-0 p-0 block">
                <a href="/#faq" className="text-slate-500 hover:text-blue-400 transition-colors">FAQs</a>
              </li>
              <li className="m-0 p-0 block">
                <a href="/#contact" className="text-slate-500 hover:text-blue-400 transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="mb-4" id="contact">
            <h2 className="text-sm font-semibold text-slate-100 mb-3 uppercase tracking-widest">Follow Us</h2>
            <div className="flex space-x-4">
              <a
                href="https://github.com/gyanendra-baghel"
                className="text-slate-500 hover:text-blue-400 transition-colors text-sm"
                target="_blank"
              >
                Github
              </a>
              <a
                href="https://twitter.com/Gyan_Singh01"
                className="text-slate-500 hover:text-blue-400 transition-colors text-sm"
                target="_blank"
              >
                Twitter
              </a>
              <a
                href="https://www.linkedin.com/in/gyanendra-baghel"
                className="text-slate-500 hover:text-blue-400 transition-colors text-sm"
                target="_blank"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-xs text-slate-600 text-center">
          <p>&copy; 2024 Social. All rights reserved.</p>
          <p className="mt-1">
            Designed by{" "}
            <a
              href="https://gyanendra-baghel.vercel.app/"
              className="text-slate-500 hover:text-blue-400 transition-colors font-medium"
              target="_blank"
            >
              Gyanendra Baghel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
