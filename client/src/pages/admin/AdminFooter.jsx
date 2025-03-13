import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaSlack, FaQuestionCircle } from 'react-icons/fa';
import { MdEmail, MdBugReport } from 'react-icons/md';
import logo from '../../assets/logo.png';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-[#002b2b] to-[#00403f] text-white mt-auto py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and copyright */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center mb-3 md:mb-0"
          >
            <div className="flex items-center gap-2">
              <img src={logo} alt="Heritage Language School" className="h-8 w-auto" />
              <div className="flex flex-col -space-y-1">
                <span className="text-[#8EDBDB] tracking-wider text-sm leading-tight">Heritage</span>
                <span className="font-bold text-[#F4E0E0] tracking-widest text-xs leading-tight">Admin Panel</span>
              </div>
            </div>
            <span className="text-gray-400 text-sm ml-4">
              © {currentYear} Heritage Language School
            </span>
          </motion.div>
          
          {/* Quick links */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3 md:mb-0"
          >
            <Link to="/admin/dashboard" className="text-gray-300 hover:text-[#8EDBDB] text-sm transition-colors duration-300">
              Dashboard
            </Link>
            <Link to="/admin/help" className="text-gray-300 hover:text-[#8EDBDB] text-sm transition-colors duration-300">
              Help Center
            </Link>
            <a href="#" className="text-gray-300 hover:text-[#8EDBDB] text-sm transition-colors duration-300">
              Documentation
            </a>
            <a href="#" className="text-gray-300 hover:text-[#8EDBDB] text-sm transition-colors duration-300">
              API Reference
            </a>
          </motion.div>
          
          {/* Support links */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <a href="#" className="text-[#8EDBDB] hover:text-white transition-colors duration-300 flex items-center gap-1 text-sm">
              <FaQuestionCircle /> <span>Support</span>
            </a>
            <a href="#" className="text-[#8EDBDB] hover:text-white transition-colors duration-300 flex items-center gap-1 text-sm">
              <MdBugReport /> <span>Report Bug</span>
            </a>
            <a href="#" className="text-[#8EDBDB] hover:text-white transition-colors duration-300 flex items-center gap-1 text-sm">
              <FaSlack /> <span>Slack</span>
            </a>
          </motion.div>
        </div>
        
        {/* Version info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-3 text-center md:text-right"
        >
          <span className="text-gray-400 text-xs">
            Admin Panel v1.0.0 | Last updated: March 11, 2025
          </span>
        </motion.div>
      </div>
    </footer>
  );
};

export default AdminFooter;