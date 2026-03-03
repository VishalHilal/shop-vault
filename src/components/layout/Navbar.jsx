import { Menu, ShoppingCart, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/cart': 'Cart',
  '/profile': 'Profile',
};

export default function Navbar({ onMenuClick }) {
  const { totalItems } = useCart();
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'ShopVault';

  return (
    <header className="h-20 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 group">
          <ShoppingCart size={22} className="group-hover:scale-110 transition-transform duration-300" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center animate-pulse">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
