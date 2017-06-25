import App from './app'
import polyfillPromise from 'core-js/es6/promise'
import { convertTemperature } from './helpers/sort-helper'
import 'whatwg-fetch'

if (!window.Promise) {
  window.Promise = polyfillPromise
}

window.fetch('data/data.json')
    .then((response) => App.checkStatus(response))
    .then((response) => response.json())
    .then((data) => {
      let scale = localStorage.getItem('scale')
      App.data = (scale === 'fahrenheit') ? convertTemperature(data, scale) : data
    })
    .then(App.showList)
    .then(App.showMap)
    .then(App.bindHandlers)
    .catch(App.showError)
