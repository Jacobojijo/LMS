import React from 'react';
import { FadeInUp, FadeInLeft, SlideInRight, FadeIn } from '../../utility/MotionComponents';

const HeritageBanner = () => {
  const languages = ["Luo", "Swahili", "Kikuyu", "Kamba", "Maasai", "Dholuo"];
  
  return (
    <div className="relative bg-gradient-to-r from-teal-100 to-blue-200 text-gray-800 py-10 md:py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-32 md:w-64 h-32 md:h-64 rounded-full bg-teal-300 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 md:w-96 h-48 md:h-96 rounded-full bg-blue-300 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Floating language words - hidden on small screens */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        {languages.map((lang, index) => (
          <div 
            key={index}
            className="absolute text-blue-200 font-bold select-none"
            style={{
              fontSize: `${Math.random() * 2 + 2}rem`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
              opacity: Math.random() * 0.4 + 0.2
            }}
          >
            {lang}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left column: Main content */}
          <FadeInLeft delay={0.2} className="z-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-playfair leading-tight">
              Reclaim Your <span className="text-[#854836]">Heritage</span>,<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">
                Rediscover Your Roots
              </span>
            </h1>
            
            <FadeInUp delay={0.3} className="text-base sm:text-lg mb-6 text-gray-700 max-w-lg mx-auto md:mx-0">
              Language is the living museum of our ancestors' wisdom. Join us to preserve your cultural identity and pass down centuries of knowledge.
            </FadeInUp>
            
            <FadeIn delay={0.4} className="bg-white/40 backdrop-blur-sm p-4 rounded-lg border border-white/50 mb-8 shadow-sm max-w-lg mx-auto md:mx-0">
              <div className="flex items-center justify-center md:justify-start">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <p className="font-medium text-teal-800">
                  Spots Available for Luo Classes
                </p>
              </div>
              <p className="mt-2 text-gray-700 text-center md:text-left">
                Registration ongoing
              </p>
            </FadeIn>
            
            <FadeInUp delay={0.5} className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="bg-[#854836] hover:bg-[#6a392b] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Register Below
              </button>
            </FadeInUp>
          </FadeInLeft>
          
          {/* Right column: Cultural benefits */}
          <SlideInRight delay={0.2} duration={1} className="z-10 mt-6 md:mt-0">
            <div className="bg-white/40 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/50 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[#854836] text-center md:text-left">Why Learn Your Heritage Language?</h3>
              
              <div className="space-y-4">
                <FadeInUp delay={0.3} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 bg-teal-200 p-2 rounded-full mb-2 sm:mb-0 sm:mr-3">
                    <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Strengthen Family Bonds</h4>
                    <p className="text-sm text-gray-600">Connect with relatives across generations through shared language</p>
                  </div>
                </FadeInUp>
                
                <FadeInUp delay={0.4} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 bg-blue-200 p-2 rounded-full mb-2 sm:mb-0 sm:mr-3">
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Access Cultural Wisdom</h4>
                    <p className="text-sm text-gray-600">Understand proverbs, stories, and traditions in their original context</p>
                  </div>
                </FadeInUp>
                
                <FadeInUp delay={0.5} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 bg-purple-200 p-2 rounded-full mb-2 sm:mb-0 sm:mr-3">
                    <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Build Cognitive Flexibility</h4>
                    <p className="text-sm text-gray-600">Enhance problem-solving skills through multilingual thinking</p>
                  </div>
                </FadeInUp>
              </div>
              
              <FadeIn delay={0.6} className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center sm:justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
                    <span className="text-sm text-teal-700">Classes starting soon</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </SlideInRight>
        </div>
      </div>
    </div>
  );
};

export default HeritageBanner;