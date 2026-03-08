import ViewLayout from '../layouts/ViewLayout/ViewLayout';

const FeaturePage = ({ title, description }) => {
  return (
    <ViewLayout>
      <section className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-5xl font-light tracking-[0.08em] text-balance uppercase text-black dark:text-white sm:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-8 text-black/60 dark:text-white/60 sm:text-lg">
          {description}
        </p>
      </section>
    </ViewLayout>
  );
};

export default FeaturePage;
