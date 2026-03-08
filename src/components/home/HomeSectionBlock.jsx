import { Link } from 'react-router-dom';

const HomeSectionBlock = ({ id, eyebrow, title, body, children, className = '' }) => {
  return (
    <section
      id={id}
      className={`relative flex min-h-screen w-full items-center overflow-hidden px-4 py-[4.5rem] sm:px-6 sm:py-20 lg:px-10 lg:py-24 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-section-shape className="absolute left-[7%] top-[16%] h-10 w-10 rounded-full border border-black/8 dark:border-white/8" />
        <div data-section-shape className="absolute right-[10%] top-[22%] h-12 w-12 border border-black/8 dark:border-white/8" />
        <div data-section-shape className="absolute bottom-[18%] left-[14%] h-px w-[4.5rem] bg-black/10 dark:bg-white/10" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 lg:gap-14">
        <div data-home-reveal className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.34em] text-black/42 dark:text-white/42">{eyebrow}</p>
          <h2 className="text-4xl font-light uppercase leading-none tracking-[0.08em] text-black dark:text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-8 text-black/60 dark:text-white/60 sm:text-lg">{body}</p>
        </div>
        {children}
      </div>
    </section>
  );
};

export const ModeGrid = ({ items }) => {
  return (
    <div className="grid gap-px bg-black/8 dark:bg-white/8 lg:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          data-home-reveal
          className="group bg-stone-100 px-6 py-8 transition-colors hover:bg-black/3 dark:bg-zinc-950 dark:hover:bg-white/[0.03] sm:px-8 sm:py-10"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-light uppercase tracking-[0.06em] text-black dark:text-white sm:text-[1.75rem]">
              {item.title}
            </h3>
            <span className="pt-1 text-[0.65rem] uppercase tracking-[0.28em] text-black/35 transition-colors group-hover:text-black/65 dark:text-white/35 dark:group-hover:text-white/65">
              Open
            </span>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/58 dark:text-white/58 sm:text-base sm:leading-8">
            {item.body}
          </p>
        </Link>
      ))}
    </div>
  );
};

export const TwoColumnList = ({ columns }) => {
  return (
    <div className="grid gap-px bg-black/8 dark:bg-white/8 lg:grid-cols-2">
      {columns.map((column) => (
        <div key={column.title} data-home-reveal className="bg-stone-100 px-6 py-8 dark:bg-zinc-950 sm:px-8 sm:py-10">
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
  );
};

export default HomeSectionBlock;
