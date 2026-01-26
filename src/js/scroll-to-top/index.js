class ScrollToTop {
  constructor(button) {
    this.button = button;
    this.firstSection = null;
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.handleResize = this.handleResize.bind(this);
    
    if (this.button) {
      this.findFirstSection();
      this.button.addEventListener('click', this.scrollToTop);
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      window.addEventListener('resize', this.handleResize, { passive: true });
      // Check initial scroll position
      this.handleScroll();
    }
  }

  findFirstSection() {
    // Find main content area
    const mainContent = document.querySelector('main#MainContent');
    if (!mainContent) return;

    // Find all sections (shopify-section or section-wrapper)
    const allSections = mainContent.querySelectorAll('.shopify-section, .section-wrapper');
    
    // Find the first section that is not empty and has height
    for (let i = 0; i < allSections.length; i++) {
      const section = allSections[i];
      const rect = section.getBoundingClientRect();
      // Check if section has visible height
      if (rect.height > 0) {
        this.firstSection = section;
        break;
      }
    }
  }

  handleResize() {
    // Re-find first section in case layout changed
    this.findFirstSection();
    this.handleScroll();
  }

  handleScroll() {
    if (!this.firstSection) {
      this.findFirstSection();
      if (!this.firstSection) return;
    }

    const sectionRect = this.firstSection.getBoundingClientRect();
    
    // Check if first section is completely scrolled past (its bottom is above viewport top)
    // sectionRect.bottom <= 0 means the entire section is above the viewport
    if (sectionRect.bottom <= 0) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  destroy() {
    if (this.button) {
      this.button.removeEventListener('click', this.scrollToTop);
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleResize);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopButton = document.querySelector('[data-scroll-to-top]');
  if (scrollToTopButton) {
    new ScrollToTop(scrollToTopButton);
  }
});
