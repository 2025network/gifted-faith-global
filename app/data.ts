import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  Hotel,
  MapPinned,
  Plane,
  RefreshCcw,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const brand = {
  name: "Gifted-Faith Global Ventures",
  slogan: "Guided by Faith, Connected to the World.",
  tagline: "Travel, visa assistance, bookings, and document support.",
  phone: "08034126577",
  whatsapp: "2348034126577",
  email: "info@giftedfaithglobal.com",
  address: "Shop 30, Napex Car Park, By American Embassy, Victoria Island, Lagos, Nigeria",
};

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/GiftedFaithGlobal" },
  { label: "Instagram", href: "https://instagram.com/GiftedFaithGlobal" },
  { label: "TikTok", href: "https://tiktok.com/@GiftedFaithGlobal" },
  { label: "YouTube", href: "https://youtube.com/@GiftedFaithGlobal" },
  { label: "WhatsApp", href: "https://wa.me/2348034126577" },
] as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/apply-now", label: "Apply Now" },
  { href: "/track-application", label: "Track Application" },
  { href: "/contact", label: "Contact" },
];

export const services = [
  { title: "UK Visa Assistance", description: "Guidance for visitor, family, study, and business travel documentation.", icon: Building2 },
  { title: "China Visa Application", description: "Preparation and document guidance for China tourist, business, student, family, and work visa categories.", icon: MapPinned },
  { title: "Canada Visa Assistance", description: "Support with forms, appointment readiness, and organized application files.", icon: MapPinned },
  { title: "USA Visa Appointment", description: "Help with appointment booking preparation and travel-purpose documentation.", icon: CalendarCheck },
  { title: "Study Visa Support", description: "Student-focused document review, checklist planning, and application support.", icon: GraduationCap },
  { title: "Tourism Travel Planning", description: "Personalized itineraries, reservations, and destination planning for holidays.", icon: Plane },
  { title: "Business Travel Support", description: "Professional support for meetings, conferences, and corporate trips.", icon: BriefcaseBusiness },
  { title: "Medical Travel Support", description: "Organized travel support for treatment visits and medical appointments.", icon: HeartPulse },
  { title: "Family Visit Visa Support", description: "Document compilation support for visiting relatives and loved ones abroad.", icon: UsersRound },
  { title: "Flight Reservation", description: "Reservation support aligned with your travel dates and application needs.", icon: Plane },
  { title: "Hotel Reservation", description: "Accommodation booking support for travel, visa, and itinerary purposes.", icon: Hotel },
  { title: "Passport Renewal Support", description: "Guidance for passport renewal steps, requirements, and appointment planning.", icon: RefreshCcw },
  { title: "Document Compilation and Organization", description: "Clear, complete, and well-arranged document packs for stronger submissions.", icon: FileCheck2 },
];

export const supportedCountries = [
  "United Kingdom",
  "Canada",
  "United States",
  "Schengen Area",
  "Australia",
  "United Arab Emirates",
  "Turkey",
  "Ireland",
];

export const processSteps = [
  "Submit your application request",
  "Receive a tracking code",
  "Get a tailored document checklist",
  "Upload and organize documents",
  "Monitor status updates",
];

export const trustPoints = [
  { value: "12+", label: "Travel support services" },
  { value: "24/7", label: "WhatsApp inquiry access" },
  { value: "Secure", label: "Document upload workflow" },
  { value: "Tracked", label: "Application status updates" },
];

export const reasons = [
  { title: "Clear guidance", description: "We simplify travel requirements into practical next steps.", icon: ShieldCheck },
  { title: "Organized documents", description: "Your files are checked, arranged, and prepared for review.", icon: FileCheck2 },
  { title: "Responsive support", description: "You get steady communication from inquiry to travel readiness.", icon: CalendarCheck },
];

export const testimonials = [
  {
    name: "Study visa applicant",
    role: "Student traveler",
    quote: "The document checklist and tracking code helped me stay calm and organized through the process.",
  },
  {
    name: "Family visit client",
    role: "Visitor visa support",
    quote: "Gifted-Faith explained what I needed clearly and helped me arrange my supporting documents.",
  },
  {
    name: "Business traveler",
    role: "Appointment and itinerary support",
    quote: "The appointment and reservation support saved time and made the travel preparation smoother.",
  },
];

export const faqs = [
  {
    question: "Does Gifted-Faith guarantee visa approval?",
    answer: "No. Visa decisions are made by embassies and immigration authorities. We help you prepare, organize, and submit stronger documentation.",
  },
  {
    question: "Can I upload documents online?",
    answer: "Yes. The Apply Now form supports PDF, JPG, JPEG, and PNG uploads up to 5MB per file.",
  },
  {
    question: "How do I track my application?",
    answer: "After submission, you receive a tracking code. Use the Track Application page to view your current status.",
  },
  {
    question: "Can I get help with flights and hotels?",
    answer: "Yes. We support flight reservations, hotel reservations, itineraries, and travel planning.",
  },
];

export const corporateBenefits = [
  "Visa and travel preparation support",
  "Document organization and upload workflow",
  "Appointment and reservation guidance",
  "Tracked application status updates",
];
export const customerTypes = ["Students", "Families", "Tourists", "Business travelers", "Medical travelers"];
export const warrantySupport = [
  "Clear service expectations before submission",
  "Secure local document upload handling",
  "Tracking code provided after application submission",
  "Status updates managed from the admin dashboard",
];
export const adminReadyNotes = [
  "Applications are saved with Prisma and SQLite.",
  "Uploaded documents are stored through the configured UPLOAD_DIR and served from UPLOAD_PUBLIC_PATH.",
  "Tracking, email notification hooks, and admin status updates are enabled.",
];
