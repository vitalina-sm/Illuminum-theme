import Swiper from 'swiper';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';

document.addEventListener('DOMContentLoaded', () => {
    const sliderSection = document.querySelector('.il-slider'),
          sliderEl = document.querySelector('.il-slider__images .swiper-container');
    let slider,
        observer,
        isLastSlide = false,
        isSliderScrollEnabled = true,
        lastWindowWidth = window.innerWidth;

    if (!sliderEl && !sliderSection) {
        console.warn('Slider container or section not found');
        return;
    }

    /**
     * Reset all videos in the slider to the beginning
     */
    const resetAllVideos = () => {
        const allVideos = sliderEl.querySelectorAll('video');
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    };

    /**
     * Play video in the active slide from the beginning
     */
    const playActiveSlideVideo = () => {
        const activeSlide = sliderEl.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const videos = activeSlide.querySelectorAll('video');
            videos.forEach(video => {
                video.currentTime = 0;
                video.play().catch(error => {
                    console.debug('Video autoplay prevented:', error);
                });
            });
        }
    };

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

                // Reset all videos and play video in active slide
                resetAllVideos();
                setTimeout(() => {
                    playActiveSlideVideo();
                }, 100);
            }
        },
    }

    slider = new Swiper(sliderEl, sliderConfig);

    // Initialize video for the first slide
    setTimeout(() => {
        playActiveSlideVideo();
    }, 200);

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
    const setSliderHeight = () => {
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

    /**
     * Handle keyboard navigation (Arrow Up/Down)
     */
    const handleKeyboardNavigation = (event) => {
        // Check if slider is visible on screen
        const sliderRect = sliderEl.getBoundingClientRect();
        const isSliderVisible = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;

        // Only handle keyboard events if slider is visible and enabled
        if (!isSliderVisible || !isSliderScrollEnabled) {
            return;
        }

        // Check if user is not typing in an input field
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );

        if (isInputFocused) {
            return;
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            
            if (event.key === 'ArrowUp') {
                slider.slidePrev();
            } else if (event.key === 'ArrowDown') {
                slider.slideNext();
            }
        }
    };

    window.addEventListener('keydown', handleKeyboardNavigation);
});