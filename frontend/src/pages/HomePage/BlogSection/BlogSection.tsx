import React, { useEffect, useState } from "react";
import FadeInnAnimation from "@/components/FadeInnAnimation";
import { PublicPaths } from "@/lib/routes";
import { BlogPostThumbnail } from "./BlogPostThumbnail";
import ThumnailCarousel from "./ThumnailCarousel";
import { blogService, type BlogPostThumbnailData } from "@/services/blogService";

export const BlogSection: React.FC = () => {
  const [blogThumbnails, setBlogThumbnails] = useState<BlogPostThumbnailData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const thumbnails = await blogService.getThumbnails();
        setBlogThumbnails(thumbnails);
      } catch (error) {
        console.error("Error fetching blog thumbnails:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThumbnails();
  }, []);

  if (isLoading || blogThumbnails.length === 0) return null;

  const [featured, ...rest] = blogThumbnails;
  const shouldUseCarousel = rest.length >= 3;

  return (
    <section className="mt-20 mb-20">
      <FadeInnAnimation className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">Blogs</h2>
        <p className="text-white/50 mt-3">
          Få siste nytt fra fanclubben, renn, merch og turer
        </p>
      </FadeInnAnimation>

      {/* Featured post */}
      <FadeInnAnimation className="mb-10">
        <BlogPostThumbnail
          title={featured.thumbnailTitle}
          date={featured.date}
          excerpt={featured.excerpt}
          image={featured.imageUrl}
          to={PublicPaths.blog.useShow(featured.slug)}
        />
      </FadeInnAnimation>

      {/* Older posts */}
      {rest.length > 0 && (
        <div className="mb-8">
          {shouldUseCarousel ? (
            <ThumnailCarousel posts={rest} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
              {rest.map((post) => (
                <FadeInnAnimation key={post.slug}>
                  <BlogPostThumbnail
                    title={post.thumbnailTitle}
                    date={post.date}
                    excerpt={post.excerpt}
                    image={post.imageUrl}
                    to={PublicPaths.blog.useShow(post.slug)}
                    className="h-full flex flex-col"
                  />
                </FadeInnAnimation>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
