import Swiper from 'swiper';
import {Mousewheel, Pagination, FreeMode} from 'swiper/modules';
import 'swiper/css';

document.addEventListener('DOMContentLoaded', () => {
    console.log('il-slider.js loaded');
    const sliderSection = document.querySelector('.il-slider'),
          sliderEl = document.querySelector('.il-slider__images .swiper-container');
    let slider,
        observer,
        isLastSlide = false,
        isSliderScrollEnabled = true, // TODO: сделать проверку при загрузке страницы
        lastWindowWidth = window.innerWidth;

    if (!sliderEl && !sliderSection) {
        console.warn('Slider container or section not found');
        return;
    }

    const sliderConfig = {
        direction: 'vertical',
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        spaceBetween: 0,
        grabCursor: true,
        allowSlidePrev: true,
        allowTouchMove: true,
        speed: 400,
        effect: 'slide',
        transitionTimingFunction: 'ease-out(0.4, 0, 0.2, 1)',
        touchRatio: 1.2,
        freeMode: {
            enabled: true,
            sticky: true,
            momentum: true,
            momentumRatio: 0.8,
            momentumVelocityRatio: 0.9,
        },
        lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
        },
        mousewheel: {
            forceToAxis: true,
            eventsTarget: '.il-slider__images .swiper-container',
            enabled: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
        },
        modules: [Mousewheel, Pagination, FreeMode],
        on: {
            slideChange: function () {
                isLastSlide = this.activeIndex === this.slides.length - 1;

                if (isLastSlide) {
                    toggleSliderScroll(false);
                    isSliderScrollEnabled = false;

                }
            },
            touchStart: function (event) {
                console.log('touchStart');
                event.preventDefault();
                event.stopPropagation();
            }
        },
    }

    slider = new Swiper(sliderEl, sliderConfig);

    const toggleSliderScroll = (makeSliderActive) => {
        if (makeSliderActive) {
            slider.mousewheel.enable();
            slider.allowTouchMove = true;
            slider.slidesPerView = 1;
            slider.slidesPerGroup = 1;
            slider.slidesPerGroupSkip = 0;
            slider.spaceBetween = 0;
            slider.allowSlidePrev = true;

            isSliderScrollEnabled = true;

        } else if (isSliderScrollEnabled) {
            setTimeout(() => {
                slider.mousewheel.disable();
                slider.allowTouchMove = false;
            }, 400);
        }
    };

    /* Fix ful height fpr Safari on mobile */
    function setSliderHeight() {
        const height = `${window.innerHeight}px`
        sliderEl.style.height = height;
    }

    setSliderHeight();

    window.addEventListener('scroll', () => {
        const sliderTop = sliderEl.getBoundingClientRect().top;
        if (sliderTop >= 0
            && !isSliderScrollEnabled
            && isLastSlide) {
            toggleSliderScroll(true);
        }
    });

    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        if (currentWidth !== lastWindowWidth) {
            setSliderHeight();
            lastWindowWidth = currentWidth; // Обновляем ширину
        }
    });
    window.addEventListener('orientationchange', () => {
        setSliderHeight();
    });
});