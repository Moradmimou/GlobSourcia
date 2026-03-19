import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ onBack, onNavigate, lang, onLangChange }) => {
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
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8">Privacy Policy</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-12 font-medium">Last updated: March 15, 2026</p>

            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">1. Introduction</h3>
                <p>
                  At Glob$ourcia, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our global sourcing and logistics platform.
                </p>
                <p>
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">2. Collection of Your Information</h3>
                <p>
                  We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site.</li>
                  <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                  <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">3. Use of Your Information</h3>
                <p>
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create and manage your account.</li>
                  <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
                  <li>Manage your RFQs, shipments, and logistics operations.</li>
                  <li>Improve our platform and develop new products and services.</li>
                  <li>Communicate with you about products, services, offers, and events.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">4. Disclosure of Your Information</h3>
                <p>
                  We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                  <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">5. Security of Your Information</h3>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any type of misuse or interception.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">6. Contact Us</h3>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="font-bold text-zinc-900 dark:text-white">Glob$ourcia Privacy Team</p>
                  <p>Email: quote@globsourcia.com</p>
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
