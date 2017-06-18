import Sortable from 'sortablejs'

export function enableSortable () {
  let list = document.getElementById('list')
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

export function sortAlphabetically (array) {
  return array.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }

    if (a.name > b.name) {
      return 1
    }

    return 0
  })
}

export function sortBySearchValue (array, value) {
  let regExp = new RegExp(value, 'i')

  return array.filter((item) => (regExp.test(item.name)))
}

export function findElementByCoordinates (array, lng, lat) {
  return array.find((el) =>
    (el.getAttribute('data-lng') === lng) && (el.getAttribute('data-lat') === lat)
  )
}
