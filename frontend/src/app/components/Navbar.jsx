'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MessageCircle, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  
  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }
  
  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-2">
            <MessageCircle size={24} className="text-white" />
            <h1 className="text-xl font-bold">Chatroom</h1>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => router.push('/profile')}
              className="flex items-center px-3 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <User size={18} className="mr-2" />
              Profile
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMenu && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
            <button
              onClick={() => {
                router.push('/profile');
                setShowMenu(false);
              }}
              className="flex items-center w-full px-3 py-2 rounded hover:bg-blue-800 transition-colors"
            >
              <User size={18} className="mr-2" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
