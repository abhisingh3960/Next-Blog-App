// http://localhost:3000/api/blog/blogid/comment

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function POST(request, { params }) {
  await connect();

  // Properly await params
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
    const body = await request.json();
    const blog = await Blog.findById(id);
    const user = await User.findById(decodedToken._id);

    if (!blog || !user) {
      return NextResponse.json(
        { error: "Blog or user not found" },
        { status: 404 }
      );
    }

    const newComment = {
      text: body.text,
      user: user._id  // Store reference rather than full user object
    };

    blog.comments.unshift(newComment);
    await blog.save();

    // Populate user details when returning
    const updatedBlog = await Blog.findById(id)
      .populate('comments.user', '-password');

    return NextResponse.json(updatedBlog, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}