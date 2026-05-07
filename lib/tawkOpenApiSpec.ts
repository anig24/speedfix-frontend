const SPEEDFIX_PUBLIC_BASE_URL = "https://www.speedfix.co.in";

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeBaseUrl(value: string) {
  const cleanValue = stripTrailingSlash(value.trim());

  if (/^https:\/\/(www\.)?speedfix\.co\.in$/i.test(cleanValue)) {
    return SPEEDFIX_PUBLIC_BASE_URL;
  }

  return cleanValue;
}

export function getTawkOpenApiBaseUrl(request: Request) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredBaseUrl?.trim()) {
    return normalizeBaseUrl(configuredBaseUrl);
  }

  const requestUrl = new URL(request.url);
  return normalizeBaseUrl(`${requestUrl.protocol}//${requestUrl.host}`);
}

const stringArraySchema = {
  type: "array",
  items: { type: "string" },
};

const serviceSchema = {
  type: "object",
  description:
    "SpeedFix service summary with customer-facing pricing, response time, and booking context.",
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
    searchTerms: stringArraySchema,
    highlights: stringArraySchema,
    problemsSolved: stringArraySchema,
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
          problemSignals: stringArraySchema,
        },
      },
    },
  },
};

const errorResponseContent = {
  "application/json": {
    schema: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export function createTawkOpenApiSpec(baseUrl: string) {
  return {
    openapi: "3.0.0",
    info: {
      title: "SpeedFix Tawk Automation API",
      version: "1.0.0",
      description:
        "Public SpeedFix endpoints for tawk.to AI Assist. Use these actions to answer service, pricing, city, pincode, and booking lead questions using only SpeedFix API data.",
      license: {
        name: "Proprietary",
        url: "https://www.speedfix.co.in/terms",
      },
    },
    servers: [
      {
        url: normalizeBaseUrl(baseUrl),
        description: "SpeedFix website API",
      },
    ],
    security: [],
    paths: {
      "/api/tawk/services": {
        get: {
          operationId: "searchSpeedFixServices",
          summary: "Search SpeedFix services",
          description:
            "Use when a customer asks for available services, prices, packages, common repair categories, or which SpeedFix service matches their issue. Extract the service keyword from the chat message.",
          parameters: [
            {
              name: "query",
              in: "query",
              required: false,
              description:
                "Customer search text such as AC, leak, cleaning, painting, electrician, appliance, CCTV, or maid.",
              schema: { type: "string" },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              description: "Maximum number of services to return.",
              schema: { type: "integer", minimum: 1, maximum: 30, default: 12 },
            },
          ],
          responses: {
            "200": {
              description:
                "Matching service categories. Use name, description, basePrice, packages, and serviceUrl to answer the customer.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      query: { type: "string" },
                      count: { type: "integer" },
                      services: {
                        type: "array",
                        items: serviceSchema,
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid search request.",
              content: errorResponseContent,
            },
          },
        },
      },
      "/api/tawk/services/{serviceSlug}": {
        get: {
          operationId: "getSpeedFixService",
          summary: "Get one SpeedFix service",
          description:
            "Use after a service category is known to retrieve full SpeedFix details, packages, subcategories, response time, and booking URLs.",
          parameters: [
            {
              name: "serviceSlug",
              in: "path",
              required: true,
              description:
                "Service slug from searchSpeedFixServices, for example ac-service, plumbing, cleaning, electrician, or appliance-repair.",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description:
                "Service detail. Use this response to answer detailed service, price, package, and task page questions.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      service: serviceSchema,
                    },
                  },
                },
              },
            },
            "404": {
              description: "Service not found.",
              content: errorResponseContent,
            },
            "400": {
              description: "Invalid service detail request.",
              content: errorResponseContent,
            },
          },
        },
      },
      "/api/tawk/cities": {
        get: {
          operationId: "getSpeedFixCities",
          summary: "Get SpeedFix operating cities",
          description:
            "Use when a customer asks where SpeedFix operates or whether their city may be covered.",
          responses: {
            "200": {
              description:
                "Operating city list. If the customer's city is not listed, explain that the team can still review availability during follow-up.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      cities: stringArraySchema,
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid city request.",
              content: errorResponseContent,
            },
          },
        },
      },
      "/api/tawk/pincode": {
        get: {
          operationId: "checkIndianPincode",
          summary: "Check Indian pincode details",
          description:
            "Use when a customer shares an Indian pincode. Validate that it is six digits and return district, state, and post office details for location capture.",
          parameters: [
            {
              name: "pincode",
              in: "query",
              required: true,
              description: "Six digit Indian pincode from the customer.",
              schema: { type: "string", pattern: "^\\d{6}$" },
            },
          ],
          responses: {
            "200": {
              description:
                "Pincode result. Use district and state to confirm the customer's location.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      valid: { type: "boolean" },
                      pincode: { type: "string" },
                      district: { type: "string" },
                      state: { type: "string" },
                      postOffices: stringArraySchema,
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid pincode.",
              content: errorResponseContent,
            },
          },
        },
      },
      "/api/tawk/booking-guide": {
        get: {
          operationId: "getSpeedFixBookingGuide",
          summary: "Get booking or lead capture instructions",
          description:
            "Use when a customer wants to book a service or asks what details are needed. This returns the lead fields AI Assist should collect before creating a request.",
          parameters: [
            {
              name: "serviceSlug",
              in: "query",
              required: false,
              description:
                "Known service slug if the customer has selected a SpeedFix service.",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description:
                "Booking guide with fields to collect before creating a SpeedFix service request.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      service: {
                        type: "object",
                        description:
                          "Selected service summary when serviceSlug matches; otherwise this may be empty.",
                      },
                      cities: stringArraySchema,
                      steps: stringArraySchema,
                      requiredLeadFields: stringArraySchema,
                      optionalLeadFields: stringArraySchema,
                      leadEndpoint: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid booking guide request.",
              content: errorResponseContent,
            },
          },
        },
      },
      "/api/service-requests": {
        post: {
          operationId: "createSpeedFixServiceRequest",
          summary: "Create a SpeedFix service lead",
          description:
            "Use only after collecting service, name, 10 digit Indian phone number, city, pincode, and full address. Creates a pending SpeedFix service request for team follow-up.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["service", "name", "phone", "city", "pincode", "address"],
                  properties: {
                    service: {
                      type: "string",
                      description:
                        "SpeedFix service slug, for example ac-service or plumbing.",
                    },
                    name: {
                      type: "string",
                      description: "Customer full name.",
                    },
                    phone: {
                      type: "string",
                      description:
                        "Customer 10 digit Indian mobile number, without country code.",
                    },
                    city: {
                      type: "string",
                      description: "Customer city.",
                    },
                    pincode: {
                      type: "string",
                      description: "Customer six digit Indian pincode.",
                    },
                    address: {
                      type: "string",
                      description: "Complete service address.",
                    },
                    preferredDate: {
                      type: "string",
                      format: "date",
                      description: "Preferred visit date in YYYY-MM-DD format.",
                    },
                    preferredSlot: {
                      type: "string",
                      description: "Preferred time slot if the customer provides one.",
                    },
                    propertyType: {
                      type: "string",
                      description:
                        "Property type such as apartment, independent house, office, or shop.",
                    },
                    issueSummary: {
                      type: "string",
                      description:
                        "Short description of the customer's issue or requested work.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Created service request. Share the bookingId and tell the customer SpeedFix will follow up.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      bookingId: { type: "string" },
                      status: { type: "string" },
                      serviceName: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Missing or invalid customer details.",
              content: errorResponseContent,
            },
          },
        },
      },
    },
  };
}
