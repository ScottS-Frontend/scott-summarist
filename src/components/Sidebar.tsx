'use client';

import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  BsHouse, 
  BsBookmark, 
  BsPencil, 
  BsSearch, 
  BsGear, 
  BsQuestionCircle,
  BsBoxArrowRight
} from 'react-icons/bs';
import { logoutUser } from '@/store/authSlice';
import { openModal } from '@/store/modalSlice';
import { RootState } from '@/store/store';
import FontSizeSelector from './FontSizeSelector';
import type { AppDispatch } from '@/store/store';

interface SidebarProps {
  onFontSizeChange?: (size: 'small' | 'medium' | 'large' | 'xlarge') => void;
  currentFontSize?: 'small' | 'medium' | 'large' | 'xlarge';
}

export default function Sidebar({ onFontSizeChange, currentFontSize = 'medium' }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if we're on the player page
  const isPlayerPage = pathname?.startsWith('/player/') || false;
  console.log("Sidebar props:", { isPlayerPage, currentFontSize, onFontSizeChange: !!onFontSizeChange });

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/');
  };

  const mainMenuItems = [
    { icon: BsHouse, label: 'For You', href: '/for-you', active: pathname === '/for-you' },
    { icon: BsBookmark, label: 'My Library', href: '/library', active: pathname === '/library' },
    { icon: BsPencil, label: 'Highlights', href: '#', disabled: true },
    { icon: BsSearch, label: 'Search', href: '#', disabled: true },
  ];

  const bottomMenuItems = [
    { icon: BsGear, label: 'Settings', href: '/settings', active: pathname === '/settings' },
    { icon: BsQuestionCircle, label: 'Help & Support', href: '#', disabled: true },
  ];

  return (
    <aside className="w-64 bg-[#f7faf9] h-[calc(100vh-60px)] fixed left-0 top-0 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Image 
          src="/assets/logo.png" 
          alt="Summarist" 
          width={150} 
          height={40} 
          className="object-contain"
        />
      </div>
      
      {/* Main Menu */}
      <nav className="flex-1 px-4">
        {mainMenuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => !item.disabled && router.push(item.href)}
            disabled={item.disabled}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors relative
              ${item.active ? 'bg-[#e3e9e7]' : 'hover:bg-[#e3e9e7]'}
              ${item.disabled ? 'opacity-50 cursor-not-allowed text-gray-400' : 'cursor-pointer text-[#032b41]'}
            `}
          >
            {/* Mint green left bar for active item */}
            {item.active && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2bd97c] rounded-r"></div>
            )}
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        {/* Font Size Selector - Only on Player Page */}
        {isPlayerPage && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            
            <div className="px-4">
              <FontSizeSelector 
                currentSize={currentFontSize} 
                onSizeChange={onFontSizeChange || (() => {})} 
              />
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Menu */}
      <div className="px-4 pb-2">
        {bottomMenuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => !item.disabled && router.push(item.href)}
            disabled={item.disabled}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors relative
              ${item.active ? 'bg-[#e3e9e7]' : 'hover:bg-[#e3e9e7]'}
              ${item.disabled ? 'opacity-50 cursor-not-allowed text-gray-400' : 'cursor-pointer text-[#032b41]'}
            `}
          >
            {/* Mint green left bar for active item */}
            {item.active && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2bd97c] rounded-r"></div>
            )}
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#032b41] hover:bg-[#e3e9e7] transition-colors"
          >
            <BsBoxArrowRight className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        ) : (
          <button
            onClick={() => dispatch(openModal('login'))}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#032b41] hover:bg-[#e3e9e7] transition-colors"
          >
            <BsBoxArrowRight className="w-5 h-5" />
            <span className="font-medium">Login</span>
          </button>
        )}
      </div>
    </aside>
  );
}