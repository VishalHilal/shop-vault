import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useSessionTimer } from '../hooks/useSessionTimer.js';
import { Package, ShoppingCart, Clock, TrendingUp, ArrowRight, Star } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sublabel, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-slide-up hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{value}</p>
      <p className="text-sm font-semibold text-gray-300">{label}</p>
      {sublabel && <p className="text-xs text-gray-500 mt-2">{sublabel}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, session, refreshSession } = useAuth();
  const { items, totalItems, totalPrice } = useCart();
  const { timeLeft, isExpiringSoon } = useSessionTimer(session);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-4">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/30 via-orange-700/20 to-gray-900/40 border border-orange-500/20 p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 80% 50%, rgba(249,115,22,0.18) 0%, transparent 70%),
                          radial-gradient(circle at 20% 80%, rgba(249,115,22,0.08) 0%, transparent 40%)`
        }} />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-orange-400 text-sm font-semibold font-mono mb-3 uppercase tracking-widest">{greeting}</p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{firstName}</h2>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              Welcome to your ShopVault dashboard. Discover new products and manage your cart.
            </p>
            <Link to="/products" className="inline-flex items-center gap-3 mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300">
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="w-28 h-28 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-3xl flex items-center justify-center border border-orange-500/30 shadow-2xl">
              <TrendingUp size={48} className="text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Cart Items"
          value={totalItems}
          sublabel={totalItems === 1 ? '1 product' : `${totalItems} products`}
          color="bg-orange-500/15 text-orange-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Cart Total"
          value={`$${totalPrice.toFixed(2)}`}
          sublabel="Current session"
          color="bg-green-500/15 text-green-400"
        />
        <StatCard
          icon={Package}
          label="Unique Items"
          value={items.length}
          sublabel="Product types"
          color="bg-blue-500/15 text-blue-400"
        />
        <StatCard
          icon={Clock}
          label="Session"
          value={timeLeft}
          sublabel={isExpiringSoon ? '⚠️ Expiring soon!' : 'Time remaining'}
          color={isExpiringSoon ? "bg-red-500/15 text-red-400" : "bg-purple-500/15 text-purple-400"}
        />
      </div>

      {/* Session expiry warning */}
      {isExpiringSoon && (
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 flex items-center justify-between animate-fade-in shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <Clock size={20} className="text-red-400 animate-pulse" />
            </div>
            <p className="text-red-300 text-base font-medium">Your session is expiring soon. Extend it to stay logged in.</p>
          </div>
          <button onClick={refreshSession} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
            Extend Session
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              to: '/products',
              icon: Package,
              title: 'Browse Products',
              desc: 'Explore our full catalog',
              color: 'from-orange-600/20 to-orange-900/5'
            },
            {
              to: '/cart',
              icon: ShoppingCart,
              title: 'View Cart',
              desc: `${totalItems} items ready`,
              color: 'from-blue-600/20 to-blue-900/5'
            },
            {
              to: '/profile',
              icon: Star,
              title: 'Edit Profile',
              desc: 'Update your info',
              color: 'from-purple-600/20 to-purple-900/5'
            },
          ].map(({ to, icon: Icon, title, desc, color }) => (
            <Link
              key={to}
              to={to}
              className={`bg-white/5 backdrop-blur-xl border border-white/10 bg-gradient-to-br ${color} p-6 hover:scale-[1.02] transition-all duration-300 group rounded-2xl shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-colors shadow-lg">
                  <Icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{title}</p>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cart preview */}
      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Cart Preview</h3>
            <Link to="/cart" className="text-orange-400 text-base hover:text-orange-300 flex items-center gap-2 font-semibold transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex gap-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <img src={item.thumbnail || item.images?.[0]} alt={item.title} className="w-20 h-20 object-cover rounded-2xl bg-gray-800 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-base truncate mb-2">{item.title}</p>
                  <p className="text-orange-400 text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}