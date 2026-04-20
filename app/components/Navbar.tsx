"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MapPin,
  User,
  Bell,
  Settings,
  LayoutDashboard,
  Wallet,
  LifeBuoy,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import LocationGate from "@/app/components/LocationGate";

export default function Navbar() {
  const [city, setCity] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [bookingStatus, setBookingStatus] = useState("");

  // 🔥 USER + CITY
  useEffect(() => {
    setCity(localStorage.getItem("city") || "");

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  // 🔔 REAL-TIME NOTIFICATIONS
  useEffect(() => {
    if (!user) return;

    const q = collection(db, "notifications", user.uid, "items");

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return () => unsub();
  }, [user]);

  // 🚧 LIVE BOOKING STATUS
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const active = snap.docs.find(
        (d) => d.data().status !== "Completed"
      );

      if (active) setBookingStatus(active.data().status);
      else setBookingStatus("");
    });

    return () => unsub();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("loginTime");
    window.location.href = "/auth/login";
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-[50px] flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="text-lg font-semibold text-white">
            Speed<span className="text-[#FF6A00]">Fix</span>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex gap-8 text-white/80">
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* LOCATION */}
            <button
              onClick={() => setShowLocation(true)}
              className="flex items-center gap-1 text-sm text-white"
            >
              <MapPin size={16} />
              {city || "Location"}
            </button>

            {/* LIVE STATUS */}
            {bookingStatus && (
              <div className="hidden md:block text-xs bg-orange-500/10 px-3 py-1 rounded-full text-orange-400">
                {bookingStatus}
              </div>
            )}

            {/* NOTIFICATIONS */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative text-white"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 mt-3 w-72 bg-[#020617] border border-white/10 rounded-xl shadow-lg"
                    >
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-white/50">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="px-4 py-3 text-sm border-b border-white/5 hover:bg-white/5"
                          >
                            {n.message}
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* USER MENU */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center"
                >
                  <User size={18} />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 mt-3 w-64 bg-[#020617] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                    >
                      {/* USER */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm text-white">{user.email}</p>
                      </div>

                      {/* MENU */}
                      <div className="py-2">

                        <MenuItem href="/customer" icon={<LayoutDashboard size={16} />} label="Dashboard" />
                        <MenuItem href="/bookings" icon={<ClipboardList size={16} />} label="My Bookings" />
                        <MenuItem href="/wallet" icon={<Wallet size={16} />} label="Wallet" />
                        <MenuItem href="/support" icon={<LifeBuoy size={16} />} label="Support" />

                      </div>

                      {/* SETTINGS */}
                      <div className="border-t border-white/10 py-2">
                        <MenuItem href="/settings" icon={<Settings size={16} />} label="Settings" />
                      </div>

                      {/* LOGOUT */}
                      <div className="border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-white">
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-orange-500 px-4 py-2 rounded-lg text-white"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* MOBILE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-64 h-full bg-[#020617] p-6 z-50 flex flex-col gap-4"
          >
            <Link href="/services" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            {user && (
              <>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm text-white mb-2">{user.email}</p>
                  <MenuItem href="/customer" icon={<LayoutDashboard size={16} />} label="Dashboard" onClick={() => setMobileOpen(false)} />
                  <MenuItem href="/bookings" icon={<ClipboardList size={16} />} label="My Bookings" onClick={() => setMobileOpen(false)} />
                  <MenuItem href="/wallet" icon={<Wallet size={16} />} label="Wallet" onClick={() => setMobileOpen(false)} />
                  <MenuItem href="/support" icon={<LifeBuoy size={16} />} label="Support" onClick={() => setMobileOpen(false)} />
                  <MenuItem href="/settings" icon={<Settings size={16} />} label="Settings" onClick={() => setMobileOpen(false)} />
                </div>
                <div className="border-t border-white/10 pt-4">
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            )}
            {!user && (
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-white">Sign In</Link>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="bg-orange-500 px-4 py-2 rounded-lg text-white text-center">Get Started</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOCATION */}
      {showLocation && (
        <LocationGate
          onClose={() => {
            setShowLocation(false);
            setCity(localStorage.getItem("city") || "");
          }}
        />
      )}
    </>
  );
}

// 🔥 MENU ITEM COMPONENT
function MenuItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/5"
    >
      {icon}
      {label}
    </Link>
  );
}