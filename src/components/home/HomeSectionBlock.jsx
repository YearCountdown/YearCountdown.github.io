import { Link } from 'react-router-dom';

const SHAPE_VARIANTS = {
  frames: {
    left: (
      <>
        <div data-section-shape className="h-8 w-8 border border-black/10 dark:border-white/10 sm:h-9 sm:w-9" />
        <div data-section-shape className="h-0 w-0 border-b-[20px] border-l-[14px] border-r-[14px] border-b-black/10 border-l-transparent border-r-transparent dark:border-b-white/10 sm:border-b-[24px] sm:border-l-[16px] sm:border-r-[16px]" />
      </>
    ),
    right: (
      <>
        <div data-section-shape className="h-8 w-8 rounded-t-full border border-b-0 border-black/10 dark:border-white/10 sm:h-9 sm:w-9" />
        <div data-section-shape className="h-9 w-9 rounded-tl-full border-l border-t border-black/10 dark:border-white/10 sm:h-10 sm:w-10" />
      </>
    ),
  },
  rhythm: {
    left: (
      <>
        <div data-section-shape className="h-px w-16 bg-black/10 dark:bg-white/10 sm:w-20" />
        <div data-section-shape className="h-10 w-10 rotate-45 border border-black/10 dark:border-white/10 sm:h-11 sm:w-11" />
      </>
    ),
    right: (
      <>
        <div data-section-shape className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 sm:h-11 sm:w-11" />
        <div data-section-shape className="h-0 w-0 border-b-[22px] border-l-[15px] border-r-[15px] border-b-black/10 border-l-transparent border-r-transparent dark:border-b-white/10 sm:border-b-[26px] sm:border-l-[18px] sm:border-r-[18px]" />
      </>
    ),
  },
  arcs: {
    left: (
      <>
        <div data-section-shape className="h-10 w-10 rounded-bl-full border-b border-l border-black/10 dark:border-white/10 sm:h-12 sm:w-12" />
        <div data-section-shape className="h-8 w-8 rounded-r-full border border-l-0 border-black/10 dark:border-white/10 sm:h-9 sm:w-9" />
      </>
    ),
    right: (
      <>
        <div data-section-shape className="h-8 w-8 border border-black/10 dark:border-white/10 sm:h-9 sm:w-9" />
        <div data-section-shape className="h-px w-14 bg-black/10 dark:bg-white/10 sm:w-16" />
      </>
    ),
  },
  signal: {
    left: (
      <>
        <div data-section-shape className="h-0 w-0 border-b-[18px] border-l-[12px] border-r-[12px] border-b-black/10 border-l-transparent border-r-transparent dark:border-b-white/10 sm:border-b-[22px] sm:border-l-[14px] sm:border-r-[14px]" />
        <div data-section-shape className="h-8 w-16 rounded-full border border-black/10 dark:border-white/10 sm:h-9 sm:w-20" />
      </>
    ),
    right: (
      <>
        <div data-section-shape className="h-10 w-10 rounded-tl-full border-l border-t border-black/10 dark:border-white/10 sm:h-12 sm:w-12" />
        <div data-section-shape className="h-10 w-10 rounded-full border border-dashed border-black/10 dark:border-white/10 sm:h-11 sm:w-11" />
      </>
    ),
  },
};

const SectionCornerShapes = ({ variant = 'frames' }) => {
  const shapes = SHAPE_VARIANTS[variant] ?? SHAPE_VARIANTS.frames;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute bottom-6 left-4 flex items-end gap-3 sm:bottom-8 sm:left-6 lg:bottom-10 lg:left-8">
        {shapes.left}
      </div>

      <div className="absolute bottom-6 right-4 flex items-end gap-3 sm:bottom-8 sm:right-6 lg:bottom-10 lg:right-8">
        {shapes.right}
      </div>
    </div>
  );
};

const HomeSectionBlock = ({
  id,
  eyebrow,
  title,
  body,
  children,
  className = '',
  contentClassName = '',
  shapeVariant = 'frames',
}) => {
  return (
    <section
      id={id}
      className={`relative flex min-h-[34rem] w-full items-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[30rem] lg:px-10 lg:py-28 xl:min-h-[28rem] ${className}`}
    >
      <SectionCornerShapes variant={shapeVariant} />
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

const ModeHoverPreview = ({ id }) => {
  if (id === 'countdown') {
    return (
      <div className="absolute inset-y-5 right-5 flex w-16 translate-x-6 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        <div className="grid grid-cols-2 gap-1 text-black/20 dark:text-white/20">
          <span className="h-4 w-4 border border-current" />
          <span className="h-4 w-4 border border-current" />
          <span className="h-4 w-4 border border-current" />
          <span className="h-4 w-4 border border-current" />
        </div>
      </div>
    );
  }

  if (id === 'dots') {
    return (
      <div className="absolute inset-y-5 right-5 flex w-16 translate-x-6 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        <div className="grid grid-cols-4 gap-1 text-black/20 dark:text-white/20">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className={`h-2.5 w-2.5 rounded-full border border-current ${index < 7 ? 'bg-current' : ''}`} />
          ))}
        </div>
      </div>
    );
  }

  if (id === 'pie') {
    return (
      <div className="absolute inset-y-5 right-5 flex w-16 translate-x-6 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        <div className="relative h-10 w-10 rounded-full border border-black/20 text-black/20 dark:border-white/20 dark:text-white/20">
          <span className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(currentColor 0 63%, transparent 63% 100%)' }} />
          <span className="absolute inset-[0.45rem] rounded-full bg-stone-100 dark:bg-zinc-950" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-y-5 right-5 flex w-16 translate-x-6 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
      <div className="flex h-3 w-16 overflow-hidden border border-black/20 text-black/20 dark:border-white/20 dark:text-white/20">
        <span className="h-full w-[58%] bg-current" />
        <span className="h-full flex-1" />
      </div>
    </div>
  );
};

export const ModeGrid = ({ items }) => {
  return (
    <div className="grid gap-px bg-black/8 dark:bg-white/8 lg:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          data-home-card
          className="group relative overflow-hidden bg-stone-100 px-6 py-8 pr-24 transition-colors hover:bg-black/3 dark:bg-zinc-950 dark:hover:bg-white/[0.03] sm:px-8 sm:py-10 sm:pr-28"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white/15" />
          <ModeHoverPreview id={item.id} />
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
