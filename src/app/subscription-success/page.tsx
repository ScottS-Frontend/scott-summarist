"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { loadSubscription } from "../../store/subscriptionSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkoutUserId = localStorage.getItem("checkoutUserId");

    const timer = setTimeout(() => {
      const auth = getAuth();

      if (!auth.currentUser && checkoutUserId) {
        localStorage.removeItem("checkoutUserId");
        window.location.reload();
      } else if (auth.currentUser) {
        localStorage.removeItem("checkoutUserId");
        dispatch(loadSubscription());
      } else {
        router.push("/");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Restoring your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-20 h-20 text-[#2bd97c]" />
        </div>

        <h1 className="text-3xl font-bold text-[#032b41] mb-4">
          Welcome to Premium!
        </h1>

        <p className="text-gray-600 mb-8">
          Your subscription is now active. You have unlimited access to all our
          content.
        </p>

        <Button
          onClick={() => router.push("/for-you")}
          className="w-full bg-[#2bd97c] hover:bg-[#20ba68] text-white h-12 font-semibold text-lg cursor-pointer"
        >
          Start Reading
        </Button>
      </div>
    </div>
  );
}
