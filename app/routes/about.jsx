import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/auth";

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

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-700">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.email) setEmail(user.email);
    if (user && user.name) setName(user.name);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, userId: user?.id || null }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setStatus({ type: "success", text: "Message sent successfully!" });
      setMessage(""); // Reset message
      if (!user) {
        setName("");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err.message || "Failed to send message" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-8">
      <section className="mb-16">
        <h1 className="font-primary text-3xl font-bold text-primary-900">About Us</h1>
        <div className="mt-6 max-w-3xl space-y-4 font-secondary text-primary-900 leading-relaxed">
          <p>
            Inspired by the ancient concept of the Ouroboros, a symbol of infinity and continuous renewal, our digital printables are designed to offer limitless value through a single purchase. Each product you receive is not just a file, but the result of extensive creative effort, thoughtful ideation, and meticulous design execution.
          </p>
          <p>
            Every piece in our collection is carefully crafted by our team, going through multiple stages of refinement and review before reaching its final form. We are committed to maintaining high artistic standards while ensuring that our designs remain respectful, inclusive, and reflective of the diverse cultures and values that shape our world.
          </p>
          <p>
            Our mission is to provide printers, publishers, and small business owners with high-quality, ready-to-use digital printables that are both original and affordable. Whether you are starting your own printing business or expanding your product range, our designs offer a convenient and cost-effective solution.
          </p>
          <p className="font-semibold text-primary-800">
            With prices starting from just €1.99, we make premium digital content accessible without compromising on quality.
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
                <a href="mailto:support@ouroborosprintables.com" className="font-secondary text-primary-900 underline hover:text-primary-700">support@ouroborosprintables.com</a>
              </div>
            </div>
            {/* <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-200">
                <MapPinIcon />
              </div>
              <div>
                <p className="font-secondary font-semibold text-primary-900">Location</p>
                <p className="font-secondary text-primary-900">United Kingdom</p>
              </div>
            </div> */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-200">
                <InstagramIcon />
              </div>
              <div>
                <p className="font-secondary font-semibold text-primary-900">Instagram</p>
                <a
                  href="https://www.instagram.com/ouroboros_printables?igsh=enhlcjV2NWQ3N2I3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-secondary text-primary-900 underline hover:text-primary-700"
                >
                  @ouroboros_printables
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-md">
            <h3 className="font-primary text-lg font-semibold text-primary-900">Send a Message</h3>
            {status.text && (
              <div className={`mt-4 rounded-lg p-3 font-secondary text-sm ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {status.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="contact-name" className="block font-secondary text-sm font-medium text-primary-900">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-secondary text-sm font-medium text-primary-900">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-secondary text-sm font-medium text-primary-900">Message</label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="How can we help?"
                  className="mt-1 w-full rounded-lg border border-primary-300 bg-primary-100 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-500 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 px-4 py-3 font-secondary font-medium text-white hover:bg-primary-800 disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto"
              >
                {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <SendIcon />}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
