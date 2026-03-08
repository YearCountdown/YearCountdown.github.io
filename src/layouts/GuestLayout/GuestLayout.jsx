import Header from './Header';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-stone-100 text-black dark:bg-zinc-950 dark:text-white">
      <Header variant="home" />
      <main className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
