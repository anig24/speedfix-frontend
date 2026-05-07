import { NextResponse } from "next/server";
import {
  createTawkOpenApiSpec,
  getTawkOpenApiBaseUrl,
} from "@/lib/tawkOpenApiSpec";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

export async function GET(request: Request) {
  return NextResponse.json(createTawkOpenApiSpec(getTawkOpenApiBaseUrl(request)), {
    headers: corsHeaders,
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
