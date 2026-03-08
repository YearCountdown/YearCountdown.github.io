import { Link } from 'react-router-dom';

const SectionCornerShapes = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute bottom-6 left-4 flex items-end gap-3 sm:bottom-8 sm:left-6 lg:bottom-10 lg:left-8">
        <div data-section-shape className="h-8 w-8 border border-black/10 dark:border-white/10 sm:h-9 sm:w-9" />
        <div data-section-shape className="h-0 w-0 border-b-[20px] border-l-[14px] border-r-[14px] border-b-black/10 border-l-transparent border-r-transparent dark:border-b-white/10 sm:border-b-[24px] sm:border-l-[16px] sm:border-r-[16px]" />
      </div>

      <div className="absolute bottom-6 right-4 flex items-end gap-3 sm:bottom-8 sm:right-6 lg:bottom-10 lg:right-8">
        <div data-section-shape className="h-8 w-8 rounded-t-full border border-b-0 border-black/10 dark:border-white/10 sm:h-9 sm:w-9" />
        <div data-section-shape className="h-9 w-9 rounded-tl-full border-l border-t border-black/10 dark:border-white/10 sm:h-10 sm:w-10" />
      </div>
    </div>
  );
};

const HomeSectionBlock = ({ id, eyebrow, title, body, children, className = '', contentClassName = '' }) => {
  return (
    <section
      id={id}
      className={`relative flex min-h-[34rem] w-full items-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[30rem] lg:px-10 lg:py-28 xl:min-h-[28rem] ${className}`}
    >
      <SectionCornerShapes />
      <div className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 lg:gap-14 ${contentClassName}`}>
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

export const ModeGrid = ({ items, activeMode, onModeEnter }) => {
  return (
    <div className="grid gap-px bg-black/8 dark:bg-white/8 lg:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          data-home-card
          onMouseEnter={() => onModeEnter?.(item.id)}
          onFocus={() => onModeEnter?.(item.id)}
          className="group relative overflow-hidden bg-stone-100 px-6 py-8 transition-colors hover:bg-black/3 dark:bg-zinc-950 dark:hover:bg-white/[0.03] sm:px-8 sm:py-10"
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-black/15 transition-opacity duration-300 dark:bg-white/15 ${activeMode === item.id ? 'opacity-100' : 'opacity-0'}`}
          />
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
  );
};

export default HomeSectionBlock;
