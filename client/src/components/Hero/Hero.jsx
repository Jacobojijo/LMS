import React from "react";
import HeroImg from '../../assets/original.png';
import { FadeInLeft, FadeInUp, SlideInRight, FadeIn } from "../../utility/MotionComponents";

const Hero = () => {
  return (
    <>
      <section className="bg-gray-100 relative">
        <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
          {/* Background Image for Small Screens */}
          <FadeIn className="absolute inset-0 md:hidden">
            <img 
              src={HeroImg} 
              alt="Language Learning Hero" 
              className="w-full h-full object-cover opacity-30 grayscale-[20%] mix-blend-luminosity"
            />
          </FadeIn>

          {/* Brand Info */}
          <FadeInLeft className="flex flex-col justify-center py-14 md:py-0 font-playfair relative z-10">
            <div className="text-center md:text-left space-y-6">
              <FadeInUp delay={0.2} className="text-5xl lg:text-6xl font-bold leading-relaxed xl:leading-normal">
                Preserve your Heritage, speak your{" "}
                <span className="text-[#854836]">Language</span>
              </FadeInUp>
              
              <FadeInUp delay={0.3} className="text-gray-900 font-semibold xl:max-w-[500px]">
                Rediscover and master your mother tongue with the premier language learning platform—where interactive and engaging lessons bring indigenous languages to life
              </FadeInUp>
              
              {/* Button Section */}
              <FadeInUp delay={0.4}>
                <button className="bg-[#854836] text-white px-6 py-3 rounded-lg">
                  Get Started
                </button>
              </FadeInUp>
            </div>
          </FadeInLeft>

          {/* Image Section for Large Screens */}
          <SlideInRight className="hidden md:flex items-center justify-center rounded-lg" duration={1}>
            <img 
              src={HeroImg} 
              alt="Language Learning Hero" 
              className="max-w-full h-auto object-cover rounded-lg shadow-lg 
                         opacity-50 grayscale-[20%]"
            />
          </SlideInRight>
        </div>
      </section>
    </>
  );
};

export default Hero;