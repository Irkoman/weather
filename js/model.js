import {
  sortAlphabetically,
  sortBySearchValue,
  filterByFeature
} from './helpers/sort-helper'

const initialState = {
  data: [],
  items: [],
  selectedItems: [],
  sort: 'asc',
  search: '',
  filters: []
}

export default class Model {
  constructor (data, state = initialState) {
    this._instance = null
    this._state = state
    this._state.data = data
    this._state.items = data
  }

  get state () {
    return this._state
  }

  static getInstance (data = [], state = initialState) {
    if (!this._instance) {
      this._instance = new Model(data, state)
    }

    return this._instance
  }

  setSelectedItems (array) {
    this._state.selectedItems = array
  }

  setSort (sortType) {
    this._state.sort = sortType
  }

  setSearch (searchValue) {
    this._state.search = searchValue
  }

  addFilter (filter) {
    this._state.filters.push(filter)
  }

  removeFilter (filter) {
    let index = this._state.filters.indexOf(filter)

    if (index !== -1) {
      return this._state.filters.splice(index, 1)
    }
  }

  sort () {
    this._state.items = sortAlphabetically(this._state.items, this._state.sort)
    this._state.items = sortBySearchValue(this._state.items, this._state.search)
  }

  filter () {
    this._state.filters.forEach((filter) => {
      this._state.selectedItems = filterByFeature(this._state.selectedItems, filter)
    })
  }

  resetSort () {
    this._state.sort = 'asc'
    this._state.search = ''
    this._state.items = this._state.data
  }

  resetFilters () {
    this._state.filters = []
  }
}
