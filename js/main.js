import App from './app'
import polyfillPromise from 'core-js/es6/promise'
import 'whatwg-fetch'

if (!window.Promise) {
  window.Promise = polyfillPromise
}

window.fetch('data/data.json')
    .then((response) => App.checkStatus(response))
    .then((response) => response.json())
    .then((data) => {
      App.data = data
    })
    .then(App.showList)
    .then(App.showMap)
    .catch(App.showError)
