"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

type ParallaxGalleryProps = {
  images: string[];
};

const ParallaxGallery = ({ images }: ParallaxGalleryProps) => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  // Ensure height is valid before creating transforms (SSR-safe)
  const safeHeight = height || (typeof window !== 'undefined' ? window.innerHeight : 1000) || 1000;
  const y = useTransform(scrollYProgress, [0, 1], [0, safeHeight * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, safeHeight * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, safeHeight * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, safeHeight * 3]);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initialize Lenis only if not already initialized
    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    try {
      // Check if Lenis is already initialized on window
      if (!(window as any).__lenis__) {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
        });

        (window as any).__lenis__ = lenis;

        const raf = (time: number) => {
          if (lenis) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
          }
        };

        rafId = requestAnimationFrame(raf);
      } else {
        // Use existing Lenis instance
        lenis = (window as any).__lenis__;
      }

      window.addEventListener("resize", resize);
      resize();

      return () => {
        window.removeEventListener("resize", resize);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        // Only destroy if we created it
        if (lenis && (window as any).__lenis__ === lenis) {
          try {
            lenis.destroy();
            delete (window as any).__lenis__;
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      };
    } catch (error) {
      console.warn('Lenis initialization failed:', error);
      // Fallback: just handle resize without Lenis
      window.addEventListener("resize", resize);
      resize();
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, []);

  // Distribute images across columns
  const column1 = [images[0] || images[0], images[1] || images[0], images[2] || images[0]];
  const column2 = [images[3] || images[1], images[4] || images[1], images[5] || images[1]];
  const column3 = [images[6] || images[2], images[7] || images[2], images[8] || images[2]];
  const column4 = [images[9] || images[0], images[10] || images[1], images[11] || images[2]];

  return (
    <>
      <div className="font-geist flex h-screen items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-gray-900 after:to-transparent after:content-['']">
            scroll down to see
          </span>
        </div>
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-white p-[2vw]"
      >
        <Column images={column1} y={y} />
        <Column images={column2} y={y2} />
        <Column images={column3} y={y3} />
        <Column images={column4} y={y4} />
      </div>
      
      <div className="font-geist relative flex h-screen items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-gray-900 after:to-transparent after:content-['']">
            scroll up to see
          </span>
        </div>
      </div>
    </>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden rounded-lg">
          <img
            src={src}
            alt={`Gallery image ${i + 1}`}
            className="pointer-events-none h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  );
};

export default ParallaxGallery;
