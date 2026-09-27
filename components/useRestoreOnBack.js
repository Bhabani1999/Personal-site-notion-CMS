import { useEffect } from "react";

// Pages fade themselves to opacity 0 before navigating away. When the browser
// restores one of those pages (back button, or the bfcache), the animation
// controls still hold that faded state and the page renders blank. Reset them
// on mount and on bfcache restore so the page always comes back visible.
export default function useRestoreOnBack(...controls) {
  useEffect(() => {
    const reset = () => controls.forEach((c) => c && c.set({ opacity: 1 }));

    reset();

    const onPageShow = (event) => {
      if (event.persisted) reset();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
