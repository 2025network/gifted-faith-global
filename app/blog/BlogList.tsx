"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { formatBlogDate, getReadingTime } from "@/lib/blog";

type BlogPostCard = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  createdAt: string;
};

export function BlogList({ posts }: { posts: BlogPostCard[] }) {
  const [featuredPost, ...remainingPosts] = posts;

  return (
    <div className="grid gap-10">
      {featuredPost ? (
        <section className="grid overflow-hidden rounded bg-white shadow-sm ring-1 ring-blue-100 lg:grid-cols-[1.05fr_0.95fr]">
          <img
            src={featuredPost.featuredImage}
            alt=""
            className="h-72 w-full object-cover lg:h-full"
          />
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
              Featured article
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[#073b7a] sm:text-4xl">
              {featuredPost.title}
            </h2>
            <p className="mt-4 leading-7 text-slate-600">{featuredPost.excerpt}</p>
            <p className="mt-5 text-sm font-semibold text-slate-500">
              {formatBlogDate(featuredPost.createdAt)} · {getReadingTime(featuredPost.content)}
            </p>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="mt-6 inline-flex rounded bg-[#0b4ea2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a]"
            >
              Read article
            </Link>
          </div>
        </section>
      ) : null}

      <ArticleSearch posts={remainingPosts.length > 0 ? remainingPosts : posts} />
    </div>
  );
}

function ArticleSearch({ posts }: { posts: BlogPostCard[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = normalizedQuery
    ? posts.filter((post) =>
        [post.title, post.excerpt, post.content].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        )
      )
    : posts;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">Travel insights</p>
          <h2 className="mt-2 text-2xl font-bold text-[#073b7a]">Latest visa and travel guides</h2>
        </div>
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search articles</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles"
            className="w-full rounded border border-blue-100 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      {visiblePosts.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded bg-white shadow-sm ring-1 ring-blue-100"
            >
              <img src={post.featuredImage} alt="" className="h-48 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a6423]">
                  {formatBlogDate(post.createdAt)} · {getReadingTime(post.content)}
                </p>
                <h3 className="mt-3 text-xl font-bold leading-snug text-[#102033]">
                  <Link href={`/blog/${post.slug}`} className="transition hover:text-[#0b4ea2]">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded bg-white p-8 text-center ring-1 ring-blue-100">
          <h3 className="text-lg font-bold text-[#073b7a]">No matching articles</h3>
          <p className="mt-2 text-sm text-slate-600">
            Try searching for visa, study, tourism, Canada, UK, or Schengen.
          </p>
        </div>
      )}
    </section>
  );
}
