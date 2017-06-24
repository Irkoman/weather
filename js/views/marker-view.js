import App from '../app'
import MapView from './map-view'
import AbstractView from './abstract-view'

export default class MarkerView extends AbstractView {
  constructor (item) {
    super()
    this.lng = item.location.lng
    this.lat = item.location.lat
    this.item = item
    this.enable = this.enable.bind(this)
    this.disable = this.disable.bind(this)
    this.toggleHighlight = this.toggleHighlight.bind(this)
    this._onClick = this._onClick.bind(this)
  }

  getMarkup () {
    return `<div class="marker" data-lng="${this.lng}" data-lat="${this.lng}"></div>`
  }

  bindHandlers () {
    this.element.addEventListener('mouseenter', () => App.toggleItemHighlight(this.lng, this.lat))
    this.element.addEventListener('mouseleave', () => App.toggleItemHighlight(this.lng, this.lat))
    this.element.addEventListener('click', this._onClick)
  }

  enable () {
    this.element.firstChild.classList.remove('disabled')
    this.element.addEventListener('click', this._onClick)
  }

  disable () {
    this.element.firstChild.classList.add('disabled')
    this.element.removeEventListener('click', this._onClick)
  }

  toggleHighlight () {
    this.element.firstChild.classList.toggle('highlighted')
  }

  _onClick () {
    MapView.getInstance().showPopup(this.item)
  }
}
