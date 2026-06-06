"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Wand2 } from "lucide-react";

const platforms = [
  "Facebook",
  "Instagram",
  "WhatsApp Status",
  "TikTok/Reels",
  "Google Business Profile",
  "Blog",
] as const;

const topics = [
  "China Visa",
  "UK Visa",
  "Canada Visa",
  "USA Visa",
  "Dubai Visa",
  "Study Abroad",
  "Travel Tips",
  "Visa Rejection Mistakes",
  "Document Preparation",
] as const;

const frequencies = ["Daily Post", "Weekly Plan", "Monthly Plan"] as const;
const tones = ["Professional", "Friendly", "Urgent", "Educational"] as const;

type Platform = (typeof platforms)[number];
type Topic = (typeof topics)[number];
type Frequency = (typeof frequencies)[number];
type Tone = (typeof tones)[number];

type DailyContent = {
  caption: string;
  hashtags: string;
  callToAction: string;
  imageIdea: string;
};

type WeeklyContent = DailyContent & {
  day: string;
  platform: Platform;
  videoIdea: string;
};

type MonthlyContent = {
  day: number;
  topic: Topic;
  caption: string;
  suggestedPlatform: Platform;
  callToAction: string;
};

const ctaDetails = {
  phone: "08034126577",
  whatsapp: "2348034126577",
  website: "https://giftedfaithglobal.com",
  address: "Shop 30, Napex Car Park, By American Embassy, Victoria Island, Lagos, Nigeria",
};

const topicAngles: Record<Topic, string[]> = {
  "China Visa": [
    "China visa document preparation",
    "business, tourist, student, and family visit visa guidance",
    "invitation letter and itinerary support",
  ],
  "UK Visa": [
    "UK visitor visa readiness",
    "clear financial and travel-purpose documentation",
    "family visit, business, study, and tourism support",
  ],
  "Canada Visa": [
    "Canada visa and study permit planning",
    "proof of funds and application file organization",
    "travel-purpose and sponsor-document guidance",
  ],
  "USA Visa": [
    "USA appointment preparation",
    "travel-purpose clarity and supporting documents",
    "interview-readiness guidance",
  ],
  "Dubai Visa": [
    "Dubai travel documentation",
    "tourism and short-stay planning",
    "reservation and itinerary support",
  ],
  "Study Abroad": [
    "school application and study visa preparation",
    "statement of purpose and sponsor-document planning",
    "student document checklist guidance",
  ],
  "Travel Tips": [
    "smarter travel preparation",
    "booking, itinerary, and documentation reminders",
    "practical travel planning support",
  ],
  "Visa Rejection Mistakes": [
    "common visa refusal risks",
    "inconsistent forms and weak documentation",
    "how organized files reduce avoidable mistakes",
  ],
  "Document Preparation": [
    "document compilation and organization",
    "passport, bank statement, reservations, and invitation documents",
    "clean application file preparation",
  ],
};

const platformNotes: Record<Platform, string> = {
  Facebook: "Use a clear client-friendly caption with a direct WhatsApp CTA.",
  Instagram: "Use concise copy, strong hooks, and saveable carousel-style points.",
  "WhatsApp Status": "Keep it short, urgent, and easy to reply to.",
  "TikTok/Reels": "Use a quick spoken hook with text overlays and practical tips.",
  "Google Business Profile": "Keep the post professional and service-focused.",
  Blog: "Use this as an article intro or content brief.",
};

function toneIntro(tone: Tone) {
  const intros: Record<Tone, string> = {
    Professional: "Plan your next application with structured guidance.",
    Friendly: "Thinking about your next trip? Let us help you prepare with less stress.",
    Urgent: "Do not wait until your travel date is close before organizing your documents.",
    Educational: "A strong application starts with clear, complete, and consistent documents.",
  };

  return intros[tone];
}

function hashtagFor(topic: Topic) {
  return `#GiftedFaithGlobal #VisaAssistance #TravelSupport #${topic.replace(/[^A-Za-z]/g, "")} #NigeriaTravel`;
}

function callToAction(topic: Topic) {
  return `Contact Gifted-Faith Global Ventures for ${topic} support. Call ${ctaDetails.phone}, WhatsApp ${ctaDetails.whatsapp}, or visit ${ctaDetails.website}.`;
}

function dailyCaption(platform: Platform, topic: Topic, tone: Tone, dayIndex = 0) {
  const angle = topicAngles[topic][dayIndex % topicAngles[topic].length];

  return `${toneIntro(tone)} Gifted-Faith Global Ventures assists with ${angle}. ${platformNotes[platform]} Visit us at ${ctaDetails.address}.`;
}

function imageIdea(topic: Topic, platform: Platform, index = 0) {
  const ideas = [
    `${topic} checklist graphic with passport, document folder, and travel icons`,
    `Short ${platform} visual showing key documents arranged neatly on a desk`,
    `Client-ready travel document carousel for ${topic}`,
    `Office consultation scene with ${topic} headline overlay`,
  ];

  return ideas[index % ideas.length];
}

function makeDaily(platform: Platform, topic: Topic, tone: Tone): DailyContent {
  return {
    caption: dailyCaption(platform, topic, tone),
    hashtags: hashtagFor(topic),
    callToAction: callToAction(topic),
    imageIdea: imageIdea(topic, platform),
  };
}

function makeWeekly(platform: Platform, topic: Topic, tone: Tone): WeeklyContent[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return days.map((day, index) => {
    const planPlatform = platforms[(platforms.indexOf(platform) + index) % platforms.length];

    return {
      day,
      platform: planPlatform,
      caption: dailyCaption(planPlatform, topic, tone, index),
      hashtags: hashtagFor(topic),
      callToAction: callToAction(topic),
      imageIdea: imageIdea(topic, planPlatform, index),
      videoIdea: `Create a ${index + 1}-point ${topic} tip video for ${planPlatform}.`,
    };
  });
}

function makeMonthly(platform: Platform, topic: Topic, tone: Tone): MonthlyContent[] {
  return Array.from({ length: 30 }, (_, index) => {
    const planTopic = topics[(topics.indexOf(topic) + index) % topics.length];
    const suggestedPlatform = platforms[(platforms.indexOf(platform) + index) % platforms.length];

    return {
      day: index + 1,
      topic: planTopic,
      caption: dailyCaption(suggestedPlatform, planTopic, tone, index),
      suggestedPlatform,
      callToAction: callToAction(planTopic),
    };
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyText}
      className="inline-flex items-center gap-2 rounded bg-[#073b7a] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0b4ea2]"
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function dailyToText(content: DailyContent) {
  return [
    `Caption: ${content.caption}`,
    `Hashtags: ${content.hashtags}`,
    `Call to Action: ${content.callToAction}`,
    `Suggested image idea: ${content.imageIdea}`,
  ].join("\n");
}

function weeklyToText(content: WeeklyContent) {
  return [
    `${content.day} - ${content.platform}`,
    `Caption: ${content.caption}`,
    `Hashtags: ${content.hashtags}`,
    `Call to Action: ${content.callToAction}`,
    `Image or video idea: ${content.imageIdea}. ${content.videoIdea}`,
  ].join("\n");
}

function monthlyToText(content: MonthlyContent) {
  return [
    `Day ${content.day}`,
    `Topic: ${content.topic}`,
    `Suggested platform: ${content.suggestedPlatform}`,
    `Caption: ${content.caption}`,
    `Call to Action: ${content.callToAction}`,
  ].join("\n");
}

export function MarketingGenerator() {
  const [platform, setPlatform] = useState<Platform>("Facebook");
  const [topic, setTopic] = useState<Topic>("China Visa");
  const [frequency, setFrequency] = useState<Frequency>("Daily Post");
  const [tone, setTone] = useState<Tone>("Professional");

  const dailyContent = useMemo(() => makeDaily(platform, topic, tone), [platform, topic, tone]);
  const weeklyContent = useMemo(() => makeWeekly(platform, topic, tone), [platform, topic, tone]);
  const monthlyContent = useMemo(() => makeMonthly(platform, topic, tone), [platform, topic, tone]);

  return (
    <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
      <section className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded bg-[#073b7a] text-white">
            <Wand2 size={21} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
              Generator controls
            </p>
            <h2 className="text-2xl font-bold text-[#073b7a]">Choose your content style</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <SelectField label="Platform" value={platform} values={platforms} onChange={setPlatform} />
          <SelectField label="Topic" value={topic} values={topics} onChange={setTopic} />
          <SelectField label="Frequency" value={frequency} values={frequencies} onChange={setFrequency} />
          <SelectField label="Tone" value={tone} values={tones} onChange={setTone} />
        </div>

        <div className="mt-6 rounded bg-[#f4f8ff] p-4 ring-1 ring-blue-100">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#073b7a]">
            CTA details
          </h3>
          <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
            <p><strong>Phone:</strong> {ctaDetails.phone}</p>
            <p><strong>WhatsApp:</strong> {ctaDetails.whatsapp}</p>
            <p><strong>Website:</strong> {ctaDetails.website}</p>
            <p><strong>Address:</strong> {ctaDetails.address}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
            Generated content
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#073b7a]">{frequency}</h2>
        </div>

        {frequency === "Daily Post" ? (
          <GeneratedCard title={`${topic} for ${platform}`} text={dailyToText(dailyContent)}>
            <Detail label="Caption" value={dailyContent.caption} />
            <Detail label="Hashtags" value={dailyContent.hashtags} />
            <Detail label="Call to Action" value={dailyContent.callToAction} />
            <Detail label="Suggested image idea" value={dailyContent.imageIdea} />
          </GeneratedCard>
        ) : null}

        {frequency === "Weekly Plan" ? (
          <div className="grid gap-4">
            {weeklyContent.map((content) => (
              <GeneratedCard
                key={content.day}
                title={`${content.day} - ${content.platform}`}
                text={weeklyToText(content)}
              >
                <Detail label="Caption" value={content.caption} />
                <Detail label="Hashtags" value={content.hashtags} />
                <Detail label="Call to Action" value={content.callToAction} />
                <Detail
                  label="Image or video idea"
                  value={`${content.imageIdea}. ${content.videoIdea}`}
                />
              </GeneratedCard>
            ))}
          </div>
        ) : null}

        {frequency === "Monthly Plan" ? (
          <div className="grid gap-4">
            {monthlyContent.map((content) => (
              <GeneratedCard
                key={content.day}
                title={`Day ${content.day} - ${content.topic}`}
                text={monthlyToText(content)}
              >
                <Detail label="Suggested platform" value={content.suggestedPlatform} />
                <Detail label="Caption" value={content.caption} />
                <Detail label="Call to Action" value={content.callToAction} />
              </GeneratedCard>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-[#8a6423]">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-700">{value}</dd>
    </div>
  );
}

function GeneratedCard({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-xl font-bold text-[#102033]">{title}</h3>
        <CopyButton text={text} />
      </div>
      <dl className="mt-4 grid gap-4">{children}</dl>
    </article>
  );
}
