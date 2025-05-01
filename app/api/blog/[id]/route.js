// http://localhost:3000/api/blog/someid

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";


// Update route of  blog
export async function PUT(req, { params }) {
  await connect();

  const id = params.id;

  const accessToken = req.headers.get("authorization");
  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const token = accessToken.split(" ")[1];
  const decodedToken = verifyJwtToken(token);

  if (!decodedToken) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired token" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const blog = await Blog.findById(id).populate("authorId");

    if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only the author can update this blog" },
        { status: 403 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: { ...body } },
      { new: true }
    );

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "PUT error", error: error.message },
      { status: 500 }
    );
  }
}

// get route of blog
export async function GET(req, { params }) {
  await connect();

  const { id } = params;

  try {
    const blog = await Blog.findById(id)
      .populate({
        path: "authorId",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "GET error", error: error.message },
      {
        status: 500,
      }
    );
  }
}


// Delete route of blog
export async function DELETE(req, { params }) {
  await connect();

  const id = params.id;

  const accessToken = req.headers.get("authorization");
  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const token = accessToken.split(" ")[1];
  const decodedToken = verifyJwtToken(token);

  if (!decodedToken) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired token" },
      { status: 403 }
    );
  }

  try {
    const blog = await Blog.findById(id).populate("authorId");

    if (!blog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }

    if (blog.authorId._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only the author can delete this blog" },
        { status: 403 }
      );
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json(
      { msg: "Successfully deleted blog" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Delete error", error: error.message },
      { status: 500 }
    );
  }
}
