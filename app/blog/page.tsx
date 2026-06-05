import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { prisma } from "@/lib/prisma";
import { BlogList } from "./BlogList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Visa assistance, travel planning, study visa, tourism, and business travel support articles from Gifted-Faith Global Ventures.",
  alternates: { canonical: "/blog" },
  openGraph: {
    url: "/blog",
    title: "Visa and Travel Blog",
    description:
      "Helpful visa and travel guides for Nigerian applicants planning UK, Canada, Schengen, study, tourism, and business travel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visa and Travel Blog",
    description:
      "Helpful visa and travel guides from Gifted-Faith Global Ventures.",
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell>
      <section className="bg-[#f4f8ff] py-14 sm:py-16">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Blog</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-[#073b7a] sm:text-5xl">
            Visa and travel guidance for confident planning.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Read practical articles on visa requirements, study permits, document preparation,
            travel planning, and common application mistakes.
          </p>
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        {posts.length > 0 ? (
          <BlogList
            posts={posts.map((post) => ({
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              featuredImage: post.featuredImage,
              createdAt: post.createdAt.toISOString(),
            }))}
          />
        ) : (
          <div className="rounded bg-white p-8 text-center shadow-sm ring-1 ring-blue-100">
            <h2 className="text-xl font-bold text-[#073b7a]">Articles are coming soon</h2>
            <p className="mt-2 text-sm text-slate-600">
              New visa and travel resources will appear here after publishing.
            </p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
