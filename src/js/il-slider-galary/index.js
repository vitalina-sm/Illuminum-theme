import Swiper from 'swiper';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';

document.addEventListener('DOMContentLoaded', () => {
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
        touchRatio: 1,
        resistance: true,
        resistanceRatio: 0.85,
        freeMode: {
            enabled: false,
        },
        lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
        },
        mousewheel: {
            forceToAxis: true,
            eventsTarget: '.il-slider__images .swiper-container',
            enabled: true,
            sensitivity: 1.2,
            releaseOnEdges: true,
            thresholdDelta: 30,
            thresholdTime: 300,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
        },
        modules: [Mousewheel, Pagination],
        on: {
            slideChange: function () {
                isLastSlide = this.activeIndex === this.slides.length - 1;

                if (isLastSlide) {
                    toggleSliderScroll(false);
                    isSliderScrollEnabled = false;

                }
            },
            touchStart: function (event) {
               /* event.preventDefault();
                event.stopPropagation();*/
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