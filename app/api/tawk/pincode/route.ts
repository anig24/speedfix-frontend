import { corsJson, optionsResponse } from "../_shared";

const pincodePattern = /^\d{6}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode") || "";

  if (!pincodePattern.test(pincode)) {
    return corsJson(
      {
        valid: false,
        pincode,
        error: "Enter a valid 6 digit Indian pincode.",
      },
      { status: 400 }
    );
  }

  const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
    cache: "no-store",
  });
  const data = (await response.json().catch(() => [])) as Array<{
    Status?: string;
    PostOffice?: Array<{
      Name?: string;
      District?: string;
      State?: string;
    }>;
  }>;

  const result = data[0];
  const postOffices = result?.PostOffice || [];
  const firstPostOffice = postOffices[0];

  return corsJson({
    valid: result?.Status === "Success",
    pincode,
    district: firstPostOffice?.District || "",
    state: firstPostOffice?.State || "",
    postOffices: postOffices
      .map((item) => item.Name)
      .filter((name): name is string => Boolean(name)),
  });
}

export function OPTIONS() {
  return optionsResponse();
}
