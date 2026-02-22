import Header from './Header';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-black dark:text-white">
      <Header />
      <main className="flex min-h-[calc(100vh-118px)] items-center justify-center px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
