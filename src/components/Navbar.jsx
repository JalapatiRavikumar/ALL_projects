import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Sun, Moon, Menu, X, LogOut, Store } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const wishlistCount = useSelector((s) => s.wishlist.items.length);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <Store size={24} />
            ShopZone
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Products</Link>
            {isAuthenticated && (
              <span className="text-gray-500 dark:text-gray-400">Hi, {user?.name?.split(' ')[0]}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button onClick={handleLogout} className="hidden md:flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link to="/login" className="hidden md:block text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                Login
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-700 dark:text-gray-300">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4 flex flex-col gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-red-500">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-indigo-600">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
