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
  const { ref, isInView, wasInViewOnMount, hasCheckedInitial } = useInView();

  if (!hasCheckedInitial) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // hvis den var synlig fra start -> ingen animasjon
  if (wasInViewOnMount) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const shouldRender = renderWhenInView ? isInView : true;

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
