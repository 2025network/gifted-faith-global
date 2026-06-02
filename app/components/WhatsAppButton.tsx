import { MessageCircle } from "lucide-react";
import { brand } from "../data";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    `Hello ${brand.name}, I would like help with my travel or visa application.`
  );

  return (
    <a
      href={`https://wa.me/${brand.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:scale-105 focus-visible:focus-ring"
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
}
