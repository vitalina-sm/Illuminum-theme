class ILCollaboration extends HTMLElement {
    constructor() {
        super();
        this.activateFirstElems()
        this.insertHTML();
        this.addButtonListeners();
    }

    activateFirstElems() {
        const firstTabElement = this.querySelectorAll('.layout-for-js .collection-tabs__button')?.[0];
        const firstContentElement = this.querySelectorAll('.layout-for-js .collection-tabs__item-content')?.[0];
        firstTabElement?.classList.add('active');
        firstContentElement?.classList.add('active');
    }

    insertHTML() {
        const items = this.querySelectorAll('.layout-for-js .il-collaboration-item');
        const tabsElement = this.querySelector('[data-js-insert="collection-tabs"]');
        const contentElement = this.querySelector('[data-js-insert="collection-content"]');
        const mainContainer = this.querySelector('.il-collaboration__bottom-content');
        let tabsHTML = '',
            tabsContentHTML = '';

        items.forEach(item => {
            const buttonHTML = item.querySelector('.collection-tabs__item-button-container')?.innerHTML;
            const contentHTML = item.querySelector('.collection-tabs__item-content-container')?.innerHTML;
            tabsHTML += buttonHTML;
            tabsContentHTML += contentHTML;
        })

        if (tabsHTML !== '') {
            tabsElement.innerHTML = tabsHTML;
        } else {
            console.log('No tabs for collaboration section');
        }

        if (tabsContentHTML !== '') {
            contentElement.innerHTML = tabsContentHTML;
        } else {
            console.log('No content for collaboration section');
        }

        mainContainer.classList.remove('hidden');
    }

    addButtonListeners() {
        const buttons = this.querySelectorAll('.il-collaboration .collection-tabs__button');

        if (buttons.length === 0) return;

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const activeButtonElement = e.target;
                const activeContentElement = this.querySelector(`.il-collaboration [data-tab-content="${activeButtonElement.dataset.tabButton}"]`);

                const buttonsAll = this.querySelectorAll('.il-collaboration .collection-tabs__button');
                const contentAll = this.querySelectorAll('.il-collaboration .collection-tabs__item-content');

                buttonsAll.forEach(button => {
                    button?.classList.remove('active');
                })

                contentAll.forEach(content => {
                    content?.classList.remove('active');
                })

                activeButtonElement?.classList.add('active');
                activeContentElement?.classList.add('active');
            })
        })

    }

}

if (!customElements.get('il-collaboration')) {
    customElements.define('il-collaboration', ILCollaboration);
}
