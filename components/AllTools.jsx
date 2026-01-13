import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";

function AllTools({ data, access }) {
  return (
    <section className="w-full flex justify-center p-5 pt-20">
      <div className="w-full max-w-[1440px] relative">
        <div className="flex justify-between w-full items-center">
          <Link
            href={"/cart"}
            className="text-2xl md:text-3xl font-bold group w-fit flex items-center"
          >
            Single Tools{" "}
            <ChevronRight
              strokeWidth={2.5}
              className={`group-hover:translate-x-2 transition-all size-8`}
            />
          </Link>
          <Link href={"/cart"}>
            <Button>
              See All <ArrowUpRight strokeWidth={1.2} size={20} />
            </Button>
          </Link>
        </div>

        <div
          className="
    w-full pt-5
    grid grid-cols-2
    min-[350px]:grid-cols-3
    min-[490px]:grid-cols-4
    md:grid-cols-5
    lg:grid-cols-6
    xl:grid-cols-8
    gap-4
  "
        >
          {data.map((product, index) => (
            <ProductCard
              access={access}
              key={`product-${index}`}
              {...product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AllTools;
