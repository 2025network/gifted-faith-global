import { Facebook, Instagram, MessageCircle, Music2, Youtube } from "lucide-react";
import { socialLinks } from "../data";

const iconMap = {
  Facebook,
  Instagram,
  TikTok: Music2,
  YouTube: Youtube,
  WhatsApp: MessageCircle,
};

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
  showLabels?: boolean;
};

export function SocialLinks({
  className = "",
  linkClassName = "",
  showLabels = false,
}: SocialLinksProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Social media links">
      {socialLinks.map((social) => {
        const Icon = iconMap[social.label];

        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow ${social.label}`}
            className={
              linkClassName ||
              (showLabels
                ? "inline-flex items-center justify-center rounded border border-blue-100 bg-white px-4 py-3 text-[#0b4ea2] transition hover:border-[#d9a441] hover:bg-[#fff3d8] focus-visible:focus-ring"
                : "inline-flex h-10 w-10 items-center justify-center rounded border border-blue-100 bg-white text-[#0b4ea2] transition hover:border-[#d9a441] hover:bg-[#fff3d8] focus-visible:focus-ring")
            }
          >
            <Icon size={18} aria-hidden="true" />
            {showLabels ? <span className="ml-2 text-sm font-bold">{social.label}</span> : null}
          </a>
        );
      })}
    </div>
  );
}
