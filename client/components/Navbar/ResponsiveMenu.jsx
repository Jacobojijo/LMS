import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import { NavbarMenu } from "./Navbar";

const ResponsiveMenu = ({ open, onClose, pathname }) => {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink"
            onClick={onClose}
          />

          {/* Sliding Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 bottom-0 left-0 z-50 w-72 overflow-y-auto bg-sand shadow-xl"
          >
            <div className="kente-rule" />

            <div className="relative p-6">
              {/* Brand lockup */}
              <div className="flex items-center gap-2 pr-10">
                <img
                  src={"/assets/logo.png"}
                  alt="Sigana African Heritage Language School"
                  className="h-11 w-auto"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-playfair text-lg font-bold tracking-wide text-teal">
                    Sigana
                  </span>
                  <span className="text-[9px] font-semibold tracking-[0.16em] text-primary uppercase">
                    African Heritage
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute top-4 right-4 text-ink/60 transition-colors hover:text-primary"
              >
                <MdClose className="text-3xl" />
              </button>

              {/* Menu Items */}
              <ul className="mt-10 flex flex-col gap-1 text-base font-medium">
                {NavbarMenu.map((item) => {
                  const isActive = pathname === item.link;
                  const isDonate = item.title === "Donate";

                  return (
                    <li key={item.id}>
                      <a
                        href={item.link}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={`block rounded-lg px-4 py-3 transition-colors duration-200 ${
                          isActive
                            ? "bg-white text-primary shadow-sm"
                            : "text-ink/75 hover:bg-white hover:text-primary"
                        } ${isDonate ? "mt-2 font-semibold text-primary" : ""}`}
                      >
                        {isDonate ? "❤ Donate" : item.title}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-col gap-3 border-t border-sand-200 pt-6">
                <a href="/register" className="btn-primary w-full" onClick={onClose}>
                  Get Started
                </a>
                <a href="/login" className="btn-outline w-full" onClick={onClose}>
                  Log in
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
