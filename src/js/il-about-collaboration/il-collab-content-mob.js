/**
 * Custom element for rendering mobile collaboration content with toggleable tabs.
 * Dynamically adds toggle buttons to content blocks and handles tab activation on click.
 */
export class IlCollabContentMob extends HTMLElement {
    #debug = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this.handleTabsHTML();
        this.addTabListener();
    }

    handleTabsHTML() {
        this.tabsElems = this.querySelectorAll('.il-collaboration__item-tab');
        this.tabsElems.forEach(tabElem => {
            this.detectTargetContentBlock(tabElem);
        });
    }

    /**
     * Adds a toggle button to the specified tab's content block.
     * Sets data attributes and inserts the button after the image container.
     * @param {HTMLElement} tabElem - The tab element containing the content block.
     */
    detectTargetContentBlock(tabElem) {
        const targetContentBlock = tabElem.querySelector('.item-content-1');
        const tabTitle = tabElem.querySelector('.item-content__title')?.innerText ?? '';
        const targetImageContainer = targetContentBlock?.querySelector('.item-content-1__image-container');

        if (!targetContentBlock || !targetImageContainer) {
            this.#debug && console.error('Target element or its image container not found');
            return;
        }

        targetContentBlock.setAttribute('data-main-content-block', 'true');

        const button = document.createElement('button');
        button.classList.add('toggle-button');
        button.setAttribute('data-main-content-block', 'true');
        button.innerHTML = `
            <span class="toggle-button__text link-item">${tabTitle}</span>
            <span class="toggle-button__icon">
              <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.17371e-08 4.5L12 4.5M12 4.5L8.5 1M12 4.5L8.5 8" stroke="black" />
              </svg>
            </span>
        `;

        targetImageContainer.insertAdjacentElement('afterend', button);
    }

    addTabListener() {
        this.tabsElems.forEach(tabElem => {
            tabElem.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                tabElem.classList.toggle('active');
            }, { passive: false });
        });
    }
}