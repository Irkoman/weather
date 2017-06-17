import App from '../app'
import AbstractView from './abstract-view'

class ListView extends AbstractView {
  constructor (items) {
    super()
    this._items = items
  }

  getMarkup () {
    return `
      <div id="list">
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

  bindHandlers () {
    const items = Array.from(this.element.querySelectorAll('.list-item'))

    items.forEach((item, index) => {
      let lng = this._items[index].location.lng
      let lat = this._items[index].location.lat

      item.addEventListener('mouseenter', (e) => {
        App.toggleMarkerHighlight(lng, lat, false)
      })

      item.addEventListener('mouseleave', (e) => {
        App.toggleMarkerHighlight(lng, lat, true)
      })
    })
  }
}

export default (items) => {
  return new ListView(items).element
}
