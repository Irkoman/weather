export function convertElementToItem (items, element) {
  return items.find((item) =>
    (element.getAttribute('data-lng') === item.location.lng) &&
    (element.getAttribute('data-lat') === item.location.lat)
  )
}

export function convertTemperature (array, scaleType) {
  let currentScale
  let convertedArray = array.slice()

  convertedArray.forEach((item) => {
    if (item.weather) {
      let temperature = +item.weather.replace(/\D+/g, '')

      currentScale = item.weather.indexOf('°C') ? 'celsius' : 'fahrenheit'

      if (scaleType === 'celsius') {
        item.weather = Math.round((temperature - 32) * 5 / 9) + '°C'
      } else {
        item.weather = Math.round(temperature * 9 / 5 + 32) + '°F'
      }
    }
  })

  if (currentScale === scaleType) {
    return array
  }

  return convertedArray
}
