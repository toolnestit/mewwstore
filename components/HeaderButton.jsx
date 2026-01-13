"use client";

import Image from "next/image";
import { AnimatedCircularProgressBar } from "./ui/animated-circular-progress-bar";
import { Button } from "./ui/button";
import Link from "next/link";
import { useQueryParams } from "@/lib/useQueryParams";

function HeaderButton({ session, className = "" }) {
  const { setQuery } = useQueryParams();
  return (
    <>
      {session?.email ? (
        <button
          onClick={() => {
            setQuery("account", "open");
          }}
          className={className}
        >
          <AnimatedCircularProgressBar
            max={100}
            min={0}
            value={session?.progress}
            gaugePrimaryColor="black"
            gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
          >
            <Image
              unoptimized
              src={`/api/og/avatar?q=${session?.email ?? "U"}`}
              width={30}
              height={30}
              alt="Avatar"
              className="rounded-full absolute  bg-black/10"
            />
          </AnimatedCircularProgressBar>
        </button>
      ) : (
        <Button
          onClick={() => {
            setQuery("auth", "signin");
          }}
          id="he"
        >
          Sign In
        </Button>
      )}
    </>
  );
}

export default HeaderButton;
