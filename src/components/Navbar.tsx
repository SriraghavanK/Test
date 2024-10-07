import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User as UserIcon, Menu as MenuIcon, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-orange-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20"> {/* Change h-16 to h-20 */}
        <div className="flex items-center">
          <Link to="/" className="flex-shrink-0">
            <img className="h-20 w-20" src="https://th.bing.com/th/id/OIG1.8CBh5YIBQJVAaIeIF9Nq?w=1024&h=1024&rs=1&pid=ImgDetMain" alt="Logo" />
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white hover:bg-orange-600 px-3 py-3 rounded-md text-sm font-medium"> {/* Increased py from 2 to 3 */}
                Home
              </Link>
              <Link to="/menu" className="text-white hover:bg-orange-600 px-3 py-3 rounded-md text-sm font-medium"> {/* Increased py from 2 to 3 */}
                Menu
              </Link>
              {user && user.isAdmin && (
                <Link to="/admin" className="text-white hover:bg-orange-600 px-3 py-3 rounded-md text-sm font-medium"> {/* Increased py from 2 to 3 */}
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      
      <div className="hidden md:block">
        <div className="ml-4 flex items-center md:ml-6">
          <Link to="/cart" className="text-white hover:bg-orange-600 p-2 rounded-full">
            <ShoppingCart className="h-6 w-6" />
          </Link>
          {user ? (
            <div className="ml-3 relative">
              <div className="flex items-center">
                <Link to="/profile" className="text-white hover:bg-orange-600 p-2 rounded-full">
                  <UserIcon className="h-6 w-6" />
                </Link>

                <button
                  onClick={logout}
                  className="ml-2 text-white hover:bg-orange-600 px-3 py-3 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:bg-orange-600 px-3 py-3 rounded-md text-sm font-medium">
              Login
            </Link>
          )}
        </div>
      </div>
      
      <div className="-mr-2 flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="bg-orange-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-800 focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  
    <motion.div
      className="md:hidden"
      id="mobile-menu"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { opacity: 1, height: "auto" },
        closed: { opacity: 0, height: 0 }
      }}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link to="/" className="text-white hover:bg-orange-600 block px-3 py-3 rounded-md text-base font-medium"> {/* Increased py from 2 to 3 */}
          Home
        </Link>
        <Link to="/menu" className="text-white hover:bg-orange-600 block px-3 py-3 rounded-md text-base font-medium"> {/* Increased py from 2 to 3 */}
          Menu
        </Link>
        <Link to="/cart" className="text-white hover:bg-orange-600 block px-3 py-3 rounded-md text-base font-medium"> {/* Increased py from 2 to 3 */}
          Cart
        </Link>
        {user && user.isAdmin && (
          <Link to="/admin" className="text-white hover:bg-orange-600 block px-3 py-3 rounded-md text-base font-medium"> {/* Increased py from 2 to 3 */}
            Admin Panel
          </Link>
        )}
        {user ? (
          <>
            <Link to="/profile" className="text-white hover:bg-orange-600 block px-3 py-3 rounded-md text-base font-medium"> {/* Increased py from 2 to 3 */}
              Profile
            </Link>
            <button onClick={logout} className="text-white hover:bg-orange-600 block px-3 py-3 rounded-md text-base font-medium w-full text-left"> {/* Increased py from 2 to 3 */}
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-white hover:bg-orange-600 block px-3 py-3 rounded-md text-base font-medium"> {/* Increased py from 2 to 3 */}
            Login
          </Link>
        )}
      </div>
    </motion.div>
  </nav>
  
  );
};

export default Navbar;