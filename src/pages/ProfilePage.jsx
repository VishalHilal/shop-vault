import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Lock, Save, Eye, EyeOff, Calendar, Shield, Edit3, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/10 last:border-0">
      <div className="w-12 h-12 bg-gray-700/50 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-xl border border-white/5">
        <Icon size={18} className="text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-1">{label}</p>
        <p className="font-semibold text-base truncate">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password && form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const updates = { name: form.name.trim(), email: form.email.toLowerCase() };
      if (form.password) updates.password = form.password;
      await updateProfile(updates);
      toast.success('Profile updated successfully!');
      setEditing(false);
      setForm((f) => ({ ...f, password: '', confirm: '' }));
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

  const cancelEdit = () => {
    setEditing(false);
    setForm({ name: user.name, email: user.email, password: '', confirm: '' });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-4">
      {/* Header card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-xl">
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'U')}&backgroundColor=f97316&textColor=ffffff`}
                alt="Avatar"
                className="w-24 h-24 rounded-3xl object-cover border-3 border-orange-500/30 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-gray-900 shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{user?.name}</h2>
              <p className="text-gray-400 text-lg mt-1">{user?.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Shield size={16} className="text-orange-400" />
                </div>
                <span className="text-sm text-orange-400 font-semibold font-mono">Verified Account</span>
              </div>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-300 flex items-center gap-2">
              <Edit3 size={18} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Info or Edit form */}
      {!editing ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
          <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Account Information</h3>
          <InfoRow icon={User} label="Full Name" value={user?.name} />
          <InfoRow icon={Mail} label="Email Address" value={user?.email} />
          <InfoRow icon={Calendar} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'} />
          <InfoRow icon={Lock} label="Password" value="••••••••••" />
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
          <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Edit Profile</h3>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                <input type="text" value={form.name} onChange={set('name')} className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`} />
              </div>
              {errors.name && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                <input type="email" value={form.email} onChange={set('email')} className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`} />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.email}</p>}
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-sm text-gray-500 mb-4">Leave password fields blank to keep current password</p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">New Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="New password" className={`w-full pl-12 pr-14 py-3 bg-white/5 backdrop-blur-xl border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Confirm Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                    <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Confirm password" className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border ${errors.confirm ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300`} />
                  </div>
                  {errors.confirm && <p className="text-red-400 text-sm mt-2 flex items-center gap-2"><span className="w-1 h-1 bg-red-500 rounded-full" />{errors.confirm}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-3">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Save Changes</>}
              </button>
              <button type="button" onClick={cancelEdit} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-300">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Account Status', value: 'Active', color: 'text-green-400', bg: 'bg-green-500/15' },
          { label: 'Auth Method', value: 'Password', color: 'text-blue-400', bg: 'bg-blue-500/15' },
          { label: 'Session', value: '5 min', color: 'text-orange-400', bg: 'bg-orange-500/15' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-xl hover:bg-white/10 transition-all duration-300">
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Check size={20} className={color} />
            </div>
            <p className={`font-bold text-xl ${color}`}>{value}</p>
            <p className="text-sm text-gray-500 mt-2">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
