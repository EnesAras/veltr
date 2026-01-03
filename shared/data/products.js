const HERO_IMAGES = [
  {
    id: "veltr-hero-01",
    title: "Veltr Aero Flagship",
    image: "/assets/veltr/hero-01.jpg",
    description: "Over-ear flagship with carbon mesh drivers and sculpted headband."
  },
  {
    id: "veltr-hero-02",
    title: "Veltr Echo Earbuds",
    image: "/assets/veltr/hero-02.jpg",
    description: "True wireless buds with adaptive EQ and spatial audio."
  },
  {
    id: "veltr-hero-03",
    title: "Veltr Nova Studio",
    image: "/assets/veltr/hero-03.jpg",
    description: "Studio-caliber ANC headphones built for mixing and cinematic listening."
  }
];

const SHOWCASE_TILES = [
  {
    id: "veltr-aero-flagship",
    title: "VELTR Aero Flagship",
    accent: "Flagship over-ear studio",
    tagline: "Carbon fiber headband, dual X drivers, and 40-hour battery for cinematic listening, anytime.",
    image: "/assets/veltr/tile-01.jpg"
  },
  {
    id: "veltr-echo-earbuds",
    title: "VELTR Echo Wireless Earbuds",
    accent: "True wireless Earbuds",
    tagline: "Spatial audio, adaptive EQ, and a sculpted titanium stem that disappears in the ear.",
    image: "/assets/veltr/tile-02.jpg"
  },
  {
    id: "veltr-arc-stand",
    title: "VELTR Arc Charging Stand",
    accent: "Accessories / charging",
    tagline: "Magnetic cradle and balanced stand that doubles as a lighting sculpted display for your set.",
    image: "/assets/veltr/tile-03.jpg"
  }
];

const PRODUCTS = [
  {
    id: "veltr-aero-flagship",
    name: "VELTR Aero Flagship",
    price: 1299,
    image: "/assets/veltr/grid-01.jpg",
    category: "over-ear",
    description:
      "Dual X drivers, carbon fiber headband, and memory-foam cushions that cradle your head for marathon listening.",
    createdAt: "2025-09-12T10:00:00Z",
    slug: "aero-flagship"
  },
  {
    id: "veltr-nova-studio",
    name: "VELTR Nova Studio Edition",
    price: 999,
    image: "/assets/veltr/grid-02.jpg",
    category: "studio",
    description: "Active noise control, hi-res DAC, and modular earcups tuned for mixing, mastering, and cine playback.",
    createdAt: "2025-08-03T09:15:00Z",
    slug: "nova-studio"
  },
  {
    id: "veltr-echo-earbuds",
    name: "VELTR Echo Wireless Earbuds",
    price: 399,
    image: "/assets/veltr/grid-03.jpg",
    category: "earbuds",
    description: "Featherweight true wireless buds with spatial audio, adaptive EQ, and 28-hour combined runtime.",
    createdAt: "2025-07-18T11:30:00Z",
    slug: "echo-earbuds"
  },
  {
    id: "veltr-pulse-gaming",
    name: "VELTR Pulse Gaming Headset",
    price: 449,
    image: "/assets/veltr/grid-04.jpg",
    category: "gaming",
    description: "Surround-drive and low-latency wireless for competitive play plus ambient pass-through when the battle pauses.",
    createdAt: "2025-06-25T13:45:00Z",
    slug: "pulse-gaming"
  },
  {
    id: "veltr-aurora-anc",
    name: "VELTR Aurora ANC",
    price: 899,
    image: "/assets/veltr/grid-05.jpg",
    category: "over-ear",
    description: "Ceramic finish, transparent hearing, and haptics for tactile tone cues that never break concentration.",
    createdAt: "2025-05-15T08:25:00Z",
    slug: "aurora-anc"
  },
  {
    id: "veltr-arc-stand",
    name: "VELTR Arc Charging Stand",
    price: 189,
    image: "/assets/veltr/grid-06.jpg",
    category: "accessories",
    description: "Magnetic charging cradle and balanced audio stand that keeps your collection on display and ready to go.",
    createdAt: "2025-04-09T12:10:00Z",
    slug: "arc-stand"
  },
  {
    id: "veltr-signal-bass",
    name: "VELTR Signal Bass Monitor",
    price: 749,
    image: "/assets/veltr/grid-07.jpg",
    category: "studio",
    description: "Reference monitors with low-end warmth and studio-accurate imaging for engineers and audiophiles.",
    createdAt: "2025-02-22T15:50:00Z",
    slug: "signal-bass"
  },
  {
    id: "veltr-lumen-case",
    name: "VELTR Lumen Case",
    price: 159,
    image: "/assets/veltr/grid-08.jpg",
    category: "accessories",
    description: "Aluminum travel case with integrated charging dock keeps earbuds and charger in sync.",
    createdAt: "2025-01-18T09:20:00Z",
    slug: "lumen-case"
  }
];

const CATEGORIES = [
  { id: "cat-over-ear", name: "Over-Ear", slug: "over-ear" },
  { id: "cat-earbuds", name: "Earbuds", slug: "earbuds" },
  { id: "cat-studio", name: "Studio", slug: "studio" },
  { id: "cat-gaming", name: "Gaming", slug: "gaming" },
  { id: "cat-accessories", name: "Accessories", slug: "accessories" }
];

const FALLBACK_IMAGE = HERO_IMAGES[0]?.image ?? "/assets/veltr/hero-01.jpg";

const FEATURED_CARDS = [
  {
    id: "veltr-editorial-1",
    title: "Veltr Aero Flagship story",
    tag: "HEADPHONES",
    description: "Crafted aluminum, carbon mesh and soft memory foam make the Aero Flagship an icon of clarity.",
    image: "/assets/veltr/hero-01.jpg",
    link: "/product/veltr-aero-flagship"
  },
  {
    id: "veltr-editorial-2",
    title: "Veltr Echo in the wild",
    tag: "EARBUDS",
    description: "Tiny buds, spacious sound; the Echo pack adaptive noise into a whisper-light form factor.",
    image: "/assets/veltr/hero-02.jpg",
    link: "/product/veltr-echo-earbuds"
  },
  {
    id: "veltr-editorial-3",
    title: "Veltr Studio rituals",
    tag: "STUDIO",
    description: "Nova Studio is tuned for mixing and cinematic listening with adaptive pressure and hi-res DAC.",
    image: "/assets/veltr/hero-03.jpg",
    link: "/category/studio"
  },
  {
    id: "veltr-editorial-4",
    title: "Veltr Pulse gaming diary",
    tag: "GAMING",
    description: "Surround-drive clarity and ambient awareness for long sessions and late-night competitions.",
    image: "/assets/veltr/grid-04.jpg",
    link: "/product/veltr-pulse-gaming"
  },
  {
    id: "veltr-editorial-5",
    title: "Veltr Meridian monitoring",
    tag: "STUDIO",
    description: "Signal Bass Monitor brings reference detail and tactile warmth to every mix and master.",
    image: "/assets/veltr/grid-07.jpg",
    link: "/product/veltr-signal-bass"
  },
  {
    id: "veltr-editorial-6",
    title: "Veltr Arc ritual",
    tag: "ACCESSORIES",
    description: "Magnetic charging stand keeps your veltr collection on display and ready with a single lift.",
    image: "/assets/veltr/grid-06.jpg",
    link: "/product/veltr-arc-stand"
  },
  {
    id: "veltr-editorial-7",
    title: "Veltr Lumen travel capsule",
    tag: "ACCESSORIES",
    description: "Aluminum case with integral USB-C power keep earbuds and buds together anywhere.",
    image: "/assets/veltr/grid-08.jpg",
    link: "/product/veltr-lumen-case"
  }
];

export { HERO_IMAGES, SHOWCASE_TILES, PRODUCTS, CATEGORIES, FALLBACK_IMAGE, FEATURED_CARDS };
