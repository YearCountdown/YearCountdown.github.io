import { useLocation } from 'react-router-dom';

import ViewSettingsGear from '../../components/ViewSettingsGear';
import Header from './Header';
import Footer from './Footer';

const GuestLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  return (
    <div className="relative min-h-screen bg-stone-100 text-black dark:bg-zinc-950 dark:text-white">
      <Header variant="home" />
      <main className="relative min-h-screen">
        {children}
      </main>
      <Footer />
      {isHomePage ? (
        <ViewSettingsGear
          viewTitle="Appearance"
          isHidden={false}
          controls={[]}
          viewState={{}}
          updateViewSetting={() => {}}
          appearanceOnly
        />
      ) : null}
    </div>
  );
};

export default GuestLayout;
