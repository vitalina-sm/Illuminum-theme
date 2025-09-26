import { ILCollabContent } from './il-collab-content';
import { IlCollabContentMob } from './il-collab-content-mob';
import { breakpoints } from '../utils/variables';

// Constants for custom element names
const DESKTOP_ELEMENT = 'il-collab-content';
const MOBILE_ELEMENT = 'il-collab-content-mob';

// Optional debug flag (set to true for development)
const DEBUG = false

/**
 * Registers the appropriate custom element (desktop or mobile) based on the viewport width.
 * Uses matchMedia to check if the viewport is >= lg breakpoint (992px) and defines
 * either il-collab-content (desktop) or il-collab-content-mob (mobile).
 */
const handleCustomElements = () => {
    const isDesktop = window.matchMedia(`(min-width: ${breakpoints.lg}px)`).matches;

    if (isDesktop) {
        if (!customElements.get(DESKTOP_ELEMENT)) {
            customElements.define(DESKTOP_ELEMENT, ILCollabContent);
            DEBUG && console.log(`Registered ${DESKTOP_ELEMENT}`);
        }
    } else {
        if (!customElements.get(MOBILE_ELEMENT)) {
            customElements.define(MOBILE_ELEMENT, IlCollabContentMob);
            DEBUG && console.log(`Registered ${MOBILE_ELEMENT}`);
        }
    }
};

handleCustomElements();

const mediaQuery = window.matchMedia(`(min-width: ${breakpoints.lg}px)`);
if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleCustomElements, { passive: true });
} else {
    // Fallback for older browsers
    mediaQuery.addListener(handleCustomElements);
}