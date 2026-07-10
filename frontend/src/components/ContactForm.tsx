"use client";

import { useState } from "react";

import { CONTACT_EMAIL } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "استفسار من " + (name || "عميلة"),
  )}&body=${encodeURIComponent(`${message}\n\nمن: ${name}\nالبريد: ${email}`)}`;

  return (
    <form
      className="card space-y-3 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-semibold text-brand-plum">الاسم</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-brand-rose bg-white px-4 py-3 outline-none focus:border-brand-primary"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-brand-plum">البريد الإلكتروني</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
          className="w-full rounded-2xl border border-brand-rose bg-white px-4 py-3 text-right outline-none focus:border-brand-primary"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-brand-plum">رسالتكِ</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-brand-rose bg-white px-4 py-3 outline-none focus:border-brand-primary"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full">إرسال</button>
    </form>
  );
}
