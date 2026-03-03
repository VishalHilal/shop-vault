import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContent.jsx';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import {
  ShoppingBag, LayoutDashboard, Package, ShoppingCart,
  User, LogOut, Sun, Moon, Clock, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, session, logout } = useAuth();
  const { totalItems } = useCart();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const { timeLeft, isExpiringSoon } = useSessionTimer(session);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: totalItems },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-40
        flex flex-col transition-transform duration-300 shadow-2xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">ShopVault</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'U')}`}
                alt="avatar"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-500/30"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-base truncate">{user?.name}</p>
              <p className="text-gray-500 text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Session timer */}
        <div className={`mx-5 mt-5 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-mono backdrop-blur-xl border
          ${isExpiringSoon ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
          <Clock size={16} className={isExpiringSoon ? 'text-red-400 animate-pulse' : 'text-gray-500'} />
          <span>Session: <span className={`font-bold ${isExpiringSoon ? 'text-red-300' : 'text-white'}`}>{timeLeft}</span></span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-5 space-y-2 mt-3 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              <span  className="font-semibold text-sm leading-snug flex-1 line-clamp-2">{label}</span>
              {badge > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-5 border-t border-white/10 space-y-3">
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left font-semibold text-sm leading-snug flex-1 line-clamp-2"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left font-semibold text-sm leading-snug flex-1 line-clamp-2"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
