import { useEffect, useRef, useState } from "react";

export const useInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [wasInViewOnMount, setWasInViewOnMount] = useState(false);
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // sjekk om elementet er *delvis* synlig ved mount (litt mer tolerant)
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const intersectsVertically = rect.top < windowHeight && rect.bottom > 0;
    const intersectsHorizontally = rect.left < windowWidth && rect.right > 0;
    const alreadyVisible = intersectsVertically && intersectsHorizontally;

    if (alreadyVisible) {
      setIsInView(true);
      setWasInViewOnMount(true);
      setHasCheckedInitial(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setHasCheckedInitial(true);
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
    // viktig: når vi starter observer vet vi også at vi har "sjekket"
    setHasCheckedInitial(true);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView, wasInViewOnMount, hasCheckedInitial };
};
