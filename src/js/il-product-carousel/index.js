import Swiper from 'swiper';
import { Mousewheel, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';

class ILProductCarousel extends HTMLElement {
    constructor() {
        super();
        this.sectionId = this.dataset.sectionId;
        this.createSlider();
    }

    /**
     * Creates and configures a Swiper slider instance for the product carousel.
     * Initializes the slider with the specified section ID, setting up options such as
     * spacing between slides, auto-width slides, free-mode scrolling, navigation buttons,
     * and mousewheel support. The configuration ensures a smooth, touch-enabled carousel
     * with dynamic navigation and progress tracking.
     * @returns {Swiper} The initialized Swiper instance.
     */
    createSlider () {
        this.swiper = new Swiper(`#ProductCarousel--${this.sectionId}`, {
            modules: [Mousewheel, FreeMode],
            spaceBetween: 20,
            slidesPerView: 1.5,
            centeredSlides: false,
            allowTouchMove: true,
            freeMode: true,
            mousewheel: {
                forceToAxis: true, // прокрутка только по одной оси
            },
            breakpoints: {
                992: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                }
            },
        });
        return this.swiper;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!customElements.get('il-product-carousel') && !customElements.get('il-product-carousel')) {
        customElements.define('il-product-carousel', ILProductCarousel)
    }
});