import React from "react";
import { Link } from "react-router-dom";

type BlogPostThumbnailProps = {
  title: string;
  date?: string;
  excerpt?: string;
  image: string;
  to?: string;
};

export const BlogPostThumbnail: React.FC<BlogPostThumbnailProps> = ({
  title,
  date,
  excerpt,
  image,
  to = "#",
}) => {
  return (
    <article className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center opacity-70 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Text content overlay */}
      <div className="relative z-10 p-10 md:p-16 text-white max-w-4xl">
        {date && (
          <p className="mb-2 text-sm uppercase tracking-wider text-white/70">
            {date}
          </p>
        )}
        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          {title}
        </h2>
        {excerpt && (
          <p className="text-white/85 text-lg md:text-xl mb-8 leading-relaxed drop-shadow-md">
            {excerpt}
          </p>
        )}
        <Link
          to={to}
          className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 font-semibold text-gray-900 shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all"
        >
          Les mer
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};
