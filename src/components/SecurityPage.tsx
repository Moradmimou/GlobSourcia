import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  ShieldCheck, 
  FileLock, 
  UserCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
  Server,
  Database,
  Cloud
} from 'lucide-react';
import { motion } from 'motion/react';

interface SecurityPageProps {
  onBack: () => void;
  onRegister: () => void;
  onNavigate: (view: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onBack, onRegister, onNavigate, lang, onLangChange }) => {
  const securityFeatures = [
    {
      title: "Intellectual Property Protection",
      description: "Your designs and trade secrets are safe with us. We enforce strict NDAs across our entire network and use encrypted document storage to prevent unauthorized access.",
      icon: <FileLock className="w-8 h-8" />,
      details: ["Legal Frameworks", "Encrypted Document Vault", "Strict Access Controls", "IP Rights Enforcement"]
    },
    {
      title: "Verified Supplier Network",
      description: "Every supplier in our network undergoes a rigorous verification process. We perform background checks, financial audits, and on-site factory inspections before they are approved.",
      icon: <UserCheck className="w-8 h-8" />,
      details: ["On-site Audits", "Financial Stability Checks", "Performance History", "Compliance Verification"]
    },
    {
      title: "Secure Payment Escrow",
      description: "We protect your capital. Payments are held in a secure escrow system and only released to suppliers once you confirm quality and receipt of goods.",
      icon: <Lock className="w-8 h-8" />,
      details: ["Escrow Protection", "Multi-factor Authentication", "Fraud Detection", "Secure Global Transfers"]
    },
    {
      title: "Data Encryption & Privacy",
      description: "All communications and data stored on our platform are encrypted using industry-standard protocols. We are committed to maintaining the highest levels of data privacy.",
      icon: <ShieldCheck className="w-8 h-8" />,
      details: ["AES-256 Encryption", "SSL/TLS Protocols", "GDPR Compliance", "Regular Security Audits"]
    },
    {
      title: "Real-Time Transparency",
      description: "Eliminate the 'black box' of global sourcing. Our platform provides real-time visibility into every stage of your supply chain, from production to delivery.",
      icon: <Eye className="w-8 h-8" />,
      details: ["Live Milestone Tracking", "Audit Trail Logs", "Transparent Documentation", "Instant Notifications"]
    },
    {
      title: "Infrastructure Security",
      description: "Our platform is built on world-class cloud infrastructure with redundant systems and continuous monitoring to ensure 99.9% uptime and data integrity.",
      icon: <Server className="w-8 h-8" />,
      details: ["Cloud Security", "Automated Backups", "DDoS Protection", "24/7 Monitoring"]
    }
  ];

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans transition-colors duration-300">
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Security & Trust</h2>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 text-zinc-900 dark:text-white">
              Built on a Foundation of <br />
              <span className="text-secondary">Uncompromising Trust.</span>
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Security isn't a feature—it's the core of everything we do. We protect your data, your capital, and your intellectual property at every stage of the sourcing journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 hover:border-primary/40 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all mb-8 border border-zinc-200 dark:border-zinc-700">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-zinc-900 dark:text-white">{feature.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Compliance Logos */}
          <div className="mt-32 py-20 border-y border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale dark:invert">
              <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">
                <Database className="w-6 h-6" />
                ISO 27001
              </div>
              <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">
                <Shield className="w-6 h-6" />
                GDPR
              </div>
              <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">
                <Cloud className="w-6 h-6" />
                SOC 2
              </div>
              <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">
                <Lock className="w-6 h-6" />
                PCI-DSS
              </div>
            </div>
          </div>

          {/* Security CTA */}
          <div className="mt-32 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-black mb-6 text-zinc-900 dark:text-white">Your security is our priority.</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10">Have specific security requirements or need to review our compliance documentation? Our security team is here to help.</p>
            <button className="px-10 py-5 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Review Security Whitepaper
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
