import { Link } from "react-router";

export function meta() {
  return [
    { title: "About Us – Ouroboros Printables" },
    { name: "description", content: "Learn about us and get in touch." },
  ];
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-700">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-700">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <section className="mb-16">
        <h1 className="font-primary text-3xl font-bold text-primary-900">About Us</h1>
        <div className="mt-6 max-w-3xl space-y-4 font-secondary text-primary-900">
          <p>
            We are a small team passionate about helping individuals and businesses succeed through high-quality digital resources. Our products are carefully crafted to save you time and provide real value.
          </p>
          <p>
            Every template, e-book, course, and graphic in our collection is designed with clarity and usability in mind. We believe in instant access—no waiting, no shipping—so you can start using your purchases right away.
          </p>
          <p>
            Thank you for choosing Ouroboros Printables. We are here to support you on your journey.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-primary text-3xl font-bold text-primary-900">Contact Us</h2>
        <p className="mt-2 max-w-2xl font-secondary text-primary-700">
          Have a question or feedback? We would love to hear from you. Send us a message and we will get back to you as soon as we can.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-200">
                <MailIcon />
              </div>
              <div>
                <p className="font-secondary font-semibold text-primary-900">Email</p>
                <a href="mailto:support@digitalgoods.com" className="font-secondary text-primary-900 underline hover:text-primary-700">support@digitalgoods.com</a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-200">
                <MapPinIcon />
              </div>
              <div>
                <p className="font-secondary font-semibold text-primary-900">Location</p>
                <p className="font-secondary text-primary-900">United Kingdom</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-md">
            <h3 className="font-primary text-lg font-semibold text-primary-900">Send a Message</h3>
            <form className="mt-4 space-y-4">
              <div>
                <label htmlFor="contact-name" className="block font-secondary text-sm font-medium text-primary-900">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  className="mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-secondary text-sm font-medium text-primary-900">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-secondary text-sm font-medium text-primary-900">Message</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="How can we help?"
                  className="mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 px-4 py-3 font-secondary font-medium text-white hover:bg-primary-800 sm:w-auto"
              >
                <SendIcon />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
