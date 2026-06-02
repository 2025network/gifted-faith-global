import { PageShell } from "../components/PageShell";
import { TrackApplicationForm } from "./TrackApplicationForm";

export const metadata = {
  title: "Track Application",
  description:
    "Track your Gifted-Faith Global Ventures visa and travel application using your tracking code.",
};

export default async function TrackApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <PageShell>
      <section className="bg-[#f4f8ff] py-12 sm:py-16">
        <div className="section-shell grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
              Track application
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#073b7a] sm:text-5xl">
              Check your application status.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Enter the tracking code you received after submitting your application to view the
              latest status update and submission details.
            </p>
            <div className="mt-8 rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
              <h2 className="text-lg font-bold text-[#102033]">Where to find your code</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your code appears after a successful Apply Now submission and is also included in
                the confirmation email when SMTP is configured.
              </p>
            </div>
          </div>
          <TrackApplicationForm initialCode={code ?? ""} />
        </div>
      </section>
    </PageShell>
  );
}
