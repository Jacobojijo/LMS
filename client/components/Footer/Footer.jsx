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

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#002b2b] to-[#00403f] text-white relative overflow-hidden">
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
            fill="#ffffff"
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
            <div className="flex justify-center md:justify-start items-center gap-2">
              <img
                src={"/assets/logo.png"}
                alt="Heritage Language School"
                className="h-12 w-auto"
              />
              <div className="flex flex-col -space-y-1">
                <span className="text-[#8EDBDB] tracking-wider text-xl leading-tight">
                  Heritage
                </span>
                <span className="font-bold text-[#F4E0E0] tracking-widest text-lg leading-tight">
                  Language School
                </span>
              </div>
            </div>
            <p className="text-gray-300 mt-4 text-center md:text-left">
              Preserving cultural heritage through language education since
              2025. Join our community of language enthusiasts.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 text-2xl pt-2">
              <a
                href="https://www.facebook.com/share/18oGJu72nf/?mibextid=wwXIfr"
                className="text-[#8EDBDB] hover:text-white transition-colors duration-300"
              >
                <FaFacebook />
              </a>
              <a
                href="https://x.com/heritagela42918?s=21"
                className="text-[#8EDBDB] hover:text-white transition-colors duration-300"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/heritage_language_school?igsh=MTN4enhsanpqeHEzdQ%3D%3D&utm_source=qr"
                className="text-[#8EDBDB] hover:text-white transition-colors duration-300"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@heritage.language?_t=ZM-8v2tP6Gleab&_r=1"
                className="text-[#8EDBDB] hover:text-white transition-colors duration-300"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.youtube.com/@HeritageLanguageSchool"
                className="text-[#8EDBDB] hover:text-white transition-colors duration-300"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.linkedin.com/company/heritage-language-school/"
                className="text-[#8EDBDB] hover:text-white transition-colors duration-300"
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
            <h3 className="text-xl font-semibold mb-6 text-[#F4E0E0]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center justify-center md:justify-start"
                >
                  <span className="mr-2">→</span> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center justify-center md:justify-start"
                >
                  <span className="mr-2">→</span> About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center justify-center md:justify-start"
                >
                  <span className="mr-2">→</span> Courses
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center justify-center md:justify-start"
                >
                  <span className="mr-2">→</span> Features
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center justify-center md:justify-start"
                >
                  <span className="mr-2">→</span> Contact
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
            <h3 className="text-xl font-semibold mb-6 text-[#F4E0E0]">
              Language Programs
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {[
                "Luo",
                "Gikuyu",
                "Kalenjin",
                "Ekegusii",
                "Kamba",
                "Luhya",
                "Meru",
                "Maasai",
              ].map((language) => (
                <li key={language} className="text-center md:text-left">
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300"
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
            <h3 className="text-xl font-semibold mb-6 text-[#F4E0E0]">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MdPhone className="text-[#8EDBDB] text-xl flex-shrink-0" />
                <p className="text-gray-300">(+254) 746426925</p>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MdEmail className="text-[#8EDBDB] text-xl flex-shrink-0" />
                <p className="text-gray-300">heritagelanguageschool.com</p>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="text-[#F4E0E0] font-medium mb-3">
                Subscribe to Our Newsletter
              </h4>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-[#003d3d] text-white px-4 py-2 mb-2 sm:mb-0 sm:rounded-l-md focus:outline-none w-full sm:w-auto"
                />
                <button className="bg-[#854836] hover:bg-[#6a3a2b] px-4 py-2 w-full sm:w-auto sm:rounded-r-md transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="bg-[#001f1f] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {currentYear} Heritage Language School. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-[#8EDBDB] text-sm transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#8EDBDB] text-sm transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#8EDBDB] text-sm transition-colors duration-300"
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
