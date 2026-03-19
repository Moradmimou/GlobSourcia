import React from 'react';
import { cn } from '../lib/utils';
import { 
  Globe, 
  Shield, 
  Zap, 
  BarChart3, 
  Truck, 
  Users, 
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight, 
  CheckCircle2,
  DollarSign,
  MessageSquare,
  ChevronRight,
  Star,
  FileText,
  Search,
  ShieldCheck,
  Factory,
  Calendar,
  Clock,
  Smartphone,
  Shirt,
  Home,
  FlaskConical,
  Car,
  Cpu,
  Settings2,
  TrendingUp,
  Lock,
  Rocket,
  MapPin,
  Navigation,
  Package,
  Tag,
  Hash
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../App';
import { BLOG_POSTS, COUNTRIES } from '../constants';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onNavigate: (view: string, id?: string | number) => void;
  onQuickRfq: (data: any) => void;
  lang: string;
  onLangChange: (lang: string) => void;
  t: (key: string) => string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, onNavigate, onQuickRfq, lang, onLangChange, t }) => {
  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-primary/10 selection:text-primary transition-colors duration-300">
      {/* Hero Section */}
      <section className="pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3 fill-current" />
                {t('landing.hero.badge')}
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 text-zinc-900 dark:text-white">
                {t('landing.hero.title')} <br />
                <span className="text-secondary">{t('landing.hero.titleAccent')}</span>
              </h1>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed max-w-xl">
                {t('landing.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={onRegister}
                  className="w-full sm:w-auto px-10 py-5 bg-secondary text-white text-lg font-black rounded-2xl shadow-2xl shadow-secondary/20 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-3"
                >
                  {t('landing.hero.cta')}
                  <ArrowRight className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="User" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-white">{t('landing.hero.stats')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />
              
              <div className="relative bg-zinc-900 rounded-[2.5rem] p-4 shadow-2xl border border-white/10">
                <div className="bg-white rounded-[2rem] overflow-hidden aspect-[4/3] relative group">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    poster="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  >
                    <source src="https://player.vimeo.com/external/370331493.sd.mp4?s=7b848035252b4967397b91368925f2d3d98a0022&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
                  <div className="absolute top-8 left-8">
                    <div className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Tracking</span>
                    </div>
                  </div>
                  <div className="absolute top-8 right-8">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified Partner</span>
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-5 p-5 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Truck className="w-8 h-8 animate-bounce" />
                      </div>
                      <div>
                        <p className="text-white font-black text-lg leading-none mb-1">Shipment in Transit</p>
                        <p className="text-white/60 text-xs font-medium">Project #RFQ-2024-089 • Shenzhen to Paris</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section (Redesigned) */}
      <section id="about" className="py-32 bg-white dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-[2rem] overflow-hidden aspect-[3/4] shadow-2xl border border-zinc-100 dark:border-zinc-800">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600" 
                      alt="Industrial Excellence" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="rounded-[2rem] overflow-hidden aspect-square shadow-xl bg-primary flex flex-col items-center justify-center text-white p-8 text-center">
                    <Globe className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-3xl font-black leading-none mb-2">150+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Countries Covered</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[2rem] overflow-hidden aspect-square shadow-xl bg-zinc-900 dark:bg-zinc-800 flex flex-col items-center justify-center text-white p-8 text-center border border-white/10">
                    <ShieldCheck className="w-12 h-12 mb-4 text-emerald-500" />
                    <p className="text-3xl font-black leading-none mb-2">100%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Verified Suppliers</p>
                  </div>
                  <div className="rounded-[2rem] overflow-hidden aspect-[3/4] shadow-2xl border border-zinc-100 dark:border-zinc-800">
                    <img 
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600" 
                      alt="Automated Logistics" 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('landing.about.badge')}</h2>
              <h3 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[0.9] text-zinc-900 dark:text-white">
                {t('landing.about.title')} <br />
                <span className="text-secondary">{t('landing.about.titleAccent')}</span>
              </h3>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
                {t('landing.about.description')}
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 transition-all group">
                  <h4 className="text-lg font-black mb-3 flex items-center gap-2 text-zinc-900 dark:text-white">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {t('landing.about.storyTitle')}
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {t('landing.about.storyDescription')}
                  </p>
                </div>
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-secondary/20 transition-all group">
                  <h4 className="text-lg font-black mb-3 flex items-center gap-2 text-zinc-900 dark:text-white">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    {t('landing.about.missionTitle')}
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {t('landing.about.missionDescription')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Glob$ourcia Advantage (Merged Features & Why Us) */}
      <section id="advantage" className="py-32 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('landing.advantage.badge')}</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">{t('landing.advantage.title')}</h3>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              {t('landing.advantage.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Supplier Discovery & Vetting",
                description: "We find and verify the best manufacturers for your specific needs, ensuring they meet our strict standards for reliability and ethical production.",
                icon: <Search className="w-8 h-8" />
              },
              {
                title: "Quotation & Negotiation",
                description: "Our experts manage the entire RFQ process, negotiating the best prices and terms to maximize your margins without compromising quality.",
                icon: <FileText className="w-8 h-8" />
              },
              {
                title: "Rigorous Quality Control",
                description: "On-site inspections, production monitoring, and final audits at the factory ensure every unit meets your exact specifications.",
                icon: <ShieldCheck className="w-8 h-8" />
              },
              {
                title: "Logistics & Fulfillment",
                description: "We handle the complexity of international shipping, customs, and last-mile delivery, so you can focus on growing your business.",
                icon: <Truck className="w-8 h-8" />
              },
              {
                title: "Real-Time App Tracking",
                description: "Monitor every milestone of your sourcing journey through our application. Total transparency from order to delivery.",
                icon: <Zap className="w-8 h-8" />
              },
              {
                title: "End-to-End Accountability",
                description: "One partner, one point of contact. We take full responsibility for your supply chain, ensuring a seamless and transparent experience.",
                icon: <Globe className="w-8 h-8" />
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group rounded-[2rem]"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-colors mb-8">
                  {item.icon}
                </div>
                <h4 className="text-xl font-black mb-4 text-zinc-900 dark:text-white">{item.title}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 p-10 bg-zinc-900 dark:bg-zinc-950 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
            <div className="max-w-xl">
              <h4 className="text-2xl font-black mb-2">A Smarter Way to Manage Global Sourcing</h4>
              <p className="text-zinc-400">Experience the perfect blend of digital efficiency and human expertise.</p>
            </div>
            <button 
              onClick={onRegister}
              className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
      
      {/* Our Process & Methodology */}
      <section id="methodology" className="py-32 bg-white dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Methodology</h2>
              <h3 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-[0.9] text-zinc-900 dark:text-white">
                Our Process & <br />
                <span className="text-secondary">Methodology.</span>
              </h3>
              <div className="p-8 bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] text-white relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-0 group-hover:bg-primary/40 transition-colors" />
                <h4 className="text-xl font-black mb-4 relative z-10">A Structured Approach to Global Sourcing</h4>
                <p className="text-zinc-400 leading-relaxed relative z-10">
                  At Globsourcia, we follow a structured sourcing methodology designed to minimize risks and ensure efficient supply chain execution. Our process combines sourcing expertise, supplier evaluation, quality assurance, and logistics coordination to provide a seamless procurement experience.
                </p>
              </div>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Requirement Analysis",
                  description: "We begin by understanding the client's product specifications, quantities, quality requirements, and delivery expectations.",
                  icon: <BarChart3 className="w-6 h-6" />
                },
                {
                  step: "02",
                  title: "Supplier Identification",
                  description: "Our team identifies and evaluates manufacturers capable of meeting the project's technical and commercial requirements.",
                  icon: <Factory className="w-6 h-6" />
                },
                {
                  step: "03",
                  title: "Supplier Evaluation & Negotiation",
                  description: "We compare offers, negotiate pricing and production terms, and ensure transparency in supplier agreements.",
                  icon: <Users className="w-6 h-6" />
                },
                {
                  step: "04",
                  title: "Production Monitoring & Quality Control",
                  description: "During production, we monitor manufacturing progress and perform inspections to ensure product quality before shipment.",
                  icon: <ShieldCheck className="w-6 h-6" />
                },
                {
                  step: "05",
                  title: "Logistics & Delivery Coordination",
                  description: "We manage the shipping process, documentation, customs coordination, and final delivery to the client's destination.",
                  icon: <Truck className="w-6 h-6" />
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 font-black text-lg border border-zinc-100 dark:border-zinc-800">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-black mb-2 group-hover:text-primary transition-colors text-zinc-900 dark:text-white">{item.title}</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Mastery Section (New) */}
      <section className="py-20 bg-zinc-900 dark:bg-zinc-950 overflow-hidden transition-colors duration-300 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Logistics Excellence</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-8 leading-tight">
                Mastering the <span className="text-secondary">Last Mile</span> & Beyond.
              </h3>
              <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                Our logistics network is built for speed and reliability. From the moment your goods leave the factory to the final offloading at your warehouse, we manage every detail with precision.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-black text-white mb-2">24/7</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Real-time Monitoring</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-white mb-2">0%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Logistics Friction</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=1200" 
                  alt="Container Offloading" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Container Offloading in Progress</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section id="industries" className="py-32 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">Industries We Serve</h3>
              <p className="text-lg text-zinc-500 dark:text-zinc-400">
                We provide specialized sourcing and logistics solutions across a wide range of sectors, understanding the unique challenges and requirements of each industry.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-full border border-zinc-100 dark:border-zinc-700 text-xs font-bold text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active in 15+ Sectors
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Consumer Electronics",
                description: "From smartphones and wearables to smart home devices, we source high-quality components and finished goods from certified manufacturers.",
                icon: <Smartphone className="w-8 h-8" />,
                features: ["Component Sourcing", "Assembly Oversight", "Compliance Testing"]
              },
              {
                title: "Fashion & Apparel",
                description: "Sourcing textiles, garments, and accessories with a focus on quality, sustainable materials, and ethical production practices.",
                icon: <Shirt className="w-8 h-8" />,
                features: ["Fabric Sourcing", "Sample Development", "Ethical Audits"]
              },
              {
                title: "Home & Furniture",
                description: "Connecting you with skilled artisans and large-scale manufacturers for furniture, decor, and household essentials.",
                icon: <Home className="w-8 h-8" />,
                features: ["Material Quality", "Packaging Design", "Bulk Logistics"]
              },
              {
                title: "Industrial Machinery",
                description: "Sourcing heavy machinery, precision tools, and industrial components for manufacturing and construction sectors.",
                icon: <Factory className="w-8 h-8" />,
                features: ["Technical Specs", "Pre-shipment Testing", "Heavy Cargo Handling"]
              },
              {
                title: "Health & Beauty",
                description: "Specialized sourcing for cosmetics, personal care products, and medical supplies, ensuring strict adherence to safety standards.",
                icon: <FlaskConical className="w-8 h-8" />,
                features: ["FDA/CE Compliance", "Ingredient Vetting", "Sterile Logistics"]
              },
              {
                title: "Automotive Parts",
                description: "Reliable supply chain solutions for OEM and aftermarket automotive components, focusing on precision and durability.",
                icon: <Car className="w-8 h-8" />,
                features: ["ISO Certification", "Batch Testing", "JIT Delivery"]
              }
            ].map((industry, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all mb-8">
                  {industry.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors text-zinc-900 dark:text-white">{industry.title}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">{industry.description}</p>
                <div className="space-y-3">
                  {industry.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-zinc-400 mb-8">Don't see your industry listed? We likely still serve it.</p>
            <button 
              onClick={() => onNavigate('contact')}
              className="px-10 py-5 bg-zinc-900 dark:bg-zinc-800 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto border border-white/5"
            >
              Inquire About Your Sector
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>



      {/* Application Success Section */}
      <section className="py-32 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">How our application helps you succeed</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">We provide the tools and transparency you need to scale your global operations with total confidence.</p>
          </div>

          <div className="relative">
            {/* Connecting Line Path (Desktop) */}
            <svg className="hidden lg:block absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 pointer-events-none z-0" viewBox="0 0 1200 100" fill="none">
              <path 
                d="M150 50 C 300 50, 300 10, 450 10 C 600 10, 600 90, 750 90 C 900 90, 900 50, 1050 50" 
                stroke="url(#line-gradient)" 
                strokeWidth="2" 
                strokeDasharray="8 8"
                className="opacity-20"
              />
              <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                {
                  title: "1) Stay in Control",
                  description: "Real-time tracking and centralized information.",
                  icon: <Settings2 className="w-10 h-10" />,
                  color: "text-blue-500",
                  bgColor: "bg-blue-50 dark:bg-blue-500/10"
                },
                {
                  title: "2) Improve Efficiency",
                  description: "All sourcing and logistics managed in one platform.",
                  icon: <TrendingUp className="w-10 h-10" />,
                  color: "text-orange-500",
                  bgColor: "bg-orange-50 dark:bg-orange-500/10"
                },
                {
                  title: "3) Secure Your Operations",
                  description: "Full visibility on suppliers, quality, and delivery.",
                  icon: <Lock className="w-10 h-10" />,
                  color: "text-blue-500",
                  bgColor: "bg-blue-50 dark:bg-blue-500/10"
                },
                {
                  title: "4) Scale with Confidence",
                  description: "Focus on growth while we handle the execution.",
                  icon: <Rocket className="w-10 h-10" />,
                  color: "text-orange-500",
                  bgColor: "bg-orange-50 dark:bg-orange-500/10"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <div className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-500", item.bgColor, item.color)}>
                        {item.icon}
                      </div>
                    </div>
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-zinc-100 dark:border-zinc-800 animate-[spin_20s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-xl font-black mb-3 text-zinc-900 dark:text-white">{item.title}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[200px]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick RFQ Section */}
      <section id="rfq" className="py-32 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('landing.rfq.badge')}</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-zinc-900 dark:text-white">
                {t('landing.rfq.title')} <br />
                <span className="text-secondary">{t('landing.rfq.titleAccent')}</span>
              </h3>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-12 leading-relaxed">
                {t('landing.rfq.description')}
              </p>
              
              <div className="space-y-6">
                {[
                  "Verified Suppliers Only",
                  "Quality Control Included",
                  "Real-time Logistics Tracking",
                  "Dedicated Sourcing Agent"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-3xl opacity-30 animate-pulse" />
              <Card className="p-0 relative z-10 border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 transition-colors duration-300">
                {/* Card Header */}
                <div className="bg-zinc-900 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-24 h-24 -rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Sourcing Agents Online</span>
                    </div>
                    <h4 className="text-2xl font-black tracking-tight">Get a <span className="text-primary">Custom Quote</span></h4>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Fill out the form below to receive a custom proposal.</p>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    onQuickRfq({
                      origin_country: formData.get('origin'),
                      destination_country: formData.get('destination'),
                      product_name: formData.get('product'),
                      category: formData.get('category'),
                      quantity: formData.get('quantity')
                    });
                  }}
                  className="p-10 space-y-8"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Origin
                      </label>
                      <select name="origin" required className="w-full h-14 px-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm appearance-none cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-white">
                        <option value="">Select Origin</option>
                        {COUNTRIES.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1 flex items-center gap-2">
                        <Navigation className="w-3 h-3" /> Destination
                      </label>
                      <select name="destination" required className="w-full h-14 px-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm appearance-none cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-white">
                        <option value="">Select Destination</option>
                        {COUNTRIES.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1 flex items-center gap-2">
                      <Package className="w-3 h-3" /> Product Name
                    </label>
                    <div className="relative">
                      <input 
                        name="product"
                        type="text" 
                        placeholder="e.g. Wireless Headphones" 
                        required
                        className="w-full h-14 px-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Category
                      </label>
                      <select name="category" required className="w-full h-14 px-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm appearance-none cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-white">
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1 flex items-center gap-2">
                        <Hash className="w-3 h-3" /> Quantity
                      </label>
                      <input 
                        name="quantity"
                        type="number" 
                        placeholder="1000" 
                        required
                        className="w-full h-14 px-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-5 bg-zinc-900 dark:bg-zinc-800 text-white font-black rounded-2xl shadow-2xl shadow-zinc-900/20 dark:shadow-none hover:bg-primary transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      <span>{t('landing.rfq.cta')}</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 dark:text-zinc-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest dark:text-zinc-400">Secure SSL</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3 dark:text-zinc-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest dark:text-zinc-400">Global Network</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 dark:text-zinc-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest dark:text-zinc-400">Verified</span>
                      </div>
                    </div>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('landing.blog.badge')}</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6">{t('landing.blog.title')}</h3>
              <p className="text-lg text-zinc-500">{t('landing.blog.description')}</p>
            </div>
            <button 
              onClick={() => onNavigate('blogs')}
              className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              {t('landing.blog.cta')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(0, 3).map((post, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => onNavigate('blog-post', post.id)}
              >
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-primary shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </div>
                </div>
                <h4 className="text-xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${post.author}`} alt={post.author} referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-sm font-bold text-zinc-600">{post.author}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-32 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('landing.team.badge')}</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">{t('landing.team.title')}</h3>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              {t('landing.team.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Li Wei",
                role: "Head of Sourcing",
                region: "China",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
                bio: "Expert in manufacturing networks across Shenzhen and Guangzhou."
              },
              {
                name: "Elena Rossi",
                role: "Logistics Director",
                region: "Europe",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
                bio: "Specializing in EU customs and intermodal transport optimization."
              },
              {
                name: "Kofi Mensah",
                role: "Supply Chain Strategist",
                region: "Africa",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
                bio: "Driving trade expansion and infrastructure development in West Africa."
              },
              {
                name: "Sarah Chen",
                role: "Quality Assurance",
                region: "Global",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
                bio: "Ensuring every product meets international safety and quality standards."
              },
              {
                name: "Amara Okafor",
                role: "Operations Manager",
                region: "Africa",
                image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400",
                bio: "Managing complex cross-border operations and local compliance."
              },
              {
                name: "Thomas Müller",
                role: "Global Partnerships",
                region: "Europe",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
                bio: "Building strategic alliances with international freight and trade bodies."
              }
            ].map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-primary shadow-sm">
                      {member.region}
                    </span>
                  </div>
                </div>
                <h4 className="text-2xl font-black mb-1 text-zinc-900 dark:text-white">{member.name}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('landing.faq.badge')}</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">{t('landing.faq.title')}</h3>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">{t('landing.faq.description')}</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What exactly is Globsourcia?",
                a: "Globsourcia is a fully managed end-to-end sourcing partner. We don't just provide a platform; we handle the entire process—from finding suppliers and managing quotations to quality control and final delivery."
              },
              {
                q: "How do you ensure product quality?",
                a: "We perform on-site factory audits, production monitoring, and final pre-shipment inspections. Our team ensures that every product meets your exact specifications before it leaves the factory."
              },
              {
                q: "What services are included?",
                a: "Our service covers supplier discovery, RFQ management, price negotiation, quality control, international logistics, customs clearance, and last-mile delivery to your warehouse."
              },
              {
                q: "How can I track my order?",
                a: "Every step of your sourcing journey is tracked in real-time through our application. You'll receive updates on production milestones, quality inspection results, and live shipping status."
              },
              {
                q: "Do you handle logistics and customs?",
                a: "Yes, we handle the entire fulfillment process, including freight forwarding, customs documentation, and delivery. We ensure a seamless experience from the factory floor to your door."
              },
              {
                q: "Is my trade data and IP protected?",
                a: "Absolutely. We take data security and intellectual property seriously. All communications are encrypted, and we have strict legal frameworks in place to protect your proprietary information."
              }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 hover:border-primary/20 transition-all group"
              >
                <h4 className="text-lg font-black mb-3 flex items-center gap-3 text-zinc-900 dark:text-white">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">?</span>
                  {faq.q}
                </h4>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed pl-9">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Still have questions?</p>
            <button 
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Contact Support Team
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
                Ready for a seamless <br /> sourcing experience?
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Join hundreds of companies who trust Globsourcia to manage their entire supply chain. From factory to front door, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={onRegister}
                  className="w-full sm:w-auto px-12 py-6 bg-secondary text-white text-xl font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="flex items-center gap-2 text-lg font-bold hover:text-white/80 transition-colors"
                >
                  Talk to an Expert
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
