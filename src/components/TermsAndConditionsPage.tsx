import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldCheck, Scale, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

export const TermsAndConditionsPage: React.FC<LegalPageProps> = ({ onBack, onNavigate, lang, onLangChange }) => {
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
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8">Terms & Conditions</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-12 font-medium">Last updated: March 15, 2026</p>

            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">1. Agreement to Terms</h3>
                <p>
                  These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Glob$ourcia (“we,” “us” or “our”), concerning your access to and use of the Glob$ourcia website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                </p>
                <p>
                  You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">2. Sourcing & Logistics Services</h3>
                <p>
                  Glob$ourcia provides a managed platform for global sourcing, quality control, and logistics. By using our services, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We act as your agent in identifying and vetting suppliers.</li>
                  <li>Final production quality is subject to the agreed-upon inspection standards.</li>
                  <li>Shipping lead times are estimates and subject to global logistics conditions.</li>
                  <li>You are responsible for providing accurate product specifications and requirements.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">3. User Representations</h3>
                <p>
                  By using the Site, you represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All registration information you submit will be true, accurate, current, and complete.</li>
                  <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                  <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
                  <li>You are not a minor in the jurisdiction in which you reside.</li>
                  <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">4. Fees and Payment</h3>
                <p>
                  We may charge fees for our sourcing and logistics services. You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order.
                </p>
                <p>
                  We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">5. Intellectual Property Rights</h3>
                <p>
                  Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">6. Limitation of Liability</h3>
                <p>
                  In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">7. Governing Law</h3>
                <p>
                  These Terms and Conditions and your use of the Site are governed by and construed in accordance with the laws of the State of New York applicable to agreements made and to be entirely performed within the State of New York, without regard to its conflict of law principles.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
