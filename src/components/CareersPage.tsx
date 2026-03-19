import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  MapPin,
  Send,
  Heart,
  Coffee,
  Rocket
} from 'lucide-react';
import { motion } from 'motion/react';

interface CareersPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  lang: string;
  onLangChange: (lang: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onBack, onNavigate, lang, onLangChange }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    role: '',
    linkedin: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const openRoles = [
    {
      title: "Senior Sourcing Manager",
      location: "Shenzhen, China",
      type: "Full-time",
      department: "Operations"
    },
    {
      title: "Logistics Coordinator",
      location: "Casablanca, Morocco",
      type: "Full-time",
      department: "Logistics"
    },
    {
      title: "Full Stack Engineer",
      location: "Valencia, Spain",
      type: "Full-time",
      department: "Engineering"
    },
    {
      title: "Quality Control Inspector",
      location: "Abidjan, Ivory Coast",
      type: "Contract",
      department: "Quality"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Sourcing Manager",
      quote: "Working at Glob$ourcia has been an incredible journey. The culture of transparency and the global scale of our operations make every day exciting.",
      photo: "https://picsum.photos/seed/sarah/200/200"
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Engineer",
      quote: "The technical challenges we solve here are unique. Building a platform that connects thousands of suppliers and customers worldwide is truly rewarding.",
      photo: "https://picsum.photos/seed/marcus/200/200"
    },
    {
      name: "Amina Mansour",
      role: "Logistics Coordinator",
      quote: "I love the diversity of our team. We collaborate across time zones and cultures to ensure our customers' shipments arrive safely and on time.",
      photo: "https://picsum.photos/seed/amina/200/200"
    }
  ];

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans transition-colors duration-300">
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
            {/* Left Side: Culture & Openings */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Careers</h2>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 text-zinc-900 dark:text-white">
                Build the Future of <br />
                <span className="text-secondary">Global Trade.</span>
              </h1>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12">
                We're a global team of sourcing experts, engineers, and logistics specialists on a mission to make global trade transparent and accessible for everyone.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-16">
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <motion.div
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-fit"
                  >
                    <Heart className="w-6 h-6 text-red-500 mb-4" />
                  </motion.div>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-2 text-zinc-900 dark:text-white">People First</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">A supportive culture that values diversity and growth.</p>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <motion.div
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="w-fit"
                  >
                    <Globe className="w-6 h-6 text-blue-500 mb-4" />
                  </motion.div>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-2 text-zinc-900 dark:text-white">Global Impact</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Work on projects that move the world's economy.</p>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <motion.div
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="w-fit"
                  >
                    <Zap className="w-6 h-6 text-yellow-500 mb-4" />
                  </motion.div>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-2 text-zinc-900 dark:text-white">Fast Growth</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Opportunities to lead and innovate in a fast-paced environment.</p>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <motion.div
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="w-fit"
                  >
                    <Coffee className="w-6 h-6 text-amber-600 mb-4" />
                  </motion.div>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-2 text-zinc-900 dark:text-white">Flexible Work</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Remote-friendly policies and modern workspaces.</p>
                </div>
              </div>

              <h3 className="text-2xl font-black mb-8 text-zinc-900 dark:text-white">Current Openings</h3>
              <div className="space-y-4">
                {openRoles.map((role, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-primary/20 hover:shadow-xl transition-all group cursor-pointer flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-lg group-hover:text-primary transition-colors text-zinc-900 dark:text-white">{role.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-zinc-400 font-bold">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {role.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {role.type}</span>
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] uppercase tracking-wider">{role.department}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Application Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-32"
            >
              <div className="bg-zinc-900 text-white rounded-[3rem] p-8 md:p-12 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
                      <Rocket className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Application Received!</h3>
                    <p className="text-zinc-400 mb-8">Thanks for your interest in joining Glob$ourcia. Our talent team will review your profile and get back to you soon.</p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-primary font-bold hover:underline"
                    >
                      Apply for another role
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-2xl font-black mb-2">Don't see a perfect fit?</h3>
                    <p className="text-zinc-400 mb-8">Send us your details anyway. We're always looking for exceptional talent to join our global mission.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-white"
                          value={formState.name ?? ''}
                          onChange={e => setFormState({...formState, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@company.com"
                          className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-white"
                          value={formState.email ?? ''}
                          onChange={e => setFormState({...formState, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Role of Interest</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Sourcing Expert"
                          className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-white"
                          value={formState.role ?? ''}
                          onChange={e => setFormState({...formState, role: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">LinkedIn Profile</label>
                        <input 
                          type="url" 
                          placeholder="https://linkedin.com/in/..."
                          className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-white"
                          value={formState.linkedin ?? ''}
                          onChange={e => setFormState({...formState, linkedin: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Why Glob$ourcia?</label>
                        <textarea 
                          required
                          placeholder="Tell us what excites you about our mission..."
                          rows={4}
                          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-white resize-none"
                          value={formState.message ?? ''}
                          onChange={e => setFormState({...formState, message: e.target.value})}
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Submit Application
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Testimonials Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Testimonials</h2>
              <h3 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Life at Glob$ourcia</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Hear from our team members about their experiences building the future of global trade.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] space-y-6 hover:shadow-xl transition-all border">
                  <div className="flex items-center gap-4">
                    <img 
                      src={t.photo} 
                      alt={t.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-zinc-700 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-black text-lg text-zinc-900 dark:text-white">{t.name}</h4>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 italic leading-relaxed">"{t.quote}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
