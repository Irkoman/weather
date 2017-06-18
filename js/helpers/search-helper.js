export function findElementByCoordinates (array, lng, lat) {
  return array.find((el) =>
    (el.getAttribute('data-lng') === lng) && (el.getAttribute('data-lat') === lat)
  )
}
