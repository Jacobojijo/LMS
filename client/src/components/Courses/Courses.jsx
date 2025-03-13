import React, { useState, useEffect } from 'react';
import languageData from '../../utility/language.json';
import uniqueData from '../../utility/unique.json';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInUp, ScaleIn, FadeIn } from '../../utility/MotionComponents';

const Courses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const cardsPerPage = 6;
  
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
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Pagination navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setExpandedCards({}); // Reset expanded state when changing page
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setExpandedCards({}); // Reset expanded state when changing page
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Get the unique description content for a language
  const getUniqueContent = (language) => {
    const uniqueDesc = uniqueData.languages[language.title]?.unique || "";
    
    if (!expandedCards[language.title]) {
      // Show only first paragraph when not expanded
      const firstParagraph = uniqueDesc.split('\n\n')[0];
      return firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph;
    }
    
    return uniqueDesc;
  };

  // Generate page numbers
  const displayPageNumbers = () => {
    const visiblePageNumbers = windowWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + visiblePageNumbers - 1);
    
    // Adjust start page if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - visiblePageNumbers + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Render CTA based on language
  const renderCTA = (language) => {
    if (language.title === "Luo") {
      return (
        <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded-md transition-colors duration-300 flex items-center ml-4">
          <span className="mr-1 relative">
            <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </span>
          INTAKE ONGOING: REGISTER
        </button>
      );
    } else {
      return (
        <button className="bg-gray-500 text-white text-xs font-bold py-2 px-3 rounded-md ml-4 opacity-80 cursor-not-allowed">
          COMING SOON
        </button>
      );
    }
  };

  return (
    <FadeIn className="w-full bg-teal-50 py-12 px-4" delay={0.1}>
      <div className={`max-w-6xl mx-auto grid ${getGridColumns()} gap-4 md:gap-6`}>
        {currentCards.map((language, index) => (
          <FadeInUp 
            key={index} 
            delay={0.1 + index * 0.1} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-40 sm:h-48 overflow-hidden p-4 sm:p-6 pb-2 rounded-lg">
              <ScaleIn delay={0.2 + index * 0.1}>
                <img
                  src={language.imageurl}
                  alt={`${language.title} language class`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </ScaleIn>
            </div>
            <div className="p-4 sm:p-6">
              <FadeInUp delay={0.3 + index * 0.05}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{language.title} Classes</h2>
              </FadeInUp>
              
              {/* Original description from language.json */}
              <FadeInUp delay={0.4 + index * 0.05}>
                <div className="bg-gray-50 p-3 rounded-md mb-3 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 italic">
                    {language.description}
                  </p>
                </div>
              </FadeInUp>
              
              {/* Unique description from unique.json */}
              <FadeInUp delay={0.5 + index * 0.05}>
                <div className="text-sm sm:text-base text-gray-700 mb-4 prose prose-sm">
                  {getUniqueContent(language).split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-2 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </FadeInUp>
              
              <FadeInUp delay={0.6 + index * 0.05}>
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0">
                    <button 
                      className="flex items-center text-blue-600 font-medium text-sm sm:text-base"
                      onClick={() => toggleCardExpansion(language.title)}
                    >
                      {expandedCards[language.title] ? 'SHOW LESS' : 'READ MORE'}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 sm:h-5 sm:w-5 ml-1 transition-transform ${expandedCards[language.title] ? 'rotate-90' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Custom CTA based on language */}
                  <div className="flex-shrink-0">
                    {renderCTA(language)}
                  </div>
                </div>
              </FadeInUp>
            </div>
          </FadeInUp>
        ))}
      </div>

      {/* Pagination Controls */}
      <FadeIn className="flex justify-center mt-8 items-center" delay={0.6}>
        <button 
          onClick={goToPreviousPage} 
          disabled={currentPage === 1}
          className={`p-2 rounded-md mr-2 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* First page if not visible in current range */}
        {displayPageNumbers()[0] > 1 && (
          <>
            <button 
              onClick={() => goToPage(1)} 
              className={`px-3 py-1 mx-1 rounded-md ${currentPage === 1 ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
            >
              1
            </button>
            {displayPageNumbers()[0] > 2 && <span className="mx-1">...</span>}
          </>
        )}
        
        {/* Page numbers */}
        {displayPageNumbers().map(pageNumber => (
          <button 
            key={pageNumber} 
            onClick={() => goToPage(pageNumber)}
            className={`px-3 py-1 mx-1 rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
          >
            {pageNumber}
          </button>
        ))}
        
        {/* Last page if not visible in current range */}
        {displayPageNumbers()[displayPageNumbers().length - 1] < totalPages && (
          <>
            {displayPageNumbers()[displayPageNumbers().length - 1] < totalPages - 1 && <span className="mx-1">...</span>}
            <button 
              onClick={() => goToPage(totalPages)} 
              className={`px-3 py-1 mx-1 rounded-md ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          onClick={goToNextPage} 
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ml-2 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </FadeIn>
      
      {/* Page indicator */}
      <FadeIn className="text-center mt-2 text-sm text-gray-600" delay={0.7}>
        Page {currentPage} of {totalPages}
      </FadeIn>
    </FadeIn>
  );
};

export default Courses;
