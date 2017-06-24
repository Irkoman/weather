import Model from './model'
import MapView from './views/map-view'
import ListView from './views/list-view'
import ErrorView from './views/error-view'
import {
  enableSortable,
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

let model

export default class App {
  static set data (data) {
    model = Model.getInstance(data)
  }

  static checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
  }

  static showList () {
    model.sort()
    render(listAll, ListView(model.state.items))
    enableSortable()
  }

  static showListSelected () {
    model.filter()
    MapView.getInstance().disableIrrelevantMarkers(model.state.selectedItems)
    render(listSelected, ListView(model.state.selectedItems))
    enableSortable()
  }

  static showMap () {
    MapView.getInstance(model.state.items)
  }

  static showError () {
    render(listAll, ErrorView())
  }

  static clearError () {
    let errorMessage = container.querySelector('.error-message')

    if (errorMessage) {
      errorMessage.parentNode.removeChild(errorMessage)
    }
  }

  static bindHandlers () {
    sortAscButton.addEventListener('click', () => {
      model.setSort('asc')
      App.showList()
    })

    sortDescButton.addEventListener('click', () => {
      model.setSort('desc')
      App.showList()
    })

    searchInput.addEventListener('input', (e) => {
      model.setSearch(e.target.value)
      App.showList()
    })

    filters.forEach((filter) => {
      filter.addEventListener('click', (e) => {
        let renderedItems = Array.from(listSelected.querySelectorAll('.list-item'))
        let dataItems = model.state.data.filter((item) => (findElementByCoordinates(renderedItems, item.location.lng, item.location.lat)))

        if (e.target.checked) {
          model.addFilter(e.target.value)
        } else {
          model.removeFilter(e.target.value)
        }

        model.setSelectedItems(dataItems)
        App.showListSelected()
      })
    })
  }

  static resetSortParams () {
    searchInput.value = ''
    sortAscButton.checked = true
    sortDescButton.checked = false
    model.resetSort()
    App.clearError()
    App.showList()
  }

  static resetFilterParams () {
    model.resetFilters()
    App.clearError()
    MapView.getInstance().enableMarkers()

    filters.forEach((filter) => {
      filter.checked = false
    })
  }

  static toggleItemHighlight (lng, lat) {
    const items = Array.from(document.querySelectorAll('.list-item'))
    const element = findElementByCoordinates(items, lng, lat)

    if (element) {
      element.classList.toggle('list-item-highlight')
    }
  }
}
