export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  {
    label: 'Countdown',
    to: '/view/countdown',
    title: 'Countdown',
    description: 'A focused numerical view of the year moving toward its final second.',
  },
  {
    label: 'Dots',
    to: '/view/dots',
    title: 'Dots',
    description: 'A spatial grid of days that turns the year into a quiet field of completed and remaining moments.',
  },
  {
    label: 'Pie',
    to: '/view/pie',
    title: 'Pie',
    description: 'A circular progress view for the year with a more holistic, less literal sense of time passing.',
  },
  {
    label: 'Progress',
    to: '/view/progress',
    title: 'Progress',
    description: 'An immersive linear reading of the year where the screen itself becomes the indicator.',
  },
];

export const FEATURE_NAV_LINKS = NAV_LINKS.filter((link) => link.to !== '/');
