"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { openModal } from "@/store/modalSlice";
import { loadSubscription } from "../../store/subscriptionSlice";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BsBoxArrowInRight, BsList } from "react-icons/bs";
import type { AppDispatch } from "@/store/store";

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { subscription } = useSelector((state: RootState) => state.subscription);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(loadSubscription());
    }
  }, [user, dispatch]);

  const isGuestUser = () => {
    if (!user) return false;
    const guestPatterns = ["guest@gmail.com", "guest@example.com"];
    return guestPatterns.includes(user.email || "") || (user.email || "").includes("guest");
  };

  const hasActiveSubscription = subscription?.status === "active" || subscription?.status === "trialing";

  const getSubscriptionStatus = () => {
    if (!user) return "basic";
    if (isGuestUser()) return "basic";
    if (hasActiveSubscription) return "premium";
    return "basic";
  };

  const subscriptionStatus = getSubscriptionStatus();
  const showUpgradeButton = !hasActiveSubscription && !isGuestUser();

  if (!user) {
    return (
      <div className="flex min-h-screen bg-white overflow-x-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 min-w-0 w-full">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-[#032b41] mb-4">Login to view your settings</h2>
            <Button onClick={() => dispatch(openModal("login"))} className="bg-[#032b41] text-white">
              <BsBoxArrowInRight className="mr-2" />
              Login
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 min-w-0 w-full">
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 lg:px-8 py-4 z-10 shadow-sm flex items-center justify-end">
          <SearchBar />
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#032b41] hover:bg-gray-100 rounded-lg ml-4 flex-shrink-0">
            <BsList className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 lg:p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#032b41] mb-8">Settings</h1>

          <div className="bg-[#f7faf9] rounded-lg p-4 lg:p-6 mb-6">
            <h2 className="text-lg font-bold text-[#032b41] mb-4">Your Subscription Plan</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                  subscriptionStatus === "basic" ? "bg-gray-200 text-gray-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {subscriptionStatus === "basic" ? "Basic" : "Premium"}
                </span>
                {showUpgradeButton && <p className="text-sm text-gray-500">Upgrade to unlock all features</p>}
              </div>

              {showUpgradeButton ? (
                <Button onClick={() => router.push("/choose-plan")} className="bg-[#2bd97c] hover:bg-[#20ba68] text-white w-full sm:w-auto">
                  Upgrade to Premium
                </Button>
              ) : (
                <Button variant="outline" onClick={() => router.push("/choose-plan")} className="border-[#2bd97c] text-[#2bd97c] hover:bg-[#2bd97c] hover:text-white w-full sm:w-auto">
                  Manage Subscription
                </Button>
              )}
            </div>
          </div>

          <div className="bg-[#f7faf9] rounded-lg p-4 lg:p-6">
            <h2 className="text-lg font-bold text-[#032b41] mb-4">Email</h2>
            <p className="text-gray-600">{user.email}</p>
            {isGuestUser() && <p className="text-xs text-gray-400 mt-1">Guest account</p>}
          </div>
        </div>
      </main>
    </div>
  );
}