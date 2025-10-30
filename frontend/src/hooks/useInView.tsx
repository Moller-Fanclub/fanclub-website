import { useEffect, useRef, useState } from "react";

export const useInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [wasInViewOnMount, setWasInViewOnMount] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // sjekk om elementet allerede er synlig ved mount
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const alreadyVisible =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth;

    if (alreadyVisible) {
      setIsInView(true);
      setWasInViewOnMount(true); // 👈 viktig
      return; // ingen observer -> ingen animasjon
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.2,
        ...options,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView, wasInViewOnMount };
};
