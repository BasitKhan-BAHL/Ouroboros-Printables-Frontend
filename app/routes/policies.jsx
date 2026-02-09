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
    open: true,
    content: (
      <>
        <p className="mb-3 font-secondary text-primary-800">
          We collect only the information necessary to process your orders and improve your experience. This includes your name, email address, and payment details when you make a purchase.
        </p>
        <p className="mb-3 font-secondary text-primary-800">
          We do not sell or share your personal data with third parties for marketing purposes. Your data may be shared with trusted service providers who assist us in operating our store and processing payments, under strict confidentiality agreements.
        </p>
        <p className="mb-3 font-secondary text-primary-800">
          We use cookies and similar technologies to remember your preferences and understand how you use our site. You can control cookie settings through your browser.
        </p>
        <p className="font-secondary text-primary-800">
          You have the right to access, correct, or delete your personal information at any time. Contact us at support@digitalgoods.com for any requests or questions about your data.
        </p>
      </>
    ),
  },
  {
    id: "refund",
    title: "Refund Policy",
    open: false,
    content: (
      <p className="font-secondary text-primary-800">
        Due to the digital nature of our products, we generally do not offer refunds once a download has been accessed. If you experience technical issues or have not received your product, please contact us and we will work to resolve the issue.
      </p>
    ),
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    open: false,
    content: (
      <p className="font-secondary text-primary-800">
        By purchasing from Ouroboros Printables, you agree to use our products for personal or commercial use as specified in each product’s license. Redistribution or resale of our digital files is prohibited unless explicitly stated otherwise.
      </p>
    ),
  },
  {
    id: "updates",
    title: "Updates & Announcements",
    open: false,
    content: (
      <p className="font-secondary text-primary-800">
        We may update our policies from time to time. Significant changes will be communicated via email or a notice on our website. Continued use of our services after updates constitutes acceptance of the revised policies.
      </p>
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
        <a href="mailto:support@digitalgoods.com" className="underline hover:text-primary-900">support@digitalgoods.com</a>
      </p>
    </div>
  );
}
