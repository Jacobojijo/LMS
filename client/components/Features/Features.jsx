"use client";

import React from "react";
import { motion } from "framer-motion";
import { SlideLeft } from "../../utility/animation";

const FeatureData = [
  {
    id: 1,
    title: "Cultural Immersion",
    desc: "Learn not just the language, but the customs and traditions behind it.",
    delay: 0.3,
    icon: "🌏",
  },
  {
    id: 2,
    title: "Native-Speaker Instructors",
    desc: "Learn authentic pronunciation and nuances from those who grew up speaking the language.",
    delay: 0.6,
    icon: "🎓",
  },
  {
    id: 3,
    title: "Practical Application",
    desc: "Master everyday conversations, proverbs, and cultural expressions.",
    delay: 0.9,
    icon: "💬",
  },
];

const Features = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            What We Offer You
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Capture the essence of learning, culture, and connection through our
            comprehensive language experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FeatureData.map((item) => (
            <motion.div
              key={item.id}
              variants={SlideLeft(item.delay)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">{item.icon}</span>
                  <h3 className="text-2xl font-playfair font-bold group-hover:text-indigo-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
