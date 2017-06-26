import Url from 'domurl'
import App from './app'
import polyfillPromise from 'core-js/es6/promise'
import { convertTemperature } from './helpers/convert-helper'
import 'whatwg-fetch'

const URL = new Url()

if (!window.Promise) {
  window.Promise = polyfillPromise
}

window.fetch('data/data.json')
    .then((response) => App.checkStatus(response))
    .then((response) => response.json())
    .then((data) => {
      let scale = URL.query.scale || localStorage.getItem('scale') || 'celsius'
      App.data = (scale === 'celsius') ? data : convertTemperature(data, scale)
      App.url = URL
    })
    .then(App.restoreFromParams)
    .then(App.disableSortIfEmpty)
    .then(App.disableFiltersIfEmpty)
    .then(App.showMap)
    .then(App.bindHandlers)
    .catch(App.showError)

window.addEventListener('popstate', App.restoreFromParams)
