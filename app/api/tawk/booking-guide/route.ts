import { corsJson, getBookingGuide, optionsResponse } from "../_shared";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return corsJson(getBookingGuide(searchParams.get("serviceSlug")));
}

export function OPTIONS() {
  return optionsResponse();
}
