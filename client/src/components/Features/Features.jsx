import React from "react";
import { motion } from "framer-motion";
import { SlideLeft } from "../../utility/animation";

const FeatureData = [
  {
    id: 1,
    title: "Cultural Immersion",
    desc: "Learn not just the language, but the customs and traditions behind it.",
    delay: 0.3,
  },
  {
    id: 2,
    title: "Native-Speaker Instructors",
    desc: "Learn authentic pronunciation and nuances from those who grew up speaking the language.",
    delay: 0.6,
  },
  {
    id: 3,
    title: "Practical Application",
    desc: "Master everyday conversations, proverbs, and cultural expressions.",
    delay: 0.9,
  },
];


const Equipments = () => {
  return (
    <div>
      <div className="container py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-playfair">
          <div className="space-y-4 p-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              What we offer you
            </h1>
            <p className="text-gray-500">
            Capture the essence of learning, culture, and connection.
            </p>
          </div>
          {FeatureData.map((item) => {
            return (
              <motion.div
                variants={SlideLeft(item.delay)}
                initial="hidden"
                whileInView="visible"
                key={item.id}
                className="bg-gray-100 space-y-4 p-6 hover:bg-white rounded-xl hover:shadow-[0_0_22px_0_rgba(0,0,0,0.15)] "
              >
                <p className="text-2xl font-semibold">{item.title}</p>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Equipments;
