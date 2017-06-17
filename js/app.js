import ItemsView from './views/items-view'
import ErrorView from './views/error-view'

const items = document.querySelector('.cities-all')

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
    items.innerHTML = ''
    items.appendChild(ErrorView())
  }

  static showItems () {
    items.innerHTML = ''
    items.appendChild(ItemsView(weatherData))
  }
}
