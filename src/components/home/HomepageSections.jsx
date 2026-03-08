import HomeSectionBlock, { ModeGrid, TwoColumnList } from './HomeSectionBlock';

const MODE_ITEMS = [
  {
    title: 'Countdown',
    to: '/view/countdown',
    body: 'A precise 2 by 2 reading of the time left in the current year, with responsive layout modes and query-driven display controls.',
  },
  {
    title: 'Dots',
    to: '/view/dots',
    body: 'A field of daily marks for the year, with adjustable shapes, spacing, and outer layout control for centered or embedded displays.',
  },
  {
    title: 'Pie',
    to: '/view/pie',
    body: 'A radial year-progress view that can stay centered or expand to the full remaining canvas, with circular or clipped rectangular geometry.',
  },
  {
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

const WALLPAPER_COLUMNS = [
  {
    title: 'How It Works',
    items: [
      'Choose a preferred route and visual mode first, then refine its settings from the gear in the bottom-right corner.',
      'Use the copied embed link when you want a cleaner display without header and settings chrome.',
      'Save that route on a device or automation flow so the same view can be reopened consistently.',
    ],
  },
  {
    title: 'Practical Setup',
    items: [
      'Open the chosen route from a shortcut, browser bookmark, or automation entry point on your device.',
      'Capture the screen when needed or keep the route open on a dedicated display for a live year view.',
      'Select the visualization that matches the display surface: Dots and Pie for composition, Progress for large ambient surfaces.',
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
      >
        <ModeGrid items={MODE_ITEMS} />
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
        title="Use any route as a persistent display."
        body="The homepage introduces the system, but the destination routes are the real display surfaces. Once a route is configured, it can be reused directly on a phone, tablet, or dedicated screen."
      >
        <TwoColumnList columns={WALLPAPER_COLUMNS} />
      </HomeSectionBlock>
    </>
  );
};

export default HomepageSections;
