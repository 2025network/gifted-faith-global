import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { blogFallbackImage, createSlug } from "@/lib/blog";
import { prisma } from "@/lib/prisma";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ error: "Invalid article ID." }, { status: 400 });
  }

  const body = await request.json();
  const data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    featuredImage?: string;
    published?: boolean;
  } = {};

  if ("title" in body) data.title = cleanText(body.title);
  if ("slug" in body) data.slug = createSlug(cleanText(body.slug));
  if ("excerpt" in body) data.excerpt = cleanText(body.excerpt);
  if ("content" in body) data.content = cleanText(body.content);
  if ("featuredImage" in body) data.featuredImage = cleanText(body.featuredImage) || blogFallbackImage;
  if ("published" in body) data.published = Boolean(body.published);

  if (
    ("title" in data && !data.title) ||
    ("slug" in data && !data.slug) ||
    ("excerpt" in data && !data.excerpt) ||
    ("content" in data && !data.content)
  ) {
    return NextResponse.json(
      { error: "Title, slug, excerpt, and content cannot be empty." },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      { error: "Article could not be updated. Check that the slug is unique." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ error: "Invalid article ID." }, { status: 400 });
  }

  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Article could not be deleted." }, { status: 404 });
  }
}
