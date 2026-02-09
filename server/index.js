import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, Link, NavLink, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useParams, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createContext, useReducer, useEffect, useMemo, useContext, useState } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-primary-200 bg-primary-50", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-6 py-12 sm:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-primary text-lg font-semibold text-primary-900", children: "Ouroboros Printables" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-secondary text-sm text-primary-600", children: "Premium digital products delivered instantly. Quality templates, e-books, courses, and graphics to help you succeed." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-primary text-lg font-semibold text-primary-900", children: "Shop" }),
        /* @__PURE__ */ jsxs("ul", { className: "mt-2 space-y-1 font-secondary text-sm text-primary-700", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/shop", className: "hover:text-primary-900", children: "All Categories" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/shop/category/templates", className: "hover:text-primary-900", children: "Templates" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/shop/category/e-books", className: "hover:text-primary-900", children: "E-Books" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-primary text-lg font-semibold text-primary-900", children: "Support" }),
        /* @__PURE__ */ jsxs("ul", { className: "mt-2 space-y-1 font-secondary text-sm text-primary-700", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", className: "hover:text-primary-900", children: "Contact Us" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/policies", className: "hover:text-primary-900", children: "Policies" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "mailto:support@digitalgoods.com", className: "underline hover:text-primary-900", children: "support@digitalgoods.com" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 border-t border-primary-200 pt-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "font-secondary text-xs text-primary-500", children: "© 2026 Ouroboros Printables. All rights reserved." }) })
  ] }) });
}
const logo = "/assets/logo-CANdkAkW.jpeg";
const templatesImg = "/assets/category-templates-ChW_XLdG-ChW_XLdG.jpg";
const ebooksImg = "/assets/category-ebooks-TqDR5Lmy-TqDR5Lmy.jpg";
const graphicsImg = "/assets/category-graphics-CMnDKdua-CMnDKdua.jpg";
const coursesImg = "/assets/category-courses-DOPZ_N7M-DOPZ_N7M.jpg";
const categories = [
  {
    slug: "templates",
    title: "Templates",
    description: "Professional templates for every need",
    image: templatesImg
  },
  {
    slug: "e-books",
    title: "E-Books",
    description: "Digital books and guides",
    image: ebooksImg
  },
  {
    slug: "courses",
    title: "Courses",
    description: "Learn new skills",
    image: coursesImg
  },
  {
    slug: "graphics",
    title: "Graphics",
    description: "Design assets and resources",
    image: graphicsImg
  }
];
const products = {
  "productivity-guide": {
    id: "productivity-guide",
    title: "Productivity Guide",
    price: 14.99,
    description: "Master your time and boost your productivity with proven techniques.",
    categoryId: "e-books"
  },
  "finance-for-beginners": {
    id: "finance-for-beginners",
    title: "Finance for Beginners",
    price: 19.99,
    description: "Understand the basics of personal finance.",
    categoryId: "e-books"
  },
  "business-plan-template": {
    id: "business-plan-template",
    title: "Business Plan Template",
    price: 29.99,
    description: "Professional template for your business plan.",
    categoryId: "templates"
  },
  "digital-marketing-basics": {
    id: "digital-marketing-basics",
    title: "Digital Marketing Basics",
    price: 49,
    description: "Learn digital marketing fundamentals.",
    categoryId: "courses"
  },
  "social-media-kit": {
    id: "social-media-kit",
    title: "Social Media Kit",
    price: 19.99,
    description: "Design assets for social media.",
    categoryId: "graphics"
  }
};
function getCategory(categoryId) {
  return categories.find((c) => c.slug === categoryId);
}
function getProduct(productId) {
  return products[productId];
}
function getCategoryImage(categoryId) {
  if (categoryId === "templates") return templatesImg;
  if (categoryId === "e-books") return ebooksImg;
  if (categoryId === "courses") return coursesImg;
  if (categoryId === "graphics") return graphicsImg;
  return ebooksImg;
}
function formatPrice(value) {
  return value.toFixed(2);
}
const CartContext = createContext(null);
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { productId } = action;
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(
            (item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { productId, quantity: 1 }]
      };
    }
    case "INCREMENT": {
      const { productId } = action;
      return {
        ...state,
        items: state.items.map(
          (item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    case "DECREMENT": {
      const { productId } = action;
      return {
        ...state,
        items: state.items.map(
          (item) => item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        ).filter((item) => item.quantity > 0)
      };
    }
    case "REMOVE": {
      const { productId } = action;
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== productId)
      };
    }
    case "CLEAR": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}
const initialState = { items: [] };
function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = window.localStorage.getItem("cart");
      if (!stored) return initial;
      const parsed = JSON.parse(stored);
      if (!parsed || !Array.isArray(parsed.items)) return initial;
      return { items: parsed.items };
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("cart", JSON.stringify(state));
    } catch {
    }
  }, [state]);
  const value = useMemo(() => {
    const detailedItems = state.items.map(({ productId, quantity }) => {
      const product2 = getProduct(productId);
      if (!product2) return null;
      const lineTotal = product2.price * quantity;
      return {
        productId,
        quantity,
        product: product2,
        lineTotal,
        lineTotalFormatted: formatPrice(lineTotal)
      };
    }).filter(Boolean);
    const subtotal = detailedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalQuantity = detailedItems.reduce((sum, item) => sum + item.quantity, 0);
    return {
      items: detailedItems,
      subtotal,
      subtotalFormatted: formatPrice(subtotal),
      total: subtotal,
      totalFormatted: formatPrice(subtotal),
      totalQuantity,
      addItem: (productId) => dispatch({ type: "ADD_ITEM", productId }),
      increment: (productId) => dispatch({ type: "INCREMENT", productId }),
      decrement: (productId) => dispatch({ type: "DECREMENT", productId }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      clear: () => dispatch({ type: "CLEAR" })
    };
  }, [state]);
  return /* @__PURE__ */ jsx(CartContext.Provider, { value, children });
}
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
function CartIcon$1() {
  return /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-primary-900", children: [
    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "21", r: "1" }),
    /* @__PURE__ */ jsx("circle", { cx: "20", cy: "21", r: "1" }),
    /* @__PURE__ */ jsx("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
  ] });
}
function Header() {
  const { totalQuantity } = useCart();
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-10 border-b border-primary-200 bg-primary-50 shadow-sm", children: /* @__PURE__ */ jsxs("nav", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8", children: [
    /* @__PURE__ */ jsxs(NavLink, { to: "/", className: "flex items-center gap-2 font-primary text-primary-900", children: [
      /* @__PURE__ */ jsx("img", { src: logo, alt: "Ouroboros Printables", className: "h-10 w-10 rounded-full object-cover" }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Ouroboros Printables" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "flex items-center gap-8", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        NavLink,
        {
          to: "/shop",
          className: ({ isActive }) => `font-secondary text-primary-700 ${isActive ? "font-semibold text-primary-900" : "hover:text-primary-900"}`,
          children: "Shop"
        }
      ) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        NavLink,
        {
          to: "/about",
          className: ({ isActive }) => `font-secondary text-primary-700 ${isActive ? "font-semibold text-primary-900" : "hover:text-primary-900"}`,
          children: "About"
        }
      ) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        NavLink,
        {
          to: "/policies",
          className: ({ isActive }) => `font-secondary text-primary-700 ${isActive ? "font-semibold text-primary-900" : "hover:text-primary-900"}`,
          children: "Policies"
        }
      ) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(NavLink, { to: "/cart", className: "relative text-primary-900", "aria-label": "Cart", children: [
        /* @__PURE__ */ jsx(CartIcon$1, {}),
        totalQuantity > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary-500 px-1 text-xs font-semibold text-white", children: totalQuantity })
      ] }) })
    ] })
  ] }) });
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsxs(CartProvider, {
    children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("main", {
      className: "min-h-[60vh]",
      children: /* @__PURE__ */ jsx(Outlet, {})
    }), /* @__PURE__ */ jsx(Footer, {})]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function meta$7() {
  return [{
    title: "Ouroboros Printables"
  }, {
    name: "description",
    content: "Premium digital products – templates, e-books, courses, and graphics."
  }];
}
const featuredProductIds = ["business-plan-template", "social-media-kit", "productivity-guide", "digital-marketing-basics"];
function ArrowRight$1() {
  return /* @__PURE__ */ jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: /* @__PURE__ */ jsx("path", {
      d: "M5 12h14M12 5l7 7-7 7"
    })
  });
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("section", {
      className: "mx-auto max-w-7xl px-6 py-40 text-center sm:px-8",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "font-primary text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl",
        children: "Premium Digital Products"
      }), /* @__PURE__ */ jsx("p", {
        className: "mx-auto mt-4 max-w-2xl font-secondary text-lg text-primary-600",
        children: "Instant delivery. Quality guaranteed. Templates, e-books, courses, and graphics to help you succeed."
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-8 flex flex-wrap items-center justify-center gap-4",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/shop",
          className: "inline-flex items-center gap-2 rounded-lg bg-primary-900 px-6 py-3 font-secondary font-medium text-white transition hover:bg-primary-800",
          children: ["Browse Products", /* @__PURE__ */ jsx(ArrowRight$1, {})]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/about",
          className: "inline-flex items-center gap-2 rounded-lg bg-primary-200 px-6 py-3 font-secondary font-medium text-primary-900 transition hover:bg-primary-300",
          children: "Learn more"
        })]
      })]
    }), /* @__PURE__ */ jsx("section", {
      className: "border-t border-primary-200 bg-white py-16",
      children: /* @__PURE__ */ jsxs("div", {
        className: "mx-auto max-w-7xl px-6 sm:px-8",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-wrap items-end justify-between gap-4",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "font-primary text-2xl font-bold text-primary-900",
              children: "Shop by Category"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 font-secondary text-primary-600",
              children: "Find exactly what you need"
            })]
          }), /* @__PURE__ */ jsxs(Link, {
            to: "/shop",
            className: "inline-flex items-center gap-1 font-secondary font-medium text-secondary-600 hover:text-secondary-700",
            children: ["View all", /* @__PURE__ */ jsx(ArrowRight$1, {})]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
          children: categories.map((cat) => /* @__PURE__ */ jsxs(Link, {
            to: `/shop/category/${cat.slug}`,
            className: "overflow-hidden rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg",
            children: [/* @__PURE__ */ jsx("div", {
              className: "aspect-[4/3] overflow-hidden rounded-lg bg-primary-100",
              children: /* @__PURE__ */ jsx("img", {
                src: getCategoryImage(cat.slug),
                alt: cat.title,
                className: "h-full w-full object-cover"
              })
            }), /* @__PURE__ */ jsx("h3", {
              className: "mt-4 font-primary font-semibold text-primary-900",
              children: cat.title
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 font-secondary text-sm text-primary-600",
              children: cat.description
            }), /* @__PURE__ */ jsxs("span", {
              className: "mt-3 inline-flex items-center gap-1 font-secondary text-sm font-medium text-secondary-600",
              children: ["Browse collection", /* @__PURE__ */ jsx(ArrowRight$1, {})]
            })]
          }, cat.slug))
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-16",
      children: /* @__PURE__ */ jsxs("div", {
        className: "mx-auto max-w-7xl px-6 sm:px-8",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-wrap items-end justify-between gap-4",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "font-primary text-2xl font-bold text-primary-900",
              children: "Featured Products"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 font-secondary text-primary-600",
              children: "Our most popular digital goods"
            })]
          }), /* @__PURE__ */ jsxs(Link, {
            to: "/shop",
            className: "inline-flex items-center gap-1 font-secondary font-medium text-secondary-600 hover:text-secondary-700",
            children: ["View all products", /* @__PURE__ */ jsx(ArrowRight$1, {})]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
          children: featuredProductIds.map((id) => {
            const product2 = products[id];
            const categoryId = product2.categoryId;
            return /* @__PURE__ */ jsxs(Link, {
              to: `/shop/category/${categoryId}/${product2.id}`,
              className: "overflow-hidden rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg",
              children: [/* @__PURE__ */ jsx("div", {
                className: "aspect-square overflow-hidden rounded-lg bg-primary-100",
                children: /* @__PURE__ */ jsx("img", {
                  src: getCategoryImage(categoryId),
                  alt: product2.title,
                  className: "h-full w-full object-cover"
                })
              }), /* @__PURE__ */ jsx("h3", {
                className: "mt-4 font-primary font-semibold text-primary-900",
                children: product2.title
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-1 font-secondary text-primary-700",
                children: formatPrice(product2.price)
              })]
            }, product2.id);
          })
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "border-t border-primary-200 bg-white py-32",
      children: /* @__PURE__ */ jsxs("div", {
        className: "mx-auto max-w-7xl px-6 text-center sm:px-8",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "font-primary text-2xl font-bold text-primary-900",
          children: "Instant Digital Delivery"
        }), /* @__PURE__ */ jsx("p", {
          className: "mx-auto mt-3 max-w-2xl font-secondary text-primary-600",
          children: "All products are delivered instantly after purchase. Download your files or access your content immediately via email or your account."
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-12 grid gap-8 sm:grid-cols-3",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "font-primary text-3xl font-bold text-primary-900",
              children: "500+"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 font-secondary text-primary-600",
              children: "Digital Products"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "font-primary text-3xl font-bold text-primary-900",
              children: "10K+"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 font-secondary text-primary-600",
              children: "Happy Customers"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("p", {
              className: "font-primary text-3xl font-bold text-primary-900",
              children: "24/7"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 font-secondary text-primary-600",
              children: "Instant Delivery"
            })]
          })]
        })]
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
function meta$6() {
  return [{
    title: "All Categories – Ouroboros Printables"
  }, {
    name: "description",
    content: "Browse our collection of premium digital products."
  }];
}
function ArrowRight() {
  return /* @__PURE__ */ jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: /* @__PURE__ */ jsx("path", {
      d: "M5 12h14M12 5l7 7-7 7"
    })
  });
}
const shop = UNSAFE_withComponentProps(function Shop() {
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto max-w-7xl px-6 py-12 sm:px-8",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "mb-10",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "font-primary text-3xl font-bold text-primary-900",
        children: "All Categories"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-2 font-secondary text-primary-600",
        children: "Browse our collection of premium digital products"
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
      children: categories.map((cat) => /* @__PURE__ */ jsxs(Link, {
        to: `/shop/category/${cat.slug}`,
        className: "overflow-hidden rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg",
        children: [/* @__PURE__ */ jsx("div", {
          className: "aspect-[4/3] overflow-hidden rounded-lg bg-primary-100",
          children: /* @__PURE__ */ jsx("img", {
            src: getCategoryImage(cat.slug),
            alt: cat.title,
            className: "h-full w-full object-cover"
          })
        }), /* @__PURE__ */ jsx("h2", {
          className: "mt-4 font-primary font-semibold text-primary-900",
          children: cat.title
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-1 font-secondary text-sm text-primary-600",
          children: cat.description
        }), /* @__PURE__ */ jsxs("span", {
          className: "mt-3 inline-flex items-center gap-1 font-secondary text-sm font-medium text-secondary-600",
          children: ["Browse collection", /* @__PURE__ */ jsx(ArrowRight, {})]
        })]
      }, cat.slug))
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: shop,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
function meta$5() {
  return [{
    title: "Category – Ouroboros Printables"
  }, {
    name: "description",
    content: "Digital books and guides."
  }];
}
const category = UNSAFE_withComponentProps(function Category() {
  const {
    categoryId
  } = useParams();
  const category2 = categories.find((c) => c.slug === categoryId) ?? categories.find((c) => c.slug === "e-books");
  const categoryProducts = Object.values(products).filter((product2) => product2.categoryId === category2.slug);
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto max-w-7xl px-6 py-8 sm:px-8",
    children: [/* @__PURE__ */ jsxs("nav", {
      className: "mb-8 font-secondary text-sm text-primary-500",
      children: [/* @__PURE__ */ jsx(Link, {
        to: "/",
        className: "hover:text-primary-700",
        children: "Home"
      }), /* @__PURE__ */ jsx("span", {
        className: "mx-2",
        children: ">"
      }), /* @__PURE__ */ jsx(Link, {
        to: "/shop",
        className: "hover:text-primary-700",
        children: "Categories"
      }), /* @__PURE__ */ jsx("span", {
        className: "mx-2",
        children: ">"
      }), /* @__PURE__ */ jsx("span", {
        className: "text-primary-700",
        children: category2.title
      })]
    }), /* @__PURE__ */ jsx("h1", {
      className: "font-primary text-3xl font-bold text-primary-900",
      children: category2.title
    }), /* @__PURE__ */ jsxs("p", {
      className: "mt-1 font-secondary text-primary-600",
      children: [category2.slug === "e-books" && "Digital books and guides", category2.slug === "templates" && "Professional templates for every need", category2.slug === "courses" && "Learn new skills", category2.slug === "graphics" && "Design assets and resources"]
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
      children: categoryProducts.map((product2) => /* @__PURE__ */ jsxs(Link, {
        to: `/shop/category/${categoryId}/${product2.id}`,
        className: "overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg",
        children: [/* @__PURE__ */ jsx("div", {
          className: "aspect-square overflow-hidden rounded-lg bg-primary-100",
          children: /* @__PURE__ */ jsx("img", {
            src: getCategoryImage(category2.slug),
            alt: product2.title,
            className: "h-full w-full object-cover"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "p-6",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "font-primary font-semibold text-primary-900",
            children: product2.title
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-1 font-secondary text-primary-700",
            children: formatPrice(product2.price)
          })]
        })]
      }, product2.id))
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: category,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
function meta$4() {
  return [{
    title: "Product – Ouroboros Printables"
  }, {
    name: "description",
    content: "Premium digital product."
  }];
}
function CheckIcon() {
  return /* @__PURE__ */ jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-secondary-500",
    children: /* @__PURE__ */ jsx("polyline", {
      points: "20 6 9 17 4 12"
    })
  });
}
function LockIcon$1() {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-secondary-500",
    children: [/* @__PURE__ */ jsx("rect", {
      x: "3",
      y: "11",
      width: "18",
      height: "11",
      rx: "2",
      ry: "2"
    }), /* @__PURE__ */ jsx("path", {
      d: "M7 11V7a5 5 0 0 1 10 0v4"
    })]
  });
}
function CartIcon() {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [/* @__PURE__ */ jsx("circle", {
      cx: "9",
      cy: "21",
      r: "1"
    }), /* @__PURE__ */ jsx("circle", {
      cx: "20",
      cy: "21",
      r: "1"
    }), /* @__PURE__ */ jsx("path", {
      d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
    })]
  });
}
const product = UNSAFE_withComponentProps(function Product() {
  const {
    categoryId,
    productId
  } = useParams();
  const product2 = getProduct(productId) || getProduct("productivity-guide");
  const category2 = getCategory(product2.categoryId);
  const {
    addItem
  } = useCart();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto max-w-7xl px-6 py-8 sm:px-8",
    children: [/* @__PURE__ */ jsxs("nav", {
      className: "mb-8 font-secondary text-sm text-primary-500",
      children: [/* @__PURE__ */ jsx(Link, {
        to: "/",
        className: "hover:text-primary-700",
        children: "Home"
      }), /* @__PURE__ */ jsx("span", {
        className: "mx-2",
        children: ">"
      }), /* @__PURE__ */ jsx(Link, {
        to: "/shop",
        className: "hover:text-primary-700",
        children: "Categories"
      }), /* @__PURE__ */ jsx("span", {
        className: "mx-2",
        children: ">"
      }), /* @__PURE__ */ jsx(Link, {
        to: `/shop/category/${product2.categoryId}`,
        className: "hover:text-primary-700",
        children: category2?.title
      }), /* @__PURE__ */ jsx("span", {
        className: "mx-2",
        children: ">"
      }), /* @__PURE__ */ jsx("span", {
        className: "text-primary-700",
        children: product2.title
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "grid gap-12 lg:grid-cols-2",
      children: [/* @__PURE__ */ jsx("div", {
        className: "overflow-hidden rounded-xl bg-secondary-100 p-12 shadow-sm",
        children: /* @__PURE__ */ jsx("div", {
          className: "aspect-square overflow-hidden rounded-lg bg-primary-100",
          children: /* @__PURE__ */ jsx("img", {
            src: getCategoryImage(product2.categoryId),
            alt: product2.title,
            className: "h-full w-full object-cover"
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h1", {
          className: "font-primary text-3xl font-bold text-primary-900",
          children: product2.title
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-2 font-primary text-xl text-primary-900",
          children: formatPrice(product2.price)
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-4 font-secondary text-primary-700",
          children: product2.description
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-6 rounded-lg bg-primary-100 px-4 py-3 font-secondary text-sm text-primary-700 flex items-center gap-2",
          children: [/* @__PURE__ */ jsxs("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            className: "shrink-0 text-primary-600",
            children: [/* @__PURE__ */ jsx("path", {
              d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            }), /* @__PURE__ */ jsx("polyline", {
              points: "14 2 14 8 20 8"
            }), /* @__PURE__ */ jsx("line", {
              x1: "16",
              y1: "13",
              x2: "8",
              y2: "13"
            }), /* @__PURE__ */ jsx("line", {
              x1: "16",
              y1: "17",
              x2: "8",
              y2: "17"
            })]
          }), "Instant PDF Download – Available immediately after purchase"]
        }), /* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: () => {
            addItem(product2.id);
            navigate("/cart");
          },
          className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 px-6 py-3 font-secondary font-medium text-white hover:bg-primary-800 sm:w-auto",
          children: [/* @__PURE__ */ jsx(CartIcon, {}), "Add to Cart"]
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-8 grid gap-6 sm:grid-cols-2",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-500",
              children: /* @__PURE__ */ jsx(CheckIcon, {})
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-secondary font-medium text-primary-900",
                children: "Instant Delivery"
              }), /* @__PURE__ */ jsx("p", {
                className: "font-secondary text-sm text-primary-600",
                children: "Download immediately"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-500",
              children: /* @__PURE__ */ jsx(LockIcon$1, {})
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-secondary font-medium text-primary-900",
                children: "Secure Payment"
              }), /* @__PURE__ */ jsx("p", {
                className: "font-secondary text-sm text-primary-600",
                children: "Protected Checkout"
              })]
            })]
          })]
        })]
      })]
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: product,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function meta$3() {
  return [{
    title: "Your Cart – Ouroboros Printables"
  }, {
    name: "description",
    content: "Review your cart and proceed to checkout."
  }];
}
function RemoveIcon() {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-secondary-500 hover:text-secondary-600",
    children: [/* @__PURE__ */ jsx("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /* @__PURE__ */ jsx("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    })]
  });
}
const cart = UNSAFE_withComponentProps(function Cart() {
  const {
    items,
    subtotalFormatted,
    totalFormatted,
    totalQuantity,
    increment,
    decrement,
    removeItem
  } = useCart();
  if (!items.length) {
    return /* @__PURE__ */ jsxs("div", {
      className: "mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center sm:px-8",
      children: [/* @__PURE__ */ jsx("div", {
        className: "rounded-full bg-primary-200 p-6",
        children: /* @__PURE__ */ jsxs("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "64",
          height: "64",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "text-primary-500",
          children: [/* @__PURE__ */ jsx("circle", {
            cx: "9",
            cy: "21",
            r: "1"
          }), /* @__PURE__ */ jsx("circle", {
            cx: "20",
            cy: "21",
            r: "1"
          }), /* @__PURE__ */ jsx("path", {
            d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
          })]
        })
      }), /* @__PURE__ */ jsx("h1", {
        className: "mt-8 font-primary text-2xl font-bold text-primary-900",
        children: "Your cart is empty"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-2 font-secondary text-primary-600",
        children: "Browse our collection and add some products to your cart."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/shop",
        className: "mt-8 inline-block rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white hover:bg-primary-800",
        children: "Start Shopping"
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto max-w-7xl px-6 py-8 sm:px-8",
    children: [/* @__PURE__ */ jsxs(Link, {
      to: "/shop",
      className: "mb-6 inline-flex items-center gap-1 font-secondary text-primary-600 hover:text-primary-900",
      children: [/* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /* @__PURE__ */ jsx("path", {
          d: "M19 12H5M12 19l-7-7 7-7"
        })
      }), "Continue Shopping"]
    }), /* @__PURE__ */ jsxs("h1", {
      className: "font-primary text-2xl font-bold text-primary-900",
      children: ["Your Cart (", totalQuantity, ")"]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-8 grid gap-8 lg:grid-cols-3",
      children: [/* @__PURE__ */ jsx("div", {
        className: "lg:col-span-2",
        children: /* @__PURE__ */ jsx("div", {
          className: "rounded-xl border border-primary-200 bg-white p-6 shadow-sm",
          children: items.map((item) => /* @__PURE__ */ jsxs("div", {
            className: "flex gap-6 border-b border-primary-100 pb-6 last:border-0 last:pb-0",
            children: [/* @__PURE__ */ jsx("div", {
              className: "h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary-100",
              children: /* @__PURE__ */ jsx("img", {
                src: getCategoryImage(item.product.categoryId),
                alt: item.product.title,
                className: "h-full w-full object-cover"
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "min-w-0 flex-1",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex justify-between",
                children: [/* @__PURE__ */ jsx("h2", {
                  className: "font-primary font-medium text-primary-900",
                  children: item.product.title
                }), /* @__PURE__ */ jsx("button", {
                  type: "button",
                  className: "shrink-0 p-1",
                  "aria-label": "Remove item",
                  onClick: () => removeItem(item.productId),
                  children: /* @__PURE__ */ jsx(RemoveIcon, {})
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "font-secondary text-primary-900",
                children: item.product.price.toFixed(2)
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-3 flex items-center gap-2",
                children: [/* @__PURE__ */ jsx("button", {
                  type: "button",
                  className: "flex h-8 w-8 items-center justify-center rounded border border-primary-200 bg-white font-secondary text-primary-900",
                  onClick: () => decrement(item.productId),
                  children: "−"
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  readOnly: true,
                  value: item.quantity,
                  className: "h-8 w-12 rounded border border-primary-200 bg-primary-50 text-center font-secondary text-primary-900"
                }), /* @__PURE__ */ jsx("button", {
                  type: "button",
                  className: "flex h-8 w-8 items-center justify-center rounded border border-primary-200 bg-white font-secondary text-primary-900",
                  onClick: () => increment(item.productId),
                  children: "+"
                })]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "text-right font-secondary font-medium text-primary-900",
              children: item.lineTotalFormatted
            })]
          }, item.productId))
        })
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsxs("div", {
          className: "rounded-xl border border-primary-200 bg-white p-6 shadow-sm",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "font-primary text-lg font-bold text-primary-900",
            children: "Order Summary"
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4 space-y-2 font-secondary text-primary-900",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex justify-between",
              children: [/* @__PURE__ */ jsx("span", {
                children: "Subtotal"
              }), /* @__PURE__ */ jsx("span", {
                children: subtotalFormatted
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between",
              children: [/* @__PURE__ */ jsx("span", {
                children: "Delivery"
              }), /* @__PURE__ */ jsx("span", {
                className: "text-primary-600",
                children: "Instant"
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "my-4 border-t border-primary-200 pt-4",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between font-primary font-bold text-primary-900",
              children: [/* @__PURE__ */ jsx("span", {
                children: "Total"
              }), /* @__PURE__ */ jsx("span", {
                children: totalFormatted
              })]
            })
          }), /* @__PURE__ */ jsx(Link, {
            to: "/checkout",
            className: "block w-full rounded-lg bg-primary-900 py-3 text-center font-secondary font-medium text-white hover:bg-primary-800",
            children: "Proceed to Checkout"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-3 text-center font-secondary text-xs text-primary-600",
            children: "Secure checkout with instant digital delivery"
          })]
        })
      })]
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cart,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function meta$2() {
  return [{
    title: "Checkout – Ouroboros Printables"
  }, {
    name: "description",
    content: "Complete your purchase."
  }];
}
function LockIcon() {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: "shrink-0",
    children: [/* @__PURE__ */ jsx("rect", {
      x: "3",
      y: "11",
      width: "18",
      height: "11",
      rx: "2",
      ry: "2"
    }), /* @__PURE__ */ jsx("path", {
      d: "M7 11V7a5 5 0 0 1 10 0v4"
    })]
  });
}
const checkout = UNSAFE_withComponentProps(function Checkout() {
  const {
    items,
    subtotalFormatted,
    totalFormatted,
    totalQuantity
  } = useCart();
  if (!items.length) {
    return /* @__PURE__ */ jsxs("div", {
      className: "mx-auto max-w-3xl px-6 py-16 text-center sm:px-8",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "font-primary text-2xl font-bold text-primary-900",
        children: "Your cart is empty"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-2 font-secondary text-primary-600",
        children: "Add some products to your cart before checking out."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/shop",
        className: "mt-6 inline-block rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white hover:bg-primary-800",
        children: "Start Shopping"
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto max-w-7xl px-6 py-8 sm:px-8",
    children: [/* @__PURE__ */ jsxs(Link, {
      to: "/cart",
      className: "mb-6 inline-flex items-center gap-1 font-secondary text-primary-600 hover:text-primary-900",
      children: [/* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /* @__PURE__ */ jsx("path", {
          d: "M19 12H5M12 19l-7-7 7-7"
        })
      }), "Back to Cart"]
    }), /* @__PURE__ */ jsx("h1", {
      className: "font-primary text-2xl font-bold text-primary-900",
      children: "Checkout"
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-8 grid gap-8 lg:grid-cols-3",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "space-y-6 lg:col-span-2",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "rounded-xl border border-primary-200 bg-white p-6 shadow-sm",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "font-primary text-lg font-semibold text-primary-900",
            children: "Your Details"
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4 space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "email",
                className: "block font-secondary text-sm font-medium text-primary-900",
                children: "Email Address"
              }), /* @__PURE__ */ jsx("input", {
                id: "email",
                type: "email",
                placeholder: "your@email.com",
                className: "mt-1 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-1 font-secondary text-xs text-primary-500",
                children: "Your download links will be sent here"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "name",
                className: "block font-secondary text-sm font-medium text-primary-900",
                children: "Full Name"
              }), /* @__PURE__ */ jsx("input", {
                id: "name",
                type: "text",
                placeholder: "John Smith",
                className: "mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "rounded-xl border border-primary-200 bg-white p-6 shadow-sm",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "font-primary text-lg font-semibold text-primary-900",
            children: "Payment"
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-4 rounded-lg border border-secondary-200 bg-secondary-50 p-4 font-secondary text-sm text-secondary-700",
            children: "Payment integration requires backend setup. Connect Lovable Cloud to enable secure Stripe payments with GBP currency support."
          }), /* @__PURE__ */ jsxs("button", {
            type: "button",
            className: "mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800",
            children: [/* @__PURE__ */ jsxs("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [/* @__PURE__ */ jsx("rect", {
                x: "1",
                y: "4",
                width: "22",
                height: "16",
                rx: "2",
                ry: "2"
              }), /* @__PURE__ */ jsx("line", {
                x1: "1",
                y1: "10",
                x2: "23",
                y2: "10"
              })]
            }), "Pay 14.99"]
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        children: /* @__PURE__ */ jsxs("div", {
          className: "rounded-xl border border-primary-200 bg-white p-6 shadow-sm",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "font-primary text-lg font-semibold text-primary-900",
            children: "Order Summary"
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-4 space-y-4 border-b border-primary-100 pb-4",
            children: items.map((item) => /* @__PURE__ */ jsxs("div", {
              className: "flex gap-4",
              children: [/* @__PURE__ */ jsx("div", {
                className: "h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary-100",
                children: /* @__PURE__ */ jsx("img", {
                  src: getCategoryImage(item.product.categoryId),
                  alt: item.product.title,
                  className: "h-full w-full object-cover"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "min-w-0 flex-1",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-secondary font-medium text-primary-900",
                  children: item.product.title
                }), /* @__PURE__ */ jsxs("p", {
                  className: "font-secondary text-sm text-primary-500",
                  children: ["Qty: ", item.quantity]
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "font-secondary font-medium text-primary-900",
                children: item.lineTotalFormatted
              })]
            }, item.productId))
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 border-b border-primary-100 py-4 font-secondary text-primary-900",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex justify-between",
              children: [/* @__PURE__ */ jsx("span", {
                children: "Subtotal"
              }), /* @__PURE__ */ jsx("span", {
                children: subtotalFormatted
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between text-primary-600",
              children: [/* @__PURE__ */ jsx("span", {
                children: "Items"
              }), /* @__PURE__ */ jsx("span", {
                children: totalQuantity
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex justify-between py-4 font-primary font-bold text-primary-900",
            children: [/* @__PURE__ */ jsx("span", {
              children: "Total"
            }), /* @__PURE__ */ jsx("span", {
              children: totalFormatted
            })]
          }), /* @__PURE__ */ jsxs("p", {
            className: "flex items-center gap-2 font-secondary text-xs text-primary-500",
            children: [/* @__PURE__ */ jsx(LockIcon, {}), "Secure checkout with OTP verification"]
          })]
        })
      })]
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: checkout,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1() {
  return [{
    title: "About Us – Ouroboros Printables"
  }, {
    name: "description",
    content: "Learn about us and get in touch."
  }];
}
function MailIcon() {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-primary-700",
    children: [/* @__PURE__ */ jsx("path", {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }), /* @__PURE__ */ jsx("polyline", {
      points: "22,6 12,13 2,6"
    })]
  });
}
function MapPinIcon() {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-primary-700",
    children: [/* @__PURE__ */ jsx("path", {
      d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
    }), /* @__PURE__ */ jsx("circle", {
      cx: "12",
      cy: "10",
      r: "3"
    })]
  });
}
function SendIcon() {
  return /* @__PURE__ */ jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [/* @__PURE__ */ jsx("line", {
      x1: "22",
      y1: "2",
      x2: "11",
      y2: "13"
    }), /* @__PURE__ */ jsx("polygon", {
      points: "22 2 15 22 11 13 2 9 22 2"
    })]
  });
}
const about = UNSAFE_withComponentProps(function About() {
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto max-w-7xl px-6 py-12 sm:px-8",
    children: [/* @__PURE__ */ jsxs("section", {
      className: "mb-16",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "font-primary text-3xl font-bold text-primary-900",
        children: "About Us"
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-6 max-w-3xl space-y-4 font-secondary text-primary-900",
        children: [/* @__PURE__ */ jsx("p", {
          children: "We are a small team passionate about helping individuals and businesses succeed through high-quality digital resources. Our products are carefully crafted to save you time and provide real value."
        }), /* @__PURE__ */ jsx("p", {
          children: "Every template, e-book, course, and graphic in our collection is designed with clarity and usability in mind. We believe in instant access—no waiting, no shipping—so you can start using your purchases right away."
        }), /* @__PURE__ */ jsx("p", {
          children: "Thank you for choosing Ouroboros Printables. We are here to support you on your journey."
        })]
      })]
    }), /* @__PURE__ */ jsxs("section", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "font-primary text-3xl font-bold text-primary-900",
        children: "Contact Us"
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-2 max-w-2xl font-secondary text-primary-700",
        children: "Have a question or feedback? We would love to hear from you. Send us a message and we will get back to you as soon as we can."
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-10 grid gap-10 lg:grid-cols-2",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "space-y-6",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex gap-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-200",
              children: /* @__PURE__ */ jsx(MailIcon, {})
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-secondary font-semibold text-primary-900",
                children: "Email"
              }), /* @__PURE__ */ jsx("a", {
                href: "mailto:support@digitalgoods.com",
                className: "font-secondary text-primary-900 underline hover:text-primary-700",
                children: "support@digitalgoods.com"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-200",
              children: /* @__PURE__ */ jsx(MapPinIcon, {})
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-secondary font-semibold text-primary-900",
                children: "Location"
              }), /* @__PURE__ */ jsx("p", {
                className: "font-secondary text-primary-900",
                children: "United Kingdom"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "rounded-xl border border-primary-200 bg-white p-6 shadow-md",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "font-primary text-lg font-semibold text-primary-900",
            children: "Send a Message"
          }), /* @__PURE__ */ jsxs("form", {
            className: "mt-4 space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "contact-name",
                className: "block font-secondary text-sm font-medium text-primary-900",
                children: "Name"
              }), /* @__PURE__ */ jsx("input", {
                id: "contact-name",
                type: "text",
                placeholder: "Your name",
                className: "mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "contact-email",
                className: "block font-secondary text-sm font-medium text-primary-900",
                children: "Email"
              }), /* @__PURE__ */ jsx("input", {
                id: "contact-email",
                type: "email",
                placeholder: "your@email.com",
                className: "mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "contact-message",
                className: "block font-secondary text-sm font-medium text-primary-900",
                children: "Message"
              }), /* @__PURE__ */ jsx("textarea", {
                id: "contact-message",
                rows: 4,
                placeholder: "How can we help?",
                className: "mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
              })]
            }), /* @__PURE__ */ jsxs("button", {
              type: "submit",
              className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 px-4 py-3 font-secondary font-medium text-white hover:bg-primary-800 sm:w-auto",
              children: [/* @__PURE__ */ jsx(SendIcon, {}), "Send Message"]
            })]
          })]
        })]
      })]
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta() {
  return [{
    title: "Policies & Updates – Ouroboros Printables"
  }, {
    name: "description",
    content: "Important information about our policies and recent updates."
  }];
}
const policies = [{
  id: "privacy",
  title: "Privacy Policy",
  open: true,
  content: /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("p", {
      className: "mb-3 font-secondary text-primary-800",
      children: "We collect only the information necessary to process your orders and improve your experience. This includes your name, email address, and payment details when you make a purchase."
    }), /* @__PURE__ */ jsx("p", {
      className: "mb-3 font-secondary text-primary-800",
      children: "We do not sell or share your personal data with third parties for marketing purposes. Your data may be shared with trusted service providers who assist us in operating our store and processing payments, under strict confidentiality agreements."
    }), /* @__PURE__ */ jsx("p", {
      className: "mb-3 font-secondary text-primary-800",
      children: "We use cookies and similar technologies to remember your preferences and understand how you use our site. You can control cookie settings through your browser."
    }), /* @__PURE__ */ jsx("p", {
      className: "font-secondary text-primary-800",
      children: "You have the right to access, correct, or delete your personal information at any time. Contact us at support@digitalgoods.com for any requests or questions about your data."
    })]
  })
}, {
  id: "refund",
  title: "Refund Policy",
  open: false,
  content: /* @__PURE__ */ jsx("p", {
    className: "font-secondary text-primary-800",
    children: "Due to the digital nature of our products, we generally do not offer refunds once a download has been accessed. If you experience technical issues or have not received your product, please contact us and we will work to resolve the issue."
  })
}, {
  id: "terms",
  title: "Terms & Conditions",
  open: false,
  content: /* @__PURE__ */ jsx("p", {
    className: "font-secondary text-primary-800",
    children: "By purchasing from Ouroboros Printables, you agree to use our products for personal or commercial use as specified in each product’s license. Redistribution or resale of our digital files is prohibited unless explicitly stated otherwise."
  })
}, {
  id: "updates",
  title: "Updates & Announcements",
  open: false,
  content: /* @__PURE__ */ jsx("p", {
    className: "font-secondary text-primary-800",
    children: "We may update our policies from time to time. Significant changes will be communicated via email or a notice on our website. Continued use of our services after updates constitutes acceptance of the revised policies."
  })
}];
function ChevronDown() {
  return /* @__PURE__ */ jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: /* @__PURE__ */ jsx("polyline", {
      points: "6 9 12 15 18 9"
    })
  });
}
function ChevronUp() {
  return /* @__PURE__ */ jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: /* @__PURE__ */ jsx("polyline", {
      points: "18 15 12 9 6 15"
    })
  });
}
const policies_default = UNSAFE_withComponentProps(function Policies() {
  const [openId, setOpenId] = useState("privacy");
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto max-w-3xl px-6 py-12 sm:px-8",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-center font-primary text-3xl font-bold text-primary-900",
      children: "Policies & Updates"
    }), /* @__PURE__ */ jsx("p", {
      className: "mt-2 text-center font-secondary text-primary-600",
      children: "Important information about our policies and recent updates"
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-10 space-y-3",
      children: policies.map((item) => {
        const isOpen = openId === item.id;
        return /* @__PURE__ */ jsxs("div", {
          className: "overflow-hidden rounded-xl border border-primary-200 bg-white shadow-sm",
          children: [/* @__PURE__ */ jsxs("button", {
            type: "button",
            onClick: () => setOpenId((current) => current === item.id ? null : item.id),
            className: "flex w-full items-center justify-between px-6 py-4 text-left font-secondary font-medium text-primary-900 hover:bg-primary-50",
            children: [/* @__PURE__ */ jsx("span", {
              children: item.title
            }), /* @__PURE__ */ jsx("span", {
              className: "text-primary-600",
              children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, {}) : /* @__PURE__ */ jsx(ChevronDown, {})
            })]
          }), isOpen && /* @__PURE__ */ jsx("div", {
            className: "border-t border-primary-100 px-6 py-4",
            children: item.content
          })]
        }, item.id);
      })
    }), /* @__PURE__ */ jsx("p", {
      className: "mt-8 text-center font-secondary text-sm text-primary-500",
      children: "Last updated: December 2024"
    }), /* @__PURE__ */ jsxs("p", {
      className: "mt-2 text-center font-secondary text-sm text-primary-600",
      children: ["Questions? Contact us at", " ", /* @__PURE__ */ jsx("a", {
        href: "mailto:support@digitalgoods.com",
        className: "underline hover:text-primary-900",
        children: "support@digitalgoods.com"
      })]
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: policies_default,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DjWRXEKg.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-V2fukT-Y.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js", "/assets/cart-BukaeIkd.js", "/assets/catalog-rN0cebLw.js"], "css": ["/assets/root-BWMLiwWN.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CIB-oyvk.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js", "/assets/catalog-rN0cebLw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/shop": { "id": "routes/shop", "parentId": "root", "path": "shop", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/shop-BhmXDQvA.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js", "/assets/catalog-rN0cebLw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/category": { "id": "routes/category", "parentId": "root", "path": "shop/category/:categoryId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/category-xKpIV4j9.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js", "/assets/catalog-rN0cebLw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/product": { "id": "routes/product", "parentId": "root", "path": "shop/category/:categoryId/:productId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/product-oL-uKrkr.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js", "/assets/catalog-rN0cebLw.js", "/assets/cart-BukaeIkd.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/cart": { "id": "routes/cart", "parentId": "root", "path": "cart", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/cart-B2zHmnus.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js", "/assets/catalog-rN0cebLw.js", "/assets/cart-BukaeIkd.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/checkout": { "id": "routes/checkout", "parentId": "root", "path": "checkout", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/checkout-DB0Hutys.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js", "/assets/catalog-rN0cebLw.js", "/assets/cart-BukaeIkd.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/about-3PfABneQ.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/policies": { "id": "routes/policies", "parentId": "root", "path": "policies", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/policies-DM3D6I8S.js", "imports": ["/assets/chunk-EPOLDU6W-CtFcexyP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-875608e0.js", "version": "875608e0", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/shop": {
    id: "routes/shop",
    parentId: "root",
    path: "shop",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/category": {
    id: "routes/category",
    parentId: "root",
    path: "shop/category/:categoryId",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/product": {
    id: "routes/product",
    parentId: "root",
    path: "shop/category/:categoryId/:productId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/cart": {
    id: "routes/cart",
    parentId: "root",
    path: "cart",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/checkout": {
    id: "routes/checkout",
    parentId: "root",
    path: "checkout",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/policies": {
    id: "routes/policies",
    parentId: "root",
    path: "policies",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
