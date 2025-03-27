import React from "react";
import BgImage from '../../assets/bg.png'
import { Hero, Courses, Features } from "../../components";

const Home = () => {
  const bgStyle = {
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  return (
    <>
      <div style={bgStyle}>
        <Hero />
      </div>
      <div id="courses">
        <Courses />
      </div>
      <div id="features">
        <Features />
      </div>
    </>
  );
};

export default Home;