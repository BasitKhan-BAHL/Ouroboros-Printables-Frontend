import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getCategories } from "../catalog";
import { useSettings } from "../context/settings";
import { formatPrice } from "../catalog";

export function meta() {
  const title = "Ouroboros Printables – High-Quality Instant Product Kits";
  const description = "Discover premium printable escape rooms, coloring packs, and stationary. Instant PDF downloads with commercial licensing for unlimited creative power.";

  return [
    { title },
    { name: "description", content: description },
    
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://ouroborosprintables.com" },
    { property: "og:image", content: "https://ouroborosprintables.com/favicon.svg" }, // Usually a larger hero image is better, but this is a start
    
    // Twitter
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "https://ouroborosprintables.com/favicon.svg" },
  ];
}

const featuredProductIds = [
  "pride-and-prejudice-kit",
  "calculus-cheat-sheet",
  "escape-room-kit",
  "meal-planning-system",
];

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ValuePropositionVisual() {
  return (
    <div className="mx-auto mt-12 lg:mt-0 w-full max-w-4xl overflow-hidden rounded-[1rem] bg-white shadow-lg shadow-primary-900/20 ring-1 ring-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* We Get */}
        <div className="flex flex-col items-center justify-start bg-slate-50/50 p-6 sm:p-8 lg:p-10 xl:p-12">
          <h3 className="font-primary text-xl sm:text-2xl lg:text-3xl font-black italic tracking-wider text-[#0e2245]">
            WE GET:
          </h3>
          <div className="mt-10 sm:mt-16 flex items-center justify-center">
            <span className="font-primary text-6xl sm:text-[70px] lg:text-[60px] xl:text-[80px] leading-none font-black text-[#f1ab44] drop-shadow-sm">
              {currency}
            </span>
          </div>
        </div>

        {/* You Get */}
        <div className="relative flex flex-col items-center justify-start p-6 sm:p-8 lg:p-10 xl:p-12">
          {/* Vertical Divider for Desktop */}
          <div className="hidden sm:block absolute left-0 top-6 bottom-6 lg:top-8 lg:bottom-8 w-[1px] bg-slate-200" />
          {/* Horizontal Divider for Mobile */}
          <div className="sm:hidden absolute top-0 left-6 right-6 h-[1px] bg-slate-200" />

          <h3 className="font-primary text-xl sm:text-2xl lg:text-3xl font-black italic tracking-wider text-[#0e2245]">
            YOU GET:
          </h3>

          <div className="mt-8 lg:mt-10 flex flex-col items-center w-full">
            {/* PDF Icon */}
            <div className="relative flex h-16 w-12 sm:h-20 sm:w-16 lg:h-16 lg:w-12 xl:h-20 xl:w-16 flex-col items-center rounded-lg bg-[#ec2424] shadow-lg">
              <div className="absolute right-0 top-0 h-5 w-5 sm:h-6 sm:w-6 lg:h-5 lg:w-5 xl:h-6 xl:w-6 rounded-tr-lg rounded-bl-lg bg-white/30" />
              <div className="mt-2.5 sm:mt-3 rounded-sm bg-white px-1 sm:px-1.5 py-0.5">
                <span className="font-primary text-[8px] sm:text-[10px] font-black text-[#ec2424] tracking-widest">PDF</span>
              </div>
              <svg className="mt-1 h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Arrows */}
            <svg className="my-3 sm:my-4 h-8 w-16 sm:h-10 sm:w-20 lg:h-8 w-16 xl:h-10 xl:w-20 text-slate-900" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M48 5 Q20 20 15 40 M15 40 L19 28 M15 40 L27 34" />
              <path d="M52 5 Q80 20 85 40 M85 40 L81 28 M85 40 L73 34" />
            </svg>

            {/* 5 Books Row */}
            <div className="flex items-end justify-center gap-1 sm:gap-2 w-full mt-1 sm:mt-2">
              {[
                { y: 'translate-y-4', rot: '-rotate-[20deg]' },
                { y: 'translate-y-1', rot: '-rotate-[10deg]' },
                { y: 'translate-y-0', rot: '-rotate-[0deg]' },
                { y: 'translate-y-1', rot: 'rotate-[10deg]' },
                { y: 'translate-y-4', rot: 'rotate-[20deg]' }
              ].map((style, i) => (
                <div key={i} className={`flex flex-col items-center ${style.y}`}>
                  <div className={`relative h-12 w-8 sm:h-14 sm:w-9 lg:h-12 lg:w-8 xl:h-14 xl:w-10 rounded-sm border border-amber-200/50 bg-gradient-to-br from-[#f8d085] to-[#f0b04e] shadow-md transform ${style.rot} transition-transform hover:scale-110`}>
                    <div className="absolute left-1.5 top-0 h-full w-[1.5px] bg-white/30" />
                    <div className="absolute -bottom-1 right-1.5 h-3 w-1.5 sm:h-3.5 sm:w-2 bg-[#8fcbd1] shadow-sm transform rotate-3" />
                  </div>
                  <span className="mt-1.5 sm:mt-2 font-primary text-base sm:text-lg lg:text-base xl:text-lg font-black text-[#f1ab44] drop-shadow-sm">{currency}</span>
                </div>
              ))}
            </div>

            {/* Infinity */}
            <div className="mt-4 sm:mt-6 lg:mt-5 xl:mt-6 flex items-center justify-center gap-1 sm:gap-2 text-[#071326]">
              <span className="font-primary text-xl sm:text-3xl lg:text-2xl xl:text-3xl font-black italic drop-shadow-sm">x</span>
              <svg className="h-10 w-12 sm:h-12 sm:w-16 lg:h-10 lg:w-14 xl:h-12 xl:w-16 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeVisual() {
  const { currency } = useSettings();
  return (
    <div className="mx-auto mt-12 lg:mt-0 w-full max-w-4xl">
      {/* Top Title Box */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-xl border-2 border-[#071326] bg-white px-8 py-3 shadow-sm">
          <h2 className="font-primary text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#071326]">
            WHAT YOU GET <span className="font-normal text-slate-400 italic">vs.</span> WHAT WE GET
          </h2>
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row items-stretch justify-center gap-4 lg:gap-0">
        {/* Left Container: WHAT YOU GET */}
        <div className="flex-1 rounded-3xl border-2 border-[#071326] bg-white p-6 sm:p-8 shadow-xl">
          <div className="mb-8 flex justify-center">
            <span className="rounded-lg bg-[#071326] px-4 py-1.5 font-primary text-sm font-bold tracking-widest text-white">
              WHAT YOU GET
            </span>
          </div>

          <div className="flex items-center justify-around gap-2 px-2">
            {/* PDF Icon */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex h-16 w-12 flex-col items-center rounded-lg border-2 border-[#071326] bg-white shadow-sm ring-offset-2">
                <div className="absolute right-0 top-0 h-4 w-4 border-b-2 border-l-2 border-[#071326] bg-slate-50" />
                <div className="mt-6 h-1 w-8 bg-[#071326]/10" />
                <div className="mt-1 h-1 w-8 bg-[#071326]/10" />
                <div className="mt-4 flex w-full justify-center bg-[#071326] py-1 text-[8px] font-black text-white">PDF</div>
              </div>
            </div>

            {/* Dash Arrow */}
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="text-[#071326]">
              <path d="M5 12h25M30 12l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4" />
            </svg>

            {/* Printer Icon */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative flex h-20 w-24 flex-col items-center justify-center rounded-xl border-2 border-[#071326] bg-slate-50 shadow-md">
                {/* Printer Body */}
                <div className="absolute -top-3 h-6 w-16 rounded-t-lg border-2 border-[#071326] bg-white" />
                <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-1">
                   <svg className="h-4 w-4 text-[#071326]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
                   </svg>
                   {/* Exit Sheet with Arrow */}
                   <div className="flex h-8 w-12 flex-col items-center justify-center rounded-sm border-2 border-[#071326] bg-white">
                      <svg className="h-4 w-4 text-[#071326]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                   </div>
                </div>
              </div>
            </div>

            {/* Dash Arrow */}
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="text-[#071326]">
              <path d="M5 12h25M30 12l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4" />
            </svg>

            {/* Cash Icon */}
            <div className="flex flex-col items-center">
              <div className="relative flex h-14 w-20 flex-col items-center justify-center rounded-lg border-2 border-[#071326] bg-green-50 shadow-sm transition-transform hover:scale-110">
                <div className="absolute -top-1 left-1 h-full w-full rounded-lg border-2 border-[#071326] bg-white" />
                <div className="z-10 flex h-6 w-10 items-center justify-center rounded-full border-2 border-green-600 bg-green-100 font-black text-green-700">
                  <span className="text-xs">{currency}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center font-primary text-xl font-bold leading-tight text-[#071326]">
            Get a PDF, create unlimited,<br /> high-profit hardcopies forever.
          </p>
        </div>

        {/* Trade Divider */}
        <div className="z-20 flex flex-col items-center justify-center lg:-mx-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#071326] bg-white p-3 shadow-lg lg:rotate-0">
            <span className="text-[10px] font-black uppercase text-[#071326]">THE</span>
            <svg className="h-8 w-8 text-[#071326]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span className="text-[10px] font-black uppercase text-[#071326]">TRADE</span>
          </div>
        </div>

        {/* Right Container: WHAT WE GET */}
        <div className="lg:w-1/3 rounded-3xl border-2 border-[#071326] bg-white p-6 sm:p-8 shadow-xl">
           <div className="mb-8 flex justify-center">
            <span className="rounded-lg bg-[#071326] px-4 py-1.5 font-primary text-sm font-bold tracking-widest text-white">
              WHAT WE GET
            </span>
          </div>

          <div className="flex items-center justify-center h-24">
             {/* Coin Drop Visual */}
             <div className="relative flex flex-col items-center">
                {/* Hand (Simplified) */}
                <div className="absolute -top-12 flex flex-col items-center animate-bounce duration-1000">
                   <div className="h-6 w-4 rounded-full border-2 border-[#071326] bg-orange-100" />
                   <div className="mt-2 h-6 w-6 rounded-full border-2 border-amber-500 bg-amber-100 flex items-center justify-center text-amber-600 font-black text-xs">
                    {currency}1
                   </div>
                </div>
                {/* Collection Box */}
                <div className="mt-4 relative h-16 w-24 rounded-lg border-2 border-[#071326] bg-slate-50 shadow-inner">
                   <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-[#071326]" />
                   <div className="mt-4 text-center text-[10px] font-bold text-slate-400 opacity-30">OUROBOROS</div>
                </div>
             </div>
          </div>

          <p className="mt-8 text-center font-primary text-xl font-bold leading-tight text-[#071326]">
            We receive a small,<br /> one-time payment.
          </p>
        </div>
      </div>
    </div>
  );
}


const whyUsFeatures = [
  {
    title: "Affordable Prices",
    description: "Premium quality digital goods at prices that make sense for your budget.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Commercial Licensing",
    description: "Every product comes with clear licensing options to sell your finished projects commercially.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Customization Options",
    description: "Easily tweak and tailor our products to match your unique style and branding.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: "Unique & Creative Designs",
    description: "Handcrafted visuals designed to stand out and give your projects a professional edge.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-1.172 1.172m-11.029 9.9l8.172-8.172" />
      </svg>
    ),
  },
  {
    title: "No AI Use",
    description: "100% human-made designs. We prioritize authenticity and soul in every single creation.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "No Third-Party Interaction",
    description: "Direct access to our tools and resources. No middlemen, just direct creative power.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Premium Subscriptions",
    description: "Unlock unlimited access to our growing library with our flexible subscription plans.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
      </svg>
    ),
  },
  {
    title: "Easy Downloads",
    description: "Instant access to your files immediately after purchase. Fast, simple, and reliable.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    title: "Multiple Products",
    description: "A wide variety of products to choose from, covering all your creative and professional needs.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

export default function Home() {
  const { currency } = useSettings();
  const [productCount, setProductCount] = useState("00");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/products/count`);
        const data = await res.json();
        if (res.ok && data.count) {
          setProductCount(data.count.toString());
        }
      } catch (err) {
        console.error("Failed to fetch product count", err);
      }
    };
    
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getCategories();
        // Since home page shows top 4, we slice the first 4
        setCategories(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCount();
    loadCategories();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-slate-50 mx-auto flex min-h-[85vh] max-w-[90rem] flex-col justify-center px-6 py-20 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center text-center lg:text-left">
          {/* Hero Content */}
          <div className="flex flex-col">
            <h1 className="font-primary text-4xl font-bold tracking-tight text-primary-900 sm:text-6xl">
              Premium Digital < br /> Products
            </h1>
            <p className="mt-4 font-secondary text-xl sm:text-2xl italic font-semibold text-slate-800">
              One stop shop for printers
            </p>
            <p className="mx-auto lg:mx-0 mt-6 max-w-xl font-secondary text-md sm:text-lg text-primary-600">
              Instant delivery. Quality guaranteed. Literature, education, stationary, and unique digital assets to help you succeed.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-900 px-6 py-3 font-secondary font-medium text-white transition hover:bg-primary-800"
              >
                Browse Products
                <ArrowRight />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-200 px-6 py-3 font-secondary font-medium text-primary-900 transition hover:bg-primary-300"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="w-full">
            {/* <ValuePropositionVisual /> */}
            <TradeVisual />
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="border-t border-primary-200 bg-white py-16">
        <div className="mx-auto max-w-[90rem] px-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-primary text-xl sm:text-3xl font-bold text-primary-900">Shop by Category</h2>
              <p className="mt-1 font-secondary text-primary-600 text-md sm:text-lg">Find exactly what you need</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-1 font-secondary font-medium text-secondary-600 hover:text-secondary-700">
              View all
              <ArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingCategories ? (
              // Skeleton Loaders
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white p-6 shadow-md border border-slate-100">
                  <div className="aspect-[4/3] rounded-lg bg-slate-200 animate-pulse"></div>
                  <div className="mt-4 h-5 w-3/4 rounded bg-slate-200 animate-pulse"></div>
                  <div className="mt-2 h-4 w-full rounded bg-slate-200 animate-pulse"></div>
                  <div className="mt-1 h-4 w-2/3 rounded bg-slate-200 animate-pulse"></div>
                  <div className="mt-4 h-4 w-1/3 rounded bg-slate-200 animate-pulse"></div>
                </div>
              ))
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  to={`/shop/category/${cat._id || cat.slug}`}
                  className="overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-primary-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-primary font-semibold text-primary-900">{cat.title}</h3>
                  <p className="mt-1 font-secondary text-sm text-primary-600">{cat.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 font-secondary text-sm font-medium text-secondary-600">
                    Browse collection
                    <ArrowRight />
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Us? */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-[90rem] px-6 sm:px-8">
          <div className="text-center">
            <h2 className="font-primary text-5xl sm:text-6xl font-black italic tracking-tight text-[#071326] drop-shadow-sm">
              WHY US?
            </h2>
            <p className="mt-4 mx-auto max-w-2xl font-secondary text-lg text-primary-600">
              As a printer, your priority is a high quality, original content that you can buy at an affordable price, own indefinitely, and sell its physical copy commercially. Ouroboros is the right platform for you.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {whyUsFeatures.map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-slate-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-900 transition-colors group-hover:bg-primary-900 group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-6 font-primary text-xl font-bold text-primary-900">
                  {feature.title}
                </h3>
                <p className="mt-2 font-secondary text-primary-600 leading-relaxed text-md sm:text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* <section className="py-16">
        <div className="mx-auto max-w-[90rem] px-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-primary text-2xl font-bold text-primary-900">Featured Products</h2>
              <p className="mt-1 font-secondary text-primary-600">Our most popular digital goods</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-1 font-secondary font-medium text-secondary-600 hover:text-secondary-700">
              View all products
              <ArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProductIds.map((id) => {
              const product = products[id];
              const categoryId = product.categoryId;
              return (
                <Link
                  key={product.id}
                  to={`/shop/category/${categoryId}/${product.id}`}
                  className="overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-primary-100">
                    <img
                      src={getCategoryImage(categoryId)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-primary font-semibold text-primary-900">{product.title}</h3>
                  <p className="mt-1 font-secondary text-primary-700">{formatPrice(product.price, currency)}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* Instant Digital Delivery */}
      <section className="border-t border-primary-200 bg-white py-32">
        <div className="mx-auto max-w-[90rem] px-6 text-center sm:px-8">
          <h2 className="font-primary text-xl sm:text-3xl font-bold text-primary-900">Instant Digital Delivery</h2>
          <p className="mx-auto mt-3 max-w-2xl font-secondary text-primary-600 text-md sm:text-lg">
            All products are delivered instantly after purchase. Download your files or access your content immediately via email or your account.
          </p>
          <div className="mx-auto mt-12 grid max-w-2xl gap-8 sm:grid-cols-2">
            <div>
              <p className="font-primary text-3xl font-bold text-primary-900">{productCount}</p>
              <p className="mt-1 font-secondary text-primary-600">Digital Products</p>
            </div>
            <div>
              <p className="font-primary text-3xl font-bold text-primary-900">24/7</p>
              <p className="mt-1 font-secondary text-primary-600">Instant Delivery</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
