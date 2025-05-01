"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import demoImage from "@/public/img/demo_image.jpg";
import Image from "next/image";
import { deletePhoto } from "@/actions/uploadActions";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Songbirds",
  photo: {},
  blogId: "",
  newImage: "",
};

const EditBlog = ({ params }) => {
  const CLOUD_NAME = "dq3sduyht";
  const UPLOAD_PRESET = "nextjs_blog_images";

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
console.log(state)
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`http://localhost:3000/api/blog/${params.id}`);

        if (res.status === 200) {
          const blogData = await res.json();

          setState((prevstate) => ({
            ...prevstate,
            title: blogData.title,
            description: blogData.description,
            excerpt: blogData.excerpt,
            quote: blogData.quote,
            category: blogData.category,
            photo: blogData.image,
            blogId: blogData._id,
          }));
        } else {
          setError("Error fetching blog data");
        }
      } catch (error) {
        setError("Error fetching blog data");
      }
    }

    fetchBlog();
  }, [params.id]);

  if (status === "loading") {
    return <p>loading...</p>;
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

    const { newImage, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      setError("Please fill out all required fields.");
      return;
    }

    if (newImage) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (newImage.size > maxSize) {
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

      let image;

      if (state.newImage) {
        image = await uploadImage();

        if (state.photo?.id) {
          await deletePhoto(state.photo.id);
        }
      } else {
        image = state.photo;
      }

      const updateBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch(
        `http://localhost:3000/api/blog/${params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",
          body: JSON.stringify(updateBlog),
        }
      );

      if (response?.status === 200) {
        setSuccess("Blog updated successfully.");
        setTimeout(() => {
          router.refresh();
          router.push(`/blog/${params.id}`);
        }, 1500);
      } else {
        setError("Error occurred while updating blog.");
      }
    } catch (error) {
      console.log(error);
      setError("Error occurred while updating blog.");
    }

    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.newImage) return;

    const formdata = new FormData();

    formdata.append("file", state.newImage);
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
      const image = {
        id: data["public_id"],
        url: data["secure_url"],
      };

      return image;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancleUploadImg = () => {
    setState({ ...state, ["newImage"]: "" });
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        <span className="text-indigo-600">Edit</span> Blog
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
          <label className="block font-medium mb-2 text-gray-700">Select Category</label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Food">Food</option>
            <option value="Career">Career</option>
          </select>
        </div>
  
        <div>
          <label className="block font-medium mb-2 text-gray-700">Upload Image</label>
          <input
            onChange={handleChange}
            type="file"
            name="newImage"
            accept="image/*"
            className="w-full text-gray-700 bg-gray-100 rounded-lg p-2 border border-gray-300"
          />
  
          {state.newImage ? (
            <div className="mt-4 flex flex-col items-start gap-2">
              <Image
                src={URL.createObjectURL(state.newImage)}
                priority
                alt="Preview"
                width={128}
                height={128}
                className="rounded-md"
              />
              <button
                type="button"
                onClick={handleCancleUploadImg}
                className="text-sm text-red-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            state.photo?.url && (
              <div className="mt-4">
                <Image
                  src={state.photo.url}
                  priority
                  alt="Current image"
                  width={128}
                  height={128}
                  className="rounded-md"
                />
              </div>
            )
          )}
        </div>
  
        {error && <div className="text-red-600 font-medium">{error}</div>}
        {success && <div className="text-green-600 font-medium">{success}</div>}
  
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          {isLoading ? "Loading..." : "Update Blog"}
        </button>
      </form>
    </section>
  );
  ;
};

export default EditBlog;
