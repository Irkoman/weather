import Sortable from 'sortablejs'
import ListView from './views/list-view'
import ErrorView from './views/error-view'

const container = document.querySelector('.cities-all')

let weatherData

export default class App {
  static set data (data) {
    weatherData = data
  }

  static checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
  }

  static showError () {
    container.innerHTML = ''
    container.appendChild(ErrorView())
  }

  static showList () {
    container.innerHTML = ''
    container.appendChild(ListView(weatherData))

    let list = container.querySelector('#list')
    let listSelected = document.getElementById('list-selected')

    Sortable.create(list, {
      group: 'cities',
      handle: '.list-item-handle',
      draggable: '.list-item',
      animation: 100
    })

    Sortable.create(listSelected, {
      group: 'cities',
      handle: '.list-item-handle',
      draggable: '.list-item',
      animation: 100
    })
  }

  static showMap () {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGl1LXBpdSIsImEiOiJjajQxODViZWcwOXI1MnhwYXc2d2dzbWw0In0.10Tv1nY4BpM85MDla7FrxA'

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [37.617761, 55.755773],
      zoom: 4
    })

    map.on('load', () => {
      weatherData.forEach(function (marker) {
        let el = document.createElement('div')
        el.className = 'marker'
        el.style.cssText += 'width: 15px; height: 15px; border-radius: 50%; background-color: rgb(117, 224, 187); box-shadow: 0 0 10px rgba(0, 0, 0, 0.6)'
        el.setAttribute('data-lat', marker.location.lat)
        el.setAttribute('data-lng', marker.location.lng)

        new mapboxgl.Marker(el, { offset: [-5, -5] })
          .setLngLat([marker.location.lng, marker.location.lat])
          .addTo(map)
      })
    })
  }

  static toggleMarkerHighlight (lng, lat, isHighlighted) {
    const markers = Array.from(document.querySelectorAll('.marker'))

    markers.forEach((marker, index) => {
      let markerLng = marker.getAttribute('data-lng')
      let markerLat = marker.getAttribute('data-lat')

      if ((lng === markerLng) && (lat === markerLat)) {
        if (isHighlighted) {
          marker.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.6)'
        } else {
          marker.style.boxShadow = '0 0 20px rgb(120, 120, 0)'
        }
      }
    })
  }
}
