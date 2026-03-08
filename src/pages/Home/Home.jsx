import GuestLayout from '../../layouts/GuestLayout/GuestLayout';

const Home = () => (
  <GuestLayout>
    <div className="w-full">
      <section className="flex min-h-screen w-full items-center px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
          <div className="max-w-xl space-y-6">
            <p className="text-xs uppercase tracking-[0.36em] text-black/45 dark:text-white/45">
              Present Year
            </p>
            <h1 className="text-5xl font-light uppercase leading-none tracking-[0.08em] text-balance text-black dark:text-white sm:text-6xl lg:text-7xl">
              Time, reduced to one clear horizon.
            </h1>
            <p className="max-w-lg text-base leading-8 text-black/60 dark:text-white/60 sm:text-lg">
              YearCountdown turns the current year into a small set of focused visual modes. Start from any
              view and keep the shell quiet.
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
        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-10">
        <div className="w-full rounded-[2rem] border border-dashed border-black/12 px-6 py-10 text-center text-sm uppercase tracking-[0.3em] text-black/30 dark:border-white/12 dark:text-white/30">
          Section 2
        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-10">
        <div className="w-full rounded-[2rem] border border-dashed border-black/12 px-6 py-10 text-center text-sm uppercase tracking-[0.3em] text-black/30 dark:border-white/12 dark:text-white/30">
          Section 3
        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-10">
        <div className="w-full rounded-[2rem] border border-dashed border-black/12 px-6 py-10 text-center text-sm uppercase tracking-[0.3em] text-black/30 dark:border-white/12 dark:text-white/30">
          Section 4
        </div>
      </section>
    </div>
  </GuestLayout>
);

export default Home;
