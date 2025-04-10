import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";

const ResponsiveMenu = ({ open, onClose }) => {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sliding Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-r from-[#F5E6D3] via-[#E0F2F1] to-[#F4E0E0] shadow-lg z-50 overflow-y-auto"
          >
            <div className="relative p-6">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-primary"
              >
                <MdClose className="text-3xl" />
              </button>

              {/* Menu Items */}
              <ul className="flex flex-col justify-center items-start text-base gap-16 text-gray-600 font-semibold mt-10">
                <li><a href="/" className="hover:text-primary">Home</a></li>
                <li><a href="/#courses" className="hover:text-primary">Courses</a></li>
                <li><a href="/#features" className="hover:text-primary">Features</a></li>
                <li><a href="/about" className="hover:text-primary">About us</a></li>
                <li><a href="/curriculum" className="hover:text-primary">Curriculum</a></li>
                <li><a href="/contact" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
