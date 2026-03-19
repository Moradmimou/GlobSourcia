import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldAlert, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Package, 
  Truck, 
  BarChart3,
  Plus,
  Lock,
  Unlock,
  Ban,
  Mail,
  Phone,
  Globe,
  Calendar,
  ChevronRight,
  Loader2,
  AlertCircle,
  Factory,
  Star,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  db, 
  auth,
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  doc, 
  getDocs,
  serverTimestamp,
  orderBy,
  OperationType,
  handleFirestoreError
} from '../firebase';
import { User, RFQ, Shipment } from '../types';
import { cn } from '../lib/utils';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  t: (key: string) => string;
  isDarkMode?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ t, isDarkMode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'suppliers' | 'agents'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    role: 'sourcing_agent' as 'sourcing_agent' | 'shipping_agent',
    password: 'Password123!' // Default password for new agents
  });

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isCreateSupplierOpen, setIsCreateSupplierOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    category: '',
    country: '',
    contactEmail: ''
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsFirebaseReady(true);
      } else {
        setIsFirebaseReady(false);
        // If we're not ready after 5 seconds, stop loading to show the UI (even if empty/error)
        const timer = setTimeout(() => {
          setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isFirebaseReady) return;

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as User));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
      setLoading(false);
    });

    const unsubRfqs = onSnapshot(collection(db, 'rfqs'), (snapshot) => {
      const rfqsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as RFQ));
      setRfqs(rfqsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'rfqs');
    });

    const unsubShipments = onSnapshot(collection(db, 'shipments'), (snapshot) => {
      const shipmentsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Shipment));
      setShipments(shipmentsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'shipments');
    });

    const unsubSuppliers = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
      const suppliersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSuppliers(suppliersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'suppliers');
    });

    return () => {
      unsubUsers();
      unsubRfqs();
      unsubShipments();
      unsubSuppliers();
    };
  }, [isFirebaseReady]);

  const handleToggleBlock = async (user: User) => {
    if (!auth.currentUser) {
      alert('You must be authenticated in Firebase to perform this action.');
      return;
    }
    try {
      const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
      await setDoc(doc(db, 'users', user.uid!), { 
        status: newStatus,
        isBlocked: newStatus === 'blocked',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleDeactivate = async (user: User) => {
    if (!auth.currentUser) {
      alert('You must be authenticated in Firebase to perform this action.');
      return;
    }
    try {
      await setDoc(doc(db, 'users', user.uid!), { 
        status: 'deactivated',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('You must be authenticated in Firebase to perform this action.');
      return;
    }
    const supplierId = `sup_${Date.now()}`;
    try {
      await setDoc(doc(db, 'suppliers', supplierId), {
        ...newSupplier,
        rating: 5.0,
        createdAt: serverTimestamp()
      });
      setIsCreateSupplierOpen(false);
      setNewSupplier({ name: '', category: '', country: '', contactEmail: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `suppliers/${supplierId}`);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('You must be authenticated in Firebase to perform this action.');
      return;
    }
    const tempUid = `agent_${Date.now()}`;
    try {
      // In a real app, we'd use a cloud function to create the auth user.
      // For this demo, we'll simulate it by adding to the users collection.
      // The agent would then need to sign up with this email or we'd provide credentials.
      await setDoc(doc(db, 'users', tempUid), {
        uid: tempUid,
        name: newAgent.name,
        email: newAgent.email,
        role: newAgent.role,
        status: 'active',
        createdAt: serverTimestamp()
      });
      setIsCreateModalOpen(false);
      setNewAgent({ name: '', email: '', role: 'sourcing_agent', password: 'Password123!' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${tempUid}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    activeRfqs: rfqs.filter(r => r.status !== 'shipped' && r.status !== 'rejected').length,
    totalRevenue: rfqs.reduce((acc, curr) => acc + (curr.total_budget || 0), 0),
    pendingShipments: shipments.filter(s => s.status !== 'delivered').length
  };

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60dvh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreateSupplierOpen(true)}
            className="px-4 py-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            <Globe className="w-4 h-4" />
            Add Supplier
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Create Agent
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
          { label: 'Active RFQs', value: stats.activeRfqs, icon: Package, color: 'orange' },
          { label: 'Total Volume', value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`, icon: TrendingUp, color: 'emerald' },
          { label: 'Shipments', value: stats.pendingShipments, icon: Truck, color: 'purple' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
              stat.color === 'blue' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500" :
              stat.color === 'orange' ? "bg-orange-50 dark:bg-orange-500/10 text-orange-500" :
              stat.color === 'emerald' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" :
              "bg-purple-50 dark:bg-purple-500/10 text-purple-500"
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 p-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'suppliers', label: 'Suppliers', icon: Globe },
            { id: 'agents', label: 'Agents', icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all",
                activeTab === tab.id ? "bg-zinc-900 dark:bg-zinc-800 text-white" : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-[2rem]">
                  <h3 className="text-lg font-black mb-6 text-zinc-900 dark:text-white">Platform Growth</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#397de2" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#397de2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#e5e5e5'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000'
                          }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#397de2" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-[2rem]">
                  <h3 className="text-lg font-black mb-6 text-zinc-900 dark:text-white">User Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Customers', value: users.filter(u => u.role === 'customer').length },
                            { name: 'Sourcing', value: users.filter(u => u.role === 'sourcing_agent').length },
                            { name: 'Shipping', value: users.filter(u => u.role === 'shipping_agent').length },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#397de2" />
                          <Cell fill="#ff751f" />
                          <Cell fill="#10b981" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-900 dark:text-white"
                  />
                </div>
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-primary/20 text-zinc-900 dark:text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="sourcing_agent">Sourcing Agents</option>
                  <option value="shipping_agent">Shipping Agents</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-zinc-100 dark:border-zinc-800">
                      <th className="pb-4 font-black text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">User</th>
                      <th className="pb-4 font-black text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Role</th>
                      <th className="pb-4 font-black text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="pb-4 font-black text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                    {filteredUsers.map((user) => (
                      <tr key={user.uid} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 dark:text-zinc-400">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                user.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            user.role === 'admin' ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600" :
                            user.role === 'customer' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600" :
                            "bg-orange-50 dark:bg-orange-500/10 text-orange-600"
                          )}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={cn(
                            "flex items-center gap-1.5 text-xs font-bold",
                            user.status === 'blocked' ? "text-red-500" : 
                            user.status === 'deactivated' ? "text-zinc-400 dark:text-zinc-500" :
                            "text-emerald-500"
                          )}>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full", 
                              user.status === 'blocked' ? "bg-red-500" : 
                              user.status === 'deactivated' ? "bg-zinc-400 dark:bg-zinc-500" :
                              "bg-emerald-500"
                            )} />
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleToggleBlock(user)}
                              className={cn(
                                "p-2 rounded-xl transition-all",
                                user.status === 'blocked' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20" : "bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20"
                              )}
                              title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                            >
                              {user.status === 'blocked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                            {user.status !== 'deactivated' && (
                              <button 
                                onClick={() => handleDeactivate(user)}
                                className="p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-all"
                                title="Deactivate"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              {suppliers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500 gap-4">
                  <Globe className="w-12 h-12 opacity-20" />
                  <p className="font-bold">No suppliers registered yet</p>
                  <button 
                    onClick={() => setIsCreateSupplierOpen(true)}
                    className="text-primary font-bold hover:underline"
                  >
                    Add your first supplier
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suppliers.map(supplier => (
                    <div key={supplier.id} className="p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                          <Factory className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold">{supplier.rating}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-zinc-900 dark:text-white">{supplier.name}</h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{supplier.category}</p>
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                          <MapPin className="w-3 h-3" />
                          {supplier.country}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                          <Mail className="w-3 h-3" />
                          {supplier.contactEmail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.filter(u => u.role === 'sourcing_agent' || u.role === 'shipping_agent').map(agent => (
                  <div key={agent.uid} className="p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center font-black text-primary">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-zinc-900 dark:text-white">{agent.name}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-black tracking-widest">{agent.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleBlock(agent)}
                        className={cn(
                          "p-2 rounded-xl transition-all",
                          agent.status === 'blocked' ? "text-emerald-500" : "text-red-500"
                        )}
                      >
                        {agent.status === 'blocked' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Agent Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
                <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Create New Agent</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                </button>
              </div>
              <form onSubmit={handleCreateAgent} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Agent Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewAgent({...newAgent, role: 'sourcing_agent'})}
                      className={cn(
                        "py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all",
                        newAgent.role === 'sourcing_agent' ? "border-primary bg-primary/5 text-primary" : "border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
                      )}
                    >
                      Sourcing
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAgent({...newAgent, role: 'shipping_agent'})}
                      className={cn(
                        "py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all",
                        newAgent.role === 'shipping_agent' ? "border-primary bg-primary/5 text-primary" : "border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
                      )}
                    >
                      Shipping
                    </button>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-zinc-900 dark:bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Supplier Modal */}
      <AnimatePresence>
        {isCreateSupplierOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
                <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Add New Supplier</h3>
                <button onClick={() => setIsCreateSupplierOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                </button>
              </div>
              <form onSubmit={handleCreateSupplier} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Supplier Name</label>
                  <input 
                    required
                    type="text"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-900 dark:text-white"
                    placeholder="Global Manufacturing Ltd"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Category</label>
                  <input 
                    required
                    type="text"
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-900 dark:text-white"
                    placeholder="Electronics, Textiles, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Country</label>
                  <input 
                    required
                    type="text"
                    value={newSupplier.country}
                    onChange={(e) => setNewSupplier({...newSupplier, country: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-900 dark:text-white"
                    placeholder="China"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Contact Email</label>
                  <input 
                    required
                    type="email"
                    value={newSupplier.contactEmail}
                    onChange={(e) => setNewSupplier({...newSupplier, contactEmail: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-zinc-900 dark:text-white"
                    placeholder="sales@supplier.com"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-zinc-900 dark:bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Add Supplier
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
