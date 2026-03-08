const Footer = () => {
  return (
    <footer className="w-full border-t border-black/10 px-4 py-8 dark:border-white/10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-center text-sm font-light text-black/55 dark:text-white/55 md:text-left">
          Made by{' '}
          <a
            href="https://devabdullah.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-black transition-colors hover:text-black/60 dark:text-white dark:hover:text-white/70"
          >
            Abdullah Ahmad
          </a>
        </p>

        <div className="flex items-center gap-5 text-sm text-black/45 dark:text-white/45">
          <a
            href="https://github.com/MAbdullahAhmad"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer transition-colors hover:text-black dark:hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/m-abdullah-ahmad/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer transition-colors hover:text-black dark:hover:text-white"
          >
            LinkedIn
          </a>
          <a
            href="https://www.upwork.com/freelancers/abdullah123"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer transition-colors hover:text-black dark:hover:text-white"
          >
            Upwork
          </a>
        </div>
      </div>

      <div className="mt-6 border-t border-black/10 pt-4 text-center dark:border-white/10">
        <a
          href="https://github.com/YearCountdown/YearCountdown.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-xs uppercase tracking-[0.24em] text-black/35 transition-colors hover:text-black/60 dark:text-white/35 dark:hover:text-white/60"
        >
          View Source on GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
