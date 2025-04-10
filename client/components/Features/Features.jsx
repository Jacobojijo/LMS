"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SlideLeft } from "../../utility/animation";

const FeatureData = [
  {
    id: 1,
    title: "Structured Modular Learning",
    desc: "Our curriculum is thoughtfully divided into clearly defined modules, making it easier for students of all levels to progress confidently.",
    icon: "📚",
  },
  {
    id: 2,
    title: "Online Course Tracking",
    desc: "Monitor your progress in real-time, access learning materials anywhere, and track your improvement with our dedicated platform.",
    icon: "📊",
  },
  {
    id: 3,
    title: "Continuous Assessments",
    desc: "Regular quizzes, comprehensive tests, and examinations help reinforce learning and identify areas for improvement quickly.",
    icon: "✅",
  },
  {
    id: 4,
    title: "Enhanced Engagement",
    desc: "Live interactive sessions, structured evaluations, and dynamic lesson plans tailored to different learning styles.",
    icon: "🔄",
  },
  {
    id: 5,
    title: "Culturally Rooted Learning",
    desc: "Experience cultural immersion, contextual learning, and community connection while mastering your ancestral language.",
    icon: "🌏",
  },
];

const Features = () => {
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [position, setPosition] = useState(0);
  
  // Create a triple-length array for truly continuous carousel
  const tripleFeatureData = [...FeatureData, ...FeatureData, ...FeatureData];
  
  // Calculate dimensions and visible cards based on screen size
  useEffect(() => {
    const calculateDimensions = () => {
      if (carouselRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const firstCard = carouselRef.current.querySelector('.feature-card');
        
        if (firstCard) {
          const cardFullWidth = firstCard.offsetWidth + 32; // Card width + margins
          setCardWidth(cardFullWidth);
          
          // Calculate how many cards should be visible
          let visible = 1;
          if (containerWidth >= 1024) {
            visible = 3; // Large screens
          } else if (containerWidth >= 768) {
            visible = 2; // Medium screens
          }
          setVisibleCards(visible);
        }
      }
    };
    
    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  }, []);

  // Truly continuous scrolling animation
  useEffect(() => {
    if (!cardWidth) return;
    
    const speed = 1; // pixels per frame
    let animationId;
    let currentPosition = position;
    
    const animate = () => {
      if (!isHovering && carouselRef.current) {
        currentPosition += speed;
        
        // Implement truly continuous scrolling with seamless looping
        const singleSetWidth = cardWidth * FeatureData.length;
        
        // When we've scrolled one full set of cards, reposition to the middle set
        // This creates the illusion of infinite scrolling
        if (currentPosition >= singleSetWidth * 2) {
          currentPosition = singleSetWidth;
          // Apply the change instantly without animation
          carouselRef.current.style.transition = 'none';
          carouselRef.current.style.transform = `translateX(-${currentPosition}px)`;
          
          // Force a reflow to ensure the transition reset is applied
          carouselRef.current.offsetHeight;
          // Restore the transition for smooth animation
          carouselRef.current.style.transition = 'transform 100ms linear';
        } else {
          // Normal smooth scrolling
          carouselRef.current.style.transform = `translateX(-${currentPosition}px)`;
        }
        
        setPosition(currentPosition);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Initialize carousel position to start at the middle set
    if (carouselRef.current && cardWidth && position === 0) {
      const middleSetPosition = cardWidth * FeatureData.length;
      carouselRef.current.style.transition = 'none';
      carouselRef.current.style.transform = `translateX(-${middleSetPosition}px)`;
      setPosition(middleSetPosition);
      
      // Force a reflow to ensure the transition reset is applied
      carouselRef.current.offsetHeight;
      carouselRef.current.style.transition = 'transform 100ms linear';
    }
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isHovering, cardWidth, position]);

  // Handle manual navigation
  const handleNavigation = (index) => {
    if (carouselRef.current) {
      // Always navigate within the middle set
      const middleSetStart = cardWidth * FeatureData.length;
      const newPosition = middleSetStart + (cardWidth * index);
      carouselRef.current.style.transition = 'transform 300ms ease-out';
      carouselRef.current.style.transform = `translateX(-${newPosition}px)`;
      setPosition(newPosition);
    }
  };

  // Get the current card index for highlighting in navigation
  const getCurrentCardIndex = () => {
    if (!cardWidth) return 0;
    
    // Calculate relative position within a single set
    const singleSetWidth = cardWidth * FeatureData.length;
    const relativePosition = position % singleSetWidth;
    
    // Get the index of the first visible card
    return Math.floor(relativePosition / cardWidth) % FeatureData.length;
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Why Choose Heritage Language School
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Reconnect with your cultural roots through our engaging, modern, and effective online platform. 
            Whether you're looking to preserve your identity, improve family communication, or reclaim your 
            indigenous language, our program blends tradition with technology.
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          className="relative w-full overflow-hidden mb-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={() => setIsHovering(true)}
          onTouchEnd={() => setTimeout(() => setIsHovering(false), 3000)}
        >
          <div className="flex overflow-hidden py-4">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-100"
              style={{ 
                willChange: 'transform',
                minWidth: 'fit-content',
              }}
            >
              {tripleFeatureData.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="feature-card flex-none px-4"
                  style={{ width: `${100 / visibleCards}%`, maxWidth: '450px', minWidth: '300px' }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group h-full">
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <span className="text-4xl mr-4">{item.icon}</span>
                        <h3 className="text-2xl font-playfair font-bold group-hover:text-indigo-600 transition-colors duration-300">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                      <div className="mt-6 w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Manual navigation controls (only visible when hovering) */}
          {isHovering && (
            <>
              <div className="flex justify-center mt-2 transition-opacity duration-300">
                {FeatureData.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(index)}
                    className={`mx-1 w-3 h-3 rounded-full transition-colors duration-300 ${
                      getCurrentCardIndex() === index
                        ? "bg-indigo-600"
                        : "bg-gray-300 hover:bg-indigo-400"
                    }`}
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </div>
            
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md text-indigo-600 hover:bg-opacity-100 transition z-10 ml-2"
                onClick={() => {
                  const currentIndex = getCurrentCardIndex();
                  const prevIndex = (currentIndex - 1 + FeatureData.length) % FeatureData.length;
                  handleNavigation(prevIndex);
                }}
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md text-indigo-600 hover:bg-opacity-100 transition z-10 mr-2"
                onClick={() => {
                  const currentIndex = getCurrentCardIndex();
                  const nextIndex = (currentIndex + 1) % FeatureData.length;
                  handleNavigation(nextIndex);
                }}
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-4 text-indigo-600">
            The Heritage Advantage
          </h3>
          <p className="text-gray-600 mb-8">
            At Heritage Language School, we blend tradition with technology. Our cutting-edge online platform, 
            comprehensive tracking tools, and passionate educators guide you every step of the way. More than just 
            a course, this is a movement to revive, preserve, and celebrate indigenous languages.
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-shadow duration-300">
            Take the First Step Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;