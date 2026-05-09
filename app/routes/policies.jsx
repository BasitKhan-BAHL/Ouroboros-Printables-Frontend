import { useState } from "react";

export function meta() {
  return [
    { title: "Policies & Updates – Ouroboros Printables" },
    { name: "description", content: "Important information about our policies and recent updates." },
  ];
}

const policies = [
  {
    id: "privacy",
    title: "Privacy Policy",
    open: false,
    content: (
      <div className="space-y-4 font-secondary text-primary-800">
        <p>We collect necessary information such as name, email, and billing details to process orders. We do not sell your data to third parties for marketing.</p>
        <p>We use cookies to maintain functionality and analyze site usage. You have the right to access, correct, or delete your personal data by contacting support.</p>
        <p className="text-sm">For Lemon Squeezy's privacy practices, please refer to their official documentation as our payment processor.</p>
      </div>
    ),
  },
  {
    id: "licensing",
    title: "Licensing & Usage",
    open: true,
    content: (
      <div className="space-y-4 font-secondary text-primary-800">
        <p className="font-semibold text-primary-900">Get started by creating an account and purchasing a license. Our model supports your business growth:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>All products are sold as digital PDF files.</li>
          <li>Commercial use is permitted for physical (hardcopy) products only.</li>
          <li>You are free to print and sell the designs under your own brand.</li>
          <li>You may set your own pricing for the final physical products.</li>
        </ul>
        <p className="rounded-lg bg-amber-50 p-3 italic text-amber-800 border border-amber-100">
          Please note that resale or distribution of the digital files in their original or modified form is not permitted.
        </p>
      </div>
    ),
  },
  {
    id: "terms",
    title: "Licensing Terms",
    open: false,
    content: (
      <div className="space-y-6 font-secondary text-primary-800">
        <div>
          <h4 className="font-bold text-primary-900 uppercase text-xs tracking-wider mb-2">1. Commercial Use License</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permits printing and selling physical items to end customers (retail).</li>
            <li>You may add your own business name or logo to the printed product.</li>
            <li>Pricing starts from €10.99 (subject to change).</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary-900 uppercase text-xs tracking-wider mb-2">2. Extended Commercial Use License</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permits selling physical items to both business and non-business customers.</li>
            <li>You may add your own business name or logo to the printed product.</li>
            <li>Pricing starts from €20.99 (subject to change).</li>
          </ul>
        </div>
        <div className="border-t border-primary-100 pt-4">
          <p><span className="font-bold">License Duration:</span> All licenses are valid for one (1) month from purchase. Continued use requires renewal.</p>
          <p className="mt-2 text-sm italic">Licenses are non-transferable and all rights not expressly granted remain reserved by Ouroboros.</p>
        </div>
      </div>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer & Terms of Use",
    open: false,
    content: (
      <div className="space-y-4 font-secondary text-primary-800">
        <p>All finished designs are the intellectual property of Ouroboros and protected by copyright. Unauthorized reproduction or digital resale is strictly prohibited.</p>
        <p>All products are test-printed, but results may vary based on your equipment. Our products are intended for <span className="font-bold">paper products only</span>.</p>
        <p className="font-bold text-primary-900 underline">Ouroboros does not use AI-generated content in its designs.</p>
        <p>If you experience quality issues, contact us with your order number, proof of payment, and photos of the printed issue. We will respond within 1–2 business days.</p>
      </div>
    ),
  },
  {
    id: "purchases",
    title: "Purchases & Refund Policy",
    open: false,
    content: (
      <div className="space-y-4 font-secondary text-primary-800">
        <div>
          <h4 className="font-bold text-primary-900 mb-1">About Lemon Squeezy</h4>
          <p>Lemon Squeezy acts as our authorized reseller and payment processor. They handle secure transactions, tax collection, and compliance.</p>
        </div>
        <div>
          <h4 className="font-bold text-primary-900 mb-1">Refunds</h4>
          <p>Due to the nature of digital products, all sales are generally final. Refunds may be granted only if a file contains a persistent technical fault that cannot be resolved by our support team.</p>
        </div>
        <p className="text-sm italic">Files are available for download immediately after successful payment.</p>
      </div>
    ),
  },
  {
    id: "copyright",
    title: "Copyright & License Notice",
    open: false,
    content: (
      <div className="space-y-4 font-secondary text-primary-800">
        <p>Digital files remain the property of Ouroboros. You are granted a limited, non-exclusive, non-transferable monthly license.</p>
        <h4 className="font-bold text-primary-900">Prohibited Actions:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Reselling, sharing, or sublicensing the digital file.</li>
          <li>Uploading to marketplaces or cloud storage.</li>
          <li>Removing copyright notices or watermarks.</li>
          <li>Allowing others to extract the digital file from your product.</li>
        </ul>
        <p className="bg-red-50 p-2 text-xs text-red-700 border border-red-100 rounded">Violations may result in immediate revocation of rights and legal action.</p>
      </div>
    ),
  },
];

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export default function Policies() {
  const [openId, setOpenId] = useState("privacy");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
      <h1 className="text-center font-primary text-3xl font-bold text-primary-900">Policies & Updates</h1>
      <p className="mt-2 text-center font-secondary text-primary-600">
        Important information about our policies and recent updates
      </p>
      <div className="mt-10 space-y-3">
        {policies.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-primary-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
                className="flex w-full items-center justify-between px-6 py-4 text-left font-secondary font-medium text-primary-900 hover:bg-primary-50"
              >
                <span>{item.title}</span>
                <span className="text-primary-600">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
              </button>
              {isOpen && (
                <div className="border-t border-primary-100 px-6 py-4">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center font-secondary text-sm text-primary-500">Last updated: December 2024</p>
      <p className="mt-2 text-center font-secondary text-sm text-primary-600">
        Questions? Contact us at{" "}
        <a href="mailto:support@ouroborosprintables.com" className="underline hover:text-primary-900">support@ouroborosprintables.com</a>
      </p>
    </div>
  );
}
