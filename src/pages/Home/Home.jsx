import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GuestLayout from '../../layouts/GuestLayout/GuestLayout';
import HomeHero from '../../components/home/HomeHero';
import HomepageSections from '../../components/home/HomepageSections';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray('[data-home-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 22, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray('[data-home-shape]').forEach((shape, index) => {
        gsap.to(shape, {
          y: index % 2 === 0 ? -16 : 14,
          x: index % 2 === 0 ? 10 : -8,
          rotation: index % 2 === 0 ? 8 : -10,
          duration: 2.8 + index * 0.18,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      gsap.utils.toArray('section').forEach((section, index) => {
        const localShapes = section.querySelectorAll('[data-section-shape]');

        if (!localShapes.length) {
          return;
        }

        gsap.fromTo(
          localShapes,
          { y: 12, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
            },
          },
        );

        gsap.to(localShapes, {
          y: index % 2 === 0 ? -10 : 10,
          rotation: index % 2 === 0 ? 6 : -6,
          duration: 3.1,
          ease: 'sine.inOut',
          stagger: 0.12,
          repeat: -1,
          yoyo: true,
        });
      });
    }, pageRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <GuestLayout>
      <div ref={pageRef} className="relative w-full">
        <HomeHero />
        <div className="pointer-events-none absolute inset-x-0 top-[105vh] h-px bg-black/8 dark:bg-white/8" />
        <HomepageSections />
      </div>
    </GuestLayout>
  );
};

export default Home;
