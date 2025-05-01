import React from "react";
import Image from "next/image";
import demoImage from "@/public/img/john.avif";
import Link from "next/link";
import { AiTwotoneCalendar } from "react-icons/ai";
import moment from "moment";

const FirstBlog = ({ firstBlog }) => {
  if (!firstBlog) return null;

  const timeStr = firstBlog.createdAt;
  const formattedTime = moment(timeStr).format("MMMM Do YYYY");

  return (
    <section className="py-6">
      <Link href={`/blog/${firstBlog._id}`} className="block">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
          {/* Blog Image */}
          <div className="w-full md:w-5/12 lg:w-2/5 aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={firstBlog.image?.url || demoImage}
              alt="Blog thumbnail"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Blog Content */}
          <div className="w-full md:w-7/12 lg:w-3/5 space-y-4">
            {/* Category & Date */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-primaryColor font-medium text-blue-700">
                {firstBlog.category}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <AiTwotoneCalendar className="text-base" />
                {formattedTime}
              </span>
            </div>

            {/* Title & Excerpt */}
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-gray-800 hover:text-primaryColor transition">
                {firstBlog.title}
              </h2>
              <p className="text-blue-600 text-sm leading-relaxed">
                {firstBlog.excerpt}
              </p>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                <Image
                  src={
                    firstBlog.authorId?.avatar?.url || demoImage
                  }
                  alt="Author"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs text-gray-700">
                <h6 className=" font-extrabold">{firstBlog.authorId?.name}</h6>
                <p className="text-gray-500">
                  {firstBlog.authorId?.designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default FirstBlog;
