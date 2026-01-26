import Swiper from 'swiper';
import { Mousewheel, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';

class ILInteractiveNotes extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.initInteractiveElements();

    }

    disconnectedCallback() {
        this.cleanupEventListeners();
    }

    initInteractiveElements() {
        const textContents = this.querySelectorAll('.il-interactive__text-content');
        const images = this.querySelectorAll('.il-interactive__image');

        const resetActiveClasses = () => {
            textContents.forEach(content => content.classList.remove('active'));
            images.forEach(image => image.classList.remove('active'));
        };

        const setActive = (blockId) => {
            resetActiveClasses();
            const targetText = this.querySelector(`.il-interactive__text-content[data-block-id="${blockId}"]`);
            const targetImage = this.querySelector(`.il-interactive__image[data-block-id="${blockId}"]`);
            if (targetText) targetText.classList.add('active');
            if (targetImage) targetImage.classList.add('active');
        };

        textContents.forEach(content => {
            content.addEventListener('click', () => {
                const blockId = content.getAttribute('data-block-id');
                setActive(blockId);
            });

            content.addEventListener('mouseenter', () => {
                const blockId = content.getAttribute('data-block-id');
                setActive(blockId);
                console.log('mouseenter');
            });

            content.addEventListener('mouseleave', () => {
                const activeText = this.querySelector('.il-interactive__text-content.active');
                const blockId = activeText?.getAttribute('data-block-id') ??
                    this.querySelector('.il-interactive__text-content')?.getAttribute('data-block-id');
                if (blockId) setActive(blockId);
            });
        });
    }

    cleanupEventListeners() {
        this.querySelectorAll('.il-interactive__text-content').forEach(content => {
            content.replaceWith(content.cloneNode(true));
        });
    }
}


class ILInteractiveNotesSlider extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.createSlider();
    }

    createSlider() {
        const sliderSection = this.querySelector('.il-slider'),
            sliderEl = this.querySelector('.swiper-container');

        const config = {
            modules: [Navigation, Mousewheel, Pagination],
            mousewheel: {
                forceToAxis: true,
            },
            slidesPerView: 1,
            spaceBetween: 20,
            watchSlidesVisibility: true,
            preloadImages: true,
            lazyLoading: true,
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 1
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
            },
            on: {
                init: function () {
                    console.log('swiper initialized');
                },
            },
        };

        console.log(config);

        const slider = new Swiper(sliderEl, config);
    }
}

if (!customElements.get('il-interactive-notes')) {
    customElements.define('il-interactive-notes', ILInteractiveNotes);
}

if (!customElements.get('il-interactive-notes-slider')) {
    customElements.define('il-interactive-notes-slider', ILInteractiveNotesSlider);
}
