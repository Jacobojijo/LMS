"use client";

import React from "react";
import { motion } from "framer-motion";

const FeatureData = [
  {
    id: 1,
    title: "Structured Modular Learning",
    desc: "Our curriculum is thoughtfully divided into clearly defined modules, making it easier for students of all levels to progress confidently.",
    icon: "📚",
  },
  {
    id: 2,
    title: "Online Course Tracking",
    desc: "Monitor your progress in real-time, access learning materials anywhere, and track your improvement with our dedicated platform.",
    icon: "📊",
  },
  {
    id: 3,
    title: "Continuous Assessments",
    desc: "Regular quizzes, comprehensive tests, and examinations help reinforce learning and identify areas for improvement quickly.",
    icon: "✅",
  },
  {
    id: 4,
    title: "Enhanced Engagement",
    desc: "Live interactive sessions, structured evaluations, and dynamic lesson plans tailored to different learning styles.",
    icon: "🔄",
  },
  {
    id: 5,
    title: "Culturally Rooted Learning",
    desc: "Experience cultural immersion, contextual learning, and community connection while mastering your ancestral language.",
    icon: "🌍",
  },
];

const FeatureCard = ({ item }) => (
  <div className="w-[300px] flex-none px-3 sm:w-[360px]">
    <div className="card group h-full p-8">
      <div className="mb-5 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand-200 text-2xl">
          {item.icon}
        </span>
        <h3 className="font-playfair text-xl font-bold text-teal-900 transition-colors duration-300 group-hover:text-primary">
          {item.title}
        </h3>
      </div>
      <p className="leading-relaxed text-ink/70">{item.desc}</p>
      <div className="mt-6 h-1 w-12 rounded-full bg-gold transition-all duration-300 group-hover:w-full" />
    </div>
  </div>
);

const Features = () => {
  // Duplicated once so the CSS marquee can loop seamlessly at -50%
  const marqueeData = [...FeatureData, ...FeatureData];

  return (
    <section className="bg-gradient-to-b from-white to-sand py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="eyebrow">Why Sigana</span>
          <h2 className="section-heading mt-3 mb-4 text-4xl md:text-5xl">
            Why Choose Sigana African Heritage Language School
          </h2>
          <div className="rule-gold mb-6" />
          <p className="mx-auto max-w-3xl text-lg text-ink/70">
            Reconnect with your cultural roots through our engaging, modern, and
            effective online platform. Whether you're looking to preserve your
            identity, improve family communication, or reclaim your indigenous
            language, our program blends tradition with technology.
          </p>
        </motion.div>
      </div>

      {/* Edge-to-edge marquee — pauses on hover and under reduced motion */}
      <div className="relative overflow-hidden py-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-sand to-transparent"
        />

        <ul className="marquee-track flex w-max list-none">
          {marqueeData.map((item, index) => (
            <li
              key={`${item.id}-${index}`}
              aria-hidden={index >= FeatureData.length ? "true" : undefined}
            >
              <FeatureCard item={item} />
            </li>
          ))}
        </ul>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-3xl text-center"
        >
          <h3 className="font-playfair text-2xl font-bold text-primary md:text-3xl">
            The Sigana Advantage
          </h3>
          <p className="mt-4 mb-8 text-ink/70">
            At Sigana African Heritage Language School, we blend tradition with
            technology. Our online platform, comprehensive tracking tools, and
            passionate educators guide you every step of the way. More than just
            a course, this is a movement to revive, preserve, and celebrate
            indigenous languages.
          </p>
          <a href="/register" className="btn-primary">
            Take the First Step Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
