// http://localhost:3000/api/blog/blogid/like

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";

export async function PUT(request, { params }) {
  await connect();

  // Await the params object first
  const { id } = await params;
  
  const accessToken = request.headers.get("authorization");
  
  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized (no token provided)" },
      { status: 401 }
    );
  }

  const token = accessToken.split(" ")[1];
  const decodedToken = verifyJwtToken(token);

  if (!decodedToken) {
    return NextResponse.json(
      { error: "Unauthorized (invalid or expired token)" },
      { status: 403 }
    );
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Toggle like
    const userId = decodedToken._id;
    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}