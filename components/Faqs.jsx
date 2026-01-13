"use client";

import React, { useState } from "react";
import SpaceBg from "@/public/space.png";
import Image from "next/image";
import Link from "next/link";
import { ShimmerButton } from "./ui/shimmer-button";
import { BorderBeam } from "./ui/border-beam";

function Faqs({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [...data?.faqs];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full flex justify-center px-4 sm:px-6 lg:px-5 pt-16 sm:pt-20 mb-16 sm:mb-20">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-6">
        {/* FAQ Card */}
        <div className="w-full lg:w-6/12 bg-linear-to-br from-pink-500/50 to-transparent  rounded-xl relative overflow-hidden">
          <div className="inset-0 backdrop-blur-lg absolute left-0 top-0" />

          <div className="w-full p-5 sm:p-8 lg:p-10 z-10 relative">
            {/* Title */}
            <h3 className="text-4xl sm:text-6xl lg:text-8xl font-semibold glass-text uppercase scale-y-110 inline-block mb-6 sm:mb-8 lg:mb-10">
              FAQs
            </h3>

            {/* FAQ List */}
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className="rounded-lg sm:rounded-xl bg-linear-to-br from-white/60 to-pink-400/20 backdrop-blur-2xl border border-white/50   overflow-hidden"
                  >
                    {/* Question */}
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                    >
                      <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-black">
                        {faq.question}
                      </h4>

                      {/* Icon */}
                      <span
                        className={`text-xl sm:text-2xl transition-transform duration-300 text-black ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>

                    {/* Answer */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 pb-4 sm:pb-5"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden px-4 sm:px-5 text-xs sm:text-sm lg:text-base text-black/50">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-6/12 bg-linear-to-br rounded-xl relative overflow-hidden">
          <Image
            fill
            alt="Space Bg"
            src={SpaceBg}
            placeholder="blur"
            className="object-cover"
          />
          <div className="inset-0 backdrop-blur-lg absolute left-0 top-0" />
          <div className="w-full p-5 sm:p-8 lg:p-10 z-10 relative">
            <h2 className="text-5xl md:text-4xl lg:text-6xl glass-text font-semibold uppercase">
              24/7 Support Contact With Us
            </h2>
            <p className="pt-5  glass-text">
              We are best among all the providers. Get 5 minutes from your time
              and have a discussion with us why we can serve you with best!
            </p>
            <Link href={"/support"} className="w-fit mt-10 flex">
              <ShimmerButton>
                Contact Us
                <BorderBeam colorFrom="white" colorTo="transparent" />
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faqs;
