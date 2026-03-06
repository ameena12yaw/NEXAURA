/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ShoppingCart, 
  Library, 
  LayoutDashboard, 
  Upload, 
  Search, 
  LogOut, 
  User as UserIcon,
  ChevronRight,
  FileText,
  Download,
  Plus,
  TrendingUp,
  Package,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Material, AdminStats } from './types';

// --- Components ---

const Navbar = ({ user, onLogout, cartCount, activeTab, setActiveTab }: { 
  user: User | null, 
  onLogout: () => void, 
  cartCount: number,
  activeTab: string,
  setActiveTab: (tab: string) => void
}) => (
  <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('store')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">U</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">UniStore <span className="text-indigo-600">IT</span></span>
          </div>
          {user && (
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {user.role === 'student' ? (
                <>
                  <button 
                    onClick={() => setActiveTab('store')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'store' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    Storefront
                  </button>
                  <button 
                    onClick={() => setActiveTab('library')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'library' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    My Library
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveTab('admin-dashboard')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'admin-dashboard' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setActiveTab('admin-materials')}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'admin-materials' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    Manage Materials
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'student' && (
                <button 
                  onClick={() => setActiveTab('cart')}
                  className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => setActiveTab('login')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const user = await res.json();
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
            <BookOpen size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">University Portal</h2>
          <p className="text-slate-500 mt-2">Sign in to access your course materials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">University Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="name@university.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Demo Accounts:<br/>
            Student: student@university.edu / student123<br/>
            Admin: admin@university.edu / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Storefront = ({ onAddToCart }: { onAddToCart: (m: Material) => void }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/materials').then(res => res.json()).then(setMaterials);
  }, []);

  const filtered = materials.filter(m => 
    (m.title.toLowerCase().includes(search.toLowerCase()) || m.course_code.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'All' || m.type === filter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Course Materials</h1>
          <p className="text-slate-500 mt-1">Browse and purchase digital resources for your courses</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses or titles..."
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>PDF</option>
            <option>eBook</option>
            <option>Software</option>
            <option>Notes</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((m) => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={m.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
              <FileText size={48} className="text-slate-300 group-hover:text-indigo-200 transition-colors" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-slate-100">
                {m.type}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{m.course_code}</span>
                <span className="text-lg font-bold text-slate-900">${m.price.toFixed(2)}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{m.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{m.instructor} • {m.department}</p>
              <button 
                onClick={() => onAddToCart(m)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-600 transition-all active:scale-[0.98]"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Cart = ({ items, onRemove, onCheckout }: { items: Material[], onRemove: (id: number) => void, onCheckout: () => void }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 mt-2">Browse the store to find materials for your courses.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.course_code} • {item.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${item.price.toFixed(2)}</p>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400">Subtotal ({items.length} items)</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              Complete Purchase
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Secure checkout via University Payment Gateway
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const LibraryView = ({ userId }: { userId: number }) => {
  const [library, setLibrary] = useState<Material[]>([]);

  useEffect(() => {
    fetch(`/api/library/${userId}`).then(res => res.json()).then(setLibrary);
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Digital Library</h1>
      <p className="text-slate-500 mb-10">Access all your purchased course materials and resources</p>

      {library.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Library size={48} className="mx-auto text-slate-200 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">No materials yet</h2>
          <p className="text-slate-500 mt-2">Your purchased items will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {library.map((m) => (
            <div key={m.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4 hover:border-indigo-200 transition-colors group">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                <Download size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{m.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{m.course_code} • {m.type}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Download File <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats);
  }, []);

  if (!stats) return <div className="p-8">Loading stats...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">IT Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">${stats.revenue.toFixed(2)}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Package size={24} />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">+5%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Sales</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">{stats.salesCount}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Active Students</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">1,248</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top Selling Materials</h3>
          <div className="space-y-4">
            {stats.topMaterials.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs">{i+1}</div>
                  <span className="font-medium text-slate-700">{m.title}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{m.sales} sales</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-slate-900 font-medium">New purchase: Advanced Algorithms PDF</p>
                  <p className="text-xs text-slate-500 mt-0.5">2 minutes ago • Student ID: #29402</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '', description: '', price: 0, type: 'PDF', course_code: '', department: '', instructor: ''
  });

  const fetchMaterials = () => fetch('/api/materials').then(res => res.json()).then(setMaterials);
  useEffect(() => { fetchMaterials(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMaterial)
    });
    setIsAdding(false);
    fetchMaterials();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Materials</h1>
          <p className="text-slate-500">Upload and edit course resources</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Add New Material
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{m.title}</div>
                  <div className="text-xs text-slate-500">{m.instructor}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{m.course_code}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">{m.type}</span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">${m.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Add New Resource</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">×</button>
              </div>
              <form onSubmit={handleAdd} className="p-8 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMaterial.title}
                    onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMaterial.course_code}
                    onChange={e => setNewMaterial({...newMaterial, course_code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMaterial.price}
                    onChange={e => setNewMaterial({...newMaterial, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMaterial.type}
                    onChange={e => setNewMaterial({...newMaterial, type: e.target.value})}
                  >
                    <option>PDF</option>
                    <option>eBook</option>
                    <option>Software</option>
                    <option>Notes</option>
                    <option>ZIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMaterial.department}
                    onChange={e => setNewMaterial({...newMaterial, department: e.target.value})}
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-4 mt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">Save Material</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('store');
  const [cart, setCart] = useState<Material[]>([]);

  const handleLogin = (u: User) => {
    setUser(u);
    setActiveTab(u.role === 'admin' ? 'admin-dashboard' : 'store');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('login');
    setCart([]);
  };

  const addToCart = (m: Material) => {
    setCart([...cart, m]);
    // Optional: show toast
  };

  const removeFromCart = (id: number) => {
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
      const newCart = [...cart];
      newCart.splice(idx, 1);
      setCart(newCart);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    for (const item of cart) {
      await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, materialId: item.id })
      });
    }
    setCart([]);
    setActiveTab('library');
    alert('Purchase successful! Items added to your library.');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        cartCount={cart.length} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {!user && activeTab === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Login onLogin={handleLogin} />
            </motion.div>
          )}
          
          {user && user.role === 'student' && (
            <>
              {activeTab === 'store' && (
                <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Storefront onAddToCart={addToCart} />
                </motion.div>
              )}
              {activeTab === 'cart' && (
                <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Cart items={cart} onRemove={removeFromCart} onCheckout={handleCheckout} />
                </motion.div>
              )}
              {activeTab === 'library' && (
                <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LibraryView userId={user.id} />
                </motion.div>
              )}
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              {activeTab === 'admin-dashboard' && (
                <motion.div key="admin-dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AdminDashboard />
                </motion.div>
              )}
              {activeTab === 'admin-materials' && (
                <motion.div key="admin-mats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AdminMaterials />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center text-slate-500 font-bold">U</div>
            <span className="font-bold text-slate-900">UniStore IT</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 University IT Department. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-6 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
