import { useTheme } from '../../context/ThemeContext';
import { BRAND_TEXT, getBrandAsset } from '../../lib/brand';

const footerLinks = [
  { label: 'Live', href: 'https://yearcountdown.github.io' },
  { label: 'Vercel', href: 'https://theyearcountdown.vercel.app/' },
  { label: 'Source', href: 'https://github.com/YearCountdown/YearCountdown.github.io' },
  { label: 'License', href: 'https://github.com/YearCountdown/YearCountdown.github.io/blob/main/LICENSE' },
  { label: 'Developer', href: 'https://devabdullah.com' },
  { label: 'GitHub', href: 'https://github.com/MAbdullahAhmad' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/m-abdullah-ahmad/' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/abdullah123' },
];

const Footer = () => {
  const { theme } = useTheme();
  const logoSrc = getBrandAsset(theme, 'logo');

  return (
    <footer className="w-full border-t border-black/10 px-4 py-10 dark:border-white/10 sm:px-6 lg:px-10">
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-4">
            <img src={logoSrc} alt="" className="h-10 w-auto object-contain sm:h-12" />
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
                {BRAND_TEXT}
              </p>
              <p className="mt-2 text-sm text-black/58 dark:text-white/58">
                A minimal set of views for reading the year as time, shape, and progress.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-black/52 transition-colors hover:text-black dark:text-white/52 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
