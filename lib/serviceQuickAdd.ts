import { addItemToCart, type CartItem } from "@/lib/cart";
import type {
  ServiceCatalogItem,
  ServiceSubcategory,
} from "@/lib/serviceCatalog";

function createCartId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export function buildQuickCartItem(
  service: ServiceCatalogItem,
  subcategory?: ServiceSubcategory
): CartItem {
  const preferredSubcategory = subcategory || service.subcategories[0];
  const selectedPackage =
    service.packages.find(
      (item) => item.name === preferredSubcategory?.recommendedPackage
    ) ||
    service.packages[1] ||
    service.packages[0];

  return {
    id: createCartId(),
    serviceSlug: service.slug,
    serviceName: service.name,
    serviceImage: service.image,
    subcategorySlug: preferredSubcategory?.slug,
    subcategoryName: preferredSubcategory?.name,
    packageName: selectedPackage.name,
    packagePrice: selectedPackage.price,
    addons: [],
    quantity: 1,
    turnaround: selectedPackage.turnaround,
  };
}

export function quickAddServiceToCart(
  service: ServiceCatalogItem,
  subcategory?: ServiceSubcategory
) {
  const item = buildQuickCartItem(service, subcategory);
  addItemToCart(item);
  return item;
}
