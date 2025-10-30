import React from "react";
import { useInView } from "@/hooks/useInView";

type FadeInnAnimationProps = {
  children: React.ReactNode;
  delay?: number;
  renderWhenInView?: boolean;
  className?: string;
};

const FadeInnAnimation: React.FC<FadeInnAnimationProps> = ({
  children,
  delay = 0,
  renderWhenInView = false,
  className = "",
}) => {
  const { ref, isInView, wasInViewOnMount } = useInView();

  const shouldRender = renderWhenInView ? isInView : true;

  // 👇 hvis den var synlig fra start: bare render normalt
  if (wasInViewOnMount) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // ellers: kjør fade-animasjon
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={
        `
        transition-all duration-900 ease-out
        ${isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.985]"}
        ` + " " + className
      }
    >
      {shouldRender ? children : null}
    </div>
  );
};

export default FadeInnAnimation;
