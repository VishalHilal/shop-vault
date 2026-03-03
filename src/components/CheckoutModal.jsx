import { useState } from 'react';
import { X, ShoppingBag, CreditCard, Truck, MapPin, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import toast from 'react-hot-toast';

export default function CheckoutModal({ isOpen, onClose, totalAmount }) {
  const { clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '+1 234-567-8900',
      isDefault: true
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  if (!isOpen) return null;

  const tax = totalAmount * 0.08;
  const shipping = totalAmount > 50 ? 0 : 9.99;
  const grandTotal = totalAmount + tax + shipping;

  // ================= STRIPE PAYMENT =================
  const handleStripePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select address first");
      return;
    }

    try {
      setIsProcessing(true);

      const res = await fetch("http://localhost:3001/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal })
      });

      const data = await res.json();

      if (!data.url) throw new Error("Stripe URL not found");

      // Clear cart and show success before redirect
      clearCart();
      toast.success("Redirecting to Stripe...");
      
      // Small delay to show success message
      setTimeout(() => {
        window.location.href = data.url;
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error("Stripe payment failed");
      setIsProcessing(false);
    }
  };

  // ================= COD PAYMENT =================
  const handleCODPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      toast.success("Order placed successfully!");
      onClose();
      setIsProcessing(false);
    }, 1500);
  };

  const handleAddAddress = () => {
    if (Object.values(newAddress).some(v => !v)) {
      toast.error("Fill all address fields");
      return;
    }

    setAddresses([...addresses, { id: addresses.length + 1, ...newAddress }]);
    setNewAddress({ name: '', street: '', city: '', state: '', zip: '', phone: '' });
    setShowAddAddress(false);
  };

  const selectedAddressData = addresses.find(a => a.id === selectedAddress);

  // ================= STEP 1 =================
  const renderAddressStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl text-white">Delivery Address</h3>

      {addresses.map(address => (
        <div
          key={address.id}
          onClick={() => setSelectedAddress(address.id)}
          className={`p-4 border rounded-xl cursor-pointer ${
            selectedAddress === address.id
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-white/20 bg-white/5'
          }`}
        >
          <p className="text-white font-semibold">{address.name}</p>
          <p className="text-gray-400 text-sm">{address.street}</p>
          <p className="text-gray-400 text-sm">{address.city}</p>
          {selectedAddress === address.id && <Check className="text-orange-400" />}
        </div>
      ))}

      {!showAddAddress ? (
        <button onClick={() => setShowAddAddress(true)} className="text-orange-400">
          <Plus size={16} /> Add New Address
        </button>
      ) : (
        <div className="space-y-2">
          {Object.keys(newAddress).map(key => (
            <input
              key={key}
              placeholder={key}
              value={newAddress[key]}
              onChange={e => setNewAddress({ ...newAddress, [key]: e.target.value })}
              className="w-full p-2 bg-white/10 text-white rounded"
            />
          ))}
          <button onClick={handleAddAddress} className="bg-orange-500 w-full p-2 rounded">
            Save Address
          </button>
        </div>
      )}

      <button
        disabled={!selectedAddress}
        onClick={() => setCurrentStep(2)}
        className="bg-orange-500 w-full py-3 rounded"
      >
        Continue to Payment
      </button>
    </div>
  );

  // ================= STEP 2 =================
  const renderPaymentStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl text-white">Payment Method</h3>

      {/* CARD */}
      <div
        onClick={handleStripePayment}
        className="p-4 border rounded-xl cursor-pointer border-white/20 bg-white/5 hover:bg-white/10"
      >
        <div className="flex items-center gap-2">
          <CreditCard className="text-orange-400" />
          <span className="text-white">Credit / Debit Card (Stripe)</span>
        </div>
      </div>

      {/* COD */}
      <div
        onClick={() => {
          setPaymentMethod("cod");
          setCurrentStep(3);
        }}
        className="p-4 border rounded-xl cursor-pointer border-white/20 bg-white/5 hover:bg-white/10"
      >
        <div className="flex items-center gap-2">
          <Truck className="text-orange-400" />
          <span className="text-white">Cash on Delivery</span>
        </div>
      </div>

      <button onClick={() => setCurrentStep(1)} className="bg-gray-600 w-full py-2 rounded">
        Back
      </button>
    </div>
  );

  // ================= STEP 3 (COD ONLY) =================
  const renderReviewStep = () => (
    <div className="space-y-4">
      <h3 className="text-xl text-white">Order Review</h3>

      <div className="bg-white/5 p-4 rounded">
        <MapPin className="text-orange-400" />
        <p className="text-white">{selectedAddressData?.street}</p>
      </div>

      <div className="bg-white/5 p-4 rounded">
        <p>Subtotal: ${totalAmount.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>
        <p>Shipping: ${shipping}</p>
        <p className="text-orange-400 font-bold">Total: ${grandTotal.toFixed(2)}</p>
      </div>

      <button
        onClick={handleCODPayment}
        disabled={isProcessing}
        className="bg-orange-500 w-full py-3 rounded"
      >
        {isProcessing ? "Processing..." : "Place Order (COD)"}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl">Checkout</h2>
          <X className="text-white cursor-pointer" onClick={onClose} />
        </div>

        {currentStep === 1 && renderAddressStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderReviewStep()}

      </div>
    </div>
  );
}
