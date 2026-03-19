import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Shield, 
  Globe,
  Building2,
  ChevronLeft,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Button, Input, Logo } from '../App';

interface RegisterViewProps {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: (user: any, token: string) => void;
  t: (key: string) => string;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onBack, onLogin, onSuccess, t }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const company = formData.get('company');
    const role = formData.get('role');

    setLoading(true);
    setError(null);

    try {
      // Create Firebase Auth user first
      let firebaseUid = null;
      try {
        const fbResult = await createUserWithEmailAndPassword(auth, email as string, password as string);
        firebaseUid = fbResult.user.uid;
      } catch (fbErr: any) {
        console.error('Firebase registration error:', fbErr);
        if (fbErr.code === 'auth/operation-not-allowed') {
          throw new Error('Email/Password registration is not enabled in the Firebase Console. Please enable it in Authentication > Sign-in method.');
        }
        // If user already exists in Firebase but not in our DB, we might want to proceed or handle it
        if (fbErr.code !== 'auth/email-already-in-use') {
          throw fbErr;
        }
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, company, role, uid: firebaseUid })
      });
      const data = await res.json();
      if (data.token) {
        onSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-white overflow-hidden selection:bg-primary/10 selection:text-primary">
      {/* Left Side: Branding & Value Props (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center p-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 scale-105"
            alt="Global trade background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-zinc-950/80 to-zinc-950" />
          
          {/* Animated Orbs */}
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
        
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-16">
              <Logo size="xl" className="text-white" />
            </div>
            
            <div className="space-y-12">
              <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.85]">
                Join the <br />
                <span className="text-primary italic font-serif font-light tracking-normal">Global Elite</span>.
              </h2>
              
              <p className="text-zinc-400 text-xl leading-relaxed max-w-md font-medium">
                Global sourcing company.
              </p>
            </div>

            <div className="mt-24 pt-12 border-t border-white/10">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[5, 6, 7, 8].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <p className="text-zinc-400 dark:text-zinc-500 text-sm font-bold">
                  Trusted by <span className="text-white">500+</span> enterprises worldwide
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 pt-24 pb-[var(--safe-bottom)] md:p-12 lg:p-24 bg-white dark:bg-zinc-950 relative overflow-y-auto transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary lg:hidden" />
        
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium z-20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[540px] py-12"
        >
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-10">
              <Logo size="xl" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-950 dark:text-white mb-4">{t('register.title')}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">Global sourcing company.</p>
          </div>

          <div className="space-y-8">
            <Card className="p-4 sm:p-8 md:p-10 border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[2.5rem] transition-colors">
              {error && (
                <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
                  <Shield className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 ml-1">{t('register.fullName')}</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-700 group-focus-within:text-primary transition-all duration-300" />
                      <Input
                        name="name"
                        placeholder="John Doe"
                        required
                        className="h-16 pl-14 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-primary/5 transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 ml-1">{t('register.company')}</label>
                    <div className="relative group">
                      <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-700 group-focus-within:text-primary transition-all duration-300" />
                      <Input
                        name="company"
                        placeholder="Acme Global"
                        required
                        className="h-16 pl-14 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-primary/5 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 ml-1">{t('register.emailAddress')}</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-700 group-focus-within:text-primary transition-all duration-300" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      className="h-16 pl-14 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-primary/5 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 ml-1">{t('register.password')}</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-700 group-focus-within:text-primary transition-all duration-300" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="h-16 pl-14 pr-14 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-primary/5 transition-all font-semibold"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 ml-1">{t('register.accountRole')}</label>
                  <div className="relative">
                    <select 
                      name="role" 
                      className="w-full h-16 px-6 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:bg-white dark:focus:bg-zinc-950 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-zinc-700 dark:text-zinc-300 appearance-none cursor-pointer"
                      required
                    >
                      <option value="customer">{t('register.customer')}</option>
                      <option value="sourcing_agent">{t('register.sourcingAgent')}</option>
                      <option value="shipping_agent">{t('register.shippingAgent')}</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500">
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-16 rounded-2xl text-xl font-black tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-zinc-950 dark:bg-primary hover:bg-primary dark:hover:bg-primary/90" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t('loading')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{t('register.cta')}</span>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400 dark:text-zinc-500">Or register with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm shadow-sm text-zinc-900 dark:text-white">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button className="h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm shadow-sm text-zinc-900 dark:text-white">
                <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="LinkedIn" />
                LinkedIn
              </button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 font-bold">
              {t('register.alreadyHaveAccount')}{' '}
              <button 
                onClick={onLogin} 
                className="text-primary font-black hover:text-secondary transition-colors underline underline-offset-4"
              >
                {t('register.signIn')}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
