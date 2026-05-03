import { NextResponse } from "next/server";
import {
  knownIfscBranches,
  normalizeWorkerSearch,
  type WorkerBankBranch,
} from "@/lib/workerPortal";

type RazorpayIfscResponse = {
  BANK?: string;
  IFSC?: string;
  BRANCH?: string;
  ADDRESS?: string;
  CITY?: string;
  DISTRICT?: string;
  STATE?: string;
  CONTACT?: string | null;
  UPI?: boolean;
  NEFT?: boolean;
  RTGS?: boolean;
  IMPS?: boolean;
};

function mapBranch(branch: WorkerBankBranch) {
  return {
    bank: branch.bank,
    ifsc: branch.ifsc,
    branch: branch.branch,
    city: branch.city,
    state: branch.state,
    source: "speedfix-directory",
  };
}

async function lookupIfsc(ifsc: string) {
  const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as RazorpayIfscResponse;

  return {
    bank: data.BANK || "",
    ifsc: data.IFSC || ifsc,
    branch: data.BRANCH || "",
    city: data.CITY || data.DISTRICT || "",
    state: data.STATE || "",
    address: data.ADDRESS || "",
    contact: data.CONTACT || "",
    enabled: {
      upi: Boolean(data.UPI),
      neft: Boolean(data.NEFT),
      rtgs: Boolean(data.RTGS),
      imps: Boolean(data.IMPS),
    },
    source: "razorpay-ifsc",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ifsc = (searchParams.get("ifsc") || "").trim().toUpperCase();

  if (ifsc) {
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      return NextResponse.json(
        { error: "Enter a valid 11-character IFSC code." },
        { status: 400 }
      );
    }

    const result = await lookupIfsc(ifsc);

    if (!result) {
      return NextResponse.json(
        { error: "No bank branch found for this IFSC." },
        { status: 404 }
      );
    }

    return NextResponse.json({ result });
  }

  const bank = normalizeWorkerSearch(searchParams.get("bank") || "");
  const state = normalizeWorkerSearch(searchParams.get("state") || "");
  const city = normalizeWorkerSearch(searchParams.get("city") || "");
  const branch = normalizeWorkerSearch(searchParams.get("branch") || "");

  const results = knownIfscBranches
    .filter((item) => {
      const bankMatch = !bank || normalizeWorkerSearch(item.bank).includes(bank);
      const stateMatch = !state || normalizeWorkerSearch(item.state).includes(state);
      const cityMatch = !city || normalizeWorkerSearch(item.city).includes(city);
      const branchMatch =
        !branch || normalizeWorkerSearch(item.branch).includes(branch);

      return bankMatch && stateMatch && cityMatch && branchMatch;
    })
    .slice(0, 12)
    .map(mapBranch);

  return NextResponse.json({
    results,
    note:
      "Search suggestions use SpeedFix's branch directory. Exact IFSC validation uses Razorpay IFSC data.",
  });
}
