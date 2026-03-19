import * as React from 'react';
import { useState, useEffect, useRef, Component } from 'react';
import { 
  LayoutDashboard, 
  LayoutGrid,
  List,
  Plus, 
  FileText, 
  Truck, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink,
  Search, 
  Bell, 
  Building2,
  ChevronRight, 
  ChevronLeft,
  Package, 
  Globe, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Receipt,
  FileUp,
  Download,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Filter,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Ship,
  Plane,
  Warehouse,
  MapPin,
  Check,
  X,
  MessageSquare,
  FileSignature,
  FilePlus,
  ShieldCheck,
  FileSearch,
  Handshake,
  BarChart3,
  Image as ImageIcon,
  Camera,
  Upload,
  Quote,
  Info,
  Loader2,
  Zap,
  Lock,
  Send,
  Mail,
  Tag,
  Layers,
  Hash,
  DollarSign,
  Link as LinkIcon,
  Shield,
  HelpCircle,
  UserCircle,
  Calendar,
  TrendingUp,
  UserPlus,
  ChevronDown,
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { cn } from './lib/utils';
import { translations } from './translations';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
  Line as MapLine,
  Marker,
  Annotation
} from "react-simple-maps";
import { User, RFQ, Product, Offer, Shipment, Invoice, SampleRequest, Supplier } from './types';
import { COUNTRIES, SOURCING_TERMS } from './constants';
import { LandingPage } from './components/LandingPage';
import { RegisterView } from './components/RegisterView';
import { HelpCenter } from './components/HelpCenter';
import { ServicesPage } from './components/ServicesPage';
import { SecurityPage } from './components/SecurityPage';
import ChatView from './components/ChatView';
import { ScrollToTop } from './components/ScrollToTop';
import { ContactPage } from './components/ContactPage';
import { auth, googleProvider, syncUserToFirestore } from './firebase';
import { signInWithPopup, getIdToken, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { CareersPage } from './components/CareersPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';
import { CookiePolicyPage } from './components/CookiePolicyPage';
import { BlogView } from './components/BlogView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error) {
          errorMessage = `Firestore Error: ${parsedError.error} (${parsedError.operationType} at ${parsedError.path})`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || (this.state.error ? String(this.state.error) : errorMessage);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-xl border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Application Error</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

// --- Components ---

function ViewToggle({ mode, onChange }: { mode: 'grid' | 'table', onChange: (mode: 'grid' | 'table') => void }) {
  return (
    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
      <button 
        onClick={() => onChange('table')}
        className={cn(
          "p-2 rounded-lg transition-all",
          mode === 'table' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        )}
      >
        <List className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onChange('grid')}
        className={cn(
          "p-2 rounded-lg transition-all",
          mode === 'grid' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Globsourcia Terms</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Sourcing & Logistics Service Agreement</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6">
          {SOURCING_TERMS.map((term, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-black text-sm text-zinc-900 dark:text-white uppercase tracking-wider">{term.title}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{term.content}</p>
            </div>
          ))}
        </div>
        <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Button onClick={onClose} className="w-full rounded-2xl py-4">I Understand & Accept</Button>
        </div>
      </motion.div>
    </div>
  );
};

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg', asChild?: boolean }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      outline: 'border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
      ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    // If 'value' is provided in props, even if it's undefined, we treat it as a controlled input
    // to prevent the "uncontrolled to controlled" warning when it later gets a value.
    const isControlled = 'value' in props;
    const value = isControlled ? (props.value ?? '') : undefined;

    return (
      <input
        ref={ref}
        className={cn('flex h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 dark:text-zinc-100', className)}
        {...props}
        value={value}
      />
    );
  }
);

export const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={cn('bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[2rem] shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden', className)} {...props}>
    {children}
  </div>
);

export const Logo = ({ size = 'md', showText = true, className, collapsed = false }: { size?: 'sm' | 'md' | 'lg' | 'xl', showText?: boolean, className?: string, collapsed?: boolean }) => {
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl',
    xl: 'text-4xl md:text-6xl',
  };

  return (
    <div className={cn("flex items-center gap-3", (size === 'lg' || size === 'xl') && "flex-col text-center", collapsed && "justify-center", className)}>
      {collapsed ? (
        <span className="text-secondary font-display font-bold text-2xl">$</span>
      ) : (
        <div className={cn("flex flex-col", (size === 'lg' || size === 'xl') ? "items-center" : "items-start")}>
          <div className={cn("flex flex-row items-center font-display font-black tracking-normal leading-tight gap-0.5", textSizes[size])}>
            <span className="text-primary">Glob</span>
            <span className="text-secondary">$ourcia</span>
          </div>
          {(size === 'lg' || size === 'xl') && <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium text-sm">Global Sourcing & Logistics Platform</p>}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Yes, Delete", 
  cancelText = "Cancel",
  type = "danger"
}: { 
  isOpen: boolean, 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void,
  confirmText?: string,
  cancelText?: string,
  type?: "danger" | "warning" | "info"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              type === "danger" ? "bg-red-100 dark:bg-red-900/20 text-red-600" : "bg-blue-100 dark:bg-blue-900/20 text-blue-600"
            )}>
              {type === "danger" ? <Trash2 size={24} /> : <Info size={24} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-white font-medium transition-colors",
                type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard' | 'requests' | 'create-rfq' | 'rfq-details' | 'shipments' | 'shipment-details' | 'finance' | 'analytics' | 'offers' | 'settings' | 'profile' | 'help' | 'services' | 'security' | 'contact' | 'careers' | 'privacy' | 'terms' | 'cookies' | 'blogs' | 'blog-post' | 'messages' | 'admin-dashboard'>('landing');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [lang, setLang] = useState<string>(() => {
    const saved = localStorage.getItem('lang');
    return saved || 'en';
  });

  useEffect(() => {
    if (user?.preferences?.language) {
      setLang(user.preferences.language);
    }
  }, [user]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      if (!value) break;
      value = value[k];
    }
    if (value) return value;
    
    // Fallback to English
    value = translations['en'];
    for (const k of keys) {
      if (!value) break;
      value = value[k];
    }
    return value || key;
  };

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, rfqId: number | null }>({
    isOpen: false,
    rfqId: null
  });
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [financeAnalytics, setFinanceAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [activeRfqTab, setActiveRfqTab] = useState<'details' | 'offers' | 'action'>('details');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<number | null>(null);
  const [availableRfqsForShipment, setAvailableRfqsForShipment] = useState<RFQ[]>([]);
  const [draftToEdit, setDraftToEdit] = useState<RFQ | null>(null);
  const [prefilledRfqData, setPrefilledRfqData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Helper to check if an RFQ is an "Offer" based on user role
  const isOffer = (rfq: RFQ & { offers?: Offer[] }, u: User) => {
    if (u.role === 'customer') return rfq.status === 'offered' || (rfq.status === 'shipping' && (rfq.offers?.some(o => o.status === 'ready' || o.status === 'accepted') ?? false));
    if (u.role === 'shipping_agent') return rfq.status === 'shipping';
    if (u.role === 'sourcing_agent') return rfq.status === 'shipping' || rfq.status === 'offered';
    if (u.role === 'admin') return ['offered', 'shipping'].includes(rfq.status);
    return false;
  };

  // Helper to check if an RFQ is an "Order"
  const isOrder = (rfq: RFQ) => ['ordered', 'shipped'].includes(rfq.status);

  // Helper to check if an RFQ is a "Request" (Draft, Pending, or Active)
  const isRequest = (rfq: RFQ, u: User) => {
    if (rfq.status === 'draft' || rfq.status === 'submitted') return true;
    // Active means not draft, not pending, not offer, not order, not rejected
    return !['draft', 'submitted', 'rejected'].includes(rfq.status) && !isOffer(rfq, u) && !isOrder(rfq);
  };

  // Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsAuthReady(true);
      if (firebaseUser) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          if (['landing', 'login', 'register'].includes(view)) {
            setView('dashboard');
          }
        }
      } else {
        // If no Firebase user, check if we have a local session
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
          // We have a local session but no Firebase session
          // This is okay for now, but some features might be limited
          setUser(JSON.parse(savedUser));
        } else {
          // Truly logged out
          setUser(null);
          if (!['landing', 'login', 'register', 'help', 'services', 'security', 'contact', 'careers', 'privacy', 'terms', 'cookies', 'blogs', 'blog-post'].includes(view)) {
            setView('landing');
          }
        }
      }
    });

    return () => unsubscribe();
  }, [view]);

  useEffect(() => {
    if (user && isAuthReady) {
      fetchRfqs();
      fetchShipments();
      fetchInvoices();
      fetchFinanceAnalytics();
      fetchNotifications();
    }
  }, [user, isAuthReady]);

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
    }
    
    // Close dropdown
    setIsNotificationsOpen(false);

    // Navigation logic
    const { target_view, target_id, title, message } = notification;
    
    if (target_view && target_view !== 'null') {
      if (target_view === 'rfq-details' && target_id) {
        fetchSelectedRfq(target_id);
        setView('rfq-details');
      } else if (target_view === 'shipment-details' && target_id) {
        fetchSelectedShipment(target_id);
        setView('shipment-details');
      } else {
        setView(target_view as any);
      }
      return;
    }

    // Fallback: Try to extract ID from message if target_view is not set (for old notifications)
    const idMatch = message.match(/#(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (title.includes('Offer') || title.includes('RFQ')) {
      if (id) {
        fetchSelectedRfq(id);
        setView('rfq-details');
      } else {
        setView('requests');
      }
    } else if (title.includes('Sample')) {
      if (id) {
        fetchSelectedRfq(id);
        setView('rfq-details');
      } else {
        setView('requests');
      }
    } else if (title.includes('Shipment')) {
      if (id) {
        fetchSelectedShipment(id);
      } else {
        setView('shipments');
      }
    } else if (title.includes('Invoice') || title.includes('Payment')) {
      setView('finance');
    } else {
      setView('dashboard');
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to fetch notifications');
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      }
    } catch (e) {
      console.error('Failed to mark notification as read');
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      }
    } catch (e) {
      console.error('Failed to mark all notifications as read');
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInvoices(data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch invoices');
    }
  };

  const fetchFinanceAnalytics = async () => {
    try {
      const res = await fetch('/api/finance/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFinanceAnalytics(data);
      }
    } catch (e) {
      console.error('Failed to fetch finance analytics');
    }
  };

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setShipments(data);
      }
    } catch (e) {
      console.error('Failed to fetch shipments');
    }
  };

  const fetchSelectedShipment = async (id: number) => {
    try {
      const res = await fetch(`/api/shipments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedShipment(data);
        setView('shipment-details');
      }
    } catch (e) {
      console.error('Failed to fetch shipment details');
    }
  };

  const fetchRfqs = async () => {
    try {
      const res = await fetch('/api/rfqs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRfqs(data);
        // Also filter RFQs that can be shipped (status 'ordered')
        setAvailableRfqsForShipment(data.filter(r => r.status === 'ordered'));
      }
    } catch (e) {
      console.error('Failed to fetch RFQs');
    }
  };

  const visibleRfqs = rfqs.filter(rfq => {
    if (rfq.status === 'draft') {
      return user?.role === 'customer';
    }
    return true;
  });

  const fetchSelectedRfq = async (id: number) => {
    setSelectedRfq(null);
    try {
      const res = await fetch(`/api/rfqs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      
      // Security check: only customers can see drafts
      if (data.status === 'draft' && user?.role !== 'customer') {
        console.error('Unauthorized access to draft RFQ');
        return;
      }
      
      setSelectedRfq(data);
    } catch (e) {
      console.error('Failed to fetch RFQ details');
    }
  };

  const handleDeleteRFQ = async (id: number) => {
    try {
      const res = await fetch(`/api/rfqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchRfqs();
        if (draftToEdit?.id === id) {
          setDraftToEdit(null);
        }
        setView('requests');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete RFQ');
      }
    } catch (e) {
      console.error('Failed to delete RFQ');
      alert('Failed to delete RFQ');
    }
  };

  const confirmDeleteRfq = (id: number) => {
    setDeleteConfirm({ isOpen: true, rfqId: id });
  };

  const executeDeleteRfq = async () => {
    if (deleteConfirm.rfqId) {
      await handleDeleteRFQ(deleteConfirm.rfqId);
      setDeleteConfirm({ isOpen: false, rfqId: null });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && user && !user.uid) {
        const updatedUser = { ...user, uid: firebaseUser.uid };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        syncUserToFirestore(updatedUser);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await getIdToken(result.user);
      
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        syncUserToFirestore(data.user);
        setView('dashboard');
        fetchRfqs();
        fetchShipments();
        fetchInvoices();
        fetchNotifications();
      } else {
        alert(data.error || 'Google login failed');
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the Google login popup');
      } else if (error.code === 'auth/operation-not-allowed') {
        console.error('Google login error:', error);
        alert('Google sign-in is not enabled in the Firebase Console. Please enable it in Authentication > Sign-in method.');
      } else {
        console.error('Google login error:', error);
        alert('Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      const response = await fetch('/api/auth/linkedin/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'linkedin_oauth',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      alert('Failed to initiate LinkedIn login');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { token, user } = event.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setView('dashboard');
        fetchRfqs();
        fetchShipments();
        fetchInvoices();
        fetchNotifications();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('[LOGIN] Form submitted');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);

        // Try to sync with Firebase Auth
        try {
          let fbUser;
          try {
            fbUser = await signInWithEmailAndPassword(auth, email, password);
          } catch (fbErr: any) {
            console.warn('Firebase login failed, attempting to create user:', fbErr.message);
            fbUser = await createUserWithEmailAndPassword(auth, email, password);
          }

          if (fbUser && !data.user.uid) {
            const uid = fbUser.user.uid;
            data.user.uid = uid;
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            
            // Sync UID to backend
            fetch('/api/users/sync-uid', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
              },
              body: JSON.stringify({ uid })
            });
          }
        } catch (fbErr: any) {
          console.warn('Firebase sync failed, proceeding with local session:', fbErr.message);
        }

        if (data.user.uid) {
          syncUserToFirestore(data.user);
        }
        
        setView('dashboard');
        fetchRfqs();
        fetchShipments();
        fetchNotifications();
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (e) {
      console.error('Login error:', e);
      alert('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
  };

  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<{ id: string | number, type: 'RFQ' | 'Order' | 'Shipment' | 'Invoice' } | null>(null);

  const navigateTo = (v: any) => {
    setView(v);
    setIsMobileMenuOpen(false);
  };

  const isPublicView = ['landing', 'services', 'security', 'contact', 'careers', 'privacy', 'terms', 'cookies', 'blogs', 'blog-post', 'login', 'register'].includes(view);

  if (isPublicView) {
    return (
      <AppErrorBoundary>
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
        {!['login', 'register'].includes(view) && (
          <Navbar 
            onLogin={() => setView('login')} 
            onRegister={() => setView('register')} 
            onNavigate={(v) => setView(v as any)}
            currentView={view}
            t={t}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        
        {view === 'landing' && (
          <LandingPage 
            onLogin={() => setView('login')} 
            onRegister={() => setView('register')} 
            onNavigate={(v, id) => {
              if (v === 'blog-post' && id) {
                setSelectedBlogPost(Number(id));
              }
              setView(v as any);
            }}
            onQuickRfq={(data) => {
              setPrefilledRfqData(data);
              if (user) {
                setView('create-rfq');
              } else {
                setView('register');
              }
            }}
            lang={lang}
            onLangChange={setLang}
            t={t}
          />
        )}

        {view === 'services' && (
          <ServicesPage onBack={() => setView('landing')} onRegister={() => setView('register')} onNavigate={(v) => setView(v as any)} lang={lang} onLangChange={setLang} t={t} />
        )}

        {view === 'security' && (
          <SecurityPage onBack={() => setView('landing')} onRegister={() => setView('register')} onNavigate={(v) => setView(v as any)} lang={lang} onLangChange={setLang} t={t} />
        )}

        {view === 'contact' && (
          <ContactPage onBack={() => setView('landing')} onNavigate={(v) => setView(v as any)} lang={lang} onLangChange={setLang} t={t} />
        )}

        {view === 'careers' && (
          <CareersPage onBack={() => setView('landing')} onNavigate={(v) => setView(v as any)} lang={lang} onLangChange={setLang} t={t} />
        )}

        {view === 'privacy' && (
          <PrivacyPolicyPage onBack={() => setView('landing')} onNavigate={(v) => setView(v as any)} lang={lang} onLangChange={setLang} t={t} />
        )}

        {view === 'terms' && (
          <TermsAndConditionsPage onBack={() => setView('landing')} onNavigate={(v) => setView(v as any)} lang={lang} onLangChange={setLang} t={t} />
        )}

        {view === 'cookies' && (
          <CookiePolicyPage onBack={() => setView('landing')} onNavigate={(v) => setView(v as any)} lang={lang} onLangChange={setLang} t={t} />
        )}

        {view === 'blogs' && (
          <BlogView 
            onBack={() => setView('landing')} 
            t={t} 
            selectedPostId={selectedBlogPost}
            onSelectPost={(id) => {
              setSelectedBlogPost(id);
              setView('blog-post');
            }}
          />
        )}

        {view === 'blog-post' && (
          <BlogView 
            onBack={() => {
              setSelectedBlogPost(null);
              setView('blogs');
            }} 
            t={t} 
            selectedPostId={selectedBlogPost}
            onSelectPost={setSelectedBlogPost}
          />
        )}

        {view === 'register' && (
          <RegisterView 
            onBack={() => setView('landing')}
            onLogin={() => setView('login')}
            t={t}
            onSuccess={(u, token) => {
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(u));
              setUser(u);
              if (prefilledRfqData) {
                setView('create-rfq');
              } else {
                setView('dashboard');
              }
              fetchRfqs();
              fetchShipments();
              fetchInvoices();
              fetchFinanceAnalytics();
            }}
          />
        )}

        {view === 'login' && (
          <div className="min-h-screen flex bg-white dark:bg-zinc-950 overflow-hidden selection:bg-primary/10 selection:text-primary transition-colors duration-300">
            {/* Left Side: Branding & Visual (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center p-20">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover opacity-20 scale-105"
                  alt="Logistics background"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-zinc-950/80 to-zinc-950" />
                
                {/* Animated Orbs for depth */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
              </div>
              
              <div className="relative z-10 max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-16">
                    <Logo size="xl" className="text-white" />
                  </div>
                  
                  <div className="space-y-8">
                    <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.85] mb-8">
                      Global Trade <br />
                      <span className="text-primary italic font-serif font-light tracking-normal">Simplified</span>.
                    </h2>
                    <p className="text-zinc-400 text-xl leading-relaxed max-w-md font-medium">
                      Global sourcing company.
                    </p>
                  </div>
                  
                  <div className="mt-20 grid grid-cols-2 gap-12">
                    <div className="space-y-2">
                      <p className="text-5xl font-black text-white tracking-tighter">150+</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Global Partners</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-5xl font-black text-white tracking-tighter">24/7</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Expert Support</p>
                    </div>
                  </div>

                  <div className="mt-24 pt-12 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                      <p className="text-zinc-500 text-sm font-bold">
                        Joined by <span className="text-white">2,000+</span> industry leaders
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>


            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 pt-24 md:p-12 lg:p-24 bg-white dark:bg-zinc-950 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary lg:hidden" />
              
              <button 
                onClick={() => setView('landing')}
                className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium z-20"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to website
              </button>

              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px]"
              >
                <div className="mb-12 text-center">
                  <div className="flex justify-center mb-10">
                    <Logo size="lg" />
                  </div>
                </div>

                <div className="space-y-8">
                  <Card className="p-8 md:p-10 border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[2.5rem] transition-colors">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">
                          {t('emailAddress')}
                        </label>
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
                        <div className="flex items-center justify-between ml-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                            {t('currentPassword')}
                          </label>
                        </div>
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
                        <div className="flex justify-end pt-1">
                          <button type="button" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors">
                            Forgot Password?
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-1">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            id="remember" 
                            className="peer w-5 h-5 rounded-lg border-zinc-200 dark:border-zinc-800 text-primary focus:ring-primary/20 transition-all cursor-pointer appearance-none border-2 checked:bg-primary checked:border-primary bg-transparent" 
                          />
                          <Check className="w-3 h-3 text-white absolute left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <label htmlFor="remember" className="text-sm font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
                          Keep me signed in
                        </label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-16 rounded-2xl text-xl font-black tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-zinc-950 dark:bg-primary hover:bg-primary dark:hover:bg-primary/90" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>{t('loading')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Sign In</span>
                            <ArrowRight className="w-6 h-6" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </Card>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                      <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400 dark:text-zinc-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleGoogleLogin}
                      className="h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm shadow-sm text-zinc-900 dark:text-white"
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                      Google
                    </button>
                    <button 
                      onClick={handleLinkedInLogin}
                      className="h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm shadow-sm text-zinc-900 dark:text-white"
                    >
                      <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="LinkedIn" />
                      LinkedIn
                    </button>
                  </div>
                </div>

                <div className="mt-16 text-center">
                  <p className="text-zinc-500 dark:text-zinc-400 font-bold">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setView('register')} 
                      className="text-primary font-black hover:text-secondary transition-colors underline underline-offset-4"
                    >
                      Create one now
                    </button>
                  </p>
                  <button 
                    onClick={() => setView('landing')} 
                    className="mt-12 text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-primary transition-all flex items-center gap-2 mx-auto group"
                  >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {view !== 'login' && view !== 'register' && (
          <Footer onNavigate={(v) => setView(v as any)} currentLang={lang} onLangChange={setLang} t={t} />
        )}
        <ScrollToTop />
        </div>
      </AppErrorBoundary>
    );
  }


  const offersCount = visibleRfqs.filter(rfq => {
    if (!user) return false;
    return isOffer(rfq, user);
  }).length;

  return (
    <AppErrorBoundary>
      <div className="h-screen bg-[#F8F9FA] dark:bg-zinc-950 flex overflow-hidden transition-colors duration-300">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out fixed lg:static inset-y-0 z-50 lg:z-auto overflow-y-auto h-full",
        isSidebarCollapsed ? "w-20" : "w-64",
        lang === 'ar' ? "right-0" : "left-0",
        isMobileMenuOpen ? "translate-x-0" : (lang === 'ar' ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0")
      )}>
        <div className="p-6">
          <div className={cn("flex items-center mb-8", isSidebarCollapsed ? "justify-center" : "justify-between")}>
            <Logo collapsed={isSidebarCollapsed} />
            <div className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <button 
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="hidden lg:block p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {isSidebarCollapsed && (
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <nav className="space-y-8">
            <div className="mb-4 lg:hidden">
              <SidebarItem 
                icon={<ExternalLink className="w-4 h-4" />} 
                label="Back to Website" 
                onClick={() => {
                  setView('landing');
                  setIsMobileMenuOpen(false);
                }} 
                collapsed={isSidebarCollapsed}
                className="text-primary hover:bg-primary/5 font-bold"
              />
            </div>
            <div>
              {!isSidebarCollapsed && <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('dashboard')}</p>}
              <div className="space-y-1">
                <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label={t('dashboard')} active={view === 'dashboard'} onClick={() => navigateTo('dashboard')} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<FileText className="w-4 h-4" />} label={t('requests')} active={view === 'requests' || view === 'rfq-details' || view === 'create-rfq'} onClick={() => navigateTo('requests')} collapsed={isSidebarCollapsed} />
                {(user?.role === 'customer' || user?.role === 'shipping_agent' || user?.role === 'sourcing_agent' || user?.role === 'admin') && (
                  <SidebarItem icon={<Tag className="w-4 h-4" />} label={t('offers')} active={view === 'offers'} onClick={() => navigateTo('offers')} badge={offersCount} collapsed={isSidebarCollapsed} />
                )}
                <SidebarItem icon={<Truck className="w-4 h-4" />} label={user?.role === 'customer' ? t('orders') : t('shipments')} active={view === 'shipments' || view === 'shipment-details'} onClick={() => navigateTo('shipments')} collapsed={isSidebarCollapsed} />
              </div>
            </div>

            <div>
              {!isSidebarCollapsed && <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('finance')}</p>}
              <div className="space-y-1">
                {user?.role !== 'customer' && <SidebarItem icon={<Users className="w-4 h-4" />} label="Suppliers" onClick={() => setIsMobileMenuOpen(false)} collapsed={isSidebarCollapsed} />}
                <SidebarItem icon={<CreditCard className="w-4 h-4" />} label={t('finance')} active={view === 'finance'} onClick={() => navigateTo('finance')} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<BarChart3 className="w-4 h-4" />} label={t('analytics')} active={view === 'analytics'} onClick={() => navigateTo('analytics')} collapsed={isSidebarCollapsed} />
                {user?.role === 'admin' && (
                  <SidebarItem icon={<Shield className="w-4 h-4" />} label="Admin Panel" active={view === 'admin-dashboard'} onClick={() => navigateTo('admin-dashboard')} collapsed={isSidebarCollapsed} />
                )}
              </div>
            </div>

            <div>
              {!isSidebarCollapsed && <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('settings')}</p>}
              <div className="space-y-1">
                <SidebarItem icon={<UserCircle className="w-4 h-4" />} label={t('profile')} active={view === 'profile'} onClick={() => navigateTo('profile')} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<Settings className="w-4 h-4" />} label={t('settings')} active={view === 'settings'} onClick={() => navigateTo('settings')} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<HelpCircle className="w-4 h-4" />} label={t('helpCenter')} active={view === 'help'} onClick={() => navigateTo('help')} collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<MessageSquare className="w-4 h-4" />} label={t('messages')} active={view === 'messages'} onClick={() => navigateTo('messages')} collapsed={isSidebarCollapsed} />
              </div>
            </div>

          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <div className={cn("flex items-center gap-3", isSidebarCollapsed ? "justify-center" : "px-2")}>
            <button 
              onClick={() => navigateTo('profile')}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-white transition-colors shrink-0"
              title={isSidebarCollapsed ? t('profile') : undefined}
            >
              {user?.name?.[0] || 'U'}
            </button>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black tracking-tight truncate dark:text-white">{user?.name}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate dark:text-zinc-500">{user?.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          <SidebarItem 
            icon={<LogOut className="w-4 h-4" />} 
            label={t('signOut')} 
            onClick={handleLogout} 
            collapsed={isSidebarCollapsed}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300">
        <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black tracking-tight capitalize text-zinc-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
              {view === 'shipments' && user?.role === 'customer' ? t('orders') : 
               view === 'shipment-details' && user?.role === 'customer' ? 'Order Details' : 
               view.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className={cn("w-4 h-4 absolute top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500", lang === 'ar' ? "right-4" : "left-4")} />
              <input 
                type="text" 
                placeholder={t('searchProjects')} 
                className={cn(
                  "pr-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl text-sm w-72 focus:ring-2 focus:ring-primary/20 transition-all font-medium dark:text-white dark:placeholder:text-zinc-500",
                  lang === 'ar' ? "pr-12 pl-6" : "pl-12 pr-6"
                )}
              />
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setView('landing')}
                className="hidden lg:flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary rounded-xl px-4 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Back to Website
              </Button>

              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 relative transition-colors"
                >
                  <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className={cn("absolute top-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-white dark:border-zinc-900", lang === 'ar' ? "left-2.5" : "right-2.5")}></span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsNotificationsOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                          "absolute mt-2 w-80 md:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 z-50 overflow-hidden",
                          lang === 'ar' ? "left-0" : "right-0"
                        )}
                      >
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                          <h3 className="font-bold text-zinc-900 dark:text-white">Notifications</h3>
                          {notifications.filter(n => !n.is_read).length > 0 && (
                            <button 
                              onClick={markAllNotificationsAsRead}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                              <Bell className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                              <p className="text-sm text-zinc-500">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div 
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={cn(
                                  "p-4 border-b border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex gap-3",
                                  !n.is_read && "bg-primary/5"
                                )}
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                                  n.type === 'success' ? "bg-green-100 text-green-600" :
                                  n.type === 'error' ? "bg-red-100 text-red-600" :
                                  n.type === 'warning' ? "bg-amber-100 text-amber-600" :
                                  "bg-blue-100 text-blue-600"
                                )}>
                                  {n.type === 'success' ? <CheckCircle2 size={18} /> :
                                   n.type === 'error' ? <AlertCircle size={18} /> :
                                   n.type === 'warning' ? <AlertCircle size={18} /> :
                                   <Info size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn("text-sm font-bold text-zinc-900", !n.is_read && "text-primary")}>{n.title}</p>
                                  <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{n.message}</p>
                                  <p className="text-[10px] text-zinc-400 mt-1">
                                    {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                {!n.is_read && (
                                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                )}
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 text-center">
                          <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
                            View all history
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isLanguageOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsLanguageOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                          "absolute mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 min-w-[160px] z-50",
                          lang === 'ar' ? "left-0" : "right-0"
                        )}
                      >
                        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border-b border-zinc-50 dark:border-zinc-800 mb-1">{t('language')}</p>
                        {Object.entries(translations[lang]?.languages || translations['en'].languages).map(([code, name]) => (
                          <button
                            key={code}
                            onClick={() => {
                              setLang(code);
                              setIsLanguageOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all",
                              lang === code ? "bg-primary text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                            )}
                          >
                            {name as string}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
              user={user!} 
              rfqs={visibleRfqs} 
              shipments={shipments}
              analytics={financeAnalytics}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isOffer={isOffer}
              isOrder={isOrder}
              isRequest={isRequest}
              onSelectRfq={(rfq, tab) => { 
                if (rfq.status === 'draft' && user?.role === 'customer') {
                  setDraftToEdit(rfq);
                  setView('create-rfq');
                } else {
                  setActiveRfqTab(tab || 'details');
                  fetchSelectedRfq(rfq.id); 
                  setView('rfq-details'); 
                }
              }} 
              onCreateRfq={() => {
                setDraftToEdit(null);
                setView('create-rfq');
              }}
              onDeleteRfq={confirmDeleteRfq}
              t={t}
              lang={lang}
            />
          )}
          {view === 'requests' && (
            <RequestsView 
              user={user!} 
              rfqs={visibleRfqs} 
              viewMode={viewMode}
              setViewMode={setViewMode}
              mode="requests"
              isOffer={isOffer}
              isOrder={isOrder}
              isRequest={isRequest}
              onSelectRfq={(rfq, tab) => { 
                if (rfq.status === 'draft' && user?.role === 'customer') {
                  setDraftToEdit(rfq);
                  setView('create-rfq');
                } else {
                  setActiveRfqTab(tab || 'details');
                  fetchSelectedRfq(rfq.id); 
                  setView('rfq-details'); 
                }
              }} 
              onCreateRfq={() => {
                setDraftToEdit(null);
                setView('create-rfq');
              }}
              onDeleteRfq={confirmDeleteRfq}
              t={t}
              lang={lang}
            />
          )}
          {view === 'offers' && (
            <RequestsView 
              user={user!} 
              rfqs={visibleRfqs} 
              viewMode={viewMode}
              setViewMode={setViewMode}
              mode="offers"
              initialStatus="offers"
              isOffer={isOffer}
              isOrder={isOrder}
              isRequest={isRequest}
              onSelectRfq={(rfq, tab) => { 
                setActiveRfqTab(tab || 'offers');
                fetchSelectedRfq(rfq.id); 
                setView('rfq-details'); 
              }} 
              onCreateRfq={() => {
                setDraftToEdit(null);
                setView('create-rfq');
              }}
              onDeleteRfq={confirmDeleteRfq}
              t={t}
              lang={lang}
            />
          )}
          {view === 'create-rfq' && (
          <CreateRFQForm 
            user={user!}
            isDarkMode={isDarkMode}
            initialRfq={draftToEdit || undefined}
            prefilledData={prefilledRfqData}
            onCancel={() => {
              setDraftToEdit(null);
              setPrefilledRfqData(null);
              fetchRfqs();
              setView('dashboard');
            }} 
            onSuccess={(id) => {
              setDraftToEdit(null);
              setPrefilledRfqData(null);
              fetchRfqs();
              fetchSelectedRfq(id);
              setView('rfq-details');
            }} 
          />
        )}
          {view === 'rfq-details' && selectedRfq && (
            <RFQDetails 
              rfq={selectedRfq} 
              user={user!} 
              initialTab={activeRfqTab}
              onBack={() => setView('dashboard')} 
              onUpdate={() => fetchSelectedRfq(selectedRfq.id)} 
              onChat={(id, type) => {
                setChatContext({ id, type });
                setIsFloatingChatOpen(true);
              }}
            />
          )}
          {view === 'shipments' && (
            <ShipmentsView 
              user={user!} 
              shipments={shipments} 
              rfqs={visibleRfqs}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onTrackDetails={(s) => { setSelectedShipment(s); setView('shipment-details'); }} 
              onSelectRfq={(rfq) => { fetchSelectedRfq(rfq.id); setView('rfq-details'); }}
              onCreateShipment={() => setView('create-shipment')} 
            />
          )}
          {view === 'shipment-details' && selectedShipment && (
            <ShipmentDetails 
              user={user!} 
              shipment={selectedShipment} 
              onBack={() => setView('shipments')} 
              onChat={(id, type) => {
                setChatContext({ id, type });
                setIsFloatingChatOpen(true);
              }}
            />
          )}
          {view === 'create-shipment' && <CreateShipmentForm user={user!} rfqs={availableRfqsForShipment} onCancel={() => setView('shipments')} onSuccess={() => { fetchShipments(); fetchRfqs(); setView('shipments'); }} />}
          {view === 'finance' && (
            <FinanceView 
              user={user!}
              invoices={invoices} 
              analytics={financeAnalytics} 
              viewMode={viewMode}
              setViewMode={setViewMode}
              onUpdate={() => { fetchInvoices(); fetchFinanceAnalytics(); }} 
              onChat={(id, type) => {
                setChatContext({ id, type });
                setIsFloatingChatOpen(true);
              }}
            />
          )}
          {view === 'analytics' && <AnalyticsView analytics={financeAnalytics} />}
          {view === 'settings' && (
            <SettingsView 
              user={user!} 
              t={t}
              lang={lang}
              setLang={setLang}
              onUpdate={(updatedUser) => {
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }} 
            />
          )}
          {view === 'profile' && (
            <ProfileView 
              user={user!} 
              t={t}
              onUpdate={(updatedUser) => {
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }} 
            />
          )}
          {view === 'help' && <HelpCenter />}
          {view === 'messages' && user && isAuthReady && <ChatView currentUser={user} t={t} />}
          {view === 'admin-dashboard' && user?.role === 'admin' && isAuthReady && <AdminDashboard t={t} isDarkMode={isDarkMode} />}
        </div>
      </main>

      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Request"
        message="Are you sure you want to delete this draft request? This action cannot be undone."
        onConfirm={executeDeleteRfq}
        onCancel={() => setDeleteConfirm({ isOpen: false, rfqId: null })}
      />

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isFloatingChatOpen && user && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-6xl h-[85vh] overflow-hidden shadow-2xl border border-zinc-200 relative"
            >
              <button 
                onClick={() => setIsFloatingChatOpen(false)}
                className="absolute top-6 right-6 z-[210] p-3 bg-white/80 backdrop-blur-md hover:bg-zinc-100 rounded-2xl transition-all shadow-sm active:scale-95"
              >
                <X className="w-6 h-6 text-zinc-400" />
              </button>
              <ChatView 
                currentUser={user} 
                t={t} 
                isFloating={true}
                initialRelatedId={chatContext?.id}
                initialRelatedType={chatContext?.type}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </AppErrorBoundary>
  );
}

function ProfileView({ user, onUpdate, t }: { user: User, onUpdate: (user: User) => void, t: (key: string) => string }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User>(user);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error('Failed to fetch profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: profile.name,
          type: profile.type,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          company_details: profile.company_details
        })
      });
      if (res.ok) {
        onUpdate(profile);
        alert('Profile updated successfully');
      }
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                )}
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 text-primary hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">{profile.name}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">{profile.role.replace('_', ' ')} • {profile.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t('businessIdentity')}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('displayName')}</label>
                <Input 
                  value={profile.name ?? ''} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('website')}</label>
                <Input 
                  value={profile.company_details?.website ?? ''} 
                  onChange={e => setProfile({
                    ...profile, 
                    company_details: { ...profile.company_details, website: e.target.value }
                  })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {profile.role === 'customer' ? t('companyDetails') : 'Professional Details'}
              </h4>
              
              {profile.role === 'customer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('companyDetails')}</label>
                    <Input 
                      value={profile.company_details?.companyName ?? ''} 
                      onChange={e => setProfile({
                        ...profile, 
                        company_details: { ...profile.company_details, companyName: e.target.value }
                      })}
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('vatNumber')}</label>
                    <Input 
                      value={profile.company_details?.vatNumber ?? ''} 
                      onChange={e => setProfile({
                        ...profile, 
                        company_details: { ...profile.company_details, vatNumber: e.target.value }
                      })}
                      placeholder="US123456789"
                    />
                  </div>
                </div>
              )}

              {profile.role === 'sourcing_agent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('expertise')}</label>
                    <Input 
                      value={profile.company_details?.expertise ?? ''} 
                      onChange={e => setProfile({
                        ...profile, 
                        company_details: { ...profile.company_details, expertise: e.target.value }
                      })}
                      placeholder="Electronics, Textiles, Furniture"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('regions')}</label>
                    <Input 
                      value={profile.company_details?.regions ?? ''} 
                      onChange={e => setProfile({
                        ...profile, 
                        company_details: { ...profile.company_details, regions: e.target.value }
                      })}
                      placeholder="China, Vietnam, India"
                    />
                  </div>
                </div>
              )}

              {profile.role === 'shipping_agent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('transportModes')}</label>
                    <Input 
                      value={profile.company_details?.modes ?? ''} 
                      onChange={e => setProfile({
                        ...profile, 
                        company_details: { ...profile.company_details, modes: e.target.value }
                      })}
                      placeholder="Sea Freight, Air Freight, Rail"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('logisticsHubs')}</label>
                    <Input 
                      value={profile.company_details?.hubs ?? ''} 
                      onChange={e => setProfile({
                        ...profile, 
                        company_details: { ...profile.company_details, hubs: e.target.value }
                      })}
                      placeholder="Shanghai, Rotterdam, Los Angeles"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('bio')}</label>
              <textarea 
                className="w-full min-h-[120px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                value={profile.company_details?.bio ?? ''}
                onChange={e => setProfile({
                  ...profile, 
                  company_details: { ...profile.company_details, bio: e.target.value }
                })}
                placeholder="Describe your business or professional background..."
              />
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={fetchProfile}>{t('reset')}</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              {t('updateProfile')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function SettingsView({ user, onUpdate, t, lang, setLang }: { user: User, onUpdate: (user: User) => void, t: (key: string) => string, lang: string, setLang: (l: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<User>(user);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error('Failed to fetch settings');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phone: settings.phone,
          type: settings.type,
          preferences: settings.preferences
        })
      });
      if (res.ok) {
        onUpdate(settings);
        alert('Settings saved successfully');
      }
    } catch (e) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });
      if (res.ok) {
        alert('Password changed successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to change password');
      }
    } catch (e) {
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSaveSettings} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t('contactAndType')}</h4>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('emailAddress')} (Read-only)</label>
                <Input value={settings.email ?? ''} disabled readOnly className="bg-zinc-50 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('phoneNumber')}</label>
                <Input 
                  value={settings.phone ?? ''} 
                  onChange={e => setSettings({...settings, phone: e.target.value})}
                  placeholder="+212 775 333 133"
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('accountType')}</label>
                <select 
                  className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                  value={settings.type ?? ''}
                  onChange={e => setSettings({...settings, type: e.target.value as any})}
                >
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t('appPreferences')}</h4>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('baseCurrency')}</label>
                <select 
                  className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                  value={settings.preferences?.currency ?? ''}
                  onChange={e => setSettings({
                    ...settings, 
                    preferences: { ...(settings.preferences || { notifications: true, language: lang }), currency: e.target.value }
                  })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CNY">CNY (¥)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('language')}</label>
                <select 
                  className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                  value={settings.preferences?.language ?? ''}
                  onChange={e => {
                    const newLang = e.target.value;
                    setSettings({
                      ...settings, 
                      preferences: { ...(settings.preferences || { notifications: true, currency: 'USD' }), language: newLang }
                    });
                    setLang(newLang);
                  }}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                  <option value="es">Spanish</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('emailNotifications')}</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('receiveUpdates')}</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-primary focus:ring-primary"
                  checked={!!settings.preferences?.emailNotifications}
                  onChange={e => setSettings({
                    ...settings, 
                    preferences: { ...(settings.preferences || { currency: 'USD', language: lang, notifications: true }), emailNotifications: e.target.checked }
                  })}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('inAppNotifications')}</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('inAppUpdates')}</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-primary focus:ring-primary"
                  checked={!!settings.preferences?.notifications}
                  onChange={e => setSettings({
                    ...settings, 
                    preferences: { ...(settings.preferences || { currency: 'USD', language: lang, emailNotifications: true }), notifications: e.target.checked }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button type="submit" disabled={loading}>{t('savePreferences')}</Button>
          </div>
        </form>
      </Card>

      <Card className="p-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{t('security')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('updatePassword')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('currentPassword')}</label>
              <Input 
                type="password" 
                value={passwords.current ?? ''}
                onChange={e => setPasswords({...passwords, current: e.target.value})}
                required
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('newPassword')}</label>
              <Input 
                type="password" 
                value={passwords.new ?? ''}
                onChange={e => setPasswords({...passwords, new: e.target.value})}
                required
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('confirmNewPassword')}</label>
              <Input 
                type="password" 
                value={passwords.confirm ?? ''}
                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                required
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="outline" disabled={loading}>{t('updatePasswordBtn')}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, badge, collapsed = false, className }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, badge?: number, collapsed?: boolean, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
        collapsed ? "justify-center" : "justify-between",
        active ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
        className
      )}
      title={collapsed ? label : undefined}
    >
      <div className="flex items-center gap-3">
        {icon}
        {!collapsed && <span>{label}</span>}
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          "px-1.5 py-0.5 rounded-md text-[10px] font-black",
          collapsed 
            ? "absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[8px] bg-secondary text-white border-2 border-white dark:border-zinc-900 rounded-full" 
            : active ? "bg-white text-primary" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors"
        )}>
          {badge}
        </span>
      )}
    </button>
  );
}

// --- Dashboard View ---

function Dashboard({ 
  user, 
  rfqs, 
  analytics, 
  viewMode, 
  setViewMode, 
  isOffer,
  isOrder,
  isRequest,
  onSelectRfq, 
  onCreateRfq,
  onDeleteRfq,
  shipments = [],
  t,
  lang
}: { 
  user: User, 
  rfqs: RFQ[], 
  analytics: any, 
  viewMode: 'grid' | 'table', 
  setViewMode: (mode: 'grid' | 'table') => void, 
  isOffer: (rfq: RFQ, u: User) => boolean,
  isOrder: (rfq: RFQ) => boolean,
  isRequest: (rfq: RFQ, u: User) => boolean,
  onSelectRfq: (rfq: RFQ, tab?: 'details' | 'offers' | 'action') => void, 
  onCreateRfq: () => void,
  onDeleteRfq?: (id: number) => void,
  shipments?: Shipment[],
  t: (key: string) => string,
  lang: string
}) {
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  
  const sortedRfqs = [...rfqs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const filteredRfqs = sortedRfqs.filter(rfq => {
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'drafts' && rfq.status === 'draft') ||
      (statusFilter === 'pending' && rfq.status === 'submitted') ||
      (statusFilter === 'offers' && isOffer(rfq, user)) ||
      (statusFilter === 'active' && isRequest(rfq, user) && !['draft', 'submitted'].includes(rfq.status)) ||
      (statusFilter === 'ordered' && isOrder(rfq)) ||
      (rfq.status === statusFilter);

    if (!matchesStatus) return false;

    // Search filter
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      rfq.id.toString().includes(searchLower) ||
      rfq.origin_country.toLowerCase().includes(searchLower) ||
      rfq.destination_country.toLowerCase().includes(searchLower) ||
      rfq.products?.some(p => p.name.toLowerCase().includes(searchLower))
    );
  });

  const draftsCount = rfqs.filter(r => r.status === 'draft').length;
  const pendingCount = rfqs.filter(r => r.status === 'submitted').length;
  const activeCount = rfqs.filter(r => isRequest(r, user) && !['draft', 'submitted'].includes(r.status)).length;
  const ordersCount = rfqs.filter(r => isOrder(r)).length;
  const offersCount = rfqs.filter(r => isOffer(r, user)).length;
  const shipmentsCount = shipments.length;
  const landedValue = analytics ? `$${(analytics.totalSpend / 1000).toFixed(1)}k` : "$0.0k";

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['shipping_agent', 'sourcing_agent', 'admin'].includes(user.role) ? (
          <>
            <StatCard label={t('activeRfqs')} value={activeCount.toString()} icon={<FileText className="w-5 h-5" />} trend="+2 this week" />
            <StatCard label={t('activeOrders')} value={ordersCount.toString()} icon={<Package className="w-5 h-5" />} color="blue" />
            <StatCard label={t('shipments')} value={shipmentsCount.toString()} icon={<Truck className="w-5 h-5" />} color="secondary" />
            <StatCard label={t('landedValue')} value={landedValue} icon={<CreditCard className="w-5 h-5" />} color="green" trend="+12%" />
          </>
        ) : (
          <>
            <StatCard label={t('activeRfqs')} value={activeCount.toString()} icon={<FileText className="w-5 h-5" />} trend="+2 this week" />
            {user.role === 'customer' ? (
              <StatCard 
                label={t('offers')} 
                value={offersCount.toString()} 
                icon={<Tag className="w-5 h-5" />} 
                color="secondary" 
                trend={offersCount > 0 ? "Action required" : undefined} 
              />
            ) : (
              offersCount > 0 ? (
                <StatCard label={t('offers')} value={offersCount.toString()} icon={<Tag className="w-5 h-5" />} color="secondary" trend="Action required" />
              ) : (
                <StatCard label={t('pending')} value={pendingCount.toString()} icon={<Clock className="w-5 h-5" />} color="secondary" />
              )
            )}
            <StatCard label={user.role === 'customer' ? t('myOrders') : t('activeOrders')} value={ordersCount.toString()} icon={<Package className="w-5 h-5" />} color="blue" />
            <StatCard label={t('landedValue')} value={landedValue} icon={<CreditCard className="w-5 h-5" />} color="green" trend="+12%" />
          </>
        )}
      </div>

      {/* Pending Offers Alert Section */}
      {offersCount > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {rfqs.filter(rfq => isOffer(rfq, user)).map(rfq => (
              <Card key={rfq.id} className="p-6 bg-primary/5 border-primary/10 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => onSelectRfq(rfq, 'offers')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">
                        {user.role === 'customer' ? t('newOfferReady') : user.role === 'shipping_agent' ? t('shippingQuoteNeeded') : t('sourcingOfferNeeded')}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        RFQ #{rfq.id.toString().padStart(4, '0')} • {rfq.products?.[0]?.name || 'Product'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('status')}</p>
                      <StatusBadge status={rfq.status} />
                    </div>
                    <Button size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6">
                      {user.role === 'customer' ? t('reviewOffer') : t('addDetails')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setStatusFilter('all')}
                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'all' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
              >
                All
              </button>
              {user.role === 'customer' && (
                <button 
                  onClick={() => setStatusFilter('drafts')}
                  className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'drafts' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
                >
                  Drafts ({draftsCount})
                </button>
              )}
              <button 
                onClick={() => setStatusFilter('pending')}
                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'pending' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
              >
                Pending ({pendingCount})
              </button>
              <button 
                onClick={() => setStatusFilter('offers')}
                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'offers' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
              >
                Offers ({offersCount})
              </button>
              <button 
                onClick={() => setStatusFilter('active')}
                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'active' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
              >
                Active ({activeCount})
              </button>
              <button 
                onClick={() => setStatusFilter('ordered')}
                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'ordered' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
              >
                Orders ({ordersCount})
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchTerm ?? ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 w-32 focus:w-48 transition-all"
              />
            </div>
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Filter className="w-4 h-4 text-zinc-400" /></button>
          </div>
        </div>

        {filteredRfqs.length === 0 ? (
          <Card className="border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden rounded-[2rem]">
            <div className="px-8 py-24 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center">
                  <Package className="w-10 h-10 text-zinc-200 dark:text-zinc-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-900 dark:text-white font-black text-lg">No requests found</p>
                  <p className="text-zinc-400 dark:text-zinc-500 font-medium text-sm">Try adjusting your filters or create a new sourcing project.</p>
                </div>
                {/* Removed New RFQ button from empty state as per request */}
              </div>
            </div>
          </Card>
        ) : viewMode === 'table' ? (
          <Card className="border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden rounded-[2rem]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">RFQ ID & Date</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Photo</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Product Name</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Qty</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Link</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Sourcing</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Destination</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Quality</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Budget</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Offer</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Lead Time</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Mode</th>
                    <th className="px-6 py-5 border-r border-zinc-100 dark:border-zinc-800">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {filteredRfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer" onClick={() => onSelectRfq(rfq)}>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800">
                        <p className="font-mono text-xs font-black text-zinc-900 dark:text-white">#{rfq.id.toString().padStart(4, '0')}</p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider italic font-serif">{new Date(rfq.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200/50 dark:border-zinc-700 shadow-sm">
                          {rfq.products?.[0]?.photo_urls?.[0] ? (
                            <img src={rfq.products[0].photo_urls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Package className="w-5 h-5 text-zinc-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs font-black text-zinc-900 dark:text-white truncate max-w-[150px]">{rfq.products?.[0]?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800 text-center">
                        <p className="text-xs font-black text-zinc-900 dark:text-white">{rfq.products?.[0]?.quantity || 0}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">{rfq.products?.[0]?.unit || 'pcs'}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800 text-center">
                        {rfq.products?.[0]?.website_link ? (
                          <a 
                            href={rfq.products[0].website_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4 mx-auto" />
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800">
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[10px] font-black text-zinc-900 dark:text-zinc-100">{rfq.origin_country}</span>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800">
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[10px] font-black text-zinc-900 dark:text-zinc-100">{rfq.destination_country}</span>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">{rfq.quality_level || '-'}</span>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800 text-right">
                        <p className="text-xs font-black text-zinc-900 dark:text-white">${rfq.total_budget?.toLocaleString() || 0}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800 text-right">
                        {(rfq as any).offers?.[0] ? (
                          <p className="text-xs font-black text-emerald-600">${(rfq as any).offers[0].total_cost?.toLocaleString()}</p>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-300 italic">No Offer</span>
                        )}
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800 text-center">
                        {(rfq as any).offers?.[0] ? (
                          <p className="text-[10px] font-black text-zinc-900 dark:text-white">{(rfq as any).offers[0].production_time}</p>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {rfq.delivery_mode === 'sea' ? <Ship className="w-3 h-3 text-zinc-400" /> : rfq.delivery_mode === 'air' ? <Plane className="w-3 h-3 text-zinc-400" /> : <Truck className="w-3 h-3 text-zinc-400" />}
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{rfq.delivery_mode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 dark:border-zinc-800">
                        <StatusBadge status={rfq.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                          {user.role === 'customer' && (
                            <div className="flex items-center gap-2">
                              {['draft', 'payment_pending'].includes(rfq.status) && (
                                <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  className="rounded-xl text-[10px] h-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectRfq(rfq);
                                  }}
                                >
                                  {rfq.status === 'draft' ? 'Complete & Pay' : 'Pay Now'}
                                </Button>
                              )}
                              {['draft', 'submitted', 'payment_pending', 'rejected'].includes(rfq.status) && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteRfq?.(rfq.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        {rfq.status === 'submitted' && (user.role === 'shipping_agent' || user.role === 'admin') && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRfq(rfq, 'details');
                            }}
                          >
                            Review & Approve
                          </Button>
                        )}
                        {(user.role === 'shipping_agent' || user.role === 'admin') && 
                         (rfq.status === 'approved' || rfq.status === 'paid' || rfq.status === 'submitted' || rfq.status === 'draft') && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-xl text-[10px] h-8 border-primary/20 text-primary hover:bg-primary hover:text-white dark:border-primary/40 dark:hover:bg-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRfq(rfq, 'action');
                            }}
                          >
                            Assign Agent
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="rounded-xl text-[10px] h-8 font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRfq(rfq, 'details');
                          }}
                        >
                          View
                        </Button>
                        <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRfqs.map((rfq) => (
              <Card key={rfq.id} className="p-6 border border-zinc-200 bg-white shadow-xl shadow-zinc-200/10 rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer group" onClick={() => onSelectRfq(rfq)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center overflow-hidden border border-zinc-100 shadow-sm">
                    {rfq.products?.[0]?.photo_urls?.[0] ? (
                      <img src={rfq.products[0].photo_urls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Package className="w-6 h-6 text-zinc-300" />
                    )}
                  </div>
                  <StatusBadge status={rfq.status} />
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm font-black text-zinc-900 truncate">{rfq.products?.[0]?.name || 'Multiple Products'}</p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ref: #{rfq.id.toString().padStart(4, '0')}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-900">
                    <span>{rfq.origin_country}</span>
                    <ArrowRight className="w-3 h-3 text-primary" />
                    <span>{rfq.destination_country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {rfq.status === 'draft' && user.role === 'customer' && (
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="rounded-xl text-[10px] h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRfq(rfq);
                          }}
                        >
                          Complete & Pay
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRfq?.(rfq.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {rfq.status === 'submitted' && (user.role === 'shipping_agent' || user.role === 'admin') && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRfq(rfq, 'details');
                        }}
                      >
                        Review & Approve
                      </Button>
                    )}
                    {(user.role === 'shipping_agent' || user.role === 'admin') && 
                     (rfq.status === 'approved' || rfq.status === 'paid' || rfq.status === 'submitted' || rfq.status === 'draft') && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-xl text-[10px] h-8 border-primary/20 text-primary hover:bg-primary hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRfq(rfq, 'action');
                        }}
                      >
                        Assign
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="rounded-xl text-[10px] h-8 font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-primary/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRfq(rfq, 'details');
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RequestsView({ 
  user, 
  rfqs, 
  viewMode, 
  setViewMode, 
  onSelectRfq, 
  onCreateRfq, 
  onDeleteRfq,
  mode = 'requests',
  initialStatus = 'all',
  isOffer,
  isOrder,
  isRequest,
  t,
  lang
}: { 
  user: User, 
  rfqs: RFQ[], 
  viewMode: 'grid' | 'table', 
  setViewMode: (mode: 'grid' | 'table') => void, 
  onSelectRfq: (rfq: RFQ, tab?: 'details' | 'offers' | 'action') => void, 
  onCreateRfq: () => void, 
  onDeleteRfq?: (id: number) => void,
  mode?: 'requests' | 'offers',
  initialStatus?: string,
  isOffer: (rfq: RFQ, u: User) => boolean,
  isOrder: (rfq: RFQ) => boolean,
  isRequest: (rfq: RFQ, u: User) => boolean,
  t: (key: string) => string,
  lang: string
}) {
  const [statusFilter, setStatusFilter] = React.useState<string>(initialStatus);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const sortedRfqs = [...rfqs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  const filteredRfqs = sortedRfqs.filter(rfq => {
    // Global mode filter
    if (mode === 'requests' && !isRequest(rfq, user)) return false;
    if (mode === 'offers' && !isOffer(rfq, user)) return false;

    // Status filter within mode
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'drafts' && rfq.status === 'draft') ||
      (statusFilter === 'pending' && rfq.status === 'submitted') ||
      (statusFilter === 'offers' && isOffer(rfq, user)) ||
      (statusFilter === 'active' && isRequest(rfq, user) && !['draft', 'submitted'].includes(rfq.status)) ||
      (statusFilter === 'ordered' && isOrder(rfq)) ||
      (rfq.status === statusFilter);

    if (!matchesStatus) return false;

    // Multi-status filter
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(rfq.status)) return false;

    // Search filter
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      rfq.id.toString().includes(searchLower) ||
      rfq.origin_country.toLowerCase().includes(searchLower) ||
      rfq.destination_country.toLowerCase().includes(searchLower) ||
      rfq.products?.some(p => p.name.toLowerCase().includes(searchLower))
    );
  });

  const draftsCount = rfqs.filter(r => r.status === 'draft').length;
  const pendingCount = rfqs.filter(r => r.status === 'submitted').length;
  const activeCount = rfqs.filter(r => isRequest(r, user) && !['draft', 'submitted'].includes(r.status)).length;
  const ordersCount = rfqs.filter(r => isOrder(r)).length;
  const offersCount = rfqs.filter(r => isOffer(r, user)).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {user.role === 'customer' && mode === 'requests' && (
          <Button size="sm" variant="secondary" onClick={onCreateRfq} className="rounded-xl px-6">
            <Plus className={cn("w-4 h-4", lang === 'ar' ? "ml-2" : "mr-2")} />
            {t('newRfq')}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-zinc-100 p-1 rounded-xl">
              {mode === 'requests' ? (
                <>
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'all' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
                  >
                    All
                  </button>
                  {user.role === 'customer' && (
                    <button 
                      onClick={() => setStatusFilter('drafts')}
                      className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'drafts' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
                    >
                      Drafts ({draftsCount})
                    </button>
                  )}
                  <button 
                    onClick={() => setStatusFilter('pending')}
                    className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'pending' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button 
                    onClick={() => setStatusFilter('active')}
                    className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", statusFilter === 'active' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
                  >
                    Active ({activeCount})
                  </button>
                </>
              ) : (
                <button 
                  className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-zinc-900 shadow-sm"
                >
                  Offers ({offersCount})
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-[10px] font-black uppercase tracking-widest",
                  selectedStatuses.length > 0 ? "text-primary border-primary/30" : "text-zinc-600 dark:text-zinc-400"
                )}
              >
                <Filter className="w-3 h-3" />
                <span>Status {selectedStatuses.length > 0 ? `(${selectedStatuses.length})` : ''}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", isStatusDropdownOpen ? "rotate-180" : "")} />
              </button>

              <AnimatePresence>
                {isStatusDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-2xl z-[60] p-2"
                  >
                    <div className="p-2 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Filter Status</span>
                      {selectedStatuses.length > 0 && (
                        <button 
                          onClick={() => setSelectedStatuses([])}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                      {['draft', 'submitted', 'approved', 'rejected', 'paid', 'assigned', 'sourcing', 'shipping', 'offered', 'ordered', 'shipped'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatuses(prev => 
                              prev.includes(status) 
                                ? prev.filter(s => s !== status) 
                                : [...prev, status]
                            );
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                            selectedStatuses.includes(status) 
                              ? "bg-primary/5 text-primary" 
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          )}
                        >
                          <span className="capitalize">{status}</span>
                          {selectedStatuses.includes(status) && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-xl border border-zinc-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchTerm ?? ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold text-zinc-900 placeholder:text-zinc-400 w-32 focus:w-48 transition-all"
              />
            </div>
          </div>
        </div>

        {filteredRfqs.length === 0 ? (
          <Card className="border border-zinc-200 shadow-xl shadow-zinc-200/20 overflow-hidden rounded-[2rem]">
            <div className="px-8 py-24 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center">
                  <Package className="w-10 h-10 text-zinc-200" />
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-900 font-black text-lg">No requests found</p>
                  <p className="text-zinc-400 font-medium text-sm">Try adjusting your filters or create a new sourcing project.</p>
                </div>
              </div>
            </div>
          </Card>
        ) : viewMode === 'table' ? (
          <Card className="border border-zinc-200 shadow-xl shadow-zinc-200/10 overflow-hidden rounded-[2rem]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-5 border-r border-zinc-100">RFQ ID & Date</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Photo</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Product Name</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Qty</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Link</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Sourcing</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Destination</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Quality</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Budget</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Offer</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Lead Time</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Mode</th>
                    <th className="px-6 py-5 border-r border-zinc-100">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {filteredRfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-zinc-50/80 transition-all group cursor-pointer" onClick={() => onSelectRfq(rfq)}>
                      <td className="px-6 py-6 border-r border-zinc-100">
                        <p className="font-mono text-xs font-black text-zinc-900">#{rfq.id.toString().padStart(4, '0')}</p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider italic font-serif">{new Date(rfq.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200/50 shadow-sm">
                          {rfq.products?.[0]?.photo_urls?.[0] ? (
                            <img src={rfq.products[0].photo_urls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Package className="w-5 h-5 text-zinc-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100">
                        <p className="text-xs font-black text-zinc-900 truncate max-w-[150px]">{rfq.products?.[0]?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 text-center">
                        <p className="text-xs font-black text-zinc-900">{rfq.products?.[0]?.quantity || 0}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">{rfq.products?.[0]?.unit || 'pcs'}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 text-center">
                        {rfq.products?.[0]?.website_link ? (
                          <a 
                            href={rfq.products[0].website_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4 mx-auto" />
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100">
                        <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-[10px] font-black text-zinc-900">{rfq.origin_country}</span>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100">
                        <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-[10px] font-black text-zinc-900">{rfq.destination_country}</span>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{rfq.quality_level || '-'}</span>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 text-right">
                        <p className="text-xs font-black text-zinc-900">${rfq.total_budget?.toLocaleString() || 0}</p>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 text-right">
                        {(rfq as any).offers?.[0] ? (
                          <p className="text-xs font-black text-emerald-600">${(rfq as any).offers[0].total_cost?.toLocaleString()}</p>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-300 italic">No Offer</span>
                        )}
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 text-center">
                        {(rfq as any).offers?.[0] ? (
                          <p className="text-[10px] font-black text-zinc-900">{(rfq as any).offers[0].production_time}</p>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {rfq.delivery_mode === 'sea' ? <Ship className="w-3 h-3 text-zinc-400" /> : rfq.delivery_mode === 'air' ? <Plane className="w-3 h-3 text-zinc-400" /> : <Truck className="w-3 h-3 text-zinc-400" />}
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{rfq.delivery_mode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 border-r border-zinc-100">
                        <StatusBadge status={rfq.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-3">
                          {user.role === 'customer' && (
                            <div className="flex items-center gap-2">
                              {['draft', 'payment_pending'].includes(rfq.status) && (
                                <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  className="rounded-xl text-[10px] h-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectRfq(rfq);
                                  }}
                                >
                                  {rfq.status === 'draft' ? 'Complete & Pay' : 'Pay Now'}
                                </Button>
                              )}
                              {['draft', 'submitted', 'payment_pending', 'rejected'].includes(rfq.status) && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteRfq?.(rfq.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                          {rfq.status === 'submitted' && (user.role === 'shipping_agent' || user.role === 'admin') && (
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectRfq(rfq, 'details');
                              }}
                            >
                              Review & Approve
                            </Button>
                          )}
                          {(user.role === 'shipping_agent' || user.role === 'admin') && 
                           (rfq.status === 'approved' || rfq.status === 'paid' || rfq.status === 'submitted' || rfq.status === 'draft') && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="rounded-xl text-[10px] h-8 border-primary/20 text-primary hover:bg-primary hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectRfq(rfq, 'action');
                              }}
                            >
                              Assign Agent
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="rounded-xl text-[10px] h-8 font-black uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-primary/5"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRfq(rfq, 'details');
                            }}
                          >
                            View
                          </Button>
                          <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRfqs.map((rfq) => (
              <Card key={rfq.id} className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/10 dark:shadow-none rounded-[2rem] hover:scale-[1.02] transition-all cursor-pointer group" onClick={() => onSelectRfq(rfq)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm">
                    {rfq.products?.[0]?.photo_urls?.[0] ? (
                      <img src={rfq.products[0].photo_urls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Package className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>
                  <StatusBadge status={rfq.status} />
                </div>
                
                <div className="space-y-1 mb-4">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Primary Product</p>
                  <p className="text-sm font-black text-zinc-900 dark:text-white truncate">{rfq.products?.[0]?.name || 'N/A'}</p>
                  <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">RFQ ID: #{rfq.id.toString().padStart(4, '0')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Origin</p>
                    <p className="text-xs font-black text-zinc-900 dark:text-zinc-100">{rfq.origin_country}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Destination</p>
                    <p className="text-xs font-black text-zinc-900 dark:text-zinc-100">{rfq.destination_country}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Quantity</p>
                    <p className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                      {rfq.products?.[0]?.quantity || 0} <span className="text-[10px] text-zinc-400">{rfq.products?.[0]?.unit || 'pcs'}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Status</p>
                    <div className="flex items-center gap-1">
                      <div className={cn("w-1.5 h-1.5 rounded-full", 
                        rfq.status === 'draft' ? "bg-zinc-400" :
                        rfq.status === 'submitted' ? "bg-blue-500" :
                        rfq.status === 'approved' ? "bg-emerald-500" :
                        rfq.status === 'rejected' ? "bg-red-500" :
                        "bg-primary"
                      )} />
                      <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 capitalize">{rfq.status}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full rounded-xl text-[10px] h-10 font-black uppercase tracking-[0.2em] transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRfq(rfq, 'details');
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = 'primary', trend }: { label: string, value: string, icon: React.ReactNode, color?: string, trend?: string }) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary/5 text-primary border-primary/10',
    secondary: 'bg-secondary/5 text-secondary border-secondary/10',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
  };

  return (
    <Card className="p-8 border-none shadow-xl shadow-zinc-200/40 dark:shadow-none bg-white dark:bg-zinc-900 group hover:scale-[1.02] transition-all duration-300 rounded-[2rem]">
      <div className="flex items-start justify-between mb-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6", colorMap[color])}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{label}</p>
        <h4 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">{value}</h4>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    draft: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    submitted: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    approved: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    rejected: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800',
    payment_pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    paid: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    assigned: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800',
    sourcing: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    shipping: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800',
    offered: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800',
    ordered: 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100',
    // Shipment statuses
    pending: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    in_transit: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    customs: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800',
    delivered: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    delayed: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800',
  };

  const dotColors: any = {
    draft: 'bg-zinc-400',
    submitted: 'bg-blue-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
    payment_pending: 'bg-amber-500',
    paid: 'bg-emerald-500',
    assigned: 'bg-purple-500',
    sourcing: 'bg-amber-500',
    shipping: 'bg-cyan-500',
    offered: 'bg-indigo-500',
    ordered: 'bg-white dark:bg-zinc-900',
    pending: 'bg-zinc-400',
    in_transit: 'bg-blue-500',
    customs: 'bg-purple-500',
    delivered: 'bg-emerald-500',
    delayed: 'bg-red-500',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300",
      styles[status] || styles.draft
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[status] || dotColors.draft)} />
      {status.replace('_', ' ')}
    </span>
  );
}

// --- Summary Components ---

interface ProductSummaryCardProps {
  product: Partial<Product>;
  currency: string;
  key?: React.Key;
}

function ProductSummaryCard({ product, currency }: ProductSummaryCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = product.photo_urls || [];

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] shadow-2xl shadow-zinc-200/40 dark:shadow-none hover:shadow-primary/10 transition-all duration-700 overflow-hidden h-full group relative">
      <div className="relative w-full aspect-[16/10] bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
        {photos.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex]}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            {photos.length > 1 && (
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
                <button 
                  onClick={prevPhoto}
                  className="w-12 h-12 bg-white/90 hover:bg-white text-zinc-900 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto transition-all flex items-center justify-center hover:scale-110 active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextPhoto}
                  className="w-12 h-12 bg-white/90 hover:bg-white text-zinc-900 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto transition-all flex items-center justify-center hover:scale-110 active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, i) => (
                <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i === currentPhotoIndex ? "bg-primary w-6 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/40 w-1.5")} />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-600 gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-zinc-800 shadow-inner flex items-center justify-center">
              <ImageIcon className="w-10 h-10 stroke-[1.5]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-50">No Visual Asset</span>
          </div>
        )}
        <div className="absolute top-6 left-6">
          <div className="px-4 py-2 bg-zinc-900/90 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-2xl">
            {product.category || 'General'}
          </div>
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-1 space-y-8">
        <div className="space-y-3">
          <h4 className="text-xl font-black text-zinc-900 dark:text-white line-clamp-1 tracking-tighter group-hover:text-primary transition-colors duration-500">{product.name || 'Unnamed Product'}</h4>
          {product.website_link && (
            <a 
              href={product.website_link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-zinc-50 rounded-xl text-[10px] text-zinc-500 hover:text-primary hover:bg-primary/5 font-black uppercase tracking-widest transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">Reference Link</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Quantity</p>
            <p className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
              {product.quantity} <span className="text-xs text-zinc-400 font-bold uppercase ml-1">{product.unit}s</span>
            </p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Budget</p>
            <p className="text-lg font-black text-primary tracking-tight">
              {currency} {Number(product.budget).toLocaleString()}
            </p>
          </div>
        </div>

        {product.note && (
          <div className="pt-6 border-t border-zinc-100">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Special Instructions</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
              "{product.note}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SourcingValueItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function SourcingValueItem({ icon: Icon, title, description }: SourcingValueItemProps) {
  return (
    <div className="flex gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
      <div className="w-10 h-10 shrink-0 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-primary shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h5 className="font-bold text-sm text-zinc-900 dark:text-white">{title}</h5>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function SourcingFeeSection() {
  return (
    <div className="p-16 bg-zinc-900 rounded-[4rem] text-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] relative overflow-hidden group">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] group-hover:bg-primary/30 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-20">
        <div className="space-y-12 max-w-2xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              <Zap className="w-4 h-4 fill-current" />
              Premium Sourcing
            </div>
            <h4 className="text-5xl font-black tracking-tighter leading-tight">
              Activate Your <br />
              <span className="text-primary">Global Network</span>
            </h4>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed">
              Unlock instant access to 5,000+ verified manufacturers and logistics partners worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h5 className="font-black text-sm uppercase tracking-widest">Verified Matching</h5>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">Every supplier is pre-vetted for quality and reliability.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-2">
                <h5 className="font-black text-sm uppercase tracking-widest">Priority Support</h5>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">Dedicated sourcing agent assigned to your request.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <div className="bg-white/5 backdrop-blur-2xl rounded-[3.5rem] p-12 border border-white/10 space-y-10 min-w-[380px] text-center shadow-2xl">
            <div className="space-y-3">
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-500">Activation Fee</span>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-7xl font-black tracking-tighter">$30</span>
                <span className="text-2xl text-zinc-500 font-bold">USD</span>
              </div>
            </div>
            <div className="pt-10 border-t border-white/10 space-y-6">
              <div className="flex items-center justify-center gap-4 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">100% Refundable Guarantee</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed px-4">
                Fee is fully deductible from your first order. <br />
                <span className="text-zinc-600">+20% VAT if invoice is required.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Create RFQ Form ---

function CreateRFQForm({ user, isDarkMode, onCancel, onSuccess, initialRfq, prefilledData }: { user: User, isDarkMode: boolean, onCancel: () => void, onSuccess: (id: number) => void, initialRfq?: RFQ, prefilledData?: any }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [createdRfqId, setCreatedRfqId] = useState<number | null>(initialRfq?.id || null);
  const [billingType, setBillingType] = useState<'receipt' | 'invoice'>('receipt');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState(JSON.stringify({ 
    origin_country: initialRfq?.origin_country || prefilledData?.origin_country || '',
    destination_country: initialRfq?.destination_country || prefilledData?.destination_country || '',
    delivery_mode: initialRfq?.delivery_mode || prefilledData?.delivery_mode || '',
    quality_level: initialRfq?.quality_level || prefilledData?.quality_level || '',
    currency: initialRfq?.currency || prefilledData?.currency || 'USD',
    products: initialRfq?.products || (prefilledData?.product_name ? [{ name: prefilledData.product_name, category: prefilledData.category || '', quantity: prefilledData.quantity || 1, unit: 'pcs', budget: 0, note: '', photo_urls: [] }] : [])
  }));

  const [products, setProducts] = useState<Partial<Product>[]>(initialRfq?.products || (prefilledData?.product_name ? [{ name: prefilledData.product_name, category: prefilledData.category || '', quantity: prefilledData.quantity || 1, unit: 'pcs', budget: 0, note: '', photo_urls: [] }] : [{ name: '', category: '', quantity: 1, unit: '', budget: 0, note: '', photo_urls: [] }]));
  const [generalInfo, setGeneralInfo] = useState({
    origin_country: initialRfq?.origin_country || prefilledData?.origin_country || '',
    destination_country: initialRfq?.destination_country || prefilledData?.destination_country || '',
    delivery_mode: initialRfq?.delivery_mode || prefilledData?.delivery_mode || '',
    quality_level: initialRfq?.quality_level || prefilledData?.quality_level || '',
    currency: initialRfq?.currency || prefilledData?.currency || 'USD'
  });

  const addProduct = () => setProducts([...products, { name: '', category: '', quantity: 1, unit: '', budget: 0, note: '', photo_urls: [] }]);
  const removeProduct = (index: number) => setProducts(products.filter((_, i) => i !== index));
  
  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newProducts = [...products];
    const currentPhotos = newProducts[index].photo_urls || [];

    Array.from(files as FileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target?.result as string;
        if (base64) {
          const updatedPhotos = [...(newProducts[index].photo_urls || []), base64];
          newProducts[index] = { ...newProducts[index], photo_urls: updatedPhotos };
          setProducts([...newProducts]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      setPaymentProof(base64);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (productIndex: number, photoIndex: number) => {
    const newProducts = [...products];
    const updatedPhotos = (newProducts[productIndex].photo_urls || []).filter((_, i) => i !== photoIndex);
    newProducts[productIndex] = { ...newProducts[productIndex], photo_urls: updatedPhotos };
    setProducts(newProducts);
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const newProducts = [...products];
    let finalValue = value;
    if (field === 'quantity') finalValue = Math.max(1, parseInt(value) || 1);
    if (field === 'budget') finalValue = Math.max(0, parseFloat(value) || 0);
    newProducts[index] = { ...newProducts[index], [field]: finalValue };
    setProducts(newProducts);
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      // Map data to products
      const importedProducts = data.map((row: any) => ({
        name: row.Name || row.name || '',
        category: row.Category || row.category || '',
        quantity: row.Quantity || row.quantity || 1,
        unit: row.Unit || row.unit || '',
        budget: row.Budget || row.budget || 0,
        note: row.Note || row.note || '',
        website_link: row.Link || row.link || '',
        photo_urls: []
      }));
      setProducts([...products, ...importedProducts]);
    };
    reader.readAsBinaryString(file);
  };

  const handleNext = async () => {
    setError(null);
    if (step === 1) {
      const hasEmptyProduct = products.some(p => !p.name?.trim() || !p.category || !p.unit);
      if (hasEmptyProduct) {
        setError("Please ensure all products have a name, category, and unit.");
        return;
      }
      // Systematically save as draft after product form
      await saveAsDraft();
    }
    if (step === 2) {
      if (!generalInfo.origin_country || !generalInfo.destination_country || !generalInfo.delivery_mode || !generalInfo.quality_level) {
        setError("Please fill in all logistics fields (Origin, Destination, Delivery Mode, and Quality Standard) to proceed.");
        return;
      }
      // Save again after logistics
      await saveAsDraft();
    }
    setStep(step + 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveAsDraft = async (silent = false) => {
    // Draft can be saved if we have products
    const hasEmptyProduct = products.some(p => !p.name?.trim() || !p.category || !p.unit);
    if (hasEmptyProduct) return null;

    if (!silent) setIsSubmitting(true);
    const total_budget = products.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    try {
      const url = createdRfqId ? `/api/rfqs/${createdRfqId}` : '/api/rfqs';
      const method = createdRfqId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...generalInfo, total_budget, products })
      });
      
      if (res.ok) {
        const data = await res.json();
        const id = createdRfqId || data.id;
        if (!createdRfqId) {
          setCreatedRfqId(id);
        }
        return id;
      }
      return null;
    } catch (e) {
      console.error('Save failed', e);
      return null;
    } finally {
      if (!silent) setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const hasEmptyProduct = products.some(p => !p.name?.trim() || !p.category || !p.unit);
    if (hasEmptyProduct) return;

    const currentData = JSON.stringify({ ...generalInfo, products });
    if (currentData === lastSavedData) return;

    // Faster auto-save for better UX
    const timer = setTimeout(async () => {
      setIsAutoSaving(true);
      const id = await saveAsDraft(true);
      if (id) {
        setLastSavedData(currentData);
      }
      setTimeout(() => setIsAutoSaving(false), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [generalInfo, products, lastSavedData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let rfqId = createdRfqId;
      if (!rfqId) {
        rfqId = await saveAsDraft();
      }
      
      if (rfqId) {
        const res = await fetch(`/api/rfqs/${rfqId}/submit`, {
          method: 'PATCH',
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to submit request');
        }
      }
      setStep(4);
    } catch (e: any) {
      setError(e.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePay = async () => {
    if (!createdRfqId) return;
    if (!paymentProof) {
      setError("Please upload a proof of payment to proceed.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/rfqs/${createdRfqId}/pay`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ billingType, paymentProof })
      });
      if (res.ok) {
        onSuccess(createdRfqId);
      } else {
        const data = await res.json();
        setError(data.error || 'Payment submission failed. Please try again.');
      }
    } catch (e) {
      setError('Payment submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipOrPayLater = () => {
    // RFQ is already saved as 'draft' when step 3 completes
    onCancel(); // Go back to dashboard
  };

  const steps = [
    { id: 1, label: 'Products' },
    { id: 2, label: 'Logistics' },
    { id: 3, label: 'Review' },
    { id: 4, label: 'Submission' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Enhanced Step Indicator */}
      <div className="mb-16">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-[18px] left-0 w-full h-[2px] bg-zinc-100 dark:bg-zinc-800 -z-0" />
          <div 
            className="absolute top-[18px] left-0 h-[2px] bg-primary transition-all duration-700 ease-out -z-0" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
              <motion.div 
                initial={false}
                animate={{
                  scale: step === s.id ? 1.1 : 1,
                  backgroundColor: step > s.id ? "var(--color-primary)" : step === s.id ? (isDarkMode ? "#18181b" : "#fff") : (isDarkMode ? "#18181b" : "#fff"),
                  borderColor: step >= s.id ? "var(--color-primary)" : (isDarkMode ? "#27272a" : "#e4e4e7")
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 border-2",
                  step > s.id ? "text-white" : step === s.id ? "text-primary shadow-xl shadow-primary/20" : "text-zinc-300 dark:text-zinc-600"
                )}
              >
                {step > s.id ? <Check className="w-5 h-5 stroke-[3]" /> : s.id}
              </motion.div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 hidden md:block",
                step === s.id ? "text-primary translate-y-0 opacity-100" : "text-zinc-400 translate-y-1 opacity-60"
              )}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
              {steps.find(s => s.id === step)?.label}
            </h2>
            <AnimatePresence>
              {isAutoSaving && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Draft Saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-zinc-500 text-base font-medium max-w-xl leading-relaxed">
            {step === 1 && "Start by listing the products you need. Be as specific as possible to get the most accurate quotes."}
            {step === 2 && "Define your shipment route, preferred transport modes, and quality control requirements."}
            {step === 3 && "Review your entire request. You can still go back and edit any section before finalizing."}
            {step === 4 && "Your request is ready. Complete the offer fee to broadcast it to our verified supplier network."}
          </p>
        </div>
        <div className="flex gap-3">
          {step < 4 && (
            <button 
              onClick={onCancel}
              className="h-12 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-4 text-red-700 dark:text-red-400 text-sm shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="font-bold leading-tight">{error}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="space-y-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xl shadow-zinc-900/20">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Product Inventory</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{products.length} {products.length === 1 ? 'item' : 'items'} in this request</p>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="cursor-pointer group">
                  <div className="inline-flex items-center justify-center h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-900 dark:hover:border-zinc-400 hover:shadow-xl active:scale-95 dark:text-white">
                    <FileUp className="w-5 h-5 mr-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" /> Import Excel
                  </div>
                  <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImportExcel} />
                </label>
                <button 
                  onClick={addProduct}
                  className="inline-flex items-center justify-center h-14 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all bg-primary text-white hover:shadow-2xl hover:shadow-primary/30 active:scale-95"
                >
                  <Plus className="w-5 h-5 mr-3" /> Add New Item
                </button>
              </div>
            </div>
            
            <div className="space-y-12">
              {products.map((product, index) => (
                <Card key={index} className="relative overflow-hidden border-none shadow-2xl shadow-zinc-200/40 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[3rem]">
                  {/* Item Badge */}
                  <div className="absolute top-0 left-0 w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-br-[3rem] flex items-center justify-center border-r border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-3xl font-black text-zinc-200 dark:text-zinc-700">#{index + 1}</span>
                  </div>

                  <button 
                    onClick={() => removeProduct(index)} 
                    className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center z-20 group/remove"
                  >
                    <Trash2 className="w-6 h-6 transition-transform group-hover/remove:scale-110" />
                  </button>
                  
                  <div className="p-12 pt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                      {/* Section 1: Visual & Identity */}
                      <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-10">
                          <div className="space-y-8">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 bg-primary rounded-full" />
                              <label className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Product Identity</label>
                            </div>
                            
                            <div className="space-y-8">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Product Name / Title</label>
                                <Input 
                                  className="h-16 px-8 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                  value={product.name ?? ''} 
                                  onChange={e => updateProduct(index, 'name', e.target.value)} 
                                  placeholder="e.g. Premium Wireless Headphones Gen 2" 
                                />
                              </div>
                              
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Industry Category</label>
                                <div className="relative">
                                  <select 
                                    className="w-full h-16 px-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-8 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                                    value={product.category ?? ''}
                                    onChange={e => updateProduct(index, 'category', e.target.value)}
                                  >
                                    <option value="" className="dark:bg-zinc-900">Select Category...</option>
                                    <option value="electronics" className="dark:bg-zinc-900">Electronics</option>
                                    <option value="fashion" className="dark:bg-zinc-900">Fashion & Apparel</option>
                                    <option value="home" className="dark:bg-zinc-900">Home & Garden</option>
                                    <option value="industrial" className="dark:bg-zinc-900">Industrial & Machinery</option>
                                    <option value="beauty" className="dark:bg-zinc-900">Beauty & Personal Care</option>
                                    <option value="toys" className="dark:bg-zinc-900">Toys & Hobbies</option>
                                    <option value="food" className="dark:bg-zinc-900">Food & Beverage</option>
                                    <option value="health" className="dark:bg-zinc-900">Health & Medical</option>
                                    <option value="automotive" className="dark:bg-zinc-900">Automotive</option>
                                    <option value="other" className="dark:bg-zinc-900">Other</option>
                                  </select>
                                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-8">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 bg-primary rounded-full" />
                              <label className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Visual Assets</label>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              {product.photo_urls?.map((url, pIdx) => (
                                <motion.div 
                                  key={pIdx} 
                                  layoutId={`photo-${index}-${pIdx}`}
                                  className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 group/photo shadow-sm hover:shadow-xl transition-all"
                                >
                                  <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <button 
                                      onClick={() => removePhoto(index, pIdx)}
                                      className="w-10 h-10 rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center shadow-xl"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                              {(!product.photo_urls || product.photo_urls.length < 5) && (
                                <label className="aspect-square rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/[0.02] hover:shadow-2xl hover:shadow-primary/10 transition-all group/add">
                                  <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover/add:bg-primary/10 transition-colors">
                                    <Camera className="w-5 h-5 text-zinc-400 group-hover/add:text-primary transition-colors" />
                                  </div>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover/add:text-primary">Upload</span>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={(e) => handlePhotoUpload(index, e)} 
                                  />
                                </label>
                              )}
                            </div>
                            <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 text-center">Upload up to 5 photos for visual reference</p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Specifications & Financials */}
                      <div className="lg:col-span-7 space-y-12 lg:border-l lg:border-zinc-100 lg:dark:border-zinc-800 lg:pl-16">
                        <div className="space-y-12">
                          <div className="space-y-8">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 bg-primary rounded-full" />
                              <label className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Specifications</label>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Order Quantity</label>
                                <div className="relative">
                                  <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    className="h-16 pl-14 pr-8 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-8 focus:ring-primary/5 transition-all"
                                    value={product.quantity ?? ''} 
                                    onChange={e => updateProduct(index, 'quantity', e.target.value)} 
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Measurement Unit</label>
                                <div className="relative">
                                  <select 
                                    className="w-full h-16 px-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-8 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                                    value={product.unit ?? ''}
                                    onChange={e => updateProduct(index, 'unit', e.target.value)}
                                  >
                                    <option value="" className="dark:bg-zinc-900">Select Unit...</option>
                                    <optgroup label="Count" className="dark:bg-zinc-900">
                                      <option value="piece">Pieces (pcs)</option>
                                      <option value="pair">Pairs (pr)</option>
                                      <option value="set">Sets</option>
                                      <option value="dozen">Dozen (dz)</option>
                                      <option value="unit">Units</option>
                                    </optgroup>
                                    <optgroup label="Weight">
                                      <option value="kg">Kilograms (kg)</option>
                                      <option value="ton">Tons (t)</option>
                                      <option value="g">Grams (g)</option>
                                      <option value="lb">Pounds (lb)</option>
                                    </optgroup>
                                    <optgroup label="Volume & Liquid">
                                      <option value="cbm">Cubic Meters (cbm)</option>
                                      <option value="liter">Liters (l)</option>
                                      <option value="ml">Milliliters (ml)</option>
                                      <option value="gallon">Gallons</option>
                                    </optgroup>
                                    <optgroup label="Measurement">
                                      <option value="meter">Meters (m)</option>
                                      <option value="sqm">Square Meters (sqm)</option>
                                      <option value="feet">Feet (ft)</option>
                                      <option value="inch">Inches (in)</option>
                                    </optgroup>
                                    <optgroup label="Packaging">
                                      <option value="box">Boxes</option>
                                      <option value="carton">Cartons (ctn)</option>
                                      <option value="roll">Rolls</option>
                                      <option value="pack">Packs (pk)</option>
                                      <option value="pallet">Pallets (plt)</option>
                                      <option value="bag">Bags</option>
                                    </optgroup>
                                  </select>
                                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Target Budget</label>
                                <div className="relative">
                                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    step="0.01" 
                                    className="h-16 pl-14 pr-8 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-8 focus:ring-primary/5 transition-all"
                                    value={product.budget ?? ''} 
                                    onChange={e => updateProduct(index, 'budget', e.target.value)} 
                                    placeholder="0.00" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Currency</label>
                                <div className="relative">
                                  <select 
                                    className="w-full h-16 px-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-8 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                                    value={generalInfo.currency ?? ''}
                                    onChange={e => setGeneralInfo({...generalInfo, currency: e.target.value})}
                                  >
                                    <option value="USD" className="dark:bg-zinc-900">USD</option>
                                    <option value="EUR" className="dark:bg-zinc-900">EUR</option>
                                    <option value="MAD" className="dark:bg-zinc-900">MAD</option>
                                    <option value="CNY" className="dark:bg-zinc-900">CNY</option>
                                    <option value="GBP" className="dark:bg-zinc-900">GBP</option>
                                    <option value="AED" className="dark:bg-zinc-900">AED</option>
                                    <option value="SAR" className="dark:bg-zinc-900">SAR</option>
                                  </select>
                                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-8">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-6 bg-primary rounded-full" />
                              <label className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Technical Notes</label>
                            </div>
                            <div className="space-y-8">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Reference Link (Optional)</label>
                                <div className="relative">
                                  <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                                  <Input 
                                    className="h-16 pl-14 pr-8 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-800 focus:ring-8 focus:ring-primary/5 transition-all"
                                    value={product.website_link ?? ''} 
                                    onChange={e => updateProduct(index, 'website_link', e.target.value)} 
                                    placeholder="https://example.com/product-reference" 
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Detailed Requirements</label>
                                <textarea 
                                  className="w-full min-h-[160px] p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-base font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-8 focus:ring-primary/5 transition-all resize-none outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                  value={product.note ?? ''} 
                                  onChange={e => updateProduct(index, 'note', e.target.value)} 
                                  placeholder="Describe materials, colors, certifications, packaging, or any other specific requirements..." 
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="space-y-12"
          >
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Card 1: Global Logistics Route */}
              <Card className="relative overflow-hidden border-none shadow-2xl shadow-zinc-200/40 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[3rem]">
                {/* Section Badge */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-br-[3rem] flex items-center justify-center border-r border-b border-primary/10 dark:border-primary/20">
                  <span className="text-3xl font-black text-primary/20">01</span>
                </div>

                <div className="p-12 pt-24">
                  <div className="space-y-12">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                        <Globe className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Global Logistics Route</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Define the origin and destination for your shipment</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
                      {/* Origin */}
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-1.5 h-5 bg-primary rounded-full" />
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-300">Country of Origin</label>
                        </div>
                        <div className="relative group">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary transition-colors" />
                          <select 
                            className="w-full h-18 pl-16 pr-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-lg font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-8 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                            value={generalInfo.origin_country ?? ''}
                            onChange={e => setGeneralInfo({...generalInfo, origin_country: e.target.value})}
                          >
                            <option value="" className="dark:bg-zinc-900">Select Origin...</option>
                            {COUNTRIES.map(c => <option key={c} value={c} className="dark:bg-zinc-900">{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-1.5 h-5 bg-red-500 rounded-full" />
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-300">Country of Destination</label>
                        </div>
                        <div className="relative group">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500 transition-colors" />
                          <select 
                            className="w-full h-18 pl-16 pr-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-lg font-bold dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:ring-8 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
                            value={generalInfo.destination_country ?? ''}
                            onChange={e => setGeneralInfo({...generalInfo, destination_country: e.target.value})}
                          >
                            <option value="" className="dark:bg-zinc-900">Select Destination...</option>
                            {COUNTRIES.map(c => <option key={c} value={c} className="dark:bg-zinc-900">{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Visual Connector Icon - Desktop */}
                      <div className="hidden md:flex absolute top-[74px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-2xl shadow-zinc-200/50 dark:shadow-none z-20 items-center justify-center border-2 border-zinc-50 dark:border-zinc-700 group">
                        <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                          <ArrowRight className="w-6 h-6" strokeWidth={3} />
                        </div>
                      </div>

                      {/* Visual Connector Icon - Mobile */}
                      <div className="md:hidden absolute top-[116px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white dark:bg-zinc-800 rounded-full shadow-xl dark:shadow-none z-20 items-center justify-center border-2 border-zinc-50 dark:border-zinc-700">
                        <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-700 text-white rounded-full flex items-center justify-center">
                          <ArrowDown className="w-5 h-5" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 2: Delivery Mode */}
              <Card className="relative overflow-hidden border-none shadow-2xl shadow-zinc-200/40 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[3rem]">
                {/* Section Badge */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-secondary/5 dark:bg-secondary/10 rounded-br-[3rem] flex items-center justify-center border-r border-b border-secondary/10 dark:border-secondary/20">
                  <span className="text-3xl font-black text-secondary/20">02</span>
                </div>

                <div className="p-12 pt-24">
                  <div className="space-y-12">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 text-secondary flex items-center justify-center shadow-inner">
                        <Truck className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Delivery Mode</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Select the most efficient freight method for your goods</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      {[
                        { id: 'sea', label: 'Sea Freight', icon: Ship, desc: 'Ideal for high-volume, cost-effective shipping' },
                        { id: 'air', label: 'Air Freight', icon: Plane, desc: 'Premium speed for time-sensitive inventory' },
                        { id: 'land', label: 'Land Freight', icon: Truck, desc: 'Flexible regional transport & rail solutions' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setGeneralInfo({...generalInfo, delivery_mode: mode.id})}
                          className={cn(
                            "p-10 rounded-[2.5rem] border-2 transition-all text-center flex flex-col items-center relative overflow-hidden group",
                            generalInfo.delivery_mode === mode.id 
                              ? "border-primary bg-primary/[0.02] dark:bg-primary/5 ring-8 ring-primary/5 shadow-2xl shadow-primary/10 dark:shadow-none" 
                              : "border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl dark:shadow-none"
                          )}
                        >
                          <div className={cn(
                            "w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-700",
                            generalInfo.delivery_mode === mode.id 
                              ? "bg-primary text-white shadow-2xl shadow-primary/40 scale-110" 
                              : "bg-white dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 group-hover:text-primary group-hover:scale-105"
                          )}>
                            <mode.icon className="w-10 h-10" />
                          </div>
                          <div className="space-y-3">
                            <p className="font-black text-lg text-zinc-900 dark:text-white">{mode.label}</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-[160px] mx-auto">{mode.desc}</p>
                          </div>
                          {generalInfo.delivery_mode === mode.id && (
                            <div className="absolute top-8 right-8 text-primary">
                              <CheckCircle2 className="w-8 h-8" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 3: Quality Standards */}
              <Card className="relative overflow-hidden border-none shadow-2xl shadow-zinc-200/40 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[3rem]">
                {/* Section Badge */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-br-[3rem] flex items-center justify-center border-r border-b border-emerald-100 dark:border-emerald-800/20">
                  <span className="text-3xl font-black text-emerald-100 dark:text-emerald-800/30">03</span>
                </div>

                <div className="p-12 pt-24">
                  <div className="space-y-12">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Quality Standard</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Choose the manufacturing and inspection level required</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      {[
                        { id: 'high', label: 'Premium Quality', desc: 'Top-tier materials & zero-tolerance QC' },
                        { id: 'medium', label: 'Standard Quality', desc: 'Balanced cost-to-performance ratio' },
                        { id: 'low', label: 'Economy Quality', desc: 'Budget-focused manufacturing level' }
                      ].map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setGeneralInfo({...generalInfo, quality_level: level.id})}
                          className={cn(
                            "p-10 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group",
                            generalInfo.quality_level === level.id 
                              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-8 ring-emerald-500/5 shadow-2xl shadow-emerald-500/10 dark:shadow-none" 
                              : "border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl dark:shadow-none"
                          )}
                        >
                          <div className={cn(
                            "w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 transition-all duration-700",
                            generalInfo.quality_level === level.id 
                              ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 scale-110" 
                              : "bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 group-hover:text-emerald-500 group-hover:scale-105"
                          )}>
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-black text-base text-zinc-900 dark:text-white">{level.label}</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{level.desc}</p>
                          </div>
                          {generalInfo.quality_level === level.id && (
                            <div className="absolute top-8 right-8 text-emerald-500">
                              <CheckCircle2 className="w-7 h-7" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Info Banner */}
              <div className="p-10 bg-zinc-900 rounded-[2.5rem] text-white flex gap-8 shadow-2xl shadow-zinc-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-primary/20 transition-all duration-1000" />
                <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 shadow-inner backdrop-blur-md">
                  <Info className="w-8 h-8" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h4 className="font-black text-lg tracking-tight">Logistics Network</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    Our logistics network covers over 150 countries. We handle all customs documentation and local transport to ensure a seamless door-to-door experience for your business.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="space-y-12"
          >
            <Card className="relative overflow-hidden border-none shadow-2xl shadow-zinc-200/40 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[3rem]">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
              
              <div className="relative z-10 p-12 space-y-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-zinc-100 dark:border-zinc-800 pb-12">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center shadow-xl shadow-zinc-900/20 dark:shadow-none">
                        <Eye className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">Review Request</h3>
                    </div>
                    <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium">Please verify your logistics and product details before submission.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse" />
                      Draft Mode
                    </div>
                  </div>
                </div>

                {/* Logistics Summary Visualization */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    <label className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Logistics Overview</label>
                  </div>
                  
                  <div className="bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[3rem] p-12 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
                      <RoutePoint label="Origin" value={generalInfo.origin_country} icon={<Globe className="w-7 h-7 text-primary" />} />
                      
                      <div className="flex-1 flex flex-col items-center w-full max-w-md">
                        <div className="flex flex-col items-center gap-4 mb-6">
                          <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-2xl shadow-zinc-200/50 dark:shadow-none flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:shadow-primary/20">
                            {generalInfo.delivery_mode === 'sea' ? <Ship className="w-10 h-10 text-primary" /> :
                             generalInfo.delivery_mode === 'air' ? <Plane className="w-10 h-10 text-primary" /> :
                             <Truck className="w-10 h-10 text-primary" />}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
                            {generalInfo.delivery_mode} Freight
                          </span>
                        </div>
                        <div className="w-full h-10 flex items-center">
                          <div className="w-full h-2 bg-primary/10 relative rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent" 
                            />
                            <div className="absolute inset-0 bg-primary/20" />
                          </div>
                        </div>
                      </div>

                      <RoutePoint label="Destination" value={generalInfo.destination_country} icon={<MapPin className="w-7 h-7 text-red-500" />} align="end" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                  {/* Product Inventory */}
                  <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center">
                          <Package className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-[12px] uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Product Inventory</h4>
                      </div>
                      <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{products.length} Items</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {products.map((p, i) => (
                        <ProductSummaryCard key={i} product={p} currency={generalInfo.currency} />
                      ))}
                    </div>
                  </div>

                  {/* Request Specs & Notes */}
                  <div className="lg:col-span-4 space-y-12">
                    <div className="space-y-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center">
                          <Info className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-[12px] uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Request Specs</h4>
                      </div>
                      <div className="space-y-4">
                        <SummaryItem 
                          label="Quality Standard" 
                          value={generalInfo.quality_level.toUpperCase()}
                          icon={ShieldCheck}
                          color="primary"
                        />
                        <SummaryItem 
                          label="Total Units" 
                          value={`${products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0).toLocaleString()}`}
                          icon={Package}
                          color="secondary"
                        />
                        <SummaryItem 
                          label="Total Budget" 
                          value={`${generalInfo.currency} ${products.reduce((sum, p) => sum + (Number(p.budget) || 0), 0).toLocaleString()}`}
                          icon={CreditCard}
                          color="emerald"
                        />
                      </div>
                    </div>

                    {products.some(p => p.note) && (
                      <div className="p-10 bg-amber-50/50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-amber-200/40 transition-all duration-700" />
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-2 h-8 bg-amber-500 rounded-full" />
                          <h5 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-[0.25em] text-[11px]">Special Requirements</h5>
                        </div>
                        <div className="space-y-6 relative z-10">
                          {products.map((p, i) => p.note && (
                            <div key={i} className="space-y-2.5">
                              <span className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest block">{p.name}</span>
                              <p className="text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-medium italic border-l-4 border-amber-200 dark:border-amber-800 pl-4">"{p.note}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            
            <SourcingFeeSection />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center space-y-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2.5 bg-zinc-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-zinc-900/20"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Secure Checkout
              </motion.div>
              <h3 className="text-6xl font-black tracking-tighter text-zinc-900 dark:text-white">
                Finalize & <span className="text-secondary">Activate</span>
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-xl font-medium leading-relaxed">
                Complete these 3 steps to launch your sourcing request globally.
              </p>
            </div>

            <div className="space-y-10">
              {/* Step 1: Billing */}
              <Card className="p-12 space-y-12 relative overflow-hidden border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none rounded-[2.5rem] bg-white dark:bg-zinc-900">
                <div className="absolute top-0 left-0 w-20 h-20 bg-zinc-900 dark:bg-zinc-800 text-white rounded-br-[3rem] flex items-center justify-center">
                  <span className="text-2xl font-black">01</span>
                </div>

                <div className="relative z-10 space-y-10 pt-4">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center shadow-inner">
                      <Receipt className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-zinc-900 dark:text-white">Billing Preference</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Select your preferred document type.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <button 
                      onClick={() => setBillingType('receipt')}
                      className={cn(
                        "p-10 rounded-[2.5rem] border-2 transition-all text-left relative group",
                        billingType === 'receipt' 
                          ? "border-secondary bg-secondary/[0.03] dark:bg-secondary/5 ring-8 ring-secondary/5 shadow-2xl shadow-secondary/10 dark:shadow-none" 
                          : "border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl dark:shadow-none"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 transition-all duration-700",
                        billingType === 'receipt' 
                          ? "bg-secondary text-white shadow-2xl shadow-secondary/40 scale-110" 
                          : "bg-white dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 group-hover:text-secondary group-hover:scale-105"
                      )}>
                        <Receipt className="w-8 h-8" />
                      </div>
                      <p className="font-black text-lg text-zinc-900 dark:text-white">Standard Receipt</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">Basic proof of payment for individual accounts.</p>
                      {billingType === 'receipt' && <CheckCircle2 className="absolute top-10 right-10 w-8 h-8 text-secondary" />}
                    </button>

                    <button 
                      onClick={() => setBillingType('invoice')}
                      className={cn(
                        "p-10 rounded-[2.5rem] border-2 transition-all text-left relative group",
                        billingType === 'invoice' 
                          ? "border-secondary bg-secondary/[0.03] dark:bg-secondary/5 ring-8 ring-secondary/5 shadow-2xl shadow-secondary/10 dark:shadow-none" 
                          : "border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl dark:shadow-none"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 transition-all duration-700",
                        billingType === 'invoice' 
                          ? "bg-secondary text-white shadow-2xl shadow-secondary/40 scale-110" 
                          : "bg-white dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 group-hover:text-secondary group-hover:scale-105"
                      )}>
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="font-black text-lg text-zinc-900 dark:text-white">Business Invoice</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">Official tax invoice for companies (+20% VAT).</p>
                      {billingType === 'invoice' && <CheckCircle2 className="absolute top-10 right-10 w-8 h-8 text-secondary" />}
                    </button>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={billingType}
                    className="p-10 rounded-[2.5rem] border-2 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10 space-y-8 shadow-2xl shadow-orange-500/10 dark:shadow-none relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-orange-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-2 h-8 bg-orange-500 rounded-full" />
                      <h5 className="font-black text-orange-900 dark:text-orange-400 uppercase tracking-[0.25em] text-[11px]">Amount Details</h5>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-400 font-black text-sm uppercase tracking-widest">Service Fee</span>
                        <span className="text-zinc-900 dark:text-white font-black text-lg">$30.00</span>
                      </div>
                      {billingType === 'invoice' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex justify-between items-center"
                        >
                          <span className="text-zinc-600 dark:text-zinc-400 font-black text-sm uppercase tracking-widest">VAT (20%)</span>
                          <span className="text-zinc-900 dark:text-white font-black text-lg">$6.00</span>
                        </motion.div>
                      )}
                      <div className="h-px bg-orange-200/50 dark:bg-orange-800/50" />
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <span className="text-orange-900 dark:text-orange-500 font-black uppercase text-[11px] tracking-[0.25em] block">Total Amount</span>
                          <p className="text-xs text-orange-700/70 dark:text-orange-300/70 font-bold">Payable via secure bank transfer</p>
                        </div>
                        <span className="text-6xl font-black text-orange-600 dark:text-orange-500 tracking-tighter">
                          ${billingType === 'invoice' ? '36.00' : '30.00'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Card>

              {/* Step 2: Upload */}
              <Card className="p-12 space-y-12 relative overflow-hidden border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none rounded-[2.5rem] bg-white dark:bg-zinc-900">
                <div className="absolute top-0 left-0 w-20 h-20 bg-zinc-900 dark:bg-zinc-800 text-white rounded-br-[3rem] flex items-center justify-center">
                  <span className="text-2xl font-black">02</span>
                </div>

                <div className="relative z-10 space-y-10 pt-4">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center shadow-inner">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-zinc-900 dark:text-white">Proof of Transfer</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Upload your bank confirmation document.</p>
                    </div>
                  </div>

                  <div className="relative group">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={handleProofUpload}
                      accept="image/*,.pdf"
                    />
                    <div className={cn(
                      "w-full min-h-[280px] rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-12 text-center gap-6",
                      paymentProof 
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-8 ring-emerald-500/5" 
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 group-hover:border-primary group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:shadow-2xl group-hover:shadow-primary/5 dark:group-hover:shadow-none"
                    )}>
                      {paymentProof ? (
                        <div className="space-y-6">
                          <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
                            <Check className="w-10 h-10" strokeWidth={3} />
                          </div>
                          <div className="space-y-2">
                            <p className="text-emerald-900 dark:text-emerald-400 font-black text-xl">Document Uploaded</p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-500 font-medium">Click to replace the file</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-[1.5rem] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-300 dark:text-zinc-600 flex items-center justify-center shadow-xl dark:shadow-none group-hover:text-primary transition-colors">
                            <Upload className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-zinc-900 dark:text-white font-black text-xl">Click or drag to upload</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">JPG, PNG, PDF (Maximum 10MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Step 3: Activation */}
              <Card className="p-12 space-y-12 bg-gradient-to-br from-primary to-secondary text-white border-none shadow-2xl shadow-primary/20 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
                
                <div className="absolute top-0 left-0 w-20 h-20 bg-white text-primary rounded-br-[3rem] flex items-center justify-center">
                  <span className="text-2xl font-black">03</span>
                </div>

                <div className="relative z-10 space-y-12 pt-4">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center shadow-inner">
                      <Zap className="w-7 h-7 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black">Launch Sourcing</h4>
                      <p className="text-sm text-white/80 font-medium">Finalize your request and start the process.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <label className="flex items-center gap-5 p-8 bg-white/10 rounded-[2rem] cursor-pointer hover:bg-white/20 transition-all border border-white/10 group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-7 h-7 rounded-lg border-2 border-white/30 bg-transparent text-white focus:ring-white transition-all cursor-pointer appearance-none checked:bg-white"
                          onChange={(e) => setActivated(e.target.checked)}
                          checked={activated}
                        />
                        {activated && <Check className="absolute w-5 h-5 text-primary" strokeWidth={4} />}
                      </div>
                      <span className="text-base font-black text-white leading-tight">
                        I activate the sourcing process and agree to the terms
                      </span>
                    </label>

                    <button 
                      onClick={handlePay}
                      disabled={!paymentProof || isSubmitting || !activated}
                      className={cn(
                        "w-full py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-4 relative overflow-hidden group",
                        !paymentProof || isSubmitting || !activated
                          ? "bg-white/10 text-white/30 cursor-not-allowed"
                          : "bg-white text-primary hover:bg-zinc-900 hover:text-white shadow-2xl shadow-black/20 active:scale-[0.98]"
                      )}
                    >
                      {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                      <span>{isSubmitting ? 'Launching...' : 'Activate Sourcing Now'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-10 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                      <ShieldCheck className="w-4 h-4" />
                      Secure
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-white/60">
                      <Lock className="w-4 h-4" />
                      Encrypted
                    </div>
                  </div>
                </div>
              </Card>

              {/* Footer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-amber-50/50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 flex gap-6 shadow-sm dark:shadow-none">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl shadow-inner">💡</div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">Service Guarantee</p>
                    <p className="text-sm text-amber-900/80 dark:text-amber-200/80 font-bold leading-relaxed">
                      Fee is <span className="text-amber-600 dark:text-amber-400">100% refundable</span> or deductible from your final order.
                    </p>
                  </div>
                </div>
                <div className="p-10 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">What happens next?</p>
                  <ul className="space-y-4">
                    {["Verification (1-2h)", "Agent assigned", "Quotes in 48h"].map((text, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 font-black">
                        <div className="w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-600 dark:text-zinc-400">{i+1}</div>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-[11px] text-center text-zinc-400 font-bold leading-relaxed px-12 mt-12">
                By clicking "Activate Sourcing", you agree to Glob$ourcia's <button onClick={() => setIsTermsOpen(true)} className="text-primary font-black hover:underline">Terms of Service</button> and Sourcing Commitment Policy.
              </p>
            </div>
            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-12 border-t border-zinc-100 dark:border-zinc-800">
        <div>
          {step > 1 && step < 4 && (
            <Button 
              variant="outline" 
              className="h-14 px-10 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] border-2 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-white"
              onClick={() => { setStep(step - 1); setError(null); }}
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          {step <= 3 && (
            <Button 
              variant="outline" 
              className="h-14 px-10 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] border-2 border-primary/10 dark:border-primary/20 text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
              onClick={async () => {
                setError(null);
                const id = await saveAsDraft();
                if (id) {
                  onCancel();
                } else {
                  setError("Failed to save draft. Please check your connection and try again.");
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  Save Draft & Exit
                </div>
              )}
            </Button>
          )}
          {step < 3 ? (
            <Button 
              className="h-14 px-12 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] bg-primary text-white shadow-2xl shadow-primary/20 hover:shadow-primary/30 active:scale-95" 
              onClick={handleNext}
            >
              Next Step
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          ) : step === 3 ? (
            <Button 
              className="h-14 px-12 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-emerald-500/30 active:scale-95" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-5 h-5 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm & Proceed to Payment
                  <CheckCircle2 className="w-5 h-5 ml-3" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="h-14 px-10 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white" 
              onClick={() => onSuccess(createdRfqId!)}
            >
              Skip for now, Pay Later
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- RFQ Details View ---

function SampleRequestForm({ rfqId, offerId, onSuccess, onCancel }: { rfqId: number, offerId: number, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/sample-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rfq_id: rfqId, offer_id: offerId, details })
      });
      if (res.ok) onSuccess();
    } catch (e) {
      alert('Failed to request sample');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white border-zinc-100 shadow-2xl rounded-[2.5rem]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Package className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">Request a Sample</h3>
          <p className="text-zinc-400 text-sm font-medium">Specify any special requirements for your sample.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sample Details & Requirements</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full h-32 rounded-2xl border border-zinc-200 bg-zinc-50/50 px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="e.g. Please include original packaging, specific color variant, etc."
            required
          />
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest border-zinc-200">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-zinc-900 text-white shadow-xl shadow-zinc-900/20" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SampleRequestAgentForm({ request, onSuccess }: { request: any, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let url = '';
    let body = {};

    if (user.role === 'sourcing_agent') {
      url = `/api/sample-requests/${request.id}/sourcing`;
      body = { sample_cost: Number(formData.get('sample_cost')) };
    } else if (user.role === 'shipping_agent') {
      url = `/api/sample-requests/${request.id}/shipping`;
      body = { shipping_cost: Number(formData.get('shipping_cost')) };
    } else if (user.role === 'admin' && request.status === 'paid') {
      url = `/api/sample-requests/${request.id}/ship`;
      body = { tracking_number: formData.get('tracking_number') };
    }

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) onSuccess();
    } catch (e) {
      alert('Failed to update sample request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white border-zinc-100 shadow-xl rounded-[2.5rem]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight text-zinc-900 uppercase">Manage Sample Request</h3>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Request #{request.id.toString().padStart(3, '0')}</p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-zinc-50 rounded-2xl space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Customer Requirements</p>
        <p className="text-sm font-bold text-zinc-900">{request.details}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {user.role === 'sourcing_agent' && request.status === 'pending' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sample Cost ($)</label>
            <Input name="sample_cost" type="number" step="0.01" min="0" required className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" />
          </div>
        )}

        {user.role === 'shipping_agent' && request.status === 'sourcing_priced' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Sample Cost</span>
              <span className="text-lg font-black text-emerald-700">${request.sample_cost}</span>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Shipping Cost ($)</label>
              <Input name="shipping_cost" type="number" step="0.01" min="0" required className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" />
            </div>
          </div>
        )}

        {(user.role === 'shipping_agent' || user.role === 'admin') && request.status === 'paid' && (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tracking Number</label>
            <Input name="tracking_number" required className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" />
          </div>
        )}

        <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-zinc-900 text-white shadow-xl shadow-zinc-900/20" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Update'}
        </Button>
      </form>
    </Card>
  );
}

function RFQDetails({ rfq, user, initialTab = 'details', onBack, onUpdate, onChat }: { rfq: RFQ & { offers?: Offer[] }, user: User, initialTab?: 'details' | 'offers' | 'action', onBack: () => void, onUpdate: () => void, onChat?: (id: string | number, type: 'RFQ' | 'Order' | 'Shipment' | 'Invoice') => void }) {
  const [activeTab, setActiveTab] = useState<'details' | 'offers' | 'action'>(initialTab);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [sampleRequests, setSampleRequests] = useState<any[]>([]);
  const [isRequestingSample, setIsRequestingSample] = useState(false);
  const activeOffer = selectedOffer || rfq.offers?.find(o => o.status === 'ready' || o.status === 'accepted');

  useEffect(() => {
    fetch(`/api/rfqs/${rfq.id}/sample-requests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setSampleRequests(data));
  }, [rfq.id]);

  const steps = [
    { key: 'draft', label: 'Draft', icon: FileText },
    { key: 'submitted', label: 'Submitted', icon: Send },
    { key: 'approved', label: 'Approved', icon: ShieldCheck },
    { key: 'paid', label: 'Paid', icon: CreditCard },
    { key: 'assigned', label: 'Assigned', icon: Users },
    { key: 'sourcing', label: 'Sourcing', icon: Search },
    { key: 'shipping', label: 'Shipping', icon: Ship },
    { key: 'offered', label: 'Offered', icon: Quote },
    { key: 'ordered', label: 'Ordered', icon: CheckCircle2 },
    { key: 'shipped', label: 'Shipped', icon: Truck },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === rfq.status);

  const [paymentProof, setPaymentProof] = useState<string | null>(rfq.payment_proof || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApproveRFQ = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/rfqs/${rfq.id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) onUpdate();
    } catch (e) {
      alert('Failed to approve RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectRFQ = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/rfqs/${rfq.id}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) onUpdate();
    } catch (e) {
      alert('Failed to reject RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveOffer = async (offerId: number) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) onUpdate();
    } catch (e) {
      alert('Failed to approve offer');
    }
  };

  const handlePayFee = async () => {
    if (!paymentProof) {
      alert('Please upload a proof of payment');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/rfqs/${rfq.id}/pay`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ paymentProof })
      });
      if (res.ok) onUpdate();
    } catch (e) {
      alert('Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all text-zinc-600 dark:text-zinc-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">RFQ #{rfq.id.toString().padStart(4, '0')}</h2>
              <StatusBadge status={rfq.status} />
              <Button 
                size="sm" 
                variant="ghost" 
                className="rounded-xl ml-2 text-zinc-500 dark:text-zinc-400"
                onClick={() => onChat?.(rfq.id, 'RFQ')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Created on {new Date(rfq.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {rfq.status === 'approved' && user.role === 'customer' && (
            <Button onClick={handlePayFee} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
              Activate Sourcing
            </Button>
          )}
          {user.role === 'sourcing_agent' && (rfq.status === 'assigned' || rfq.status === 'sourcing' || rfq.status === 'shipping') && (
            <Button 
              className="bg-amber-600 hover:bg-amber-700" 
              onClick={() => setActiveTab('action')}
            >
              <FilePlus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          )}
          {rfq.status === 'submitted' && (user.role === 'shipping_agent' || user.role === 'admin') && (
            <>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleRejectRFQ} disabled={isSubmitting}>
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleApproveRFQ} disabled={isSubmitting}>
                <Check className="w-4 h-4 mr-2" />
                Approve Request
              </Button>
            </>
          )}
          {(user.role === 'shipping_agent' || user.role === 'admin') && 
           (rfq.status === 'draft' || rfq.status === 'submitted' || rfq.status === 'approved' || rfq.status === 'paid') && (
            <Button 
              variant="outline" 
              className="rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white"
              onClick={() => setActiveTab('action')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Agent
            </Button>
          )}
        </div>
      </div>

      {/* Chronological Progress Bar */}
      <Card className="p-6 bg-white dark:bg-zinc-900 border-none shadow-sm overflow-hidden">
        <div className="relative flex justify-between items-center px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500 z-0" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isCompleted = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={s.key} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isCompleted ? "bg-primary border-primary text-white" : 
                    isCurrent ? "bg-white dark:bg-zinc-900 border-primary text-primary shadow-lg shadow-primary/20" :
                    "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-300 dark:text-zinc-600"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest transition-colors hidden md:block",
                  isCurrent ? "text-primary" : "text-zinc-400 dark:text-zinc-500"
                )}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-zinc-200">
        <TabButton label="Request Details" active={activeTab === 'details'} onClick={() => setActiveTab('details')} />
        {(rfq.status === 'offered' || rfq.status === 'ordered' || rfq.status === 'shipped' || (user.role === 'sourcing_agent' && rfq.offers && rfq.offers.length > 0)) && (
          <TabButton label="Offers" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
        )}
        {(user.role === 'sourcing_agent' || user.role === 'shipping_agent' || user.role === 'admin') && (
          <TabButton label="Take Action" active={activeTab === 'action'} onClick={() => setActiveTab('action')} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Status Notifications */}
              <div className="space-y-4">
                {rfq.status === 'submitted' && user.role === 'customer' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-8 bg-blue-50/50 border-blue-100 flex items-center gap-6 rounded-[2.5rem] overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-blue-200/50 flex items-center justify-center text-blue-600 shrink-0 relative z-10">
                        <Clock className="w-8 h-8" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-black tracking-tight text-zinc-900">Pending Agent Approval</h3>
                        <p className="text-zinc-600 text-sm font-medium mt-1">Your request is being reviewed by our logistics experts. We'll notify you as soon as it's approved.</p>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {rfq.status === 'approved' && user.role === 'customer' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-8 bg-emerald-50/50 border-emerald-100 flex flex-col md:flex-row items-center gap-8 rounded-[2.5rem] overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-emerald-200/50 flex items-center justify-center text-emerald-600 shrink-0 relative z-10">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="flex-1 relative z-10">
                        <h3 className="text-xl font-black tracking-tight text-zinc-900">Ready for Activation</h3>
                        <p className="text-zinc-600 text-sm font-medium mt-1">Your request has been approved! Pay the $299 service fee to start the sourcing process immediately.</p>
                      </div>
                      <div className="w-full md:w-auto flex flex-col gap-3 relative z-10">
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            id="payment-upload"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label 
                            htmlFor="payment-upload"
                            className="flex-1 md:flex-none px-6 py-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 cursor-pointer transition-all text-center shadow-sm"
                          >
                            {paymentProof ? 'Change Proof' : 'Upload Proof'}
                          </label>
                          <Button 
                            onClick={handlePayFee} 
                            disabled={!paymentProof || isSubmitting}
                            className="flex-1 md:flex-none rounded-xl h-12 px-8 bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/20"
                          >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                            Pay & Activate
                          </Button>
                        </div>
                        {paymentProof && (
                          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 justify-center md:justify-start">
                            <Check className="w-3 h-3" /> Payment proof attached
                          </p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}

                {rfq.status === 'rejected' && user.role === 'customer' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-8 bg-red-50/50 border-red-100 flex items-center gap-6 rounded-[2.5rem]">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-red-200/50 flex items-center justify-center text-red-600 shrink-0">
                        <X className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tight text-zinc-900">Request Not Approved</h3>
                        <p className="text-zinc-600 text-sm font-medium mt-1">We couldn't approve your request at this time. Please check your email for details or chat with our support team.</p>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {rfq.status === 'submitted' && (user.role === 'shipping_agent' || user.role === 'admin') && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-8 bg-zinc-900 text-white border-none flex flex-col md:flex-row items-center gap-8 rounded-[2.5rem] shadow-2xl shadow-zinc-900/40">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                        <Clock className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black tracking-tight">Review Required</h3>
                        <p className="text-white/60 text-sm font-medium mt-1">A new RFQ has been submitted. Please review the logistics and product specifications.</p>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none text-red-400 border-white/10 hover:bg-white/5 rounded-xl h-12" onClick={handleRejectRFQ} disabled={isSubmitting}>
                          Reject
                        </Button>
                        <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 px-8" onClick={handleApproveRFQ} disabled={isSubmitting}>
                          Approve Request
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Bento Grid Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logistics Route - Spans 2 columns */}
                <Card className="md:col-span-2 p-8 bg-white border-zinc-100 shadow-sm rounded-[2.5rem] flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Globe className="w-32 h-32" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-900/20">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl tracking-tight text-zinc-900">Logistics Route</h3>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Shipping Method: {rfq.delivery_mode} Freight</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-between relative px-8 py-6">
                    {/* Animated Route Line */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-px border-t-2 border-dashed border-zinc-200 -z-0">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-3xl bg-white border-2 border-zinc-50 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Warehouse className="w-8 h-8 text-zinc-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Origin</p>
                        <p className="text-xl font-black text-zinc-900">{rfq.origin_country}</p>
                      </div>
                    </div>

                    <div className="relative z-10 w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 rotate-12 group-hover:rotate-0 transition-all">
                      {rfq.delivery_mode === 'sea' ? <Ship className="w-7 h-7" /> : rfq.delivery_mode === 'air' ? <Plane className="w-7 h-7" /> : <Truck className="w-7 h-7" />}
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-3xl bg-white border-2 border-zinc-50 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-8 h-8 text-zinc-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Destination</p>
                        <p className="text-xl font-black text-zinc-900">{rfq.destination_country}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Sourcing Specs - Spans 1 column */}
                <Card className="p-8 bg-zinc-50 border-none rounded-[2.5rem] flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-lg tracking-tight text-zinc-900">Specs</h3>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Quality Level</p>
                      <p className="text-sm font-black text-zinc-900 capitalize">{rfq.quality_level} Standard</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Currency</p>
                      <p className="text-sm font-black text-zinc-900">{rfq.currency} (Global)</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Budget Range</p>
                      <p className="text-sm font-black text-primary">{rfq.currency} {rfq.total_budget.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>

                {/* Billing & Payment - Spans 1 column */}
                <Card className="p-8 bg-zinc-50 border-none rounded-[2.5rem] flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-lg tracking-tight text-zinc-900">Billing</h3>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Billing Type</p>
                      <p className="text-sm font-black text-zinc-900 capitalize">{rfq.billing_type || 'Not Set'}</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Payment Status</p>
                      <p className={cn("text-sm font-black capitalize", rfq.payment_status === 'paid' ? "text-emerald-600" : "text-amber-600")}>
                        {rfq.payment_status}
                      </p>
                    </div>
                    {rfq.payment_date && (
                      <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Payment Date</p>
                        <p className="text-sm font-black text-zinc-900">{new Date(rfq.payment_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Request Metadata - Spans 1 column */}
                <Card className="p-8 bg-zinc-50 border-none rounded-[2.5rem] flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-lg tracking-tight text-zinc-900">Summary</h3>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Request ID</p>
                      <p className="text-sm font-black text-zinc-900">#{rfq.id.toString().padStart(4, '0')}</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Submission Date</p>
                      <p className="text-sm font-black text-zinc-900">{new Date(rfq.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Items</p>
                      <p className="text-sm font-black text-zinc-900">{rfq.products?.length || 0} Products</p>
                    </div>
                  </div>
                </Card>

                {/* Agents - Spans 1 column */}
                <Card className="p-8 bg-zinc-50 border-none rounded-[2.5rem] flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-lg tracking-tight text-zinc-900">Team</h3>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Sourcing Agent</p>
                      <p className="text-sm font-black text-zinc-900">
                        {rfq.sourcing_agent_id ? `Agent #${rfq.sourcing_agent_id}` : 'Not Assigned'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100/50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Shipping Agent</p>
                      <p className="text-sm font-black text-zinc-900">
                        {rfq.shipping_agent_id ? `Agent #${rfq.shipping_agent_id}` : 'Not Assigned'}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Products Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tight text-zinc-900 uppercase">Requested Items</h3>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{rfq.products?.length || 0} Products in this request</p>
                  </div>
                  <div className="h-px flex-1 bg-zinc-100 ml-4" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {rfq.products?.map((p, i) => (
                    <ProductSummaryCard key={i} product={p} currency={rfq.currency} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offers' && rfq.offers && rfq.offers.length > 0 && (
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-zinc-900 uppercase">Available Quotations</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Compare and select the best offer for your business</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl">
                  <Quote className="w-4 h-4 text-zinc-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{rfq.offers?.length || 0} Offers</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {rfq.offers.map((offer) => (
                  <Card 
                    key={offer.id} 
                    className={cn(
                      "p-8 transition-all duration-500 cursor-pointer group relative overflow-hidden rounded-[2.5rem]",
                      selectedOffer?.id === offer.id 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-2xl shadow-zinc-900/20 scale-[1.02]" 
                        : "bg-white hover:bg-zinc-50 border-zinc-100 hover:border-zinc-200"
                    )}
                    onClick={() => setSelectedOffer(offer)}
                  >
                    {selectedOffer?.id === offer.id && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                          selectedOffer?.id === offer.id ? "bg-white/10 text-primary" : "bg-zinc-100 text-zinc-900"
                        )}>
                          <Quote className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className={cn("font-black text-xl uppercase tracking-tight", selectedOffer?.id === offer.id ? "text-white" : "text-zinc-900")}>
                              Offer #{offer.id.toString().padStart(3, '0')}
                            </h4>
                            <StatusBadge status={offer.status} />
                          </div>
                          <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", selectedOffer?.id === offer.id ? "text-white/40" : "text-zinc-400")}>
                            Valid until {new Date(offer.validity_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <div className="space-y-1">
                          <p className={cn("text-[10px] font-black uppercase tracking-widest", selectedOffer?.id === offer.id ? "text-white/40" : "text-zinc-400")}>Unit Price</p>
                          <p className={cn("text-lg font-black", selectedOffer?.id === offer.id ? "text-white" : "text-zinc-900")}>${offer.unit_price}</p>
                        </div>
                        <div className="space-y-1">
                          <p className={cn("text-[10px] font-black uppercase tracking-widest", selectedOffer?.id === offer.id ? "text-white/40" : "text-zinc-400")}>Landed Cost</p>
                          <p className="text-lg font-black text-primary">${offer.total_cost}</p>
                        </div>
                        <div className="space-y-1">
                          <p className={cn("text-[10px] font-black uppercase tracking-widest", selectedOffer?.id === offer.id ? "text-white/40" : "text-zinc-400")}>Production</p>
                          <p className={cn("text-sm font-black", selectedOffer?.id === offer.id ? "text-white" : "text-zinc-900")}>{offer.production_time}</p>
                        </div>
                        <div className="flex items-center justify-end">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                            selectedOffer?.id === offer.id ? "bg-primary text-zinc-900" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                          )}>
                            <ChevronRight className={cn("w-5 h-5 transition-transform", selectedOffer?.id === offer.id ? "rotate-180" : "rotate-0")} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {activeOffer && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl tracking-tight text-zinc-900 uppercase">Detailed Quotation Breakdown</h3>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Comprehensive analysis of sourcing, logistics, and compliance</p>
                    </div>
                    <div className="h-px flex-1 bg-zinc-100 ml-6" />
                  </div>

                  <Card className="overflow-hidden border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-[2.5rem]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
                      <div className="p-10 space-y-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-900/20">
                            <Search className="w-6 h-6" />
                          </div>
                          <h5 className="font-black text-xl tracking-tight text-zinc-900 uppercase">Sourcing & Production</h5>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <SummaryItem label="Unit Price" value={`$${activeOffer.unit_price}`} />
                          <SummaryItem label="Total EXW Value" value={`$${activeOffer.total_exw}`} />
                          <SummaryItem label="Production Time" value={activeOffer.production_time} />
                          <SummaryItem label="Validity" value={new Date(activeOffer.validity_date).toLocaleDateString()} />
                          {activeOffer.moq && <SummaryItem label="MOQ" value={activeOffer.moq.toString()} />}
                        </div>
                      </div>
                      
                      <div className="p-10 space-y-10 bg-zinc-50/30">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-zinc-900 shadow-lg shadow-primary/20">
                            <Truck className="w-6 h-6" />
                          </div>
                          <h5 className="font-black text-xl tracking-tight text-zinc-900 uppercase">Logistics & Compliance</h5>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <SummaryItem label="Shipping & Freight" value={`$${activeOffer.shipping_cost}`} />
                          <SummaryItem label="Customs & Duties" value={`$${activeOffer.customs_cost}`} />
                          <SummaryItem label="Service Commission" value={`$${activeOffer.commission}`} />
                          {activeOffer.hs_code && <SummaryItem label="HS Code" value={activeOffer.hs_code} />}
                          {activeOffer.offer_pi_url && (
                            <div className="flex justify-between items-center py-2 border-b border-zinc-100 last:border-0">
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Offer / PI Document</span>
                              <a 
                                href={activeOffer.offer_pi_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs font-black text-primary hover:underline flex items-center gap-1"
                              >
                                View Document <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                          <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-white/40 uppercase tracking-widest">Total Landed Cost</span>
                              <span className="text-2xl font-black text-primary">${activeOffer.total_cost}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {user.role !== 'customer' && activeOffer.supplier_name && (
                      <div className="p-10 space-y-10 border-t border-zinc-100 bg-indigo-50/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <h5 className="font-black text-xl tracking-tight text-zinc-900 uppercase">Supplier Information</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                          <SummaryItem label="Supplier Name" value={activeOffer.supplier_name} />
                          <SummaryItem label="Contact Person" value={activeOffer.supplier_contact_person} />
                          <SummaryItem label="Email" value={activeOffer.supplier_email} />
                          <SummaryItem label="Address" value={activeOffer.supplier_address} />
                        </div>
                      </div>
                    )}

                    <div className="p-10 bg-zinc-900 text-white flex flex-col md:flex-row justify-between items-center gap-10">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                          <ShieldCheck className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-white uppercase tracking-tight">Globsourcia Secure Order</p>
                          <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Escrow protection & quality inspection included</p>
                        </div>
                      </div>
                      {user.role === 'customer' && rfq.status === 'offered' && (
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                          <Button 
                            variant="outline"
                            size="lg" 
                            className="w-full md:w-auto border-primary text-primary hover:bg-primary/10 h-20 px-12 rounded-[2rem] font-black uppercase tracking-widest transition-all" 
                            onClick={() => setIsRequestingSample(true)}
                          >
                            <Package className="w-5 h-5 mr-3" />
                            Request Sample
                          </Button>
                          <Button 
                            size="lg" 
                            className="w-full md:w-auto bg-primary text-zinc-900 hover:bg-primary/90 h-20 px-16 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95" 
                            onClick={() => handleApproveOffer(activeOffer.id)}
                          >
                            Approve & Create Order
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>

                  <AnimatePresence>
                    {isRequestingSample && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8"
                      >
                        <SampleRequestForm 
                          rfqId={rfq.id} 
                          offerId={activeOffer.id} 
                          onSuccess={() => {
                            setIsRequestingSample(false);
                            onUpdate();
                          }}
                          onCancel={() => setIsRequestingSample(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {sampleRequests.length > 0 && (
                    <div className="mt-12 space-y-6">
                      <h4 className="font-black text-lg text-zinc-900 uppercase tracking-widest">Sample Requests</h4>
                      {sampleRequests.map(req => (
                        <Card key={req.id} className="p-8 bg-white border-zinc-100 rounded-[2.5rem] shadow-sm">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                                <Package className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Request #{req.id.toString().padStart(3, '0')}</p>
                                <p className="text-sm font-bold text-zinc-900">{req.details}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</p>
                                <StatusBadge status={req.status} />
                              </div>
                              {req.total_cost && (
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Cost</p>
                                  <p className="text-lg font-black text-primary">${req.total_cost}</p>
                                </div>
                              )}
                              {req.status === 'ready' && user.role === 'customer' && (
                                <Button 
                                  size="sm"
                                  className="bg-zinc-900 text-white rounded-xl px-6 h-10"
                                  onClick={async () => {
                                    const res = await fetch(`/api/sample-requests/${req.id}/pay`, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                      },
                                      body: JSON.stringify({ payment_proof: 'mock-payment-proof' })
                                    });
                                    if (res.ok) onUpdate();
                                  }}
                                >
                                  Pay for Sample
                                </Button>
                              )}
                            </div>
                          </div>
                          {req.tracking_number && (
                            <div className="mt-6 p-4 bg-zinc-50 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Truck className="w-4 h-4 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-600">Tracking: {req.tracking_number}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary">Track Package</Button>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'action' && (
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xl shadow-zinc-900/20">
                  <Loader2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-zinc-900 uppercase">Agent Workspace</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Execute assignments and manage operational progress</p>
                </div>
                <div className="h-px flex-1 bg-zinc-100 ml-6" />
              </div>

              <div className="grid grid-cols-1 gap-10">
                {(user.role === 'shipping_agent' || user.role === 'admin') && 
                 (rfq.status === 'draft' || rfq.status === 'submitted' || rfq.status === 'approved' || rfq.status === 'paid') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 bg-zinc-50 rounded-[3rem] border border-zinc-100"
                  >
                    <AssignAgentForm rfqId={rfq.id} onSuccess={onUpdate} />
                  </motion.div>
                )}
                {user.role === 'sourcing_agent' && rfq.sourcing_agent_id === user.id && (rfq.status === 'assigned' || rfq.status === 'sourcing' || rfq.status === 'shipping' || rfq.status === 'offered') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 bg-zinc-50 rounded-[3rem] border border-zinc-100"
                  >
                    <SourcingAgentForm rfq={rfq} onSuccess={onUpdate} />
                  </motion.div>
                )}
                {user.role === 'shipping_agent' && rfq.shipping_agent_id === user.id && (rfq.status === 'shipping' || rfq.status === 'offered') && (
                  <div className="space-y-10">
                    {rfq.offers?.filter(o => o.status === 'shipping_pending').map(offer => (
                      <motion.div 
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="p-1 bg-zinc-50 rounded-[3rem] border border-zinc-100"
                      >
                        <ShippingAgentForm offer={offer} onSuccess={onUpdate} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Sample Request Management for Agents */}
                {sampleRequests.filter(r => 
                  (user.role === 'sourcing_agent' && r.status === 'pending') ||
                  (user.role === 'shipping_agent' && r.status === 'sourcing_priced') ||
                  ((user.role === 'shipping_agent' || user.role === 'admin') && r.status === 'paid')
                ).map(req => (
                  <motion.div 
                    key={req.id}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 bg-zinc-50 rounded-[3rem] border border-zinc-100"
                  >
                    <SampleRequestAgentForm request={req} onSuccess={onUpdate} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-8 bg-zinc-900 text-white border-none shadow-2xl shadow-zinc-900/20 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h3 className="font-black text-lg tracking-tight mb-8 uppercase tracking-[0.2em] relative z-10">Financial Summary</h3>
            <div className="space-y-8 relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Estimated Budget</span>
                <span className="text-3xl font-black text-primary">{rfq.currency} {rfq.total_budget.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Delivery</span>
                  <span className="text-sm font-bold">45-60 Days</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", rfq.payment_status === 'paid' ? "bg-emerald-500" : "bg-amber-500")} />
                    <span className="text-xs font-bold capitalize">{rfq.payment_status}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">Globsourcia Protected</p>
                    <p className="text-[9px] text-white/40 font-medium">Secure transaction & quality guarantee</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">Verified Sourcing</p>
                    <p className="text-[9px] text-white/40 font-medium">Direct factory connections</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {rfq.payment_proof && (user.role === 'shipping_agent' || user.role === 'admin') && (
            <Card className="p-6 bg-white border border-zinc-100 rounded-[2.5rem] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Proof</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{rfq.billing_type}</span>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-100 bg-zinc-50 group relative">
                {rfq.payment_proof.startsWith('data:image') ? (
                  <>
                    <img src={rfq.payment_proof} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="outline" size="sm" className="bg-white text-zinc-900 border-none rounded-xl font-black text-[10px] uppercase tracking-widest" onClick={() => window.open(rfq.payment_proof)}>
                        View Full Size
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <a href={rfq.payment_proof} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Download Document</a>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-8 bg-white border-zinc-100 shadow-xl shadow-zinc-200/40 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <MessageSquare className="w-24 h-24" />
            </div>
            <h3 className="font-black text-lg tracking-tight mb-4 uppercase tracking-[0.1em] relative z-10">Support</h3>
            <p className="text-sm text-zinc-500 font-medium mb-8 relative z-10 leading-relaxed">Need help with this request? Our dedicated agents are available to assist you with logistics, sourcing, or payments.</p>
            <Button 
              className="w-full rounded-2xl h-14 font-black uppercase tracking-widest bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/20 relative z-10"
              onClick={() => onChat?.(rfq.id, 'RFQ')}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Chat with Agent
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AssignAgentForm({ rfqId, onSuccess }: { rfqId: number, onSuccess: () => void }) {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/users/agents', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAgents(data));
  }, []);

  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const sourcing_agent_id = formData.get('agent_id');

    try {
      const res = await fetch(`/api/rfqs/${rfqId}/assign`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sourcing_agent_id })
      });
      if (res.ok) onSuccess();
    } catch (e) {
      alert('Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-10 border-none shadow-2xl shadow-zinc-200/50 bg-white rounded-[2.5rem]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <UserPlus className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight text-zinc-900">Assign Sourcing Agent</h3>
          <p className="text-zinc-400 text-sm font-medium">Payment verified. Start market research.</p>
        </div>
      </div>
      
      <form onSubmit={handleAssign} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Select Professional Agent</label>
          <div className="relative group">
            <select 
              name="agent_id"
              className="w-full h-14 rounded-2xl border border-zinc-200 bg-zinc-50/50 px-5 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            >
              <option value="">Choose an agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name} ({agent.email})</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Assignment'}
        </Button>
      </form>
    </Card>
  );
}

function SourcingAgentForm({ rfq, onSuccess }: { rfq: RFQ & { offers?: Offer[] }, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
  
  // Form States
  const [quantity, setQuantity] = useState<string>('');
  const [qualityLevel, setQualityLevel] = useState<string>('');
  const [deliveryMode, setDeliveryMode] = useState<string>('');
  const [deliverySubMode, setDeliverySubMode] = useState<string>('');
  const [volumeCbm, setVolumeCbm] = useState<string>('');
  const [grossWeightKg, setGrossWeightKg] = useState<string>('');
  const [productionTime, setProductionTime] = useState<string>('');
  const [deliveryDeadline, setDeliveryDeadline] = useState<string>('');
  const [offerValidity, setOfferValidity] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [totalExw, setTotalExw] = useState<string>('');
  const [exwCharges, setExwCharges] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [totalCfr, setTotalCfr] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [supplierAddress, setSupplierAddress] = useState<string>('');
  const [supplierContactPerson, setSupplierContactPerson] = useState<string>('');
  const [supplierEmail, setSupplierEmail] = useState<string>('');
  const [hsCode, setHsCode] = useState<string>('');
  const [offerPiUrl, setOfferPiUrl] = useState<string>('');
  const [moq, setMoq] = useState<string>('1');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    category: '',
    country: '',
    address: '',
    contact_person: '',
    contact_email: '',
    rating: 0
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (e) {
      console.error('Failed to fetch suppliers', e);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const totalRfqQuantity = rfq.products.reduce((acc, p) => acc + p.quantity, 0);

  // Initialize quantity if not editing
  useEffect(() => {
    if (!editingOfferId && !quantity) {
      setQuantity(totalRfqQuantity.toString());
    }
  }, [totalRfqQuantity, editingOfferId]);

  // Auto-calculations
  useEffect(() => {
    const q = Number(quantity) || 0;
    const up = Number(unitPrice) || 0;
    const exw = q * up;
    setTotalExw(exw.toFixed(2));
  }, [quantity, unitPrice]);

  useEffect(() => {
    const exw = Number(totalExw) || 0;
    const charges = Number(exwCharges) || 0;
    const ship = Number(shippingCost) || 0;
    const cfr = exw + charges + ship;
    setTotalCfr(cfr.toFixed(2));
  }, [totalExw, exwCharges, shippingCost]);

  const handleEdit = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setQuantity(offer.quantity?.toString() || '');
    setQualityLevel(offer.quality_level || '');
    setDeliveryMode(offer.delivery_mode || '');
    setDeliverySubMode(offer.delivery_sub_mode || '');
    setVolumeCbm(offer.volume_cbm?.toString() || '');
    setGrossWeightKg(offer.gross_weight_kg?.toString() || '');
    setProductionTime(offer.production_time || '');
    setDeliveryDeadline(offer.delivery_deadline || '');
    setOfferValidity(offer.offer_validity || '');
    setPaymentTerms(offer.payment_terms || '');
    setUnitPrice(offer.unit_price.toString());
    setTotalExw(offer.total_exw.toString());
    setExwCharges(offer.exw_charges?.toString() || '');
    setShippingCost(offer.shipping_cost?.toString() || '');
    setTotalCfr(offer.total_cfr?.toString() || '');
    setRemarks(offer.remarks || '');
    setSupplierName(offer.supplier_name || '');
    setSupplierAddress(offer.supplier_address || '');
    setSupplierContactPerson(offer.supplier_contact_person || '');
    setSupplierEmail(offer.supplier_email || '');
    setHsCode(offer.hs_code || '');
    setOfferPiUrl(offer.offer_pi_url || '');
    setMoq(offer.moq?.toString() || '1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingOfferId(null);
    setQuantity(totalRfqQuantity.toString());
    setQualityLevel('');
    setDeliveryMode('');
    setDeliverySubMode('');
    setVolumeCbm('');
    setGrossWeightKg('');
    setProductionTime('');
    setDeliveryDeadline('');
    setOfferValidity('');
    setPaymentTerms('');
    setUnitPrice('');
    setTotalExw('');
    setExwCharges('');
    setShippingCost('');
    setTotalCfr('');
    setRemarks('');
    setSupplierName('');
    setSupplierAddress('');
    setSupplierContactPerson('');
    setSupplierEmail('');
    setHsCode('');
    setOfferPiUrl('');
    setMoq('1');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      rfq_id: rfq.id,
      quantity: Number(quantity),
      quality_level: qualityLevel,
      delivery_mode: deliveryMode,
      delivery_sub_mode: deliverySubMode,
      volume_cbm: Number(volumeCbm),
      gross_weight_kg: Number(grossWeightKg),
      production_time: productionTime,
      delivery_deadline: deliveryDeadline,
      offer_validity: offerValidity,
      payment_terms: paymentTerms,
      unit_price: Number(unitPrice),
      total_exw: Number(totalExw),
      exw_charges: Number(exwCharges),
      shipping_cost: Number(shippingCost),
      total_cfr: Number(totalCfr),
      remarks: remarks,
      supplier_name: supplierName,
      supplier_address: supplierAddress,
      supplier_contact_person: supplierContactPerson,
      supplier_email: supplierEmail,
      hs_code: hsCode,
      offer_pi_url: offerPiUrl,
      moq: Number(moq),
      // Legacy fields for compatibility
      validity_date: offerValidity 
    };

    try {
      const url = editingOfferId ? `/api/offers/${editingOfferId}` : '/api/offers';
      const method = editingOfferId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        resetForm();
        onSuccess();
      }
    } catch (e) {
      alert('Failed to submit offer');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSupplier)
      });
      if (res.ok) {
        await fetchSuppliers();
        setSupplierName(newSupplier.name || '');
        setSupplierAddress(newSupplier.address || '');
        setSupplierContactPerson(newSupplier.contact_person || '');
        setSupplierEmail(newSupplier.contact_email || '');
        setShowAddSupplier(false);
        setNewSupplier({
          name: '',
          category: '',
          country: '',
          address: '',
          contact_person: '',
          contact_email: '',
          rating: 0
        });
      }
    } catch (e) {
      alert('Failed to add supplier');
    }
  };

  const handleSelectSupplier = (s: Supplier) => {
    setSupplierName(s.name);
    setSupplierAddress(s.address || '');
    setSupplierContactPerson(s.contact_person || '');
    setSupplierEmail(s.contact_email || '');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myOffers = rfq.offers?.filter(o => o.sourcing_agent_id === user.id) || [];

  return (
    <div className="space-y-10">
      <Card className="p-10 border-none shadow-2xl shadow-zinc-200/50 bg-white rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-900">
                {editingOfferId ? `Edit Offer #${editingOfferId.toString().padStart(3, '0')}` : 'Submit Sourcing Offer'}
              </h3>
              <p className="text-zinc-400 text-sm font-medium">Provide competitive pricing and production details.</p>
            </div>
          </div>
          {editingOfferId && (
            <Button variant="ghost" onClick={resetForm} className="rounded-xl text-zinc-500 hover:text-zinc-900">
              Cancel Edit
            </Button>
          )}
        </div>

        <div className="mb-10 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Request Summary</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total Quantity</p>
              <p className="text-lg font-bold text-zinc-900">{totalRfqQuantity} Units</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Products</p>
              <p className="text-sm font-bold text-zinc-900">{rfq.products.map(p => p.name).join(', ')}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quantity & Quality */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Quantity (Total)</label>
              <div className="flex gap-2">
                <Input 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number" 
                  required 
                  className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
                />
                <div className="w-32 space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-[0.1em] text-zinc-400">MOQ</label>
                  <Input 
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    type="number" 
                    className="h-10 rounded-xl bg-zinc-50/50 border-zinc-200 font-bold text-xs" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    const m = Number(moq) || 1;
                    const q = Number(quantity) || 0;
                    setQuantity((q + m).toString());
                  }}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  + Add MOQ ({moq})
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const m = Number(moq) || 1;
                    const q = Number(quantity) || 0;
                    if (q >= m) setQuantity((q - m).toString());
                  }}
                  className="text-[10px] font-bold text-zinc-400 hover:underline"
                >
                  - Remove MOQ ({moq})
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Quality Level</label>
              <select 
                value={qualityLevel}
                onChange={(e) => setQualityLevel(e.target.value)}
                required
                className="w-full h-14 rounded-2xl bg-zinc-50/50 border border-zinc-200 px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select Quality</option>
                <option value="High">High Quality</option>
                <option value="Medium">Medium Quality</option>
                <option value="Economy">Economy / Low</option>
              </select>
            </div>

            {/* Delivery Mode */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Delivery Mode</label>
              <select 
                value={deliveryMode}
                onChange={(e) => {
                  setDeliveryMode(e.target.value);
                  setDeliverySubMode('');
                }}
                required
                className="w-full h-14 rounded-2xl bg-zinc-50/50 border border-zinc-200 px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select Mode</option>
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
                <option value="Road">Road</option>
              </select>
            </div>

            {deliveryMode && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {deliveryMode} Options
                </label>
                <select 
                  value={deliverySubMode}
                  onChange={(e) => setDeliverySubMode(e.target.value)}
                  required
                  className="w-full h-14 rounded-2xl bg-zinc-50/50 border border-zinc-200 px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select {deliveryMode} Option</option>
                  {deliveryMode === 'Sea' && (
                    <>
                      <option value="Sea LCL">Sea LCL</option>
                      <option value="Sea FCL">Sea FCL</option>
                    </>
                  )}
                  {deliveryMode === 'Air' && (
                    <>
                      <option value="Air Cargo">Air Cargo</option>
                      <option value="Air Express">Air Express</option>
                    </>
                  )}
                  {deliveryMode === 'Road' && (
                    <>
                      <option value="LTL Road">LTL Road</option>
                      <option value="FTL Road">FTL Road</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Volume & Weight */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Volume (CBM)</label>
              <Input 
                value={volumeCbm}
                onChange={(e) => setVolumeCbm(e.target.value)}
                type="number" 
                step="0.01"
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Gross Weight (Kg)</label>
              <Input 
                value={grossWeightKg}
                onChange={(e) => setGrossWeightKg(e.target.value)}
                type="number" 
                step="0.01"
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>

            {/* HS Code & Document */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">HS Code (SH Code)</label>
              <Input 
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                placeholder="e.g. 8517.12.00"
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Offer / PI Document</label>
              <div className="flex gap-2">
                <Input 
                  value={offerPiUrl}
                  onChange={(e) => setOfferPiUrl(e.target.value)}
                  placeholder="Document URL or Scan Link"
                  className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold flex-1" 
                />
                <button 
                  type="button"
                  onClick={() => alert('Scanner interface would open here. For now, please provide a URL.')}
                  className="px-4 h-14 rounded-2xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors flex items-center gap-2 font-bold text-xs"
                >
                  <Camera className="w-4 h-4" />
                  Scan
                </button>
              </div>
            </div>

            {/* Times & Validity */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Production Time (Days)</label>
              <Input 
                value={productionTime}
                onChange={(e) => setProductionTime(e.target.value)}
                type="number"
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Delivery Deadline (Days)</label>
              <Input 
                value={deliveryDeadline}
                onChange={(e) => setDeliveryDeadline(e.target.value)}
                type="number"
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Offer Validity</label>
              <Input 
                value={offerValidity}
                onChange={(e) => setOfferValidity(e.target.value)}
                type="date" 
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Payment Terms</label>
              <select 
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                required
                className="w-full h-14 rounded-2xl bg-zinc-50/50 border border-zinc-200 px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select Terms</option>
                <option value="50%, 50%">50%, 50%</option>
                <option value="30%, 70%">30%, 70%</option>
                <option value="100% in advance">100% in advance</option>
              </select>
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Unit Price ($)</label>
              <Input 
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                type="number" 
                step="0.01" 
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Total EXW ($)</label>
              <Input 
                value={totalExw}
                readOnly
                className="h-14 rounded-2xl bg-zinc-100 border-zinc-200 font-bold cursor-not-allowed" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">EXW Charges ($)</label>
              <Input 
                value={exwCharges}
                onChange={(e) => setExwCharges(e.target.value)}
                type="number" 
                step="0.01" 
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Shipping Cost ($)</label>
              <Input 
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                type="number" 
                step="0.01" 
                required 
                className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Total CFR ($)</label>
              <Input 
                value={totalCfr}
                readOnly
                className="h-14 rounded-2xl bg-zinc-100 border-zinc-200 font-bold cursor-not-allowed" 
              />
              <p className="text-[10px] text-zinc-400 italic">EXW + Charges + Shipping</p>
            </div>
          </div>

          {/* Supplier Details */}
          <div className="pt-10 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900">Supplier Information</h4>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  onChange={(e) => {
                    const s = suppliers.find(sup => sup.id === Number(e.target.value));
                    if (s) handleSelectSupplier(s);
                  }}
                  className="h-10 rounded-xl bg-zinc-50 border border-zinc-200 px-3 text-xs font-bold outline-none"
                >
                  <option value="">Select Existing Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <button 
                  type="button"
                  onClick={() => setShowAddSupplier(true)}
                  className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                  title="Add New Supplier"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showAddSupplier && (
              <div className="mb-10 p-8 bg-amber-50/50 rounded-[2rem] border border-amber-100 space-y-6">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-black text-amber-900">Create New Supplier</h5>
                  <button onClick={() => setShowAddSupplier(false)} className="text-amber-600 hover:text-amber-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-700">Company Name</label>
                    <Input 
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                      className="bg-white border-amber-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-700">Category</label>
                      <Input 
                        value={newSupplier.category}
                        onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                        className="bg-white border-amber-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-700">Country</label>
                      <Input 
                        value={newSupplier.country}
                        onChange={(e) => setNewSupplier({...newSupplier, country: e.target.value})}
                        className="bg-white border-amber-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-700">Address</label>
                    <Input 
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                      className="bg-white border-amber-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-700">Contact Person</label>
                      <Input 
                        value={newSupplier.contact_person}
                        onChange={(e) => setNewSupplier({...newSupplier, contact_person: e.target.value})}
                        className="bg-white border-amber-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-700">Email</label>
                      <Input 
                        value={newSupplier.contact_email}
                        onChange={(e) => setNewSupplier({...newSupplier, contact_email: e.target.value})}
                        className="bg-white border-amber-100"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddSupplier} className="rounded-xl px-8">Save Supplier</Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Supplier Name</label>
                <Input 
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  required 
                  className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
                  placeholder="Factory or Trading Company Name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Supplier Email</label>
                <Input 
                  value={supplierEmail}
                  onChange={(e) => setSupplierEmail(e.target.value)}
                  type="email"
                  required 
                  className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
                  placeholder="contact@supplier.com"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Contact Person</label>
                <Input 
                  value={supplierContactPerson}
                  onChange={(e) => setSupplierContactPerson(e.target.value)}
                  required 
                  className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Supplier Address</label>
                <Input 
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  required 
                  className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 font-bold" 
                  placeholder="Full physical address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Additional Note (Remarks)</label>
            <textarea 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-32 rounded-2xl bg-zinc-50/50 border border-zinc-200 p-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Any additional details or terms..."
            />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20" disabled={loading}>
            {loading ? 'Submitting...' : (editingOfferId ? 'Update Offer' : 'Submit Offer')}
          </Button>
        </form>
      </Card>

      {myOffers.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-zinc-900 px-4">My Submitted Offers</h3>
          <div className="grid gap-4">
            {myOffers.map((offer) => (
              <Card key={offer.id} className="p-6 bg-white border-zinc-100 rounded-3xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-zinc-900">Offer #{offer.id.toString().padStart(3, '0')}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      offer.status === 'ready' || offer.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {offer.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] text-zinc-500">
                    <span>Unit Price: <strong className="text-zinc-900">${offer.unit_price}</strong></span>
                    <span>Total EXW: <strong className="text-zinc-900">${offer.total_exw}</strong></span>
                    <span>Total CFR: <strong className="text-zinc-900">${offer.total_cfr || 'N/A'}</strong></span>
                    <span>Production: <strong className="text-zinc-900">{offer.production_time} Days</strong></span>
                  </div>
                </div>
                {(offer.status === 'shipping_pending' || offer.status === 'sourcing_pending') && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleEdit(offer)}
                    className="rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  >
                    Edit Offer
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShippingAgentForm({ offer, onSuccess }: { offer?: Offer, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(offer?.shipping_cost?.toString() || '0');
  const [customsCost, setCustomsCost] = useState(offer?.customs_cost?.toString() || '0');
  const [commission, setCommission] = useState(offer?.commission?.toString() || '0');
  const [totalCost, setTotalCost] = useState(offer?.total_cost?.toString() || '0');

  useEffect(() => {
    if (offer) {
      const exw = Number(offer.total_exw) || 0;
      const exwCharges = Number(offer.exw_charges) || 0;
      const ship = Number(shippingCost) || 0;
      const customs = Number(customsCost) || 0;
      const comm = Number(commission) || 0;
      setTotalCost((exw + exwCharges + ship + customs + comm).toFixed(2));
    }
  }, [offer, shippingCost, customsCost, commission]);

  if (!offer) return <Card className="p-8 text-center text-zinc-500">No pending offer found for this RFQ.</Card>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      shipping_cost: Number(shippingCost),
      customs_cost: Number(customsCost),
      commission: Number(commission),
      total_cost: Number(totalCost),
      delivery_deadline: formData.get('delivery_deadline'),
      shipping_details: formData.get('shipping_details'),
    };

    try {
      const res = await fetch(`/api/offers/${offer.id}/shipping`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) onSuccess();
    } catch (e) {
      alert('Failed to update shipping details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <h3 className="text-xl font-bold mb-6">Add Shipping Details for Offer #{offer.id.toString().padStart(3, '0')}</h3>
      
      {/* Sourcing Offer Details Summary */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Quantity</p>
          <p className="font-bold text-zinc-900">{offer.quantity} Units</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Quality</p>
          <p className="font-bold text-zinc-900">{offer.quality_level}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Mode</p>
          <p className="font-bold text-zinc-900">{offer.delivery_sub_mode || offer.delivery_mode}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Weight / Vol</p>
          <p className="font-bold text-zinc-900">{offer.gross_weight_kg}kg / {offer.volume_cbm}CBM</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Production</p>
          <p className="font-bold text-zinc-900">{offer.production_time} Days</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Validity</p>
          <p className="font-bold text-zinc-900">{offer.offer_validity}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total EXW</p>
          <p className="font-bold text-primary">${offer.total_exw}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">EXW Charges</p>
          <p className="font-bold text-primary">${offer.exw_charges}</p>
        </div>
        {offer.supplier_name && (
          <div className="col-span-full pt-4 border-t border-zinc-200 mt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Supplier Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-zinc-500">Name</p>
                <p className="text-xs font-bold text-zinc-900">{offer.supplier_name}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">Contact</p>
                <p className="text-xs font-bold text-zinc-900">{offer.supplier_contact_person}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">Email</p>
                <p className="text-xs font-bold text-zinc-900">{offer.supplier_email}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">Address</p>
                <p className="text-xs font-bold text-zinc-900">{offer.supplier_address}</p>
              </div>
            </div>
          </div>
        )}
        {offer.remarks && (
          <div className="col-span-full pt-2 border-t border-zinc-200 mt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Sourcing Remarks</p>
            <p className="text-xs text-zinc-600 mt-1 italic">"{offer.remarks}"</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Shipping Cost ($)</label>
            <Input 
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
              type="number" 
              step="0.01" 
              min="0" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Customs & Duties ($)</label>
            <Input 
              value={customsCost}
              onChange={(e) => setCustomsCost(e.target.value)}
              type="number" 
              step="0.01" 
              min="0" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Commission ($)</label>
            <Input 
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              type="number" 
              step="0.01" 
              min="0" 
              required 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Landed Cost ($)</label>
            <Input 
              value={totalCost}
              readOnly
              type="number" 
              step="0.01" 
              className="bg-zinc-50 font-bold text-primary"
            />
            <p className="text-[10px] text-zinc-400 italic">Auto-calculated: EXW + Charges + Shipping + Customs + Commission</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Est. Delivery Deadline</label>
            <Input name="delivery_deadline" type="date" required />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Shipping Method / Details</label>
          <textarea 
            name="shipping_details"
            className="w-full h-24 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            placeholder="e.g. Sea Freight, LCL, Door to Door"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Submit Final Offer to Buyer/Importer'}
        </Button>
      </form>
    </Card>
  );
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "pb-4 text-sm font-bold transition-all relative",
        active ? "text-primary" : "text-zinc-400 hover:text-zinc-600"
      )}
    >
      {label}
      {active && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
    </button>
  );
}

function RoutePoint({ label, value, icon, align = 'start' }: { label: string, value: string, icon: React.ReactNode, align?: 'start' | 'end' }) {
  return (
    <div className={cn("flex flex-col gap-6", align === 'end' ? "items-end text-right" : "items-start")}>
      <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-zinc-100 shadow-2xl shadow-zinc-200/50 flex items-center justify-center transition-transform duration-700 hover:scale-110">
        {icon}
      </div>
      <div className="space-y-2">
        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-400">{label}</span>
        <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">{value || '---'}</p>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, icon: Icon, color = 'zinc' }: { label: string, value: string, icon?: any, color?: string }) {
  const colors: any = {
    primary: 'bg-primary/5 text-primary border-primary/10',
    secondary: 'bg-secondary/5 text-secondary border-secondary/10',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20',
    zinc: 'bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800',
  };

  return (
    <div className={cn("p-8 rounded-[2.5rem] border flex items-center justify-between group hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-700 bg-white dark:bg-zinc-900 relative overflow-hidden", colors[color])}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      
      <div className="flex items-center gap-6 relative z-10">
        {Icon && (
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl shadow-zinc-200/40 dark:shadow-none flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
            <Icon className="w-7 h-7" />
          </div>
        )}
        <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60">{label}</span>
      </div>
      <span className="text-xl font-black tracking-tighter relative z-10">{value}</span>
    </div>
  );
}

function TimelineItem({ active, title, date }: { active?: boolean, title: string, date: string }) {
  return (
    <div className="flex gap-5 group/timeline">
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-4 h-4 rounded-full border-4 transition-all duration-500", 
          active ? "bg-primary border-primary/20 scale-110" : "bg-white border-zinc-100"
        )}></div>
        <div className={cn("w-0.5 h-full mt-1 rounded-full", active ? "bg-primary/20" : "bg-zinc-50")}></div>
      </div>
      <div className="pb-8">
        <p className={cn("text-sm font-black tracking-tight transition-colors", active ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500")}>{title}</p>
        <p className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">{date}</p>
      </div>
    </div>
  );
}

// --- Shipments View ---

function ShipmentsView({ 
  user, 
  shipments, 
  rfqs, 
  viewMode, 
  setViewMode, 
  onTrackDetails, 
  onSelectRfq, 
  onCreateShipment 
}: { 
  user: User, 
  shipments: Shipment[], 
  rfqs: RFQ[], 
  viewMode: 'grid' | 'table', 
  setViewMode: (mode: 'grid' | 'table') => void, 
  onTrackDetails: (s: Shipment) => void, 
  onSelectRfq: (r: RFQ) => void, 
  onCreateShipment: () => void 
}) {
  const orderedRfqs = rfqs.filter(r => r.status === 'ordered');
  const hasContent = shipments.length > 0 || orderedRfqs.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          {(user.role === 'shipping_agent' || user.role === 'admin' || user.role === 'sourcing_agent') && (
            <Button onClick={onCreateShipment}><Plus className="w-4 h-4 mr-2" /> Create Shipment</Button>
          )}
        </div>
      </div>

      {!hasContent ? (
        <Card className="p-16 text-center bg-zinc-50/50 border-dashed border-2 border-zinc-200 rounded-[2rem]">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-zinc-200/50">
            <Package className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-zinc-900">
            {user.role === 'customer' ? 'No active orders' : 'No active shipments'}
          </h3>
          <p className="text-zinc-500 mt-2 font-medium">Once your orders are ready for transport, they will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-12">
          {orderedRfqs.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
              {viewMode === 'table' ? (
                <Card className="border border-zinc-200 shadow-xl shadow-zinc-200/20 overflow-hidden rounded-[2rem]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-zinc-50 text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-zinc-200">
                        <tr>
                          <th className="px-6 py-5 border-r border-zinc-100">RFQ ID & Date</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Photo</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Product Name</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Qty</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Link</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Sourcing</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Destination</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Quality</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Budget</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Mode</th>
                          <th className="px-6 py-5 border-r border-zinc-100">Status</th>
                          <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 bg-white">
                        {orderedRfqs.map((rfq) => (
                          <tr key={rfq.id} className="hover:bg-zinc-50/80 transition-all group cursor-pointer" onClick={() => onSelectRfq(rfq)}>
                            <td className="px-6 py-6 border-r border-zinc-100">
                              <p className="font-mono text-xs font-black text-zinc-900">#{rfq.id.toString().padStart(4, '0')}</p>
                              <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider italic font-serif">{new Date(rfq.created_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100">
                              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200/50 shadow-sm">
                                {rfq.products?.[0]?.photo_urls?.[0] ? (
                                  <img src={rfq.products[0].photo_urls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <Package className="w-5 h-5 text-zinc-300" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100">
                              <p className="text-xs font-black text-zinc-900 truncate max-w-[150px]">{rfq.products?.[0]?.name || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100 text-center">
                              <p className="text-xs font-black text-zinc-900">{rfq.products?.[0]?.quantity || 0}</p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">{rfq.products?.[0]?.unit || 'pcs'}</p>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100 text-center">
                              {rfq.products?.[0]?.website_link ? (
                                <a 
                                  href={rfq.products[0].website_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-4 h-4 mx-auto" />
                                </a>
                              ) : '-'}
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100">
                              <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-[10px] font-black text-zinc-900">{rfq.origin_country}</span>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100">
                              <span className="px-2 py-0.5 bg-zinc-100 rounded-md text-[10px] font-black text-zinc-900">{rfq.destination_country}</span>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100 text-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{rfq.quality_level || '-'}</span>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100 text-right">
                              <p className="text-xs font-black text-zinc-900">${rfq.total_budget?.toLocaleString() || 0}</p>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100 text-center">
                              <div className="flex flex-col items-center gap-1">
                                {rfq.delivery_mode === 'sea' ? <Ship className="w-3 h-3 text-zinc-400" /> : rfq.delivery_mode === 'air' ? <Plane className="w-3 h-3 text-zinc-400" /> : <Truck className="w-3 h-3 text-zinc-400" />}
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{rfq.delivery_mode}</span>
                              </div>
                            </td>
                            <td className="px-6 py-6 border-r border-zinc-100">
                              <StatusBadge status={rfq.status} />
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                  <ChevronRight className="w-5 h-5" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orderedRfqs.map(rfq => (
                    <Card key={rfq.id} className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => onSelectRfq(rfq)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900">Order #{rfq.id.toString().padStart(4, '0')}</h4>
                            <p className="text-xs text-zinc-500 font-medium">Preparing for shipment • {rfq.products?.[0]?.name || 'Product'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                            <StatusBadge status="ordered" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {shipments.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
              {viewMode === 'table' ? (
                <Card className="border border-zinc-200 shadow-xl shadow-zinc-200/20 overflow-hidden rounded-[2rem]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1500px]">
                      <thead className="bg-zinc-50 text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-zinc-200">
                        <tr>
                          {(user.role === 'sourcing_agent' || user.role === 'shipping_agent' || user.role === 'admin') ? (
                            <>
                              <th className="px-6 py-5 border-r border-zinc-100">Shipment ID & Date</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Transport Mode</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Packing Details</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Origin</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Destination</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Total Value</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Shipping Line</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Booking N</th>
                              <th className="px-6 py-5 border-r border-zinc-100">BL N</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Free Time</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Cut-Off</th>
                              <th className="px-6 py-5 border-r border-zinc-100">ETD</th>
                              <th className="px-6 py-5 border-r border-zinc-100">ETA</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Transit Time</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Delivery</th>
                              <th className="px-6 py-5 border-r border-zinc-100">Status</th>
                            </>
                          ) : (
                            <>
                              <th className="px-8 py-5 border-r border-zinc-100">Tracking #</th>
                              <th className="px-8 py-5 border-r border-zinc-100">Carrier / Orders</th>
                              <th className="px-8 py-5 border-r border-zinc-100">Route</th>
                              <th className="px-8 py-5 border-r border-zinc-100">Status</th>
                            </>
                          )}
                          <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 bg-white">
                        {shipments.map((shipment) => (
                          <tr key={shipment.id} className="hover:bg-zinc-50/80 transition-all group cursor-pointer" onClick={() => onTrackDetails(shipment)}>
                            {(user.role === 'sourcing_agent' || user.role === 'shipping_agent' || user.role === 'admin') ? (
                              <>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="font-black text-zinc-900">#{shipment.id.toString().padStart(4, '0')}</p>
                                  <p className="text-[10px] text-zinc-500">{new Date(shipment.created_at).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm font-medium text-zinc-900 uppercase">{shipment.transport_mode}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.packing_details}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-900">{shipment.origin}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-900">{shipment.destination}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm font-bold text-zinc-900">${shipment.total_value?.toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.shipping_line}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm font-mono text-zinc-600">{shipment.booking_number}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm font-mono text-zinc-600">{shipment.bl_number}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.free_time}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.cut_off ? new Date(shipment.cut_off).toLocaleDateString() : '-'}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.etd ? new Date(shipment.etd).toLocaleDateString() : '-'}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.eta ? new Date(shipment.eta).toLocaleDateString() : '-'}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.transit_time}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <p className="text-sm text-zinc-600">{shipment.delivery_date ? new Date(shipment.delivery_date).toLocaleDateString() : '-'}</p>
                                </td>
                                <td className="px-6 py-6 border-r border-zinc-100">
                                  <StatusBadge status={shipment.status} />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-8 py-6 border-r border-zinc-100">
                                  <p className="font-mono text-xs font-black text-zinc-900">{shipment.tracking_number}</p>
                                </td>
                                <td className="px-8 py-6 border-r border-zinc-100">
                                  <p className="text-sm font-black text-zinc-900">{shipment.carrier}</p>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{shipment.items?.length || 0} Linked Orders</p>
                                </td>
                                <td className="px-8 py-6 border-r border-zinc-100">
                                  <div className="flex items-center gap-3 text-xs font-black text-zinc-900">
                                    <span className="px-2 py-0.5 bg-zinc-100 rounded-md">{shipment.origin}</span>
                                    <ArrowRight className="w-3 h-3 text-primary" />
                                    <span className="px-2 py-0.5 bg-zinc-100 rounded-md">{shipment.destination}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6 border-r border-zinc-100">
                                  <StatusBadge status={shipment.status} />
                                </td>
                              </>
                            )}
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                  <ChevronRight className="w-5 h-5" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {shipments.map((shipment) => (
                    <Card key={shipment.id} className="p-0 overflow-hidden group border-none shadow-2xl shadow-zinc-200/50 hover:shadow-zinc-300/50 transition-all duration-500 bg-white">
                      <div className="p-8 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xl shadow-zinc-900/20 transform group-hover:scale-110 transition-transform duration-500">
                            {shipment.carrier.toLowerCase().includes('dhl') ? <Plane className="w-8 h-8" /> : <Ship className="w-8 h-8" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-black text-xl tracking-tight text-zinc-900">{shipment.tracking_number}</h4>
                              <StatusBadge status={shipment.status} />
                            </div>
                            <p className="text-sm font-bold text-zinc-400 mt-1 uppercase tracking-widest">{shipment.carrier} • {shipment.items?.length || 0} Orders</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Est. Delivery</p>
                            <p className="font-black text-zinc-900">{new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6" onClick={() => onTrackDetails(shipment)}>
                            Track Details
                            <ChevronRight className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-8 bg-zinc-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-16 flex-1">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                              <Warehouse className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1.5">Origin</p>
                              <p className="text-sm font-black text-zinc-900">{shipment.origin}</p>
                            </div>
                          </div>
                          
                          <div className="flex-1 h-px border-t border-dashed border-zinc-200 relative">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-zinc-100 shadow-sm">
                              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1.5">Destination</p>
                              <p className="text-sm font-black text-zinc-900">{shipment.destination}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-16 pl-16 border-l border-zinc-200 max-w-[300px]">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Current Status</p>
                          <p className="text-sm text-zinc-600 font-medium italic leading-relaxed">"{shipment.updates[0]?.description || 'No updates yet'}"</p>
                        </div>
                      </div>

                      {/* Linked Orders Preview */}
                      <div className="px-8 py-4 bg-white border-t border-zinc-100 flex items-center gap-4 overflow-x-auto">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest shrink-0">Orders:</p>
                        {shipment.items?.map(rfq => (
                          <div key={rfq.id} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-lg border border-zinc-100 shrink-0">
                            <p className="text-[10px] font-black text-zinc-900">#RFQ-{rfq.id.toString().padStart(4, '0')}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FinanceView({ user, invoices, analytics, viewMode, setViewMode, onUpdate, onChat }: { user: User, invoices: Invoice[], analytics: any, viewMode: 'grid' | 'table', setViewMode: (mode: 'grid' | 'table') => void, onUpdate: () => void, onChat: (id: string | number, type: 'RFQ' | 'Order' | 'Shipment' | 'Invoice') => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!analytics) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const handlePayInvoice = async (id: number) => {
    try {
      const res = await fetch(`/api/invoices/${id}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (e) {
      console.error('Failed to pay invoice');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (e) {
      console.error('Failed to update invoice status');
    }
  };

  const isAgentOrAdmin = ['shipping_agent', 'admin'].includes(user.role);
  const isAdmin = user.role === 'admin';
  
  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesType = typeFilter === 'all' || inv.type === typeFilter;
    const matchesSearch = searchTerm === '' || 
      inv.id.toString().includes(searchTerm) || 
      inv.rfq_id.toString().includes(searchTerm);
    return matchesStatus && matchesType && matchesSearch;
  });

  const offerFees = filteredInvoices.filter(inv => ['sourcing_fee', 'shipping_fee', 'receipt'].includes(inv.type));
  const productPayments = filteredInvoices.filter(inv => inv.type === 'product_payment');

  const renderInvoiceList = (list: Invoice[], title?: string) => (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h3 className="text-lg font-black text-zinc-900 uppercase tracking-wider">{title}</h3>
        </div>
      )}
      
      {viewMode === 'table' ? (
        <Card className="border-none shadow-2xl shadow-zinc-200/50 overflow-hidden rounded-[2rem]">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100">
              <tr>
                <th className="px-8 py-5">Invoice ID</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Due Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-zinc-400 font-medium">No invoices found</td>
                </tr>
              ) : list.map(invoice => (
                <tr key={invoice.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-mono text-xs font-black text-zinc-900">INV-{invoice.id.toString().padStart(5, '0')}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">RFQ #{invoice.rfq_id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-zinc-900 capitalize">{invoice.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-zinc-900">${invoice.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{invoice.currency}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-zinc-900">{new Date(invoice.due_date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-100" onClick={() => onChat(`INV-${invoice.id.toString().padStart(5, '0')}`, 'Invoice')}><MessageSquare className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-100"><Eye className="w-4 h-4" /></Button>
                      {invoice.status === 'pending' && user.role === 'customer' && (
                        <Button 
                          size="sm" 
                          className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4"
                          onClick={() => handlePayInvoice(invoice.id)}
                        >
                          Pay Now
                        </Button>
                      )}
                      {isAdmin && invoice.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50 h-8 w-8 p-0"
                            onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                            title="Mark as Paid"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                            onClick={() => handleUpdateStatus(invoice.id, 'cancelled')}
                            title="Cancel Invoice"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.length === 0 ? (
            <div className="col-span-full py-10 text-center text-zinc-400 font-medium">No invoices found</div>
          ) : list.map(invoice => (
            <Card key={invoice.id} className="p-6 border border-zinc-200 bg-white shadow-xl shadow-zinc-200/10 rounded-[2rem] hover:scale-[1.02] transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                  <Receipt className="w-6 h-6" />
                </div>
                <StatusBadge status={invoice.status} />
              </div>
              <div className="space-y-1 mb-6">
                <p className="text-sm font-black text-zinc-900">INV-{invoice.id.toString().padStart(5, '0')}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">RFQ #{invoice.rfq_id} • {invoice.type.replace('_', ' ')}</p>
              </div>
              <div className="flex items-end justify-between pt-4 border-t border-zinc-100">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Amount Due</p>
                  <p className="text-xl font-black text-zinc-900">${invoice.amount.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-xl"
                    onClick={() => {
                      onChat(`INV-${invoice.id.toString().padStart(5, '0')}`, 'Invoice');
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-xl"><Eye className="w-4 h-4" /></Button>
                  {invoice.status === 'pending' && user.role === 'customer' && (
                    <Button size="sm" onClick={() => handlePayInvoice(invoice.id)}>Pay Now</Button>
                  )}
                  {isAdmin && invoice.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                      >
                        <Check className="w-4 h-4 mr-1" /> Paid
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50"
                        onClick={() => handleUpdateStatus(invoice.id, 'cancelled')}
                      >
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <div className="h-8 w-px bg-zinc-200 hidden md:block" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search Invoice or RFQ ID..."
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-2xl">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'pending' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setStatusFilter('paid')}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'paid' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Paid
            </button>
          </div>
          
          <select 
            className="bg-white border border-zinc-200 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="sourcing_fee">Sourcing Fee</option>
            <option value="shipping_fee">Shipping Fee</option>
            <option value="product_payment">Product Payment</option>
            <option value="receipt">Receipt</option>
          </select>

          <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-6 h-10 border-zinc-200 shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={isAdmin ? "Platform Volume" : "Total Spend"} value={`$${(analytics.totalSpend / 1000).toFixed(1)}k`} icon={<CreditCard className="w-5 h-5" />} />
        <StatCard label="Pending Payments" value={`$${analytics.pendingPayments.toLocaleString()}`} icon={<Clock className="w-5 h-5" />} color="secondary" />
        <StatCard label="Total Invoices" value={analytics.invoiceCount.toString()} icon={<Receipt className="w-5 h-5" />} color="blue" />
        {isAdmin && (
          <StatCard label="Platform Revenue" value={`$${(analytics.totalSpend * 0.05 / 1000).toFixed(1)}k`} icon={<Zap className="w-5 h-5" />} color="green" trend="5% commission" />
        )}
      </div>

      {/* Detailed Invoices Table */}
      <div className="space-y-12">
        {isAgentOrAdmin ? (
          <>
            {renderInvoiceList(offerFees, "Offer Fees (Receipts & Invoices)")}
            {renderInvoiceList(productPayments, "Product Sourcing Payments")}
          </>
        ) : (
          renderInvoiceList(filteredInvoices)
        )}
      </div>
    </div>
  );
}

function AnalyticsView({ analytics }: { analytics: any }) {
  if (!analytics) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-12 border-zinc-200 shadow-sm">
            <TrendingUp className="w-4 h-4 mr-2" /> Performance Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Spend" value={`$${(analytics.totalSpend / 1000).toFixed(1)}k`} icon={<CreditCard className="w-5 h-5" />} trend="+12% vs last month" />
        <StatCard label="Total Savings" value={`$${(analytics.savings / 1000).toFixed(1)}k`} icon={<Zap className="w-5 h-5" />} color="green" trend="15% efficiency" />
        <StatCard label="Avg. RFQ Value" value={`$${(analytics.totalSpend / (analytics.invoiceCount || 1)).toLocaleString()}`} icon={<BarChart3 className="w-5 h-5" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Chart */}
        <Card className="lg:col-span-2 p-10 border-none shadow-2xl shadow-zinc-200/50">
          <div className="flex items-center justify-between mb-10">
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-900">Monthly</button>
              <button className="px-4 py-1.5 hover:bg-zinc-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400">Quarterly</button>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlySpend}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6321" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF6321" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#A1A1AA' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#A1A1AA' }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 900, color: '#18181B' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#FF6321" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSpend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Efficiency Card */}
        <Card className="p-10 border-none shadow-2xl shadow-zinc-200/50 bg-zinc-900 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Your sourcing operations have achieved a 15% cost reduction compared to market averages this quarter.
            </p>
          </div>
          
          <div className="space-y-6 mt-10">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <span>Budget Utilization</span>
                <span>84%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[84%] rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <span>Time to Source</span>
                <span>-12%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[65%] rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const LOCATION_COORDS: Record<string, [number, number]> = {
  'China': [104.1954, 35.8617],
  'Shenzhen': [114.0579, 22.5431],
  'Guangzhou': [113.2644, 23.1291],
  'Shanghai': [121.4737, 31.2304],
  'Ningbo': [121.5440, 29.8683],
  'Hong Kong': [114.1694, 22.3193],
  'USA': [-95.7129, 37.0902],
  'New York': [-74.0060, 40.7128],
  'Los Angeles': [-118.2437, 34.0522],
  'France': [2.2137, 46.2276],
  'Paris': [2.3522, 48.8566],
  'Marseille': [5.3698, 43.2965],
  'Vietnam': [108.2772, 14.0583],
  'India': [78.9629, 20.5937],
  'Germany': [10.4515, 51.1657],
  'UK': [-3.4360, 55.3781],
  'London': [-0.1276, 51.5074],
  'Singapore': [103.8198, 1.3521],
  'Dubai': [55.2708, 25.2048],
  'Casablanca': [-7.5898, 33.5731],
  'Abidjan': [-4.0083, 5.3600],
  'Valencia': [-0.3763, 39.4699],
};

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

function ShipmentMap({ origin, destination, currentLoc, rfqs = [] }: { origin: string, destination: string, currentLoc: string, rfqs?: RFQ[] }) {
  const [activeRfqId, setActiveRfqId] = React.useState<number | null>(null);
  const originCoord = LOCATION_COORDS[origin] || LOCATION_COORDS['China'];
  const destCoord = LOCATION_COORDS[destination] || LOCATION_COORDS['France'];
  const currentCoord = LOCATION_COORDS[currentLoc] || originCoord;

  return (
    <div className="w-full h-full bg-zinc-50 rounded-[2rem] overflow-hidden relative">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#E4E4E7"
                stroke="#FFFFFF"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#D4D4D8" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        
        {/* Route Line */}
        <MapLine
          from={originCoord}
          to={destCoord}
          stroke="#FF6321"
          strokeWidth={2}
          strokeDasharray="4 4"
        />

        {/* Origin */}
        <Marker coordinates={originCoord}>
          <circle r={4} fill="#18181B" />
          <text textAnchor="middle" y={-10} className="text-[8px] font-black fill-zinc-900 uppercase tracking-widest">{origin}</text>
        </Marker>

        {/* Destination */}
        <Marker coordinates={destCoord}>
          <circle r={4} fill="#18181B" />
          <text textAnchor="middle" y={-10} className="text-[8px] font-black fill-zinc-900 uppercase tracking-widest">{destination}</text>
        </Marker>

        {/* RFQ Markers */}
        {rfqs.map((rfq) => {
          const rfqCoord = LOCATION_COORDS[rfq.origin_country] || originCoord;
          return (
            <Marker 
              key={rfq.id} 
              coordinates={rfqCoord}
              onClick={() => setActiveRfqId(activeRfqId === rfq.id ? null : rfq.id)}
            >
              <motion.g
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer"
              >
                <circle r={6} fill="#18181B" stroke="#FFFFFF" strokeWidth={2} />
                <Package className="w-3 h-3 text-white -translate-x-1.5 -translate-y-1.5" />
              </motion.g>
              {activeRfqId === rfq.id && (
                <Annotation
                  subject={rfqCoord}
                  dx={20}
                  dy={-20}
                  connectorProps={{
                    stroke: "#18181B",
                    strokeWidth: 1,
                    strokeLinecap: "round"
                  }}
                >
                  <g className="filter drop-shadow-lg">
                    <rect 
                      x="0" 
                      y="-15" 
                      width="120" 
                      height="75" 
                      rx="8" 
                      fill="white" 
                      stroke="#18181B" 
                      strokeWidth="0.5" 
                    />
                    <text 
                      x="10" 
                      y="0" 
                      className="text-[8px] font-black fill-zinc-900 uppercase tracking-widest"
                    >
                      RFQ-{rfq.id.toString().padStart(4, '0')}
                    </text>
                    <text 
                      x="10" 
                      y="10" 
                      className="text-[6px] font-bold fill-primary uppercase tracking-widest"
                    >
                      Status: {rfq.status}
                    </text>
                    <text 
                      x="10" 
                      y="20" 
                      className="text-[6px] font-medium fill-zinc-500 uppercase tracking-widest"
                    >
                      From: {rfq.origin_country}
                    </text>
                    <text 
                      x="10" 
                      y="30" 
                      className="text-[6px] font-medium fill-zinc-500 uppercase tracking-widest"
                    >
                      To: {rfq.destination_country}
                    </text>
                    <text 
                      x="10" 
                      y="42" 
                      className="text-[6px] font-black fill-zinc-900 uppercase tracking-widest"
                    >
                      {rfq.products?.[0]?.name ? (rfq.products[0].name.length > 20 ? rfq.products[0].name.substring(0, 17) + '...' : rfq.products[0].name) : 'N/A'}
                    </text>
                    <text 
                      x="10" 
                      y="52" 
                      className="text-[6px] font-medium fill-zinc-500 uppercase tracking-widest"
                    >
                      Qty: {rfq.products?.[0]?.quantity} {rfq.products?.[0]?.unit}
                    </text>
                  </g>
                </Annotation>
              )}
            </Marker>
          );
        })}

        {/* Current Location */}
        <Marker coordinates={currentCoord}>
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <circle r={8} fill="#FF6321" fillOpacity={0.3} />
            <circle r={4} fill="#FF6321" />
          </motion.g>
          <Annotation
            subject={currentCoord}
            dx={-20}
            dy={-20}
            connectorProps={{
              stroke: "#FF6321",
              strokeWidth: 1,
              strokeLinecap: "round"
            }}
          >
            <text x="-8" textAnchor="end" alignmentBaseline="middle" className="text-[10px] font-black fill-primary uppercase tracking-widest">
              Current: {currentLoc}
            </text>
          </Annotation>
        </Marker>
      </ComposableMap>
      
      <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Live Tracking Active</p>
        </div>
      </div>
    </div>
  );
}

function ShipmentDetails({ user, shipment, onBack, onChat }: { user: User, shipment: Shipment, onBack: () => void, onChat?: (id: string | number, type: 'RFQ' | 'Order' | 'Shipment' | 'Invoice') => void }) {
  const currentLoc = shipment.updates[0]?.location || shipment.origin;

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        {user?.role === 'customer' ? 'Back to Orders' : 'Back to Shipments'}
      </button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-white shadow-2xl shadow-zinc-900/20">
            {shipment.carrier.toLowerCase().includes('dhl') ? <Plane className="w-10 h-10" /> : <Ship className="w-10 h-10" />}
          </div>
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-black tracking-tight text-zinc-900">{shipment.tracking_number}</h2>
              <StatusBadge status={shipment.status} />
            </div>
            <p className="text-zinc-500 font-bold mt-1 uppercase tracking-widest">{shipment.carrier} • {shipment.items?.length || 0} Orders</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-12 border-zinc-200 shadow-sm"
            onClick={() => onChat?.(shipment.tracking_number, 'Shipment')}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> 
            Chat with Agent
          </Button>
          <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-12 border-zinc-200 shadow-sm"><Download className="w-4 h-4 mr-2" /> Shipping Docs</Button>
          <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-12 border-zinc-200 shadow-sm"><FileSignature className="w-4 h-4 mr-2" /> Customs Form</Button>
        </div>
      </div>

      {/* Linked Orders Section */}
      <div className="space-y-4">
        <h3 className="font-black text-2xl tracking-tight text-zinc-900">Linked Orders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shipment.items?.map(rfq => (
            <Card key={rfq.id} className="p-4 bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center overflow-hidden border border-zinc-100">
                  {rfq.products?.[0]?.photo_urls?.[0] ? (
                    <img src={rfq.products[0].photo_urls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Package className="w-6 h-6 text-zinc-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900">Order #RFQ-{rfq.id.toString().padStart(4, '0')}</p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5 truncate max-w-[150px]">
                    {rfq.products?.[0]?.name || 'Multiple Products'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Integration */}
      <div className="h-[400px] w-full">
        <ShipmentMap origin={shipment.origin} destination={shipment.destination} currentLoc={currentLoc} rfqs={shipment.items} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-10 bg-white border-none shadow-2xl shadow-zinc-200/50 overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-2xl tracking-tight text-zinc-900">
                {user?.role === 'customer' ? 'Order Route' : 'Shipment Route'}
              </h3>
              <div className="px-4 py-1.5 bg-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {shipment.carrier} Logistics
              </div>
            </div>
            <div className="flex items-center justify-between relative px-6">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px border-t border-dashed border-zinc-200 -z-0"></div>
              <RoutePoint label="Origin" value={shipment.origin} icon={<Warehouse className="w-6 h-6" />} />
              <div className="bg-white p-2 z-10">
                <div className="w-16 h-16 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-white shadow-2xl shadow-zinc-900/40 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  {shipment.carrier.toLowerCase().includes('dhl') ? <Plane className="w-8 h-8" /> : <Ship className="w-8 h-8" />}
                </div>
              </div>
              <RoutePoint label="Destination" value={shipment.destination} icon={<MapPin className="w-6 h-6" />} align="end" />
            </div>
          </Card>

          <Card className="p-10 bg-white border-none shadow-2xl shadow-zinc-200/50 overflow-hidden">
            <h3 className="font-black text-2xl tracking-tight text-zinc-900 mb-10">Tracking History</h3>
            <div className="space-y-0 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-zinc-100"></div>
              {shipment.updates.map((update, i) => (
                <div key={i} className="flex gap-8 pb-12 last:pb-0 relative">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all duration-300",
                    i === 0 ? "bg-zinc-900 text-white scale-110 shadow-lg shadow-zinc-900/20" : "bg-white border border-zinc-200 text-zinc-400"
                  )}>
                    {i === 0 ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={cn("font-black text-lg tracking-tight", i === 0 ? "text-zinc-900" : "text-zinc-500")}>{update.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{update.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-xs font-black text-zinc-900">{new Date(update.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-4">Origin Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">Port/Airport</span>
                  <span className="text-sm font-bold">{shipment.origin.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">Departure Date</span>
                  <span className="text-sm font-bold">Mar 10, 2026</span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-4">Destination Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">Port/Airport</span>
                  <span className="text-sm font-bold">{shipment.destination.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">Est. Arrival</span>
                  <span className="text-sm font-bold">{new Date(shipment.estimated_delivery).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Total Distance</p>
                <p className="text-xl font-bold">12,450 km</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Time in Transit</p>
                <p className="text-xl font-bold">3 Days</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Container ID</p>
                <p className="text-xl font-bold">MSKU-992831</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900 text-white">
            <h3 className="font-bold mb-4">Contact Carrier</h3>
            <p className="text-sm text-white/60 mb-6">Need to update delivery instructions or report an issue?</p>
            <Button variant="secondary" className="w-full">Contact Support</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Create Shipment Form ---

function CreateShipmentForm({ user, rfqs, onCancel, onSuccess }: { user: User, rfqs: RFQ[], onCancel: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [selectedRfqIds, setSelectedRfqIds] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (selectedRfqIds.length === 0) {
      alert('Please select at least one order');
      return;
    }

    const data = {
      rfq_ids: selectedRfqIds,
      tracking_number: formData.get('tracking_number'),
      carrier: formData.get('carrier'),
      origin: `${formData.get('origin_city')}, ${formData.get('origin_country')}`,
      destination: `${formData.get('destination_city')}, ${formData.get('destination_country')}`,
      estimated_delivery: formData.get('estimated_delivery'),
      transport_mode: formData.get('transport_mode'),
      packing_details: formData.get('packing_details'),
      total_value: Number(formData.get('total_value')),
      shipping_line: formData.get('shipping_line'),
      booking_number: formData.get('booking_number'),
      bl_number: formData.get('bl_number'),
      free_time: formData.get('free_time'),
      cut_off: formData.get('cut_off'),
      etd: formData.get('etd'),
      eta: formData.get('eta'),
      transit_time: formData.get('transit_time'),
      delivery_date: formData.get('delivery_date'),
    };

    setLoading(true);
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        alert(err.error || `Failed to create ${user.role === 'customer' ? 'order' : 'shipment'}`);
      }
    } catch (e) {
      alert(`Failed to create ${user.role === 'customer' ? 'order' : 'shipment'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleRfq = (id: number) => {
    setSelectedRfqIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{user.role === 'customer' ? 'Create New Order' : 'Create New Shipment'}</h2>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Orders (RFQs)</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-zinc-100 rounded-xl bg-zinc-50/50">
              {rfqs.length === 0 ? (
                <p className="text-xs text-zinc-400 p-4 text-center italic">No ordered RFQs available for {user.role === 'customer' ? 'order' : 'shipment'}.</p>
              ) : (
                rfqs.map(rfq => (
                  <div 
                    key={rfq.id} 
                    onClick={() => toggleRfq(rfq.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                      selectedRfqIds.includes(rfq.id) 
                        ? "bg-primary/5 border-primary text-primary shadow-sm" 
                        : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                        selectedRfqIds.includes(rfq.id) ? "bg-primary border-primary" : "bg-white border-zinc-200"
                      )}>
                        {selectedRfqIds.includes(rfq.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-black">#RFQ-{rfq.id.toString().padStart(4, '0')}</p>
                        <p className="text-[10px] font-medium opacity-70 truncate max-w-[300px]">{rfq.products[0]?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest">{rfq.origin_country} → {rfq.destination_country}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tracking Number</label>
              <Input name="tracking_number" placeholder="e.g. GS-1234-X5" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Carrier</label>
              <Input name="carrier" placeholder="e.g. Maersk, DHL" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Mode</label>
              <select 
                name="transport_mode" 
                className="w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                required
              >
                <option value="sea">Sea Freight</option>
                <option value="air">Air Freight</option>
                <option value="land">Land Freight</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Packing Details</label>
              <Input name="packing_details" placeholder="e.g. 20ft Container, 15 Pallets" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Value</label>
              <Input name="total_value" type="number" placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Shipping Line</label>
              <Input name="shipping_line" placeholder="e.g. MSC, COSCO" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Booking Number</label>
              <Input name="booking_number" placeholder="Booking #" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">BL Number</label>
              <Input name="bl_number" placeholder="B/L #" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Free Time</label>
              <Input name="free_time" placeholder="e.g. 14 Days" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cut-Off Date</label>
              <Input name="cut_off" type="date" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">ETD</label>
              <Input name="etd" type="date" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ETA</label>
              <Input name="eta" type="date" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transit Time</label>
              <Input name="transit_time" placeholder="e.g. 25 Days" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Date</label>
              <Input name="delivery_date" type="date" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Origin</label>
              <div className="flex gap-2">
                <Input name="origin_city" placeholder="City" className="flex-1" required />
                <select 
                  name="origin_country" 
                  className="flex-1 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                >
                  <option value="">Country...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <div className="flex gap-2">
                <Input name="destination_city" placeholder="City" className="flex-1" required />
                <select 
                  name="destination_country" 
                  className="flex-1 h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  required
                >
                  <option value="">Country...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estimated Delivery Date</label>
            <Input name="estimated_delivery" type="date" required />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="submit" className="flex-1" disabled={loading || selectedRfqIds.length === 0}>
              {loading ? 'Creating...' : (user.role === 'customer' ? 'Create Order' : 'Create Shipment')}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          </div>
          {rfqs.length === 0 && (
            <p className="text-xs text-red-500 text-center">No orders are currently ready for shipping.</p>
          )}
        </form>
      </Card>
    </div>
  );
}
