import React from "react";
import { useParams, Link } from "react-router-dom";
import FadeInnAnimation from "@/components/FadeInnAnimation";
import { PublicPaths } from "@/Routes";

const blogPosts = [
  {
    id: "kitzbuehel-2026",
    title: "Det som skjer i Sun Valley, blir i Sun Valley",
    date: "30. oktober 2025",
    image: "/images/sunvalley_fanclub_img.JPG",
    content: `
              Sun Valley markerte slutten på sesongen 24/25, den virkelige gjennombruddsesongen til Møller. Eventyret i Bormio vil vi aldri glemme.
              Mens Norge prøver å kvalifisere seg til fotball-VM, kan vi nyte norsk alpint og Møllern, som reiser verden rundt som et levende bevis på mange års målrettet satsing.

              For alpint er faktisk en lagidrett, noe mange glemmer. Når Møllern seirer, er det en seier for hele laget.
              Derfor har vi startet Møller Fanclub, for å kunne ta del i både oppturene og de mange nedturene som følger med denne sporten. Dette er ingen medgangssupporter-gjeng, men en ekte fankultur.

              Denne vinteren markerer starten på en ny æra for Møller Fanclub. Vi lanserer merch, samler troppene og planlegger den største fankulturen norsk alpinsport har sett siden Kjus & Aamodt.
    `,
  },
];

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <FadeInnAnimation>
            <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">
              {post.title}
            </h1>
            <p className="text-white/80">{post.date}</p>
          </FadeInnAnimation>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-16 text-lg leading-relaxed text-white/90">
        {paragraphs.map((paragraph, i) => (
          <FadeInnAnimation key={i} delay={i * 200}>
            <p className="mb-6">{paragraph}</p>
          </FadeInnAnimation>
        ))}
      </article>

      {/* Back Button */}
      <FadeInnAnimation className="mx-auto max-w-4xl px-6 pb-16">
        <Link
          to={PublicPaths.base}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all"
        >
          ← Tilbake til forsiden
        </Link>
      </FadeInnAnimation>
    </div>
  );
};

export default BlogPostPage;
