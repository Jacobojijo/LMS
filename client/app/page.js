import { Courses, Features, Hero, MaintenancePage } from "@/components";
import BgImage from "@/public/assets/bg.png";

export default function Home() {
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
}
