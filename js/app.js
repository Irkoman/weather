import MapView from './views/map-view'
import ListView from './views/list-view'
import ErrorView from './views/error-view'
import {
  enableSortable,
  sortAlphabetically,
  sortBySearchValue,
  filterByFeatures,
  findElementByCoordinates
} from './helpers/sort-helper'

const container = document.getElementById('layout')
const sortAscButton = document.getElementById('cities-sort-asc')
const sortDescButton = document.getElementById('cities-sort-desc')
const searchInput = container.querySelector('.cities-filters-name')
const filters = container.querySelectorAll('input[name="cities-features"]')
const listAll = container.querySelector('.cities-all')
const listSelected = container.querySelector('.cities-selected')

const render = (parent, element) => {
  parent.innerHTML = ''
  parent.appendChild(element)
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
    render(listAll, ErrorView())
  }

  static showList () {
    render(listAll, ListView(weatherData))
    enableSortable()
  }

  static showMap () {
    MapView.getInstance(weatherData)
  }

  static bindHandlers () {
    sortAscButton.addEventListener('click', () => {
      let sortedItems = sortAlphabetically(weatherData)

      render(listAll, ListView(sortedItems))
      enableSortable()
    })

    sortDescButton.addEventListener('click', () => {
      let sortedItems = sortAlphabetically(weatherData).reverse()

      render(listAll, ListView(sortedItems))
      enableSortable()
    })

    searchInput.addEventListener('input', (e) => {
      let sortedItems = sortBySearchValue(weatherData, e.target.value)

      render(listAll, ListView(sortedItems))
      enableSortable()
    })

    /*
     * Полный сюр. Большей хаотичности ему добавляет то,
     * что features в данных хранятся как эмоджи,
     * а не "sun", "snow", "rain" и т. д., что было бы логичней
     */
    filters.forEach((filter) => {
      filter.addEventListener('click', (e) => {
        let renderedItems = Array.from(listSelected.querySelectorAll('.list-item'))
        let dataItems = weatherData.filter((item) => (findElementByCoordinates(renderedItems, item.location.lng, item.location.lat)))
        let filteredItems = filterByFeatures(dataItems, e.target.value, e.target.checked)

        render(listSelected, ListView(filteredItems))
        enableSortable()
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
