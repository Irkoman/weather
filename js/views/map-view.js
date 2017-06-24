import MarkerView from './marker-view'
import PopupView from './popup-view'

export default class MapView {
  constructor (data) {
    this._instance = null
    this._data = data
    this._markers = []
    this._irrelevantMarkers = []
    this._init()
    this.showPopup = this.showPopup.bind(this)
  }

  static getInstance (data = null) {
    if (!this._instance) {
      this._instance = new MapView(data)
    }

    return this._instance
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
    let marker = new MarkerView(item)

    this._markers.push(marker)

    new mapboxgl.Marker(marker.element, { offset: [-5, -5] })
      .setLngLat([item.location.lng, item.location.lat])
      .addTo(this.map)
  }

  toggleMarkerHighlight (lng, lat) {
    let marker = this._markers.find((marker) => {
      return (marker.lng === lng) && (marker.lat === lat)
    })

    if (marker) {
      marker.toggleHighlight()
    }
  }

  disableIrrelevantMarkers (relevantItems) {
    this._irrelevantMarkers = this._markers.filter((marker) => {
      return !relevantItems.find((item) =>
        (item.location.lng === marker.lng) && (item.location.lat === marker.lat)
      )
    })

    this._irrelevantMarkers.forEach((marker) => marker.disable())
  }

  enableMarkers () {
    this._markers.forEach((marker) => marker.enable())
  }

  showPopup (item) {
    this.map.flyTo({ center: [item.location.lng, item.location.lat] })

    let container = document.getElementById('popup')
    container.innerHTML = ''
    container.appendChild(PopupView(item))
  }
}
