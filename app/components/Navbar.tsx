"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  LogOut,
  MapPin,
  Menu,
  ShoppingBag,
  Wrench,
  X,
} from "lucide-react";
import { type User, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import LocationGate from "@/app/components/LocationGate";
import { getCartCount, readCart, subscribeToCart } from "@/lib/cart";
import {
  detectAndStoreCurrentCity,
  hasAttemptedCityAutoDetect,
  markCityAutoDetectAttempted,
  readStoredCity,
  subscribeToStoredCity,
} from "@/lib/locationStorage";
import {
  getAccessibleWorkspaceLinks,
  type WorkspaceNavItem,
} from "@/lib/workspaceCatalog";

type NotificationItem = {
  id: string;
  message: string;
};

type UserProfile = {
  name?: string;
  email?: string;
  role?: string;
  active?: boolean;
  employeeActive?: boolean;
  employmentStatus?: string;
  premiumPlan?: boolean;
  premium?: boolean;
  plan?: string;
  membershipTier?: string;
  subscription?: {
    tier?: string;
  };
};

const primaryLinks = [
  { href: "/services", label: "Services" },
  { href: "/workers", label: "Workers" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const customerLinks = [
  {
    href: "/cart",
    label: "Cart",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    href: "/services",
    label: "Browse services",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    href: "/careers",
    label: "Careers",
    icon: <BriefcaseBusiness className="h-4 w-4" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [showLocation, setShowLocation] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasPremiumBadge, setHasPremiumBadge] = useState(false);
  const [workspaceLinks, setWorkspaceLinks] = useState<WorkspaceNavItem[]>([]);
  const city = useSyncExternalStore(subscribeToStoredCity, readStoredCity, () => "");
  const cartCount = useSyncExternalStore(
    subscribeToCart,
    () => getCartCount(readCart()),
    () => 0
  );

  useEffect(() => {
    const isInternalRoute =
      pathname?.startsWith("/corporate") ||
      pathname?.startsWith("/agent") ||
      pathname?.startsWith("/admin") ||
      pathname?.startsWith("/dashboard") ||
      pathname?.startsWith("/support");

    if (city || isInternalRoute || hasAttemptedCityAutoDetect()) {
      return;
    }

    markCityAutoDetectAttempted();

    detectAndStoreCurrentCity().catch(() => undefined);
  }, [city, pathname]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setNotifications([]);
        setBookingStatus("");
        setHasPremiumBadge(false);
        setWorkspaceLinks([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const notificationRef = collection(db, "notifications", user.uid, "items");

    return onSnapshot(notificationRef, (snapshot) => {
      const nextNotifications = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          message:
            typeof data.message === "string"
              ? data.message
              : "New update available.",
        };
      });

      setNotifications(nextNotifications);
    });
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    const loadProfile = async () => {
      const profileSnapshot = await getDoc(doc(db, "users", user.uid));
      const profile = profileSnapshot.data() as UserProfile | undefined;

      if (!active) {
        return;
      }

      const membershipTier =
        typeof profile?.membershipTier === "string"
          ? profile.membershipTier.toLowerCase()
          : "";
      const planName =
        typeof profile?.plan === "string" ? profile.plan.toLowerCase() : "";
      const subscriptionTier =
        typeof profile?.subscription?.tier === "string"
          ? profile.subscription.tier.toLowerCase()
          : "";

      setHasPremiumBadge(
        Boolean(profile?.premiumPlan) ||
          Boolean(profile?.premium) ||
          membershipTier === "premium" ||
          planName === "premium" ||
          subscriptionTier === "premium"
      );

      setWorkspaceLinks(
        getAccessibleWorkspaceLinks(
          {
            ...profile,
            email: profile?.email || user.email || "",
            role: profile?.role || "CUSTOMER",
            active:
              typeof profile?.active === "boolean" ? profile.active : true,
            employeeActive:
              typeof profile?.employeeActive === "boolean"
                ? profile.employeeActive
                : true,
            employmentStatus:
              profile?.employmentStatus || (profile?.role ? "ACTIVE" : "CUSTOMER"),
          },
          profile?.email || user.email || ""
        )
      );
    };

    loadProfile().catch(() => {
      if (active) {
        setHasPremiumBadge(false);
        setWorkspaceLinks(
          getAccessibleWorkspaceLinks(
            {
              email: user.email || "",
              role: "CUSTOMER",
              active: true,
              employeeActive: true,
              employmentStatus: "CUSTOMER",
            },
            user.email || ""
          )
        );
      }
    });

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const bookingQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    return onSnapshot(bookingQuery, (snapshot) => {
      const activeBooking = snapshot.docs.find((doc) => {
        const data = doc.data();
        return typeof data.status === "string" && data.status !== "Completed";
      });

      const status = activeBooking?.data().status;
      setBookingStatus(typeof status === "string" ? status : "");
    });
  }, [user]);

  const userInitial = useMemo(() => {
    return user?.email?.charAt(0).toUpperCase() || "S";
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("loginTime");
    window.location.href = "/auth/login";
  };

  const syncLocation = () => {
    setShowLocation(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#07111f] shadow-[0_14px_40px_rgba(2,10,24,0.28)]">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto grid h-[76px] max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-6 lg:gap-8 lg:px-8"
        >
          <Link href="/" className="flex min-w-max items-center gap-2 text-white">
            <span className="text-2xl font-semibold tracking-tight text-glow">
              <span className="text-white">Speed</span>
              <span className="text-[#FF6A00]">Fix</span>
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center justify-center gap-2 xl:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/8 hover:text-white 2xl:px-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowLocation(true)}
              className="hidden items-center gap-2 rounded-full border border-white/20 bg-[#122238] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,10,24,0.22)] transition hover:border-white/30 hover:bg-[#162a45] sm:inline-flex lg:px-5"
            >
              <MapPin className="h-4 w-4 text-orange-400" />
              {city || "Choose city"}
            </button>

            {bookingStatus && (
              <div className="hidden rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-200 lg:block">
                {bookingStatus}
              </div>
            )}

            <Link
              href="/cart"
              className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#122238] text-white shadow-[0_10px_24px_rgba(2,10,24,0.22)] transition hover:border-white/30 hover:bg-[#162a45]"
              aria-label="View cart"
            >
              <ShoppingBag className="h-4 w-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user && (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((open) => !open);
                    setMenuOpen(false);
                  }}
                  className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#122238] text-white shadow-[0_10px_24px_rgba(2,10,24,0.22)] transition hover:border-white/30 hover:bg-[#162a45]"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4 text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-80 overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0b1527]/98 shadow-[0_24px_80px_rgba(2,10,24,0.48)] backdrop-blur-xl"
                    >
                      <div className="border-b border-white/10 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                          Notifications
                        </p>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-4 text-sm text-white/60">
                            No notifications right now.
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="border-b border-white/6 px-4 py-3 text-sm text-white/72"
                            >
                              {notification.message}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen((open) => !open);
                    setNotifOpen(false);
                  }}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,106,0,0.4)]"
                  aria-label="Open user menu"
                >
                  {userInitial}
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b1527]/98 shadow-[0_24px_80px_rgba(2,10,24,0.48)] backdrop-blur-xl"
                    >
                      <div className="border-b border-white/10 px-4 py-4">
                        <p className="text-sm font-semibold text-white">
                          {user.email}
                        </p>
                        <p className="mt-1 text-xs text-white/60">
                          {hasPremiumBadge ? "Premium member account" : "Customer account"}
                        </p>
                      </div>

                      {workspaceLinks.length > 0 && (
                        <div className="border-b border-white/10 px-2 py-2">
                          <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                            Dashboards
                          </p>
                          {workspaceLinks.map((item) => (
                            <MenuItem
                              key={item.href}
                              href={item.href}
                              icon={<item.icon className="h-4 w-4" />}
                              label={item.label}
                              onClick={() => setMenuOpen(false)}
                            />
                          ))}
                        </div>
                      )}

                      <div className="py-2">
                        {customerLinks.map((item) => (
                          <MenuItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => setMenuOpen(false)}
                          />
                        ))}
                      </div>

                      <div className="border-t border-white/10 p-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium text-rose-300 transition hover:bg-white/6"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/auth/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white/92 transition hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/login"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_24px_rgba(255,255,255,0.08)] transition hover:bg-slate-100"
                >
                  Get started
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileOpen((open) => !open);
                setMenuOpen(false);
                setNotifOpen(false);
              }}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/84 transition hover:border-white/20 hover:bg-white/[0.08] xl:hidden"
              aria-label="Open mobile menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="mobile-safe-scroll fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-white/10 bg-[#081423] px-6 text-white shadow-[0_24px_80px_rgba(2,10,24,0.48)] xl:hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold tracking-tight text-white">
                  <span className="text-white">Speed</span>
                  <span className="text-[#FF6A00]">Fix</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/4 text-white/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowLocation(true);
                setMobileOpen(false);
              }}
              className="mt-6 flex w-full items-center gap-2 rounded-[1.2rem] border border-white/12 bg-white/4 px-4 py-3 text-left text-sm text-white/82"
            >
              <MapPin className="h-4 w-4 text-orange-400" />
              {city || "Choose city"}
            </button>

            <div className="mt-8 space-y-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-[1.1rem] border border-white/12 bg-white/4 px-4 py-3 text-sm font-medium text-white/84"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="block rounded-[1.1rem] border border-white/12 bg-white/4 px-4 py-3 text-sm font-medium text-white/84"
              >
                Cart ({cartCount})
              </Link>
            </div>

            {user ? (
              <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
                <p className="text-sm font-semibold text-white">{user.email}</p>
                <div className="mt-4 space-y-2">
                  {workspaceLinks.map((item) => (
                    <MenuItem
                      key={item.href}
                      href={item.href}
                      icon={<item.icon className="h-4 w-4" />}
                      label={item.label}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                  {customerLinks.map((item) => (
                    <MenuItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium text-rose-300 transition hover:bg-white/6"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-white/12 px-4 py-3 text-center text-sm font-medium text-white/88"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
                >
                  Create account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showLocation && <LocationGate onClose={syncLocation} />}
    </>
  );
}

function MenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium text-white/82 transition hover:bg-white/6 hover:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}
