import Sortable from 'sortablejs'
import App from '../app'

const FILTERS = {
  'sun': '☀️',
  'snow': '❄️',
  'rain': '💧',
  'wind': '🌬',
  'meteor': '☄️',
  'cloud': '🌥'
}

export function enableSortable () {
  let list = document.getElementById('list')
  let listSelected = document.getElementById('list-selected')

  if (list) {
    Sortable.create(list, {
      group: 'cities',
      handle: '.list-item-handle',
      draggable: '.list-item',
      animation: 100
    })
  }

  if (listSelected) {
    Sortable.create(listSelected, {
      group: 'cities',
      handle: '.list-item-handle',
      draggable: '.list-item',
      animation: 100,
      onAdd: (e) => {
        App.handleSelection(e.item)
        App.disableFiltersIfEmpty()
      }
    })
  }
}

export function sortAlphabetically (array, sortType) {
  let sortedArray = array.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }

    if (a.name > b.name) {
      return 1
    }

    return 0
  })

  switch (sortType) {
    case 'desc':
      return sortedArray.reverse()
    case 'asc':
    default:
      return sortedArray
  }
}

export function sortBySearchValue (array, value) {
  let regExp = new RegExp(value, 'i')

  return array.filter((item) => (regExp.test(item.name)))
}

export function filterByFeature (array, feature) {
  let regExp = new RegExp(FILTERS[feature], 'i')

  return array.filter((item) => (regExp.test(item.features.join(' '))))
}

export function convertElementToItem (items, element) {
  return items.find((item) =>
    (element.getAttribute('data-lng') === item.location.lng) &&
    (element.getAttribute('data-lat') === item.location.lat)
  )
}

export function convertTemperature (array, scaleType) {
  array.forEach((item) => {
    if (item.weather) {
      let temperature = +item.weather.replace(/\D+/g, '')

      if (scaleType === 'celsius') {
        item.weather = Math.round((temperature - 32) * 5 / 9) + '°C'
      } else {
        item.weather = Math.round(temperature * 9 / 5 + 32) + '°F'
      }
    }
  })

  return array
}
