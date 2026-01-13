"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
  checkExpire,
  createHashFromJSON,
  getDiscountedPrice,
} from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { ArrowUpRight } from "lucide-react";
import getUserCountry from "js-user-country";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { FaCircleCheck } from "react-icons/fa6";
import ConfirmDialog from "./ConfirmDialog";
import Link from "next/link";
import { useQueryParams } from "@/lib/useQueryParams";

function ProductCard({
  thumb,
  name,
  access,
  showInfo = true,
  checkOutOff = true,
  slug,
  price,
  isLocked,
  priceBDT,
  cloudURL,
  discount,
  variant = "column",
  accessType,
  sources,
  category,
  demoUrl,
  selected,
  setSelected,
  showPirce = true,
  isSelectAble = false,
  discountGroup,
}) {
  const hasAccess = checkExpire(access, slug?.current);
  const country = getUserCountry();
  const isBD = country?.id === "BD";

  const finalPrice = Number(isBD ? priceBDT : price);
  const currency = isBD ? "৳" : "$";
  const discountValue =
    typeof discount === "number" && discount > 0 ? discount : null;
  const { setQuery } = useQueryParams();
  const displayPrice = discountValue
    ? getDiscountedPrice(finalPrice, discountValue)
    : finalPrice;

  const isRow = variant === "row";

  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const hoverTimeout = useRef(null);

  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 });

  const isSelected = !isSelectAble
    ? false
    : hasAccess
      ? true
      : selected?.some((item) => item.slug?.current === slug?.current);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const handleLoad = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      setBgColor(`rgb(${r}, ${g}, ${b})`);

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      setTextColor(brightness < 128 ? "#fff" : "#000");
    };

    if (img.complete) handleLoad();
    else img.addEventListener("load", handleLoad);

    return () => img.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(true);

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const cardWidth = 288; // hover card width
      const spaceRight = window.innerWidth - rect.right;

      let left = rect.right + 10;
      if (spaceRight < cardWidth + 20) {
        left = rect.left - cardWidth - 10; // shift left if not enough space
      }

      setCardPos({ top: rect.top, left });
    }
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setHovered(false), 100);
  };

  const [activeThumb, setactiveThumb] = useState(0);

  useEffect(() => {
    if (!sources || sources.length <= 1) return;

    const interval = setInterval(() => {
      setactiveThumb((prev) => (prev === sources.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [sources]);

  return (
    <>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="fixed inset-0 z-30 backdrop-blur-md bg-black/30 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <article
        onClick={() => {
          if (hasAccess) return null;
          if (!setSelected) return null;

          if (isLocked) return null;

          if (isSelected) {
            setSelected(
              selected.filter((item) => item.slug?.current !== slug?.current)
            );
          } else {
            setSelected([
              ...selected,
              {
                name,
                slug,
                price,
                thumb,
                discountGroup,
                priceBDT,
                discount,
              },
            ]);
          }
        }}
        ref={cardRef}
        className={clsx(
          "group relative w-full rounded-md transition-all overflow-hidden cursor-pointer z-40",
          isRow ? "flex items-center gap-3 pr-5" : "flex flex-col",
          isSelected && "ring-2 ring-offset-3 ",
          hasAccess ? "ring-sky-600" : "ring-green-500"
        )}
        style={{
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}, #ffffff)`,
          border: `1px solid ${bgColor}`,
          color: textColor,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLocked && (
          <ConfirmDialog
            asChildTrigger
            triggerText={
              <div className=" absolute inset-0 z-[100]  flex justify-center items-end font-semibold"></div>
            }
            title="Do you want to break the package?"
            description="If you want to select this tool, you will have to create a new package plan, so you will not get all the discounts included in this package."
            onConfirm={() => {
              window.location.href = `/cart?tool=${createHashFromJSON({
                name,
                slug,
                price,
                thumb,
                discountGroup,
                priceBDT,
                discount,
              })}`;
            }}
          />
        )}
        {variant !== "row" && hasAccess && (
          <div className="absolute inset-[-1px] z-[9999999]  rounded-xl flex justify-start items-end p-4">
            Owned
          </div>
        )}
        <div className="absolute inset-[-2px] backdrop-blur-md rounded-xl" />
        {isSelected && (
          <div className="absolute top-1 left-1 z-20">
            <div className=" text-green-400 p-1.5 rounded">
              {!hasAccess && <FaCircleCheck size={20} />}
            </div>
          </div>
        )}

        <div
          className={clsx(
            "relative z-10 shrink-0",
            isRow ? "w-20 h-20" : "w-full aspect-square"
          )}
        >
          <div className="relative w-full h-full overflow-hidden rounded-md">
            {discountValue && (
              <span className="absolute right-1 top-1 z-10 rounded bg-red-500 px-1 text-[10px] text-white">
                {discountValue}%
              </span>
            )}

            <Image
              ref={imgRef}
              src={thumb}
              alt={name}
              fill
              crossOrigin="anonymous"
              className="object-cover transition-transform duration-300"
            />
          </div>
        </div>

        <div
          className={clsx(
            "relative z-10 flex flex-col justify-center flex-1 min-w-0",
            isRow ? "" : "p-4"
          )}
        >
          <div>
            <h3
              className={`font-bold text-base line-clamp-2 ${hasAccess && "pb-5"}`}
            >
              {name}
            </h3>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs">
            {variant === "row" && hasAccess && (
              <h3 className={`rounded-xl font-medium text-[14px] -mt-6`}>
                Owned
              </h3>
            )}
            {!hasAccess && showPirce && (
              <span className="text-sm flex flex-wrap gap-x-2">
                {discountValue && (
                  <span className="line-through opacity-60">
                    {finalPrice} {currency}
                  </span>
                )}

                <span className="font-extrabold">
                  {displayPrice} {currency}
                </span>
              </span>
            )}
          </div>
        </div>
      </article>

      {showInfo &&
        hovered &&
        mounted &&
        createPortal(
          <motion.div
            className="rounded-md overflow-hidden  bg-white border border-black/10  z-50 -translate-y-[5%] "
            style={{
              top: cardPos.top,
              left: cardPos.left,
              position: "fixed",
              width: 288,
            }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
              setHovered(true);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {sources?.length > 0 && (
              <AspectRatio className={`relative`} ratio={16 / 9}>
                <Image src={sources[activeThumb]} fill alt="Source" />
                <div className=" absolute bottom-0 px-2 py-2 flex gap-2 right-2">
                  <div className="bg-white/40 backdrop-blur-3xl rounded-full p-1  items-center gap-1 px-2 flex">
                    {Array.from({ length: sources?.length }).map(
                      (pagination, index) => (
                        <button
                          onMouseEnter={() => setactiveThumb(index)}
                          key={`pagination-#$${index}`}
                          className={`w-2 h-2 rounded-full ${activeThumb === index ? "bg-white" : " bg-white/50"}`}
                        />
                      )
                    )}
                  </div>
                </div>
              </AspectRatio>
            )}
            <div className="p-5">
              <div className="flex gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image src={thumb} alt={name} fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold leading-tight line-clamp-2">
                    {name}
                  </h4>
                  <p className="mt-1 text-xs opacity-70">
                    {category?.name || "Premium digital product"}
                  </p>
                </div>
              </div>
              {accessType?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm pb-1 pt-2">
                    Access Types
                  </h4>
                  <ul className="flex items-center gap-2 text-sm flex-wrap">
                    {accessType?.map((access, index) => (
                      <li
                        key={`accesss-${access}`}
                        className="bg-stone-200 px-2 rounded-sm capitalize"
                      >
                        {access}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold">
                  {displayPrice} {currency}
                </span>
                {demoUrl && (
                  <a
                    target="_blank"
                    href={demoUrl}
                    className="flex items-center gap-1 text-sm font-semibold text-blue-600"
                  >
                    Demo <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
              {!hasAccess && checkOutOff && (
                <div className="w-full pt-4">
                  <Button
                    onClick={() => {
                      window.location.href = `/cart?tool=${createHashFromJSON({
                        name,
                        slug,
                        price,
                        thumb,
                        discountGroup,
                        priceBDT,
                        discount,
                      })}`;
                    }}
                  >
                    Checkout
                  </Button>
                </div>
              )}
              {!hasAccess ||
                (cloudURL && (
                  <Link
                    target="_blank"
                    href={cloudURL}
                    className="w-full pt-2 flex"
                  >
                    <Button className={`w-full`}>Access Cloud</Button>
                  </Link>
                ))}
              {!hasAccess ||
                (accessType?.includes("credential") && (
                  <Button
                    onClick={() => {
                      setQuery("app", slug.current);
                    }}
                    className={`w-full mt-2 flex`}
                  >
                    Credentials
                  </Button>
                ))}
              {!hasAccess ||
                (accessType?.includes("extension") && (
                  <Link href={"/extension"} className="w-full flex pt-2">
                    <Button variant={`outline`} className={`w-full`}>
                      Extension
                    </Button>
                  </Link>
                ))}
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}

export default ProductCard;

export function ProductCardSkeleton({ variant = "column", className }) {
  const isRow = variant === "row";

  return (
    <article
      className={clsx(
        "rounded-md border p-3",
        isRow ? "flex gap-3" : "flex flex-col space-y-3",
        className
      )}
    >
      <Skeleton
        className={clsx(
          "rounded-md",
          isRow ? "w-28 aspect-square" : "w-full aspect-square"
        )}
      />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </article>
  );
}
