import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Zap, 
  Instagram, 
  Facebook, 
  Linkedin,
  Mail,
  ArrowRight,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';
import { translations } from '../translations';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../App';

interface FooterProps {
  onNavigate: (view: string) => void;
  currentLang: string;
  onLangChange: (lang: string) => void;
  t: (key: string) => string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentLang, onLangChange, t }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-zinc-950 text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center pb-20 border-b border-white/10 mb-20">
          <div>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              {t('footer.newsletter.title')} <br />
              <span className="text-primary">{t('footer.newsletter.titleAccent')}</span>
            </h3>
            <p className="text-zinc-400 text-lg max-w-md">
              {t('footer.newsletter.description')}
            </p>
          </div>
          <div className="relative">
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-primary font-bold flex items-center gap-3"
              >
                <Zap className="w-5 h-5 fill-current" />
                {t('footer.newsletter.success')}
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    placeholder={t('footer.newsletter.placeholder')}
                    className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                    value={email ?? ''}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="h-16 px-8 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  {t('footer.newsletter.cta')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-zinc-500 mt-4 uppercase tracking-widest font-bold">
              {t('footer.newsletter.stats')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2">
            <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity w-fit">
              <Logo size="md" className="text-white" />
            </button>
            <p className="text-zinc-400 max-w-sm leading-relaxed mb-8">
              {t('footer.company.description')}
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, url: "https://www.facebook.com/globsourcia" },
                { icon: <Instagram className="w-5 h-5" />, url: "https://www.instagram.com/globsourcia/" },
                { icon: <Linkedin className="w-5 h-5" />, url: "https://www.linkedin.com/company/globsourcia/" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-black uppercase tracking-widest text-[10px] text-primary mb-8">{t('footer.company.solutions')}</h5>
            <ul className="space-y-4 text-sm font-bold text-zinc-400">
              <li><button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">{t('nav.services')}</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">{t('nav.industries')}</button></li>
              <li><button onClick={() => onNavigate('security')} className="hover:text-white transition-colors">{t('footer.company.security')}</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">{t('footer.company.qualityControl')}</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black uppercase tracking-widest text-[10px] text-primary mb-8">{t('footer.company.company')}</h5>
            <ul className="space-y-4 text-sm font-bold text-zinc-400">
              <li><button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">{t('nav.login')}</button></li>
              <li><button onClick={() => onNavigate('careers')} className="hover:text-white transition-colors">{t('footer.company.careers')}</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">{t('nav.contact')}</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">{t('footer.company.aboutUs')}</button></li>
              <li><button onClick={() => onNavigate('blogs')} className="hover:text-white transition-colors">{t('nav.blog')}</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black uppercase tracking-widest text-[10px] text-primary mb-8">{t('footer.company.legal')}</h5>
            <ul className="space-y-4 text-sm font-bold text-zinc-400">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">{t('footer.company.privacyPolicy')}</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">{t('footer.company.termsOfService')}</button></li>
              <li><button onClick={() => onNavigate('cookies')} className="hover:text-white transition-colors">{t('footer.company.cookiePolicy')}</button></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:grid md:grid-cols-3 items-center pt-12 border-t border-white/10 gap-8">
          <div className="flex items-center gap-6 order-2 md:order-1">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              © 2026 Glob$ourcia
            </p>
          </div>

          <div className="flex justify-center order-1 md:order-2">
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
              >
                <Globe className="w-4 h-4" />
                <span>{translations[currentLang]?.languages?.[currentLang] || 'English'}</span>
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 min-w-[160px] z-50"
                  >
                    {Object.entries(translations[currentLang]?.languages || translations['en'].languages).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => {
                          onLangChange(code);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all",
                          currentLang === code ? "bg-primary text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {name as string}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-end gap-8 order-3">
          </div>
        </div>
      </div>
    </footer>
  );
};
