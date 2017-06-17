import AbstractView from './abstract-view'

class ItemsView extends AbstractView {
  constructor (items) {
    super()
    this._items = items
  }

  getMarkup () {
    return `
      <div id="items">
        ${this._items.map((item, index) => `
          <article class="list-item">
            <div class="list-item-handle"></div>
            <h3 class="list-item-title">
              <span class="list-item-name">${item.name}</span>,
              <span class="list-item-weather">${item.weather}</span>
            </h3>
            <div class="list-item-features">
              ${item.features.map((feature) => `
                <span class="list-item-feature">${feature}</span>
              `).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    `
  }
}

export default (items) => {
  return new ItemsView(items).element
}
