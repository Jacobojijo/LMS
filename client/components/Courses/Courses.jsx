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
      "Dholuo": "https://forms.gle/fbeT3KZfbZcGUXkT8",
      "Ekegusii": "https://forms.gle/s1MocBdbP5CRMDWv6",
      "Kalenjin": "https://forms.gle/mFSo9UNvtfmJSQDk8",
      "Kikuyu": "https://forms.gle/9SPzsCM7a29BUBN69"
    };

    // Check if language has September intake
    if (intakeLinks[language.title]) {
      return (
        <a
          href={intakeLinks[language.title]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-md bg-teal px-2 py-1 text-xs font-bold text-white transition-colors duration-300 hover:bg-teal-900 sm:px-3 sm:py-2"
        >
          <span className="relative mr-1">
            <span className="absolute top-0 right-0 -mt-1 -mr-1 h-2 w-2 animate-pulse rounded-full bg-gold"></span>
          </span>
          {windowWidth < 640 ? "REGISTER" : "MAY INTAKE: REGISTER"}
        </a>
      );
    } else {
      return (
        <button
          disabled
          className="cursor-not-allowed rounded-md bg-ink/30 px-2 py-1 text-xs font-bold text-white sm:px-3 sm:py-2"
        >
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
    <FadeIn className="w-full bg-sand px-2 py-12 sm:px-4 sm:py-16" delay={0.1}>
      <div className="mx-auto mb-10 max-w-3xl px-2 text-center">
        <span className="eyebrow">Our Languages</span>
        <h2 className="section-heading mt-3 mb-4">Find your mother tongue</h2>
        <div className="rule-gold" />
      </div>

      <motion.div
        className={`max-w-6xl mx-auto grid ${getGridColumns()} gap-4 sm:gap-5 md:gap-6`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {currentCards.map((language, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="card group flex flex-col overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden">
              <ScaleIn delay={0.1} className="h-full w-full">
                <img
                  src={language.imageurl}
                  alt={`${language.title} language class`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </ScaleIn>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
              />
              <h2 className="absolute bottom-3 left-4 font-playfair text-xl font-bold text-white drop-shadow-sm sm:text-2xl">
                {language.title} Classes
              </h2>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
              {/* Original description from language.json */}
              <div className="mb-3 rounded-md border-l-4 border-gold bg-sand p-3">
                <p className="text-sm italic text-ink/75 sm:text-base">
                  {language.description}
                </p>
              </div>

              {/* Unique description from unique.json */}
              <div className="mb-4 text-[15px] leading-relaxed text-ink/70 xl:text-[16px]">
                {getUniqueContent(language)
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p key={i} className="mb-2 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="shrink-0">
                  <button
                    className="flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary-700 sm:text-base"
                    aria-expanded={!!expandedCards[language.title]}
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
                <div className="shrink-0">{renderCTA(language)}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      <FadeIn
        className="mt-8 flex items-center justify-center"
        delay={0.6}
      >
        <nav aria-label="Course pages" className="flex items-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className={`mr-1 rounded-md p-2 transition-colors sm:mr-2 ${
              currentPage === 1
                ? "cursor-not-allowed text-ink/25"
                : "text-primary hover:bg-sand-200"
            }`}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Pagination number buttons with responsive display */}
          {displayPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              aria-current={currentPage === pageNumber ? "page" : undefined}
              className={`mx-0.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:mx-1 sm:text-base ${
                currentPage === pageNumber
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink/70 hover:bg-sand-200 hover:text-primary"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className={`ml-1 rounded-md p-2 transition-colors sm:ml-2 ${
              currentPage === totalPages
                ? "cursor-not-allowed text-ink/25"
                : "text-primary hover:bg-sand-200"
            }`}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </nav>
      </FadeIn>

      {/* Page indicator */}
      <FadeIn
        className="mt-2 text-center text-xs text-ink/50 sm:text-sm"
        delay={0.7}
      >
        Page {currentPage} of {totalPages}
      </FadeIn>
    </FadeIn>
  );
};

export default Courses;
