import MapView from './map-view'
import ErrorView from './error-view'
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
          <article class="list-item" data-lng="${item.location.lng}" data-lat="${item.location.lat}">
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
        MapView.getInstance().toggleMarkerHighlight(lng, lat)
      })

      item.addEventListener('mouseleave', (e) => {
        MapView.getInstance().toggleMarkerHighlight(lng, lat)
      })

      item.addEventListener('click', () => {
        MapView.getInstance().showPopup(this._items[index])
      })
    })
  }
}

export default (items) => {
  if (items.length) {
    return new ListView(items).element
  }

  return new ErrorView('empty')
}
