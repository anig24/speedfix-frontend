import { operatingCities } from "@/lib/serviceCatalog";
import { corsJson, optionsResponse } from "../_shared";

export async function GET() {
  return corsJson({
    cities: operatingCities,
  });
}

export function OPTIONS() {
  return optionsResponse();
}
