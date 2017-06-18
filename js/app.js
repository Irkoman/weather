import Map from './map'
import ListView from './views/list-view'
import ErrorView from './views/error-view'
import {
  enableSortable,
  sortAlphabetically,
  sortBySearchValue,
  findElementByCoordinates
} from './helpers/sort-helper'

const container = document.querySelector('.cities-all')
const sortAscButton = document.getElementById('cities-sort-asc')
const sortDescButton = document.getElementById('cities-sort-desc')
const searchInput = document.getElementById('cities-search')

const render = (element) => {
  container.innerHTML = ''
  container.appendChild(element)
}

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
    render(ErrorView())
  }

  static showList () {
    render(ListView(weatherData))
    enableSortable()
  }

  static showMap () {
    Map.getInstance(weatherData)
  }

  static bindHandlers () {
    sortAscButton.addEventListener('click', () => {
      let sortedData = sortAlphabetically(weatherData)

      render(ListView(sortedData))
      enableSortable()
    })

    sortDescButton.addEventListener('click', () => {
      let sortedData = sortAlphabetically(weatherData).reverse()

      render(ListView(sortedData))
      enableSortable()
    })

    searchInput.addEventListener('input', (e) => {
      let sortedData = sortBySearchValue(weatherData, e.target.value)

      render(ListView(sortedData))
      enableSortable()
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
