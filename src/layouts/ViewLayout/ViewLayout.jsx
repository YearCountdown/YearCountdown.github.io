import { useEffect } from 'react';

import Header from '../GuestLayout/Header';

const ViewLayout = ({ children }) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-stone-100 text-black dark:bg-zinc-950 dark:text-white">
      <Header variant="view" />
      <main className="flex h-screen min-h-screen items-center justify-center overflow-hidden px-4 pt-24 sm:px-6 sm:pt-28 lg:px-10">
        {children}
      </main>
    </div>
  );
};

export default ViewLayout;
