"use client";

import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  BsHouse,
  BsBookmark,
  BsPencil,
  BsSearch,
  BsGear,
  BsQuestionCircle,
  BsBoxArrowRight,
  BsX,
} from "react-icons/bs";
import { logoutUser } from "@/store/authSlice";
import { openModal } from "@/store/modalSlice";
import { RootState } from "@/store/store";
import FontSizeSelector from "./FontSizeSelector";
import type { AppDispatch } from "@/store/store";

interface SidebarProps {
  onFontSizeChange?: (size: "small" | "medium" | "large" | "xlarge") => void;
  currentFontSize?: "small" | "medium" | "large" | "xlarge";
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  onFontSizeChange,
  currentFontSize = "medium",
  isOpen = false,
  onClose,
}: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  const isPlayerPage = pathname?.startsWith("/player/") || false;

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  const mainMenuItems = [
    {
      icon: BsHouse,
      label: "For You",
      href: "/for-you",
      active: pathname === "/for-you",
    },
    {
      icon: BsBookmark,
      label: "My Library",
      href: "/library",
      active: pathname === "/library",
    },
    { icon: BsPencil, label: "Highlights", href: "#", disabled: true },
    { icon: BsSearch, label: "Search", href: "#", disabled: true },
  ];

  const bottomMenuItems = [
    {
      icon: BsGear,
      label: "Settings",
      href: "/settings",
      active: pathname === "/settings",
    },
    {
      icon: BsQuestionCircle,
      label: "Help & Support",
      href: "#",
      disabled: true,
    },
  ];

  const handleNavigation = (href: string, disabled: boolean) => {
    if (!disabled) {
      router.push(href);
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 block md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
  fixed left-0 top-0 h-[calc(100vh-72px)] bg-[#f7faf9] border-r border-gray-200 flex flex-col z-[60]
  transition-transform duration-300 ease-in-out overflow-y-auto
  w-64
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#032b41] md:hidden hover:bg-[#e3e9e7] rounded-lg z-[70]"
        >
          <BsX className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="p-6 pt-8 md:pt-6">
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
              onClick={() => handleNavigation(item.href, !!item.disabled)}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors relative
                ${item.active ? "bg-[#e3e9e7]" : "hover:bg-[#e3e9e7]"}
                ${item.disabled ? "cursor-not-allowed text-[#032b41]" : "cursor-pointer text-[#032b41]"}
              `}
            >
              {item.active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2bd97c] rounded-r"></div>
              )}
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

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
              onClick={() => handleNavigation(item.href, !!item.disabled)}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors relative
                ${item.active ? "bg-[#e3e9e7]" : "hover:bg-[#e3e9e7]"}
                ${item.disabled ? "cursor-not-allowed text-[#032b41]" : "cursor-pointer text-[#032b41]"}
              `}
            >
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#032b41] hover:bg-[#e3e9e7] transition-colors cursor-pointer"
            >
              <BsBoxArrowRight className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => dispatch(openModal("login"))}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#032b41] hover:bg-[#e3e9e7] transition-colors"
            >
              <BsBoxArrowRight className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
