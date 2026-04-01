import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, signup } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = ({ mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isLogin ? login : signup;
    const result = await dispatch(action(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-center text-slate-500 mb-8 text-sm">
              {isLogin ? 'Enter your credentials to access your account' : 'Start your premium shopping journey today'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input-field pl-11"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input-field pl-11"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field pl-11"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100 italic">
                  * {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-base shadow-xl shadow-primary-100 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Get Started')}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
              >
                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-400 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4" />
            Secure authentication by ShopsMart
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
