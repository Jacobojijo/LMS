"use client";

import React, { useState, useEffect } from 'react';

const MaintenancePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set return date to Monday 12:00pm EAT
  const getNextMondayNoon = () => {
    const now = new Date();
    const nextMonday = new Date(now);
    
    // Find next Monday
    const daysUntilMonday = (1 - now.getDay() + 7) % 7 || 7;
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    
    // Set to 12:00 PM EAT (UTC+3)
    nextMonday.setHours(12, 0, 0, 0);
    
    return nextMonday;
  };

  const returnDate = getNextMondayNoon();

  // Update time and countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const timeDiff = returnDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [returnDate]);

  // Floating animation keyframes
  const floatingAnimation = {
    animation: 'float 3s ease-in-out infinite',
  };

  const pulseAnimation = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .8;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto text-center">
        {/* Main Icon with floating animation */}
        <div className="mb-8" style={floatingAnimation}>
          <div className="inline-block p-6 bg-white rounded-full shadow-2xl">
            <div className="text-6xl">🏗️</div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          We're Improving Your Experience
        </h1>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-8"></div>

        {/* Subtitle */}
        <p className="text-gray-600 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Heritage Language School is currently undergoing scheduled maintenance to enhance 
          our platform and bring you an even better learning experience.
        </p>

        {/* Feature cards showing what's being improved */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors duration-300 mb-2">
              Enhanced Learning
            </h3>
            <p className="text-gray-600">
              Upgrading our course modules for better structured learning
            </p>
            <div className="mt-4 w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors duration-300 mb-2">
              Better Tracking
            </h3>
            <p className="text-gray-600">
              Improving our progress monitoring and analytics system
            </p>
            <div className="mt-4 w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
            <div className="text-3xl mb-4">🌏</div>
            <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors duration-300 mb-2">
              Cultural Experience
            </h3>
            <p className="text-gray-600">
              Enhancing our culturally rooted learning features
            </p>
            <div className="mt-4 w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
          </div>
        </div>

        {/* Status indicator with pulse animation */}
        <div className="flex items-center justify-center mb-8">
          <div 
            className="w-3 h-3 bg-green-500 rounded-full mr-3"
            style={pulseAnimation}
          ></div>
          <span className="text-gray-600 font-medium">
            Maintenance in Progress - All systems will return shortly
          </span>
        </div>

        {/* Expected return time with countdown */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-indigo-600 mb-4">Expected Return</h3>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            Monday, 12:00 PM EAT
          </p>
          
          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-indigo-600">{timeRemaining.days}</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-indigo-600">{timeRemaining.hours}</div>
              <div className="text-sm text-gray-600">Hours</div>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-indigo-600">{timeRemaining.minutes}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-indigo-600">{timeRemaining.seconds}</div>
              <div className="text-sm text-gray-600">Seconds</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Current time: {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Contact information */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Need immediate assistance? Our support team is still available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:heritagelanguageschool@gmail.com"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-shadow duration-300 inline-flex items-center gap-2"
            >
              <span>📧</span>
              Email Support
            </a>
            <a 
              href="tel:+254746426925"
              className="border-2 border-indigo-600 text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-indigo-50 transition-colors duration-300 inline-flex items-center gap-2"
            >
              <span>📞</span>
              Call +254746426925
            </a>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-16 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <p className="text-indigo-600 font-medium mb-2">
            Thank you for your patience
          </p>
          <p className="text-gray-600">
            We're working hard to make Heritage Language School even better for preserving 
            and celebrating your ancestral languages. The wait will be worth it!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;