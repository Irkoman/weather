import Sortable from 'sortablejs'
import ListView from './views/list-view'
import ErrorView from './views/error-view'
import { findElementByCoordinates } from './helpers/search-helper'

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
        let lng = marker.location.lng
        let lat = marker.location.lat
        let el = document.createElement('div')
        el.className = 'marker'
        el.style.cssText += 'width: 15px; height: 15px; border-radius: 50%; background-color: rgb(117, 224, 187); box-shadow: 0 0 10px rgba(0, 0, 0, 0.6)'
        el.setAttribute('data-lng', lng)
        el.setAttribute('data-lat', lat)

        el.addEventListener('mouseenter', (e) => {
          App.toggleItemHighlight(lng, lat)
        })

        el.addEventListener('mouseleave', (e) => {
          App.toggleItemHighlight(lng, lat)
        })

        new mapboxgl.Marker(el, { offset: [-5, -5] })
          .setLngLat([lng, lat])
          .addTo(map)
      })
    })
  }

  static toggleMarkerHighlight (lng, lat, isHighlighted) {
    const markers = Array.from(document.querySelectorAll('.marker'))
    const element = findElementByCoordinates(markers, lng, lat)

    if (element) {
      if (isHighlighted) {
        element.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.6)'
      } else {
        element.style.boxShadow = '0 0 20px rgb(120, 120, 0)'
      }
    }
  }

  static toggleItemHighlight (lng, lat) {
    const items = Array.from(document.querySelectorAll('.list-item'))
    const element = findElementByCoordinates(items, lng, lat)

    if (element) {
      element.classList.toggle('list-item-highlight')
    }
  }
}
