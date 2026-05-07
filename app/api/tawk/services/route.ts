import { corsJson, optionsResponse, searchServices, serviceSummary } from "../_shared";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const limit = Number(searchParams.get("limit") || 12);
  const services = searchServices(query, Number.isFinite(limit) ? limit : 12);

  return corsJson({
    query,
    count: services.length,
    services: services.map(serviceSummary),
  });
}

export function OPTIONS() {
  return optionsResponse();
}
