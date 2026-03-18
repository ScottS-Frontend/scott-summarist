"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { closeModal } from "@/store/modalSlice";
import { loginUser, registerUser, clearError } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { BsPersonFill } from "react-icons/bs";
import type { AppDispatch } from '@/store/store';

export default function AuthModal() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isOpen, modalType } = useSelector((state: RootState) => state.modal);
  const { error, loading, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Watch for user to be set, then redirect
  useEffect(() => {
    if (user && isOpen) {
      dispatch(closeModal());
      router.push("/for-you");
    }
  }, [user, isOpen, dispatch, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (isRegister) {
      await dispatch(registerUser({ email, password }));
    } else {
      await dispatch(loginUser({ email, password }));
    }
  };

  const handleGuestLogin = () => {
    dispatch(loginUser({ email: "guest@gmail.com", password: "guest123" }));
  };

  const handleGoogleLogin = () => {
  // UI only - Google login not implemented yet
  alert("Google login coming soon! Please use email login.");
};

  const showRegister = modalType === "register" || isRegister;

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="sm:max-w-[400px] bg-white p-0 overflow-hidden border-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {showRegister ? "Sign up for Summarist" : "Log in to Summarist"}
        </DialogTitle>

        <div className="bg-white p-8">
          {/* Title */}
          <h2 className="text-xl font-bold text-center text-[#032b41] mb-6">
            {showRegister ? "Sign up for Summarist" : "Log in to Summarist"}
          </h2>

          {/* Guest Login - Only show for login mode */}
          {!showRegister && (
            <>
              <button
                onClick={handleGuestLogin}
                className="w-full bg-[#294bf5] hover:bg-[#1f3fe0] text-white font-semibold py-3 px-4 rounded-lg
                           transition-all duration-200
                           shadow-sm hover:shadow-md
                           grid grid-cols-[auto_1fr_auto] items-center"
              >
                <BsPersonFill className="w-7 h-7 ml-1" />

                <span className="text-center text-sm tracking-wide">
                  Login as Guest
                </span>

                <span></span>
              </button>

              {/* Divider with bold "or" */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm font-bold">or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            </>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="group w-full bg-[#3b5bff] hover:bg-[#2f4fe0] text-white font-semibold py-3 px-4 rounded-lg
                       transition-all duration-200 shadow-sm hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                       grid grid-cols-[auto_1fr_auto] items-center mb-6"
          >
            <div className="bg-white rounded-md flex items-center justify-center h-10 w-10 -ml-2">
              <FcGoogle className="w-7 h-7" />
            </div>

            <span className="text-center text-sm tracking-wide">
              {showRegister ? "Sign up with Google" : "Login with Google"}
            </span>

            <span></span>
          </button>

          {/* Divider with "or" after Google Login */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-[#2bd97c] focus:ring-[#2bd97c]"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-[#2bd97c] focus:ring-[#2bd97c]"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#2bd97c] hover:bg-[#20ba68] text-white h-12 font-semibold text-base mt-2"
            >
              {loading ? "Loading..." : showRegister ? "Sign up" : "Login"}
            </Button>
          </form>

          {/* Forgot Password - Only for login */}
          {!showRegister && (
            <div className="text-center mt-4">
              <button
                onClick={() => alert("Forgot password - not implemented yet")}
                className="text-[#0365f2] hover:underline text-sm font-medium"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                dispatch(clearError());
              }}
              className="text-[#0365f2] hover:underline font-semibold text-sm"
            >
              {showRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}