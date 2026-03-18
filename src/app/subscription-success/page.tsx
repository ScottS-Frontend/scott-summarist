"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadSubscription } from "../../store/subscriptionSlice";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { AppDispatch } from "@/store/store";

export default function SubscriptionSuccessPage() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>(); // ✅ Hook at top level
  useEffect(() => {
    dispatch(loadSubscription());
  }, [dispatch]);

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
          className="w-full bg-[#2bd97c] hover:bg-[#20ba68] text-white h-12 font-semibold text-lg"
        >
          Start Reading
        </Button>
      </div>
    </div>
  );
}
