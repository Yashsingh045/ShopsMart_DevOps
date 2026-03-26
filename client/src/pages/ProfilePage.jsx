import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Shield, ShoppingBag, Heart, DollarSign, LogOut, Loader2, Edit3, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setProfileData(response.data);
        setNewName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch profile stats');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    try {
      await api.put('/users/profile', { name: newName });
      setProfileData({ ...profileData, name: newName });
      setEditing(false);
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null; // Handled by App routing normally

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: User Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-black mb-6 shadow-inner uppercase">
                {user.name.charAt(0)}
              </div>
              
              {!editing ? (
                <div className="text-center w-full">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">{profileData?.name || user.name}</h2>
                    <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-primary-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-500 text-sm mb-6 flex items-center justify-center gap-1">
                    <Mail className="w-3 h-3" /> {user.email}
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-3 mb-6">
                  <input 
                    type="text" 
                    className="input-field text-center font-bold"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} className="flex-grow btn-primary py-2 text-sm flex items-center justify-center gap-1">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="w-full space-y-2">
                <button 
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all rounded-2xl group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-primary-500" />
                    <span className="font-semibold text-slate-700">Orders</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-[10px] flex items-center justify-center font-black">
                    {profileData?.stats?.totalOrders || 0}
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/wishlist')}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all rounded-2xl group"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="font-semibold text-slate-700">Wishlist</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 text-[10px] flex items-center justify-center font-black">
                    {profileData?.stats?.wishlistItems || 0}
                  </div>
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-8 flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors py-4 border-t border-slate-50 w-full justify-center"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Right: Stats Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Performance Snapshot</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-3xl border border-slate-100">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Lifetime Spend</p>
                  <h3 className="text-3xl font-black text-slate-900">
                    ${profileData?.stats?.totalSpent?.toFixed(2) || '0.00'}
                  </h3>
                  <p className="text-green-500 text-xs font-bold mt-4 flex items-center gap-1">
                    Delivered Orders Only
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                >
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Account Standing</p>
                  <h3 className="text-3xl font-black text-slate-900">Verified</h3>
                  <p className="text-slate-400 text-xs font-bold mt-4">
                    Member since {new Date().getFullYear()}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Account Settings Placeholder */}
            <div className="mt-8 bg-slate-900 rounded-3xl p-10 relative overflow-hidden flex items-center justify-between">
              <div className="relative z-10 text-white max-w-sm">
                <h4 className="text-xl font-bold mb-2">Upgrade to Platinum</h4>
                <p className="text-slate-400 text-sm">Unlock limitless express delivery and exclusive curated drops.</p>
              </div>
              <button className="relative z-10 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-500 transition-all active:scale-95 shadow-xl shadow-primary-950/20">
                Upgrade Now
              </button>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-600 rounded-full blur-[80px] opacity-30"></div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
