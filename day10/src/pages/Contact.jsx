import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', order: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-3">Message Sent!</h1>
        <p className="text-gray-500 font-bold text-base mb-8 max-w-md">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button onClick={() => setSubmitted(false)} className="border-2 border-black font-black uppercase px-8 py-3 hover:bg-black hover:text-white transition-colors">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight italic mb-2">Contact Us</h1>
      <p className="font-medium text-gray-500 mb-12">We're here to help. Reach out anytime.</p>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Info */}
        <div className="w-full md:w-1/3 space-y-8">
          <div className="border-l-4 border-black pl-6">
            <h3 className="font-black uppercase text-sm mb-1">📞 Call Us</h3>
            <p className="text-gray-700 font-bold text-base">1-800-123-4567</p>
            <p className="text-gray-500 text-xs font-medium">Mon–Sat, 9AM–6PM IST</p>
          </div>
          <div className="border-l-4 border-black pl-6">
            <h3 className="font-black uppercase text-sm mb-1">📧 Email Us</h3>
            <p className="text-gray-700 font-bold text-base">support@adibas.com</p>
            <p className="text-gray-500 text-xs font-medium">Response within 24 hours</p>
          </div>
          <div className="border-l-4 border-black pl-6">
            <h3 className="font-black uppercase text-sm mb-1">📍 Head Office</h3>
            <p className="text-gray-700 font-bold text-sm leading-relaxed">
              Adibas India Pvt. Ltd.<br />
              123 Sport Street, Bandra West,<br />
              Mumbai — 400050
            </p>
          </div>
          <div className="bg-black text-white p-6">
            <h3 className="font-black uppercase mb-2">Live Chat</h3>
            <p className="text-gray-400 text-sm font-medium mb-4">Chat with an agent instantly (9AM–9PM IST)</p>
            <button className="bg-yellow-400 text-black font-black uppercase text-sm px-6 py-3 hover:bg-yellow-300 transition-colors">
              Start Chat
            </button>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-2/3">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                placeholder="Your Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Email *"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                placeholder="Order Number (optional)"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
              <select
                className="w-full border-b-2 border-black bg-white py-2 px-0 font-medium text-gray-700 focus:outline-none focus:border-gray-500"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              >
                <option value="" disabled>Subject *</option>
                <option>Order Issue</option>
                <option>Return / Refund</option>
                <option>Product Question</option>
                <option>Payment Problem</option>
                <option>Other</option>
              </select>
            </div>
            <textarea
              className="w-full border-b-2 border-black bg-white py-3 font-medium text-gray-700 focus:outline-none focus:border-gray-500 min-h-[140px] resize-y"
              placeholder="Your message *"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <Button type="submit">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
