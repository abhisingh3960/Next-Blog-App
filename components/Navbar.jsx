"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import John from "../public/img/john.avif";
import { AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { signOut,useSession } from "next-auth/react";

const Navbar = () => {
  const {data: session, status} = useSession();

  const pathname = usePathname();
  const [showDropDown, setShowDropDown] = useState(false);
  const loggedIn = false;

  const handleShowDropDown = () => {
    setShowDropDown(true);
  };

  const handleHideDropDown = () => {
    setShowDropDown(false);
  };

  return (
    <nav className="flex items-center justify-between px-16 py-4 shadow-md bg-white">
      <Link href={"/"}>
        <h2 className="text-2xl font-bold text-blue-600">
          Gemlay<span className="text-black">Blog</span>
        </h2>
      </Link>

      <ul className="flex text-3xl items-center space-x-4  sm:text-base">
        <li className="text-lg">
          <Link href={"/blog"} className= {pathname === '/blog'?"text-blue-700 font-bold":""}>
            Blog
          </Link>
        </li>

        {session?.user ? (
          <>
            <li className="text-lg" >
              <Link href={"/create-blog"} className= {pathname === '/create-blog'?"text-blue-700 font-bold":""}>
                Create
              </Link>
            </li>
            <li>
              <div className="relative">
                <Image
                  onClick={handleShowDropDown}
                  src={John}
                  alt="avatar"
                  sizes="100vw"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
                />

                {showDropDown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-4 z-50">
                    <AiOutlineClose
                      onClick={handleHideDropDown}
                      className="absolute top-1 right-1 text-gray-500 cursor-pointer"
                    />
                    <button
                      onClick={() => {signOut(); handleHideDropdown();}}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                    <Link
                      href={`/user/${session?.user?._id.toString()}`}
                      onClick={handleHideDropDown}
                      className= {pathname === '/user'?"text-blue-700 font-bold":""}
                    >
                      Profile
                    </Link>
                  </div>
                )}
              </div>
            </li>
          </>
        ) : (
          <>
            <li className="text-lg">
              <Link href={"/login"} className= {pathname === '/login'?"text-blue-700 font-bold":""}>
                Log In
              </Link>
            </li>
            <li className="text-lg ">
              <Link href={"/signup"} className= {pathname === '/signup'?"text-blue-700 font-bold":""}>
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
