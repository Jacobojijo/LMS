import React from "react";
import { NavbarMenu } from "../../mockData/data";
import logo from '../../assets/logo.png'
import { MdMenu } from "react-icons/md";
import ResponsiveMenu from "./ResponsiveMenu";
import { motion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <nav>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="container flex justify-between items-center py-8"
        >
          
          {/* Logo section */}
          <div className="text-2xl flex items-center gap-2 ">
            <a href="/">
              <img 
                src={logo} 
                alt="Heritage Language School" 
                className="h-16 w-auto" 
              />
            </a>
            <div className="flex flex-col -space-y-2">
              <span className="text-[#008080] tracking-wider text-2xl md:text-2xl leading-tight">
                Heritage
              </span>
              <span className="font-bold text-[#854836] text-secondary tracking-widest text-xl md:text-xl leading-tight">
                Language School
              </span>
            </div>
          </div>
          {/* Menu section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {NavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      className="
                    inline-block py-1 px-3 hover:text-primary font-semibold"
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Icons section */}
          <div className="flex items-center gap-4">
          <button className="hover:bg-[#854836] font-semibold text-[#008080] hover:text-white rounded-md border-2 border-[#854836] px-6 py-2 duration-200">
            Sign Up
          </button>
          </div>
          {/* Mobile hamburger Menu section */}
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <MdMenu className="text-4xl" />
          </div>
        </motion.div>
      </nav>

      {/* Mobile Sidebar section */}
      <ResponsiveMenu 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
};

export default Navbar;
