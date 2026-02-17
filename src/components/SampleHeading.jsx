import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SampleHeading = () => {
  useGSAP(() => {
    gsap.from(".title", { opacity: 0, y: -50, duration: 1 });
  }, []);
  return <h1 className="title text-4xl font-bold text-primary">Year Countdown</h1>;
};

export default SampleHeading;