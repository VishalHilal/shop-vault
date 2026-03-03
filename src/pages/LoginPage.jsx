import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, ShoppingBag, Mail, Lock, ArrowRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.email.toLowerCase(), form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-gray-800/50 to-gray-900" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 60% 40%, rgba(249,115,22,0.15) 0%, transparent 70%),
                          radial-gradient(circle at 20% 80%, rgba(249,115,22,0.08) 0%, transparent 50%)`
        }} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <ShoppingBag size={24} className="text-white" />
            </div>
            {/* <span className="text-2xl font-bold" style={{ color: 'white !important', background: 'none !important', WebkitBackgroundClip: 'unset !important', backgroundClip: 'unset !important' }}>ShopVault</span> */}
             <span className="text-3xl font-black leading-tight" style={{ color: 'white !important' }}>ShopVault</span>

          </div>
          <h1 className="text-6xl font-black leading-tight mb-6" style={{ color: 'white !important' }}>
            Your personal<br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">shopping hub</span>
          </h1>
          <p  className="text-xl max-w-sm font-black leading-relaxed mb-8" style={{ color: 'white !important' }}>
            Browse thousands of products, manage your cart, and track your profile — all in one beautiful dashboard.
          </p>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 inline-flex items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center">
              <Clock size={20} className="text-orange-400" />
            </div>
            <div>
              <p className="text-base font-semibold" style={{ color: 'white !important' }}>5-minute sessions</p>
              <p className="text-sm text-gray-400">Auto-logout keeps your account safe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-3xl" />
        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag size={18} className="text-white" />
            </div>
            {/* <span className="text-xl font-bold" style={{ color: 'white !important', background: 'none !important', WebkitBackgroundClip: 'unset !important', backgroundClip: 'unset !important' }}>ShopVault</span> */}
            <span className="text-xl font-bold" style={{ color: 'white !important', background: 'none !important', WebkitBackgroundClip: 'unset !important', backgroundClip: 'unset !important' }}>ShopVault</span>


          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold mb-2" style={{ color: 'white !important', background: 'none !important', WebkitBackgroundClip: 'unset !important', backgroundClip: 'unset !important' }}>Welcome back</h2>
            <p className="text-gray-400 mb-8 text-lg">Sign in to your account to continue</p>

            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 mb-6 text-red-400 text-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Your password"
                    className="w-full pl-12 pr-14 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-3 mt-6">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Don't have an account?{' '}
            <Link to="/register"  className="font-black leading-tight p-4" style={{ color: 'white !important' }}>Create one</Link>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <p className="text-xs text-gray-500 text-center mb-3 font-mono uppercase tracking-wider">Demo</p>
            <p className="text-sm text-gray-300 text-center">Register an account above, then log in with those credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
