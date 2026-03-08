import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GuestLayout from '../../layouts/GuestLayout/GuestLayout';
import HomeHero from '../../components/home/HomeHero';
import HomeIntroLoader from '../../components/home/HomeIntroLoader';
import HomepageSections from '../../components/home/HomepageSections';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray('[data-home-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 22, autoAlpha: 0, filter: 'blur(6px)' },
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray('[data-home-card]').forEach((element, index) => {
        gsap.fromTo(
          element,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: (index % 4) * 0.03,
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray('[data-home-hero-shape]').forEach((shape, index) => {
        gsap.to(shape, {
          y: index % 2 === 0 ? -12 : 10,
          x: index % 2 === 0 ? 8 : -8,
          rotation: index % 2 === 0 ? 8 : -8,
          duration: 3 + index * 0.15,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      gsap.utils.toArray('section').forEach((section, index) => {
        const localShapes = section.querySelectorAll('[data-section-shape]');

        if (localShapes.length) {
          gsap.fromTo(
            localShapes,
            { y: 16, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              ease: 'power2.out',
              stagger: 0.07,
              scrollTrigger: {
                trigger: section,
                start: 'top 86%',
              },
            },
          );

          gsap.to(localShapes, {
            y: index % 2 === 0 ? -8 : 8,
            x: index % 2 === 0 ? 5 : -5,
            rotation: index % 2 === 0 ? 6 : -6,
            duration: 2.7,
            ease: 'sine.inOut',
            stagger: 0.08,
            repeat: -1,
            yoyo: true,
          });
        }

        const wallpaperAccents = section.querySelectorAll('[data-wallpaper-accent]');
        if (wallpaperAccents.length) {
          gsap.fromTo(
            wallpaperAccents,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: 'power2.out',
              stagger: 0.05,
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
              },
            },
          );

          gsap.to(wallpaperAccents, {
            y: index % 2 === 0 ? -10 : 10,
            x: index % 2 === 0 ? 6 : -6,
            rotation: index % 2 === 0 ? 5 : -5,
            duration: 3.2,
            ease: 'sine.inOut',
            stagger: 0.09,
            repeat: -1,
            yoyo: true,
          });
        }

        const wallpaperDevice = section.querySelector('[data-wallpaper-device]');
        if (wallpaperDevice) {
          gsap.fromTo(
            wallpaperDevice,
            { autoAlpha: 0, y: 22, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 84%',
              },
            },
          );

          gsap.to(wallpaperDevice, {
            y: -8,
            duration: 3.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        }

        const wallpaperScreenShapes = section.querySelectorAll('[data-wallpaper-screen-shape]');
        if (wallpaperScreenShapes.length) {
          gsap.to(wallpaperScreenShapes, {
            y: index % 2 === 0 ? -6 : 6,
            x: index % 2 === 0 ? 3 : -3,
            scale: 1.02,
            duration: 4,
            ease: 'sine.inOut',
            stagger: 0.08,
            repeat: -1,
            yoyo: true,
          });
        }
      });
    }, pageRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <GuestLayout>
      <div ref={pageRef} className="relative w-full">
        <HomeIntroLoader />
        <HomeHero />
        <HomepageSections />
      </div>
    </GuestLayout>
  );
};

export default Home;
