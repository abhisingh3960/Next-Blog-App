"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import Image from "next/image";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Technology",
  photo: "",
};

const CreateBlog = () => {
  const CLOUD_NAME = "dntnvdvsu";
  const UPLOAD_PRESET = "next_blog_images";

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access denied</p>;
  }

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { photo, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      setError("Please fill out all required fields.");
      return;
    }

    if (photo) {
      const maxSize = 5 * 1024 * 1024;
      if (photo.size > maxSize) {
        setError("File size is too large. Please select a file under 5MB.");
        return;
      }
    }

    if (title.length < 4) {
      setError("Title must be at least 4 characters long.");
      return;
    }

    if (description.length < 20) {
      setError("Description must be at least 20 characters long.");
      return;
    }

    if (excerpt.length < 10) {
      setError("Excerpt must be at least 10 characters long.");
      return;
    }

    if (quote.length < 6) {
      setError("Quote must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      const image = await uploadImage();

      const newBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch("http://localhost:3000/api/blog", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(newBlog),
      });

      if (response?.status === 201) {
        setSuccess("Blog created successfully.");
        setTimeout(() => {
          router.refresh();
          router.push("/blog");
        }, 1500);
      } else {
        setError("Error occurred while creating blog.");
      }
    } catch (error) {
      console.log(error);
      setError("Error occurred while creating blog.");
    }

    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.photo) return;

    const formdata = new FormData();
    formdata.append("file", state.photo);
    formdata.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await res.json();
      return {
        id: data["public_id"],
        url: data["secure_url"],
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="px-4 py-6 sm:px-6 md:px-10 lg:px-16 xl:px-20 max-w-3xl mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">
        <span className="text-blue-600">Create</span> Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Write your title here..."
          onChange={handleChange}
          value={state.title}
        />

        <TextArea
          label="Description"
          rows="4"
          name="description"
          placeholder="Write your description here..."
          onChange={handleChange}
          value={state.description}
        />

        <TextArea
          label="Excerpt"
          rows="2"
          name="excerpt"
          placeholder="Write your excerpt here..."
          onChange={handleChange}
          value={state.excerpt}
        />

        <TextArea
          label="Quote"
          rows="2"
          name="quote"
          placeholder="Write your quote here..."
          onChange={handleChange}
          value={state.quote}
        />

        <div>
          <label className="block text-sm font-semibold mb-2">
            Select a Category
          </label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className="block w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Food">Food</option>
            <option value="Career">Career</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Upload Image
          </label>
          <input
            onChange={handleChange}
            type="file"
            name="photo"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          {state.photo && (
            <div className="mt-4">
              <Image
                src={URL.createObjectURL(state.photo)}
                alt="Uploaded preview"
                priority
                width={128}
                height={128}
                className="rounded-md border shadow-sm"
              />
            </div>
          )}
        </div>

        {error && <div className="text-red-700 font-medium">{error}</div>}

        {success && (
          <div className="text-green-700 font-medium">{success}</div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          {isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </section>
  );
};

export default CreateBlog;
