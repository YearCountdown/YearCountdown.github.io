import HomeSectionBlock, { ModeGrid, TwoColumnList } from './HomeSectionBlock';
import IPhoneLockscreenVector from './IPhoneLockscreenVector';

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

const HomepageSections = () => {
  return (
    <>
      <HomeSectionBlock
        id="modes"
        eyebrow="Visualization Modes"
        title="Four readings of the same year."
        body="Each route reduces the same clock into a different visual system. Pick the interpretation that best matches the device, display surface, or kind of attention you want to bring to the year."
        shapeVariant="frames"
      >
        <ModeGrid items={MODE_ITEMS} />
      </HomeSectionBlock>

      <HomeSectionBlock
        id="controls"
        eyebrow="Customization"
        title="Quiet controls, view by view."
        body="The shell stays minimal, but each view exposes its own controls through a single settings pattern. Layout, density, precision, and presentation stay local to the active route."
        shapeVariant="rhythm"
      >
        <TwoColumnList columns={CONTROL_COLUMNS} />
      </HomeSectionBlock>

      <HomeSectionBlock
        id="use-cases"
        eyebrow="Use Cases"
        title="Built for private screens and shared surfaces."
        body="YearCountdown works as a personal reference, an ambient yearly display, or a lightweight planning surface. The same routes scale from small devices to large canvases without changing the core model."
        shapeVariant="arcs"
      >
        <TwoColumnList columns={USE_CASE_COLUMNS} />
      </HomeSectionBlock>

      <HomeSectionBlock
        id="setup"
        eyebrow="Wallpaper And Setup"
        title="Use YearCountdown on an iPhone lock screen."
        body="A configured view route can become a daily lock screen wallpaper or a live display. The cleanest path is to use an embed link and automate how that route is opened."
        shapeVariant="signal"
      >
        <div className="grid gap-px bg-black/8 dark:bg-white/8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <IPhoneLockscreenVector />

          <div className="grid gap-px bg-black/8 dark:bg-white/8">
            <div className="bg-stone-100 px-6 py-8 dark:bg-zinc-950 sm:px-8 sm:py-10">
              <ol className="space-y-6">
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
