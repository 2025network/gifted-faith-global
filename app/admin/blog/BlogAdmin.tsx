"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { createSlug } from "@/lib/blog";

type AdminBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type BlogFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  published: boolean;
};

const emptyForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  published: true,
};

export function BlogAdmin({ posts }: { posts: AdminBlogPost[] }) {
  const router = useRouter();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyPostId, setBusyPostId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const editingPost = useMemo(
    () => posts.find((post) => post.id === editingPostId) ?? null,
    [editingPostId, posts]
  );

  function updateField<K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
      ...(key === "title" && !editingPostId ? { slug: createSlug(String(value)) } : {}),
    }));
  }

  function startEdit(post: AdminBlogPost) {
    setEditingPostId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      published: post.published,
    });
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setEditingPostId(null);
    setForm(emptyForm);
  }

  async function submitPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = editingPostId ? `/api/admin/blog/${editingPostId}` : "/api/admin/blog";
      const response = await fetch(endpoint, {
        method: editingPostId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save article.");
      }

      setSuccess(editingPostId ? "Article updated successfully." : "Article created successfully.");
      resetForm();
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save article.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(post: AdminBlogPost) {
    setBusyPostId(post.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update publish status.");
      }

      setSuccess(!post.published ? "Article published." : "Article unpublished.");
      router.refresh();
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Unable to update article.");
    } finally {
      setBusyPostId(null);
    }
  }

  async function deletePost(post: AdminBlogPost) {
    const confirmed = window.confirm(`Delete "${post.title}"?`);
    if (!confirmed) return;

    setBusyPostId(post.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete article.");
      }

      setSuccess("Article deleted.");
      if (editingPostId === post.id) resetForm();
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete article.");
    } finally {
      setBusyPostId(null);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={submitPost} className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#d9a441]">
              {editingPost ? "Edit article" : "Create article"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#073b7a]">
              {editingPost ? editingPost.title : "New blog post"}
            </h2>
          </div>
          {editingPost ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded border border-blue-100 px-3 py-2 text-sm font-bold text-[#073b7a] transition hover:bg-blue-50"
            >
              New
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="mt-5 rounded bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mt-5 rounded bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 ring-1 ring-green-200">
            {success}
          </p>
        ) : null}

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Article title
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="rounded border border-blue-100 px-3 py-3 font-normal outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            SEO slug
            <input
              value={form.slug}
              onChange={(event) => updateField("slug", createSlug(event.target.value))}
              className="rounded border border-blue-100 px-3 py-3 font-normal outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Featured image URL
            <input
              value={form.featuredImage}
              onChange={(event) => updateField("featuredImage", event.target.value)}
              className="rounded border border-blue-100 px-3 py-3 font-normal outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100"
              placeholder="https://..."
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Excerpt
            <textarea
              value={form.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              className="min-h-24 rounded border border-blue-100 px-3 py-3 font-normal outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Content
            <textarea
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              className="min-h-64 rounded border border-blue-100 px-3 py-3 font-normal leading-7 outline-none transition focus:border-[#0b4ea2] focus:ring-4 focus:ring-blue-100"
              required
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => updateField("published", event.target.checked)}
            />
            Publish this article
          </label>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded bg-[#0b4ea2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {editingPost ? <CheckCircle2 size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
            {saving ? "Saving..." : editingPost ? "Save article" : "Create article"}
          </button>
        </div>
      </form>

      <section className="grid gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#073b7a]">All articles</h2>
          <p className="mt-2 text-sm text-slate-600">Newest articles appear first.</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post) => (
              <article key={post.id} className="rounded bg-white p-5 shadow-sm ring-1 ring-blue-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8a6423]">
                      {post.published ? "Published" : "Draft"}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-[#102033]">{post.title}</h3>
                    <p className="mt-2 break-all text-sm font-semibold text-[#073b7a]">/blog/{post.slug}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  </div>
                  <img src={post.featuredImage} alt="" className="h-24 w-full rounded object-cover sm:w-36" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.published ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 rounded bg-blue-50 px-3 py-2 text-sm font-bold text-[#073b7a] ring-1 ring-blue-100 transition hover:bg-blue-100"
                    >
                      <Eye size={16} aria-hidden="true" />
                      View
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    className="inline-flex items-center gap-2 rounded bg-[#073b7a] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#0b4ea2]"
                  >
                    <Pencil size={16} aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(post)}
                    disabled={busyPostId === post.id}
                    className="rounded bg-[#d9a441] px-3 py-2 text-sm font-bold text-[#102033] transition hover:bg-[#c9942f] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(post)}
                    disabled={busyPostId === post.id}
                    className="inline-flex items-center gap-2 rounded bg-red-50 px-3 py-2 text-sm font-bold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded bg-white p-8 text-center shadow-sm ring-1 ring-blue-100">
            <h3 className="text-xl font-bold text-[#073b7a]">No blog articles yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Create your first travel or visa guide using the article form.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
