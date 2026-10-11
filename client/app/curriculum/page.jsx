"use client";

import { motion } from "framer-motion";
import { FadeInUp, FadeIn, SlideInRight } from "@/utility/MotionComponents";

const CurriculumPage = () => {
  return (
    <section className="bg-sand">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">How you'll learn</span>
          <h1 className="mt-3 mb-4 font-playfair text-4xl font-bold text-teal-900 md:text-6xl">
            Our Curriculum
          </h1>
          <div className="rule-gold mb-6"></div>
          <p className="max-w-3xl mx-auto text-ink/75">
            At Sigana African Heritage Language School, we offer interactive and cutting-edge online lessons. Our
            curriculum is thoughtfully designed into structured, progressive modules that simplify
            learning while ensuring depth and retention. Each module combines interactive lessons,
            continuous assessments, and real-life language application to build fluency, cultural
            understanding, and confidence—all within a flexible, online format tailored to individual
            learning goals.
          </p>
        </motion.div>

        <FadeIn className="card p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-teal-900 mb-6 text-center">
            Our Course Offerings
          </h2>
          <p className="text-ink/75 text-center mb-8">
            In all our indigenous Languages, we offer the following courses:
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-primary to-primary-700 rounded-xl p-6 text-white"
            >
              <h3 className="text-2xl font-playfair font-bold mb-4 text-center">
                Beginner & Intermediate Language Course
              </h3>
              <p className="mb-4">
                Start your journey into indigenous language with our comprehensive beginner course, designed to build strong foundations.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-teal to-teal-900 rounded-xl p-6 text-white"
            >
              <h3 className="text-2xl font-playfair font-bold mb-4 text-center">
                Advanced Language Course
              </h3>
              <p className="mb-4">
                Deepen your linguistic skills and cultural understanding with our advanced course for experienced learners.
              </p>
            </motion.div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <FadeInUp>
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-700 py-4 px-6">
                <h2 className="text-2xl font-playfair font-bold text-white">
                  Beginner & Intermediate Language Course
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary-700">
                    Course Overview
                  </h3>
                  <p className="text-ink/75">
                    This course is designed to introduce beginners to the Indigenous language, focusing on
                    the four key skills: speaking, listening, reading, and writing. Students will start
                    with foundational vocabulary and basic grammar, progressing to constructing simple
                    sentences, engaging in basic conversations, and understanding the cultural context of
                    the language.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary-700">
                    Course Details
                  </h3>
                  <ul className="space-y-2 text-ink/75">
                    <li><span className="font-medium">Duration:</span> 4 Months (16 Weeks)</li>
                    <li><span className="font-medium">Modules:</span> 4 Modules</li>
                    <li><span className="font-medium">Schedule:</span> 5 lessons per week</li>
                    <li><span className="font-medium">Cost:</span> Ksh 5,000 per month</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary-700">
                    Class Schedule
                  </h3>
                  <div className="bg-sand p-4 rounded-lg">
                    <p className="text-sm text-ink/70 mb-2">Flexible Online Class schedules (Attend one class duration in a day)</p>
                    <ul className="space-y-1 text-ink/75">
                      <li>Monday-Thursday: 5:30 AM - 6:30 AM & 7:00 PM - 8:00 PM (EAT)</li>
                      <li>Sunday: 8:00 AM - 9:00 AM & 2:00 PM - 3:00 PM (Omnibus) (EAT)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary-700">
                    Course Structure
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-primary-700">Module 01: Weeks 1-4</p>
                      <p className="text-ink/75">Alphabet, Basic Greetings, and Vocabulary</p>
                    </div>
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-primary-700">Module 02: Weeks 5-8</p>
                      <p className="text-ink/75">Simple Sentence Structures and Basic Grammar</p>
                    </div>
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-primary-700">Module 03: Weeks 9-12</p>
                      <p className="text-ink/75">Everyday Conversations and Cultural Context</p>
                    </div>
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-primary-700">Module 04: Weeks 13-16</p>
                      <p className="text-ink/75">Advanced Sentence Structures, Listening Comprehension, and Simple Writing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>

          <SlideInRight>
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-teal to-teal-900 py-4 px-6">
                <h2 className="text-2xl font-playfair font-bold text-white">
                  Advanced Language Course
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-teal-900">
                    Course Overview
                  </h3>
                  <p className="text-ink/75">
                    The Advanced Language Course is designed to deepen the linguistic skills and cultural
                    understanding of students who have completed the beginner level. This course focuses
                    on advanced grammar, complex sentence structures, cultural nuances, and fluency in
                    both written and spoken Indigenous. The students will refine their language abilities,
                    preparing them to use them confidently in various professional, academic, and cultural
                    settings.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-teal-900">
                    Course Details
                  </h3>
                  <ul className="space-y-2 text-ink/75">
                    <li><span className="font-medium">Duration:</span> 2 Months (8 Weeks)</li>
                    <li><span className="font-medium">Modules:</span> 4 Modules</li>
                    <li><span className="font-medium">Schedule:</span> 5 lessons per week</li>
                    <li><span className="font-medium">Cost:</span> Ksh 5,000 per month</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-teal-900">
                    Class Schedule
                  </h3>
                  <div className="bg-sand p-4 rounded-lg">
                    <p className="text-sm text-ink/70 mb-2">Flexible Online Class schedules (Attend one class duration in a day)</p>
                    <ul className="space-y-1 text-ink/75">
                      <li>Monday-Thursday: 5:30 AM - 6:30 AM & 7:00 PM - 8:00 PM (EAT)</li>
                      <li>Sunday: 8:00 AM - 9:00 AM & 2:00 PM - 3:00 PM (Omnibus) (EAT)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-teal-900">
                    Course Structure
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-teal-900">Module 01: Week 1-2</p>
                      <p className="text-ink/75">Advanced Grammatical Categories and Structures</p>
                    </div>
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-teal-900">Module 02: Week 3-4</p>
                      <p className="text-ink/75">Advanced Grammatical Categories and Complex Sentence Types</p>
                    </div>
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-teal-900">Module 03: Week 5-6</p>
                      <p className="text-ink/75">Predicate Frames, Expression Rules and Complex Sentences</p>
                    </div>
                    <div className="bg-sand p-3 rounded-lg">
                      <p className="font-medium text-teal-900">Module 04: Week 7-8</p>
                      <p className="text-ink/75">Advanced Communication Skills, Cultural Proficiency and Mastery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SlideInRight>
        </div>

        <FadeIn className="card p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-playfair font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal mb-8">
            Assessment & Certification
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary-700">
                Beginner & Intermediate Assessment
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <p className="font-medium">CAT 1 (End of Week 4)</p>
                    <p className="text-ink/70">Alphabet and Basic Vocabulary Test (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <p className="font-medium">CAT 2 (End of Week 8)</p>
                    <p className="text-ink/70">Simple Sentence Construction and Grammar (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <p className="font-medium">CAT 3 (End of Week 12)</p>
                    <p className="text-ink/70">Conversational Indigenous and Cultural Understanding (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                  <div>
                    <p className="font-medium">Final Exam (End of Week 16)</p>
                    <p className="text-ink/70">Comprehensive Test on Speaking, Listening, Reading, and Writing (40%)</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-teal-900">
                Advanced Assessment
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-900 font-semibold text-white">1</div>
                  <div>
                    <p className="font-medium">CAT 1 (End of Week 2)</p>
                    <p className="text-ink/70">Advanced Grammatical Categories and Structures (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-900 font-semibold text-white">2</div>
                  <div>
                    <p className="font-medium">CAT 2 (End of Week 4)</p>
                    <p className="text-ink/70">Advanced Grammatical Categories and Complex Sentence Types (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-900 font-semibold text-white">3</div>
                  <div>
                    <p className="font-medium">CAT 3 (End of Week 6)</p>
                    <p className="text-ink/70">Predicate Frames, Expression Rules and Complex Sentences (20%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-900 font-semibold text-white">4</div>
                  <div>
                    <p className="font-medium">Final Exam (End of Week 8)</p>
                    <p className="text-ink/70">A comprehensive test covering all advanced topics, including writing, speaking and interpretation (40%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeInUp className="text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal">
            Start Your Language Journey Today
          </h2>
          <p className="text-ink/70 max-w-2xl mx-auto mb-8">
            Join our vibrant community of language learners and become part of the movement to preserve and celebrate our rich indigenous linguistic heritage.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition duration-300"
              onClick={() => window.location.href = "/register"}
            >
              Enroll Now
            </motion.button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default CurriculumPage;
