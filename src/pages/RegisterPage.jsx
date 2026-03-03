import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, ShoppingBag, User, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.toLowerCase(), form.password);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((r) => ({ ...r, [k]: '' }));
  };

  const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password)
    ? 'strong' : form.password.length >= 6 ? 'medium' : form.password.length > 0 ? 'weak' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/15 via-gray-800/50 to-gray-900" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(249,115,22,0.18) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(249,115,22,0.12) 0%, transparent 40%),
          radial-gradient(circle at 70% 80%, rgba(249,115,22,0.08) 0%, transparent 30%)`
        }} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black leading-tight p-4" style={{ color: 'white !important' }}>ShopVault</span>
          </div>
          <div>
            <h1 className="text-5xl font-black leading-tight mb-6">
              Join thousands of<br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">smart shoppers</span>
            </h1>
            <p className="text-xl max-w-sm font-black leading-relaxed" style={{ color: 'white !important' }}>
              Access our curated marketplace with exclusive deals and a personalized dashboard.
            </p>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          {[
            { icon: Check, text: 'Secure & encrypted account' },
            { icon: Check, text: 'Personalized recommendations' },
            { icon: Check, text: 'Easy order management' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4" style={{ color: 'white !important' }}>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center">
                <Icon size={16} className="text-orange-400" />
              </div>
              <span className="text-base font-medium" style={{ color: 'white !important' }}>{text}</span>
            </div>
          ))}
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
            <span className="font-bold text-xl" style={{ color: 'white !important', background: 'none !important', WebkitBackgroundClip: 'unset !important', backgroundClip: 'unset !important' }}>ShopVault</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold mb-2" style={{ color: 'white !important', background: 'none !important', WebkitBackgroundClip: 'unset !important', backgroundClip: 'unset !important' }}>Create account</h2>
            <p className="text-gray-400 mb-8 text-lg">Start your shopping journey today</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="john@example.com"
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min 6 characters"
                    className={`w-full pl-12 pr-14 py-4 bg-white/5 backdrop-blur-xl border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex gap-1.5 flex-1">
                      {['weak', 'medium', 'strong'].map((s, i) => (
                        <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          strength === 'weak' && i === 0 ? 'bg-red-500' :
                          strength === 'medium' && i <= 1 ? 'bg-yellow-500' :
                          strength === 'strong' ? 'bg-green-500' : 'bg-white/10'
                        }`} />
                      ))}
                    </div>
                    <span className={`text-sm font-medium capitalize ${
                      strength === 'weak' ? 'text-red-400' : strength === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>{strength}</span>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Confirm Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={set('confirm')}
                    placeholder="Repeat password"
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border ${errors.confirm ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`}
                  />
                </div>
                {errors.confirm && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.confirm}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-3 mt-6">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-black leading-tight p-4" style={{ color: 'white !important' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
