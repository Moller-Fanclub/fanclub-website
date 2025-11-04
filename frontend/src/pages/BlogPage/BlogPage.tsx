import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PublicPaths } from "@/Routes";
import { blogService, type BlogPostFullData } from "@/services/blogService";
import FadeInnAnimation from "@/components/FadeInnAnimation";
import PageContainer from "@/components/PageContainer";
import { PortableText } from "@portabletext/react";


const BlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostFullData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Ingen slug spesifisert");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedPost = await blogService.getPostBySlug(slug);
        if (!fetchedPost) {
          setError("Blogginnlegg ikke funnet");
        } else {
          setPost(fetchedPost);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Kunne ikke laste blogginnlegg");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white text-xl">
        Laster...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex h-screen items-center justify-center text-white text-xl">
        {error || "Blogginnlegg ikke funnet 😔"}
      </div>
    );
  }

  return (
    <PageContainer className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={post.imageUrl}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          alt={post.imageAlt || post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">
            {post.title}
          </h1>
          <p className="text-white/80">
            {post.date}
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-16 text-lg leading-relaxed text-white/90 space-y-6">
        <PortableText
          value={post.content}
          components={{
            block: {
              normal: ({ children }) => (
                <FadeInnAnimation>
                  <p className="mb-6">{children}</p>
                </FadeInnAnimation>
              ),
              h1: ({ children }) => (
                <FadeInnAnimation>
                  <h1 className="text-4xl font-bold mb-6 mt-8">{children}</h1>
                </FadeInnAnimation>
              ),
              h2: ({ children }) => (
                <FadeInnAnimation>
                  <h2 className="text-3xl font-bold mb-4 mt-6">{children}</h2>
                </FadeInnAnimation>
              ),
              h3: ({ children }) => (
                <FadeInnAnimation>
                  <h3 className="text-2xl font-bold mb-3 mt-4">{children}</h3>
                </FadeInnAnimation>
              ),
            },
          }}
        />
      </article>

      {/* Back Button */}
      <div className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <Link
          to={PublicPaths.base}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all"
        >
          ← Tilbake til forsiden
        </Link>
      </div>
    </PageContainer>
  );
};

export default BlogPage;
