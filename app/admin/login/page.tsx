import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdminLoggedIn } from "@/lib/auth";
import { logProductionError } from "@/lib/runtime";
import { brand } from "../../data";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure admin login for Gifted-Faith Global Ventures application management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  let loggedIn = false;

  try {
    loggedIn = await isAdminLoggedIn();
  } catch (error) {
    logProductionError("Admin login page auth check failed", error);
  }

  if (loggedIn) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff]">
      <section className="section-shell grid min-h-screen items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
            {brand.name}
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight text-[#073b7a] sm:text-5xl">
            Secure access for application management.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
            Manage visa and travel support applications, uploaded documents, tracking codes, and
            status updates from one professional dashboard.
          </p>
          <div className="mt-8 rounded bg-[#073b7a] p-5 text-white ring-1 ring-blue-200">
            <p className="text-sm font-bold text-[#d9a441]">{brand.slogan}</p>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Protected access keeps application review and document management private.
            </p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md lg:ml-auto">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
