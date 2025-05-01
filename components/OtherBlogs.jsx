import React from "react";
import Image from "next/image";
import demoImage from "@/public/img/john.avif";
import Link from "next/link";
import { AiTwotoneCalendar } from "react-icons/ai";
import moment from "moment";

const OtherBlogs = ({ otherBlogs }) => {
  const timeStr = otherBlogs?.createdAt;
  const time = moment(timeStr);
  const formattedTime = time.format("MMMM Do YYYY");

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
        {otherBlogs?.length > 0 &&
          otherBlogs?.map((item, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Link href={`/blog/${item?._id}`}>
                <div className="relative">
                  <Image
                    src={item?.image ? item.image?.url : demoImage}
                    alt="blog image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-3 text-xs mb-2">
                    <p className="text-blue-700 font-extrabold">{item?.category}</p>
                    <p className="flex items-center gap-1 text-paragraphColor">
                      <AiTwotoneCalendar />
                      {formattedTime}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-black">{item?.title}</h3>
                    <p className="text-sm text-blue-600 line-clamp-3">{item?.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <Image
                      src={
                        item?.authorId?.avatar?.url
                          ? item?.authorId?.avatar?.url
                          : demoImage
                      }
                      alt="author image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-xs">
                      <h6 className="text-black font-extrabold">{item?.authorId?.name}</h6>
                      <p className="text-paragraphColor">{item?.authorId?.designation}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
};

export default OtherBlogs;
