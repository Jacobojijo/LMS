import React from "react";
import Link from "next/link";
import CountUp from "../ui/CountUp";
import {
  FadeInLeft,
  FadeInUp,
  SlideInRight,
  FadeIn,
} from "../../utility/MotionComponents";

const stats = [
  { end: 500, suffix: "+", label: "Learners reached" },
  { end: 8, suffix: "", label: "Languages taught" },
  { end: 100, suffix: "%", label: "Community-led" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sand via-sand to-white">
      {/* Soft clay glow behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-teal/10 blur-3xl"
      />

      <div className="relative container mx-auto grid min-h-[650px] grid-cols-1 px-4 md:grid-cols-2">
        {/* Background Image for Small Screens */}
        <FadeIn className="absolute inset-0 md:hidden">
          <img
            src={"/assets/original.png"}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-sand/70" />
        </FadeIn>

        {/* Brand Info */}
        <FadeInLeft className="relative z-10 flex flex-col justify-center py-14 font-playfair md:py-0">
          <div className="space-y-6 text-center md:text-left">
            <FadeInUp delay={0.1}>
              <span className="eyebrow">Dawn of Dialects</span>
            </FadeInUp>

            <FadeInUp
              delay={0.2}
              className="text-5xl leading-tight font-bold text-ink lg:text-6xl xl:leading-[1.15]"
            >
              Every language carries a{" "}
              <span className="relative inline-block text-primary">
                world
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-0 -z-10 h-3 w-full bg-gold/30"
                />
              </span>{" "}
              within it
            </FadeInUp>

            <FadeInUp
              delay={0.3}
              className="font-sans text-lg leading-relaxed text-ink/75 xl:max-w-[520px]"
            >
              Rediscover and master your mother tongue with Sigana — where
              interactive lessons, cultural context, and community bring
              indigenous African languages to life.
            </FadeInUp>

            <FadeInUp
              delay={0.4}
              className="flex flex-wrap justify-center gap-4 font-sans md:justify-start"
            >
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
              <Link href="/#courses" className="btn-outline">
                Explore Courses
              </Link>
            </FadeInUp>

            {/* Animated impact counters */}
            <FadeInUp
              delay={0.5}
              className="flex flex-wrap justify-center gap-8 border-t border-sand-200 pt-8 font-sans md:justify-start"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    className="font-playfair text-3xl font-bold text-teal md:text-4xl"
                  />
                  <p className="mt-1 text-xs tracking-wider text-ink/60 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </FadeInUp>
          </div>
        </FadeInLeft>

        {/* Image Section for Large Screens */}
        <SlideInRight
          className="hidden items-center justify-center md:flex"
          duration={1}
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/15 to-teal/15"
            />
            <img
              src={"/assets/original.png"}
              alt="Learners studying an indigenous African language with Sigana"
              className="relative h-auto max-w-full rounded-2xl object-cover shadow-xl"
            />
          </div>
        </SlideInRight>
      </div>

      <div className="kente-rule" />
    </section>
  );
};

export default Hero;
