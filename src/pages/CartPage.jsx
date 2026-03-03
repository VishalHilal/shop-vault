import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import CheckoutModal from '../components/CheckoutModal.jsx';

export default function CartPage() {
  const { items, removeItem, increaseQty, decreaseQty, clearCart, totalItems, totalPrice } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleRemove = (item) => {
    removeItem(item.id);
    toast.success(`Removed ${item.title.substring(0, 20)}...`);
  };

  const handleClear = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in p-4">
        <div className="w-28 h-28 bg-gray-800/50 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
          <ShoppingBag size={48} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Your cart is empty</h2>
        <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
          Looks like you haven't added anything yet. Start browsing our products!
        </p>
        <Link to="/products" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-3">
          Browse Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const tax = totalPrice * 0.08;
  const shipping = totalPrice > 50 ? 0 : 9.99;
  const grand = totalPrice + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Your Cart <span className="text-gray-400 font-normal text-xl lg:text-2xl">({totalItems} items)</span></h2>
        <button onClick={handleClear} className="text-red-400 hover:text-red-300 text-base flex items-center gap-2 px-4 py-2 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl transition-all duration-300">
          <Trash2 size={18} /> Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex gap-4 animate-slide-up hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-800">
                <img
                  src={item.thumbnail || item.images?.[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/96x96/1a1a26/888?text=${encodeURIComponent(item.title?.substring(0,5))}`;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-base leading-tight mb-2 truncate">{item.title}</p>
                    <p className="text-sm text-gray-500 font-mono capitalize">{item.category}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 p-2 rounded-xl hover:bg-red-500/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Qty control */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-xl bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-base font-mono">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-orange-400">${(item.price * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24 shadow-xl">
            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Order Summary</h3>

            <div className="space-y-4 text-base">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-white font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (8%)</span>
                <span className="text-white font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-400 font-semibold' : 'text-white font-semibold'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-sm text-green-400 font-medium">🎉 You qualify for free shipping!</p>
              )}
              {shipping > 0 && (
                <p className="text-sm text-gray-500">Add ${(50 - totalPrice).toFixed(2)} more for free shipping</p>
              )}
            </div>

            <div className="border-t border-white/10 my-6 pt-6">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-orange-400">${grand.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Checkout <ArrowRight size={18} />
            </button>
            <Link to="/products" className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-colors duration-300 flex items-center justify-center gap-3 mt-4">
              Continue Shopping
            </Link>

            <p className="text-center text-gray-500 text-sm mt-6">
              🔒 Secure checkout with multiple payment options
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        totalAmount={grand}
      />
    </div>
  );
}
