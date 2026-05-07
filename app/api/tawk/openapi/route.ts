import { corsHeaders, corsJson } from "../_shared";
import {
  createTawkOpenApiSpec,
  getTawkOpenApiBaseUrl,
} from "@/lib/tawkOpenApiSpec";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return corsJson(createTawkOpenApiSpec(getTawkOpenApiBaseUrl(request)));
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
