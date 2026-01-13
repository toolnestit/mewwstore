"use client";

import { TrendingUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import clsx from "clsx";

function Trending({ data, access }) {
  const products = data?.products || [];
  const [mounted, setMounted] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="w-full flex justify-center p-5 pt-20">
      <div className="w-full max-w-[1440px] bg-gray-600/5 p-6 sm:p-10 rounded-md">
        <div className="flex w-full justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp size={32} /> Trending
          </h2>
          <div className="flex gap-5">
            <button
              ref={prevRef}
              className=" z-10 bg-white shadow w-10 h-10 rounded-full"
            >
              ‹
            </button>
            <button
              ref={nextRef}
              className=" z-10 bg-white shadow w-10 h-10 rounded-full"
            >
              ›
            </button>
          </div>
        </div>

        <div className="relative pt-2">
          {/* Navigation Buttons */}

          {mounted && (
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              loop={true}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 6 },
              }}
            >
              {products.map((product, index) => (
                <SwiperSlide key={index} className="!h-auto !flex">
                  <ProductCard access={access} variant="row" {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {!mounted && (
            <div
              className={clsx(
                " w-full grid  grid-cols-1  min-[200px]:grid-cols-1  min-[300px]:grid-cols-2 min-[620px]:grid-cols-4  min-[1280px]:grid-cols-6  gap-4"
              )}
            >
              {Array.from({ length: 1 }).map((_, i) => {
                return (
                  <ProductCardSkeleton variant="row" key={`trending-sk-${i}`} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Trending;
