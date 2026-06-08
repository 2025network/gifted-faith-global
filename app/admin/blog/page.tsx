import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookOpen, FileText, PenLine } from "lucide-react";
import { isAdminLoggedIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logProductionError } from "@/lib/runtime";
import { PageShell } from "../../components/PageShell";
import { BlogAdmin } from "./BlogAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Blog Management",
  description: "Protected blog management for Gifted-Faith Global Ventures.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminBlogPage() {
  let loggedIn = false;

  try {
    loggedIn = await isAdminLoggedIn();
  } catch (error) {
    logProductionError("Admin blog auth check failed", error);
  }

  if (!loggedIn) {
    redirect("/admin/login");
  }

  let blogLoadError = "";
  const posts = await (async () => {
    try {
      return await prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      logProductionError("Admin blog posts load failed", error);
      blogLoadError = "Blog articles could not be loaded right now. Please refresh in a moment.";
      return [];
    }
  })();

  const publishedCount = posts.filter((post) => post.published).length;

  return (
    <PageShell>
      <section className="bg-[#073b7a] py-12 text-white">
        <div className="section-shell">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Admin blog</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Blog content manager
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100">
            Create, edit, publish, unpublish, and delete travel and visa articles for the public
            blog.
          </p>
        </div>
      </section>

      <section className="section-shell py-10 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total articles", value: posts.length, icon: BookOpen },
            { label: "Published", value: publishedCount, icon: FileText },
            { label: "Drafts", value: posts.length - publishedCount, icon: PenLine },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded border border-blue-100 bg-white p-5 shadow-sm">
                <Icon className="text-[#0b4ea2]" size={26} aria-hidden="true" />
                <p className="mt-4 text-3xl font-bold text-[#073b7a]">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{item.label}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10">
          {blogLoadError ? (
            <p className="mb-5 rounded bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
              {blogLoadError}
            </p>
          ) : null}
          <BlogAdmin
            posts={posts.map((post) => ({
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              featuredImage: post.featuredImage,
              published: post.published,
              createdAt: post.createdAt.toISOString(),
              updatedAt: post.updatedAt.toISOString(),
            }))}
          />
        </div>
      </section>
    </PageShell>
  );
}
