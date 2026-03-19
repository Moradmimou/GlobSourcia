import React from 'react';
import { 
  Search, 
  FileText, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Factory,
  BarChart3,
  Users,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesPageProps {
  onBack: () => void;
  onRegister: () => void;
  onNavigate: (view: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
  t: (key: string) => string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBack, onRegister, onNavigate, lang, onLangChange, t }) => {
  const services = [
    {
      title: t('services.items.vetting.title'),
      description: t('services.items.vetting.description'),
      icon: <Search className="w-8 h-8" />,
      features: t('services.items.vetting.features') as unknown as string[]
    },
    {
      title: t('services.items.negotiation.title'),
      description: t('services.items.negotiation.description'),
      icon: <FileText className="w-8 h-8" />,
      features: t('services.items.negotiation.features') as unknown as string[]
    },
    {
      title: t('services.items.quality.title'),
      description: t('services.items.quality.description'),
      icon: <ShieldCheck className="w-8 h-8" />,
      features: t('services.items.quality.features') as unknown as string[]
    },
    {
      title: t('services.items.logistics.title'),
      description: t('services.items.logistics.description'),
      icon: <Truck className="w-8 h-8" />,
      features: t('services.items.logistics.features') as unknown as string[]
    },
    {
      title: t('services.items.tracking.title'),
      description: t('services.items.tracking.description'),
      icon: <Zap className="w-8 h-8" />,
      features: t('services.items.tracking.features') as unknown as string[]
    },
    {
      title: t('services.items.fulfillment.title'),
      description: t('services.items.fulfillment.description'),
      icon: <Factory className="w-8 h-8" />,
      features: t('services.items.fulfillment.features') as unknown as string[]
    }
  ];

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans transition-colors duration-300">
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('services.badge')}</h2>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 text-zinc-900 dark:text-white">
              {t('services.title')} <br />
              <span className="text-secondary">{t('services.titleAccent')}</span>
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {t('services.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all group rounded-[2.5rem]"
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all mb-8 shadow-sm">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-zinc-900 dark:text-white">{service.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-32 bg-zinc-900 dark:bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="text-4xl font-black mb-6">{t('services.cta.title')}</h2>
                <p className="text-zinc-400 text-lg mb-8">{t('services.cta.description')}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold">
                    <Users className="w-4 h-4" />
                    {t('services.cta.stats.businesses')}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold">
                    <Globe className="w-4 h-4" />
                    {t('services.cta.stats.countries')}
                  </div>
                </div>
              </div>
              <button 
                onClick={onRegister}
                className="px-10 py-5 bg-primary text-white text-lg font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
              >
                {t('services.cta.button')}
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
