import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-100">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-4">
        404 - Not Found
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6">
        Could not find the requested resource.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
