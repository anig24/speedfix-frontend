"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IdCard,
  Landmark,
  Loader2,
  LocateFixed,
  MapPinned,
  Phone,
  RefreshCcw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  formatTrackingTimestamp,
  getStatusTone,
  type BookingTimelineEvent,
} from "@/lib/bookingTracking";
import {
  indianBankOptions,
  indianStateOptions,
  workerBookingFlow,
  workerCityOptions,
  workerDashboardActions,
  workerOnboardingSteps,
  workerServiceOptions,
  type WorkerDashboardActionKey,
  type WorkerOnboardingStepKey,
} from "@/lib/workerPortal";

import dynamic from "next/dynamic";
const WorkerTrackingMap = dynamic(
  () => import("@/app/components/WorkerTrackingMap"),
  { ssr: false }
);
type ApiState = {
  type: "idle" | "success" | "error" | "info";
  message: string;
};

type IfscSearchResult = {
  bank: string;
  ifsc: string;
  branch: string;
  city: string;
  state: string;
  source?: string;
};

type WorkerDashboardBooking = {
  bookingId: string;
  bookingCode: string;
  service: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  preferredDate?: string | null;
  preferredSlot?: string | null;
  assignedAt?: string | null;
  updatedAt?: string | null;
  customerLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  workerLiveLocation?: {
    label: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    } | null;
    updatedAt?: string | null;
  } | null;
  timeline: BookingTimelineEvent[];
};

type WorkerDashboardData = {
  worker: {
    workerId: string;
    workerCode: string;
    referenceNumber: string;
    fullName: string;
    phone: string;
    email?: string | null;
    city: string;
    service: string;
    services: string[];
    verificationStatus: string;
    onboardingStatus: string;
    available: boolean;
    active: boolean;
    verified: boolean;
    currentArea: string;
    currentBookingId?: string | null;
    liveCoordinates?: {
      latitude: number;
      longitude: number;
    } | null;
    bank?: {
      bankName: string;
      accountHolderName: string;
      accountNumberMasked: string;
      ifsc: string;
      branch: string;
      city: string;
      state: string;
      verificationStatus: string;
    } | null;
  };
  bookings: WorkerDashboardBooking[];
};

const initialProfile = {
  fullName: "",
  phone: "",
  email: "",
  city: "Kolkata",
  primaryService: "Home Cleaning",
  services: ["Home Cleaning"],
  experienceYears: "",
  languages: "English, Hindi",
};

const initialKyc = {
  aadhaarConsent: false,
  panConsent: false,
  verificationSessionId: "",
  maskedAadhaar: "",
  panNumber: "",
  otp: "",
};

const initialBank = {
  bankName: indianBankOptions[0] || "",
  accountHolderName: "",
  accountNumber: "",
  ifsc: "",
  branch: "",
  city: "Kolkata",
  state: "West Bengal",
  payoutConsent: false,
};

const initialLocation = {
  latitude: null as number | null,
  longitude: null as number | null,
  label: "",
  city: "Kolkata",
};

function toSentenceCase(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

export default function WorkerPortalClient() {
  const [activeStep, setActiveStep] = useState<WorkerOnboardingStepKey>("profile");
  const [profile, setProfile] = useState(initialProfile);
  const [kyc, setKyc] = useState(initialKyc);
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [bank, setBank] = useState(initialBank);
  const [location, setLocation] = useState(initialLocation);
  const [ifscResults, setIfscResults] = useState<IfscSearchResult[]>([]);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [digilockerState, setDigilockerState] = useState<ApiState>({
    type: "info",
    message:
      "Start DigiLocker verification to capture Aadhaar and PAN through the official verification flow when credentials are configured.",
  });
  const [submissionState, setSubmissionState] = useState<ApiState>({
    type: "idle",
    message: "",
  });
  const [dashboardState, setDashboardState] = useState<ApiState>({
    type: "idle",
    message: "",
  });
  const [applicationResult, setApplicationResult] = useState<{
    applicationId: string;
    workerId: string;
    workerCode: string;
    referenceNumber: string;
    verificationStatus: string;
  } | null>(null);
  const [dashboardAccess, setDashboardAccess] = useState({
    workerCode: "",
    phone: "",
  });
  const [dashboard, setDashboard] = useState<WorkerDashboardData | null>(null);
  const [busyAction, setBusyAction] = useState<string>("");

  const stepIndex = useMemo(
    () => workerOnboardingSteps.findIndex((step) => step.key === activeStep),
    [activeStep]
  );
  const activeBooking = useMemo(
    () =>
      dashboard?.bookings.find((booking) => booking.status !== "COMPLETED") ||
      dashboard?.bookings[0] ||
      null,
    [dashboard]
  );

  async function startDigiLockerSession() {
    setBusyAction("digilocker-start");
    try {
      const response = await fetch("/api/workers/digilocker/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          phone: profile.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start DigiLocker verification.");
      }

      setKyc((current) => ({
        ...current,
        verificationSessionId: data.verificationSessionId || current.verificationSessionId,
      }));

      if (data.redirectUrl) {
        setDigilockerState({
          type: "success",
          message:
            "DigiLocker session is ready. The official redirect URL has been prepared for secure verification.",
        });
        window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
      } else {
        setDigilockerState({
          type: "info",
          message:
            data.message ||
            "DigiLocker credentials are not configured yet. Consent will be stored and the application will wait for official verification.",
        });
      }
    } catch (error) {
      setDigilockerState({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to start DigiLocker verification.",
      });
    } finally {
      setBusyAction("");
    }
  }

  async function handleOtpAction(action: "request" | "verify") {
    setBusyAction(`digilocker-otp-${action}`);
    try {
      const response = await fetch("/api/workers/digilocker/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          phone: profile.phone,
          sessionId: kyc.verificationSessionId,
          otp: kyc.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok && data.status !== "CONFIG_REQUIRED") {
        throw new Error(data.error || data.message || "Unable to complete OTP action.");
      }

      if (data.sessionId) {
        setKyc((current) => ({
          ...current,
          verificationSessionId: data.sessionId,
        }));
      }

      setDigilockerState({
        type: data.configured === false ? "info" : "success",
        message:
          data.message ||
          (action === "request"
            ? "OTP request has been triggered."
            : "OTP verification response received."),
      });
    } catch (error) {
      setDigilockerState({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to complete OTP verification.",
      });
    } finally {
      setBusyAction("");
    }
  }

  async function lookupIfscByBranch() {
    setIfscLoading(true);
    try {
      const query = new URLSearchParams({
        bank: bank.bankName,
        state: bank.state,
        city: bank.city,
        branch: bank.branch,
      });
      const response = await fetch(`/api/workers/ifsc?${query.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to search IFSC.");
      }

      setIfscResults(data.results || []);
      setSubmissionState({
        type: "info",
        message: data.note || "IFSC suggestions loaded.",
      });
    } catch (error) {
      setSubmissionState({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to search IFSC.",
      });
    } finally {
      setIfscLoading(false);
    }
  }

  async function validateIfsc() {
    if (!bank.ifsc) {
      setSubmissionState({
        type: "error",
        message: "Enter an IFSC code before validating.",
      });
      return;
    }

    setIfscLoading(true);
    try {
      const response = await fetch(`/api/workers/ifsc?ifsc=${encodeURIComponent(bank.ifsc)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to validate IFSC.");
      }

      if (data.result) {
        setBank((current) => ({
          ...current,
          bankName: data.result.bank || current.bankName,
          ifsc: data.result.ifsc || current.ifsc,
          branch: data.result.branch || current.branch,
          city: data.result.city || current.city,
          state: data.result.state || current.state,
        }));
      }

      setSubmissionState({
        type: "success",
        message: "IFSC validated successfully.",
      });
    } catch (error) {
      setSubmissionState({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to validate IFSC.",
      });
    } finally {
      setIfscLoading(false);
    }
  }

  async function captureLocation() {
    if (!navigator.geolocation) {
      setSubmissionState({
        type: "error",
        message: "This browser does not support location capture.",
      });
      return;
    }

    setBusyAction("location");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation((current) => ({
          ...current,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          label: current.label || `${profile.city} worker coverage`,
          city: profile.city,
        }));
        setSubmissionState({
          type: "success",
          message: "Live location captured for nearest-worker assignment.",
        });
        setBusyAction("");
      },
      () => {
        setSubmissionState({
          type: "error",
          message: "Location permission was not granted.",
        });
        setBusyAction("");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
      }
    );
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPhotoDataUrl(dataUrl);
      setSubmissionState({
        type: "success",
        message: "Worker photo captured successfully.",
      });
    } catch {
      setSubmissionState({
        type: "error",
        message: "Unable to process the selected photo.",
      });
    }
  }

  async function submitApplication() {
    setBusyAction("submit-worker");
    setSubmissionState({
      type: "idle",
      message: "",
    });

    try {
      const response = await fetch("/api/workers/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          kyc,
          bank,
          location,
          photoDataUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit worker application.");
      }

      const nextResult = {
        applicationId: data.applicationId,
        workerId: data.workerId,
        workerCode: data.workerCode,
        referenceNumber: data.referenceNumber,
        verificationStatus: data.verificationStatus,
      };

      setApplicationResult(nextResult);
      setDashboardAccess({
        workerCode: data.workerCode,
        phone: profile.phone,
      });
      setSubmissionState({
        type: "success",
        message:
          "Worker listing submitted. KYC, bank, and activation now move into review and assignment readiness.",
      });
      setActiveStep("assignment");
      await loadDashboard(data.workerCode, profile.phone);
    } catch (error) {
      setSubmissionState({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to submit worker application.",
      });
    } finally {
      setBusyAction("");
    }
  }

  async function loadDashboard(workerCode = dashboardAccess.workerCode, phone = dashboardAccess.phone) {
    setBusyAction("load-dashboard");
    try {
      const response = await fetch("/api/workers/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerCode,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load worker dashboard.");
      }

      setDashboard(data);
      setDashboardState({
        type: "success",
        message: "Worker dashboard loaded successfully.",
      });
    } catch (error) {
      setDashboard(null);
      setDashboardState({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to load worker dashboard.",
      });
    } finally {
      setBusyAction("");
    }
  }

  async function runBookingAction(action: WorkerDashboardActionKey, bookingId: string) {
    if (!dashboard) {
      return;
    }

    setBusyAction(`${action}-${bookingId}`);

    try {
      const response = await fetch("/api/workers/bookings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerCode: dashboard.worker.workerCode,
          phone: dashboard.worker.phone,
          bookingId,
          action,
          location: {
            latitude: location.latitude ?? dashboard.worker.liveCoordinates?.latitude ?? null,
            longitude: location.longitude ?? dashboard.worker.liveCoordinates?.longitude ?? null,
            label:
              location.label ||
              dashboard.worker.currentArea ||
              `${dashboard.worker.city} worker coverage`,
            city: location.city || dashboard.worker.city,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update booking step.");
      }

      setDashboardState({
        type: "success",
        message: `${toSentenceCase(action)} updated for ${data.bookingId}.`,
      });
      await loadDashboard(dashboard.worker.workerCode, dashboard.worker.phone);
    } catch (error) {
      setDashboardState({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to update worker booking.",
      });
    } finally {
      setBusyAction("");
    }
  }

  function toggleService(service: string) {
    setProfile((current) => {
      const exists = current.services.includes(service);
      const nextServices = exists
        ? current.services.filter((item) => item !== service)
        : [...current.services, service];

      return {
        ...current,
        services: nextServices.length ? nextServices : [current.primaryService],
      };
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="surface-panel overflow-hidden rounded-[2rem] border border-slate-200/80 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">
              <BriefcaseBusiness className="h-4 w-4" />
              Worker Network
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              SpeedFix worker onboarding, verification, and appointment dispatch.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              This side of the platform is for field workers who want to list
              themselves, complete government KYC, register payout details, and
              receive customer appointments after successful booking.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SummaryCard
                title="Verification flow"
                value="Aadhaar + PAN"
                description="Consent-based DigiLocker handoff with worker photo and bank validation."
                icon={<ShieldCheck className="h-5 w-5" />}
              />
              <SummaryCard
                title="Dispatch data"
                value="Worker ID + ref"
                description="Every listing gets a worker code, reference number, and assignment trail."
                icon={<IdCard className="h-5 w-5" />}
              />
              <SummaryCard
                title="Field tracking"
                value="Live location"
                description="Nearest-worker matching and status progression after customer payment."
                icon={<MapPinned className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
              Step-by-step booking configuration
            </p>
            <div className="mt-6 space-y-4">
              {workerBookingFlow.map((step, index) => (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    {index < workerBookingFlow.length - 1 && (
                      <div className="mt-2 h-full w-px bg-white/10" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="surface-panel rounded-[2rem] border border-slate-200/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Self-listing and verification
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Join SpeedFix as a field worker
              </h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Step {stepIndex + 1} of {workerOnboardingSteps.length}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="space-y-3">
              {workerOnboardingSteps.map((step, index) => {
                const active = step.key === activeStep;
                const completed = index < stepIndex || (step.key === "assignment" && applicationResult);
                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => setActiveStep(step.key)}
                    className={`flex w-full items-start gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition ${
                      active
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        active
                          ? "bg-white/12 text-white"
                          : completed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className={`mt-1 text-xs leading-5 ${active ? "text-slate-300" : "text-slate-500"}`}>
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5">
              {activeStep === "profile" && (
                <div className="space-y-5">
                  <StepHeader
                    icon={<UserRound className="h-5 w-5" />}
                    title="Worker profile"
                    description="Capture the worker identity, registered phone number, work city, and the services they want to handle."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Full name"
                      value={profile.fullName}
                      onChange={(value) => setProfile((current) => ({ ...current, fullName: value }))}
                      placeholder="Enter worker name"
                    />
                    <Field
                      label="Phone number"
                      value={profile.phone}
                      onChange={(value) => setProfile((current) => ({ ...current, phone: value }))}
                      placeholder="10-digit mobile number"
                    />
                    <Field
                      label="Email"
                      value={profile.email}
                      onChange={(value) => setProfile((current) => ({ ...current, email: value }))}
                      placeholder="worker@speedfix.co.in or personal email"
                    />
                    <SelectField
                      label="City"
                      value={profile.city}
                      options={workerCityOptions}
                      onChange={(value) =>
                        setProfile((current) => ({ ...current, city: value }))
                      }
                    />
                    <SelectField
                      label="Primary service"
                      value={profile.primaryService}
                      options={workerServiceOptions}
                      onChange={(value) =>
                        setProfile((current) => ({
                          ...current,
                          primaryService: value,
                          services: current.services.includes(value)
                            ? current.services
                            : [value, ...current.services],
                        }))
                      }
                    />
                    <Field
                      label="Experience"
                      value={profile.experienceYears}
                      onChange={(value) =>
                        setProfile((current) => ({ ...current, experienceYears: value }))
                      }
                      placeholder="Example: 4 years"
                    />
                  </div>

                  <Field
                    label="Languages"
                    value={profile.languages}
                    onChange={(value) => setProfile((current) => ({ ...current, languages: value }))}
                    placeholder="English, Hindi, Bengali"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">Service skills</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {workerServiceOptions.map((service) => {
                        const selected = profile.services.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              selected
                                ? "border-slate-950 bg-slate-950 text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeStep === "kyc" && (
                <div className="space-y-5">
                  <StepHeader
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="Government KYC"
                    description="Run consent-based Aadhaar and PAN verification. The portal is ready for official DigiLocker wiring, and will hold the application pending if credentials are not yet configured."
                  />

                  <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          DigiLocker verification handoff
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Start the session, request OTP if required, and record the verification session ID.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={startDigiLockerSession}
                        disabled={busyAction === "digilocker-start"}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        {busyAction === "digilocker-start" && <Loader2 className="h-4 w-4 animate-spin" />}
                        Start DigiLocker
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_auto]">
                      <Field
                        label="Verification session ID"
                        value={kyc.verificationSessionId}
                        onChange={(value) =>
                          setKyc((current) => ({ ...current, verificationSessionId: value }))
                        }
                        placeholder="Generated session will appear here"
                      />
                      <button
                        type="button"
                        onClick={() => handleOtpAction("request")}
                        disabled={busyAction === "digilocker-otp-request"}
                        className="self-end rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
                      >
                        {busyAction === "digilocker-otp-request" ? "Requesting..." : "Request OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOtpAction("verify")}
                        disabled={busyAction === "digilocker-otp-verify"}
                        className="self-end rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
                      >
                        {busyAction === "digilocker-otp-verify" ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Field
                        label="OTP"
                        value={kyc.otp}
                        onChange={(value) => setKyc((current) => ({ ...current, otp: value }))}
                        placeholder="Enter DigiLocker OTP"
                      />
                      <Field
                        label="Masked Aadhaar / last 4"
                        value={kyc.maskedAadhaar}
                        onChange={(value) =>
                          setKyc((current) => ({ ...current, maskedAadhaar: value }))
                        }
                        placeholder="Example: XXXX XXXX 2381"
                      />
                      <Field
                        label="PAN number"
                        value={kyc.panNumber}
                        onChange={(value) => setKyc((current) => ({ ...current, panNumber: value.toUpperCase() }))}
                        placeholder="Example: ABCDE1234F"
                      />
                    </div>

                    <StatusBanner state={digilockerState} />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <ToggleCard
                      checked={kyc.aadhaarConsent}
                      label="Aadhaar consent"
                      description="Worker agrees to Aadhaar verification for platform onboarding."
                      onToggle={() =>
                        setKyc((current) => ({
                          ...current,
                          aadhaarConsent: !current.aadhaarConsent,
                        }))
                      }
                    />
                    <ToggleCard
                      checked={kyc.panConsent}
                      label="PAN consent"
                      description="Worker agrees to PAN verification for tax and payout compliance."
                      onToggle={() =>
                        setKyc((current) => ({
                          ...current,
                          panConsent: !current.panConsent,
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {activeStep === "photo" && (
                <div className="space-y-5">
                  <StepHeader
                    icon={<Camera className="h-5 w-5" />}
                    title="Photo capture"
                    description="Capture a worker profile photo for field identity and assignment confirmation."
                  />

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center transition hover:border-slate-400">
                    <Camera className="h-8 w-8 text-slate-500" />
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      Capture or upload worker photo
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Use camera capture on mobile or upload a clear worker photo.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  {photoDataUrl && (
                    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoDataUrl}
                        alt="Worker preview"
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeStep === "bank" && (
                <div className="space-y-5">
                  <StepHeader
                    icon={<Landmark className="h-5 w-5" />}
                    title="Bank and payout details"
                    description="Choose the bank from the listed banks, enter payout details, and search IFSC by state, city, and branch if the worker does not know it."
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <SelectField
                      label="Bank name"
                      value={bank.bankName}
                      options={indianBankOptions}
                      onChange={(value) => setBank((current) => ({ ...current, bankName: value }))}
                    />
                    <Field
                      label="Account holder name"
                      value={bank.accountHolderName}
                      onChange={(value) =>
                        setBank((current) => ({ ...current, accountHolderName: value }))
                      }
                      placeholder="As per bank records"
                    />
                    <Field
                      label="Account number"
                      value={bank.accountNumber}
                      onChange={(value) =>
                        setBank((current) => ({ ...current, accountNumber: value }))
                      }
                      placeholder="Enter account number"
                    />
                    <Field
                      label="IFSC"
                      value={bank.ifsc}
                      onChange={(value) =>
                        setBank((current) => ({ ...current, ifsc: value.toUpperCase() }))
                      }
                      placeholder="Example: HDFC0000041"
                    />
                    <SelectField
                      label="State"
                      value={bank.state}
                      options={indianStateOptions}
                      onChange={(value) => setBank((current) => ({ ...current, state: value }))}
                    />
                    <Field
                      label="City"
                      value={bank.city}
                      onChange={(value) => setBank((current) => ({ ...current, city: value }))}
                      placeholder="Enter city"
                    />
                    <Field
                      label="Branch"
                      value={bank.branch}
                      onChange={(value) => setBank((current) => ({ ...current, branch: value }))}
                      placeholder="Enter branch"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={lookupIfscByBranch}
                      disabled={ifscLoading}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
                    >
                      {ifscLoading ? "Searching..." : "Search IFSC by branch"}
                    </button>
                    <button
                      type="button"
                      onClick={validateIfsc}
                      disabled={ifscLoading}
                      className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                    >
                      Validate IFSC
                    </button>
                  </div>

                  {ifscResults.length > 0 && (
                    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">IFSC matches</p>
                      <div className="mt-3 space-y-3">
                        {ifscResults.map((result) => (
                          <button
                            key={result.ifsc}
                            type="button"
                            onClick={() =>
                              setBank((current) => ({
                                ...current,
                                bankName: result.bank,
                                ifsc: result.ifsc,
                                branch: result.branch,
                                city: result.city,
                                state: result.state,
                              }))
                            }
                            className="flex w-full items-center justify-between rounded-[1rem] border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {result.bank} - {result.branch}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {result.city}, {result.state}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-slate-900">
                                {result.ifsc}
                              </p>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                {result.source || "lookup"}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <ToggleCard
                    checked={bank.payoutConsent}
                    label="Payout consent"
                    description="Worker agrees to store bank details for payout and settlement verification."
                    onToggle={() =>
                      setBank((current) => ({
                        ...current,
                        payoutConsent: !current.payoutConsent,
                      }))
                    }
                  />
                </div>
              )}

              {activeStep === "location" && (
                <div className="space-y-5">
                  <StepHeader
                    icon={<LocateFixed className="h-5 w-5" />}
                    title="Live location for dispatch"
                    description="Capture the worker's current live coordinates so nearest-job assignment can use the worker's real position."
                  />

                  <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Worker location capture
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Use browser location permission to store live coordinates.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={captureLocation}
                        disabled={busyAction === "location"}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        {busyAction === "location" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LocateFixed className="h-4 w-4" />
                        )}
                        Capture location
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <Field
                        label="Latitude"
                        value={location.latitude?.toString() || ""}
                        onChange={(value) =>
                          setLocation((current) => ({
                            ...current,
                            latitude: value ? Number(value) : null,
                          }))
                        }
                        placeholder="Auto-captured latitude"
                      />
                      <Field
                        label="Longitude"
                        value={location.longitude?.toString() || ""}
                        onChange={(value) =>
                          setLocation((current) => ({
                            ...current,
                            longitude: value ? Number(value) : null,
                          }))
                        }
                        placeholder="Auto-captured longitude"
                      />
                      <Field
                        label="Location label"
                        value={location.label}
                        onChange={(value) => setLocation((current) => ({ ...current, label: value }))}
                        placeholder="Example: Salt Lake worker zone"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === "assignment" && (
                <div className="space-y-5">
                  <StepHeader
                    icon={<BadgeCheck className="h-5 w-5" />}
                    title="Booking configuration and worker access"
                    description="Review the worker ID, reference number, phone details, activation state, and the handoff into appointment dispatch."
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoPanel
                      label="Worker ID"
                      value={applicationResult?.workerCode || "Generated after submission"}
                    />
                    <InfoPanel
                      label="Reference number"
                      value={applicationResult?.referenceNumber || "Generated after submission"}
                    />
                    <InfoPanel label="Phone" value={profile.phone || "Worker phone not entered"} />
                    <InfoPanel
                      label="Primary service"
                      value={profile.primaryService || "Worker service not set"}
                    />
                    <InfoPanel label="City" value={profile.city || "City not selected"} />
                    <InfoPanel
                      label="Verification state"
                      value={
                        applicationResult?.verificationStatus
                          ? toSentenceCase(applicationResult.verificationStatus)
                          : "Pending submission"
                      }
                    />
                  </div>

                  <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
                    Once the customer completes booking and payment, the assignment
                    engine looks for the nearest verified worker by service, city,
                    and live location. The worker dashboard below is where field
                    teams can accept the job, share live location, and move the
                    booking step-by-step until completion.
                  </div>
                </div>
              )}

              <StatusBanner state={submissionState} />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(workerOnboardingSteps[Math.max(stepIndex - 1, 0)].key)}
                  disabled={stepIndex === 0}
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {activeStep !== "assignment" ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveStep(
                          workerOnboardingSteps[Math.min(stepIndex + 1, workerOnboardingSteps.length - 1)].key
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitApplication}
                      disabled={busyAction === "submit-worker"}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                    >
                      {busyAction === "submit-worker" && <Loader2 className="h-4 w-4 animate-spin" />}
                      Submit worker listing
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-panel rounded-[2rem] border border-slate-200/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Worker appointments
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Assigned booking dashboard
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Workers can access their booking queue using the worker ID and registered phone number.
              </p>
            </div>
            <button
              type="button"
              onClick={captureLocation}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh live location
            </button>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Worker ID"
                value={dashboardAccess.workerCode}
                onChange={(value) =>
                  setDashboardAccess((current) => ({ ...current, workerCode: value.toUpperCase() }))
                }
                placeholder="Example: SFX-WKR-AB12CD34"
              />
              <Field
                label="Registered phone"
                value={dashboardAccess.phone}
                onChange={(value) => setDashboardAccess((current) => ({ ...current, phone: value }))}
                placeholder="10-digit worker phone"
              />
            </div>
            <button
              type="button"
              onClick={() => loadDashboard()}
              disabled={busyAction === "load-dashboard"}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {busyAction === "load-dashboard" && <Loader2 className="h-4 w-4 animate-spin" />}
              Open worker dashboard
            </button>
            <StatusBanner state={dashboardState} />
          </div>

          {dashboard && (
            <div className="mt-6 space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {dashboard.worker.fullName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {dashboard.worker.workerCode} | {dashboard.worker.referenceNumber}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      dashboard.worker.verified && dashboard.worker.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {dashboard.worker.verified && dashboard.worker.active
                      ? "Active and assignable"
                      : "Pending activation"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InfoPanel label="Primary service" value={dashboard.worker.service} />
                  <InfoPanel label="Phone" value={dashboard.worker.phone} />
                  <InfoPanel label="Coverage city" value={dashboard.worker.city} />
                  <InfoPanel label="Current zone" value={dashboard.worker.currentArea || "Not set"} />
                </div>

                {dashboard.worker.bank && (
                  <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Registered payout bank</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {dashboard.worker.bank.bankName} | {dashboard.worker.bank.accountHolderName} |{" "}
                      {dashboard.worker.bank.accountNumberMasked} | {dashboard.worker.bank.ifsc}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {dashboard.worker.bank.verificationStatus}
                    </p>
                  </div>
                )}
              </div>

              {activeBooking && (
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        Current booking
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">
                        {activeBooking.bookingCode} - {activeBooking.service}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {activeBooking.customerName} | {activeBooking.customerPhone} |{" "}
                        {activeBooking.city}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusTone(activeBooking.status)}`}>
                      {toSentenceCase(activeBooking.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Address
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        {activeBooking.address || "Customer address not available."}
                      </p>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {activeBooking.customerPhone || "Phone not available"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-slate-400" />
                          {activeBooking.preferredDate || "Date flexible"} |{" "}
                          {activeBooking.preferredSlot || "Slot flexible"}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Booking configuration
                      </p>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p>Booking ID: {activeBooking.bookingId}</p>
                        <p>Reference: {dashboard.worker.referenceNumber}</p>
                        <p>Worker ID: {dashboard.worker.workerCode}</p>
                        <p>Payment: {toSentenceCase(activeBooking.paymentStatus)}</p>
                        <p>
                          Live location:{" "}
                          {activeBooking.workerLiveLocation?.label ||
                            dashboard.worker.currentArea ||
                            "Not shared yet"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <WorkerTrackingMap
                      customerCoordinates={activeBooking.customerLocation}
                      workerCoordinates={
                        activeBooking.workerLiveLocation?.coordinates ||
                        dashboard.worker.liveCoordinates
                      }
                      workerLabel={dashboard.worker.fullName}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {workerDashboardActions.map((action) => (
                      <button
                        key={action.key}
                        type="button"
                        onClick={() => runBookingAction(action.key, activeBooking.bookingId)}
                        disabled={busyAction === `${action.key}-${activeBooking.bookingId}`}
                        className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-300 disabled:opacity-60"
                      >
                        <p className="text-sm font-semibold text-slate-950">{action.label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {action.description}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-900">Timeline</p>
                    <div className="mt-4 space-y-3">
                      {activeBooking.timeline.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-[1.15rem] border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-950">
                              {event.title}
                            </p>
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusTone(event.status)}`}
                            >
                              {toSentenceCase(event.status)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {event.description}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                            {formatTrackingTimestamp(event.at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-950">Assigned and recent bookings</p>
                <div className="mt-4 space-y-3">
                  {dashboard.bookings.length === 0 ? (
                    <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                      No assigned bookings yet. The worker will start receiving jobs once the listing is verified, active, and within service coverage.
                    </div>
                  ) : (
                    dashboard.bookings.map((booking) => (
                      <div
                        key={booking.bookingId}
                        className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">
                              {booking.bookingCode} - {booking.service}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {booking.customerName} | {booking.city} | {booking.customerPhone}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusTone(booking.status)}`}>
                              {toSentenceCase(booking.status)}
                            </span>
                            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                              Updated {formatDateTime(booking.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3 text-slate-700">
        <div className="rounded-full bg-slate-100 p-2">{icon}</div>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function StepHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
        {icon}
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-[1rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-[1rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleCard({
  checked,
  label,
  description,
  onToggle,
}: {
  checked: boolean;
  label: string;
  description: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-[1.25rem] border p-4 text-left transition ${
        checked
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div
          className={`mt-1 h-6 w-11 rounded-full transition ${
            checked ? "bg-emerald-500" : "bg-slate-200"
          }`}
        >
          <div
            className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              checked ? "ml-5" : "ml-0.5"
            }`}
          />
        </div>
      </div>
    </button>
  );
}

function StatusBanner({ state }: { state: ApiState }) {
  if (state.type === "idle" || !state.message) {
    return null;
  }

  const tone =
    state.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : state.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`mt-4 rounded-[1.25rem] border px-4 py-3 text-sm leading-6 ${tone}`}>
      {state.message}
    </div>
  );
}

function InfoPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
