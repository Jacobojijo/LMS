"use client";

import { motion } from "framer-motion";
import { FadeInUp, FadeIn, SlideInRight } from "@/utility/MotionComponents";

const CurriculumPage = () => {
  return (
    <section className="bg-gray-100">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#854836] to-[#002b2b]">
            Our Curriculum
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#854836] to-[#002b2b] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-700">
            At Heritage Language School, we offer interactive and cutting-edge online lessons. Our
            curriculum is thoughtfully designed into structured, progressive modules that simplify
            learning while ensuring depth and retention. Each module combines interactive lessons,
            continuous assessments, and real-life language application to build fluency, cultural
            understanding, and confidence—all within a flexible, online format tailored to individual
            learning goals.
          </p>
        </motion.div>

        <FadeIn className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#002b2b] mb-6 text-center">
            Our Course Offerings
          </h2>
          <p className="text-gray-700 text-center mb-8">
            In all our indigenous Languages, we offer the following courses:
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#854836] to-[#6a392b] rounded-xl p-6 text-white"
            >
              <h3 className="text-2xl font-playfair font-bold mb-4 text-center">
                Beginner & Intermediate Language Course
              </h3>
              <p className="mb-4">
                Start your journey into indigenous language with our comprehensive beginner course, designed to build strong foundations.
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#6a392b] px-6 py-2 rounded-lg font-medium"
                >
                  View Course Details
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#002b2b] to-[#001a1a] rounded-xl p-6 text-white"
            >
              <h3 className="text-2xl font-playfair font-bold mb-4 text-center">
                Advanced Language Course
              </h3>
              <p className="mb-4">
                Deepen your linguistic skills and cultural understanding with our advanced course for experienced learners.
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#002b2b] px-6 py-2 rounded-lg font-medium"
                >
                  View Course Details
                </motion.button>
              </div>
            </motion.div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <FadeInUp>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#854836] to-[#6a392b] py-4 px-6">
                <h2 className="text-2xl font-playfair font-bold text-white">
                  Beginner & Intermediate Language Course
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#6a392b]">
                    Course Overview
                  </h3>
                  <p className="text-gray-700">
                    This course is designed to introduce beginners to the Indigenous language, focusing on
                    the four key skills: speaking, listening, reading, and writing. Students will start
                    with foundational vocabulary and basic grammar, progressing to constructing simple
                    sentences, engaging in basic conversations, and understanding the cultural context of
                    the language.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#6a392b]">
                    Course Details
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><span className="font-medium">Duration:</span> 4 Months (16 Weeks)</li>
                    <li><span className="font-medium">Modules:</span> 4 Modules</li>
                    <li><span className="font-medium">Schedule:</span> 5 lessons per week</li>
                    <li><span className="font-medium">Cost:</span> Ksh 5,000 per month</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#6a392b]">
                    Class Schedule
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Flexible Online Class schedules (Attend one class duration in a day)</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>Monday-Thursday: 5:30 AM - 6:30 AM & 7:00 PM - 8:00 PM (EAT)</li>
                      <li>Sunday: 8:00 AM - 9:00 AM & 2:00 PM - 3:00 PM (Omnibus) (EAT)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-[#6a392b]">
                    Course Structure
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#6a392b]">Module 01: Weeks 1-4</p>
                      <p className="text-gray-700">Alphabet, Basic Greetings, and Vocabulary</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#6a392b]">Module 02: Weeks 5-8</p>
                      <p className="text-gray-700">Simple Sentence Structures and Basic Grammar</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#6a392b]">Module 03: Weeks 9-12</p>
                      <p className="text-gray-700">Everyday Conversations and Cultural Context</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#6a392b]">Module 04: Weeks 13-16</p>
                      <p className="text-gray-700">Advanced Sentence Structures, Listening Comprehension, and Simple Writing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>

          <SlideInRight>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#002b2b] to-[#001a1a] py-4 px-6">
                <h2 className="text-2xl font-playfair font-bold text-white">
                  Advanced Language Course
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#002b2b]">
                    Course Overview
                  </h3>
                  <p className="text-gray-700">
                    The Advanced Language Course is designed to deepen the linguistic skills and cultural
                    understanding of students who have completed the beginner level. This course focuses
                    on advanced grammar, complex sentence structures, cultural nuances, and fluency in
                    both written and spoken Indigenous. The students will refine their language abilities,
                    preparing them to use them confidently in various professional, academic, and cultural
                    settings.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#002b2b]">
                    Course Details
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><span className="font-medium">Duration:</span> 2 Months (8 Weeks)</li>
                    <li><span className="font-medium">Modules:</span> 4 Modules</li>
                    <li><span className="font-medium">Schedule:</span> 5 lessons per week</li>
                    <li><span className="font-medium">Cost:</span> Ksh 5,000 per month</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#002b2b]">
                    Class Schedule
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Flexible Online Class schedules (Attend one class duration in a day)</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>Monday-Thursday: 5:30 AM - 6:30 AM & 7:00 PM - 8:00 PM (EAT)</li>
                      <li>Sunday: 8:00 AM - 9:00 AM & 2:00 PM - 3:00 PM (Omnibus) (EAT)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-[#002b2b]">
                    Course Structure
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#002b2b]">Module 01: Week 1-2</p>
                      <p className="text-gray-700">Advanced Grammatical Categories and Structures</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#002b2b]">Module 02: Week 3-4</p>
                      <p className="text-gray-700">Advanced Grammatical Categories and Complex Sentence Types</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#002b2b]">Module 03: Week 5-6</p>
                      <p className="text-gray-700">Predicate Frames, Expression Rules and Complex Sentences</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-[#002b2b]">Module 04: Week 7-8</p>
                      <p className="text-gray-700">Advanced Communication Skills, Cultural Proficiency and Mastery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SlideInRight>
        </div>

        <FadeIn className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-playfair font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#854836] to-[#002b2b] mb-8">
            Assessment & Certification
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#6a392b]">
                Beginner & Intermediate Assessment
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-[#854836] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <p className="font-medium">CAT 1 (End of Week 4)</p>
                    <p className="text-gray-600">Alphabet and Basic Vocabulary Test (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#854836] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <p className="font-medium">CAT 2 (End of Week 8)</p>
                    <p className="text-gray-600">Simple Sentence Construction and Grammar (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#854836] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <p className="font-medium">CAT 3 (End of Week 12)</p>
                    <p className="text-gray-600">Conversational Indigenous and Cultural Understanding (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#854836] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                  <div>
                    <p className="font-medium">Final Exam (End of Week 16)</p>
                    <p className="text-gray-600">Comprehensive Test on Speaking, Listening, Reading, and Writing (40%)</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#002b2b]">
                Advanced Assessment
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-[#002b2b] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <p className="font-medium">CAT 1 (End of Week 2)</p>
                    <p className="text-gray-600">Advanced Grammatical Categories and Structures (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#002b2b] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <p className="font-medium">CAT 2 (End of Week 4)</p>
                    <p className="text-gray-600">Advanced Grammatical Categories and Complex Sentence Types (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#002b2b] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <p className="font-medium">CAT 3 (End of Week 6)</p>
                    <p className="text-gray-600">Predicate Frames, Expression Rules and Complex Sentences (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#002b2b] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                  <div>
                    <p className="font-medium">Final Exam (End of Week 8)</p>
                    <p className="text-gray-600">A comprehensive test covering all advanced topics, including writing, speaking and interpretation (40%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeInUp className="text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#854836] to-[#002b2b]">
            Start Your Language Journey Today
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our vibrant community of language learners and become part of the movement to preserve and celebrate our rich indigenous linguistic heritage.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#854836] text-white px-8 py-3 rounded-lg hover:bg-[#6a392b] transition duration-300"
            >
              Enroll Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#002b2b] text-white px-8 py-3 rounded-lg hover:bg-[#001a1a] transition duration-300"
            >
              Download Syllabus
            </motion.button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default CurriculumPage;
