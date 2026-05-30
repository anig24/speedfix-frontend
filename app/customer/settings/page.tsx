"use client";

import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { getClientUserProfile } from "@/lib/clientUserProfile";
import {
  readCheckoutAddress,
  writeCheckoutAddress,
  type CartAddress,
} from "@/lib/cart";

type CustomerSettingsForm = {
  name: string;
  phone: string;
  city: string;
  pincode: string;
  addressLine: string;
  landmark: string;
  preferredPayment: "razorpay" | "pay-later" | "pay-on-service";
  notifications: boolean;
  whatsappUpdates: boolean;
};

const defaultForm: CustomerSettingsForm = {
  name: "",
  phone: "",
  city: "",
  pincode: "",
  addressLine: "",
  landmark: "",
  preferredPayment: "razorpay",
  notifications: true,
  whatsappUpdates: true,
};

function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export default function CustomerSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setLoading(false);
        return;
      }

      const profile = (await getClientUserProfile(nextUser).catch(() => ({}))) as Record<
        string,
        unknown
      >;
      const address = readCheckoutAddress();
      const settings = profile.settings as Record<string, unknown> | undefined;
      const notificationSettings =
        profile.notificationSettings as Record<string, unknown> | undefined;

      setForm({
        name:
          readString(profile.name) ||
          readString(profile.fullName) ||
          nextUser.displayName ||
          "",
        phone: readString(profile.phone, address.phone),
        city: readString(profile.city, address.city),
        pincode: readString(profile.pincode, address.pincode),
        addressLine: readString(profile.addressLine, address.addressLine),
        landmark: readString(profile.landmark, address.landmark),
        preferredPayment:
          settings?.preferredPayment === "pay-later" ||
          settings?.preferredPayment === "pay-on-service"
            ? settings.preferredPayment
            : "razorpay",
        notifications: readBoolean(notificationSettings?.notifications, true),
        whatsappUpdates: readBoolean(notificationSettings?.whatsappUpdates, true),
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateField = <K extends keyof CustomerSettingsForm>(
    field: K,
    value: CustomerSettingsForm[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const checkoutAddress: CartAddress = {
        fullName: form.name,
        phone: form.phone,
        city: form.city,
        pincode: form.pincode,
        addressLine: form.addressLine,
        landmark: form.landmark,
      };

      await Promise.all([
        updateProfile(user, { displayName: form.name }).catch(() => undefined),
        setDoc(
          doc(db, "users", user.uid),
          {
            name: form.name,
            fullName: form.name,
            email: user.email || "",
            phone: form.phone,
            city: form.city,
            pincode: form.pincode,
            addressLine: form.addressLine,
            landmark: form.landmark,
            role: "CUSTOMER",
            active: true,
            isActive: true,
            settings: {
              preferredPayment: form.preferredPayment,
            },
            notificationSettings: {
              notifications: form.notifications,
              whatsappUpdates: form.whatsappUpdates,
            },
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        ),
      ]);

      writeCheckoutAddress(checkoutAddress);
      setMessage("Profile settings saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save customer settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-slate-600" />
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Loading profile settings...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Customer settings
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-950">
              Profile, address and payment preferences
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
              Keep your contact details, default service address, update
              preferences, and payment choice ready for faster bookings.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            {user?.email}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <SettingsSection
            icon={<UserRound className="h-5 w-5" />}
            title="Profile details"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full name" value={form.name} onChange={(value) => updateField("name", value)} />
              <Input label="Phone" value={form.phone} onChange={(value) => updateField("phone", value)} />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={<MapPin className="h-5 w-5" />}
            title="Default service address"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="City" value={form.city} onChange={(value) => updateField("city", value)} />
              <Input label="Pincode" value={form.pincode} onChange={(value) => updateField("pincode", value)} />
              <div className="md:col-span-2">
                <Input label="Address line" value={form.addressLine} onChange={(value) => updateField("addressLine", value)} />
              </div>
              <div className="md:col-span-2">
                <Input label="Landmark" value={form.landmark} onChange={(value) => updateField("landmark", value)} />
              </div>
            </div>
          </SettingsSection>
        </section>

        <aside className="space-y-6">
          <SettingsSection
            icon={<CreditCard className="h-5 w-5" />}
            title="Payment preference"
          >
            <div className="space-y-3">
              {[
                ["razorpay", "Pay now", "UPI, cards, wallets, and net banking."],
                ["pay-later", "SpeedFix PayLater", "Book now and pay after confirmation."],
                ["pay-on-service", "Pay after service", "Settle after the technician visit."],
              ].map(([id, title, description]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    updateField(
                      "preferredPayment",
                      id as CustomerSettingsForm["preferredPayment"]
                    )
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    form.preferredPayment === id
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-extrabold">{title}</p>
                  <p className="mt-1 text-xs opacity-75">{description}</p>
                </button>
              ))}
            </div>
          </SettingsSection>

          <SettingsSection icon={<Bell className="h-5 w-5" />} title="Updates">
            <Toggle
              label="Booking notifications"
              checked={form.notifications}
              onChange={(value) => updateField("notifications", value)}
            />
            <Toggle
              label="WhatsApp updates"
              checked={form.whatsappUpdates}
              onChange={(value) => updateField("whatsappUpdates", value)}
            />
          </SettingsSection>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {saving ? "Saving settings" : "Save settings"}
          </button>

          {(message || error) && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                error
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || message}
            </div>
          )}
        </aside>
      </div>
    </form>
  );
}

function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>
        <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800"
    >
      {label}
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-orange-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}
