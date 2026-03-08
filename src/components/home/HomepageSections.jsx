import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HomeSectionBlock, { ModeGrid, TwoColumnList } from './HomeSectionBlock';

gsap.registerPlugin(ScrollTrigger);

const MODE_ITEMS = [
  {
    id: 'countdown',
    title: 'Countdown',
    to: '/view/countdown',
    body: 'A precise 2 by 2 reading of the time left in the current year, with responsive layout modes and query-driven display controls.',
  },
  {
    id: 'dots',
    title: 'Dots',
    to: '/view/dots',
    body: 'A field of daily marks for the year, with adjustable shapes, spacing, and outer layout control for centered or embedded displays.',
  },
  {
    id: 'pie',
    title: 'Pie',
    to: '/view/pie',
    body: 'A radial year-progress view that can stay centered or expand to the full remaining canvas, with circular or clipped rectangular geometry.',
  },
  {
    id: 'progress',
    title: 'Progress',
    to: '/view/progress',
    body: 'A split-field progress surface or minimal line mode that turns the entire view into a clean reading of elapsed and remaining time.',
  },
];

const CONTROL_COLUMNS = [
  {
    title: 'Per View Controls',
    items: [
      'Adjust spacing, shapes, display density, stroke logic, decimal precision, and layout mode per visualization.',
      'Keep every view shareable through the query string instead of hidden local state.',
      'Move between centered and full-canvas presentations without changing the core route structure.',
    ],
  },
  {
    title: 'Theme And Sharing',
    items: [
      'Switch between light and dark themes while preserving the same route-driven shell.',
      'Copy embed-ready links that reproduce the current view and its active settings.',
      'Use minimal shell chrome so the settings gear stays secondary to the time itself.',
    ],
  },
];

const USE_CASE_COLUMNS = [
  {
    title: 'Personal And Ambient',
    items: [
      'A homepage entry point before selecting a full-screen view for a desktop or wall display.',
      'A quiet yearly reference for people who prefer visual rather than calendar-based progress tracking.',
      'A phone or tablet display source when paired with a saved route and stable visual mode.',
    ],
  },
  {
    title: 'Planning And Work',
    items: [
      'A shared year-progress reference for a room display or planning screen.',
      'A lightweight backdrop for yearly milestones, deadlines, or reflective reviews.',
      'A visual anchor for teams that want the passage of the year visible without dashboard clutter.',
    ],
  },
];

const WALLPAPER_STEPS = [
  {
    title: 'Open Shortcuts',
    body: 'Use the Shortcuts app on iPhone and create a personal automation that runs daily.',
  },
  {
    title: 'Set A Daily Trigger',
    body: 'Choose a time such as 12:01 AM so the wallpaper can be refreshed with the next state of the year.',
  },
  {
    title: 'Open A Saved View URL',
    body: 'Use your configured YearCountdown route, ideally the copied embed link for a cleaner fullscreen display.',
  },
  {
    title: 'Capture Or Keep Live',
    body: 'Take a screenshot for a lock screen wallpaper, or leave the page open on a dedicated device for a persistent year display.',
  },
];

const WALLPAPER_NOTES = [
  {
    title: 'Best Routes',
    items: [
      'Dots and Pie work well when the wallpaper needs stronger composition.',
      'Progress works well for wide ambient surfaces and simple percentage reads.',
      'Countdown is strongest when the digits themselves should stay central.',
    ],
  },
  {
    title: 'Why Embed Links Matter',
    items: [
      'They remove header and settings chrome.',
      'They preserve theme and view-specific settings.',
      'They turn the route into a cleaner capture target for wallpapers.',
    ],
  },
];

const ModePreview = ({ activeMode }) => {
  const previews = {
    countdown: (
      <>
        <div className="grid grid-cols-2 gap-1">
          <span className="h-4 w-4 border border-current" />
          <span className="h-4 w-4 border border-current" />
          <span className="h-4 w-4 border border-current" />
          <span className="h-4 w-4 border border-current" />
        </div>
        <span className="text-[0.6rem] uppercase tracking-[0.28em]">00:00</span>
      </>
    ),
    dots: (
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className={`h-2.5 w-2.5 rounded-full border border-current ${index < 7 ? 'bg-current' : ''}`} />
        ))}
      </div>
    ),
    pie: (
      <div className="relative h-10 w-10 rounded-full border border-current">
        <span className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(currentColor 0 63%, transparent 63% 100%)' }} />
        <span className="absolute inset-[0.45rem] rounded-full bg-stone-100 dark:bg-zinc-950" />
      </div>
    ),
    progress: (
      <div className="flex h-3 w-16 overflow-hidden border border-current">
        <span className="h-full w-[58%] bg-current" />
        <span className="h-full flex-1" />
      </div>
    ),
  };

  return previews[activeMode] ?? null;
};

const HomepageSections = () => {
  const [activeMode, setActiveMode] = useState('countdown');
  const modeSectionRef = useRef(null);

  useEffect(() => {
    if (!modeSectionRef.current) {
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: modeSectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => setActiveMode('countdown'),
      onLeaveBack: () => setActiveMode('countdown'),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    const elements = gsap.utils.toArray('[data-mode-flyin]');

    if (!elements.length) {
      return undefined;
    }

    gsap.killTweensOf(elements);
    gsap.set(elements, { autoAlpha: 0 });

    const timeline = gsap.timeline();
    timeline.fromTo(
      elements,
      {
        x: (index) => (index === 0 ? -48 : 48),
        autoAlpha: 0,
        scale: 0.85,
      },
      {
        x: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.04,
      },
    );

    return () => {
      timeline.kill();
    };
  }, [activeMode]);

  return (
    <>
      <HomeSectionBlock
        id="modes"
        eyebrow="Visualization Modes"
        title="Four readings of the same year."
        body="Each route reduces the same clock into a different visual system. Pick the interpretation that best matches the device, display surface, or kind of attention you want to bring to the year."
      >
        <div ref={modeSectionRef} className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center lg:flex">
            <div data-mode-flyin className="ml-[-2rem] flex h-20 w-20 items-center justify-center text-black/22 dark:text-white/22">
              <ModePreview activeMode={activeMode} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center lg:flex">
            <div data-mode-flyin className="mr-[-2rem] flex h-20 w-20 items-center justify-center text-black/22 dark:text-white/22">
              <ModePreview activeMode={activeMode} />
            </div>
          </div>

          <ModeGrid
            items={MODE_ITEMS}
            activeMode={activeMode}
            onModeEnter={setActiveMode}
          />
        </div>
      </HomeSectionBlock>

      <HomeSectionBlock
        id="controls"
        eyebrow="Customization"
        title="Quiet controls, view by view."
        body="The shell stays minimal, but each view exposes its own controls through a single settings pattern. Layout, density, precision, and presentation stay local to the active route."
      >
        <TwoColumnList columns={CONTROL_COLUMNS} />
      </HomeSectionBlock>

      <HomeSectionBlock
        id="use-cases"
        eyebrow="Use Cases"
        title="Built for private screens and shared surfaces."
        body="YearCountdown works as a personal reference, an ambient yearly display, or a lightweight planning surface. The same routes scale from small devices to large canvases without changing the core model."
      >
        <TwoColumnList columns={USE_CASE_COLUMNS} />
      </HomeSectionBlock>

      <HomeSectionBlock
        id="setup"
        eyebrow="Wallpaper And Setup"
        title="Use YearCountdown on an iPhone lock screen."
        body="A configured view route can become a daily lock screen wallpaper or a live display. The cleanest path is to use an embed link and automate how that route is opened."
      >
        <div className="grid gap-px bg-black/8 dark:bg-white/8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="relative overflow-hidden bg-stone-100 px-6 py-8 dark:bg-zinc-950 sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div data-wallpaper-shape className="absolute bottom-6 left-6 h-14 w-8 rounded-[1rem] border border-black/10 dark:border-white/10" />
              <div data-wallpaper-shape className="absolute bottom-10 left-16 h-px w-12 bg-black/10 dark:bg-white/10" />
              <div data-wallpaper-shape className="absolute bottom-8 right-10 h-8 w-8 border border-black/10 dark:border-white/10" />
              <div data-wallpaper-shape className="absolute bottom-6 right-20 h-0 w-0 border-b-[18px] border-l-[12px] border-r-[12px] border-b-black/10 border-l-transparent border-r-transparent dark:border-b-white/10" />
            </div>

            <ol className="relative z-10 space-y-6">
              {WALLPAPER_STEPS.map((step, index) => (
                <li key={step.title} data-home-card className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-xs uppercase tracking-[0.24em] text-black/55 dark:border-white/10 dark:text-white/55">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-xl font-light uppercase tracking-[0.06em] text-black dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-black/58 dark:text-white/58 sm:text-base sm:leading-8">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-px bg-black/8 dark:bg-white/8">
            {WALLPAPER_NOTES.map((column) => (
              <div key={column.title} data-home-card className="bg-stone-100 px-6 py-8 dark:bg-zinc-950 sm:px-8 sm:py-10">
                <h3 className="text-2xl font-light uppercase tracking-[0.06em] text-black dark:text-white sm:text-[1.75rem]">
                  {column.title}
                </h3>
                <ul className="mt-6 space-y-3 text-sm leading-7 text-black/58 dark:text-white/58 sm:text-base sm:leading-8">
                  {column.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </HomeSectionBlock>
    </>
  );
};

export default HomepageSections;
