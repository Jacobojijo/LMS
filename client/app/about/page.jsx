"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import CountUp from "@/components/ui/CountUp";
import { FadeInUp, FadeIn, SlideInRight } from "@/utility/MotionComponents";

const pillars = [
  {
    icon: "🎓",
    title: "We Teach",
    desc: "Structured, engaging courses in indigenous and local languages, delivered in person and on the online platforms people already use and trust. From beginner conversations to advanced fluency, our programs meet learners where they are.",
  },
  {
    icon: "✍🏾",
    title: "We Create",
    desc: "We develop curriculum, textbooks, digital content, audio-visual materials, assessments, and certifications that make indigenous languages teachable, learnable, and lovable — the tools teachers need and learners deserve.",
  },
  {
    icon: "🛡️",
    title: "We Preserve",
    desc: "We prioritise the languages most at risk — those with fewer than five thousand fluent speakers left. For these languages, we offer free and heavily subsidised courses.",
  },
  {
    icon: "📜",
    title: "We Document",
    desc: "Linguistic research, field documentation, and digital archiving alongside elders, cultural experts, and traditional knowledge holders — so that every word, every story, every song is recorded with accuracy, respect, and authenticity.",
  },
  {
    icon: "📢",
    title: "We Advocate",
    desc: "We champion the inclusion of indigenous languages in formal education at county and national levels, and build capacity for teachers, speakers, and community advocates — so policymakers cannot ignore the languages that shaped our nations.",
  },
  {
    icon: "🤝🏾",
    title: "We Partner",
    desc: "We work with communities, educational institutions, corporations, government agencies, NGOs, and international bodies, expanding commercially across the East African Community and beyond — because sustainability requires scale.",
  },
];

const stats = [
  { end: 500, suffix: "+", label: "Learners reached" },
  { end: 8, suffix: "", label: "Languages taught" },
  { end: 5000, prefix: "<", label: "Speakers left — free & subsidised" },
];

const AboutPage = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="eyebrow">Dawn of Dialects</span>
            <h1 className="mt-4 mb-6 font-playfair text-4xl font-bold text-teal-900 md:text-6xl">
              Every language carries a world within it
            </h1>
            <div className="rule-gold mb-8" />
            <p className="text-lg leading-relaxed text-ink/75">
              A way of seeing, a way of knowing, a way of belonging. When a
              language disappears, that world disappears with it.
            </p>
          </motion.div>
        </div>
        <div className="kente-rule" />
      </section>

      {/* Who We Are */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
            <FadeInUp>
              <span className="eyebrow">Who We Are</span>
              <h2 className="section-heading mt-3 mb-6">
                A Kenyan social enterprise for African languages
              </h2>
              <div className="space-y-4 text-ink/75">
                <p>
                  <strong className="text-ink">
                    Sigana African Heritage Language School
                  </strong>{" "}
                  is a Kenyan-registered social enterprise, legally incorporated
                  under the Companies Act, 2015, built on a simple but powerful
                  conviction: every language carries a world within it.
                </p>
                <p>
                  Born in Kenya and reaching across East Africa and the wider
                  continent, we are a private company limited by shares that
                  operates at the meeting point of{" "}
                  <strong className="text-ink">culture and commerce</strong>,{" "}
                  <strong className="text-ink">heritage and innovation</strong>,{" "}
                  <strong className="text-ink">community and enterprise</strong>
                  .
                </p>
              </div>
            </FadeInUp>

            <SlideInRight>
              <div className="rounded-2xl bg-gradient-to-br from-teal to-teal-900 p-8 text-white shadow-lg">
                <h3 className="mb-4 font-playfair text-2xl font-bold">
                  Why "Sigana"?
                </h3>
                <p className="leading-relaxed text-white/90">
                  Our name comes from <strong>Dholuo</strong>, the language of
                  the Luo people of Kenya, Uganda, South Sudan, DRC and
                  Tanzania. It means{" "}
                  <em className="text-gold-300">story, narrative, history</em> —
                  reflecting our belief that every language carries a universe
                  of knowledge, identity, and cultural memory that must be
                  preserved for future generations.
                </p>
              </div>
            </SlideInRight>
          </div>

          {/* Mission & Vision */}
          <div className="grid gap-8 md:grid-cols-2">
            <FadeInUp>
              <div className="card h-full border-t-4 border-t-primary p-8">
                <span className="eyebrow">Our Mission</span>
                <p className="mt-4 leading-relaxed text-ink/75">
                  To{" "}
                  <strong className="text-ink">
                    preserve, protect, revitalize, document, archive, and
                    promote
                  </strong>{" "}
                  indigenous and endangered languages of Kenya, East Africa, and
                  the African continent — while building a sustainable,
                  commercially viable enterprise that generates lasting social
                  and cultural returns.
                </p>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <div className="card h-full border-t-4 border-t-teal p-8">
                <span className="eyebrow">Our Vision</span>
                <p className="mt-4 leading-relaxed text-ink/75">
                  A continent where{" "}
                  <strong className="text-ink">every indigenous language</strong>{" "}
                  is a living, breathing part of daily life, education, and
                  cultural expression — and where language preservation is
                  community-led and globally valued.
                </p>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Impact counters */}
      <section className="bg-teal-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <CountUp
                  end={stat.end}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="font-playfair text-5xl font-bold text-gold-300"
                />
                <p className="mt-2 text-sm tracking-wider text-white/70 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-sand">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <span className="eyebrow">What We Do</span>
            <h2 className="section-heading mt-3 mb-4 text-4xl md:text-5xl">
              Six ways we keep languages alive
            </h2>
            <div className="rule-gold" />
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <FadeInUp key={pillar.title} delay={index * 0.08}>
                <div className="card group h-full p-8">
                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-sand-200 text-3xl">
                    {pillar.icon}
                  </span>
                  <h3 className="mb-3 font-playfair text-xl font-bold text-teal-900 transition-colors group-hover:text-primary">
                    {pillar.title}
                  </h3>
                  <p className="leading-relaxed text-ink/70">{pillar.desc}</p>
                  <div className="mt-6 h-1 w-10 rounded-full bg-gold transition-all duration-300 group-hover:w-full" />
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sand">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-playfair text-3xl font-bold text-teal-900 md:text-4xl">
              Join our language revival movement
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-ink/70">
              Whether you're reconnecting with your roots or passionate about
              linguistic diversity, your journey starts here. Help us preserve,
              celebrate, and revitalize indigenous languages.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
