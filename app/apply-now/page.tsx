import type { Metadata } from "next";
import { ApplyForm } from "../components/ApplyForm";
import { PageShell } from "../components/PageShell";

export const metadata: Metadata = {
  title: "Apply Now",
  description:
    "Submit your Gifted-Faith Global Ventures travel or visa support application with optional document uploads and tracking code generation.",
};

export default function ApplyNowPage() {
  return (
    <PageShell>
      <section className="bg-[#f4f8ff] py-12 sm:py-16">
        <div className="section-shell grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Apply now</p>
            <h1 className="mt-3 text-4xl font-bold text-[#073b7a] sm:text-5xl">
              Submit your travel support request.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Complete the form, upload optional supporting documents, and receive a tracking code
              after successful submission.
            </p>
            <div className="mt-8 rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
              <h2 className="text-lg font-bold text-[#111827]">Before you submit</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Include your destination, travel purpose, expected travel timeline, and any
                document or appointment support you need.
              </p>
            </div>
          </div>
          <ApplyForm />
        </div>
      </section>
    </PageShell>
  );
}
