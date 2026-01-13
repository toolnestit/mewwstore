"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

function Banner({ data }) {
  const sliderData = [...data];

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderData.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []); // ← DO NOT depend on sliderData.length

  return (
    <section className="w-full flex justify-center py-10  ">
      <div className="w-full max-w-[1480px] px-5">
        <div className="flex gap-2 justify-center items-end">
          {sliderData.map((slide, i) => (
            <Link
              onMouseOver={() => {
                setActiveIndex(i);
              }}
              href={slide?.link || "/"}
              key={i}
              className={`transition-all overflow-hidden relative w-full h-80 md:h-120 duration-[1000ms] rounded-md 
                ${
                  activeIndex === i
                    ? "max-w-full bg-sky-50" // Active slide
                    : "max-w-[30px] md:max-w-[50px]  bg-black/10" // Inactive slides
                }
              `}
            >
              {/* IMAGE */}
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover imS"
                placeholder={slide?.blur ? "blur" : "empty"}
                blurDataURL={slide?.blur}
              />

              {activeIndex !== i && (
                <div className="w-full h-full backdrop-blur-md"></div>
              )}

              <AnimatePresence>
                {activeIndex === i && (
                  <div
                    className={`
        absolute top-0 h-full hidden flex-col justify-end
        px-10 md:pr-60 py-10
        transition-all duration-[600ms] backdrop-blur-lg overflow-hidden
        ease-out md:flex
        ${activeIndex === i ? "opacity-100 mask-fade-right" : "opacity-0"}
      `}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p
                        style={{
                          backgroundColor:
                            slide?.labelConfig?.bg || "rgba(255,255,255,0.1)",
                          borderColor:
                            slide?.labelConfig?.border ||
                            "rgba(255,255,255,0.1)",
                          color: slide?.labelConfig?.text || "#ffffff",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                        className="text-md backdrop-blur-2xl w-fit mb-5 font-medium rounded-full px-5 py-1"
                      >
                        {slide.label}
                      </p>
                      <div className="max-w-[500px] overflow-hidden w-full">
                        <h2
                          style={{
                            color: slide?.titleConfig?.color || "#ffffff",
                          }}
                          className="text-5xl font-bold line-clamp-2"
                        >
                          {slide.title}
                        </h2>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Banner;
