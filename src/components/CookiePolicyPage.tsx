import React from 'react';
import { motion } from 'motion/react';
import { Cookie, Shield, Info, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

export const CookiePolicyPage: React.FC<LegalPageProps> = ({ onBack, onNavigate, lang, onLangChange }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans transition-colors">
      <main className="pt-40 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Legal</h2>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8">Cookie Policy</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-12 font-medium">Last updated: March 15, 2026</p>

            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">1. What are Cookies?</h3>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                </p>
                <p>
                  At Glob$ourcia, we use cookies to enhance your experience on our platform, remember your preferences, and help us understand how our services are being used.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">2. How We Use Cookies</h3>
                <p>
                  We use cookies for several purposes, including:
                </p>
                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    <strong>Essential Cookies:</strong> These are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the website functions.
                  </li>
                  <li>
                    <strong>Performance and Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve our platform's performance and user experience.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> These allow our website to remember choices you make (such as your language preference or the region you are in) and provide enhanced, more personal features.
                  </li>
                  <li>
                    <strong>Logistics & Tracking Cookies:</strong> Specifically for our platform, we use cookies to maintain your session while managing RFQs and tracking shipments across different regions and time zones.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">3. Types of Cookies We Use</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="py-4 font-black uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500">Category</th>
                        <th className="py-4 font-black uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                      <tr>
                        <td className="py-4 font-bold text-zinc-900 dark:text-white">Authentication</td>
                        <td className="py-4 text-zinc-500 dark:text-zinc-400">To identify you when you visit our website and as you navigate our platform.</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-zinc-900 dark:text-white">Security</td>
                        <td className="py-4 text-zinc-500 dark:text-zinc-400">Used as an element of the security measures used to protect user accounts and the platform generally.</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-zinc-900 dark:text-white">Localization</td>
                        <td className="py-4 text-zinc-500 dark:text-zinc-400">To store information about your preferences and to personalize the website for you (e.g., language settings).</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-zinc-900 dark:text-white">Analysis</td>
                        <td className="py-4 text-zinc-500 dark:text-zinc-400">To help us analyze the use and performance of our website and services.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">4. Managing Your Cookie Preferences</h3>
                <p>
                  Most web browsers allow you to control cookies through their settings. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.allaboutcookies.org</a>.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">5. Changes to This Policy</h3>
                <p>
                  We may update our Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Please re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">6. Contact Us</h3>
                <p>
                  If you have any questions about our use of cookies or other technologies, please email us at:
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="font-bold text-zinc-900 dark:text-white">Glob$ourcia Compliance Team</p>
                  <p>Email: compliance@globsourcia.com</p>
                  <p>Offices: Casablanca (Morocco), Shenzhen (China), Abidjan (Ivory Coast), Valencia (Spain)</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
