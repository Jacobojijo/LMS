"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Language registration links
  const languageLinks = {
    "Dholuo": "https://forms.gle/372UuExdkQJkGgTa9",
    "Ekegusii": "https://forms.gle/a8hHzTYAZXs7dRjL7",
    "Kalenjin": "https://forms.gle/y5ZEiuAfSM5rMdku8",
    "Kikuyu": "https://forms.gle/h1Ck5D1ZSU3JjNG59",
    "Kamba": "#",
    "Luhya": "#",
    "Meru": "#",
    "Maasai": "#"
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-teal-900 to-teal text-white">
      {/* Decorative curved top border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-sand"
          ></path>
        </svg>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: School Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-center md:text-left"
          >
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <img
                src={"/assets/logo.png"}
                alt="Sigana African Heritage Language School"
                className="h-14 w-auto"
              />
              <div className="flex flex-col leading-none">
                <span className="font-playfair text-2xl font-bold tracking-wide text-white">
                  Sigana
                </span>
                <span className="text-[10px] font-semibold tracking-[0.18em] text-gold-300 uppercase">
                  African Heritage Language School
                </span>
              </div>
            </div>
            <p className="mt-4 text-center text-white/70 md:text-left">
              Preserving, documenting, and revitalizing the indigenous languages
              of Kenya, East Africa, and the African continent. Join our
              community of language enthusiasts.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 text-2xl pt-2">
              <a
                href="https://www.facebook.com/share/18oGJu72nf/?mibextid=wwXIfr"
                className="text-gold-300 transition-colors duration-300 hover:text-white"
              >
                <FaFacebook />
              </a>
              <a
                href="https://x.com/heritagela42918?s=21"
                className="text-gold-300 transition-colors duration-300 hover:text-white"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://www.instagram.com/heritage_language_school?igsh=MTN4enhsanpqeHEzdQ%3D%3D&utm_source=qr"
                className="text-gold-300 transition-colors duration-300 hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@heritage.languages?_r=1&_t=ZS-9AhnyuFpPvA"
                className="text-gold-300 transition-colors duration-300 hover:text-white"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.youtube.com/@HeritageLanguageSchool"
                className="text-gold-300 transition-colors duration-300 hover:text-white"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.linkedin.com/company/heritage-language-school/"
                className="text-gold-300 transition-colors duration-300 hover:text-white"
              >
                <FaLinkedin />
              </a>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-center md:text-left"
          >
            <h3 className="mb-6 font-playfair text-xl font-semibold text-gold-300">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="flex items-center justify-center text-white/70 transition-colors duration-300 hover:text-gold-300 md:justify-start"
                >
                  <span className="mr-2">→</span> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center justify-center text-white/70 transition-colors duration-300 hover:text-gold-300 md:justify-start"
                >
                  <span className="mr-2">→</span> About
                </Link>
              </li>
              <li>
                <Link
                  href="/curriculum"
                  className="flex items-center justify-center text-white/70 transition-colors duration-300 hover:text-gold-300 md:justify-start"
                >
                  <span className="mr-2">→</span> Curriculum
                </Link>
              </li>
              <li>
                <Link
                  href="/#courses"
                  className="flex items-center justify-center text-white/70 transition-colors duration-300 hover:text-gold-300 md:justify-start"
                >
                  <span className="mr-2">→</span> Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="flex items-center justify-center text-white/70 transition-colors duration-300 hover:text-gold-300 md:justify-start"
                >
                  <span className="mr-2">→</span> Features
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center justify-center text-white/70 transition-colors duration-300 hover:text-gold-300 md:justify-start"
                >
                  <span className="mr-2">→</span> Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="flex items-center justify-center font-medium text-gold-300 transition-colors duration-300 hover:text-white md:justify-start"
                >
                  <span className="mr-2">❤</span> Donate
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Language Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 text-center md:text-left"
          >
            <h3 className="mb-6 font-playfair text-xl font-semibold text-gold-300">
              Language Programs
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {Object.entries(languageLinks).map(([language, link]) => (
                <li key={language} className="text-center md:text-left">
                  <a
                    href={link}
                    className="text-white/70 transition-colors duration-300 hover:text-gold-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {language} classes
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6 text-center md:text-left"
          >
            <h3 className="mb-6 font-playfair text-xl font-semibold text-gold-300">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MdPhone className="shrink-0 text-xl text-gold-300" />
                <p className="text-white/70">(+254) 746426925</p>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MdEmail className="shrink-0 text-xl text-gold-300" />
                <p className="text-white/70">heritagelanguageschool@gmail.com</p>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="mb-3 font-medium text-gold-300">
                Subscribe to Our Newsletter
              </h4>
              <div className="flex w-full max-w-sm flex-col sm:flex-row mx-auto md:mx-0">
                <input
                  type="email"
                  placeholder="Your email"
                  aria-label="Email address"
                  className="mb-2 w-full min-w-0 flex-1 rounded-md border border-white/15 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-gold focus:outline-none sm:mb-0 sm:rounded-r-none"
                />
                <button className="shrink-0 rounded-md bg-primary px-4 py-2 font-semibold transition duration-300 hover:bg-primary-700 sm:rounded-l-none">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="bg-black/25 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <p className="mb-4 text-white/60 md:mb-0">
              © {currentYear} Sigana African Heritage Language School. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="#"
                className="text-sm text-white/60 transition-colors duration-300 hover:text-gold-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-white/60 transition-colors duration-300 hover:text-gold-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-white/60 transition-colors duration-300 hover:text-gold-300"
              >
                Careers
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
