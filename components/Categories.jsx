"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

function Categories({ data }) {
  const sliderRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkOverflow = () => {
    const el = sliderRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const scroll = (direction) => {
    sliderRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full flex justify-center p-5 pt-20">
      <div className="w-full max-w-[1440px] relative">
        <h2 className="text-3xl font-bold mb-6">
          <span className="text-sky-500">Top </span>Categories
        </h2>

        <div className="flex  items-center relative">
          {showLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow rounded-full p-2"
            >
              <ChevronLeft />
            </button>
          )}

          <div
            ref={sliderRef}
            onScroll={checkOverflow}
            className="flex gap-4 overflow-x-auto w-full scrollbar-hide mask-fade-x "
          >
            {data.map((cat, index) => (
              <CategoryCard key={index} {...cat} />
            ))}
          </div>

          {/* Right Arrow */}
          {showRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow rounded-full p-2"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Categories;

function CategoryCard({ name, slug, icon }) {
  return (
    <div
      className={clsx(
        "shrink-0",
        "min-w-[160px] sm:min-w-[200px] md:min-w-[240px]",
        "flex items-center justify-between",
        "rounded-2xl border p-4 md:p-5 gap-4 bg-white transition"
      )}
    >
      <span className="font-semibold text-sm sm:text-base md:text-lg">
        {name}
      </span>

      {icon?.asset?.url && (
        <Image
          src={icon.asset.url}
          alt={name}
          width={40}
          height={40}
          className="saturate-0"
        />
      )}
    </div>
  );
}
