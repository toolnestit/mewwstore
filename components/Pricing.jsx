"use client";

import { getDiscountedPrice } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductCard from "./ProductCard";
import Image from "next/image";

function Pricing({ data }) {
  const colors = [
    "#D5E7D9",
    "#8AB7E9",
    "#BCD2D6",
    "#DAAB9C",
    "#8C8A8A",
    "#CFE4E2",
    "#947476",
    "#DBD5D4",
  ];

  return (
    <section className="w-full flex justify-center px-5 pt-20">
      <div className="w-full max-w-[1440px]">
        <div className="mb-5">
          <div className="text-2xl md:text-3xl font-bold flex items-center gap-1">
            Bundel of Tools
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {data?.map((plan, index) => (
            <article
              key={`plan-${plan?._id || index}`}
              className="rounded-xl p-[2px]"
              style={{
                background: `linear-gradient(180deg, ${colors[index]}, ${colors[index]}, #ffffff)`,
              }}
            >
              <div className="bg-white rounded-xl p-6 h-full flex flex-col">
                {/* Plan Name */}
                <h3 className="text-xl font-semibold">{plan?.name}</h3>

                {/* Price */}
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-black">
                    {plan?.price?.discount
                      ? getDiscountedPrice(
                          plan?.price?.normal,
                          plan?.price?.discount
                        )
                      : plan?.price?.normal}
                    $
                  </span>

                  {plan?.price?.discount && (
                    <span className="text-sm text-gray-400 line-through mb-1">
                      {plan?.price?.normal}$
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600">
                  {plan?.description}
                </p>

                {/* Divider */}
                <div
                  className="my-5 h-px w-full"
                  style={{ backgroundColor: colors[index] }}
                />

                <ul className="space-y-3 flex-1">
                  {plan?.features?.map((feature, i) => (
                    <li
                      key={i}
                      className="relative flex items-start gap-2 text-sm cursor-pointer w-fit text-gray-700 group"
                    >
                      <Check className="size-4 text-green-600 mt-[2px]" />

                      <span className="flex items-center gap-2">
                        {feature?.product && (
                          <Image
                            alt={feature?.product?.name}
                            width={20}
                            height={20}
                            src={feature?.product?.thumb}
                            className="rounded-sm"
                          />
                        )}
                        {feature?.name || feature?.product?.name}
                      </span>

                      {feature?.product && (
                        <div
                          className="
                            absolute left-full top-1/2 ml-4
                            -translate-y-1/2
                            hidden group-hover:block
                            z-50 w-[200px]
                          "
                        >
                          <ProductCard
                            showInfo={false}
                            showPirce={false}
                            variant="row"
                            {...feature.product}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/cart?plan=${plan?.slug?.current}`}
                  style={{
                    background: `linear-gradient(40deg, ${colors[index]}, #ffffff)`,
                    border: `1px solid ${colors[index]}`,
                  }}
                  className="relative w-full py-6 mt-10 overflow-hidden rounded-md"
                >
                  <div className="inset-0 absolute flex justify-center backdrop-blur-3xl  items-center font-bold ">
                    Choose Plan
                  </div>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
