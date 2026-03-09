import { useTheme } from '../../context/ThemeContext';
import { BRAND_TEXT, getBrandAsset } from '../../lib/brand';

const footerGroups = [
  {
    title: 'Views',
    links: [
      { label: 'Countdown', href: '/view/countdown', external: false },
      { label: 'Dots', href: '/view/dots', external: false },
      { label: 'Pie', href: '/view/pie', external: false },
      { label: 'Progress', href: '/view/progress', external: false },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub Pages', href: 'https://yearcountdown.github.io', external: true },
      { label: 'Vercel', href: 'https://theyearcountdown.vercel.app/', external: true },
      { label: 'Source', href: 'https://github.com/YearCountdown/YearCountdown.github.io', external: true },
      { label: 'License', href: 'https://github.com/YearCountdown/YearCountdown.github.io/blob/main/LICENSE', external: true },
    ],
  },
  {
    title: 'Developer',
    links: [
      { label: 'Website', href: 'https://devabdullah.com', external: true },
      { label: 'GitHub', href: 'https://github.com/MAbdullahAhmad', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/m-abdullah-ahmad/', external: true },
      { label: 'Upwork', href: 'https://www.upwork.com/freelancers/abdullah123', external: true },
    ],
  },
];

const FooterLink = ({ href, label, external }) => {
  const linkProps = external
    ? {
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {
        href,
      };

  return (
    <a
      {...linkProps}
      className="cursor-pointer text-sm text-black/54 transition-colors hover:text-black dark:text-white/54 dark:hover:text-white"
    >
      {label}
    </a>
  );
};

const Footer = () => {
  const { theme } = useTheme();
  const logoSrc = getBrandAsset(theme, 'logo');

  return (
    <footer className="w-full border-t border-black/10 px-4 py-10 dark:border-white/10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] lg:gap-16 xl:gap-24">
        <div className="max-w-md">
          <img src={logoSrc} alt="" className="h-10 w-auto object-contain sm:h-12" />
          <p className="mt-5 text-[0.65rem] uppercase tracking-[0.32em] text-black/38 dark:text-white/38">
            {BRAND_TEXT}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-black/58 dark:text-white/58">
            A minimal web project for reading the year as countdown, density, shape, and progress.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:pl-8 xl:pl-12">
          {footerGroups.map((group) => (
            <div key={group.title} className="min-w-0">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-black/38 dark:text-white/38">
                {group.title}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    external={link.external}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-black/10 pt-5 dark:border-white/10 sm:mt-12">
        <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.24em] text-black/34 dark:text-white/34 sm:flex-row sm:items-center sm:justify-between">
          <p>Designed and developed by Abdullah Ahmad</p>
          <p>YearCountdown</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
