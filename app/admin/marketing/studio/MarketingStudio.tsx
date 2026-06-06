"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clipboard, Download, FileText, ImageDown, Wand2 } from "lucide-react";

const services = [
  "China Visa",
  "UK Visa",
  "Canada Visa",
  "USA Visa",
  "Dubai Visa",
  "Schengen Visa",
  "Study Abroad",
  "Travel Consultation",
  "Passport Assistance",
  "Document Preparation",
  "Visa Refusal Appeal",
  "General Travel Promotion",
] as const;

const flyerStyles = [
  "Professional Corporate",
  "Modern Travel",
  "Premium Gold",
  "Visa Promotion",
  "Study Abroad",
  "Urgent Processing",
  "Special Offer",
] as const;

const platforms = [
  "Facebook",
  "Instagram",
  "WhatsApp Status",
  "TikTok",
  "LinkedIn",
  "Google Business Profile",
] as const;

const packageTypes = ["Single Post", "7-Day Campaign", "30-Day Campaign"] as const;

type Service = (typeof services)[number];
type FlyerStyle = (typeof flyerStyles)[number];
type Platform = (typeof platforms)[number];
type PackageType = (typeof packageTypes)[number];

type CampaignItem = {
  day: number;
  service: Service;
  platform: Platform;
  caption: string;
  hashtags: string;
  callToAction: string;
  imageIdea: string;
  videoIdea: string;
};

type CampaignHistory = {
  id: string;
  service: Service;
  platform: Platform;
  packageType: PackageType;
  createdAt: string;
};

const business = {
  name: "Gifted-Faith Global Ventures",
  phone: "08034126577",
  whatsapp: "2348034126577",
  website: "https://giftedfaithglobal.com",
  address: "Shop 30, Napex Car Park, By American Embassy, Victoria Island, Lagos, Nigeria",
};

const storageKey = "gifted-faith-marketing-studio-history";

const styleThemes: Record<FlyerStyle, { headline: string; accent: string; background: string; offer: string }> = {
  "Professional Corporate": {
    headline: "Professional Visa & Travel Support",
    accent: "#0b4ea2",
    background: "#f4f8ff",
    offer: "Clear guidance. Organized documents. Trusted support.",
  },
  "Modern Travel": {
    headline: "Plan Your Next Trip With Confidence",
    accent: "#0f766e",
    background: "#ecfeff",
    offer: "Travel support designed for modern applicants.",
  },
  "Premium Gold": {
    headline: "Premium Travel Application Assistance",
    accent: "#d9a441",
    background: "#fff7e6",
    offer: "Elegant preparation for important travel plans.",
  },
  "Visa Promotion": {
    headline: "Visa Application Support Now Available",
    accent: "#073b7a",
    background: "#eef5ff",
    offer: "Get document guidance before you submit.",
  },
  "Study Abroad": {
    headline: "Start Your Study Abroad Journey",
    accent: "#2563eb",
    background: "#eff6ff",
    offer: "School, document, and study visa preparation support.",
  },
  "Urgent Processing": {
    headline: "Do Not Delay Your Travel Preparation",
    accent: "#dc2626",
    background: "#fff1f2",
    offer: "Act early. Organize documents. Avoid last-minute stress.",
  },
  "Special Offer": {
    headline: "Special Travel Support Package",
    accent: "#7c3aed",
    background: "#f5f3ff",
    offer: "Ask about our service support for your destination.",
  },
};

const serviceAngles: Record<Service, string[]> = {
  "China Visa": ["business visa guidance", "tourist visa support", "invitation letter review"],
  "UK Visa": ["visitor visa preparation", "family visit guidance", "financial document review"],
  "Canada Visa": ["study permit planning", "visitor visa support", "sponsor document guidance"],
  "USA Visa": ["appointment preparation", "interview readiness", "travel-purpose documentation"],
  "Dubai Visa": ["tourism travel planning", "short-stay guidance", "reservation support"],
  "Schengen Visa": ["itinerary planning", "travel insurance reminders", "multi-country document checks"],
  "Study Abroad": ["school application planning", "statement of purpose guidance", "student visa documents"],
  "Travel Consultation": ["destination planning", "travel document checklist", "booking and itinerary advice"],
  "Passport Assistance": ["passport renewal support", "appointment readiness", "document checklist guidance"],
  "Document Preparation": ["document compilation", "file organization", "review before submission"],
  "Visa Refusal Appeal": ["refusal reason review", "next-step guidance", "stronger resubmission planning"],
  "General Travel Promotion": ["travel readiness", "destination guidance", "end-to-end planning"],
};

function serviceLabel(service: Service) {
  return `${service} Assistance`;
}

function makeHashtags(service: Service, platform: Platform) {
  const serviceTag = service.replace(/[^A-Za-z]/g, "");
  const platformTag = platform.replace(/[^A-Za-z]/g, "");

  return `#GiftedFaithGlobal #VisaAssistance #TravelSupport #${serviceTag} #${platformTag} #NigeriaTravel`;
}

function makeCallToAction(service: Service) {
  return `Need ${service} support? Call ${business.phone}, WhatsApp ${business.whatsapp}, or visit ${business.website}.`;
}

function makeCaption(service: Service, platform: Platform, index: number) {
  const angle = serviceAngles[service][index % serviceAngles[service].length];
  const platformLine: Record<Platform, string> = {
    Facebook: "Send us a message and let us review your next step.",
    Instagram: "Save this post and share it with someone planning to travel.",
    "WhatsApp Status": "Reply now if you need help preparing your documents.",
    TikTok: "Use this as a quick travel-prep reminder before you apply.",
    LinkedIn: "Professional travel preparation starts with organized documentation.",
    "Google Business Profile": "Visit Gifted-Faith Global Ventures for structured travel support.",
  };

  return `${business.name} provides ${angle} for ${service}. ${platformLine[platform]} Our office: ${business.address}.`;
}

function makeImageIdea(service: Service, style: FlyerStyle, index: number) {
  const ideas = [
    `${style} flyer with passport, airplane, and organized document folder for ${service}`,
    `Clean checklist visual showing key ${service} documents`,
    `Travel desk scene with ${service} headline and blue-gold branding`,
    `Client consultation image with ${service} callout text`,
  ];

  return ideas[index % ideas.length];
}

function makeVideoIdea(service: Service, platform: Platform, index: number) {
  if (platform === "TikTok" || platform === "Instagram" || platform === "WhatsApp Status") {
    return `${index + 1}-point short video: documents to prepare for ${service}.`;
  }

  return `Short explainer clip or carousel walkthrough for ${service}.`;
}

function generateCampaign(
  service: Service,
  platform: Platform,
  packageType: PackageType,
  style: FlyerStyle
) {
  const count = packageType === "Single Post" ? 1 : packageType === "7-Day Campaign" ? 7 : 30;

  return Array.from({ length: count }, (_, index): CampaignItem => {
    const itemService = packageType === "30-Day Campaign" ? services[(services.indexOf(service) + index) % services.length] : service;
    const itemPlatform = platforms[(platforms.indexOf(platform) + index) % platforms.length];

    return {
      day: index + 1,
      service: itemService,
      platform: itemPlatform,
      caption: makeCaption(itemService, itemPlatform, index),
      hashtags: makeHashtags(itemService, itemPlatform),
      callToAction: makeCallToAction(itemService),
      imageIdea: makeImageIdea(itemService, style, index),
      videoIdea: makeVideoIdea(itemService, itemPlatform, index),
    };
  });
}

function itemToText(item: CampaignItem) {
  return [
    `Day: ${item.day}`,
    `Service: ${item.service}`,
    `Platform: ${item.platform}`,
    `Caption: ${item.caption}`,
    `Hashtags: ${item.hashtags}`,
    `Call To Action: ${item.callToAction}`,
    `Image Idea: ${item.imageIdea}`,
    `Video Idea: ${item.videoIdea}`,
  ].join("\n");
}

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text: string, maxLength: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function createSimplePdf(items: CampaignItem[]) {
  const lines = items.flatMap((item) => [
    `Day ${item.day} - ${item.service} - ${item.platform}`,
    `Caption: ${item.caption}`,
    `Hashtags: ${item.hashtags}`,
    `CTA: ${item.callToAction}`,
    `Image Idea: ${item.imageIdea}`,
    `Video Idea: ${item.videoIdea}`,
    "",
  ]);
  const wrappedLines = lines.flatMap((line) => wrapText(line, 82));
  const pageChunks: string[][] = [];

  for (let index = 0; index < wrappedLines.length; index += 42) {
    pageChunks.push(wrappedLines.slice(index, index + 42));
  }

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(`<< /Type /Pages /Kids [${pageChunks.map((_, index) => `${3 + index * 2} 0 R`).join(" ")}] /Count ${pageChunks.length} >>`);

  pageChunks.forEach((chunk, index) => {
    const pageObject = 3 + index * 2;
    const contentObject = pageObject + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents ${contentObject} 0 R >>`);
    const content = [
      "BT",
      "/F1 11 Tf",
      "50 750 Td",
      ...chunk.map((line, lineIndex) => `${lineIndex === 0 ? "" : "0 -16 Td "}(${escapePdfText(line)}) Tj`),
      "ET",
    ].join("\n");
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  const offsets: number[] = [0];
  let pdf = "%PDF-1.4\n";

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  let line = "";
  let currentY = y;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
      return;
    }

    line = testLine;
  });

  if (line) context.fillText(line, x, currentY);
  return currentY + lineHeight;
}

function downloadFlyer(service: Service, style: FlyerStyle) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) return;

  const theme = styleThemes[style];
  context.fillStyle = theme.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#073b7a";
  context.fillRect(0, 0, canvas.width, 260);
  context.fillStyle = theme.accent;
  context.fillRect(0, 260, canvas.width, 18);
  context.fillStyle = "#ffffff";
  context.font = "bold 42px Arial";
  context.fillText(business.name, 70, 95);
  context.font = "24px Arial";
  context.fillText("Guided by Faith, Connected to the World.", 70, 140);
  context.fillStyle = "#d9a441";
  context.font = "bold 34px Arial";
  context.fillText(style, 70, 205);

  context.fillStyle = "#102033";
  context.font = "bold 72px Arial";
  drawWrappedText(context, serviceLabel(service), 70, 410, 920, 84);
  context.font = "bold 42px Arial";
  context.fillStyle = theme.accent;
  drawWrappedText(context, theme.headline, 70, 610, 920, 54);
  context.font = "32px Arial";
  context.fillStyle = "#334155";
  drawWrappedText(context, theme.offer, 70, 750, 920, 44);

  context.fillStyle = "#ffffff";
  context.fillRect(70, 905, 940, 300);
  context.strokeStyle = "#dbeafe";
  context.strokeRect(70, 905, 940, 300);
  context.fillStyle = "#073b7a";
  context.font = "bold 34px Arial";
  context.fillText("Contact Details", 110, 970);
  context.font = "28px Arial";
  context.fillStyle = "#102033";
  context.fillText(`Phone: ${business.phone}`, 110, 1030);
  context.fillText(`WhatsApp: ${business.whatsapp}`, 110, 1080);
  context.fillText(`Website: ${business.website}`, 110, 1130);
  drawWrappedText(context, `Address: ${business.address}`, 110, 1180, 830, 36);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-flyer.png`;
  link.click();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copyText}
      className="inline-flex items-center gap-2 rounded bg-[#073b7a] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0b4ea2]"
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />}
      {copied ? "Copied" : "Copy Content"}
    </button>
  );
}

function mostUsed<T extends string>(items: CampaignHistory[], key: "service" | "platform") {
  const counts = new Map<T, number>();

  items.forEach((item) => {
    const value = item[key] as T;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";
}

function SelectField<T extends string>({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: T;
  values: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded border border-blue-100 bg-white px-3 py-3 font-normal outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100"
      >
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

export function MarketingStudio() {
  const [service, setService] = useState<Service>("China Visa");
  const [style, setStyle] = useState<FlyerStyle>("Professional Corporate");
  const [platform, setPlatform] = useState<Platform>("Facebook");
  const [packageType, setPackageType] = useState<PackageType>("Single Post");
  const [history, setHistory] = useState<CampaignHistory[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      setHistory(JSON.parse(stored) as CampaignHistory[]);
    } catch {
      setHistory([]);
    }
  }, []);

  const campaign = useMemo(
    () => generateCampaign(service, platform, packageType, style),
    [service, platform, packageType, style]
  );
  const theme = styleThemes[style];
  const recentCampaigns = history.slice(0, 5);

  function recordCampaign() {
    const nextHistory: CampaignHistory[] = [
      {
        id: crypto.randomUUID(),
        service,
        platform,
        packageType,
        createdAt: new Date().toISOString(),
      },
      ...history,
    ].slice(0, 50);

    setHistory(nextHistory);
    window.localStorage.setItem(storageKey, JSON.stringify(nextHistory));
  }

  function downloadCampaignPdf() {
    const blob = createSimplePdf(campaign);
    downloadBlob(blob, `${packageType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Campaigns Generated", value: history.length },
          { label: "Most Used Service", value: mostUsed<Service>(history, "service") },
          { label: "Most Used Platform", value: mostUsed<Platform>(history, "platform") },
          { label: "Recent Campaigns", value: recentCampaigns.length },
        ].map((item) => (
          <article key={item.label} className="rounded border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-[#073b7a]">{item.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{item.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="grid gap-5">
          <div className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded bg-[#073b7a] text-white">
                <Wand2 size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
                  Studio controls
                </p>
                <h2 className="text-2xl font-bold text-[#073b7a]">Create campaign assets</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <SelectField label="Marketing Flyer Service" value={service} values={services} onChange={setService} />
              <SelectField label="Flyer Style" value={style} values={flyerStyles} onChange={setStyle} />
              <SelectField label="Social Media Platform" value={platform} values={platforms} onChange={setPlatform} />
              <SelectField label="Marketing Package" value={packageType} values={packageTypes} onChange={setPackageType} />
            </div>

            <button
              type="button"
              onClick={recordCampaign}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-[#d9a441] px-5 py-3 text-sm font-bold text-[#102033] transition hover:bg-[#c9942f]"
            >
              <FileText size={18} aria-hidden="true" />
              Generate and Save Campaign
            </button>
          </div>

          <div className="rounded bg-[#f4f8ff] p-5 ring-1 ring-blue-100">
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#073b7a]">
              Recent campaigns
            </h3>
            {recentCampaigns.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {recentCampaigns.map((item) => (
                  <div key={item.id} className="rounded bg-white p-3 text-sm ring-1 ring-blue-100">
                    <p className="font-bold text-[#102033]">{item.service}</p>
                    <p className="mt-1 text-slate-600">
                      {item.packageType} for {item.platform}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No generated campaigns yet.</p>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
                  Marketing flyer generator
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#073b7a]">{serviceLabel(service)}</h2>
              </div>
              <button
                type="button"
                onClick={() => downloadFlyer(service, style)}
                className="inline-flex items-center justify-center gap-2 rounded bg-[#073b7a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b4ea2]"
              >
                <ImageDown size={17} aria-hidden="true" />
                Download Flyer as PNG
              </button>
            </div>

            <div
              className="mt-6 overflow-hidden rounded border border-blue-100 shadow-sm"
              style={{ backgroundColor: theme.background }}
            >
              <div className="bg-[#073b7a] p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">{style}</p>
                <h3 className="mt-3 text-3xl font-bold">{business.name}</h3>
                <p className="mt-2 text-sm text-blue-100">Guided by Faith, Connected to the World.</p>
              </div>
              <div className="p-6">
                <p className="text-sm font-bold uppercase tracking-wide" style={{ color: theme.accent }}>
                  {theme.headline}
                </p>
                <h4 className="mt-3 text-4xl font-bold leading-tight text-[#102033]">
                  {serviceLabel(service)}
                </h4>
                <p className="mt-4 text-base leading-7 text-slate-700">{theme.offer}</p>
                <div className="mt-6 rounded bg-white p-5 text-sm leading-6 text-slate-700 ring-1 ring-blue-100">
                  <p><strong>Phone:</strong> {business.phone}</p>
                  <p><strong>WhatsApp:</strong> {business.whatsapp}</p>
                  <p><strong>Website:</strong> {business.website}</p>
                  <p><strong>Address:</strong> {business.address}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
                  Social media generator
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#073b7a]">{packageType}</h2>
              </div>
              <button
                type="button"
                onClick={downloadCampaignPdf}
                className="inline-flex items-center justify-center gap-2 rounded bg-[#073b7a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b4ea2]"
              >
                <Download size={17} aria-hidden="true" />
                Download Campaign as PDF
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {campaign.map((item) => (
                <article key={`${item.day}-${item.service}-${item.platform}`} className="rounded border border-blue-100 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8a6423]">
                        Day {item.day} - {item.platform}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-[#102033]">{item.service}</h3>
                    </div>
                    <CopyButton text={itemToText(item)} />
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                    <Detail label="Caption" value={item.caption} />
                    <Detail label="Hashtags" value={item.hashtags} />
                    <Detail label="Call To Action" value={item.callToAction} />
                    <Detail label="Image Idea" value={item.imageIdea} />
                    <Detail label="Video Idea" value={item.videoIdea} />
                  </dl>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-[#8a6423]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
