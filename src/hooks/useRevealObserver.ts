import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useRevealObserver() {
  const location = useLocation();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".reveal-up"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    nodes.forEach((node) => {
      node.classList.remove("in-view");
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [location.pathname, location.search]);
}
