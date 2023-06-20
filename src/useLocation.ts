import { useEffect, useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState<string>(window.location.href);

  const onChange = () => {
    setLocation(window.location.href);
  };

  useEffect(() => {
    window.addEventListener('yt-navigate-finish', onChange);

    return () => {
      window.removeEventListener('yt-navigate-finish', onChange);
    };
  }, []);

  return location;
};

export default useLocation;
