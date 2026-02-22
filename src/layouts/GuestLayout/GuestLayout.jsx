import Header from './Header';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
  return (
    <div>
      <Header />
        {children}
      <Footer />
    </div>
  );
};

export default GuestLayout;
