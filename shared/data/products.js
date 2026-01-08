const HERO_IMAGES = [
  {
    id: "hero-01",
    title: "Veltr Horizon",
    image: "/images/hero/hero-01.jpg",
    description: "Veltr Horizon – premium over-ear experience."
  },
  {
    id: "hero-02",
    title: "Veltr Echo",
    image: "/images/hero/hero-02.jpg",
    description: "Veltr Echo – sculpted earbuds for daily rituals."
  },
  {
    id: "hero-03",
    title: "Veltr Pulse",
    image: "/images/hero/hero-03.jpg",
    description: "Veltr Pulse – studio-ready headset."
  },
  {
    id: "hero-04",
    title: "Veltr Lumen",
    image: "/images/hero/hero-04.jpg",
    description: "Veltr Lumen – wireless case + dock."
  }
];

const SHOWCASE_TILES = [
  {
    id: "veltr-aero-flagship",
    title: "VELTR Aero Flagship",
    accent: "Flagship over-ear",
    tagline: "Dual carbon mesh drivers, adaptive ANC, and 40-hour battery for immersive listening.",
    image: "/images/feature/aero-flagship.png",
    imagePosition: "40% 50%",
    imageScale: 0.95
  },
  {
    id: "veltr-echo-earbuds",
    title: "VELTR Echo Wireless Earbuds",
    accent: "True wireless + case",
    tagline: "Adaptive transparency, spatial audio, and titanium stems that disappear in the ear canal.",
    image: "/images/feature/echo-earbuds.png",
    imagePosition: "45% 45%",
    imageScale: 0.93
  },
  {
    id: "veltr-arc-stand",
    title: "VELTR Pulse Gaming",
    accent: "Gaming RGB headset",
    tagline: "Adaptive surround, programmable lighting, and breathable memory foam for late-night raids.",
    image: "/images/feature/pulse-gaming.png",
    imagePosition: "center",
    imageScale: 0.96
  }
];

const PRODUCTS = [
  {
    id: "veltr-aero-flagship",
    name: "VELTR Aero Flagship",
    price: 1299,
    image: "/assets/veltr/grid-01.jpg",
    category: "over-ear",
    stock: 12,
    ratingAvg: 4.9,
    ratingCount: 248,
    description:
      "Dual X drivers, carbon fiber headband, and memory-foam cushions that cradle your head for marathon listening.",
    createdAt: "2025-09-12T10:00:00Z",
    slug: "aero-flagship",
    variants: [
      { id: "black", label: "Satin Black", hex: "#0b0d12", image: "/assets/veltr/grid-01.jpg" },
      {
        id: "silver",
        label: "Polished Silver",
        hex: "#c7c8ca",
        image: "/assets/veltr/grid-02.jpg",
        priceDelta: 50
      }
    ],
    images: ["/assets/veltr/grid-01.jpg", "/assets/veltr/grid-02.jpg", "/assets/veltr/grid-05.jpg"],
    reviews: [
      {
        id: "veltr-aero-flagship-review-1",
        name: "Amelia R.",
        title: "Studio-grade transparency",
        body: "In-ear detail with over-ear comfort—perfect for mixing and late-night films.",
        stars: 5,
        date: "2026-01-05T09:30:00Z"
      },
      {
        id: "veltr-aero-flagship-review-2",
        name: "Jon M.",
        title: "Feels like a custom design",
        body: "Weightless preshoot with a solid punch and zero fatigue after hours on.",
        stars: 5,
        date: "2025-11-22T14:10:00Z"
      },
      {
        id: "veltr-aero-flagship-review-3",
        name: "Priya S.",
        title: "Obsessively comfortable",
        body: "Memory foam seals noise without squeezing the skull. Great for travel.",
        stars: 4,
        date: "2025-10-09T17:45:00Z"
      }
    ]
  },
  {
    id: "veltr-nova-studio",
    name: "VELTR Nova Studio Edition",
    price: 999,
    image: "/assets/veltr/grid-02.jpg",
    category: "studio",
    ratingAvg: 4.8,
    ratingCount: 198,
    description: "Active noise control, hi-res DAC, and modular earcups tuned for mixing, mastering, and cine playback.",
    stock: 4,
    createdAt: "2025-08-03T09:15:00Z",
    slug: "nova-studio",
    variants: [
      { id: "midnight", label: "Midnight Blue", hex: "#111a2a", image: "/assets/veltr/grid-02.jpg" },
      { id: "titan", label: "Titan Grey", hex: "#9ca3af", image: "/assets/veltr/grid-05.jpg" }
    ],
    images: ["/assets/veltr/grid-02.jpg", "/assets/veltr/grid-05.jpg", "/assets/veltr/grid-04.jpg"],
    reviews: [
      {
        id: "veltr-nova-studio-review-1",
        name: "Theo L.",
        title: "Mix-ready clarity",
        body: "EQ control is razor sharp, but the pad depth keeps headphones from ringing my ears.",
        stars: 5,
        date: "2026-02-03T12:20:00Z"
      },
      {
        id: "veltr-nova-studio-review-2",
        name: "Marta K.",
        title: "Best over-ear for hybrid work",
        body: "Transparency mode is extremely natural and sneaks in external cues when I need to chat quickly.",
        stars: 5,
        date: "2025-12-11T10:05:00Z"
      },
      {
        id: "veltr-nova-studio-review-3",
        name: "Chris W.",
        title: "Mixes like a dream",
        body: "Soundstage is surprisingly wide. Tracks that sounded flat now breathe naturally.",
        stars: 4,
        date: "2025-09-30T08:25:00Z"
      }
    ]
  },
  {
    id: "veltr-echo-earbuds",
    name: "VELTR Echo Wireless Earbuds",
    price: 399,
    image: "/assets/veltr/grid-03.jpg",
    category: "earbuds",
    stock: 0,
    ratingAvg: 4.6,
    ratingCount: 112,
    description: "Featherweight true wireless buds with spatial audio, adaptive EQ, and 28-hour combined runtime.",
    createdAt: "2025-07-18T11:30:00Z",
    slug: "echo-earbuds",
    variants: [
      { id: "carbon", label: "Carbon Black", hex: "#07090d", image: "/assets/veltr/grid-03.jpg" },
      { id: "glow", label: "Glow White", hex: "#f8fafc", image: "/assets/veltr/grid-08.jpg" }
    ],
    images: ["/assets/veltr/grid-03.jpg", "/assets/veltr/grid-08.jpg"],
    reviews: [
      {
        id: "veltr-echo-earbuds-review-1",
        name: "Lena C.",
        title: "Magic for commuting",
        body: "Adaptive EQ keeps voices crisp, and the buds never slip even with my jogging form.",
        stars: 5,
        date: "2026-01-18T07:10:00Z"
      },
      {
        id: "veltr-echo-earbuds-review-2",
        name: "Rafi D.",
        title: "True wireless that feels wired",
        body: "Latency-free pairing with my studio rig. I wish the case was a touch smaller.",
        stars: 4,
        date: "2025-08-21T15:55:00Z"
      },
      {
        id: "veltr-echo-earbuds-review-3",
        name: "Nora F.",
        title: "Spatial cues shine",
        body: "Imaging is exact without sounding brittle. Wish the ANC was stronger.",
        stars: 4,
        date: "2025-06-29T11:40:00Z"
      }
    ]
  },
  {
    id: "veltr-pulse-gaming",
    name: "VELTR Pulse Gaming Headset",
    price: 449,
    image: "/assets/veltr/grid-04.jpg",
    category: "gaming",
    stock: 6,
    ratingAvg: 4.7,
    ratingCount: 86,
    description: "Surround-drive and low-latency wireless for competitive play plus ambient pass-through when the battle pauses.",
    createdAt: "2025-06-25T13:45:00Z",
    slug: "pulse-gaming",
    variants: [
      { id: "redshift", label: "Redshift", hex: "#b91c1c", image: "/assets/veltr/grid-04.jpg" },
      { id: "onyx", label: "Onyx Slate", hex: "#0f172a", image: "/assets/veltr/grid-01.jpg" }
    ],
    images: ["/assets/veltr/grid-04.jpg", "/assets/veltr/grid-01.jpg", "/assets/veltr/grid-06.jpg"],
    reviews: [
      {
        id: "veltr-pulse-gaming-review-1",
        name: "Darius K.",
        title: "Lag-free dominance",
        body: "Zero audio drift on console and PC. Spatial chatter is easy to lock in.",
        stars: 5,
        date: "2025-11-02T21:00:00Z"
      },
      {
        id: "veltr-pulse-gaming-review-2",
        name: "Mia T.",
        title: "Snug and breathable",
        body: "Leather sits tight without sweating. Volume wheel feels precise.",
        stars: 4,
        date: "2025-09-13T19:20:00Z"
      },
      {
        id: "veltr-pulse-gaming-review-3",
        name: "Leo S.",
        title: "Immersive low end",
        body: "Pairing with PC is instant. Vibrant bass but still clean mids.",
        stars: 4,
        date: "2025-07-08T16:45:00Z"
      }
    ]
  },
  {
    id: "veltr-aurora-anc",
    name: "VELTR Aurora ANC",
    price: 899,
    image: "/assets/veltr/grid-05.jpg",
    category: "over-ear",
    stock: 2,
    ratingAvg: 4.8,
    ratingCount: 167,
    description: "Ceramic finish, transparent hearing, and haptics for tactile tone cues that never break concentration.",
    createdAt: "2025-05-15T08:25:00Z",
    slug: "aurora-anc",
    variants: [
      { id: "celestial", label: "Celestial White", hex: "#f8fafc", image: "/assets/veltr/grid-05.jpg" },
      { id: "midnight", label: "Midnight Blue", hex: "#0f172a", image: "/assets/veltr/grid-02.jpg" }
    ],
    images: ["/assets/veltr/grid-05.jpg", "/assets/veltr/grid-02.jpg"],
    reviews: [
      {
        id: "veltr-aurora-anc-review-1",
        name: "Isla P.",
        title: "Immersive silence",
        body: "ANC makes airplane hum disappear, but ambient mode keeps crew voices natural.",
        stars: 5,
        date: "2026-01-02T14:05:00Z"
      },
      {
        id: "veltr-aurora-anc-review-2",
        name: "Noah B.",
        title: "Ceramic feels premium",
        body: "Weight distribution is perfect, and the haptics gently nudge me when tracks change.",
        stars: 5,
        date: "2025-11-09T12:00:00Z"
      },
      {
        id: "veltr-aurora-anc-review-3",
        name: "Selene V.",
        title: "Warm yet detailed",
        body: "Mids stay lush even when I crank the bass. Battery lasts all week.",
        stars: 4,
        date: "2025-08-27T09:15:00Z"
      }
    ]
  },
  {
    id: "veltr-arc-stand",
    name: "VELTR Arc Charging Stand",
    price: 189,
    image: "/assets/veltr/grid-06.jpg",
    category: "accessories",
    stock: 20,
    ratingAvg: 4.7,
    ratingCount: 64,
    description: "Magnetic charging cradle and balanced audio stand that keeps your collection on display and ready to go.",
    createdAt: "2025-04-09T12:10:00Z",
    slug: "arc-stand",
    variants: [{ id: "black", label: "Lunar Black", hex: "#030712", image: "/assets/veltr/grid-06.jpg" }],
    images: ["/assets/veltr/grid-06.jpg", "/assets/veltr/grid-08.jpg"],
    reviews: [
      {
        id: "veltr-arc-stand-review-1",
        name: "Cora D.",
        title: "Ceramic weightless touch",
        body: "The stand anchors my desk with a subtle glow and snaps magnets perfectly every time.",
        stars: 5,
        date: "2025-12-18T10:35:00Z"
      },
      {
        id: "veltr-arc-stand-review-2",
        name: "Mason L.",
        title: "Keeps the desk tidy",
        body: "Cable management is uncanny—no wire clutter, and it looks like a gallery piece.",
        stars: 4,
        date: "2025-10-05T09:05:00Z"
      },
      {
        id: "veltr-arc-stand-review-3",
        name: "Priya A.",
        title: "Luxury accent",
        body: "Charger fits effortlessly and the finish never shows fingerprints.",
        stars: 4,
        date: "2025-07-25T15:40:00Z"
      }
    ]
  },
  {
    id: "veltr-signal-bass",
    name: "VELTR Signal Bass Monitor",
    price: 749,
    image: "/assets/veltr/grid-07.jpg",
    category: "studio",
    stock: 1,
    ratingAvg: 4.9,
    ratingCount: 74,
    description: "Reference monitors with low-end warmth and studio-accurate imaging for engineers and audiophiles.",
    createdAt: "2025-02-22T15:50:00Z",
    slug: "signal-bass",
    variants: [{ id: "graphite", label: "Graphite Black", hex: "#0f172a", image: "/assets/veltr/grid-07.jpg" }],
    images: ["/assets/veltr/grid-07.jpg", "/assets/veltr/grid-05.jpg"],
    reviews: [
      {
        id: "veltr-signal-bass-review-1",
        name: "Elena N.",
        title: "Studio reference clarity",
        body: "Bass depth is precise without bleeding into mids. Perfect for mixing and playback.",
        stars: 5,
        date: "2026-02-12T13:15:00Z"
      },
      {
        id: "veltr-signal-bass-review-2",
        name: "Caleb R.",
        title: "Powerful without strain",
        body: "Driving these from a USB-C source is effortless; imaging feels airy and accurate.",
        stars: 5,
        date: "2025-12-29T11:20:00Z"
      },
      {
        id: "veltr-signal-bass-review-3",
        name: "Hana V.",
        title: "Detailed low end",
        body: "Smooth sub-bass and tight kick drums—nothing muddy at any volume.",
        stars: 4,
        date: "2025-08-13T10:10:00Z"
      }
    ]
  },
  {
    id: "veltr-lumen-case",
    name: "VELTR Lumen Case",
    price: 159,
    image: "/assets/veltr/grid-08.jpg",
    category: "accessories",
    stock: 5,
    ratingAvg: 4.5,
    ratingCount: 58,
    description: "Aluminum travel case with integrated charging dock keeps earbuds and charger in sync.",
    createdAt: "2025-01-18T09:20:00Z",
    slug: "lumen-case",
    variants: [
      { id: "champagne", label: "Champagne", hex: "#fcd34d", image: "/assets/veltr/grid-08.jpg" },
      { id: "graphite", label: "Graphite", hex: "#0f172a", image: "/assets/veltr/grid-06.jpg" }
    ],
    images: ["/assets/veltr/grid-08.jpg", "/assets/veltr/grid-06.jpg"],
    reviews: [
      {
        id: "veltr-lumen-case-review-1",
        name: "Tyler G.",
        title: "Perfect travel companion",
        body: "Slim profile and soft interior mean my buds stay safe and charge on the go.",
        stars: 5,
        date: "2025-12-21T08:45:00Z"
      },
      {
        id: "veltr-lumen-case-review-2",
        name: "Rina P.",
        title: "Subtle luxury",
        body: "Brushed aluminum feels like jewelry and the magnet lock is whisper-quiet.",
        stars: 4,
        date: "2025-09-02T18:20:00Z"
      },
      {
        id: "veltr-lumen-case-review-3",
        name: "Marco F.",
        title: "Handy dock",
        body: "The integrated dock keeps my desk minimal and the wireless charging never slows.",
        stars: 4,
        date: "2025-05-30T14:55:00Z"
      }
    ]
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
    title: "Echo in the wild",
    tag: "EARBUDS",
    description: "Tiny buds, spacious sound; the Echo pack adaptive noise into a whisper-light form factor.",
    image: "/assets/veltr/editorial/urban.jpg",
    link: "/product/veltr-echo-earbuds"
  },
  {
    id: "veltr-editorial-2",
    title: "Veltr Studio rituals",
    tag: "STUDIO",
    description: "Nova Studio is tuned for mixing and cinematic listening with adaptive pressure and hi-res DAC.",
    image: "/assets/veltr/editorial/studio.jpg",
    link: "/category/studio"
  },
  {
    id: "veltr-editorial-3",
    title: "Veltr Pulse gaming diary",
    tag: "GAMING",
    description: "Surround-drive clarity and ambient awareness for long sessions and late-night competitions.",
    image: "/assets/veltr/editorial/gaming.jpg",
    link: "/product/veltr-pulse-gaming"
  },
  {
    id: "veltr-editorial-4",
    title: "Veltr on the move",
    tag: "TRAVEL",
    description: "Lightweight comfort and long-life battery keep playlists flowing through every transit day.",
    image: "/assets/veltr/editorial/travel.jpg",
    link: "/category/over-ear"
  },
  {
    id: "veltr-editorial-5",
    title: "Deep focus",
    tag: "STUDIO",
    description: "Noise-blocking clarity and warm resonance make every detail in your mix stand out.",
    image: "/assets/veltr/editorial/focus.jpg",
    link: "/product/veltr-signal-bass"
  },
  {
    id: "veltr-editorial-6",
    title: "Workout flow",
    tag: "ACTIVE",
    description: "Sweat-resistant, secure fit stays locked until the last rep drops.",
    image: "/assets/veltr/editorial/workout.jpg",
    link: "/category/gaming"
  },
  {
    id: "veltr-editorial-7",
    title: "Evening chill",
    tag: "RELAX",
    description: "Warm, ambient soundscapes for slow evenings and refined relaxation.",
    image: "/assets/veltr/editorial/chill.jpg",
    link: "/product/veltr-aero-flagship"
  }
];

export { HERO_IMAGES, SHOWCASE_TILES, PRODUCTS, CATEGORIES, FALLBACK_IMAGE, FEATURED_CARDS };
