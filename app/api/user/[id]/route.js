// http://localhost:3000/api/user/someid

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { deleteManyPhotos } from "@/actions/uploadActions";

export async function PATCH(req, { params }) {
  await connect();

  const id = params.id;

  const accessToken = req.headers.get("authorization");
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const body = await req.json();
    const user = await User.findById(id);

    if (!user || user._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only the author can update their data" },
        { status: 403 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, body, {
      new: true,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "PATCH error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  await connect();

  const id = params.id;

  try {
    const user = await User.findById(id).select("-password -__v");

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "GET error", error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  await connect();

  const id = params.id;
  const accessToken = req.headers.get("authorization");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing authorization header" },
      { status: 403 }
    );
  }

  const token = accessToken.split(" ")[1];
  const decodedToken = verifyJwtToken(token);

  if (!decodedToken) {
    return NextResponse.json(
      { error: "Unauthorized (wrong or expired token)" },
      { status: 403 }
    );
  }

  try {
    const user = await User.findById(id).select("-password -__v");

    if (!user || user._id.toString() !== decodedToken._id.toString()) {
      return NextResponse.json(
        { msg: "Only author can delete his/her data" },
        { status: 403 }
      );
    }

    const blogImages = await Blog.find({ authorId: id }).select("image");
    const formattedBlogImages = blogImages.map((blog) => ({
      id: blog.image?.id,
    }));

    const userDoc = await User.findById(id).select("avatar");
    const finalImageIds = [
      ...formattedBlogImages,
      { id: userDoc?.avatar?.id },
    ];

    await Promise.all([
      User.findByIdAndRemove(id),
      Blog.deleteMany({ authorId: id }),
      deleteManyPhotos(finalImageIds),
    ]);

    return NextResponse.json({ msg: "User deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Delete error", error: error.message }, { status: 500 });
  }
}