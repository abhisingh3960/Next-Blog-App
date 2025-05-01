import Image from "next/image";
import Hero_image from "../public/img/heroi.jpg";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left Section: Text Content */}
        <div className="space-y-6 text-center lg:text-left">
          <p className="text-blue-600 text-sm sm:text-base font-medium uppercase tracking-wide">
          Lifestyle. Learning. Growth. Stories. Inspiration.
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            The World's <span className="text-blue-600">Lifestyle</span>{" "}
            <span className="text-green-600">Growth Blog.</span>
          </h1>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
          LifeNest is a modern blog app where lifestyle, education, and inspiration meet. Explore articles on wellness, self-growth, learning, and everyday living—curated for curious minds and mindful lives.
          </p>
        </div>

        {/* Right Section: Image */}
        <div>
          <Image
            src={Hero_image}
            alt="Hero Image"
            sizes="100vw"
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}
