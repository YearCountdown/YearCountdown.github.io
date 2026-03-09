import { useEffect, useState } from 'react';

import { getDeviceProfileSnapshot } from '../lib/deviceProfile';

const useDeviceProfile = () => {
  const [profile, setProfile] = useState(() => getDeviceProfileSnapshot());

  useEffect(() => {
    const updateProfile = () => {
      setProfile(getDeviceProfileSnapshot());
    };

    updateProfile();

    window.addEventListener('resize', updateProfile);
    window.addEventListener('orientationchange', updateProfile);
    window.visualViewport?.addEventListener('resize', updateProfile);

    return () => {
      window.removeEventListener('resize', updateProfile);
      window.removeEventListener('orientationchange', updateProfile);
      window.visualViewport?.removeEventListener('resize', updateProfile);
    };
  }, []);

  return profile;
};

export default useDeviceProfile;
