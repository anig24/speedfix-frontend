export type CartAddon = {
  name: string;
  price: number;
};

export type CartItem = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  serviceImage: string;
  subcategorySlug?: string;
  subcategoryName?: string;
  packageName: string;
  packagePrice: number;
  addons: CartAddon[];
  quantity: number;
  turnaround: string;
};

export type CartAddress = {
  fullName: string;
  phone: string;
  city: string;
  pincode: string;
  addressLine: string;
  landmark: string;
};

export type CouponState = {
  code: string;
  discountPercent: number;
  message: string;
};

const CART_KEY = "speedfix_cart";
const ADDRESS_KEY = "speedfix_checkout_address";
const FIRST_BOOKING_KEY = "speedfix_first_booking_used";
const CART_EVENT = "speedfix-cart-updated";
const CART_COUPON = "WELCOME30";

function safeWindow() {
  return typeof window !== "undefined" ? window : null;
}

export function readCart(): CartItem[] {
  const win = safeWindow();

  if (!win) {
    return [];
  }

  try {
    const raw = win.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.setItem(CART_KEY, JSON.stringify(items));
  win.dispatchEvent(new Event(CART_EVENT));
}

export function addItemToCart(item: CartItem) {
  const items = readCart();
  const existingIndex = items.findIndex(
    (entry) =>
      entry.serviceSlug === item.serviceSlug &&
      entry.packageName === item.packageName &&
      entry.subcategorySlug === item.subcategorySlug &&
      JSON.stringify(entry.addons) === JSON.stringify(item.addons)
  );

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: items[existingIndex].quantity + item.quantity,
    };
  } else {
    items.push(item);
  }

  writeCart(items);
}

export function removeCartItem(id: string) {
  writeCart(readCart().filter((item) => item.id !== id));
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const items = readCart()
    .map((item) => (item.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(items);
}

export function clearCart() {
  writeCart([]);
}

export function subscribeToCart(listener: () => void) {
  const win = safeWindow();

  if (!win) {
    return () => undefined;
  }

  win.addEventListener(CART_EVENT, listener);

  return () => {
    win.removeEventListener(CART_EVENT, listener);
  };
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const addonTotal = item.addons.reduce((addonSum, addon) => addonSum + addon.price, 0);
    return sum + (item.packagePrice + addonTotal) * item.quantity;
  }, 0);
}

export function readCheckoutAddress(): CartAddress {
  const win = safeWindow();

  if (!win) {
    return {
      fullName: "",
      phone: "",
      city: "",
      pincode: "",
      addressLine: "",
      landmark: "",
    };
  }

  try {
    const raw = win.localStorage.getItem(ADDRESS_KEY);

    if (!raw) {
      return {
        fullName: "",
        phone: "",
        city: win.localStorage.getItem("city") || "",
        pincode: win.localStorage.getItem("pincode") || "",
        addressLine: "",
        landmark: "",
      };
    }

    return JSON.parse(raw) as CartAddress;
  } catch {
    return {
      fullName: "",
      phone: "",
      city: "",
      pincode: "",
      addressLine: "",
      landmark: "",
    };
  }
}

export function writeCheckoutAddress(address: CartAddress) {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
}

export function isFirstBookingAvailable() {
  const win = safeWindow();

  if (!win) {
    return false;
  }

  return win.localStorage.getItem(FIRST_BOOKING_KEY) !== "true";
}

export function markFirstBookingUsed() {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.setItem(FIRST_BOOKING_KEY, "true");
}

export function validateCoupon(code: string, subtotal: number): CouponState | null {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return null;
  }

  if (normalized !== CART_COUPON) {
    return {
      code: normalized,
      discountPercent: 0,
      message: "This coupon code is not available.",
    };
  }

  if (!isFirstBookingAvailable()) {
    return {
      code: normalized,
      discountPercent: 0,
      message: "WELCOME30 works only on the first booking.",
    };
  }

  if (subtotal <= 0) {
    return {
      code: normalized,
      discountPercent: 0,
      message: "Add a service to the cart before applying a coupon.",
    };
  }

  return {
    code: normalized,
    discountPercent: 30,
    message: "30% off applied for your first booking.",
  };
}
