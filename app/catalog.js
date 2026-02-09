import templatesImg from "./assets/category-templates-ChW_XLdG.jpg";
import ebooksImg from "./assets/category-ebooks-TqDR5Lmy.jpg";
import graphicsImg from "./assets/category-graphics-CMnDKdua.jpg";
import coursesImg from "./assets/category-courses-DOPZ_N7M.jpg";

export const categories = [
  {
    slug: "templates",
    title: "Templates",
    description: "Professional templates for every need",
    image: templatesImg,
  },
  {
    slug: "e-books",
    title: "E-Books",
    description: "Digital books and guides",
    image: ebooksImg,
  },
  {
    slug: "courses",
    title: "Courses",
    description: "Learn new skills",
    image: coursesImg,
  },
  {
    slug: "graphics",
    title: "Graphics",
    description: "Design assets and resources",
    image: graphicsImg,
  },
];

export const products = {
  "productivity-guide": {
    id: "productivity-guide",
    title: "Productivity Guide",
    price: 14.99,
    description: "Master your time and boost your productivity with proven techniques.",
    categoryId: "e-books",
  },
  "finance-for-beginners": {
    id: "finance-for-beginners",
    title: "Finance for Beginners",
    price: 19.99,
    description: "Understand the basics of personal finance.",
    categoryId: "e-books",
  },
  "business-plan-template": {
    id: "business-plan-template",
    title: "Business Plan Template",
    price: 29.99,
    description: "Professional template for your business plan.",
    categoryId: "templates",
  },
  "digital-marketing-basics": {
    id: "digital-marketing-basics",
    title: "Digital Marketing Basics",
    price: 49.0,
    description: "Learn digital marketing fundamentals.",
    categoryId: "courses",
  },
  "social-media-kit": {
    id: "social-media-kit",
    title: "Social Media Kit",
    price: 19.99,
    description: "Design assets for social media.",
    categoryId: "graphics",
  },
};

export function getCategory(categoryId) {
  return categories.find((c) => c.slug === categoryId);
}

export function getProduct(productId) {
  return products[productId];
}

export function getCategoryImage(categoryId) {
  if (categoryId === "templates") return templatesImg;
  if (categoryId === "e-books") return ebooksImg;
  if (categoryId === "courses") return coursesImg;
  if (categoryId === "graphics") return graphicsImg;
  return ebooksImg;
}

export function formatPrice(value) {
  return value.toFixed(2);
}

