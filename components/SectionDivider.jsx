import React from "react";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "./ui/scroll-based-velocity";
import { RiGeminiFill } from "react-icons/ri";
import { SiClaude } from "react-icons/si";

function SectionDivider() {
  return (
    <section className="w-full flex justify-center ">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden -mb-10 py-20 max-w-[1440px]">
        <ScrollVelocityContainer className="text-4xl font-bold tracking-[-0.02em] md:text-7xl md:leading-[5rem] rotate-[3deg]">
          <ScrollVelocityRow baseVelocity={20} direction={-1}>
            <div className="backdrop-blur-3xl bg-sky-500/50 py-2 text-2xl px-10 flex items-center gap-5 text-white border-x border-white/20 uppercase">
              <RiGeminiFill /> Meww Store
            </div>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
        <ScrollVelocityContainer className="text-4xl font-bold tracking-[-0.02em] md:text-7xl md:leading-[5rem] rotate-[-3deg] -mt-20">
          <ScrollVelocityRow baseVelocity={20} direction={1}>
            <div className="backdrop-blur-3xl bg-pink-500/50 py-2 text-2xl px-10 flex items-center gap-5 text-white border-x border-white/20 uppercase">
              <SiClaude /> Meww Store
            </div>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
      </div>
    </section>
  );
}

export default SectionDivider;
