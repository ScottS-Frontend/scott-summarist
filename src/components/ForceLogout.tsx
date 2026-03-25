"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForceLogout() {
  useEffect(() => {
    signOut(auth);
  }, []);
  
  return null;
}