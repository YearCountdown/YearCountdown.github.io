import { Link } from 'react-router-dom';

import HomeSectionBlock, { ModeGrid, TwoColumnList } from './HomeSectionBlock';
import IPhoneLockscreenVector from './IPhoneLockscreenVector';
import { FEATURE_NAV_LINKS } from '../../lib/navigation';
import { getSharedViewUrl } from '../../lib/viewSettings';
import { SAMPLE_ITEMS } from '../../lib/samples';
import { VIEW_BRAND_TONE_MODES } from '../../lib/viewColors';

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
  {
    id: 'all',
    title: 'All',
    to: '/view/all',
    body: 'A composed view that keeps days and progress in a reserved top strip while the full lower canvas becomes a responsive dot field.',
  },
];

const HOMEPAGE_GALLERY_SAMPLE_IDS = [
  'all-mint-topfield',
  'countdown-clean',
  'pie-circle-outline',
  'progress-line',
  'dots-circles',
  'all-composed',
  'pie-violet-rectangle',
  'progress-emerald-field',
];

const GALLERY_ITEMS = HOMEPAGE_GALLERY_SAMPLE_IDS
  .map((sampleId) => SAMPLE_ITEMS.find((item) => item.id === sampleId))
  .filter(Boolean);

const GALLERY_FRAME_CLASSES = {
  portrait: {
    card: 'w-[12.5rem] sm:w-[14rem] lg:w-[15.5rem]',
    preview: 'h-[22rem] sm:h-[24rem] lg:h-[26rem]',
  },
  square: {
    card: 'w-[22rem] sm:w-[24rem] lg:w-[26rem]',
    preview: 'h-[22rem] sm:h-[24rem] lg:h-[26rem]',
  },
  landscape: {
    card: 'w-[28rem] sm:w-[32rem] lg:w-[38rem]',
    preview: 'h-[22rem] sm:h-[24rem] lg:h-[26rem]',
  },
};

const getGalleryPreviewUrl = ({ id, viewId, viewState, theme }) => {
  const baseUrl = getSharedViewUrl({
    pathname: `/view/${viewId}`,
    origin: '',
    theme,
    viewId,
    viewState,
    colors: {
      primary: viewState.primary,
      alternate: viewState.alternate,
      brandToneMode: VIEW_BRAND_TONE_MODES.AUTO,
      textToneMode: VIEW_BRAND_TONE_MODES.AUTO,
    },
  });

  const url = new URL(baseUrl, 'https://yearcountdown.github.io');
  const params = url.searchParams;
  params.set('embed', 'true');
  params.set('theme', theme);
  params.set('primary', viewState.primary);
  params.set('alternate', viewState.alternate);
  params.set('logo', 'false');
  params.set('_gallery', id);

  Object.entries(viewState).forEach(([key, value]) => {
    if (value === undefined || value === null || typeof value === 'object') {
      return;
    }

    params.set(key, String(value));
  });

  return `${url.pathname}?${params.toString()}`;
};

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
    title: 'Choose Your View',
    body: 'Open the YearCountdown view you want, adjust its settings, then use the gear panel to copy the wallpaper URL for that exact configuration. On iPhone, the app now seeds the wallpaper size from the detected device class.',
  },
  {
    title: 'Build A Daily Wallpaper Shortcut',
    body: 'In Shortcuts, create a new shortcut and add these actions in order: URL, Get Contents of URL, then Set Wallpaper. Paste the copied wallpaper URL into the URL action.',
  },
  {
    title: 'Configure And Test It',
    body: 'In Set Wallpaper, choose Lock Screen, Home Screen, or both. Open Show More and turn off Show Preview, then run the shortcut once to confirm the wallpaper updates correctly.',
  },
  {
    title: 'Automate It Daily',
    body: 'Open Automation, create a personal Time of Day automation, set it to Daily, add Run Shortcut, choose your wallpaper shortcut, then turn off Ask Before Running.',
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
    title: 'Practical Notes',
    items: [
      'Apple Shortcuts can run Time of Day automations automatically without asking.',
      'The wallpaper URL is a PageShot image of the embed view, not the raw HTML route itself.',
      'The copied wallpaper URL preserves the active theme, colors, view-specific settings, and iPhone-safe spacing unless you override them manually.',
    ],
  },
];

const HomepageSections = () => {
  return (
    <>
      <HomeSectionBlock
        id="gallery"
        eyebrow="Gallery"
        title="Check out how other users are creating yearly countdown views."
        body="A curated stream of wallpaper-ready compositions built from the same live views, embed settings, and export links used throughout the app."
        shapeVariant="rhythm"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.28fr)_minmax(0,0.72fr)] lg:gap-12">
          <aside data-home-reveal className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.34em] text-black/42 dark:text-white/42">View Options</p>
              <ul className="space-y-2">
                {FEATURE_NAV_LINKS.map((link) => (
                  <li key={link.to} className="text-sm uppercase tracking-[0.24em] text-black/58 dark:text-white/58 sm:text-base">
                    {link.label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="max-w-xs text-sm leading-7 text-black/58 dark:text-white/58 sm:text-base sm:leading-8">
              Scroll sideways to compare different shapes, densities, and layouts. Every frame here is generated from the same
              wallpaper export flow used in the settings gear.
            </p>
            <div className="pt-1">
              <Link
                to="/samples"
                className="inline-flex items-center rounded-full border border-black/12 px-5 py-3 text-xs uppercase tracking-[0.24em] text-black transition-colors hover:bg-black hover:text-white dark:border-white/12 dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                View All Samples
              </Link>
            </div>
          </aside>

          <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max snap-x snap-mandatory gap-5 sm:gap-6">
              {GALLERY_ITEMS.map((item) => (
                (() => {
                  const frame = GALLERY_FRAME_CLASSES[item.frame ?? 'portrait'];

                  return (
                <article
                  key={item.id}
                  data-home-card
                  className={`group ${frame.card} shrink-0 snap-start overflow-hidden border border-black/8 bg-stone-100 transition-transform duration-300 hover:-translate-y-1 dark:border-white/8 dark:bg-zinc-950`}
                >
                  <Link to={`/view/${item.viewId}`} className="block">
                    <div className={`${frame.preview} overflow-hidden bg-black/4 dark:bg-white/[0.04]`}>
                      <iframe
                        src={getGalleryPreviewUrl(item)}
                        title={`${item.label} gallery preview`}
                        loading="lazy"
                        className="h-full w-full border-0 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-black/38 dark:text-white/38">Gallery</p>
                        <h3 className="mt-2 text-lg font-light uppercase tracking-[0.06em] text-black dark:text-white sm:text-xl">
                          {item.label}
                        </h3>
                      </div>
                      <span className="text-[0.65rem] uppercase tracking-[0.26em] text-black/35 dark:text-white/35">Open</span>
                    </div>
                  </Link>
                </article>
                  );
                })()
              ))}
            </div>
          </div>
        </div>
      </HomeSectionBlock>

      <HomeSectionBlock
        id="modes"
        eyebrow="Visualization Modes"
        title="Five readings of the same year."
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
        body="The wallpaper URL copies a PageShot image of the active embed view. On iPhone, the app seeds exact wallpaper pixels and safer edge spacing first, then lets you override them before using that URL in Shortcuts."
        shapeVariant="signal"
      >
        <div className="grid gap-px bg-black/8 dark:bg-white/8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="grid gap-px bg-black/8 dark:bg-white/8">
            <IPhoneLockscreenVector />

            <div data-home-card className="bg-stone-100 px-6 py-8 dark:bg-zinc-950 sm:px-8 sm:py-10">
              <h3 className="text-2xl font-light uppercase tracking-[0.06em] text-black dark:text-white sm:text-[1.75rem]">
                {WALLPAPER_NOTES[0].title}
              </h3>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-black/58 dark:text-white/58 sm:text-base sm:leading-8">
                {WALLPAPER_NOTES[0].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

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

            <div data-home-card className="bg-stone-100 px-6 py-8 dark:bg-zinc-950 sm:px-8 sm:py-10">
              <h3 className="text-2xl font-light uppercase tracking-[0.06em] text-black dark:text-white sm:text-[1.75rem]">
                {WALLPAPER_NOTES[1].title}
              </h3>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-black/58 dark:text-white/58 sm:text-base sm:leading-8">
                {WALLPAPER_NOTES[1].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </HomeSectionBlock>
    </>
  );
};

export default HomepageSections;
