import { getServiceBySlug } from "@/lib/serviceCatalog";
import { corsJson, optionsResponse, serviceSummary } from "../../_shared";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ serviceSlug: string }> }
) {
  const { serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return corsJson({ error: "Service not found." }, { status: 404 });
  }

  return corsJson({
    service: serviceSummary(service),
  });
}

export function OPTIONS() {
  return optionsResponse();
}
