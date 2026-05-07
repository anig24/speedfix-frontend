import { corsHeaders, corsJson } from "../_shared";

export const runtime = "nodejs";

function getBaseUrl(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function createOpenApiSpec(request: Request) {
  const baseUrl = getBaseUrl(request);

  return {
    openapi: "3.0.3",
    info: {
      title: "SpeedFix Tawk Automation API",
      version: "1.0.0",
      description:
        "Public SpeedFix endpoints for Tawk.to automation. Use these actions to answer service, pricing, city, pincode, and booking lead questions.",
    },
    servers: [
      {
        url: baseUrl,
        description: "SpeedFix website API",
      },
    ],
    paths: {
      "/api/tawk/services": {
        get: {
          operationId: "searchSpeedFixServices",
          summary: "Search SpeedFix services",
          description:
            "Find available SpeedFix service categories, starter prices, packages, and task pages.",
          parameters: [
            {
              name: "query",
              in: "query",
              required: false,
              schema: { type: "string" },
              description:
                "Search text such as AC, leak, cleaning, painting, electrician, appliance, CCTV, or maid.",
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", minimum: 1, maximum: 30, default: 12 },
            },
          ],
          responses: {
            "200": {
              description: "Matching services",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ServiceSearchResponse" },
                },
              },
            },
          },
        },
      },
      "/api/tawk/services/{serviceSlug}": {
        get: {
          operationId: "getSpeedFixService",
          summary: "Get one SpeedFix service",
          description:
            "Return detail for a service category, including packages, subcategories, and task URLs.",
          parameters: [
            {
              name: "serviceSlug",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Service slug such as ac-service, plumbing, or cleaning.",
            },
          ],
          responses: {
            "200": {
              description: "Service detail",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ServiceDetailResponse" },
                },
              },
            },
            "404": {
              description: "Service not found",
            },
          },
        },
      },
      "/api/tawk/cities": {
        get: {
          operationId: "getSpeedFixCities",
          summary: "Get SpeedFix operating cities",
          responses: {
            "200": {
              description: "Operating city list",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CitiesResponse" },
                },
              },
            },
          },
        },
      },
      "/api/tawk/pincode": {
        get: {
          operationId: "checkIndianPincode",
          summary: "Check Indian pincode details",
          description:
            "Validate a 6 digit Indian pincode and return district/state details for customer location capture.",
          parameters: [
            {
              name: "pincode",
              in: "query",
              required: true,
              schema: { type: "string", pattern: "^\\d{6}$" },
            },
          ],
          responses: {
            "200": {
              description: "Pincode result",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PincodeResponse" },
                },
              },
            },
            "400": { description: "Invalid pincode" },
          },
        },
      },
      "/api/tawk/booking-guide": {
        get: {
          operationId: "getSpeedFixBookingGuide",
          summary: "Get booking or lead capture instructions",
          description:
            "Use this to explain the booking flow and identify fields needed to create a SpeedFix service request.",
          parameters: [
            {
              name: "serviceSlug",
              in: "query",
              required: false,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Booking guide",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/BookingGuideResponse" },
                },
              },
            },
          },
        },
      },
      "/api/service-requests": {
        post: {
          operationId: "createSpeedFixServiceRequest",
          summary: "Create a SpeedFix service lead",
          description:
            "Create a pending SpeedFix service request after collecting required customer details in Tawk chat.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateServiceRequestBody" },
              },
            },
          },
          responses: {
            "200": {
              description: "Created service request",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateServiceRequestResponse" },
                },
              },
            },
            "400": {
              description: "Missing or invalid customer details",
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ServiceSearchResponse: {
          type: "object",
          properties: {
            query: { type: "string" },
            count: { type: "integer" },
            services: {
              type: "array",
              items: { $ref: "#/components/schemas/Service" },
            },
          },
        },
        ServiceDetailResponse: {
          type: "object",
          properties: {
            service: { $ref: "#/components/schemas/Service" },
          },
        },
        CitiesResponse: {
          type: "object",
          properties: {
            cities: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        PincodeResponse: {
          type: "object",
          properties: {
            valid: { type: "boolean" },
            pincode: { type: "string" },
            district: { type: "string" },
            state: { type: "string" },
            postOffices: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        BookingGuideResponse: {
          type: "object",
          properties: {
            service: {
              nullable: true,
              allOf: [{ $ref: "#/components/schemas/Service" }],
            },
            cities: {
              type: "array",
              items: { type: "string" },
            },
            steps: {
              type: "array",
              items: { type: "string" },
            },
            requiredLeadFields: {
              type: "array",
              items: { type: "string" },
            },
            optionalLeadFields: {
              type: "array",
              items: { type: "string" },
            },
            leadEndpoint: { type: "string" },
          },
        },
        CreateServiceRequestBody: {
          type: "object",
          required: ["service", "name", "phone", "city", "pincode", "address"],
          properties: {
            service: {
              type: "string",
              description: "Service slug, for example ac-service or plumbing.",
            },
            name: { type: "string" },
            phone: {
              type: "string",
              description: "10 digit Indian mobile number.",
            },
            city: { type: "string" },
            pincode: { type: "string" },
            address: { type: "string" },
            preferredDate: { type: "string", format: "date" },
            preferredSlot: { type: "string" },
            propertyType: { type: "string" },
            issueSummary: { type: "string" },
          },
        },
        CreateServiceRequestResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            bookingId: { type: "string" },
            status: { type: "string" },
            serviceName: { type: "string" },
          },
        },
        Service: {
          type: "object",
          properties: {
            slug: { type: "string" },
            name: { type: "string" },
            tagline: { type: "string" },
            description: { type: "string" },
            basePrice: { type: "number" },
            responseTime: { type: "string" },
            coverage: { type: "string" },
            rating: { type: "number" },
            reviews: { type: "string" },
            offer: { type: "string" },
            serviceUrl: { type: "string" },
            searchTerms: {
              type: "array",
              items: { type: "string" },
            },
            highlights: {
              type: "array",
              items: { type: "string" },
            },
            problemsSolved: {
              type: "array",
              items: { type: "string" },
            },
            packages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                  turnaround: { type: "string" },
                },
              },
            },
            subcategories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  slug: { type: "string" },
                  name: { type: "string" },
                  tagline: { type: "string" },
                  starterPrice: { type: "number" },
                  turnaround: { type: "string" },
                  recommendedPackage: { type: "string" },
                  serviceUrl: { type: "string" },
                  problemSignals: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export async function GET(request: Request) {
  return corsJson(createOpenApiSpec(request));
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
