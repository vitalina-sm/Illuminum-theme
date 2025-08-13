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
            spaceBetween: 30,
            slidesPerView: 1,
            slidesOffsetBefore: 0, // Отступ перед первым слайдом
            slidesOffsetAfter: 0,  // Отступ после последнего слайда
            centeredSlides: false,
            allowTouchMove: true,
            mousewheel: {
                forceToAxis: true, // прокрутка только по одной оси
                sensitivity: 1,    // чувствительность
            }
        });
        console.log('this.swiper: ', this.swiper)
        return this.swiper;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!customElements.get('il-product-carousel') && !customElements.get('il-product-carousel')) {
        customElements.define('il-product-carousel', ILProductCarousel)
    }
});