'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { openModal } from '@/store/modalSlice';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BsBoxArrowInRight } from 'react-icons/bs';

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Helper to check if user is a guest
  const isGuestUser = () => {
    if (!user) return false;
    const guestPatterns = ['guest@gmail.com', 'guest@example.com'];
    return guestPatterns.includes(user.email) || user.email?.includes('guest');
  };

  // Get subscription from user data (set during registration)
  const getSubscriptionStatus = () => {
    // Not logged in = basic
    if (!user) return 'basic';
    // Guest user = basic
    if (isGuestUser()) return 'basic';
    // Use subscription from auth state (free by default)
    return user.subscription || 'basic'; // ← CHANGED FROM 'premium'
  };

  const subscriptionStatus = getSubscriptionStatus();
  const showUpgradeButton = subscriptionStatus === 'basic';

  if (!user) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#032b41] mb-4">Login to view your settings</h2>
            <Button 
              onClick={() => dispatch(openModal('login'))}
              className="bg-[#032b41] text-white"
            >
              <BsBoxArrowInRight className="mr-2" />
              Login
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 z-50 shadow-sm flex justify-end">
          <SearchBar />
        </header>

        <div className="p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#032b41] mb-8">Settings</h1>

          {/* Subscription Section */}
          <div className="bg-[#f7faf9] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-[#032b41] mb-4">Your Subscription Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2
                  ${subscriptionStatus === 'basic' ? 'bg-gray-200 text-gray-700' : ''}
                  ${subscriptionStatus === 'premium' ? 'bg-blue-100 text-blue-700' : ''}
                  ${subscriptionStatus === 'premium-plus' ? 'bg-purple-100 text-purple-700' : ''}
                `}>
                  {subscriptionStatus === 'basic' && 'Basic'}
                  {subscriptionStatus === 'premium' && 'Premium'}
                  {subscriptionStatus === 'premium-plus' && 'Premium Plus'}
                </span>
                {showUpgradeButton && (
                  <p className="text-sm text-gray-500">Upgrade to unlock all features</p>
                )}
              </div>
              
              {showUpgradeButton && (
                <Button 
                  onClick={() => router.push('/choose-plan')}
                  className="bg-[#2bd97c] hover:bg-[#20ba68] text-white"
                >
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-[#f7faf9] rounded-lg p-6">
            <h2 className="text-lg font-bold text-[#032b41] mb-4">Email</h2>
            <p className="text-gray-600">{user.email}</p>
            {isGuestUser() && (
              <p className="text-xs text-gray-400 mt-1">Guest account</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}