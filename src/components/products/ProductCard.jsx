import { useCart } from '../../context/CartContext';
import { ShoppingCart, Star, Check, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem, isInCart, increaseQty } = useCart();
  const inCart = isInCart(product.id);

  const handleAdd = () => {
    if (inCart) {
      increaseQty(product.id);
      toast.success(`Added another ${product.title.substring(0, 20)}...`);
    } else {
      addItem(product);
      toast.success('Added to cart!');
    }
  };

  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : null;

  return (
    <div className="card group flex flex-col h-full animate-slide-up">
      {/* Image */}
      <div className="relative overflow-hidden bg-dark-700 aspect-square">
        <img
          src={product.thumbnail || product.images?.[0] || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x400/1a1a26/888?text=${encodeURIComponent(product.title?.substring(0,10))}`;
          }}
        />
        {discount && (
          <div className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </div>
        )}
        {inCart && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">{product.category}</p>
        <h3 className="font-semibold text-sm leading-snug mb-2 flex-1 line-clamp-2">{product.title}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-400">{product.rating?.toFixed(1)} ({product.stock} in stock)</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-white">${product.price}</span>
            {discount && (
              <span className="text-xs text-gray-500 line-through ml-2">
                ${(product.price / (1 - discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95
              ${inCart
                ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              }`}
          >
            {inCart ? <><Plus size={14} /> Add more</> : <><ShoppingCart size={14} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
