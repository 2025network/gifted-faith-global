import { isAdminLoggedIn } from "@/lib/auth";
import { blogFallbackImage, createSlug } from "@/lib/blog";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { jsonError, logProductionError } from "@/lib/runtime";

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
  try {
    const loggedIn = await isAdminLoggedIn();

    if (!loggedIn) {
      return jsonError("Unauthorized.", 401);
    }

    if (!isDatabaseConfigured()) {
      return jsonError(databaseUnavailableMessage, 503);
    }

    const { id: idParam } = await params;
    const id = parseId(idParam);

    if (!id) {
      return jsonError("Invalid article ID.", 400);
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
      return jsonError("Title, slug, excerpt, and content cannot be empty.", 400);
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    return Response.json({ success: true, post });
  } catch (error) {
    logProductionError("Blog article update failed", error);
    return jsonError("Article could not be updated. Check that the slug is unique.", 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const loggedIn = await isAdminLoggedIn();

    if (!loggedIn) {
      return jsonError("Unauthorized.", 401);
    }

    if (!isDatabaseConfigured()) {
      return jsonError(databaseUnavailableMessage, 503);
    }

    const { id: idParam } = await params;
    const id = parseId(idParam);

    if (!id) {
      return jsonError("Invalid article ID.", 400);
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return Response.json({ success: true, ok: true });
  } catch (error) {
    logProductionError("Blog article delete failed", error);
    return jsonError("Article could not be deleted.", 500);
  }
}
