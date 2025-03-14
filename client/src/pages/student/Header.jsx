import React, { useState, useEffect } from "react";
import { NavbarMenu } from "../../mockData/data";
import logo from '../../assets/logo.png';
import { MdMenu, MdClose } from "react-icons/md";
import ResponsiveMenu from "../../components/Navbar/ResponsiveMenu";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Remove token and user role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    
    // Update logged in state
    setIsLoggedIn(false);
    
    // Redirect to home page
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "py-2 bg-white/95 backdrop-blur-sm shadow-md" 
          : "py-4 bg-gradient-to-r from-[#F0D6B9] via-[#C8E6E4] to-[#ECC6C6] backdrop-blur-sm"
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container mx-auto px-4 flex justify-between items-center"
        >
          {/* Logo section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <a href="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Heritage Language School" 
                className={`transition-all duration-300 ${scrolled ? 'h-12' : 'h-16'} w-auto`} 
              />
              <div className="flex flex-col ml-2 -space-y-1">
                <span className="text-[#008080] font-serif tracking-wider text-xl md:text-2xl leading-tight">
                  Heritage
                </span>
                <span className="font-bold text-[#854836] font-serif tracking-widest text-lg md:text-xl leading-tight">
                  Language School
                </span>
              </div>
            </a>
          </motion.div>

          {/* Menu section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-700">
              {NavbarMenu.map((item) => (
                <motion.li 
                  key={item.id}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={item.link}
                    className="relative font-medium inline-block py-2 px-3 hover:text-[#854836] transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#854836] hover:after:w-full after:transition-all after:duration-300"
                  >
                    {item.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Call to Action section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <motion.button 
                onClick={handleLogout}
                className="bg-white group hover:bg-[#854836] font-semibold text-[#854836] hover:text-white rounded-md border-2 border-[#854836] px-5 py-2 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Log out</span>
                <span className="absolute inset-0 bg-[#854836] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </motion.button>
            ) : (
              <motion.div className="flex items-center gap-3">
                <motion.a 
                  href="/login"
                  className="font-semibold text-[#854836] hover:text-[#6a392b] px-3 py-2 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Sign In
                </motion.a>
                <motion.a 
                  href="/register"
                  className="bg-[#854836] hover:bg-[#6a392b] font-semibold text-white rounded-md px-5 py-2 transition-colors duration-300 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Register
                </motion.a>
              </motion.div>
            )}
          </div>

          {/* Mobile hamburger Menu section */}
          <motion.div 
            className="md:hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setOpen(!open)}
          >
            {open ? 
              <MdClose className="text-3xl text-[#854836]" /> : 
              <MdMenu className="text-3xl text-[#854836]" />
            }
          </motion.div>
        </motion.div>
      </nav>

      {/* Add spacing to account for fixed navbar */}
      <div className={`${scrolled ? 'h-16' : 'h-24'} transition-all duration-300`}></div>

      {/* Mobile Sidebar section */}
      <ResponsiveMenu 
        open={open} 
        onClose={() => setOpen(false)} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;