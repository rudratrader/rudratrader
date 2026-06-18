import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Resets the scroll position to the top on forward navigation (PUSH/REPLACE),
 * so a new route — e.g. a product page opened from lower down the grid — always
 * starts at the top. On POP (browser back/forward) the browser's own scroll
 * restoration is left intact.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
