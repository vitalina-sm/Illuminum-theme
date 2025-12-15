import Swiper from 'swiper';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';

class IlSliderGallery extends HTMLElement {
    constructor() {
        super();

        this.slider = null;
        this.sliderEl = null;
        this.isLastSlide = false;
        this.isSliderScrollEnabled = true;
        this.lastWindowWidth = window.innerWidth;
        this.isMobile = window.innerWidth < 768;

        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleOrientationChange = this.handleOrientationChange.bind(this);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
    }

    connectedCallback() {
        this.sliderEl = this.querySelector('.il-slider__images .swiper-container');

        if (!this.sliderEl) {
            console.warn('Slider container not found');
            return;
        }

        this.initSlider();
        this.setSliderHeight();
       
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('orientationchange', this.handleOrientationChange);
        window.addEventListener('keydown', this.handleKeyboardNavigation);
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        window.removeEventListener('keydown', this.handleKeyboardNavigation);

        if (this.slider) {
            this.slider.destroy(true, true);
            this.slider = null;
        }
    }

    loadVideo(video, needToPlay = false) {
        if (!video) return;

        // Skip if already loaded
        if (video.dataset.loaded === 'true') return;

        const videoUrl = video.dataset.videoUrl;
        if (!videoUrl) return;

        // Skip if already set to this URL (prevents double load when preload runs twice)
        if (video.src === videoUrl) return;

        return new Promise((resolve, reject) => {
            const onLoaded = () => {
                video.removeEventListener('loadeddata', onLoaded);
                video.removeEventListener('error', onError);

                if (needToPlay) {
                    video.addEventListener('canplaythrough', () => {
                        this.playActiveSlideVideo();
                    }, { once: true });
                    return resolve();
                }
                resolve();
            };
            const onError = (e) => {
                video.removeEventListener('loadeddata', onLoaded);
                video.removeEventListener('error', onError);
                reject(e);
            };

            video.addEventListener('loadeddata', onLoaded);
            video.addEventListener('error', onError, { once: true });

            video.src = videoUrl;
            video.load();
            video.dataset.loaded = 'true';
        });
    }

    getSlideVideos(slide) {
        if (!slide) return [];
        const preferredSelector = this.isMobile ? '.video-container.mobile video' : '.video-container:not(.mobile) video';
        const preferred = Array.from(slide.querySelectorAll(preferredSelector));
        if (preferred.length) return preferred;
        return Array.from(slide.querySelectorAll('video'));
    }

    initSlider() {
        if (this.slider) return;

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
                el: this.querySelector('.swiper-pagination'),
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
            },
            modules: [Mousewheel, Pagination],
            on: {
                slideChange: (swiperInstance) => {
                    this.isLastSlide = swiperInstance.activeIndex === swiperInstance.slides.length - 1;

                    // Preload current active video first (if not yet loaded)
                    const activeSlideEl = swiperInstance.slides[swiperInstance.activeIndex];
                    const [activeVideo] = this.getSlideVideos(activeSlideEl);
                    if (activeVideo && activeVideo.dataset.loaded !== 'true') {
                        this.loadVideo(activeVideo);
                    }

                    if (this.isLastSlide) {
                        this.toggleSliderScroll(false);
                        this.isSliderScrollEnabled = false;
                    }

                    this.resetAllVideos();

                    setTimeout(() => {
                        this.playActiveSlideVideo();
                    }, 100);
                    
                    // Then preload next slide video
                    const nextSlideEl = swiperInstance.slides[swiperInstance.activeIndex + 1];
                    const [nextVideo] = this.getSlideVideos(nextSlideEl);
                    if (nextVideo && nextVideo.dataset.loaded !== 'true') {
                        this.loadVideo(nextVideo);
                    }
                },
            },
        };

        this.slider = new Swiper(this.sliderEl, sliderConfig);

        // Preload and play video from the first slide matching current viewport (mobile/desktop)
        const firstSlide = this.slider.slides?.[0] || this.sliderEl.querySelector('.swiper-slide');
        const nextSlide = this.slider.slides?.[1] || this.sliderEl.querySelector('.swiper-slide:nth-child(2)');
        const [firstVideo] = this.getSlideVideos(firstSlide);
        if (firstVideo) {
            this.loadVideo(firstVideo, true);
        }
        if (nextSlide) {
            this.loadVideo(nextSlide);
        }
    }

    resetAllVideos() {
        if (!this.sliderEl) return;

        const allVideos = this.sliderEl.querySelectorAll('video');
        allVideos.forEach((video) => {
            video.pause();
            video.currentTime = 0;
        });
    }

    playActiveSlideVideo() {
        if (!this.sliderEl) return;

        const activeSlide = this.slider.slides[this.slider.activeIndex] || this.slider.slides[0];
        if (!activeSlide) return;

        const videos = this.getSlideVideos(activeSlide);
        for (const video of videos) {
            video.currentTime = 0;
            try {
                video.play();
            } catch (error) {
                console.debug('Video autoplay prevented:', error);
            }
        }
    }

    toggleSliderScroll(makeSliderActive) {
        if (!this.slider) return;

        if (makeSliderActive) {
            this.slider.mousewheel.enable();
            this.slider.allowTouchMove = true;
            this.slider.slidesPerView = 1;
            this.slider.slidesPerGroup = 1;
            this.slider.slidesPerGroupSkip = 0;
            this.slider.spaceBetween = 0;
            this.slider.allowSlidePrev = true;

            this.isSliderScrollEnabled = true;
        } else if (this.isSliderScrollEnabled) {
            setTimeout(() => {
                this.slider.mousewheel.disable();
                this.slider.allowTouchMove = false;
            }, 400);
        }
    }

    /* Fix full height for Safari on mobile */
    setSliderHeight() {
        if (!this.sliderEl) return;
        this.sliderEl.style.height = `${window.innerHeight}px`;
    }

    handleScroll() {
        if (!this.sliderEl) return;

        const sliderTop = this.sliderEl.getBoundingClientRect().top;
        if (sliderTop >= 0 && !this.isSliderScrollEnabled && this.isLastSlide) {
            this.toggleSliderScroll(true);
        }
    }

    handleResize() {
        const currentWidth = window.innerWidth;

        if (currentWidth !== this.lastWindowWidth) {
            this.setSliderHeight();
            this.lastWindowWidth = currentWidth;
            this.isMobile = currentWidth < 768;
        }
        this.playActiveSlideVideo();
    }

    handleOrientationChange() {
        this.setSliderHeight();
    }

    /**
     * Handle keyboard navigation (Arrow Up/Down)
     */
    handleKeyboardNavigation(event) {
        if (!this.sliderEl || !this.slider) return;

        const sliderRect = this.sliderEl.getBoundingClientRect();
        const isSliderVisible = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;

        if (!isSliderVisible || !this.isSliderScrollEnabled) {
            return;
        }

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
                this.slider.slidePrev();
            } else if (event.key === 'ArrowDown') {
                this.slider.slideNext();
            }
        }
    }
}

if (!customElements.get('il-slider-gallery')) {
    customElements.define('il-slider-gallery', IlSliderGallery);
}