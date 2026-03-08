import GuestLayout from '../../layouts/GuestLayout/GuestLayout';

const Home = () => (
  <GuestLayout>
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-xl space-y-6">
        <p className="text-xs uppercase tracking-[0.36em] text-black/45 dark:text-white/45">
          Present Year
        </p>
        <h1 className="text-5xl font-light uppercase leading-none tracking-[0.08em] text-balance text-black dark:text-white sm:text-6xl lg:text-7xl">
          Time, reduced to one clear horizon.
        </h1>
        <p className="max-w-lg text-base leading-8 text-black/60 dark:text-white/60 sm:text-lg">
          YearCountdown turns the current year into a small set of focused visual modes. Start from any view
          and keep the shell quiet.
        </p>
      </div>

      <div className="grid max-w-xl gap-4 text-left sm:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white/45 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40">Countdown</p>
          <p className="mt-4 text-sm leading-7 text-black/65 dark:text-white/65">
            Numerical urgency with a clean, route-first presentation.
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/45 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40">Dots</p>
          <p className="mt-4 text-sm leading-7 text-black/65 dark:text-white/65">
            A discrete field of days for a more tactile reading of the year.
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/45 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40">Pie</p>
          <p className="mt-4 text-sm leading-7 text-black/65 dark:text-white/65">
            Circular progress that stays minimal without losing clarity.
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/45 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.28em] text-black/40 dark:text-white/40">Progress</p>
          <p className="mt-4 text-sm leading-7 text-black/65 dark:text-white/65">
            A full-screen reading where the interface itself becomes the meter.
          </p>
        </div>
      </div>
    </section>
  </GuestLayout>
);

export default Home;
