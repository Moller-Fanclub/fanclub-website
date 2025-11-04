import React from "react";
import { useParams, Link } from "react-router-dom";
import { PublicPaths } from "@/Routes";
import { blogPosts } from "@/data/BlogData";
import FadeInnAnimation from "@/components/FadeInnAnimation";
import PageContainer from "@/components/PageContainer";


const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === Number(id));


  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center text-white text-xl">
        Blogginnlegg ikke funnet 😔
      </div>
    );
  }

  const paragraphs = post.content
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim());

  return (
    <PageContainer className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={post.image}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          alt={post.blogPageTitle}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">
            {post.blogPageTitle}
          </h1>
          <p className="text-white/80">{post.date}</p>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-16 text-lg leading-relaxed text-white/90 space-y-6">
        {paragraphs.map((p, i) => (
          <FadeInnAnimation key={i}>{p}</FadeInnAnimation>
        ))}
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
