import React, { useEffect, useRef, useState } from "react";
import FadeInnAnimation from "@/components/FadeInnAnimation";
import { PublicPaths } from "@/Routes";
import type { BlogPostThumbnailData } from "@/services/blogService";
import { BlogPostThumbnail } from "./BlogPostThumbnail";

interface ThumnailCarouselProps {
  posts: BlogPostThumbnailData[];
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const ThumnailCarousel: React.FC<ThumnailCarouselProps> = ({ posts }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isLarge, setIsLarge] = useState(false); // lg breakpoint (~1024px)
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Determine lg breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLarge(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;

    // Toleranse for subpiksel
    const EPS = 2;
    setCanScrollLeft(left > EPS);
    setCanScrollRight(maxScroll - left > EPS);
  };

  useEffect(() => {
    updateScrollState();
  }, [posts.length, isLarge]);

  const goTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const clamped = clamp(idx, 0, posts.length - 1);
    // 0 = venstre spacer, derfor +1
    const card = el.children[clamped + 1] as HTMLElement | undefined;
    if (!card) return;

    const desiredLeft = card.offsetLeft - 16; // px-4 padding
    const maxScroll = el.scrollWidth - el.clientWidth;

    el.scrollTo({
      left: Math.min(Math.max(desiredLeft, 0), Math.max(maxScroll, 0)),
      behavior: "smooth",
    });

    setActiveIndex(clamped);
    // Oppdater scroll state etter smooth scroll
    // (liten timeout for å fange end-posisjon)
    setTimeout(updateScrollState, 200);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const containerCenter = el.scrollLeft + el.clientWidth / 2;

    // finn kortet (blant post-kortene) som er nærmest midten
    let closestIdx = 0;
    let closestDist = Infinity;

    posts.forEach((_, idx) => {
      const card = el.children[idx + 1] as HTMLElement; // +1 pga spacer
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }

    updateScrollState();
  };

  // Handle touch events to allow vertical scrolling when at horizontal scroll boundaries
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || !touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Check if we're at scroll boundaries
    const maxScroll = el.scrollWidth - el.clientWidth;
    const isAtLeft = el.scrollLeft <= 2;
    const isAtRight = el.scrollLeft >= maxScroll - 2;

    // If vertical scroll is dominant and we're at horizontal boundaries, allow vertical scroll
    if (Math.abs(deltaY) > Math.abs(deltaX) && (isAtLeft || isAtRight)) {
      // Don't prevent default to allow vertical scrolling
      return;
    }

    // Otherwise, allow horizontal scrolling
    // The touch-pan-x class will handle this
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  // --- Når skal piler vises? ---
  // 1) Aldri ved 0 eller 1 post
  // 2) Skjul når nøyaktig 2 poster og stor skjerm
  // 3) Ellers kun hvis faktisk kan scrolle i en retning
  const hideAllArrows =
    posts.length <= 1 || (posts.length === 2 && isLarge);

  const showPrev = !hideAllArrows && canScrollLeft;
  const showNext = !hideAllArrows && canScrollRight;

  // --- Dots kun på mobil og ved 2+ poster ---
  const showDots = posts.length >= 2;

  return (
    <FadeInnAnimation className="relative w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="
          flex gap-4 overflow-x-auto snap-x snap-mandatory
          px-4 pb-6
          touch-pan-x
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
        style={{ 
          scrollBehavior: "smooth", 
          msOverflowStyle: "none",
          overscrollBehaviorX: "contain",
          overscrollBehaviorY: "auto"
        }}
      >
        {/* VENSTRE SPACER – liten på stor skjerm */}
        <div
          className="
            shrink-0 snap-none pointer-events-none
            basis-[12%] 
            sm:basis-[8%]
            lg:basis-[2%]
          "
          aria-hidden
        />

        {posts.map((post) => (
          <div
            key={post.slug}
            className="
              snap-start shrink-0
              basis-[80%]          /* mobil: 1 og litt neste */
              sm:basis-[55%]       /* litt mer på små/mid */
              md:basis-[45%]
              lg:basis-[32%]       /* desktop: ca 3 i slengen */
              xl:basis-[30%]
            "
          >
            <BlogPostThumbnail
              title={post.thumbnailTitle}
              date={post.date}
              excerpt={post.excerpt}
              image={post.imageUrl}
              to={PublicPaths.blog.useShow(post.slug)}
              className="h-full flex flex-col"
            />
          </div>
        ))}

        {/* HØYRE-SPACER */}
        <div
          className="basis-[3%] lg:basis-[2%] shrink-0 snap-none pointer-events-none"
          aria-hidden
        />
      </div>

      {/* Indicators (mobil) */}
      {showDots && (
        <div className="absolute bottom-1 left-1/2 z-30 flex -translate-x-1/2 space-x-3 md:hidden">
          {posts.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === activeIndex ? "bg-white/90" : "bg-white/30"
              }`}
              aria-label={`Gå til slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prev */}
      {showPrev && (
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          className="absolute top-1/2 -left-1 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center focus:outline-none"
          aria-label="Forrige"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </span>
        </button>
      )}

      {/* Next */}
      {showNext && (
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          className="absolute top-1/2 -right-1 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center focus:outline-none"
          aria-label="Neste"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4L1 1"
              />
            </svg>
          </span>
        </button>
      )}
    </FadeInnAnimation>
  );
};

export default ThumnailCarousel;
