import Sortable from 'sortablejs'
import ItemsView from './views/items-view'
import ErrorView from './views/error-view'

const items = document.querySelector('.cities-all')

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
    items.innerHTML = ''
    items.appendChild(ErrorView())
  }

  static showItems () {
    items.innerHTML = ''
    items.appendChild(ItemsView(weatherData))

    let list = items.querySelector('#list')

    Sortable.create(list, {
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
      center: [40.926418, 57.767683],
      zoom: 5
    })

    map.on('load', () => {
      weatherData.forEach(function (marker) {
        let el = document.createElement('div')
        el.style.cssText += 'width: 15px; height: 15px; border-radius: 50%; background-color: rgb(117, 224, 187); box-shadow: 0 0 10px rgba(0, 0, 0, 0.6)'

        new mapboxgl.Marker(el, { offset: [-5, -5] })
          .setLngLat([marker.location.lng, marker.location.lat])
          .addTo(map)
      })
    })
  }
}
