class IlMenu extends HTMLElement {
    constructor() {
        super();
        this.toggleButtons = this.querySelectorAll('.il-menu__button');
    }

    connectedCallback() {
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleAttribute('open'));
        })
    }
}

if (!customElements.get('il-menu')) {
    customElements.define('il-menu', IlMenu);
}