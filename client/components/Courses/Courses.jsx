"use client";

import React, { useState, useEffect } from "react";
import languageData from "../../utility/language.json";
import uniqueData from "../../utility/unique.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FadeInUp, ScaleIn, FadeIn } from "../../utility/MotionComponents";
import { motion } from "framer-motion";

const Courses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Adjust cards per page based on screen size
  const cardsPerPage = windowWidth < 640 ? 3 : 6;

  // Calculate how many items to display per page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = languageData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(languageData.length / cardsPerPage);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Pagination navigation methods remain the same as in previous version
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setExpandedCards({}); // Reset expanded state when changing page
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setExpandedCards({}); // Reset expanded state when changing page
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExpandedCards({}); // Reset expanded state when changing page
  };

  // Function to determine grid columns based on screen size
  const getGridColumns = () => {
    if (windowWidth < 640) return "grid-cols-1"; // Small devices
    if (windowWidth < 1024) return "grid-cols-2"; // Medium devices
    return "grid-cols-3"; // Large devices
  };

  // Toggle card expansion
  const toggleCardExpansion = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Get the unique description content for a language
  const getUniqueContent = (language) => {
    const uniqueDesc = uniqueData.languages[language.title]?.unique || "";

    if (!expandedCards[language.title]) {
      // Show only first paragraph when not expanded, with more aggressive truncation for mobile
      const firstParagraph = uniqueDesc.split("\n\n")[0];
      const maxLength = windowWidth < 640 ? 100 : 150;
      return firstParagraph.length > maxLength
        ? firstParagraph.substring(0, maxLength) + "..."
        : firstParagraph;
    }

    return uniqueDesc;
  };

  // Generate page numbers with mobile-friendly adjustments
  const displayPageNumbers = () => {
    const visiblePageNumbers = windowWidth < 640 ? 3 : 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(visiblePageNumbers / 2)
    );
    let endPage = Math.min(totalPages, startPage + visiblePageNumbers - 1);

    // Adjust start page if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - visiblePageNumbers + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  // Render CTA based on language with mobile-friendly adjustments
  const renderCTA = (language) => {
    // September intake links
    const intakeLinks = {
      "Dholuo": "https://forms.gle/372UuExdkQJkGgTa9",
      "Ekegusii": "https://forms.gle/a8hHzTYAZXs7dRjL7",
      "Kalenjin": "https://forms.gle/y5ZEiuAfSM5rMdku8",
      "Kikuyu": "https://forms.gle/h1Ck5D1ZSU3JjNG59"
    };

    // Check if language has September intake
    if (intakeLinks[language.title]) {
      return (
        <a
          href={intakeLinks[language.title]}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-md transition-colors duration-300 flex items-center"
        >
          <span className="mr-1 relative">
            <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </span>
          {windowWidth < 640 ? "REGISTER" : "SEPTEMBER INTAKE: REGISTER"}
        </a>
      );
    } else {
      return (
        <button className="bg-gray-500 text-white text-xs font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-md opacity-80 cursor-not-allowed">
          {windowWidth < 640 ? "SOON" : "COMING SOON"}
        </button>
      );
    }
  };

  // Animation variants for staggered card appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Controls the delay between each child animation
        delayChildren: 0.2     // Delay before the first child starts animating
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <FadeIn
      className="w-full bg-teal-50 py-8 sm:py-12 px-2 sm:px-4"
      delay={0.1}
    >
      <motion.div
        className={`max-w-6xl mx-auto grid ${getGridColumns()} gap-3 sm:gap-4 md:gap-6`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {currentCards.map((language, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-video overflow-hidden p-2 sm:p-4 md:p-6 pb-2 rounded-lg">
              <ScaleIn delay={0.1}>
                <img
                  src={language.imageurl}
                  alt={`${language.title} language class`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
              </ScaleIn>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {language.title} Classes
              </h2>

              {/* Original description from language.json */}
              <div className="bg-gray-50 p-2 sm:p-3 rounded-md mb-2 sm:mb-3 border-l-4 border-blue-500">
                <p className="text-sm sm:text-base text-gray-700 italic">
                  {language.description}
                </p>
              </div>

              {/* Unique description from unique.json - FONT SIZE INCREASED HERE */}
              <div className="text-[15px] md:text-[15px] lg:text-[15px] xl:text-[16px] text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                {getUniqueContent(language)
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p key={i} className="mb-1 sm:mb-2 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <button
                    className="flex items-center text-blue-600 font-medium text-sm sm:text-base"
                    onClick={() => toggleCardExpansion(language.title)}
                  >
                    {expandedCards[language.title]
                      ? "SHOW LESS"
                      : "READ MORE"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform ${
                        expandedCards[language.title] ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Custom CTA based on language */}
                <div className="flex-shrink-0">{renderCTA(language)}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      <FadeIn
        className="flex justify-center mt-6 sm:mt-8 items-center"
        delay={0.6}
      >
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`p-1 sm:p-2 rounded-md mr-1 sm:mr-2 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-100"
          }`}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Pagination number buttons with responsive display */}
        {displayPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            className={`px-2 py-1 sm:px-3 sm:py-1 mx-0.5 sm:mx-1 text-xs sm:text-base rounded-md ${
              currentPage === pageNumber
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`p-1 sm:p-2 rounded-md ml-1 sm:ml-2 ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-100"
          }`}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </FadeIn>

      {/* Page indicator */}
      <FadeIn
        className="text-center mt-2 text-xs sm:text-sm text-gray-600"
        delay={0.7}
      >
        Page {currentPage} of {totalPages}
      </FadeIn>
    </FadeIn>
  );
};

export default Courses;
