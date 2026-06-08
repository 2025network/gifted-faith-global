import { MessageCircle } from "lucide-react";
import { socialLinks } from "../data";

type WhatsAppCtaProps = {
  className?: string;
};

export function WhatsAppCta({ className = "" }: WhatsAppCtaProps) {
  const whatsapp = socialLinks.find((social) => social.label === "WhatsApp");

  return (
    <a
      href={whatsapp?.href ?? "https://wa.me/2348034126577"}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded bg-[#0b4ea2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a] focus-visible:focus-ring ${className}`}
    >
      Chat with us on WhatsApp <MessageCircle size={18} aria-hidden="true" />
    </a>
  );
}
