const categories = [
  { id: "cat-over-ear", name: "Over-Ear", slug: "over-ear" },
  { id: "cat-earbuds", name: "Earbuds", slug: "earbuds" },
  { id: "cat-studio", name: "Studio", slug: "studio" },
  { id: "cat-gaming", name: "Gaming", slug: "gaming" },
  { id: "cat-accessories", name: "Accessories", slug: "accessories" }
];

const products = [
  {
    id: "veltr-aero-flagship",
    name: "VELTR Aero Flagship",
    price: 1299,
    image: "/assets/veltr/grid-01.jpg",
    category: "over-ear",
    description:
      "Dual X drivers, carbon fiber headband, and memory-foam cushions that cradle your head for marathon listening.",
    createdAt: "2025-09-12T10:00:00Z"
  },
  {
    id: "veltr-nova-studio",
    name: "VELTR Nova Studio Edition",
    price: 999,
    image: "/assets/veltr/grid-02.jpg",
    category: "studio",
    description: "Active noise control, hi-res DAC, and modular earcups tuned for mixing, mastering, and cine playback.",
    createdAt: "2025-08-03T09:15:00Z"
  },
  {
    id: "veltr-echo-earbuds",
    name: "VELTR Echo Wireless Earbuds",
    price: 399,
    image: "/assets/veltr/grid-03.jpg",
    category: "earbuds",
    description: "Featherweight true wireless buds with spatial audio, adaptive EQ, and 28-hour combined runtime.",
    createdAt: "2025-07-18T11:30:00Z"
  },
  {
    id: "veltr-pulse-gaming",
    name: "VELTR Pulse Gaming Headset",
    price: 449,
    image: "/assets/veltr/grid-04.jpg",
    category: "gaming",
    description: "Surround-drive and low-latency wireless for competitive play plus ambient pass-through when the battle pauses.",
    createdAt: "2025-06-25T13:45:00Z"
  },
  {
    id: "veltr-aurora-anc",
    name: "VELTR Aurora ANC",
    price: 899,
    image: "/assets/veltr/grid-05.jpg",
    category: "over-ear",
    description: "Ceramic finish, transparent hearing, and haptics for tactile tone cues that never break concentration.",
    createdAt: "2025-05-15T08:25:00Z"
  },
  {
    id: "veltr-arc-stand",
    name: "VELTR Arc Charging Stand",
    price: 189,
    image: "/assets/veltr/grid-06.jpg",
    category: "accessories",
    description: "Magnetic charging cradle and balanced audio stand that keeps your collection on display and ready to go.",
    createdAt: "2025-04-09T12:10:00Z"
  },
  {
    id: "veltr-signal-bass",
    name: "VELTR Signal Bass Monitor",
    price: 749,
    image: "/assets/veltr/grid-07.jpg",
    category: "studio",
    description: "Reference monitors with low-end warmth and studio-accurate imaging for engineers and audiophiles.",
    createdAt: "2025-02-22T15:50:00Z"
  },
  {
    id: "veltr-lumen-case",
    name: "VELTR Lumen Case",
    price: 159,
    image: "/assets/veltr/grid-08.jpg",
    category: "accessories",
    description: "Aluminum travel case with integrated charging dock keeps earbuds and charger in sync.",
    createdAt: "2025-01-18T09:20:00Z"
  }
];

export function listProducts() {
  return products;
}

export function getCategories() {
  return categories;
}

export function findProductById(id) {
  return products.find((product) => product.id === id) ?? null;
}
