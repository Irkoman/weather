import App from './app'
import PopupView from './views/popup-view'

export default class Map {
  constructor (data) {
    this.instance = null
    this._data = data
    this._init()
  }

  static getInstance (data = null) {
    if (!this.instance) {
      this.instance = new Map(data)
    }

    return this.instance
  }

  _init () {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGl1LXBpdSIsImEiOiJjajQxODViZWcwOXI1MnhwYXc2d2dzbWw0In0.10Tv1nY4BpM85MDla7FrxA'

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [37.617761, 55.755773],
      zoom: 4
    })

    this.map.on('load', () => {
      this._data.forEach((item) => {
        this.addMarker(item)
      })
    })
  }

  addMarker (item) {
    let lng = item.location.lng
    let lat = item.location.lat
    let el = document.createElement('div')
    el.className = 'marker'
    el.style.cssText += 'width: 15px; height: 15px; border-radius: 50%; background-color: rgb(117, 224, 187); box-shadow: 0 0 10px rgba(0, 0, 0, 0.6); cursor: pointer;'
    el.setAttribute('data-lng', lng)
    el.setAttribute('data-lat', lat)

    el.addEventListener('mouseenter', () => {
      App.toggleItemHighlight(lng, lat)
    })

    el.addEventListener('mouseleave', () => {
      App.toggleItemHighlight(lng, lat)
    })

    el.addEventListener('click', () => {
      this.showPopup(item)
    })

    new mapboxgl.Marker(el, { offset: [-5, -5] })
      .setLngLat([lng, lat])
      .addTo(this.map)
  }

  showPopup (item) {
    this.map.flyTo({ center: [item.location.lng, item.location.lat] })

    let container = document.getElementById('popup')
    container.innerHTML = ''
    container.appendChild(PopupView(item))
  }
}
