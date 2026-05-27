import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../features/cart/cartSlice';
import { addOrder } from '../features/orders/ordersSlice';
import { useToast } from '../context/ToastContext';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const items = useSelector((s) => s.cart.items);
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', zip: '', country: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '' });
  const [placed, setPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal > 50 ? subtotal : subtotal + 5.99;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      addToast('Your cart is empty. Please add items first.', 'error');
      return;
    }

    setProcessing(true);
    const now = new Date();
    const cardDigits = String(payment.cardNumber || '').replace(/\D/g, '');
    const last4 = cardDigits.slice(-4);
    const orderId = `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

    const order = {
      id: orderId,
      createdAt: now.toISOString(),
      status: 'Paid',
      shipping: { ...shipping },
      payment: {
        cardName: payment.cardName,
        last4: last4 || '----',
      },
      items: items.map((i) => ({ ...i })),
      summary: {
        subtotal,
        shippingCost: subtotal > 50 ? 0 : 5.99,
        total,
      },
    };

    // Simulate payment completion, then store the order and clear cart.
    setTimeout(() => {
      dispatch(addOrder(order));
      dispatch(clearCart());
      setProcessing(false);
      setPlaced(true);
      addToast('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2500);
    }, 2000);
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 max-w-md text-center flex flex-col items-center gap-5">
          <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Placed!</h2>
          <p className="text-gray-500 dark:text-gray-400">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">Redirecting to Orders...</p>
          <Link
            to="/orders"
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors w-full"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          {[{ n: 1, label: 'Shipping', icon: MapPin }, { n: 2, label: 'Payment', icon: CreditCard }].map(({ n, label, icon: Icon }) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= n ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {n}
              </div>
              <span className={`text-sm font-medium ${step >= n ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>{label}</span>
              {n < 2 && <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-500" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', col: 'sm:col-span-2' },
                    { key: 'address', label: 'Address', placeholder: '123 Main St', col: 'sm:col-span-2' },
                    { key: 'city', label: 'City', placeholder: 'New York' },
                    { key: 'zip', label: 'ZIP Code', placeholder: '10001' },
                    { key: 'country', label: 'Country', placeholder: 'United States', col: 'sm:col-span-2' },
                  ].map(({ key, label, placeholder, col = '' }) => (
                    <div key={key} className={col}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                      <input
                        required
                        value={shipping[key]}
                        onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePlaceOrder} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <CreditCard size={18} className="text-indigo-500" /> Payment Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'cardName', label: 'Cardholder Name', placeholder: 'John Doe', col: 'sm:col-span-2' },
                    { key: 'cardNumber', label: 'Card Number', placeholder: '1234 5678 9012 3456', col: 'sm:col-span-2' },
                    { key: 'expiry', label: 'Expiry Date', placeholder: 'MM/YY' },
                    { key: 'cvv', label: 'CVV', placeholder: '123' },
                  ].map(({ key, label, placeholder, col = '' }) => (
                    <div key={key} className={col}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                      <input
                        required
                        value={payment[key]}
                        onChange={(e) => setPayment({ ...payment, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className={`flex-1 font-semibold py-3 rounded-xl transition-colors ${
                      processing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {processing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-10 h-10 object-contain bg-gray-50 dark:bg-gray-800 rounded p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
