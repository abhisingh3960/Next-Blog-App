"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { useParams } from 'next/navigation';

import {
  AiFillDelete,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { BsFillPencilFill, BsTrash } from "react-icons/bs";

import demoImage from "@/public/img/john.avif";
import Input from "@/components/Input";
import { deletePhoto } from "@/actions/uploadActions";

function splitParagraph(paragraph) {
  const MIN_LENGTH = 280;
  const sentences = paragraph.split(". ");
  let currentParagraph = "";
  let paragraphs = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const isLastSentence = i === sentences.length - 1;

    if (isLastSentence) {
      currentParagraph += sentence + " ";
    } else if (currentParagraph.length + sentence.length + 2 <= MIN_LENGTH) {
      currentParagraph += sentence + ". ";
    } else {
      paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
      currentParagraph = sentence + ". ";
    }
  }

  if (currentParagraph) {
    paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
  }

  return paragraphs;
}

const BlogDetails = () => {
  const [blogDetails, setBlogDetails] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [blogComments, setBlogComments] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const params = useParams();

  const router = useRouter();
  const { data: session } = useSession();

  const fetchBlog = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/blog/${params.id}`);
      const blog = await res.json();

      setBlogDetails(blog);
      setIsLiked(blog?.likes?.includes(session?.user?._id));
      setBlogLikes(blog?.likes?.length || 0);
      setBlogComments(blog?.comments?.length || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const timeStr = blogDetails?.createdAt;
  const formattedTime = moment(timeStr).format("MMMM Do YYYY");

  const handleBlogDelete = async (imageId) => {
    const confirmed = window.confirm("Are you sure you want to delete your blog?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:3000/api/blog/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });

      if (res.status === 200) {
        await deletePhoto(imageId);
        router.refresh();
        router.push("/blog");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!session?.user) return alert("Please login before liking.");

    try {
      const res = await fetch(
        `http://localhost:3000/api/blog/${params.id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(null),
        }
      );

      if (res.status === 200) {
        setIsLiked((prev) => !prev);
        setBlogLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText) {
      setError("Comment text is required.");
      return;
    }

    try {
      setIsCommenting(true);
      setError("");

      const newComment = { text: commentText };

      const res = await fetch(
        `http://localhost:3000/api/blog/${params.id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(newComment),
        }
      );

      if (res.status === 201) {
        setSuccess("Comment created successfully.");
        setTimeout(() => {
          setCommentText("");
          fetchBlog();
        }, 500);
      } else {
        setError("Error occurred while creating comment.");
      }
    } catch (err) {
      console.log(err);
      setError("Error occurred while creating comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/blog/${params.id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );

      if (res.status === 200) {
        fetchBlog();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="container max-w-3xl mx-auto px-4">
      {/* Edit/Delete Controls */}
      {blogDetails?.authorId?._id?.toString() === session?.user?._id?.toString() && (
        <div className="flex justify-end gap-4 mt-5">
          <Link
            href={`/blog/edit/${params.id}`}
            className="flex items-center gap-2 text-primaryColor"
          >
            <BsFillPencilFill /> Edit
          </Link>
          <button
            onClick={() => handleBlogDelete(blogDetails?.image?.id)}
            className="flex items-center gap-2 text-red-500"
          >
            <BsTrash /> {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {/* Author Info */}
      <div className="flex flex-col items-center py-10">
        <Link href={`/user/${blogDetails?.authorId?._id}`}>
          <Image
            src={blogDetails?.authorId?.avatar?.url || demoImage}
            alt="Author Avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full"
          />
        </Link>
        <div className="text-center mt-3">
          <p className="text-whiteColor font-extrabold">{blogDetails?.authorId?.name}</p>
          <p>{blogDetails?.authorId?.designation}</p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl  font-semibold">{blogDetails?.title}</h2>
        <p className="text-blue-600 font-extrabold">{blogDetails?.excerpt}...</p>
        <p className="flex items-center justify-center gap-3">
          <span className="text-blue-600 font-extrabold">{blogDetails?.category}</span>
          <span className="flex items-center gap-2">
            <AiTwotoneCalendar />
            {formattedTime}
          </span>
        </p>
      </div>

      {/* Blog Image */}
      <div className="py-8">
        <Image
          src={blogDetails?.image?.url || demoImage}
          alt="Blog Image"
          width={800}
          height={450}
          className="w-full rounded-lg"
        />
      </div>

      {/* Blog Description & Quote */}
      <div className="space-y-5 text-start">
        {blogDetails?.description &&
          splitParagraph(blogDetails.description).map((paragraph, index, arr) => (
            <div key={index}>
              {index === Math.floor(arr.length / 2) && (
                <blockquote className="border-l-4 border-primaryColor italic pl-4 mb-5">
                  {blogDetails?.quote}
                </blockquote>
              )}
              {paragraph}
            </div>
          ))}
      </div>

      {/* Like & Comment Count */}
      <div className="py-8 flex justify-center gap-10 text-xl">
        <div className="flex items-center gap-2">
          <p>{blogLikes}</p>
          {isLiked ? (
            <AiFillHeart onClick={handleLike} color="#ed5784" size={20} cursor="pointer" />
          ) : (
            <AiOutlineHeart onClick={handleLike} size={20} cursor="pointer" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <p>{blogComments}</p>
          <AiOutlineComment size={20} />
        </div>
      </div>

      {/* Comment Section */}
      <div className="py-6">
        {!session?.user ? (
          <h3 className="text-red-500">Kindly login to leave a comment.</h3>
        ) : (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <Input
              name="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              type="text"
              placeholder="Type message..."
            />
            <button type="submit" className="bg-blue-600 px-3 py-2 cursor-pointer rounded-md text-white font-bold  hover:bg-blue-700 transition-all duration-300">
              {isCommenting ? "Loading..." : "Comment"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </form>
        )}

        {/* Display Comments */}
        <div className="mt-8 space-y-5">
          {blogDetails?.comments?.map((comment) => (
            <div key={comment._id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{comment.author?.name}</p>
                {comment?.author?._id === session?.user?._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 bg-red-500"
                  >
                    <AiFillDelete className="text-red-500 bg-red-500"/>
                  </button>
                )}
              </div>
              <p className="text-sm mt-2">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
