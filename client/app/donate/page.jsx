"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, BookOpen, Users, GraduationCap, Mail } from "lucide-react";
import { FadeInUp } from "@/utility/MotionComponents";

// Temporary donation page: a statement only, no online payments.
// The full donation form lives in components/donate/DonationForm.jsx —
// render <DonationForm /> here again to re-enable online donations.

const IMPACT_AREAS = [
  {
    icon: BookOpen,
    title: "Curriculum Development",
    text: "Creating lessons, stories and learning materials that keep African languages alive.",
  },
  {
    icon: Users,
    title: "Teacher Training",
    text: "Equipping native speakers to teach their languages with confidence and care.",
  },
  {
    icon: GraduationCap,
    title: "Student Scholarships",
    text: "Opening the door for learners who want to reconnect with their heritage.",
  },
];

const DonatePage = () => {
  return (
    <section className="bg-sand py-16 md:py-24 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-700">
            Support Our Mission
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-700 mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <FadeInUp>
            <div className="card p-8 md:p-10 border-t-4 border-primary">
              <p className="text-ink/75 text-lg leading-relaxed">
                Sigana African Heritage Language School exists to preserve and pass on
                African languages, so that the stories, wisdom and identity they carry are
                not lost to the next generation. Every lesson we build, every teacher we
                train and every student we welcome is made possible by people who believe
                in this work. Your generous support helps us reach more families and
                communities, at home and across the diaspora.
              </p>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {IMPACT_AREAS.map(({ icon: Icon, title, text }, i) => (
              <FadeInUp key={title} delay={0.1 * (i + 1)}>
                <div className="card p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-primary mb-2">{title}</h2>
                  <p className="text-sm text-ink/70 leading-relaxed">{text}</p>
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp delay={0.4}>
            <div className="card p-8 mt-10 text-center">
              <h2 className="text-xl font-semibold text-ink mb-3">
                Online donations are coming soon
              </h2>
              <p className="text-ink/70 max-w-2xl mx-auto mb-6">
                We are setting up secure online giving. In the meantime, if you would like
                to support our work, please get in touch and we will gladly share how you
                can give.
              </p>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Us to Give
              </Link>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

export default DonatePage;
