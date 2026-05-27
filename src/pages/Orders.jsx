import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, Receipt, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearOrders } from '../features/orders/ordersSlice';

function formatCurrency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.orders.orders);

  const hasOrders = orders.length > 0;

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o?.summary?.total || 0), 0);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Receipt size={20} />
              Orders
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {hasOrders ? `${orders.length} order(s) • Total spent: ${formatCurrency(totalSpent)}` : 'No orders yet.'}
            </p>
          </div>

          {hasOrders && (
            <button
              onClick={() => dispatch(clearOrders())}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-red-400 hover:text-red-500 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          )}
        </div>

        {!hasOrders ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-10 flex flex-col items-center text-center gap-4">
            <div className="p-5 bg-indigo-100 dark:bg-indigo-900/60 rounded-full">
              <Package size={44} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your orders will show up here</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Place an order from the Cart + Checkout flow, then come back to track your purchases.
            </p>
            <Link to="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Status: <span className="font-medium text-indigo-600 dark:text-indigo-400">{order.status}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(order.summary?.total)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg p-2"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-300 flex flex-col sm:flex-row sm:justify-between gap-2">
                  <span>
                    Ship to: {order.shipping?.city}, {order.shipping?.country}
                  </span>
                  <span>
                    Payment: {order.payment?.cardName} •••• {order.payment?.last4}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

