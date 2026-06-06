import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { PageShell } from "../../components/PageShell";
import { prisma } from "@/lib/prisma";
import { formatBlogDate, getBlogUrl, getReadingTime } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPublishedPost(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: {
        slug,
        published: true,
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const url = getBlogUrl(post.slug);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await (async () => {
    try {
      return await prisma.blogPost.findMany({
        where: {
          published: true,
          id: { not: post.id },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      });
    } catch {
      return [];
    }
  })();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "Gifted-Faith Global Ventures",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Gifted-Faith Global Ventures",
      url: siteUrl,
    },
    mainEntityOfPage: getBlogUrl(post.slug),
  };

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article>
        <section className="bg-[#073b7a] py-12 text-white sm:py-16">
          <div className="section-shell max-w-4xl">
            <Link href="/blog" className="text-sm font-bold text-[#d9a441] transition hover:text-white">
              Blog
            </Link>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-blue-100">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={17} aria-hidden="true" />
                {formatBlogDate(post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={17} aria-hidden="true" />
                {getReadingTime(post.content)}
              </span>
            </div>
          </div>
        </section>

        <div className="section-shell py-10 sm:py-14">
          <img
            src={post.featuredImage}
            alt=""
            className="max-h-[520px] w-full rounded object-cover shadow-sm ring-1 ring-blue-100"
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="grid gap-6 text-lg leading-8 text-slate-700">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="bg-[#f4f8ff] py-12 sm:py-14">
          <div className="section-shell">
            <h2 className="text-2xl font-bold text-[#073b7a]">Related articles</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
                  <img
                    src={relatedPost.featuredImage}
                    alt=""
                    className="h-40 w-full rounded object-cover"
                  />
                  <h3 className="mt-4 text-lg font-bold leading-snug text-[#102033]">
                    <Link href={`/blog/${relatedPost.slug}`} className="transition hover:text-[#0b4ea2]">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{relatedPost.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
