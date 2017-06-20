import AbstractView from './abstract-view'

class PopupView extends AbstractView {
  constructor (item) {
    super()
    this._item = item
  }

  getMarkup () {
    return `
      <div class="popup" role="popup" aria-labellebby="popup-title">
        <h3 class="popup-title" id="popup-title">
          <span class="popup-title-name">${this._item.name}</span>,
          <span class="popup-title-weather">${this._item.weather}</span>
        </h3>
        <div class="popup-features">
          ${this._item.features.map((feature) => `
            <span class="popup-feature">${feature}</span>
          `).join('')}
        </div>
      </div>
    `
  }
}

export default (item) => new PopupView(item).element
