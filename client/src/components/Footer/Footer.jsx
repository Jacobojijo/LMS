import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-[#002b2b] to-[#00403f] text-white relative overflow-hidden">
      {/* Decorative curved top border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#ffffff"></path>
        </svg>
      </div>
      
      {/* Main footer content */}
      <div className="container py-16 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        
          {/* Column 1: School Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <img src={logo} alt="Heritage Language School" className="h-14 w-auto" />
              <div className="flex flex-col -space-y-1">
                <span className="text-[#8EDBDB] tracking-wider text-xl leading-tight">Heritage</span>
                <span className="font-bold text-[#F4E0E0] tracking-widest text-lg leading-tight">Language School</span>
              </div>
            </div>
            <p className="text-gray-300 mt-4">
              Preserving cultural heritage through language education since 2005. Join our community of language enthusiasts.
            </p>
            <div className="flex space-x-4 text-2xl pt-2">
              <a href="#" className="text-[#8EDBDB] hover:text-white transition-colors duration-300">
                <FaFacebook />
              </a>
              <a href="#" className="text-[#8EDBDB] hover:text-white transition-colors duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="text-[#8EDBDB] hover:text-white transition-colors duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="text-[#8EDBDB] hover:text-white transition-colors duration-300">
                <FaYoutube />
              </a>
            </div>
          </motion.div>
          
          {/* Column 2: Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold mb-6 text-[#F4E0E0]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span> Courses
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span> Features
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300 flex items-center">
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
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold mb-6 text-[#F4E0E0]">Language Programs</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300">Children's Program</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300">Adult Classes</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300">Online Learning</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300">Summer Immersion</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#8EDBDB] transition-colors duration-300">Cultural Workshops</a>
              </li>
            </ul>
          </motion.div>
          
          {/* Column 4: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold mb-6 text-[#F4E0E0]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MdLocationOn className="text-[#8EDBDB] text-xl mt-1 flex-shrink-0" />
                <p className="text-gray-300">123 Heritage Lane, Language City, LC 12345</p>
              </div>
              <div className="flex items-center space-x-3">
                <MdPhone className="text-[#8EDBDB] text-xl flex-shrink-0" />
                <p className="text-gray-300">(123) 456-7890</p>
              </div>
              <div className="flex items-center space-x-3">
                <MdEmail className="text-[#8EDBDB] text-xl flex-shrink-0" />
                <p className="text-gray-300">info@heritagelanguage.com</p>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="text-[#F4E0E0] font-medium mb-3">Subscribe to Our Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-[#003d3d] text-white px-4 py-2 rounded-l-md focus:outline-none flex-grow" 
                />
                <button className="bg-[#854836] hover:bg-[#6a3a2b] px-4 py-2 rounded-r-md transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer bottom */}
      <div className="bg-[#001f1f] py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              © {currentYear} Heritage Language School. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#8EDBDB] text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#8EDBDB] text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-[#8EDBDB] text-sm transition-colors duration-300">
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
