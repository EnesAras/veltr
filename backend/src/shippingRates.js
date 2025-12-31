const shippingRates = [
  { id: "standard", label: "Standard Delivery (5-7 business days)", price: 0 },
  { id: "express", label: "Express Delivery (2 business days)", price: 19 }
];

export function listShippingRates() {
  return shippingRates;
}
