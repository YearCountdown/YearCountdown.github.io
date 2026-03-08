import GuestLayout from '../../layouts/GuestLayout/GuestLayout';

const NotFound = () => (
  <GuestLayout>
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center">
      <p className="text-xs uppercase tracking-[0.36em] text-black/45 dark:text-white/45">404</p>
      <h1 className="text-5xl font-light uppercase tracking-[0.08em] text-black dark:text-white sm:text-6xl">
        Page Not Found
      </h1>
      <p className="max-w-xl text-base leading-8 text-black/60 dark:text-white/60 sm:text-lg">
        The route exists in neither the current shell nor the planned visualization views.
      </p>
    </section>
  </GuestLayout>
);

export default NotFound;
