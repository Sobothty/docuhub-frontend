"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TextAnimateProps {
  children: ReactNode;
  animation?: "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "fadeIn";
  by?: "word" | "letter";
  delay?: number;
  duration?: number;
  className?: string;
}

export function TextAnimate({
  children,
  animation = "slideUp",
  by = "word",
  delay = 0.1,
  duration = 0.5,
  className = "",
}: TextAnimateProps) {
  const text = children?.toString() || "";
  
  const getAnimationVariants = () => {
    switch (animation) {
      case "slideUp":
        return {
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case "slideDown":
        return {
          hidden: { y: -20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case "slideLeft":
        return {
          hidden: { x: 20, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case "slideRight":
        return {
          hidden: { x: -20, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      default:
        return {
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
    }
  };

  const variants = getAnimationVariants();

  if (by === "word") {
    const words = text.split(" ");
    
    return (
      <div className={`flex flex-wrap ${className}`}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{
              duration,
              delay: delay * index,
              ease: "easeOut"
            }}
            className="mr-2"
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  // Letter by letter animation
  const letters = text.split("");
  
  return (
    <div className={`flex flex-wrap ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{
            duration,
            delay: delay * index,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}
