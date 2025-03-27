import React from "react";
import { motion } from "framer-motion";
import { FadeInUp, FadeIn, SlideInRight } from "../../utility/MotionComponents";

const About = () => {
  return (
    <section className="bg-gray-100">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#854836] to-[#6a392b]">
            Our Mission
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#854836] to-[#6a392b] mx-auto mb-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <FadeInUp>
            <div className="prose max-w-prose text-gray-700 space-y-4">
              <p>
                We believe that language is more than just words—it's a living bridge to our ancestors, 
                our identity, and our cultural heritage. Our platform is dedicated to reviving and 
                preserving indigenous languages that are at risk of extinction.
              </p>
              <p>
                Through interactive, engaging, and culturally rich learning experiences, we empower 
                individuals to reconnect with their linguistic roots and keep their mother tongues alive 
                for future generations.
              </p>
            </div>
          </FadeInUp>
          <SlideInRight>
            <div className="bg-gradient-to-br from-[#854836] to-[#6a392b] rounded-xl p-6 text-white">
              <h3 className="text-2xl font-playfair font-bold mb-4">Language: Our Living Heritage</h3>
              <p className="italic">
                "Every language is a unique world view, a distinct way of understanding and expressing 
                our human experience. When a language dies, we lose more than words—we lose entire 
                universes of meaning."
              </p>
            </div>
          </SlideInRight>
        </div>

        <FadeIn className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#854836] mb-6 text-center">
            Our Approach
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-3 text-[#6a392b]">Cultural Context</h3>
              <p className="text-gray-600">
                We don't just teach languages—we immerse you in the rich cultural contexts that give 
                languages their depth and meaning.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🗣️</div>
              <h3 className="text-xl font-semibold mb-3 text-[#6a392b]">Interactive Learning</h3>
              <p className="text-gray-600">
                Our innovative platform combines technology with traditional learning methods to make 
                language acquisition engaging and effective.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-3 text-[#6a392b]">Language Preservation</h3>
              <p className="text-gray-600">
                Every lesson is a step towards preserving linguistic diversity and keeping cultural 
                heritage alive for future generations.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeInUp className="text-center mt-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#854836] to-[#6a392b]">
            Join Our Language Revival Movement
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you're reconnecting with your roots or passionate about linguistic diversity, 
            your journey starts here. Help us preserve, celebrate, and revitalize indigenous languages.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#854836] text-white px-8 py-3 rounded-lg hover:bg-[#6a392b] transition duration-300"
          >
            Get Started
          </motion.button>
        </FadeInUp>
      </div>
    </section>
  );
};

export default About;
