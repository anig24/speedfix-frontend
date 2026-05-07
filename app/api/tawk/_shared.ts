import { NextResponse } from "next/server";
import {
  getServiceBySlug,
  operatingCities,
  serviceCatalog,
  type ServiceCatalogItem,
} from "@/lib/serviceCatalog";

export const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

export function corsJson(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init?.headers || {}),
    },
  });
}

export function optionsResponse() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export function serviceSummary(service: ServiceCatalogItem) {
  return {
    slug: service.slug,
    name: service.name,
    tagline: service.tagline,
    description: service.description,
    basePrice: service.basePrice,
    responseTime: service.responseTime,
    coverage: service.coverage,
    rating: service.rating,
    reviews: service.reviews,
    offer: service.offer,
    serviceUrl: `/services/${service.slug}`,
    searchTerms: service.searchTerms,
    highlights: service.highlights,
    problemsSolved: service.problemsSolved,
    packages: service.packages.map((item) => ({
      name: item.name,
      price: item.price,
      description: item.description,
      turnaround: item.turnaround,
    })),
    subcategories: service.subcategories.map((subcategory) => ({
      slug: subcategory.slug,
      name: subcategory.name,
      tagline: subcategory.tagline,
      starterPrice: subcategory.starterPrice,
      turnaround: subcategory.turnaround,
      recommendedPackage: subcategory.recommendedPackage,
      serviceUrl: `/services/${service.slug}/${subcategory.slug}`,
      problemSignals: subcategory.problemSignals,
    })),
  };
}

export function searchServices(query: string, limit: number) {
  const cleanQuery = query.trim().toLowerCase();
  const services = cleanQuery ? scoreServices(cleanQuery) : serviceCatalog;

  return services.slice(0, Math.max(1, Math.min(limit, 30)));
}

function scoreServices(query: string) {
  const queryWords = query.split(/\s+/).filter(Boolean);

  return serviceCatalog
    .map((service) => {
      const primaryTerms = [service.name, service.slug, ...service.searchTerms].map(
        normalizeSearchText
      );
      const secondaryTerms = [
        service.tagline,
        service.description,
        service.offer,
        service.coverage,
        ...service.problemsSolved,
        ...service.subcategories.flatMap((subcategory) => [
          subcategory.name,
          subcategory.slug,
          subcategory.tagline,
          subcategory.description,
          ...subcategory.problemSignals,
        ]),
      ].map(normalizeSearchText);

      let score = 0;

      for (const term of primaryTerms) {
        if (term === query) {
          score += 80;
        } else if (term.split(/\s+/).includes(query)) {
          score += 50;
        } else if (query.length > 2 && term.includes(query)) {
          score += 25;
        }
      }

      for (const term of secondaryTerms) {
        if (term === query) {
          score += 25;
        } else if (term.split(/\s+/).includes(query)) {
          score += 15;
        } else if (
          query.length > 2 &&
          queryWords.every((word) => term.includes(word))
        ) {
          score += 8;
        }
      }

      return { service, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.service);
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getBookingGuide(serviceSlug?: string | null) {
  const service = serviceSlug ? getServiceBySlug(serviceSlug) : null;

  return {
    service: service ? serviceSummary(service) : null,
    cities: operatingCities,
    steps: [
      "Choose the service category or exact task.",
      "Share name, phone, city, pincode, address, and issue summary.",
      "Pick preferred date and slot if available.",
      "SpeedFix creates a pending service request and follows up for confirmation.",
      "Customer can continue to checkout/cart for paid booking where applicable.",
    ],
    requiredLeadFields: [
      "service",
      "name",
      "phone",
      "city",
      "pincode",
      "address",
    ],
    optionalLeadFields: [
      "preferredDate",
      "preferredSlot",
      "propertyType",
      "issueSummary",
    ],
    leadEndpoint: "/api/service-requests",
  };
}
