import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const pincode = searchParams.get("pincode");

  try {
    let apiUrl = "";

    if (pincode) {
      apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
    } else if (city) {
      apiUrl = `https://api.postalpincode.in/postoffice/${city}`;
    } else {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
