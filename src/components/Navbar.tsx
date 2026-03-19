import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Menu, X, UserCircle, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../App';

interface NavbarProps {
  onLogin: () => void;
  onRegister: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  t: (key: string) => string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onLogin, 
  onRegister, 
  onNavigate, 
  currentView, 
  t,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPublicView = ['landing', 'services', 'security', 'contact', 'careers', 'privacy', 'terms', 'blogs', 'cookies'].includes(currentView);

  if (!isPublicView) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        <div className="flex items-center">
          <button 
            onClick={() => onNavigate('landing')} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('services')} 
            className={cn(
              "text-sm font-semibold transition-colors",
              currentView === 'services' ? "text-primary" : "text-zinc-500 dark:text-zinc-400 hover:text-primary"
            )}
          >
            {t('nav.services')}
          </button>
          <button 
            onClick={() => {
              if (currentView === 'landing') {
                document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('landing');
                setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }} 
            className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors"
          >
            {t('nav.industries')}
          </button>
          <button 
            onClick={() => onNavigate('blogs')} 
            className={cn(
              "text-sm font-semibold transition-colors",
              currentView === 'blogs' ? "text-primary" : "text-zinc-500 dark:text-zinc-400 hover:text-primary"
            )}
          >
            {t('nav.blog')}
          </button>
          <button 
            onClick={() => {
              if (currentView === 'landing') {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('landing');
                setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }} 
            className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors"
          >
            {t('nav.faq')}
          </button>
          <button 
            onClick={() => onNavigate('contact')} 
            className={cn(
              "text-sm font-semibold transition-colors",
              currentView === 'contact' ? "text-primary" : "text-zinc-500 dark:text-zinc-400 hover:text-primary"
            )}
          >
            {t('nav.contact')}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={onLogin}
            className="px-6 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors"
          >
            {t('nav.login')}
          </button>
          <button 
            onClick={onRegister}
            className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {t('nav.register')}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={onLogin}
            className="p-2 text-primary hover:text-primary/80 transition-colors"
            aria-label={t('nav.login')}
          >
            <UserCircle className="w-6 h-6" />
          </button>

          <button 
            onClick={onRegister}
            className="px-3 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all whitespace-nowrap"
          >
            Get Started
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <button 
                onClick={() => {
                  onNavigate('services');
                  setIsMenuOpen(false);
                }} 
                className={cn(
                  "block w-full text-left text-lg font-bold transition-colors",
                  currentView === 'services' ? "text-primary" : "text-zinc-600 dark:text-zinc-300"
                )}
              >
                {t('nav.services')}
              </button>
              <button 
                onClick={() => {
                  if (currentView === 'landing') {
                    document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onNavigate('landing');
                    setTimeout(() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                  setIsMenuOpen(false);
                }} 
                className="block w-full text-left text-lg font-bold text-zinc-600 dark:text-zinc-300"
              >
                {t('nav.industries')}
              </button>
              <button 
                onClick={() => {
                  onNavigate('blogs');
                  setIsMenuOpen(false);
                }} 
                className={cn(
                  "block w-full text-left text-lg font-bold transition-colors",
                  currentView === 'blogs' ? "text-primary" : "text-zinc-600 dark:text-zinc-300"
                )}
              >
                {t('nav.blog')}
              </button>
              <button 
                onClick={() => {
                  if (currentView === 'landing') {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onNavigate('landing');
                    setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                  setIsMenuOpen(false);
                }} 
                className="block w-full text-left text-lg font-bold text-zinc-600 dark:text-zinc-300"
              >
                {t('nav.faq')}
              </button>
              <button 
                onClick={() => {
                  onNavigate('contact');
                  setIsMenuOpen(false);
                }} 
                className={cn(
                  "block w-full text-left text-lg font-bold transition-colors",
                  currentView === 'contact' ? "text-primary" : "text-zinc-600 dark:text-zinc-300"
                )}
              >
                {t('nav.contact')}
              </button>
              
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                <button 
                  onClick={() => {
                    onLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-4 text-lg font-bold text-zinc-600 dark:text-zinc-300 text-center"
                >
                  {t('nav.login')}
                </button>
                <button 
                  onClick={() => {
                    onRegister();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-4 bg-primary text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
                >
                  {t('nav.register')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
