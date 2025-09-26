/**
 * Custom element for rendering desktop collaboration content with tabbed navigation.
 * Initializes tabs, inserts content into designated containers, and adds event listeners for tab switching.
 */

export class ILCollabContent extends HTMLElement {
    constructor() {
        super();
        this.activateFirstElems()
        this.insertHTML();
        this.addButtonListeners();
    }

    /**
     * Activates the first tab and its corresponding content by adding the 'active' class.
     * Ensures the initial state displays the first tab as selected.
     */
    activateFirstElems() {
        const firstTabElement = this.querySelectorAll('.layout-for-js .item-tab__button')?.[0];
        const firstContentElement = this.querySelectorAll('.layout-for-js .item-tab__content')?.[0];

        firstTabElement?.classList.add('active');
        firstContentElement?.classList.add('active');
    }

    /**
     * Collects tab buttons and content from items, inserts them into designated containers,
     * and shows the main content container by removing the 'hidden' class.
     */
    insertHTML() {
        const items = this.querySelectorAll('.layout-for-js .il-collaboration__item-tab');
        const tabsElement = this.querySelector('[data-js-insert="collection-tabs"]');
        const contentElement = this.querySelector('[data-js-insert="collection-content"]');
        const mainContainer = this.querySelector('.il-collaboration__full-content');

        let tabsHTML = '';
        let tabsContentHTML = '';

        items.forEach(item => {
            const buttonHTML = item.querySelector('.item-tab__button-container-outer')?.innerHTML ?? '';
            const contentHTML = item.querySelector('.item-tab__content-container-outer')?.innerHTML ?? '';
            tabsHTML += buttonHTML;
            tabsContentHTML += contentHTML;
        })

        if (tabsHTML) {
            tabsElement.innerHTML = tabsHTML;
        }

        if (tabsContentHTML) {
            contentElement.innerHTML = tabsContentHTML;
        }

        mainContainer?.classList.remove('hidden');
    }

    addButtonListeners() {
        const buttons = this.querySelectorAll('.il-collaboration__full-content .item-tab__button');
        if (!buttons.length) return;

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const activeButtonElement = e.target;
                const activeContentElement = this.querySelector(
                    `.il-collaboration__full-content [data-tab-content="${activeButtonElement.dataset.tabButton}"]`
                );

                this.querySelectorAll('.il-collaboration__full-content .item-tab__button')
                    .forEach(btn => btn.classList.remove('active'));
                this.querySelectorAll('.il-collaboration__full-content .item-tab__content')
                    .forEach(content => content.classList.remove('active'));

                activeButtonElement?.classList.add('active');
                activeContentElement?.classList.add('active');
            }, { passive: true });
        });
    }
}