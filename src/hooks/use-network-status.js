import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
  const [isOnline, setOnline] = useState(true);

  const updateNetworkStatus = () => {
    setOnline(navigator.onLine);
  };

  //   sometimes, the load event does not trigger on some browsers, that is why manually calling updateNetworkStatus on initial mount
  useEffect(() => {
    updateNetworkStatus();
  }, []);

  useEffect(() => {
    window.addEventListener("load", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
        window.removeEventListener("load", updateNetworkStatus);
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
    };
  }, [navigator.onLine]);

  return { isOnline };
};

export default useNetworkStatus;