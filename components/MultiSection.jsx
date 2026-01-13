"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

function MultiSection({ data }) {
  const [loaded, setLoaded] = useState(() => new Set());

  return (
    <section className="w-full flex justify-center px-4 pb-6">
      <div className="w-full max-w-[1440px] grid grid-cols-1 min-[450px]:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Link key={index} href={item.href} className="block">
            <div className="relative overflow-hidden rounded-lg group h-24 sm:h-36">
              <div
                className={`absolute inset-0 z-20 flex flex-col justify-center sm:gap-2 px-6 sm:px-10  ${loaded.has(index) && "bg-gradient-to-r from-black/50 via-black/20 to-transparent"}`}
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {item.title}
                </h2>

                <span className="inline-flex items-center gap-1 text-sm sm:text-base text-white font-medium underline">
                  {item.buttonText}
                  <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              <Image
                src={item.img}
                alt={item.title}
                fill
                priority={index < 3}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onLoad={() => {
                  setLoaded((prev) => {
                    const next = new Set(prev);
                    next.add(index);
                    return next;
                  });
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default MultiSection;
