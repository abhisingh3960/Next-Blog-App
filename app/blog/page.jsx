import React from "react";
import FirstBlog from "@/components/FirstBlog";
import OtherBlogs from "@/components/OtherBlogs";

async function fetchBlogs() {
  const res = await fetch("http://localhost:3000/api/blog", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const Blog = async () => {
  const blogs = await fetchBlogs();

  const firstBlog = blogs && blogs[0];
  const otherBlogs = blogs?.length > 0 && blogs.slice(1);

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      {blogs?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
            <span className="text-blue-600">Trending</span> Blog
          </h2>
          <div className="mb-16">
            <FirstBlog firstBlog={firstBlog} />
          </div>
          <div>
            <OtherBlogs otherBlogs={otherBlogs} />
          </div>
        </div>
      ) : (
        <h3 className="text-center text-lg font-medium text-gray-600">
          No Blogs...
        </h3>
      )}
    </div>
  );
};

export default Blog;
