import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { createSlug, blogFallbackImage } from "@/lib/blog";
import { prisma } from "@/lib/prisma";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const title = cleanText(body.title);
  const slug = cleanText(body.slug) || createSlug(title);
  const excerpt = cleanText(body.excerpt);
  const content = cleanText(body.content);
  const featuredImage = cleanText(body.featuredImage) || blogFallbackImage;
  const published = Boolean(body.published);

  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json(
      { error: "Title, slug, excerpt, and content are required." },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: createSlug(slug),
        excerpt,
        content,
        featuredImage,
        published,
      },
    });

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      { error: "Article could not be created. Check that the slug is unique." },
      { status: 400 }
    );
  }
}
