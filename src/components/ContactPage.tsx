import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Globe,
  ArrowRight,
  CheckCircle2,
  Clock,
  Linkedin,
  Instagram,
  Facebook
} from 'lucide-react';
import { motion } from 'motion/react';

interface ContactPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack, onNavigate, lang, onLangChange }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans selection:bg-primary/10 selection:text-primary transition-colors duration-300">
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Get in Touch</h2>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85] mb-10 text-zinc-900 dark:text-white">
                Let's Build Your <br />
                <span className="text-secondary">Global Supply Chain.</span>
              </h1>
              <p className="text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Have a project in mind? Our team of sourcing experts is ready to help you navigate the complexities of global trade.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Side: Contact Info Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary mb-6 border border-zinc-200 dark:border-zinc-700 group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Email Us</h4>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">quote@globsourcia.com</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">We respond within 24 hours.</p>
                </div>

                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary mb-6 border border-zinc-200 dark:border-zinc-700 group-hover:bg-primary group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Call Us</h4>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">+212 775 333 133</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Mon-Fri, 9am - 6pm EST</p>
                </div>

                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 transition-all group sm:col-span-2 lg:col-span-1">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary mb-6 border border-zinc-200 dark:border-zinc-700 group-hover:bg-primary group-hover:text-white transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Our Offices</h4>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Global Presence</p>
                  <div className="flex flex-wrap gap-2">
                    {['Casablanca', 'Shenzhen', 'Abidjan', 'Valencia'].map(city => (
                      <span key={city} className="px-3 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center gap-6">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Follow Us</p>
                <div className="flex items-center gap-3">
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
                      className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-7"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-16 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none relative overflow-hidden">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-4xl font-black mb-4 text-zinc-900 dark:text-white">Message Sent!</h3>
                    <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-md mx-auto">Thank you for reaching out. One of our sourcing experts will get back to you within 24 hours.</p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full h-16 px-8 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-lg placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
                          value={formState.name ?? ''}
                          onChange={e => setFormState({...formState, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@company.com"
                          className="w-full h-16 px-8 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-lg placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
                          value={formState.email ?? ''}
                          onChange={e => setFormState({...formState, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Company</label>
                        <input 
                          type="text" 
                          placeholder="Acme Corp"
                          className="w-full h-16 px-8 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-lg placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
                          value={formState.company ?? ''}
                          onChange={e => setFormState({...formState, company: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Subject</label>
                        <div className="relative">
                          <select 
                            className="w-full h-16 px-8 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-lg appearance-none cursor-pointer text-zinc-900 dark:text-white"
                            value={formState.subject ?? ''}
                            onChange={e => setFormState({...formState, subject: e.target.value})}
                          >
                            <option value="">Select a subject</option>
                            <option value="sourcing">New Sourcing Project</option>
                            <option value="logistics">Logistics & Shipping</option>
                            <option value="partnership">Partnership Inquiry</option>
                            <option value="other">Other</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                            <ArrowRight className="w-5 h-5 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Message</label>
                      <textarea 
                        required
                        placeholder="Tell us about your project..."
                        rows={6}
                        className="w-full px-8 py-6 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-lg placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white resize-none"
                        value={formState.message ?? ''}
                        onChange={e => setFormState({...formState, message: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-20 bg-primary text-white text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
                    >
                      {isSubmitting ? (
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
