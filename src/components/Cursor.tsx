import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [clicked, setClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const springConfigOuter = { damping: 25, stiffness: 200, mass: 1.2 };
  const springXOuter = useSpring(cursorX, springConfigOuter);
  const springYOuter = useSpring(cursorY, springConfigOuter);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null; // Don't render on touch devices
  }

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="custom-cursor-inner"
        style={{
          x: springX,
          y: springY,
        }}
        animate={{
          scale: clicked ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      {/* Outer Gamified Crosshair */}
      <motion.div
        className="custom-cursor-outer"
        style={{
          x: springXOuter,
          y: springYOuter,
          opacity: clicked ? 0.8 : isHovering ? 0.7 : 0.4,
        }}
        animate={{
          scale: clicked ? 0.9 : isHovering ? 1.3 : 1,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="cursor-crosshair top" />
        <div className="cursor-crosshair bottom" />
        <div className="cursor-crosshair left" />
        <div className="cursor-crosshair right" />
      </motion.div>
    </>
  );
}
