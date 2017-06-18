import Sortable from 'sortablejs'
import Map from './map'
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
    Map.getInstance(weatherData)
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
