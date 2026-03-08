import Header from './Header';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-stone-100 text-black dark:bg-zinc-950 dark:text-white">
      <Header variant="home" />
      <main className="relative min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
