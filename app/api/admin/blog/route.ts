import { isAdminLoggedIn } from "@/lib/auth";
import { createSlug, blogFallbackImage } from "@/lib/blog";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { jsonError, logProductionError } from "@/lib/runtime";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const loggedIn = await isAdminLoggedIn();

    if (!loggedIn) {
      return jsonError("Unauthorized.", 401);
    }

    if (!isDatabaseConfigured()) {
      return jsonError(databaseUnavailableMessage, 503);
    }

    const body = await request.json();
    const title = cleanText(body.title);
    const slug = cleanText(body.slug) || createSlug(title);
    const excerpt = cleanText(body.excerpt);
    const content = cleanText(body.content);
    const featuredImage = cleanText(body.featuredImage) || blogFallbackImage;
    const published = Boolean(body.published);

    if (!title || !slug || !excerpt || !content) {
      return jsonError("Title, slug, excerpt, and content are required.", 400);
    }

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

    return Response.json({ success: true, post });
  } catch (error) {
    logProductionError("Blog article create failed", error);
    return jsonError("Article could not be created. Check that the slug is unique.", 400);
  }
}
