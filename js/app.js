import Model from './model'
import MapView from './views/map-view'
import ListView from './views/list-view'
import ErrorView from './views/error-view'
import { enableSortable } from './helpers/sort-helper'
import { convertElementToItem, convertTemperature } from './helpers/convert-helper'

const container = document.getElementById('layout')
const sortControls = container.querySelector('.layout-col-1 .cities-filters')
const filterControls = container.querySelector('.layout-col-2 .cities-filters')
const searchInput = container.querySelector('.cities-filters-name')
const scaleInputs = container.querySelectorAll('input[name="cities-scale"]')
const sortInputs = container.querySelectorAll('input[name="cities-sort"]')
const filters = container.querySelectorAll('input[name="cities-features"]')
const listAll = container.querySelector('.cities-all')
const listSelected = container.querySelector('.cities-selected')

const render = (parent, element) => {
  parent.innerHTML = ''
  parent.appendChild(element)
}

let url
let model

export default class App {
  static set data (data) {
    model = Model.getInstance(data)
  }

  static set url (srcUrl) {
    url = srcUrl
  }

  static checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    }

    throw new Error(`${response.status}: ${response.statusText}`)
  }

  static showList () {
    model.sort()
    render(listAll, ListView(model.state.items))
    App.highlightSearchText()
    enableSortable()
  }

  static showListSelected () {
    model.filter()
    App.disableFiltersIfEmpty()
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

  static clearError (container) {
    let errorMessage = container.querySelector('.error-message')

    if (errorMessage) {
      errorMessage.parentNode.removeChild(errorMessage)
    }
  }

  static bindHandlers () {
    searchInput.value = model.state.search

    searchInput.addEventListener('input', (e) => {
      model.setSearch(e.target.value)
      App.storeIntoParams()
      App.showList()
    })

    scaleInputs.forEach((input) => {
      input.checked = (input.value === model.state.scale)

      input.addEventListener('click', (e) => {
        let scaleType = e.target.value

        if (model.state.scale !== scaleType) {
          model.setScale(scaleType)
          model = new Model(convertTemperature(model.state.data, model.state.scale), model.state)
          App.storeIntoParams()
          App.showList()

          if (model.state.selectedItems.length) {
            App.showListSelected()
          }
        }
      })
    })

    sortInputs.forEach((input) => {
      input.checked = (input.value === model.state.sort)

      input.addEventListener('click', (e) => {
        model.setSort(e.target.value)
        App.storeIntoParams()
        App.showList()
      })
    })

    filters.forEach((filter) => {
      filter.addEventListener('click', (e) => {
        if (e.target.checked) {
          model.addFilter(e.target.value)
        } else {
          model.removeFilter(e.target.value)
        }

        App.storeIntoParams()
        App.showListSelected()
      })
    })
  }

  static handleSelection (element) {
    let item = convertElementToItem(model.state.data, element)

    if (item) {
      model.addSelectedItem(item)
    }
  }

  static disableSortIfEmpty () {
    if (model.state.items.length <= 0) {
      sortControls.classList.add('disabled')
      searchInput.disabled = true

      sortInputs.forEach((input) => {
        input.disabled = true
      })
    } else {
      sortControls.classList.remove('disabled')
      searchInput.disabled = false

      sortInputs.forEach((input) => {
        input.disabled = false
      })
    }
  }

  static disableFiltersIfEmpty () {
    if (model.state.selectedItems <= 0) {
      filterControls.classList.add('disabled')

      filters.forEach((filter) => {
        filter.disabled = true
      })
    } else {
      filterControls.classList.remove('disabled')

      filters.forEach((filter) => {
        filter.disabled = false
      })
    }
  }

  static resetSortParams () {
    searchInput.value = ''
    model.resetSort()
    App.clearError(listAll)
    App.storeIntoParams()
    App.showList()
  }

  static resetFilterParams () {
    model.resetFilters()
    App.clearError(listSelected)
    MapView.getInstance().enableMarkers()

    filters.forEach((filter) => {
      filter.checked = false
    })
  }

  static highlightItem (lng, lat) {
    let renderedItems = Array.from(container.querySelectorAll('.list-item'))
    let element = renderedItems.find((item) => {
      return (item.getAttribute('data-lng') === lng) && (item.getAttribute('data-lat') === lat)
    })

    if (element) {
      element.classList.toggle('list-item-highlight')
    }
  }

  static highlightSearchText () {
    if (model.state.items.length && model.state.search.length) {
      let excludeTagsExp = new RegExp('>(.*?)<', 'gi')
      let searchExp = new RegExp(model.state.search, 'gi')

      listAll.innerHTML = listAll.innerHTML.replace(excludeTagsExp, (match) => {
        return match.replace(searchExp, (exactMatch) => {
          return `<span class="text-highlighted">${exactMatch}</span>`
        })
      })
    }
  }

  static storeIntoParams () {
    url.query.sort = model.state.sort
    url.query.scale = model.state.scale
    url.query.search = model.state.search
    window.history.pushState(null, null, url)
  }

  static restoreFromParams () {
    for (let key in url.query) {
      switch (key) {
        case 'scale':
          model.setScale(url.query.scale)
          break
        case 'sort':
          model.setSort(url.query.sort)
          break
        case 'search':
          model.setSearch(url.query.search)
          break
      }
    }

    App.showList()
  }
}
