export const categories = [
  {
    slug: "literature",
    title: "Literature",
    description: "Classic annotation kits, study guides, and digital books.",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    slug: "education",
    title: "Education",
    description: "Academic cheat sheets, templates, and structured learning resources.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
  },
  {
    slug: "activities",
    title: "Activities",
    description: "Printable escape rooms, coloring packs, and interactive fun.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop",
  },
  {
    slug: "lifestyle",
    title: "Lifestyle",
    description: "Meal planners, digital journals, and wellness trackers.",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=1920&auto=format&fit=crop",
  },
  {
    slug: "organisation",
    title: "Organisation",
    description: "Inventory trackers, cleaning schedules, and small business tools.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop",
  },
  {
    slug: "stationary",
    title: "Stationary",
    description: "Wedding suites, business letterheads, and minimalist design sets.",
    image: "https://images.unsplash.com/photo-1586075010633-2442654eb63f?q=80&w=1887&auto=format&fit=crop",
  },
  {
    slug: "miscellaneous",
    title: "Miscellaneous",
    description: "Digital stickers, twitch overlays, and more unique assets.",
    image: "https://images.unsplash.com/photo-1554034483-04fac167ff91?q=80&w=2070&auto=format&fit=crop",
  },
];

export const products = {
  // Literature
  "pride-and-prejudice-kit": {
    id: "pride-and-prejudice-kit",
    title: "Pride & Prejudice Annotation Kit",
    price: 9.99,
    description: "A comprehensive digital annotation kit for Jane Austen's classic.",
    categoryId: "literature",
  },
  "poetry-prompts-collection": {
    id: "poetry-prompts-collection",
    title: "Poetry Writing Prompts",
    price: 4.99,
    description: "50 daily prompts to ignite your poetic creativity.",
    categoryId: "literature",
  },
  // Education
  "calculus-cheat-sheet": {
    id: "calculus-cheat-sheet",
    title: "Advanced Calculus Cheat Sheet",
    price: 5.99,
    description: "All the essential formulas and theorems in one place.",
    categoryId: "education",
  },
  "biology-study-guide": {
    id: "biology-study-guide",
    title: "Biology Study Guide Template",
    price: 7.99,
    description: "A structured template for organizing your biology notes.",
    categoryId: "education",
  },
  // Activities
  "escape-room-kit": {
    id: "escape-room-kit",
    title: "Printable Escape Room Kit",
    price: 14.99,
    description: "A complete escape room experience you can print at home.",
    categoryId: "activities",
  },
  "mindfulness-coloring": {
    id: "mindfulness-coloring",
    title: "Mindfulness Coloring Pack",
    price: 6.99,
    description: "20 intricate designs for stress relief and relaxation.",
    categoryId: "activities",
  },
  // Lifestyle
  "meal-planning-system": {
    id: "meal-planning-system",
    title: "Ultimate Meal Planning System",
    price: 12.99,
    description: "Plan your meals, track calories, and manage your grocery list.",
    categoryId: "lifestyle",
  },
  "gratitude-journal": {
    id: "gratitude-journal",
    title: "Digital Gratitude Journal",
    price: 8.99,
    description: "A beautiful digital journal for daily reflection.",
    categoryId: "lifestyle",
  },
  // Organisation
  "business-inventory-tracker": {
    id: "business-inventory-tracker",
    title: "Small Business Inventory Tracker",
    price: 19.99,
    description: "Manage your stock effortlessly with this automated tracker.",
    categoryId: "organisation",
  },
  "cleaning-schedule": {
    id: "cleaning-schedule",
    title: "Clean Home Scheduling System",
    price: 4.99,
    description: "Keep your home spotless with this easy-to-follow schedule.",
    categoryId: "organisation",
  },
  // Stationary
  "wedding-invitation-suite": {
    id: "wedding-invitation-suite",
    title: "Minimalist Wedding Invitation Suite",
    price: 24.99,
    description: "Elegant and customizable wedding invitation templates.",
    categoryId: "stationary",
  },
  "letterhead-pack": {
    id: "letterhead-pack",
    title: "Professional Letterhead Pack",
    price: 9.99,
    description: "Stand out with our curated collection of business letterheads.",
    categoryId: "stationary",
  },
  // Miscellaneous
  "twitch-overlay-bundle": {
    id: "twitch-overlay-bundle",
    title: "Modern Twitch Overlay Bundle",
    price: 29.99,
    description: "Complete your gaming setup with these slick overlays.",
    categoryId: "miscellaneous",
  },
  "gift-voucher-bundle": {
    id: "gift-voucher-bundle",
    title: "Generic Gift Voucher Bundle",
    price: 5.99,
    description: "Versatile voucher templates for any occasion.",
    categoryId: "miscellaneous",
  },
};

export function getCategory(categoryId) {
  return categories.find((c) => c.slug === categoryId);
}

export function getProduct(productId) {
  return products[productId];
}

export function getCategoryImage(categoryId) {
  const cat = categories.find((c) => c.slug === categoryId);
  return cat ? cat.image : categories[0].image;
}

export function formatPrice(value) {
  return value.toFixed(2);
}
